function getAccessToken() {
  const storedUserId = localStorage.getItem("userId_codemanagement");
  return storedUserId;
}

function hasUser() {
  return getAccessToken() !== null;
}

if (hasUser()) {
  function getIdFromUrl(url) {
    const regex = /\/dashboard\/(\w+)/;
    const matches = url.match(regex);

    if (matches && matches.length === 2) {
      return matches[1];
    }

    return null;
  }

  const url = window.location.href;
  const idFromUrl = getIdFromUrl(url);

  async function clearLogs(logs) {
    try {
      const cleanedLogs = logs.replace(
        /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)|(\x1B\[\d{1,2}(?:;\d{1,2})?m)/g,
        ""
      );

      return cleanedLogs;
    } catch (e) {
      console.log(e);
    }
  }

  async function appPageReloadStats() {
    fetch(`/codemanagement/app/${idFromUrl}`)
      .then(async (result) => result.json())
      .then(async (data) => {
        if (data[0].bot.discloud.status === true) {
          document.getElementById("statusApplication").src =
            "https://cdn.discordapp.com/attachments/1039517691242877008/1134871722269618327/online.png";
          document.getElementById(
            "appMemory"
          ).innerText = `Usando ${data[0].bot.discloud.memoryUse}/${data[0].bot.discloud.maxMemory}MB de memoria. (RAM)`;
        } else {
          document.getElementById("statusApplication").src =
            "https://cdn.discordapp.com/attachments/1039517691242877008/1134871722491908106/offline.png";
          document.getElementById(
            "appMemory"
          ).innerText = `Usando 0/${data[0].bot.discloud.maxMemory}MB de memoria. (RAM)`;
        }
      });
  }
  appPageReloadStats();
  setInterval(appPageReloadStats, 5000);

  async function appPageReload() {
    fetch(`/codemanagement/app/${idFromUrl}`)
      .then(async (result) => result.json())
      .then(async (data) => {
        let options = document.getElementById("appOptions");
        options.innerHTML = "";

        document.getElementById("usernameApplication").innerText =
          data[0].bot.botName;
        document.getElementById("avatarApplication").src =
          data[0].bot.botIconURL;

        document.getElementById("appRegistros").innerText = await clearLogs(
          data[0].bot.discloud.logs
        );

        if (data[0].bot.functions.includes("START")) {
          if (data[0].bot.discloud.status !== true) {
            const divElement = document.createElement("div");
            divElement.className = "w3-container premium-item guild-item";
            divElement.id = "START";
            divElement.style.height = "220px";
            divElement.style.cursor = "pointer";
            divElement.setAttribute("onclick", "sendMessage('START')");

            const imgElement = document.createElement("img");
            imgElement.src =
              "https://cdn.discordapp.com/attachments/1039517691242877008/1138281805275996230/poder_1.png";
            imgElement.style.width = "150px";
            imgElement.style.scale = "0.9";

            const h3Element = document.createElement("h3");

            h3Element.textContent = "Ligar";
            h3Element.className = "w3-text-white";
            h3Element.style.fontSize = "15px";
            h3Element.style.textAlign = "center";
            divElement.appendChild(imgElement);
            divElement.appendChild(h3Element);

            options.appendChild(divElement);
          } else {
            const divElement = document.createElement("div");
            divElement.className = "w3-container premium-item guild-item";
            divElement.id = "STOP";
            divElement.style.height = "220px";
            divElement.style.cursor = "pointer";
            divElement.setAttribute("onclick", "sendMessage('STOP')");

            const imgElement = document.createElement("img");
            imgElement.src =
              "https://cdn.discordapp.com/attachments/1039517691242877008/1138281805275996230/poder_1.png";
            imgElement.style.width = "150px";
            imgElement.style.scale = "0.9";

            const h3Element = document.createElement("h3");

            h3Element.textContent = "Desligar";
            h3Element.className = "w3-text-white";
            h3Element.style.fontSize = "15px";
            h3Element.style.textAlign = "center";
            divElement.appendChild(imgElement);
            divElement.appendChild(h3Element);

            options.appendChild(divElement);
          }
        }

        if (data[0].bot.functions.includes("RESTART")) {
          const divElement = document.createElement("div");
          divElement.className = "w3-container premium-item guild-item";
          divElement.id = "RESTART";
          divElement.style.height = "220px";
          divElement.style.cursor = "pointer";
          divElement.setAttribute("onclick", "sendMessage('RESTART')");

          const imgElement = document.createElement("img");
          imgElement.src =
            "https://cdn.discordapp.com/attachments/1039517691242877008/1138281805783519282/vire-a-direita.png";
          imgElement.style.width = "150px";
          imgElement.style.scale = "0.9";

          const h3Element = document.createElement("h3");

          h3Element.textContent = "Reiniciar";
          h3Element.className = "w3-text-white";
          h3Element.style.fontSize = "15px";
          h3Element.style.textAlign = "center";
          divElement.appendChild(imgElement);
          divElement.appendChild(h3Element);

          options.appendChild(divElement);
        }

        if (data[0].bot.functions.includes("BACKUP")) {
          const divElement = document.createElement("div");
          divElement.className = "w3-container premium-item guild-item";
          divElement.id = "BACKUP";
          divElement.style.height = "220px";
          divElement.style.cursor = "pointer";
          divElement.setAttribute("onclick", "sendMessage('BACKUP')");

          const imgElement = document.createElement("img");
          imgElement.src =
            "https://cdn.discordapp.com/attachments/1039517691242877008/1138281805536034917/download_1.png";
          imgElement.style.width = "150px";
          imgElement.style.scale = "0.9";

          const h3Element = document.createElement("h3");

          h3Element.textContent = "Fazer backup";
          h3Element.className = "w3-text-white";
          h3Element.style.fontSize = "15px";
          h3Element.style.textAlign = "center";
          divElement.appendChild(imgElement);
          divElement.appendChild(h3Element);

          options.appendChild(divElement);
        }
      });
  }

  appPageReload();
} else {
  window.location.href = "/";
}
