const mongoose = require("mongoose");
var mongoSchema = mongoose.Schema;
var userSchema = new mongoSchema(
  {
    name: { type: String },
    mobilenumber: { type: String },
    email: { type: String }
  },
  {
    timestamps: true
  }
);
function usermodel() {}
var user = mongoose.model("user", userSchema);

usermodel.prototype.saveInfo = async (req, callback) => {
  await user.find({ email: req.body.email }, async (err, data) => {
    if (err) {
      return callback(err);
    } else if (data.length > 0) {
      response = {
        error: true,
        message: "Email already exists ",
        errorCode: 404
      };
      return callback(response);
    } else {
      const newUser = new user({
        name: req.body.name,
        mobilenumber: req.body.mobilenumber,
        email: req.body.email
      });
      await newUser.save((err, result) => {
        if (err) {
          return callback(err);
        } else {
          return callback(null, result);
        }
      });
    }
  });
};
usermodel.prototype.home = async (req, callback) => {
 
  await user.find({ _id: req.body.id }, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};
module.exports = new usermodel();
