async function loadDescription() {
  fetch("/api/onny")
    .then((result) => result.json())
    .then(async (response) => {
      if (response.status == "offline") {
        document.getElementById("statusOnny").src =
          "https://cdn.discordapp.com/attachments/1039517691242877008/1134871722491908106/offline.png";
        document.getElementById(
          "onnyDescriptionInicialPage"
        ).textContent = `No momento Onny está offline ou reiniciando. Buscando informações...`;
        loadDescription();
      } else {
        document.getElementById("statusOnny").src =
          "https://cdn.discordapp.com/attachments/1039517691242877008/1134871722269618327/online.png";
        document.getElementById(
          "onnyDescriptionInicialPage"
        ).textContent = `Junte-se a ${response.totalUsers.toLocaleString()} usuários! Explore e personalize as aplicações
  da Onny para torná-las únicas ao seu estilo.`;
        document.getElementById(
          "onnyLantecy"
        ).textContent = `Atualmente estou rodando com ${response.ping}ms de latência.`;
      }
    });
}

loadDescription();

function toggleBlurEffect() {
  const toggleBlurButton = document.getElementById("toggleBlurButton");
  let isBlurActive = localStorage.getItem("isBlurActive") === true;

  const images = document.querySelectorAll(".guild-image");
  const container = document.querySelector(".guild-container");

  if (isBlurActive) {
    images.forEach((image) => (image.style.filter = "blur(5px)"));
    container.classList.add("blur");
    toggleBlurButton.textContent = "Desativar Desfoque";
  } else {
    images.forEach((image) => (image.style.filter = "none"));
    container.classList.remove("blur");
    toggleBlurButton.textContent = "Ativar Desfoque";
  }

  toggleBlurEffect();

  toggleBlurButton.addEventListener("click", () => {
    isBlurActive = !isBlurActive;
    toggleBlurEffect();
    localStorage.setItem("isBlurActive", isBlurActive);
  });
}

let currentPage = 1;
const usersPerPage = 4;
let data = [];

function fetchData() {
  fetch("/api/onny/leaderboard")
    .then((result) => result.json())
    .then(async (jsonData) => {
      data = jsonData;
      redrawLeaderboard();
      try {
        const loading = document.getElementById("loadingIconLeaderboard");
        loading.style.display = "none";
      } catch (e) {}
    })
    .catch((error) => {
      console.error("Erro ao buscar dados da API:", error);
      const loading = document.getElementById("loadingIconLeaderboard");
      loading.textContent = "Erro ao carregar dados.";
    });
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
      return (numero / abreviacao.valor).toFixed(1) + abreviacao.sufixo;
    }
  }

  return numero.toString();
}

function redrawLeaderboard() {
  const guildContainer = document.getElementById("leaderboardSlot");
  guildContainer.innerHTML = "";

  let totalOnnycoins = 0;
  if (data.length > 0) {
    data.forEach((user) => {
      totalOnnycoins += user.onnycoins;
    });
  }

  document.getElementById(
    "avaliableCoins"
  ).innerHTML = `A economia de Onny está avaliada em <b>${totalOnnycoins.toLocaleString()}$OC</b> <b style="color: #adb5bd; font-size: 13px;">(Onny Coins)</b> somando moedas no mercado!`;
  document.getElementById(
    "splitIn"
  ).innerHTML = `Essa quantidade de moedas está divida entre ${data.length} usuários de forma não igualitária.`;

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, data.length);

  for (let i = startIndex; i < endIndex; i++) {
    let guild = document.createElement("div");
    guild.onclick = () => openHUDUserProfile(data[i].userInformations.id);
    guild.style.cursor = "pointer";
    guild.id = data[i].userInformations.id;
    guild.className = "w3-container index-person-item leaderboard-user";

    let positionText = document.createElement("p");
    positionText.textContent = `TOP ${i + 1}°`;
    positionText.style.fontSize = "13px";
    positionText.style.textAlign = "center";
    positionText.style.marginTop = "-5px";
    positionText.className = "w3-text-grey";

    let guildImage = document.createElement("img");
    guildImage.src = data[i].userInformations.displayAvatarURL;
    guildImage.style.marginTop = "-10px";
    guildImage.className = "guild-image blur";

    let guildName = document.createElement("h4");
    guildName.className = "w3-text-white guild-name";

    if (data[i].userInformations.username.length > 10) {
      guildName.textContent =
        data[i].userInformations.username.substring(0, 10) + "...";
    } else {
      guildName.textContent = data[i].userInformations.username.substring(
        0,
        10
      );
    }

    let descGuild = document.createElement("p");
    descGuild.className = "w3-text-grey guild-description";
    descGuild.textContent = `com ${abreviarNumero(data[i].onnycoins)} coins!`;

    guild.appendChild(positionText);
    guild.appendChild(guildImage);
    guild.appendChild(guildName);
    guild.appendChild(descGuild);
    guildContainer.appendChild(guild);

    const backPage = document.getElementById("backPage");
    const proxPage = document.getElementById("proxPage");
    backPage.style.visibility = "visible";
    proxPage.style.visibility = "visible";
  }
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    redrawLeaderboard();
    const storedBlurState = localStorage.getItem("isBlurActive");
    if (storedBlurState !== null) {
      isBlurActive = JSON.parse(storedBlurState);
      toggleBlurEffect();
    }
  }
}

function goToNextPage() {
  const totalPages = Math.ceil(data.length / usersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    redrawLeaderboard();
    const storedBlurState = localStorage.getItem("isBlurActive");
    if (storedBlurState !== null) {
      isBlurActive = JSON.parse(storedBlurState);
      toggleBlurEffect();
    }
  }
}

fetchData();
