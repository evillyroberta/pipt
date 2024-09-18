require('dotenv').config();
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, './public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });


const db = new sqlite3.Database('./contato.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});


db.run(`
  CREATE TABLE IF NOT EXISTS contato (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    opcao TEXT,
    assunto TEXT,
    mensagem TEXT,
    arquivo TEXT
  )
`);

let transporter = nodemailer.createTransport({
  
  service: 'gmail', 
  secure: true,
  auth: {
    user: process.env.EMAIL, 
    pass: "gcve dkdn dwsi oxzx"  
  }
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/contato', upload.single('imagemRecebida'), (req, res) => {
  const { nome, email, opcao, assunto, mensagem } = req.body;
  const arquivo = req.file ? req.file.filename : null;

 
  db.run(
    `INSERT INTO contato (nome, email, opcao, assunto, mensagem, arquivo) VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, email, opcao, assunto, mensagem, arquivo],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Erro ao salvar os dados.');
      }

      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Confirmação de recebimento `,
        text: `Olá ${nome},\n\n Obrigado por entrar em contato conosco.\n\nMensagem:\n\n\nAtenciosamente,\nEquipe de Suporte.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Erro ao enviar e-mail.');
        }
        console.log('E-mail enviado: ' + info.response);
        res.send('Formulário enviado com sucesso! E-mail de confirmação enviado.');
      });
    }
  );
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
