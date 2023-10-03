const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const app = express();
const axios = require("axios");
const crypto = require("crypto");
const discloud = require("discloud.app");

const Applications = require("./database/Applications");
const Users = require("./database/Users");
const Guilds = require("./database/Guilds");
const config = require("./config.json");

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Conexão com o banco de dados: */

mongoose
  .connect(
    "mongodb+srv://" +
      config.mongoose.user +
      ":" +
      config.mongoose.password +
      "@cluster0.xedqrgo.mongodb.net/",
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

/** Onny & API's */

app.get("/auth/discord", (req, res) => {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=1013882148513661009&redirect_uri=https%3A%2F%2Fonny.discloud.app%2F&response_type=token&scope=identify%20guilds`
  );
  //res.redirect(`https://discord.com/api/oauth2/authorize?client_id=1013882148513661009&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=token&scope=identify%20guilds`);
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/index.html");
});

app.get("/usuario", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token", token);
  res.sendFile(__dirname + "/html/onny/usuario.html");
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
        const infos = await UserInfos(userId);
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

const UserInfos = require("./onny");
app.get("/api/onny/leaderboard", async (req, res) => {
  try {
    const users = await Users.find({}).sort({ onnycoins: -1 });

    if (users.length > 0) {
      const jsonBuild = await Promise.all(
        users.map(async (user) => {
          const infos = await UserInfos(user.id);
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

app.post("/api/usuario/:id", (req, res) => {
  const userRedirect = req.params.id;
  res.redirect(`/api/usuario/${userRedirect}`);
});

app.get("/api/usuario/:id", async (req, res) => {
  const userId = req.params.id;

  await Users.find({ id: userId })
    .then(async (user) => {
      if (user[0]) {
        const UserInfos = require("./onny");
        let user = await UserInfos(userId);
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
      const updateObj = {};
      updateObj[caminho] = value;

      const result = await Guilds.findOneAndUpdate({ id: id }, updateObj);
      res.json(result);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro ao atualizar o " + caminho + " do guild." });
    }
  }
});

app.get("/expired", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/expired.html");
});

app.get("/insupported", async (req, res) => {
  res.sendFile(__dirname + "/html/onny/insupported.html");
});

/**
 *
 *    PARTNERS WEBSITE REDIRECTS
 *
 */

app.get("/codemanagement/usuario", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token_codemanagement", token);
  res.sendFile(__dirname + "/html/parceiros/codemanagement/usuario.html");
});

app.get("/codemanagement/auth/discord", async (req, res) => {
  //res.redirect("https://discord.com/api/oauth2/authorize?client_id=994328390540738570&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcodemanagement%2Fusuario&response_type=token&scope=identify%20guilds");
  res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=994328390540738570&redirect_uri=https%3A%2F%2Fonny.discloud.app%2Fcodemanagement%2Fusuario&response_type=token&scope=guilds%20identify"
  );
});

let collectedMessage = [];
app.post("/api/onny/partners/codemanagement/returns", (req, res) => {
  const data = req.body;

  const alreadyCollected = collectedMessage.some((item) => {
    return (
      item.user === data.user &&
      item.app === data.app &&
      item.content === data.content
    );
  });

  if (!alreadyCollected) {
    collectedMessage.push(data);
  }

  res.json({ message: "Dados recebidos com sucesso!" });
});

app.delete("/api/onny/partners/codemanagement/returns", (req, res) => {
  const targetUser = req.query.user;
  const targetApp = req.query.app;

  collectedMessage = collectedMessage.filter((message) => {
    return !(message.user === targetUser && message.app === targetApp);
  });
});

app.get("/api/onny/partners/codemanagement/returns", (req, res) => {
  if (collectedMessage) {
    res.json(collectedMessage);
  } else {
    const data = {
      content: "Aguardando mensagem da Code Management...",
    };
    res.json(data);
  }
});

app.get("/codemanagement/dashboard/:app", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token", token);
  res.sendFile(__dirname + "/html/parceiros/codemanagement/app.html");
});

app.get("/codemanagement/app/:application", async (req, res) => {
  const temporaryDBUri =
    "mongodb+srv://codemanagement:rmjSLNJUEPsrITTZ@cluster0.1i7rbxc.mongodb.net/Support?retryWrites=true&w=majority";
  const tempConnection = mongoose.createConnection(temporaryDBUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(
    "[Onny] Uma conexão temporária foi realizada no banco de dados da Code Management."
  );

  const botsSchema = new mongoose.Schema({
    bot: {
      botId: String,
      botName: String,
      botIconURL: String,
      functions: { type: Array, default: [] },
      discloud: {
        timestamp: { type: String, default: "" },
        memoryUse: { type: String, default: "" },
        maxMemory: { type: String, default: "" },
        logs: { type: String, default: "" },
        status: { type: Boolean, default: false },
      },
    },
    owner: {
      ownerId: String,
      ownerName: String,
      ownerIconURL: String,
      date: String,
    },
    date: Number,
  });

  const Bots = tempConnection.model("Bots", botsSchema);

  const applicationSearch = req.params.application;

  try {
    const apps = await Bots.find({ "bot.botId": applicationSearch });

    if (!apps || apps.length === 0) {
      return res.json("NOT_FOUND");
    }

    await res.json(apps);

    tempConnection.close();
    console.log("[Onny] Desconectado do banco de dados da Code Management.");
  } catch (error) {
    console.error("Erro ao buscar aplicativos:", error);
    res.status(500).send("Erro ao buscar aplicativos.");
  }
});

app.get("/api/onny/partners/codemanagement", async (req, res) => {
  const temporaryDBUri =
    "mongodb+srv://codemanagement:rmjSLNJUEPsrITTZ@cluster0.1i7rbxc.mongodb.net/Support?retryWrites=true&w=majority";
  const tempConnection = mongoose.createConnection(temporaryDBUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(
    "[Onny] Uma conexão temporária foi realizada no banco de dados da Code Management."
  );

  const botsSchema = new mongoose.Schema({
    bot: {
      botId: String,
      botName: String,
      botIconURL: String,
      functions: { type: Array, default: [] },
      discloud: {
        timestamp: { type: String, default: "" },
        memoryUse: { type: String, default: "" },
        maxMemory: { type: String, default: "" },
        logs: { type: String, default: "" },
        status: { type: Boolean, default: false },
      },
    },
    owner: {
      ownerId: String,
      ownerName: String,
      ownerIconURL: String,
      date: String,
    },
    date: Number,
  });

  const Bots = tempConnection.model("Bots", botsSchema);

  try {
    const bots = await Bots.find({});
    if (bots) {
      res.json(bots);
    } else {
      const data = {
        status: "offline",
      };
      res.json(data);
    }

    tempConnection.close();
    console.log("[Onny] Desconectado do banco de dados da Code Management.");
  } catch (error) {
    console.error("Erro ao consultar o banco de dados temporário:", error);
    res
      .status(500)
      .json({ error: "Erro ao consultar o banco de dados temporário" });
  }
});

app.get("/codemanagement/expired", async (req, res) => {
  res.sendFile(__dirname + "/html/parceiros/codemanagement/expired.html");
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
