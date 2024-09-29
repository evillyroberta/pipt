require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
//const db = require('./config/db');
const contatoRoutes = require('./routes/contato');

const app = express();
const PORT = 3000;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/upload', upload.single('arquivo'), (req, res) => {
  res.send('Arquivo enviado com sucesso!');
});

app.use('/contato', contatoRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});