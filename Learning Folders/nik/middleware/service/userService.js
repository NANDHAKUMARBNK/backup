var userModel = require("../app/model/userModel");
exports.saveInfo = (req, callback) => {
  userModel.saveInfo(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};
exports.home = (req, callback) => {
  userModel.home(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};
