const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PW,
  },
});

const sendEmail = (data) => {
  const mailOptions = data;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent successfully. Info:${JSON.stringify(info)}`);
    }
  });
};

module.exports = { sendEmail };