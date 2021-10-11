var userService = require("../service/userService");
var sendmail = require("../nodemailer/sendmail");
module.exports.saveInfo = (req, res) => {
  userService.saveInfo(req, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err
      });
    } else {
      // const url = `https://chat.whatsapp.com/HoWPH2EH1KpDMxBkZtetrk`;
      // sendmail.sendEMailFunction(url, req.body.email);
      res.status(200).send({
        success: true,
        message: "User registered sucessfully",
        data: data
      });
    }
  });
};
module.exports.home = (req, res) => {
  userService.home(req, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Login Done",
        data: data
      });
    }
  });
};
