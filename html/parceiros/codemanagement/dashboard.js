const fragment = new URLSearchParams(window.location.hash.slice(1));
const accessToken = fragment.get("access_token");
if (accessToken) {
  localStorage.setItem("access_token_codemanagement", accessToken);
}

function getAccessToken() {
  const storedAccessToken = localStorage.getItem("access_token_codemanagement");
  return storedAccessToken;
}

function isLoggedIn() {
  return getAccessToken() !== null;
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
          window.location.href = "/codemanagement/expired";
          return;
        }

        document.getElementById(
          "usernameInterface"
        ).innerText = `Bem-vindo(a), ${global_name}!`;
        document.getElementById("userId").innerText = `${id}`;
        localStorage.setItem("userId_codemanagement", id);

        const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
        const avatarElement = document.getElementById("avatar");
        avatarElement.src = avatarUrl;
        avatarElement.alt = `${global_name}'s avatar`;
      }

      function loadApps() {
        let loadingApp = document.getElementById("loadingIcon");
        loadingApp.style.display = "none";

        fetch(`/api/onny/partners/codemanagement`)
          .then((response) => response.json())
          .then((data) => {
            const ownerElement = document.getElementById("userId");
            const owner = ownerElement.textContent.trim();

            let appContainer = document.getElementById("allApps");
            let app = document.createElement("div");

            let hasApp = false;
            for (var w = 0; w < data.length; w++) {
              if (data[w].owner.ownerId == owner) hasApp = true;
            }

            if (hasApp == false) {
              let appName = document.createElement("h5");
              appName.className = "w3-text-white";
              appName.style.textAlign = "left";
              appName.textContent =
                "Você não tem aplicações hospedadas em Code Management.";
              appContainer.appendChild(appName);
            } else {
              for (let i = 0; i < data.length; i++) {
                if (data[i].owner.ownerId === owner) {
                  let appItem = document.createElement("div");
                  appItem.id = data[i].bot.botId;
                  appItem.className = "w3-container premium-item";
                  appItem.style.animation = "popIn 0.5s";
                  appItem.style.backgroundColor = "#1E1F22";
                  appItem.style.padding = "10px";
                  appItem.style.borderRadius = "10px";
                  appItem.style.width = "170px";
                  appItem.style.display = "inline-block";
                  appItem.style.marginRight = "20px";

                  let appLink = document.createElement("a");
                  appLink.href = `/codemanagement/dashboard/${data[i].bot.botId}`;
                  appLink.style.textDecoration = "none";

                  let appImage = document.createElement("img");
                  appImage.src = data[i].bot.botIconURL;
                  appImage.style.width = "150px";
                  appImage.style.borderRadius = "10px";

                  let appName = document.createElement("h5");
                  appName.className = "w3-text-white";
                  appName.style.textAlign = "center";
                  appName.textContent = data[i].bot.botName;

                  appLink.appendChild(appImage);
                  appLink.appendChild(appName);
                  appItem.appendChild(appLink);
                  appContainer.appendChild(appItem);
                  document.getElementById(
                    `${data[i].bot.botId}`
                  ).href = `/codemanagement/dashboard/${data[i].bot.botId}`;
                }
              }
            }
          });
      }

      await infoUser();
      await loadApps();

      window.history.pushState(
        {},
        document.title,
        window.location.href.split("#")[0]
      );
    })
    .catch((e) => {
      console.log(e);
    });
} else {
  window.location.href = "/codemanagement/auth/discord";
}
