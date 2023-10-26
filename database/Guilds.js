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
      title: { type: String, default: "Bem-vindo(a), ao {server}!" },
      description: {
        type: String,
        default:
          "Olá {user}! Tudo bom? Seja bem-vindo(a) ao servidor. Divirta-se!",
      },
      topic: { type: Array, default: [] },
      type: { type: String, default: "text" },
    },
    channel: { type: String, default: "" },
    status: { type: String, default: "disabled" },
  },
  badges: { type: Array, default: [] },
  language: { type: String, default: "pt-BR" },
  changes: { type: Array, default: [] },
});

module.exports = mongoose.model("Guild", guildSchema, "guild");
