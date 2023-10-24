function fetchData() {
  fetch("https://onny.discloud.app/api/onny/leaderboard/generated")
    .then((result) => result.json())
    .then(async (jsonData) => {
      if (Array.isArray(jsonData)) {
        let totalOnnycoins = 0;
        await fetch("https://onny.discloud.app/api/onny/leaderboard/generated")
          .then((response) => response.json())
          .then((data) => {
            if (data.length > 0) {
              data.forEach((user) => {
                totalOnnycoins += user.onnycoins;
              });
            }
          });

        try {
          jsonData.forEach(async (userData) => {
            // Crie o elemento de div principal
            const noteDiv = document.createElement("div");
            noteDiv.id = `user`;
            noteDiv.className = "notes";
            noteDiv.style.backgroundColor = "#1e1f22";
            noteDiv.style.borderRadius = "10px";
            noteDiv.style.margin = "20px";
            noteDiv.style.padding = "20px";
            noteDiv.style.width = "100%";
            noteDiv.style.position = "relative";
            noteDiv.style.overflow = "hidden";

            // Crie a primeira parte da diagonal
            const diagonalDiv1 = document.createElement("div");
            diagonalDiv1.style.position = "absolute";
            diagonalDiv1.style.top = "0";
            diagonalDiv1.style.left = "calc(65% - 2px)";
            diagonalDiv1.style.width = "calc(35%)";
            diagonalDiv1.style.height = "calc(100% + 2px)";
            diagonalDiv1.style.background =
              "linear-gradient(to right, #1e1f22, transparent)";
            diagonalDiv1.style.zIndex = "1";

            // Crie a segunda parte da diagonal
            const diagonalDiv2 = document.createElement("div");
            diagonalDiv2.style.position = "absolute";
            diagonalDiv2.style.top = "0";
            diagonalDiv2.style.left = "calc(65% - 2px)";
            diagonalDiv2.style.width = "calc(35%)";
            diagonalDiv2.style.height = "calc(100% + 2px)";
            diagonalDiv2.style.background =
              "linear-gradient(to right, #1e1f22, transparent)";
            diagonalDiv2.style.zIndex = "1";

            // Crie a parte da imagem
            const imageDiv = document.createElement("div");
            imageDiv.style.position = "absolute";
            imageDiv.style.top = "0";
            imageDiv.style.left = "65%";
            imageDiv.style.width = "35%";
            imageDiv.style.height = "100%";

            if (userData.profile.banners.equipped == "ONNY") {
              imageDiv.style.background = `url('/themes/onny/banner.jpg') center left no-repeat`;
              imageDiv.style.backgroundSize = "cover";
            } else if (userData.profile.banners.equipped == "CYBERPUNK") {
              imageDiv.style.background = `url('/themes/cyberpunk/banner.jpg') center left no-repeat`;
              imageDiv.style.backgroundSize = "cover";
            } else if (userData.profile.banners.equipped == "PADRAO") {
              imageDiv.style.background = `url('https://cdn.discordapp.com/attachments/1039517691242877008/1164558617278689423/desktop-wallpaper-torii-artistic-pattern-minimalism-black-background-minimalism.png?ex=6543a6ba&is=653131ba&hm=037e03efdc38582851a12c5bd5ebf8bc84b49483832462a20555e5d1790a62b5&') center left no-repeat`;
            }

            // Crie a imagem do usuário
            const userImage = document.createElement("img");
            userImage.src = userData.userInformations.displayAvatarURL;
            userImage.style.display = "inline-block";
            userImage.style.width = "60px";
            userImage.style.verticalAlign = "middle";
            userImage.style.borderRadius = "5px";

            // Crie o conteúdo de texto
            const textContentDiv = document.createElement("div");
            textContentDiv.style.display = "inline-block";
            textContentDiv.style.verticalAlign = "middle";
            textContentDiv.style.marginLeft = "10px";

            const usernameHeading = document.createElement("h4");
            usernameHeading.className = "w3-text-white";
            usernameHeading.style.textAlign = "left";
            usernameHeading.style.opacity = "0";
            usernameHeading.style.transform = "translateY(-100%)";
            usernameHeading.style.animation = "slideIn 0.5s forwards";
            usernameHeading.style.fontSize = "17px";
            usernameHeading.textContent = userData.userInformations.username;

            const userPositionImage = document.createElement("img");
            userPositionImage.style.verticalAlign = "middle";
            userPositionImage.style.marginLeft = "5px";

            const userDescription = document.createElement("p");
            userDescription.className = "w3-text-gray";
            userDescription.style.textAlign = "left";
            userDescription.style.opacity = "0";
            userDescription.style.transform = "translateY(-100%)";
            userDescription.style.animation = "slideIn 0.5s forwards";
            userDescription.style.fontSize = "15px";
            userDescription.style.marginTop = "-10px";

            if (userData.atualPosition > userData.anteriorPosition) {
              userPositionImage.src =
                "https://cdn.discordapp.com/attachments/1039517691242877008/1164338330700353647/angulo-para-baixo_1.png?ex=6542d992&is=65306492&hm=1965732a5954a7235f8693816ddbf549595d971f30be5bb676a7a65241edbd90&";
              userPositionImage.style.width = "25px";
              userDescription.textContent = `Estava anteriormente na ${
                userData.anteriorPosition + 1
              }° posição!`;
            } else if (userData.atualPosition < userData.anteriorPosition) {
              userPositionImage.src =
                "https://cdn.discordapp.com/attachments/1039517691242877008/1164338330423525386/angulo-para-cima.png?ex=6542d992&is=65306492&hm=b4dc0c957097f53692f37707d0ed08abc04d87d385f8735ce89d933d9a16ef28&";
              userPositionImage.style.width = "25px";
              userDescription.textContent = `Estava anteriormente na ${
                userData.anteriorPosition + 1
              }° posição!`;
            } else if (userData.atualPosition == userData.anteriorPosition) {
              userPositionImage.src =
                "https://cdn.discordapp.com/attachments/1039517691242877008/1164340520387104818/arrastar_1.png?ex=6542db9c&is=6530669c&hm=7a9e5892c86279d3aa04982005e3a3fb626bf9bf624acb44b0a2746d5ed72e2f&";
              userPositionImage.style.width = "15px";
              userDescription.textContent = `Continuou na mesma posição!`;
            }
            usernameHeading.appendChild(userPositionImage);

            const infoDiv1 = document.createElement("div");
            infoDiv1.className = "w3-text-gray";
            infoDiv1.style.textAlign = "left";
            infoDiv1.style.opacity = "0";
            infoDiv1.style.transform = "translateY(-100%)";
            infoDiv1.style.animation = "slideIn 0.5s forwards";
            infoDiv1.style.fontSize = "14px";
            infoDiv1.style.marginTop = "-10px";
            infoDiv1.style.margin = "20px";
            infoDiv1.style.display = "inline-block";
            infoDiv1.style.verticalAlign = "top";

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

            const coinsText1 = document.createElement("p");
            coinsText1.className = "w3-text-white";
            coinsText1.style.fontSize = "14px";
            coinsText1.textContent =
              "Coins: " + abreviarNumero(userData.onnycoins);

            const coinsText1Description = document.createElement("p");
            coinsText1Description.className = "w3-text-gray";
            coinsText1Description.style.textAlign = "left";
            coinsText1Description.style.opacity = "0";
            coinsText1Description.style.transform = "translateY(-100%)";
            coinsText1Description.style.animation = "slideIn 0.5s forwards";
            coinsText1Description.style.fontSize = "13px";
            coinsText1Description.style.marginTop = "-2px";

            const percentUserProfile = (
              (userData.onnycoins * 100) /
              totalOnnycoins
            ).toFixed(2);

            coinsText1Description.textContent = `Dono(a) de ${
              isNaN(percentUserProfile) ? "0" : percentUserProfile
            }% da economia.`;
            coinsText1.appendChild(coinsText1Description);

            const cashText1 = document.createElement("p");
            cashText1.className = "w3-text-white";
            cashText1.style.fontSize = "14px";
            cashText1.textContent =
              "Cash: " + abreviarNumero(userData.onnycash);

            infoDiv1.appendChild(coinsText1);
            infoDiv1.appendChild(cashText1);

            // Crie a segunda parte das informações
            const infoDiv2 = document.createElement("div");
            infoDiv2.className = "w3-text-gray";
            infoDiv2.style.textAlign = "left";
            infoDiv2.style.opacity = "0";
            infoDiv2.style.transform = "translateY(-100%)";
            infoDiv2.style.animation = "slideIn 0.5s forwards";
            infoDiv2.style.fontSize = "14px";
            infoDiv2.style.marginTop = "-10px";
            infoDiv2.style.margin = "20px";
            infoDiv2.style.display = "inline-block";
            infoDiv2.style.verticalAlign = "top";

            // Crie uma div para conter o <br> e adicione o <br> nessa div
            const lineBreakDiv = document.createElement("div");
            lineBreakDiv.style.display = "block";
            const lineBreak = document.createElement("br");

            // Adicione os elementos criados à div principal
            noteDiv.appendChild(diagonalDiv1);
            noteDiv.appendChild(diagonalDiv2);
            noteDiv.appendChild(imageDiv);
            noteDiv.appendChild(userImage);
            usernameHeading.appendChild(userPositionImage);
            textContentDiv.appendChild(usernameHeading);
            textContentDiv.appendChild(userDescription);
            noteDiv.appendChild(textContentDiv);
            noteDiv.appendChild(lineBreak);

            noteDiv.appendChild(infoDiv1);
            noteDiv.appendChild(infoDiv2);

            const leaderboardList = document.getElementById("leaderboardList");
            leaderboardList.appendChild(noteDiv);
          });
        } catch (e) {
          console.log(e);
        }

        // Adicione a classe 'focused' ao primeiro elemento com a classe 'notes'
        const notes = document.querySelectorAll(".notes");
        if (notes.length > 0) {
          notes[0].classList.add("focused");
          // Registre um evento de rolagem após a inserção das notas
          window.addEventListener("scroll", checkCenterNote);
        }
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar dados da API:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

function checkCenterNote() {
  const notes = document.querySelectorAll(".notes");
  if (notes.length === 0) {
    return; // Não há elementos com a classe 'notes'
  }

  const viewportHeight = window.innerHeight;
  const scrollTop = window.scrollY;
  const centerY = viewportHeight / 2 + scrollTop;

  notes.forEach((note) => {
    const rect = note.getBoundingClientRect();
    const noteTop = rect.top + scrollTop;
    const noteBottom = rect.bottom + scrollTop;

    // Verifica se a nota está no centro da tela
    if (noteTop <= centerY && noteBottom >= centerY) {
      note.classList.add("focused");
    } else {
      note.classList.remove("focused");
    }
  });
}
