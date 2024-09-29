/*const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../contato', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

db.run(`CREATE TABLE IF NOT EXISTS contato (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    opcao TEXT,
    assunto TEXT,
    mensagem TEXT,
    arquivo TEXT
)`);

module.exports = db;
*/