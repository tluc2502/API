const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'tluc2502@gmail.com',
      pass: 'dijs pvqw psrd dtyr'
    }
  });

module.exports = { transporter };
