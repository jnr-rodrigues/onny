const {
  REST,
  Routes,
  Client,
  Collection,
  Events,
  Partials,
  GatewayIntentBits,
} = require("discord.js");
const config = require("./config.json");

const moment = require("moment");
moment.locale("pt-br");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const router = express.Router();

const client = new Client({
  intents: [
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
  shards: "auto",
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

const fs = require("node:fs");
const path = require("node:path");
const Users = require("./database/Users");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    await rest.put(Routes.applicationCommands("1013882148513661009"), {
      body: commands,
    });
  } catch (error) {}
})();

client.commands = new Collection();
client.cooldowns = new Collection();

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
  console.log("[Onny] Todas as extensões do sistema foram iniciadas.");
  const guildsCount = client.guilds.cache;
  const users = guildsCount.reduce((acc, guild) => acc + guild.memberCount, 0);
  client.user.setActivity(`com ${users.toLocaleString()} pessoas!`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.id !== "994328390540738570") return;
  if (message.channel.id === "1137878017025249383") {
    const parts = message.content.split(" ");
    const usuario = parts[0];
    const application = parts[1];
    const msg = parts.slice(2).join(" ");
    const data = {
      user: usuario,
      app: application,
      content: msg,
    };

    const response = await fetch(
      `https://onny.discloud.app/api/onny/partners/codemanagement/returns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const { cooldowns } = client;
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      return interaction.reply({
        content: `**Espera um pouco!** Você usou o esse comando recentemente. Espere <t:${expiredTimestamp}:R> para usa-lo novamente...`,
        ephemeral: true,
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
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "**Oops!** Ocorreu um problema no uso do comando.",
      ephemeral: true,
    });
  }
});

async function sendBotInfoToServer() {
  try {
    const ping = client.ws.ping;

    const data = {
      bot: client.user.username,
      id: client.user.id,
      status: "online",
      timestamp: new Date().toISOString(),
      guildCount: client.guilds.cache.size,
      guilds: Array.from(client.guilds.cache.keys()),
      totalUsers: client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      ),
      ping,
    };

    const response = await fetch("https://onny.discloud.app/api/onny", {
    //const response = await fetch("http://localhost:8080/api/onny", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Erro ao enviar informações para o servidor:", error);
  }
}

client.once("ready", async () => {
  await sendBotInfoToServer();
  setInterval(sendBotInfoToServer, 30000);
});

async function EXEC_ACTION(server, action, appId) {
  let SERVER_ID = "";
  if (server == "CODE_MANAGEMENT")
    SERVER_ID = config.partners.code_management.site_sync;

  try {
    if (
      typeof client !== "undefined" &&
      client.channels &&
      client.channels.cache
    ) {
      client.channels.cache.get(SERVER_ID).send({
        content: `${action} ${appId}`,
      });
    } else {
      console.log(
        'O objeto "client" não está disponível. Certifique-se de que ele seja definido antes de usar a função EXEC_ACTION.'
      );
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = EXEC_ACTION;

async function userInfos(userId) {
  try {
    let infos = await client.users.fetch(userId);
    return infos;
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error.message);
    return "NOT_INFOS_FOUND";
  }
}
module.exports = userInfos;

client.login(config.token);
