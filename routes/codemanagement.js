const express = require("express");
const router = express.Router();

router.get("/usuario", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token_codemanagement", token);
  res.sendFile(__dirname + "/html/parceiros/codemanagement/usuario.html");
});

router.get("/auth/discord", async (req, res) => {
  res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=994328390540738570&redirect_uri=https%3A%2F%2Fonny.discloud.app%2Fcodemanagement%2Fusuario&response_type=token&scope=guilds%20identify"
  );
});

let collectedMessage = [];

router.post("/api/onny/partners/codemanagement/returns", (req, res) => {
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

router.delete("/api/onny/partners/codemanagement/returns", (req, res) => {
  const targetUser = req.query.user;
  const targetApp = req.query.app;

  collectedMessage = collectedMessage.filter((message) => {
    return !(message.user === targetUser && message.app === targetApp);
  });
});

router.get("/api/onny/partners/codemanagement/returns", (req, res) => {
  if (collectedMessage) {
    res.json(collectedMessage);
  } else {
    const data = {
      content: "Aguardando mensagem da Code Management...",
    };
    res.json(data);
  }
});

router.get("/dashboard/:app", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token", token);
  res.sendFile(__dirname + "/html/parceiros/codemanagement/app.html");
});

router.get("/app/:application", async (req, res) => {
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

router.get("/api/onny/partners/codemanagement", async (req, res) => {
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

router.get("/expired", async (req, res) => {
  res.sendFile(__dirname + "/html/parceiros/codemanagement/expired.html");
});

module.exports = router;
