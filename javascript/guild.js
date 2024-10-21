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
  const logsCaminho = "changes";

  function loadAndReloadLogs() {
    fetch(`/api/guild/database/${id}`)
      .then((result) => result.json())
      .then(async (data) => {
        const changesMessages = data[0].changes.reverse();
        const logsChangesMessages = document.getElementById(
          "logsChangesMessages"
        );
        logsChangesMessages.innerHTML = "";

        let currentDateString = null;
        let currentMessages = [];

        if (changesMessages.length === 0) {
          const noRecordsMessage = document.createElement("div");
          noRecordsMessage.classList = "w3-text-white";
          noRecordsMessage.style.fontSize = "14px";
          noRecordsMessage.textContent =
            "Nenhuma alteração foi realizada até o momento!";
          logsChangesMessages.appendChild(noRecordsMessage);
          return;
        }

        changesMessages.forEach((message) => {
          const matches = /^\[(.*?)\](.*)$/.exec(message);
          if (matches) {
            const dateAndTime = matches[1].split(",");
            const date = dateAndTime[0].trim();
            const time = dateAndTime[1].trim();
            const messageText = matches[2].trim();

            if (currentDateString === null) {
              currentDateString = date;
            } else if (currentDateString !== date) {
              renderMessages(
                logsChangesMessages,
                currentDateString,
                currentMessages
              );
              currentMessages = [];
              currentDateString = date;
            }

            currentMessages.push(
              `<div class="changesDashboard" style="background-color: #2b2d31; padding: 10px; margin: 10px; border-radius: 5px; cursor: pointer;"><span style="vertical-align: middle;">${messageText}</span> <p style="font-weight: 300; font-size: 10px; text-align: right; bottom: 2; display: inline-block;">${time}</p></div>`
            );
          }
        });

        if (currentDateString !== null) {
          renderMessages(
            logsChangesMessages,
            currentDateString,
            currentMessages
          );
        }
      });

    function renderMessages(container, date, messages) {
      const dateElement = document.createElement("div");
      dateElement.classList = "w3-text-gray";
      dateElement.textContent = date;
      container.appendChild(dateElement);

      messages.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.style.fontSize = "14px";
        messageElement.innerHTML = message;
        container.appendChild(messageElement);
      });
    }
  }

  loadAndReloadLogs();
  setInterval(loadAndReloadLogs, 10000);

  fetch(`/api/guild/database/${id}`)
    .then((result) => result.json())
    .then(async (data) => {
      /*
       *    WELCOME MESSAGE CONFIGURATIONS:
       */

      var selectElement = document.getElementById("newMember.message.type");
      var valueToSelect = data[0].newMember.message.type;

      for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === valueToSelect) {
          selectElement.selectedIndex = i;
          break;
        }
      }

      var inputElement = document.getElementById("newMember.message.title");
      var valueToSet = data[0].newMember.message.title;
      inputElement.value = valueToSet;

      var inputElement = document.getElementById(
        "newMember.message.description"
      );
      var valueToSet = data[0].newMember.message.description;
      inputElement.value = valueToSet;

      /** Outras interações: */

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

      function carregarCanais(serverID) {
        fetch(`/api/onny/guild/${serverID}`)
          .then((response) => response.json())
          .then((data) => {
            const canais = data.channels;
            const select = document.getElementById("newMember.channel");

            select
              .querySelectorAll('option:not([value="false"])')
              .forEach((option) => {
                option.remove();
              });

            canais.forEach((canal) => {
              if (canal.type === 0) {
                const optionText = `#${canal.name}`;
                select.appendChild(new Option(optionText, canal.id));
              }
            });
          })
          .catch((error) => {
            console.error("Erro ao buscar canais:", error);
          });
      }
      carregarCanais(id);

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
              logValue = `[${formatDateToCustomString(
                new Date()
              )}] Mensagem de boas-vindas foi habilitada!`;
              fetch(`/api/onny/database/insert/guilds`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, logsCaminho, logValue }),
              }).catch((error) => {
                console.error("Erro:", error);
              });

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
              logValue = `[${formatDateToCustomString(
                new Date()
              )}] Mensagem de boas-vindas foi desabilitada!`;
              fetch(`/api/onny/database/insert/guilds`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, logsCaminho, logValue }),
              }).catch((error) => {
                console.error("Erro:", error);
              });
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
