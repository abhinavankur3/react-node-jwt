const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullname: String,
    username: {
      type: String,
      unique: true,
    },
    email: String,
    password: String,
  })
);

module.exports = User;
