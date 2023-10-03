const { client } = require("discord.js");
async function sendBotInfoToServer() {
  try {
    const ping = client.ws.ping;

    const data = {
      bot: client.user.username,
      id: client.user.id,
      status: "online",
      timestamp: new Date().toISOString(),
      guildCount: client.guilds.cache.size,
      totalUsers: client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      ),
      ping,
    };

    const response = await fetch("https://onny.discloud.app/api/onny", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {}
}

sendBotInfoToServer();
setInterval(sendBotInfoToServer, 5 * 60 * 1000);

async function userInfos(userId) {
  try {
    let infos = await client.users.fetch(userId);
    return infos;
  } catch (error) {
    return "NOT_INFOS_FOUND";
  }
}
module.exports = userInfos;
