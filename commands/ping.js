const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const moment = require("moment");
moment.updateLocale("pt-br");

module.exports = {
  cooldown: 5,  // Tempo de espera necessário entre o uso do comando (em segundos)
  data: new SlashCommandBuilder()
    .setName("ping")  // Define o nome do comando
    .setDescription("Pong! Saiba mais sobre sua latência."),  // Descrição do comando
  async execute(interaction) {
    interaction.deferReply();  // Deferir a resposta inicial para evitar o tempo limite de resposta

    await wait(1500);  // Espera por 1500 milissegundos (1,5 segundos) simulando um atraso

    // Calcula a latência do bot em relação ao servidor
    const latency = Date.now() - (interaction.createdTimestamp + 1500);

    interaction.editReply({
      content: `⏱️**P-Pong!** Sua latência é: ${Math.abs(latency)}ms.`,  // Exibe a latência em uma resposta editada
    });
  },
};
