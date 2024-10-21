const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const app = express();
const axios = require("axios");
const crypto = require("crypto");

const Applications = require("./database/Applications");
const Users = require("./database/Users");
const Guilds = require("./database/Guilds");
const config = require("./config.json");

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { userInfos, sendChannelsToServer } = require("./onny.js");

mongoose
  .connect(
    `mongodb+srv://${config.mongoose.user}:${config.mongoose.password}@cluster0.xedqrgo.mongodb.net/`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("[Onny] Conexão com o banco de dados realizada com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

app.get("/auth/discord", (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=1013882148513661009&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=token&scope=identify%20guilds`);
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/index.html");
});

app.get("/usuario", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token", token);
  res.sendFile(__dirname + "/html/onny/usuario.html");
});

app.get("/pathnotes", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/pathnotes.html");
});

app.get("/leaderboard", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/leaderboard.html");
});

app.get("/profile/:id", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/profile.html");
});

app.get("/profile", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/profile.html");
});

app.get("/block", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/denied.html");
});

app.post("/app/:application", (req, res) => {
  const applicationRedirect = req.params.application;
  res.redirect(`/app/${applicationRedirect}`);
});

app.get("/app/:application", async (req, res) => {
  const applicationSearch = req.params.application;

  try {
    const apps = await Applications.find({ id: applicationSearch });

    if (!apps || apps.length === 0) {
      return res.json("NOT_FOUND");
    }

    const jsonBuild = apps.map((app) => ({
      ...app.toJSON(),
      type: app.owner === applicationSearch ? "owner" : "admin",
    }));

    res.json(jsonBuild);
  } catch (error) {
    console.error("Erro ao buscar aplicativos:", error);
    res.status(500).send("Erro ao buscar aplicativos.");
  }
});

app.get("/dashboard/:app", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token", token);
  res.sendFile(__dirname + "/html/onny/app.html");
});

app.get("/servidor/:server", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token", token);
  res.sendFile(__dirname + "/html/onny/server.html");
});

app.post("/apps/:owner", (req, res) => {
  const ownerRedirect = req.params.owner;
  res.redirect(`/apps/${ownerRedirect}`);
});

app.get("/apps/:owner", async (req, res) => {
  const ownerSearch = req.params.owner;

  try {
    const apps = await Applications.find({});

    if (!apps || apps.length === 0) {
      return res.json("NOT_FOUND");
    }

    const jsonBuild = apps.map((app) => ({
      ...app.toJSON(),
      type: app.owner === ownerSearch ? "owner" : "admin",
    }));

    res.json(jsonBuild);
  } catch (error) {
    console.error("Erro ao buscar aplicativos:", error);
    res.status(500).send("Erro ao buscar aplicativos.");
  }
});

app.post("/api/users/:id", (req, res) => {
  const userRedirect = req.params.id;
  res.redirect(`/apps/users/${userRedirect}`);
});

app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  Users.find({ id: userId })
    .then(async (user) => {
      if (user[0]) {
        const infos = await userInfos(userId);
        const jsonBuild = user.map((u) => ({
          ...u.toJSON(),
          userInformations: infos !== "NOT_INFOS_FOUND" ? infos : "not_found",
        }));

        res.json(jsonBuild);
      } else {
        res.json({ status: "none" });
      }
    })
    .catch((error) => {
      console.error("Erro ao consultar o banco de dados:", error);
      res.status(500).json({ error: "Erro ao consultar o banco de dados" });
    });
});

app.post("/api/onny/leaderboard", (req, res) => {
  res.redirect(`/api/onny/leaderboard`);
});

app.get("/api/onny/leaderboard", async (req, res) => {
  try {
    const users = await Users.find({}).sort({ onnycoins: -1 });

    if (users.length > 0) {
      const jsonBuild = await Promise.all(
        users.map(async (user) => {
          const infos = await userInfos(user.id);
          return {
            ...user.toJSON(),
            userInformations: infos !== "NOT_INFOS_FOUND" ? infos : "not_found",
          };
        })
      );

      res.json(jsonBuild);
    } else {
      res.json({ status: "none" });
    }
  } catch (error) {
    console.error("Erro ao consultar o banco de dados:", error);
    res.status(500).json({ error: "Erro ao consultar o banco de dados" });
  }
});

let collectedData = null;
app.post("/api/onny", (req, res) => {
  const data = req.body;

  collectedData = data;
  res.json({ message: "Dados recebidos com sucesso!" });
});

app.get("/api/onny", (req, res) => {
  if (collectedData) {
    res.json(collectedData);
  } else {
    const data = {
      status: "offline",
    };
    res.json(data);
  }
});

const collectedGuildData = {};
app.post("/api/onny/guild/:id", (req, res) => {
  const serverID = req.params.id;
  const data = req.body;

  collectedGuildData[serverID] = data;
  res.json({ message: "SEND" });
});

app.get("/api/onny/guild/:id", async (req, res) => {
  const serverID = req.params.id;

  await sendChannelsToServer(serverID);

  if (collectedGuildData[serverID]) {
    res.json(collectedGuildData[serverID]);
  } else {
    const data = {
      message: "NOT_FOUND",
    };
    res.json(data);
  }
});

app.post("/api/usuario/:id", (req, res) => {
  const userRedirect = req.params.id;
  res.redirect(`/api/usuario/${userRedirect}`);
});

app.get("/api/usuario/:id", async (req, res) => {
  const userId = req.params.id;

  await Users.find({ id: userId })
    .then(async (user) => {
      if (user[0]) {
        let user = await userInfos(userId);
        res.json(user);
      } else {
        res.json({ status: "none" });
      }
    })
    .catch((error) => {
      console.error("Erro ao consultar o banco de dados:", error);
      res.status(500).json({ error: "Erro ao consultar o banco de dados" });
    });
});

app.post("/api/guild/database/:id", (req, res) => {
  const guildRedirect = req.params.id;
  res.redirect(`/guild/database/${guildRedirect}`);
});

app.get("/api/guild/database/:id", async (req, res) => {
  const guildId = req.params.id;

  await Guilds.find({ id: guildId })
    .then(async (guild) => {
      if (guild[0]) {
        res.json(guild);
      } else {
        await Guilds.create({ id: guildId });
        await Guilds.find({ id: guildId }).then(async (guild) => {
          if (guild[0]) {
            res.json(guild);
          }
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao consultar o banco de dados:", error);
      res.status(500).json({ error: "Erro ao consultar o banco de dados" });
    });
});

app.post("/api/onny/database/update/:type", async (req, res) => {
  const { type } = req.params;
  const { id, caminho, value } = req.body;

  if (type === "guilds") {
    try {
      const guild = await Guilds.findOne({ id: id });

      if (guild && guild[caminho] !== value) {
        const updateObj = {};
        updateObj[caminho] = value;

        const result = await Guilds.findOneAndUpdate({ id: id }, updateObj);

        if (result) {
          res.json({ success: true });
        } else {
          res.json({ success: false });
        }
      } else {
        res.json({ message: `Valor ${caminho} não foi alterado.` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "Erro ao atualizar o " + caminho + " do guild.",
      });
    }
  }
});

app.post("/api/onny/database/insert/:type", async (req, res) => {
  const { type } = req.params;
  const { id, logsCaminho, logValue } = req.body;

  if (type === "guilds") {
    try {
      const updateObj = { $push: { [logsCaminho]: logValue } };

      const result = await Guilds.findOneAndUpdate({ id: id }, updateObj);

      if (result) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro ao inserir no " + logsCaminho + " do guild." });
    }
  }
});

app.get("/api/onny/database/get/guilds/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const guildData = await Guilds.findOne({ id: id });

    if (guildData) {
      res.json(guildData);
    } else {
      res.status(404).json({ error: "Servidor não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar os dados do servidor" });
  }
});

const cron = require("node-cron");
let previousLeaderboard = null;
let leaderboardChanges = [];

const performBackup = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/onny/leaderboard"
    );

    const currentLeaderboard = response.data;
    fs.writeFileSync(
      "leaderboardBackup.json",
      JSON.stringify(currentLeaderboard, null, 2)
    );

    if (previousLeaderboard) {
      const changes = [];

      for (let i = 0; i < currentLeaderboard.length; i++) {
        const currentUserData = currentLeaderboard[i];

        if (currentUserData) {
          const userId = currentUserData.id;

          const previousUserData = previousLeaderboard.find(
            (user) => user.id === userId
          );

          const currentPosition = i;

          if (previousUserData) {
            const previousPosition = previousLeaderboard.findIndex(
              (user) => user.id === userId
            );

            const changeInfo = { ...currentUserData };
            changeInfo.anteriorPosition = previousPosition;
            changeInfo.atualPosition = currentPosition;
            changes.push(changeInfo);
          } else {
            const changeInfo = { ...currentUserData };
            changeInfo.anteriorPosition = currentPosition;
            changeInfo.atualPosition = currentPosition;
            changes.push(changeInfo);
          }
        }
      }

      if (changes.length > 0) {
        leaderboardChanges.push(changes);
        console.log("[Leaderboard] Alteração detectada!");
      }
    }

    previousLeaderboard = currentLeaderboard;

    console.log(
      "[Leaderboard] Backup #" + Date.now() + " realizado com sucesso."
    );
  } catch (error) {
    console.error("Erro ao fazer backup dos dados:", error);
  }
};

cron.schedule("0 * * * *", performBackup);

setTimeout(() => {
  performBackup().then(async () => {
    setTimeout(() => {
      performBackup();
    }, 10000);
  });
}, 30000);

app.get("/api/onny/leaderboard/generated", (req, res) => {
  if (leaderboardChanges.length > 0) {
    res.json(leaderboardChanges[leaderboardChanges.length - 1]);
  } else {
    res.json([]);
  }
});

app.get("/expired", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/expired.html");
});

app.get("/insupported", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/insupported.html");
});

app.get("/404", (req, res) => {
  res.sendFile(__dirname + "/html/404.html");
});

app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/html/404.html");
});

app.listen(8080, () => {
  console.log(`[Onny] Servidor iniciado e dashboard disponível.`);
});

const { ShardingManager, Client } = require("discord.js");

const manager = new ShardingManager("onny.js", { token: config.token });
manager.on("shardCreate", async (shard) => {
  console.log(`[Shard] Aplicação está sendo iniciada no shard #${shard.id}.`);

  shard.on("error", (error) => {
    console.error(error);
  });
});

manager.spawn();
