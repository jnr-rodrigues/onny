const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const moment = require("moment");
moment.updateLocale("pt-br");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Profile! Confira suas informações na Onny."), 
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.editReply({
      content: `Clique [aqui](http://localhost:8080/profile/${interaction.user.id}) para acessar seu perfil.`,
    });
  },
};
