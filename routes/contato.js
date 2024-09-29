require
const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const transporter = require('../config/mail');

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('imagemRecebida'), async (req, res) => {
  const { nome, email, opcao, assunto, mensagem } = req.body;
  const arquivo = req.file ? req.file.filename : null;

  
  if (!nome || !email || !mensagem) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  try {
   
    const novoContato = await prisma.contato.create({
      data: {
        nome,
        email,
        opcao,
        assunto,
        mensagem,
        arquivo: String(arquivo)
      },
    });

    // Configurar e enviar e-mail
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Confirmação de recebimento',
      text: `Olá ${nome},\n\nObrigado por entrar em contato conosco.\n\n\n\nAtenciosamente,\nEquipe de Suporte.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Erro ao enviar e-mail.');
        }
        console.log('E-mail enviado: ' + info.response);
        res.send("Formulário enviado com sucesso! E-mail de confirmação enviado.");
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao salvar os dados.');
  }
});

module.exports = router;
