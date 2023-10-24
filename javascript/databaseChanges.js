async function handleURLChange() {
  const currentURL = window.location.href;

  // Divide a URL pelo caractere '?'
  const urlParts = currentURL.split("?");

  // O ID é o último elemento da primeira parte da matriz resultante
  const id = urlParts[0].split("/").pop();
  console.log("ID extraído da URL: " + id);

  // A segunda parte da matriz resultante contém os parâmetros da URL
  const urlParams = new URLSearchParams(urlParts[1]);

  // Verifica se a URL contém os parâmetros necessários
  if (urlParams.has("newMember.message.type")) {
    let caminho = "newMember.message.type";
    const value = urlParams.get(caminho);
    fetch(`/api/onny/database/update/guilds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, caminho, value }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          `[Onny] Dashboard (Site): (Guild: ${id}) had changes in "${caminho}": ${value}`
        );
        alert(`O tipo da mensagem de entrada foi atualizado para: ${value}`);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }

  if (urlParams.has("newMember.channel")) {
    let caminho = "newMember.channel";
    const value = urlParams.get(caminho);
    fetch(`/api/onny/database/update/guilds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, caminho, value }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          `[Onny] Dashboard (Site): (Guild: ${id}) had changes in "${caminho}": ${value}`
        );
        alert(
          `O canal em que a mensagem de entrada será enviado foi atualizado para: ${value}`
        );
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }

  if (urlParams.has("newMember.message.title")) {
    let caminho = "newMember.message.title";
    const value = urlParams.get(caminho);
    fetch(`/api/onny/database/update/guilds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, caminho, value }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          `[Onny] Dashboard (Site): (Guild: ${id}) had changes in "${caminho}": ${value}`
        );
        alert(`O título da mensagem foi atualizado para: ${value}`);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }

  if (urlParams.has("newMember.message.description")) {
    let caminho = "newMember.message.description";
    const value = urlParams.get(caminho);
    fetch(`/api/onny/database/update/guilds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, caminho, value }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          `[Onny] Dashboard (Site): (Guild: ${id}) had changes in "${caminho}": ${value}`
        );
        alert(`A descrição da mensagem foi atualizada para: ${value}`);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }

  history.pushState(null, null, `/servidor/${id}`);
}

setInterval(handleURLChange, 1000);
