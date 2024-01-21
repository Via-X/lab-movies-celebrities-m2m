const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mvia2000@gmail.com",
    pass: process.env.GENERATED_PASSWORD,
  },
});


module.exports = transporter;