const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const moment = require("moment");
moment.updateLocale("pt-br");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong! Saiba mais sobre sua latência."),
  async execute(interaction) {
    await interaction.deferReply();
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.editReply({
      content: `⏱️**P-Pong!** Sua latência é: ${Math.abs(latency)}ms.`,
    });
  },
};
