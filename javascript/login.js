try {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = fragment.get("access_token");

  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
  }
} catch (e) {}

function getAccessToken() {
  const storedAccessToken = localStorage.getItem("access_token");
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
      const { global_name, discriminator, avatar, id } = response;
      if (!global_name || global_name === "undefined") {
        return;
      }
      document.getElementById("userId").innerText = `${id}`;

      fetch(`/api/users/${id}`)
        .then((response) => response.json())
        .then(async (data) => {
          document.getElementById("avatarUser").src = `${data[0].userInformations.avatarURL}`;
          document.getElementById("NicknameUser").textContent = `${data[0].userInformations.username}`
          console.log(data[0].userInformations.avatarURL);
          document.getElementById("login").style.display = "none";
          document.getElementById("login").style.pointerEvents = "none";
          document.getElementById("disconnect").style.display = "block";
          document.getElementById("disconnect").style.cursor = "pointer";
          document.getElementById("dashboardButton").style.display = "block";
          let bigButton = document.getElementById("loginPageBigButton");
          bigButton.onmousedown = "";
          bigButton.style.opacity = "0.5";
          bigButton.style.cursor = "default";
        });

      window.history.pushState(
        {},
        document.title,
        window.location.href.split("#")[0]
      );
    })
    .catch((error) => {
      console.error("Erro na solicitação GET:", error);
    });
}
