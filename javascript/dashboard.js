const fragment = new URLSearchParams(window.location.hash.slice(1));
const accessToken = fragment.get("access_token");

if (accessToken) {
  localStorage.setItem("access_token", accessToken);
}

function getAccessToken() {
  const storedAccessToken = localStorage.getItem("access_token");
  return storedAccessToken;
}

function isLoggedIn() {
  return getAccessToken() !== null;
}

function abreviarNumero(numero) {
  const abreviacoes = [
    { valor: 1e3, sufixo: "K" },
    { valor: 1e6, sufixo: "M" },
    { valor: 1e9, sufixo: "B" },
    { valor: 1e12, sufixo: "T" },
  ];

  for (let i = abreviacoes.length - 1; i >= 0; i--) {
    const abreviacao = abreviacoes[i];
    if (numero >= abreviacao.valor) {
      return (
        (numero / abreviacao.valor).toFixed(1) +
        abreviacao.sufixo
      );
    }
  }

  return numero.toString();
}

function getTitle(title) {
  if (title == "USUARIO") {
    return "Usuário da Onny"
  } else if (title == "DEVELOPER") {
    return "Desenvolvedor(a) da Onny"
  }
}

if (isLoggedIn()) {
  const secretsUser = `Bearer ${getAccessToken()}`;

  fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: secretsUser,
    },
  })
    .then((result) => result.json())
    .then(async (response) => {
      function infoUser() {
        const { global_name, discriminator, avatar, id } = response;
        if (!global_name || global_name === "undefined") {
          window.location.href = "/expired";
          return;
        }
        document.getElementById("userId").innerText = `${id}`;

        fetch(`/api/users/${id}`)
          .then((response) => response.json())
          .then(async (data) => {
            document.getElementById("avatarUserProfile").src =
              data[0].userInformations.avatarURL;
            document.getElementById("usernameUserProfile").textContent =
              data[0].userInformations.username;
            if (data[0].profile.banners.equipped == "ONNY") {
              var element = document.getElementById("progressBarFill");
              element.style.background =
                "linear-gradient(135deg, #ff1b6b 0%, #45caff 100%)";
              document.getElementById("bannerUserProfile").style.background =
                "url('/themes/onny/banner.jpg') center / cover no-repeat";
            } else if (data[0].profile.banners.equipped == "CYBERPUNK") {
              var element = document.getElementById("progressBarFill");
              element.style.background =
                "linear-gradient(135deg, #1FFDF0 0%, #FD471E 100%)";
              document.getElementById("bannerUserProfile").style.background =
                "url('/themes/cyberpunk/banner.jpg') center / cover no-repeat";
            } else if (data[0].profile.banners.equipped == "PADRAO") {
              var element = document.getElementById("progressBarFill");
              element.style.background = "#E94F4D";
              document.getElementById(
                "bannerUserProfile"
              ).style.backgroundColor = "#2b2d31";
            }

            document.getElementById(
              "titleUserProfile"
            ).textContent = `${getTitle(data[0].profile.titles.equipped)}`;

            document.getElementById(
              "sobremimUserProfile"
            ).textContent = `${data[0].description}`;

            let totalOnnycoins = 0;
            await fetch("/api/onny/leaderboard")
              .then((response) => response.json())
              .then((data) => {
                if (data.length > 0) {
                  data.forEach((user) => {
                    totalOnnycoins += user.onnycoins;
                  });
                }
              });

            document.getElementById(
              "coinsUserProfile"
            ).textContent = `${abreviarNumero(data[0].onnycoins)}`;

            const percentUserProfile = (
              (data[0].onnycoins * 100) /
              totalOnnycoins
            ).toFixed(2);
            document.getElementById(
              "percentUserProfile"
            ).textContent = `Dono(a) de ${percentUserProfile}% da economia.`;

            document.getElementById(
              "cashUserProfile"
            ).textContent = `${abreviarNumero(data[0].onnycash)}`;

            document.getElementById("userExp").innerText = data[0].exp.xp;
            document.getElementById("separator").innerText = "/";
            document.getElementById("levelExp").innerText =
              data[0].exp.nivel * 2000;
            document.getElementById(
              "userLevel"
            ).innerText = `Atualmente está no nível ${data[0].exp.nivel}!`;

            setTimeout(() => {
              document.getElementById("userProfileLocal").style.display =
                "block";
              document.getElementById("loadDiv").style.display = "none";
            }, 1500);
          })
          .then(() => {
            function updateProgressBar(currentValue, totalValue) {
              const fillElement = document.querySelector(".progress-bar-fill");
              const progressBarFill =
                document.querySelector(".progress-bar-fill");
              const percentage = Math.floor((currentValue / totalValue) * 100);

              progressBarFill.style.width = `${percentage}%`;
              progressBarFill.style.transition = "width 1s ease-in-out";

              const currentValueSpan = document.querySelector(".current-value");
              const percentageSpan = document.querySelector(".percentage");

              const percentageElement =
                document.getElementById("percentageLevel");
              currentValueSpan.textContent = currentValue;
              const fillPercentage = percentage;
              const displayPercentage = isNaN(fillPercentage)
                ? "0"
                : fillPercentage;
              percentageElement.textContent = `(${displayPercentage}%)`;
              fillElement.style.setProperty(
                "--fill-percentage",
                `${displayPercentage}%`
              );
              fillElement.style.setProperty(
                "--animation-end-percentage",
                `${displayPercentage}%`
              );
            }

            const ExpElement = document.getElementById("userExp");
            const Exp = ExpElement.textContent.trim();

            const totalExpElement = document.getElementById("levelExp");
            const totalExp = totalExpElement.textContent.trim();

            updateProgressBar(Exp, totalExp);
          });
      }

      function loadApps() {
        const appContainer = document.getElementById("allApps");
        const ownerElement = document.getElementById("userId");
        const owner = ownerElement.textContent.trim();

        fetch(`/apps/${owner}`)
          .then((response) => response.json())
          .then((data) => {
            const loadingIcon = document.getElementById("loadingIcon");
            loadingIcon.style.display = "none";

            if (data === "NOT_FOUND") {
              let app = document.createElement("div");
              app.id = "1013882148513661009";
              app.className = "server-item";

              let appLink = document.createElement("a");
              appLink.href =
                "https://discord.com/oauth2/authorize?client_id=1013882148513661009&scope=bot&permissions=27648860222&redirect_uri=https%3A%2F%2Fonny.discloud.app%2F";
              appLink.style.textDecoration = "none";
              appLink.style.display = "block";

              let appContent = document.createElement("div");
              appContent.className = "server-content";

              let appImage = document.createElement("img");
              appImage.src =
                '../icons/planos/onny.png';
              appImage.className = "server-image";

              let appInfo = document.createElement("div");
              appInfo.className = "server-info";

              let appName = document.createElement("h4");
              appName.className = "server-name";
              appName.style.textAlign = "left";
              appName.style.whiteSpace = "nowrap";
              appName.style.overflow = "hidden";
              appName.style.textOverflow = "ellipsis";
              appName.textContent = "Onny";

              let descApp = document.createElement("p");
              descApp.style.textAlign = "left";
              descApp.className = "server-description";
              descApp.textContent = "Adicione-me ao seu servidor!";

              appInfo.appendChild(appName);
              appInfo.appendChild(descApp);

              appContent.appendChild(appImage);
              appContent.appendChild(appInfo);

              appLink.appendChild(appContent);
              app.appendChild(appLink);

              let noHasApp = document.createElement("h4");
              noHasApp.style.textAlign = "left";
              noHasApp.className = "server-description";
              noHasApp.style.marginTop = "-10px";
              noHasApp.textContent =
                "Ahn... parece que você não tem nenhum aplicativo. Mas não fique triste!";

              appContainer.append(noHasApp, app);
            } else {
              for (let i = 0; i < data.length; i++) {
                let app = document.createElement("div");
                app.id = data[i].id;
                app.className = "server-item";
                app.style.animation = "popIn 0.5s";
                if (data[i].type == "owner") {
                  app.style.backgroundImage =
                    'url("https://cdn.discordapp.com/attachments/1039517691242877008/1127627745975861278/c2a50b856ba93cddb14655e8fb55dcde.png")';
                } else {
                  app.style.backgroundColor = "#1E1F22";
                }

                let appLink = document.createElement("a");
                appLink.href = `/dashboard/${data[i].id}`;
                appLink.style.textDecoration = "none";
                appLink.style.display = "block";

                let appContent = document.createElement("div");
                appContent.className = "server-content";

                let appImage = document.createElement("img");
                appImage.src = data[i].icon;
                appImage.className = "server-image";

                let appInfo = document.createElement("div");
                appInfo.className = "server-info";

                let appName = document.createElement("h4");
                appName.className = "server-name";
                appName.style.textAlign = "left";
                appName.style.whiteSpace = "nowrap";
                appName.style.overflow = "hidden";
                appName.style.textOverflow = "ellipsis";
                if (data[i].type == "owner") {
                  appName.style.color = "#000000";
                  appName.style.fontWeight = "bold";
                } else {
                  appName.className = "w3-text-white";
                }
                appName.textContent = data[i].name;

                let descApp = document.createElement("p");
                descApp.style.textAlign = "left";
                descApp.className = "server-description";
                descApp.className = "w3-text-grey";
                if (data[i].type == "owner") {
                  descApp.className = "w3-text-black";
                } else {
                  descApp.className = "w3-text-grey";
                }
                descApp.textContent = `com ${abreviarNumero(
                  data[i].users
                )} usuários`;

                appInfo.appendChild(appName);
                appInfo.appendChild(descApp);

                appContent.appendChild(appImage);
                appContent.appendChild(appInfo);

                appLink.appendChild(appContent);
                app.appendChild(appLink);
                appContainer.appendChild(app);

                document.getElementById(
                  `${data[i].id}`
                ).href = `/dashboard/${data[i].id}`;
              }
            }
          });
      }

      await infoUser();
      await loadApps();
    });

  fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      authorization: secretsUser,
    },
  })
    .then((result) => result.json())
    .then(async (data) => {
      const guildContainer = document.getElementById("allGuilds");

      async function loadGuild() {
        const loadingIconGuilds = document.getElementById("loadingIconGuilds");
        loadingIconGuilds.style.display = "none";

        for (let i = 0; i < data.length; i++) {
          let guild = document.createElement("div");
          guild.id = data[i].id;
          guild.className = "server-item";

          let guildLink = document.createElement("a");
          guildLink.href = `/servidor/${data[i].id}`;
          guildLink.style.textDecoration = "none";
          guildLink.style.display = "block";

          let guildContent = document.createElement("div");
          guildContent.className = "server-content";

          let imgGuild = "";
          if (!data[i].icon) {
            imgGuild =
              "../icons/social_media/discord.png";
          } else {
            imgGuild = `https://cdn.discordapp.com/icons/${data[i].id}/${data[i].icon}.png`;
          }

          let guildImage = document.createElement("img");
          guildImage.src = imgGuild;
          guildImage.className = "server-image";

          let guildInfo = document.createElement("div");
          guildInfo.className = "server-info";

          let guildName = document.createElement("h4");
          guildName.className = "server-name";
          guildName.style.textAlign = "left";
          guildName.textContent = data[i].name;

          let descGuild = document.createElement("p");
          descGuild.style.textAlign = "left";
          descGuild.className = "server-description";

          function hasAdministratorPermission(permissionNumber) {
            const ADMINISTRATOR_PERMISSION = 8;

            return (permissionNumber & ADMINISTRATOR_PERMISSION) !== 0;
          }

          const isAdmin = hasAdministratorPermission(data[i].permissions);

          if (data[i].owner == true) {
            guildName.style.whiteSpace = "nowrap";
            guildName.style.overflow = "hidden";
            guildName.style.textOverflow = "ellipsis";
            guildName.textContent = data[i].name;
            descGuild.textContent = `A posse deste servidor é sua!`;
          } else if (isAdmin) {
            guildName.style.whiteSpace = "nowrap";
            guildName.style.overflow = "hidden";
            guildName.style.textOverflow = "ellipsis";
            guildName.textContent = data[i].name;
            descGuild.textContent = `Você é administrador!`;
          } else {
            guildName.style.overflow = "hidden";
            guild.style.opacity = "0.3";
            guildName.style.textOverflow = "ellipsis";
            guildLink.style.pointerEvents = "none";
            guildLink.style.cursor = "not-allowed";
            guildName.textContent = data[i].name;
          }

          guildInfo.appendChild(guildName);
          guildInfo.appendChild(descGuild);

          guildContent.appendChild(guildImage);
          guildContent.appendChild(guildInfo);

          guildLink.appendChild(guildContent);
          guild.appendChild(guildLink);
          guildContainer.appendChild(guild);
        }
      }

      document.getElementById(
        "guildsDescTitle"
      ).innerText = `Aqui deve ter bastante gente legal! Você está em ${data.length} servidores no Discord atualmente. Tenho aqui uma lista com eles...`;

      await loadGuild();
    });
} else {
  setTimeout(() => {
    window.location.href = "/auth/discord";
  }, 500);
}
