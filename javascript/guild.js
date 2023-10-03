fetch("/api/onny")
  .then((result) => result.json())
  .then(async (response) => {
    const urlParts = window.location.pathname.split("/");
    const idIndex = urlParts.indexOf("servidor") + 1;
    const id = urlParts[idIndex];

    if (!response.guilds.includes(id)) {
      const mainDiv = document.createElement("div");
      mainDiv.id = "onnyNotInServer";

      const innerDiv = document.createElement("div");
      innerDiv.style.backgroundColor = "#1e1f22";
      innerDiv.style.borderRadius = "10px";
      innerDiv.style.padding = "20px";
      innerDiv.style.paddingBottom = "5px";

      const heading = document.createElement("h4");
      heading.id = "usernameInterface";
      heading.style.marginTop = "0px";
      heading.style.display = "inline-block";
      heading.className = "w3-xlarge w3-text-white";
      heading.textContent = "Ah... Por que não estou neste servidor? 😔";

      const description = document.createElement("p");
      description.id = "onnyDescriptionInicialPage";
      description.className = "w3-text-grey";
      description.style.marginTop = "-10px";
      description.style.marginRight = "20px";
      description.style.textAlign = "left";
      description.textContent =
        "Apenas os servidores nos quais estou podem usufruir de configurações exclusivas!";

      const descriptionDiv = document.createElement("div");
      descriptionDiv.id = "descriptionOnny";
      descriptionDiv.appendChild(description);

      const lineBreak = document.createElement("br");

      const returnLink = document.createElement("a");
      returnLink.className = "discord-button discord-link";
      returnLink.href = "/usuario";
      returnLink.textContent = "Retornar para página anterior!";

      innerDiv.appendChild(heading);
      innerDiv.appendChild(descriptionDiv);

      mainDiv.appendChild(innerDiv);

      document.getElementById("onnyIn").appendChild(mainDiv);
      document.getElementById("onnyIn").appendChild(lineBreak);
      document.getElementById("onnyIn").appendChild(returnLink);
    } else {
      const mainDiv = document.createElement("div");
      mainDiv.id = "onnyInServer";

      const innerDiv = document.createElement("div");
      innerDiv.style.backgroundColor = "#1e1f22";
      innerDiv.style.borderRadius = "10px";
      innerDiv.style.padding = "20px";
      innerDiv.style.paddingBottom = "5px";

      const heading = document.createElement("h4");
      heading.id = "usernameInterface";
      heading.style.marginTop = "0px";
      heading.style.display = "inline-block";
      heading.className = "w3-xlarge w3-text-white";
      heading.textContent = "Uhuu! Estou online e roteando neste servidor. 😉";

      const description = document.createElement("p");
      description.id = "onnyDescriptionInicialPage";
      description.className = "w3-text-grey";
      description.style.marginTop = "-10px";
      description.style.marginRight = "20px";
      description.style.textAlign = "left";
      description.textContent =
        "Apenas os servidores nos quais estou podem usufruir de configurações exclusivas!";

      const descriptionDiv = document.createElement("div");
      descriptionDiv.id = "descriptionOnny";
      descriptionDiv.appendChild(description);

      const lineBreak = document.createElement("br");

      const returnLink = document.createElement("a");
      returnLink.className = "discord-button discord-link";
      returnLink.href = "/usuario";
      returnLink.textContent = "Retornar para página anterior!";

      innerDiv.appendChild(heading);
      innerDiv.appendChild(descriptionDiv);

      mainDiv.appendChild(innerDiv);

      document.getElementById("onnyIn").appendChild(mainDiv);
      document.getElementById("onnyIn").appendChild(lineBreak);
      document.getElementById("onnyIn").appendChild(returnLink);
    }
  });

function getAccessToken() {
  const storedAccessToken = localStorage.getItem("access_token");
  return storedAccessToken;
}

function isLoggedIn() {
  return getAccessToken() !== null;
}

if (isLoggedIn()) {
  const secretsUser = `Bearer ${getAccessToken()}`;
  fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      authorization: secretsUser,
    },
  })
    .then((result) => result.json())
    .then(async (data) => {
      const urlParts = window.location.pathname.split("/");
      const idIndex = urlParts.indexOf("servidor") + 1;
      const id = urlParts[idIndex];

      const guildInfo = data.find((guild) => guild.id === id);
      if (guildInfo) {
        document.getElementById("nameGuild").innerText = guildInfo.name;
        if (!guildInfo.icon) {
          imgGuild =
            "https://cdn.discordapp.com/attachments/1039517691242877008/1128074666364383394/d7b2ac2be0d74d97415c34df2e43c86f.png";
        } else {
          imgGuild = `https://cdn.discordapp.com/icons/${guildInfo.id}/${guildInfo.icon}.png`;
        }
        document.getElementById("iconGuild").src = imgGuild;
      } else {
        window.location.href = "/usuario";
      }
    });

  const urlParts = window.location.pathname.split("/");
  const idIndex = urlParts.indexOf("servidor") + 1;
  const id = urlParts[idIndex];
  fetch(`/api/guild/database/${id}`)
    .then((result) => result.json())
    .then(async (data) => {
      /*
       *    WELCOME MESSAGE CONFIGURATIONS:
       */

      var welcomeMessage = document.getElementById("welcomeMessage");
      welcomeMessage.style.opacity = "1";

      var welcomeMessageChecker = document.getElementById(
        "welcomeMessageChecker"
      );
      welcomeMessageChecker.removeAttribute("disabled");

      if (data[0].newMember.status == "actived") {
        welcomeMessageChecker.checked = true;
        document.getElementById("welcomeMessageConfig").style.display =
          "inline-block";
      } else {
        welcomeMessageChecker.checked = false;
      }

      welcomeMessageChecker.addEventListener("click", () => {
        if (welcomeMessageChecker.checked == true) {
          let caminho = "newMember.status";
          let value = "actived";
          fetch(`/api/onny/database/update/guilds`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, caminho, value }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(`No caminho "${caminho}" foi definido: ${value}`);
              let welcomeMessageActived = document.getElementById(
                "welcomeMessageActived"
              );
              welcomeMessageActived.style.display = "block";
              document.getElementById("welcomeMessageConfig").style.display =
                "inline-block";
              setTimeout(() => {
                welcomeMessageActived.style.display = "none";
              }, 5000);
            })
            .catch((error) => {
              console.error("Erro:", error);
            });
        } else {
          let caminho = "newMember.status";
          let value = "disabled";
          fetch(`/api/onny/database/update/guilds`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, caminho, value }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(`No caminho "${caminho}" foi definido: ${value}`);
              let welcomeMessageDisabled = document.getElementById(
                "welcomeMessageDisabled"
              );
              welcomeMessageDisabled.style.display = "block";
              document.getElementById("welcomeMessageConfig").style.display =
                "none";
              setTimeout(() => {
                welcomeMessageDisabled.style.display = "none";
              }, 5000);
            })
            .catch((error) => {
              console.error("Erro:", error);
            });
        }
      });

      /*
       *   EXPERIENCE SYSTEM CONFIGURATIONS:
       */
    });
} else {
  window.location.href = "/usuario";
}
