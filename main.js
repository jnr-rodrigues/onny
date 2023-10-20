// Importação de módulos
const express = require("express"); // Importa o módulo 'express' para criar o servidor web
const mongoose = require("mongoose"); // Importa o módulo 'mongoose' para interagir com o banco de dados MongoDB
const path = require("path"); // Importa o módulo 'path' para lidar com caminhos de arquivo
const fs = require("fs"); // Importa o módulo 'fs' para lidar com operações de arquivo
const app = express(); // Cria uma instância do servidor web usando o Express
const axios = require("axios"); // Importa o módulo 'axios' para fazer solicitações HTTP
const crypto = require("crypto"); // Importa o módulo 'crypto' para operações de criptografia
const discloud = require("discloud.app"); // Importa o módulo 'discloud.app' para alguma funcionalidade específica

// Importação de módulos personalizados
const Applications = require("./database/Applications"); // Importa o módulo 'Applications' de um arquivo personalizado
const Users = require("./database/Users"); // Importa o módulo 'Users' de um arquivo personalizado
const Guilds = require("./database/Guilds"); // Importa o módulo 'Guilds' de um arquivo personalizado
const config = require("./config.json"); // Importa as configurações do arquivo 'config.json'

// Configuração de middleware e do servidor
app.use(express.static(__dirname)); // Configura o servidor para servir arquivos estáticos na pasta atual
app.use(express.urlencoded({ extended: true })); // Configura o servidor para lidar com dados codificados de formulário
app.use(express.json()); // Configura o servidor para lidar com dados no formato JSON

// Estabelecimento da conexão com o banco de dados MongoDB
mongoose
  .connect(
    `mongodb+srv://${config.mongoose.user}:${config.mongoose.password}@cluster0.xedqrgo.mongodb.net/`,
    {
      useNewUrlParser: true, // Opção para usar o novo analisador de URL (necessária para versões mais recentes do MongoDB)
      useUnifiedTopology: true, // Opção para usar a nova camada de gerenciamento de conexão (necessária para versões mais recentes do MongoDB)
    }
  )
  .then(() => {
    console.log("[Onny] Conexão com o banco de dados realizada com sucesso!"); // Imprime uma mensagem de sucesso na conexão
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error); // Em caso de erro, imprime uma mensagem de erro no console
  });

// Rotas e manipulação de requisições
app.get("/auth/discord", (req, res) => {
  // Redireciona o usuário para a página de autorização do Discord
  //res.redirect(`https://discord.com/api/oauth2/authorize?client_id=1013882148513661009&redirect_uri=https%3A%2F%2Fonny.discloud.app%2F&response_type=token&scope=identify%20guilds`);
  // Outro redirecionamento para desenvolvimento local (comentado)
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=1013882148513661009&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=token&scope=identify%20guilds`
  );
});

app.get("/", async (req, res) => {
  // Responde com o arquivo HTML da página inicial
  res.sendFile(__dirname + "/html/onny/index.html");
});

app.get("/usuario", async (req, res) => {
  const token = req.query.access_token;
  // Define um cookie com o token de acesso
  res.cookie("access_token", token);
  // Responde com o arquivo HTML da página do usuário
  res.sendFile(__dirname + "/html/onny/usuario.html");
});

app.get("/pathnotes", async (req, res) => {
  // Responde com o arquivo HTML da página das pathnotes
  res.sendFile(__dirname + "/html/onny/pathnotes.html");
});

app.get("/leaderboard", async (req, res) => {
  // Responde com o arquivo HTML da página da leaderboard
  res.sendFile(__dirname + "/html/onny/leaderboard.html");
});

app.get("/profile/:id", async (req, res) => {
  // Responda com o arquivo HTML da página de perfil
  res.sendFile(__dirname + "/html/onny/profile.html");
});

app.get("/profile", async (req, res) => {
  // Responda com o arquivo HTML da página de perfil
  res.sendFile(__dirname + "/html/onny/profile.html");
});

app.get("/block", async (req, res) => {
  // Responda com o arquivo HTML da página de perfil
  res.sendFile(__dirname + "/html/onny/denied.html");
});

app.post("/app/:application", (req, res) => {
  const applicationRedirect = req.params.application;
  // Redireciona o usuário para a rota correspondente ao aplicativo
  res.redirect(`/app/${applicationRedirect}`);
});

app.get("/app/:application", async (req, res) => {
  const applicationSearch = req.params.application;

  try {
    // Tenta encontrar aplicativos no banco de dados com base no ID fornecido
    const apps = await Applications.find({ id: applicationSearch });

    if (!apps || apps.length === 0) {
      return res.json("NOT_FOUND");
    }

    // Responde com os aplicativos encontrados em formato JSON
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
  // Define um cookie com o token de acesso
  res.cookie("access_token", token);
  // Responde com o arquivo HTML da página do painel de controle do aplicativo
  res.sendFile(__dirname + "/html/onny/app.html");
});

app.get("/servidor/:server", async (req, res) => {
  const token = req.query.access_token;
  res.cookie("access_token", token);
  // Responde com o arquivo HTML da página do servidor
  res.sendFile(__dirname + "/html/onny/server.html");
});

app.post("/apps/:owner", (req, res) => {
  const ownerRedirect = req.params.owner;
  // Redireciona o usuário para a rota correspondente ao proprietário de aplicativo
  res.redirect(`/apps/${ownerRedirect}`);
});

app.get("/apps/:owner", async (req, res) => {
  const ownerSearch = req.params.owner;

  try {
    // Tenta encontrar aplicativos no banco de dados
    const apps = await Applications.find({});

    if (!apps || apps.length === 0) {
      return res.json("NOT_FOUND");
    }

    // Responde com os aplicativos encontrados em formato JSON
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
  // Redireciona o usuário para a rota correspondente ao usuário
  res.redirect(`/apps/users/${userRedirect}`);
});

app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  Users.find({ id: userId })
    .then(async (user) => {
      if (user[0]) {
        const infos = await UserInfos(userId);
        // Responde com informações do usuário em formato JSON
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
  // Redireciona o usuário para a rota de classificação do jogo Onny
  res.redirect(`/api/onny/leaderboard`);
});

const UserInfos = require("./onny");
app.get("/api/onny/leaderboard", async (req, res) => {
  try {
    // Tenta buscar todos os usuários e classificá-los por onnycoins
    const users = await Users.find({}).sort({ onnycoins: -1 });

    if (users.length > 0) {
      // Responde com a classificação de usuários em formato JSON
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

  // Armazena os dados recebidos em collectedData
  collectedData = data;
  res.json({ message: "Dados recebidos com sucesso!" });
});

app.get("/api/onny", (req, res) => {
  if (collectedData) {
    // Responde com os dados coletados em formato JSON
    res.json(collectedData);
  } else {
    // Responde com um status offline caso não haja dados coletados
    const data = {
      status: "offline",
    };
    res.json(data);
  }
});

app.post("/api/usuario/:id", (req, res) => {
  const userRedirect = req.params.id;
  // Redireciona o usuário para a rota correspondente ao usuário
  res.redirect(`/api/usuario/${userRedirect}`);
});

app.get("/api/usuario/:id", async (req, res) => {
  const userId = req.params.id;

  await Users.find({ id: userId })
    .then(async (user) => {
      if (user[0]) {
        const UserInfos = require("./onny");
        let user = await UserInfos(userId);
        // Responde com informações do usuário em formato JSON
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
  // Redireciona o usuário para a rota correspondente ao banco de dados do servidor
  res.redirect(`/guild/database/${guildRedirect}`);
});

app.get("/api/guild/database/:id", async (req, res) => {
  const guildId = req.params.id;

  await Guilds.find({ id: guildId })
    .then(async (guild) => {
      if (guild[0]) {
        // Responde com informações do banco de dados do servidor em formato JSON
        res.json(guild);
      } else {
        // Cria uma entrada no banco de dados do servidor se não existir
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

      // Atualiza o banco de dados do servidor com os dados fornecidos
      const result = await Guilds.findOneAndUpdate({ id: id }, updateObj);
      res.json(result);
    } catch (error) {
      console.error(error);
      // Responde com um status 500 e uma mensagem de erro em caso de falha na atualização
      res
        .status(500)
        .json({ error: "Erro ao atualizar o " + caminho + " do guild." });
    }
  }
});

const cron = require("node-cron");
let previousLeaderboard = null;
let leaderboardChanges = []; // Array para armazenar as mudanças

// Função para fazer backup dos dados
const performBackup = async () => {
  try {
    // Realize uma solicitação para a sua API de leaderboard para obter os dados
    const response = await axios.get(
      "https://onny.discloud.app/api/onny/leaderboard"
    );

    // Salve os dados de backup em um arquivo JSON
    const currentLeaderboard = response.data;
    fs.writeFileSync(
      "leaderboardBackup.json",
      JSON.stringify(currentLeaderboard, null, 2)
    );

    // Compare os dados atuais com os dados anteriores (se não for o primeiro backup)
    if (previousLeaderboard) {
      // Implemente a lógica de comparação aqui, detectando mudanças de classificação
      const changes = [];

      for (let i = 0; i < currentLeaderboard.length; i++) {
        const currentUserData = currentLeaderboard[i];

        if (currentUserData) {
          const userId = currentUserData.id;

          // Encontre o usuário na base de dados anterior
          const previousUserData = previousLeaderboard.find(
            (user) => user.id === userId
          );

          // Determine a posição atual
          const currentPosition = i;

          if (previousUserData) {
            // Compare as posições para determinar o número na lista anterior
            const previousPosition = previousLeaderboard.findIndex(
              (user) => user.id === userId
            );

            const changeInfo = { ...currentUserData };
            changeInfo.anteriorPosition = previousPosition;
            changeInfo.atualPosition = currentPosition;
            changes.push(changeInfo);
          } else {
            // O usuário não estava na base anterior
            const changeInfo = { ...currentUserData };
            changeInfo.anteriorPosition = currentPosition; // Define a posição anterior como a atual
            changeInfo.atualPosition = currentPosition;
            changes.push(changeInfo);
          }
        }
      }

      // Se houver mudanças, adicione-as ao array leaderboardChanges
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

// Agende o backup para ser executado a cada hora (à 0 minutos de cada hora)
cron.schedule("0 * * * *", performBackup);

setTimeout(() => {
  performBackup().then(async () => {
    setTimeout(() => {
      performBackup();
    }, 10000);
  });
}, 30000);

// Rota para exibir as mudanças no leaderboard
app.get("/api/onny/leaderboard/generated", (req, res) => {
  if (leaderboardChanges.length > 0) {
    res.json(leaderboardChanges[leaderboardChanges.length - 1]);
  } else {
    res.json([]);
  }
});

app.get("/expired", async (req, res) => {
  // Responde com o arquivo HTML da página de expiração
  res.sendFile(__dirname + "/html/onny/expired.html");
});

app.get("/insupported", async (req, res) => {
  // Responde com o arquivo HTML da página de não suportado
  res.sendFile(__dirname + "/html/onny/insupported.html");
});

// Configuração da rota para lidar com a página de erro 404
app.get("/404", (req, res) => {
  res.sendFile(__dirname + "/html/404.html");
});

// Middleware para lidar com todas as outras rotas não definidas
app.use((req, res) => {
  // Define o status da resposta como 404 (não encontrado) e envia a página de erro 404
  res.status(404).sendFile(__dirname + "/html/404.html");
});

// Inicia o servidor na porta 8080
app.listen(8080, () => {
  console.log(`[Onny] Servidor iniciado e dashboard disponível.`);
});

// Importa as classes ShardingManager e Client do módulo "discord.js"
const { ShardingManager, Client } = require("discord.js");

// Cria uma instância de ShardingManager, passando o arquivo "onny.js" como script de shard e o token de autenticação do Discord
const manager = new ShardingManager("onny.js", { token: config.token });

// Define um ouvinte de eventos para quando uma shard for criada
manager.on("shardCreate", async (shard) => {
  // Exibe uma mensagem no console indicando que uma aplicação está sendo iniciada em uma shard específica
  console.log(`[Shard] Aplicação está sendo iniciada no shard #${shard.id}.`);

  // Define um ouvinte de eventos para lidar com erros na shard
  shard.on("error", (error) => {
    console.error(error);
  });
});

// Inicia o processo de spawn de shards
manager.spawn();
