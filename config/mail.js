const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: "gcve dkdn dwsi oxzx"
  }
});

module.exports = transporter;
