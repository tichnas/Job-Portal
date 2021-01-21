const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (to, subject, text) =>
  transport.sendMail({
    from: '"Sanchit" <dominodevelopers@outlook.com>',
    to,
    subject,
    text,
  });

module.exports = sendMail;
