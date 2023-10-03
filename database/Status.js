const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  id: { type: String },
  timestamp: { type: Date, default: Date.now },
  ping: { type: Number },
});

module.exports = mongoose.model("Status", statusSchema, "status");
