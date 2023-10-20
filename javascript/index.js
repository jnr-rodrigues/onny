async function loadDescription() {
  fetch("/api/onny")
    .then((result) => result.json())
    .then(async (response) => {
      if (response.status == "offline") {
        document.getElementById(
          "onnyDescriptionInicialPage"
        ).textContent = `No momento Onny está offline ou reiniciando. Buscando informações...`;
        loadDescription();
      } else {
        document.getElementById(
          "onnyDescriptionInicialPage"
        ).textContent = `Junte-se a ${response.totalUsers.toLocaleString()} usuários! Explore e personalize as aplicações
    da Onny para torná-las únicas ao seu estilo.`;
      }
    });
}

loadDescription();

function showTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "block";
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}

function getURLParameter(name) {
  const params = new URLSearchParams(window.location.hash.substr(1));
  return params.get(name);
}

function storeTokenInLocalStorage(token, expiresInSeconds) {
  const expirationTime = new Date().getTime() + expiresInSeconds * 1000;
  localStorage.setItem("accessToken", token);
  localStorage.setItem("expirationTime", expirationTime);
}

function isUserLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");
  const expirationTime = localStorage.getItem("expirationTime");
  if (accessToken && expirationTime) {
    return new Date().getTime() < parseInt(expirationTime);
  }
  return false;
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("expirationTime");
  window.location.replace("/");
}

document.getElementById("logoutButton").addEventListener("click", function () {
  logout();
});

const tokenType = getURLParameter("token_type");
const accessTokenFromURL = getURLParameter("access_token");
const expiresIn = getURLParameter("expires_in");

if (tokenType && accessTokenFromURL && expiresIn) {
  storeTokenInLocalStorage(accessTokenFromURL, expiresIn);
  window.history.pushState(
    {},
    document.title,
    window.location.href.split("#")[0]
  );
}
