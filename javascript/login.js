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

function getTitle(title) {
  if (title == "USUARIO") {
    return "Usuário da Onny"
  } else if (title == "DEVELOPER") {
    return "Desenvolvedor(a) da Onny"
  }
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

      document.getElementById("helpLoged").style.display = "block";
      document.getElementById("helpNoLoged").style.display = "none";

      const { global_name, discriminator, avatar, id } = response;
      if (!global_name || global_name === "undefined") {
        return;
      }
      document.getElementById("userId").innerText = `${id}`;

      fetch(`/api/users/${id}`)
        .then((response) => response.json())
        .then(async (data) => {
          if (Array.isArray(data) && data.length > 0) {
            const user = data[0];

            if (user.profile.banners.equipped == "ONNY") {
              document.getElementById("progressBarFill").style.background =
                "linear-gradient(135deg, #ff1b6b 0%, #45caff 100%)";
              document.getElementById("profileBackground").style.background =
                "url('/themes/onny/banner.jpg') center center no-repeat";
            } else if (user.profile.banners.equipped == "CYBERPUNK") {
              document.getElementById("progressBarFill").style.background =
                "linear-gradient(135deg, #1FFDF0 0%, #FD471E 100%)";
              document.getElementById("profileBackground").style.background =
                "url('/themes/cyberpunk/banner.jpg') center center no-repeat";
            } else if (user.profile.banners.equipped == "PADRAO") {
              document.getElementById("progressBarFill").style.background =
                "#E94F4D";
              document.getElementById("profileBackground").style.background =
                "url('https://cdn.discordapp.com/attachments/1039517691242877008/1164558617278689423/desktop-wallpaper-torii-artistic-pattern-minimalism-black-background-minimalism.png?ex=6543a6ba&is=653131ba&hm=037e03efdc38582851a12c5bd5ebf8bc84b49483832462a20555e5d1790a62b5&') center left no-repeat";
            }

            document.getElementById("profileAvatarURL").src =
              user.userInformations.avatarURL;
            document
              .getElementById("profileAvatarURL")
              .classList.remove("rotateLoad");
            document.getElementById("profileUserName").textContent =
              user.userInformations.username;
            document.getElementById("profileUserTitle").textContent = 
              getTitle(user.profile.titles.equipped)

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
                  return (
                    (numero / abreviacao.valor).toFixed(1) + abreviacao.sufixo
                  );
                }
              }

              return numero.toString();
            }

            document.getElementById(
              "coinsUserProfile"
            ).textContent = `${abreviarNumero(user.onnycoins)}`;
            const percentUserProfile = (
              (user.onnycoins * 100) /
              totalOnnycoins
            ).toFixed(2);

            document.getElementById(
              "percentUserProfile"
            ).textContent = `Dono(a) de ${
              isNaN(percentUserProfile) ? "0" : percentUserProfile
            }% da economia.`;
            document.getElementById(
              "cashUserProfile"
            ).textContent = `${abreviarNumero(user.onnycash)}`;

            document.getElementById("userExp").innerText = user.exp.xp;
            document.getElementById("separator").innerText = "/";
            document.getElementById("levelExp").innerText =
              user.exp.nivel * 2000;
            document.getElementById(
              "userLevel"
            ).innerText = `Atualmente está no nível ${user.exp.nivel}!`;

            function updateProgressBar(currentValue, totalValue) {
              const fillElement = document.querySelector(".progress-bar-fill");
              const progressBarFill =
                document.querySelector(".progress-bar-fill");
              const percentage = Math.floor((currentValue / totalValue) * 100);

              progressBarFill.style.width = `${percentage}%`;
              progressBarFill.style.transition = "width 1s ease-in-out";

              const currentValueSpan = document.querySelector(".current-value");
              const percentageSpan = document.querySelector(".percentage");

              const percentageElement =
                document.getElementById("percentageLevel");
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
        });
    })
    .catch((error) => {
      console.error("Erro na solicitação GET:", error);
    });
}
