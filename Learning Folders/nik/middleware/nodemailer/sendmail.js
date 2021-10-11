require("dotenv").config();
var nodemailer = require("nodemailer");
exports.sendEMailFunction = (url, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: "Ismayil",
    to: email,
    subject: "Invitation",
    text: "Open this link to join my WhatsApp Group:" + url
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent bro: ", info);
    }
  });
};
