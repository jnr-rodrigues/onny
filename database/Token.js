const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  accessToken: String,
  expirationTime: Date,
  userData: {
    avatarURL: String,
    username: String,
    id: String,
  },
});

module.exports = mongoose.model("Token", tokenSchema, "token");
