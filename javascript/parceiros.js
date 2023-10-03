async function openHUD() {
  document.getElementById("safeBar").classList.add("hidden");
  var hud = document.getElementById("hud");
  hud.style.display = "block";
  const element = document.documentElement;
  await element.classList.add("scroll-blocked");
}

function onnyDashboard(event) {
  event.preventDefault();
  if (event.button === 0) {
    window.location.href = "/usuario";
  } else if (event.button === 2) {
    window.location.href = "/usuario";
  }
}

function interactionsOnny(event) {
  event.preventDefault();
  if (event.button === 0) {
    window.location.href =
      "https://discord.com/oauth2/authorize?client_id=1013882148513661009&scope=bot&permissions=27648860222&redirect_uri=https%3A%2F%2Fonny.discloud.app%2F";
  } else if (event.button === 2) {
    window.location.href = "https://discord.gg/2Xxupbacb5";
  }
}

function tryLogin(event) {
  event.preventDefault();
  if (event.button === 0) {
    window.location.href = "/auth/discord";
  } else if (event.button === 2) {
    window.location.href = "/auth/discord";
  }
}

async function openHUDStatusOnny() {
  document.getElementById("safeBar").classList.add("hidden");
  var hud = document.getElementById("hudStatusOnny");
  hud.style.display = "block";
  const element = document.documentElement;
  await element.classList.add("scroll-blocked");
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

function getTitle(id) {
  if (id == "DEVELOPER") {
    return "Desenvolvedor(a) da Onny";
  } else if (id == "USUARIO") {
    return "Usuário da Onny";
  }
}

async function openHUDUserProfile(id) {
  fetch(`/api/users/${id}`)
    .then((response) => response.json())
    .then(async (data) => {
      document.getElementById("avatarUserProfile").src =
        data[0].userInformations.avatarURL;
      document.getElementById("usernameUserProfile").textContent =
        data[0].userInformations.username;
      if (data[0].profile.banners.equipped == "TORII_GATE") {
        var element = document.getElementById("progressBarFill");
        element.style.background =
          "linear-gradient(135deg, #ff1b6b 0%, #45caff 100%)";
        document.getElementById("bannerUserProfile").style.background =
          "url('/themes/toriiGate/banner.jpg') center / cover no-repeat";
      } else if (data[0].profile.banners.equipped == "PADRAO") {
        var element = document.getElementById("progressBarFill");
        element.style.background = "#07f49e";
        document.getElementById("bannerUserProfile").style.background =
          "url('')";
        document.getElementById("bannerUserProfile").style.backgroundColor =
          "#2b2d31";
      }

      document.getElementById("titleUserProfile").textContent = `${getTitle(
        data[0].profile.titles.equipped
      )}`;

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
      ).textContent = `Coins: ${abreviarNumero(data[0].onnycoins)}`;
      const percentUserProfile = (
        (data[0].onnycoins * 100) /
        totalOnnycoins
      ).toFixed(2);

      document.getElementById("percentUserProfile").textContent = `Dono(a) de ${
        isNaN(percentUserProfile) ? "0" : percentUserProfile
      }% da economia.`;
      document.getElementById(
        "cashUserProfile"
      ).textContent = `Cash: ${abreviarNumero(data[0].onnycash)}`;

      document.getElementById("userExp").innerText = data[0].exp.xp;
      document.getElementById("separator").innerText = "/";
      document.getElementById("levelExp").innerText = data[0].exp.nivel * 2000;
      document.getElementById(
        "userLevel"
      ).innerText = `Atualmente está no nível ${data[0].exp.nivel}!`;

      setTimeout(() => {
        document.getElementById("userProfileLocal").style.display = "block";
        document.getElementById("loadDiv").style.display = "none";
      }, 1500);
    })
    .then(() => {
      function updateProgressBar(currentValue, totalValue) {
        const fillElement = document.querySelector(".progress-bar-fill");
        const progressBarFill = document.querySelector(".progress-bar-fill");
        const percentage = Math.floor((currentValue / totalValue) * 100);

        progressBarFill.style.width = `${percentage}%`;
        progressBarFill.style.transition = "width 1s ease-in-out";

        const currentValueSpan = document.querySelector(".current-value");
        const percentageSpan = document.querySelector(".percentage");

        const percentageElement = document.getElementById("percentageLevel");
        currentValueSpan.textContent = currentValue;
        const fillPercentage = percentage;
        const displayPercentage = isNaN(fillPercentage) ? "0" : fillPercentage;
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

  document.getElementById("safeBar").classList.add("hidden");
  document.getElementById("hudUserProfileId").textContent = id;
  var hud = document.getElementById("hudUserProfile");
  hud.style.display = "block";

  const element = document.documentElement;
  await element.classList.add("scroll-blocked");
}

async function closeHUD() {
  document.getElementById("safeBar").classList.remove("hidden");
  var hud = document.getElementById("hud");
  hud.style.display = "none";
  const element = document.documentElement;
  await element.classList.remove("scroll-blocked");
}

async function closeHUDStatusOnny() {
  document.getElementById("safeBar").classList.remove("hidden");
  var hud = document.getElementById("hudStatusOnny");
  hud.style.display = "none";
  const element = document.documentElement;
  await element.classList.remove("scroll-blocked");
}

async function closeHUDUserProfile() {
  document.getElementById("safeBar").classList.remove("hidden");
  document.getElementById("avatarUserProfile").src =
    "https://cdn.discordapp.com/attachments/1039517691242877008/1141456511332266074/image.png";
  document.getElementById("usernameUserProfile").textContent = "";

  const progressBarFill = document.querySelector(".progress-bar-fill");
  progressBarFill.style.width = `0%`;

  var hud = document.getElementById("hudUserProfile");
  hud.style.display = "none";

  document.getElementById("userProfileLocal").style.display = "none";
  document.getElementById("loadDiv").style.display = "block";

  const element = document.documentElement;
  await element.classList.remove("scroll-blocked");
}

function CODE_MANAGEMENT(event) {
  event.preventDefault();
  if (event.button === 0) {
    window.location.href = "/codemanagement/usuario";
  } else if (event.button === 2) {
    window.location.href = "https://discord.gg/5mBg22fSyp";
  }
}

function NEW_PARTNER(event) {
  event.preventDefault();
  if (event.button === 0) {
    window.location.href = "https://discord.gg/2Xxupbacb5";
  } else if (event.button === 2) {
    window.location.href = "https://discord.gg/2Xxupbacb5";
  }
}
