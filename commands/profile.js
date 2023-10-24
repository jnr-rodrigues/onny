const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const moment = require("moment");
moment.updateLocale("pt-br");

module.exports = {
  cooldown: 5, // Tempo de espera necessário entre o uso do comando (em segundos)
  data: new SlashCommandBuilder()
    .setName("profile") // Define o nome do comando
    .setDescription("Profile! Confira suas informações na Onny."), // Descrição do comando
  async execute(interaction) {
    await interaction.deferReply(); // Deferir a resposta inicial para evitar o tempo limite de resposta
    await interaction.editReply({
      content: `Clique [aqui](https://onny.discloud.app/profile/${interaction.user.id}) para acessar seu perfil.`,
    });
  },
};
