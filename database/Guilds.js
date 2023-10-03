let mongoose = require("mongoose");

var guildSchema = mongoose.Schema({
  id: { type: String },
  description: {
    type: String,
    default: "Não sabemos muito sobre esse servidor!",
  },
  rep: {
    recomendo: { type: Number, default: 0 },
  },
  newMember: {
    message: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      topic: { type: Array, default: [] },
      type: { type: String, default: "" },
    },
    channel: { type: String, default: "" },
    status: { type: String, default: "disabled" },
  },
  badges: { type: Array, default: [] },
  language: { type: String, default: "pt-BR" },
});

module.exports = mongoose.model("Guild", guildSchema, "guild");
