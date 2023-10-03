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

if (isLoggedIn()) {
  const secretsUser = `Bearer ${getAccessToken()}`;

  fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: secretsUser,
    },
  })
    .then((result) => result.json())
    .then(async (response) => {
      async function loadApp() {
        const startIndex =
          location.href.indexOf("/dashboard/") + "/dashboard/".length;
        const endIndex = location.href.indexOf("#");
        const id = location.href.substring(startIndex, endIndex);

        fetch(`/app/${id}`)
          .then((result) => result.json())
          .then(async (data) => {
            let hud = document.getElementById("hud");
            document.getElementById("usernameApplication").innerText =
              data[0].name;
            document.getElementById("avatarApplication").src = data[0].icon;

            if (data[0].functions.includes("TICKETS_CENTRAL")) {
            }
          });
      }

      window.history.pushState(
        {},
        document.title,
        window.location.href.split("#")[0]
      );
      await loadApp();
    })
    .catch((error) => {
      console.error("Erro na solicitação GET:", error);
    });
} else {
  window.location.href = "/auth/discord";
}
