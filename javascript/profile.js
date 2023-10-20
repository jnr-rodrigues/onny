function fetchData(userId) {
  if (!userId) {
    document.getElementById("profileUser").style.display = "none";
    document.getElementById("naoEncontrado").style.display = "block";
    return;
  }

  fetch("/api/onny/leaderboard/generated")
    .then((result) => result.json())
    .then(async (jsonData) => {
      if (Array.isArray(jsonData)) {
        const user = jsonData.find(
          (userData) => userData.userInformations.id === userId
        );

        if (!user) {
          document.getElementById("profileUser").style.display = "none";
          document.getElementById("naoEncontrado").style.display = "block";
          return;
        }

        if (user.profile.banners.equipped == "TORII_GATE") {
          document.getElementById("progressBarFill").style.background =
            "linear-gradient(135deg, #ff1b6b 0%, #45caff 100%)";
          document.getElementById("profileBackground").style.background =
            "url('/themes/toriiGate/banner.jpg') center left no-repeat";
        } else if (user.profile.banners.equipped == "PADRAO") {
          document.getElementById("progressBarFill").style.background =
            "#E94F4D";
          document.getElementById("profileBackground").style.background =
            "url('https://cdn.discordapp.com/attachments/1039517691242877008/1164558617278689423/desktop-wallpaper-torii-artistic-pattern-minimalism-black-background-minimalism.png?ex=6543a6ba&is=653131ba&hm=037e03efdc38582851a12c5bd5ebf8bc84b49483832462a20555e5d1790a62b5&') center left no-repeat";
        }

        document.getElementById("profileAvatarURL").src =
          user.userInformations.avatarURL;
        document.getElementById("profileUserName").textContent =
          user.userInformations.username;
        document.getElementById("profileUserTitle").textContent = getTitle(
          user.profile.titles.equipped
        );

        let totalOnnycoins = 0;
        await fetch("/api/onny/leaderboard/generated")
          .then((response) => response.json())
          .then((data) => {
            if (data.length > 0) {
              data.forEach((user) => {
                totalOnnycoins += user.onnycoins;
              });
            }
          });

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

        document.getElementById(
          "profileUserCoins"
        ).textContent = `Coins: ${abreviarNumero(user.onnycoins)}`;
        const percentUserProfile = (
          (user.onnycoins * 100) /
          totalOnnycoins
        ).toFixed(2);

        document.getElementById(
          "profileUserPercent"
        ).textContent = `Dono(a) de ${
          isNaN(percentUserProfile) ? "0" : percentUserProfile
        }% da economia.`;
        document.getElementById(
          "profileUserCash"
        ).textContent = `Cash: ${abreviarNumero(user.onnycash)}`;

        document.getElementById("userExp").innerText = user.exp.xp;
        document.getElementById("separator").innerText = "/";
        document.getElementById("levelExp").innerText = user.exp.nivel * 2000;
        document.getElementById(
          "userLevel"
        ).innerText = `Atualmente está no nível ${user.exp.nivel}!`;

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
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar dados da API:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const url = window.location.href;
  const parts = url.split("/");
  const userId = parts[parts.length - 1];

  fetchData(userId);
});
