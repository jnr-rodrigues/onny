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
    interaction.deferReply();
    await wait(1500);
    interaction.editReply({
      content: `⏱️**P-Pong!** Sua latência é: ${(
        Date.now() -
        (interaction.createdTimestamp + 1500)
      )
        .toString()
        .replace("-", "")}ms.`,
    });
  },
};
