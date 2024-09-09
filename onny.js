const {
  REST,
  Routes,
  Client,
  Collection,
  Events,
  Partials,
  GatewayIntentBits,
} = require("discord.js");
const config = require("./config.json"); // Importa as configurações do bot

const moment = require("moment"); // Importa a biblioteca 'moment' para formatação de datas
moment.locale("pt-br"); // Define a localização da biblioteca 'moment' como 'pt-br' (português brasileiro)

const mongoose = require("mongoose"); // Importa a biblioteca 'mongoose' para interação com o MongoDB
const express = require("express"); // Importa o framework 'express' para criação do servidor web
const app = express(); // Inicializa uma instância do Express
const router = express.Router(); // Cria um roteador Express

const client = new Client({
  intents: [
    // Define as intenções do bot para a API de gateway do Discord
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  shards: "auto", // Configura o número de shards automaticamente
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember,
  ],
});

const fs = require("node:fs"); // Importa o módulo 'fs' para manipulação de arquivos
const path = require("node:path"); // Importa o módulo 'path' para manipulação de caminhos de arquivos
const Users = require("./database/Users"); // Importa o módulo 'Users' para interagir com o banco de dados de usuários

const commands = []; // Cria um array vazio chamado 'commands' para armazenar comandos
const commandsPath = path.join(__dirname, "commands"); // Obtém o caminho absoluto para a pasta de comandos
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js")); // Lê os arquivos na pasta de comandos e filtra os que têm extensão '.js'

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file); // Obtém o caminho completo para o arquivo de comando
  const command = require(filePath); // Importa o comando do arquivo
  commands.push(command.data.toJSON()); // Adiciona os dados do comando ao array 'commands'
}

const rest = new REST({ version: "10" }).setToken(config.token); // Inicializa o objeto REST para interagir com a API do Discord

(async () => {
  try {
    await rest.put(Routes.applicationCommands("1013882148513661009"), {
      body: commands, // Registra os comandos do bot na API do Discord
    });
  } catch (error) {}
})();

client.commands = new Collection(); // Inicializa uma coleção para armazenar os comandos
client.cooldowns = new Collection(); // Inicializa uma coleção para gerenciar os cooldowns dos comandos

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file); // Obtém o caminho completo para o arquivo de comando
  const command = require(filePath); // Importa o comando do arquivo
  client.commands.set(command.data.name, command); // Adiciona o comando à coleção 'client.commands' usando o nome do comando como chave
}

client.once(Events.ClientReady, () => {
  console.log("[Onny] Todas as extensões do sistema foram iniciadas."); // Exibe uma mensagem quando o cliente Discord estiver pronto
  const guildsCount = client.guilds.cache; // Obtém a lista de guildas em cache
  const users = guildsCount.reduce((acc, guild) => acc + guild.memberCount, 0); // Calcula o número total de membros em todas as guildas
  client.user.setActivity(`com ${users.toLocaleString()} pessoas!`); // Define a atividade do bot mostrando o número de usuários nas guildas
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // Verifica se a interação é um comando de chat
  const command = client.commands.get(interaction.commandName);
  if (!command) return; // Verifica se o comando existe

  const { cooldowns } = client;
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3; // Duração padrão do cooldown (em segundos)
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000; // Converte o cooldown em milissegundos

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      return interaction.reply({
        content: `**Espera um pouco!** Você usou esse comando recentemente. Espere <t:${expiredTimestamp}:R> para usá-lo novamente...`,
        ephemeral: true, // Resposta visível apenas para o usuário que executou o comando
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  try {
    console.log(
      `[Command] [${moment().format()}] (${interaction.user.id}) ${
        interaction.user.username
      } executou "${interaction}".`
    );
    await command.execute(interaction); // Executa o comando solicitado
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "**Oops!** Ocorreu um problema ao usar o comando.",
      ephemeral: true,
    });
  }
});

async function sendBotInfoToServer() {
  try {
    const ping = client.ws.ping; // Obtém o ping do WebSocket do cliente Discord

    const data = {
      bot: client.user.username, // Nome do bot
      id: client.user.id, // ID do bot
      status: "online", // Status online
      timestamp: new Date().toISOString(), // Timestamp atual em formato ISO
      guildCount: client.guilds.cache.size, // Número de guildas em cache
      guilds: Array.from(client.guilds.cache.keys()), // Lista de IDs de guildas em cache
      totalUsers: client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      ), // Total de usuários em todas as guildas
      ping, // Ping do WebSocket
    };

    const response = await fetch("http://localhost:8080/api/onny", {
      method: "POST", // Envia uma requisição POST para a URL especificada
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Envia os dados no formato JSON
    });
  } catch (error) {
    console.error("Erro ao enviar informações para o servidor:", error);
  }
}

const fetch = require("node-fetch"); // Certifique-se de importar o módulo 'node-fetch'

async function getChannels(serverID) {
  try {
    const server = await client.guilds.fetch(serverID);
    const channels = server.channels.cache;

    const channelData = channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
    }));

    return channelData;
  } catch (error) {
    console.error("Erro ao obter canais:", error);
    return [];
  }
}

async function sendChannelsToServer(serverID) {
  try {
    const channels = await getChannels(serverID);

    const data = {
      channels,
    };

    const url = `http://localhost:8080/api/onny/guild/${serverID}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 200) {
      console.error(
        "Erro ao enviar canais para o servidor. Status:",
        response.status
      );
    }
  } catch (error) {
    console.error("Erro ao enviar canais para o servidor:", error);
  }
}

client.once("ready", async () => {
  await sendBotInfoToServer(); // Envia informações para o servidor assim que o bot estiver pronto
  setInterval(sendBotInfoToServer, 30000); // Define um intervalo para enviar informações periodicamente
});

async function userInfos(userId) {
  try {
    let infos = await client.users.fetch(userId); // Obtém informações de um usuário pelo ID
    return infos;
  } catch (error) {
    return "ERROR";
  }
}
// Exporta a função userInfos para uso em outros módulos
module.exports = {
  userInfos: userInfos,
  sendChannelsToServer: sendChannelsToServer,
};
client.login(config.token);
