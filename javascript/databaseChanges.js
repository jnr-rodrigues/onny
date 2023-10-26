function formatDateToCustomString(date) {
  const options = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return date.toLocaleDateString("pt-BR", options);
}

async function handleURLChange() {
  const currentURL = window.location.href;
  const urlParts = currentURL.split("?");
  const id = urlParts[0].split("/").pop();
  const urlParams = new URLSearchParams(urlParts[1]);
  const logsCaminho = "changes";

  const getGuildData = async () => {
    const response = await fetch(`/api/onny/database/get/guilds/${id}`);
    return await response.json();
  };

  const updateAndLog = async (caminho, value, logMessage) => {
    try {
      // Consulta o valor atual no banco de dados
      const guild = await getGuildData();

      if (guild && guild[caminho] !== value) {
        // O valor foi alterado, atualize-o no banco de dados
        const response = await fetch(`/api/onny/database/update/guilds`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, caminho, value }),
        });
        const updateData = await response.json();

        if (updateData.success) {
          console.log(
            `[Onny] Dashboard (Site): (Guild: ${id}) had changes in "${caminho}": ${value}`
          );

          if (logMessage) {
            const logValue = `[${formatDateToCustomString(
              new Date()
            )}] ${logMessage}`;
            await fetch(`/api/onny/database/insert/guilds`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, logsCaminho, logValue }),
            });
          }
        }
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  if (urlParams.has("newMember.message.type")) {
    const caminho = "newMember.message.type";
    const value = urlParams.get(caminho);
    const guild = await getGuildData();
    if (guild[caminho] !== value) {
      const logMessage = `Agora as mensagens de boas-vindas serão enviadas como ${value
        .toString()
        .replace("text", "texto")
        .replace("image", "imagem")
        .toLocaleUpperCase()}!`;
      updateAndLog(caminho, value, logMessage);
    }
  }

  if (urlParams.has("newMember.channel")) {
    const caminho = "newMember.channel";
    const value = urlParams.get(caminho);
    const guild = await getGuildData();
    if (guild[caminho] !== value) {
      const logMessage = `As mensagens de boas-vindas serão enviadas no canal (ID: ${value.toUpperCase()}).`;
      updateAndLog(caminho, value, logMessage);
    }
  }

  if (urlParams.has("newMember.message.title")) {
    const caminho = "newMember.message.title";
    const value = urlParams.get(caminho);
    const guild = await getGuildData();
    if (guild[caminho] !== value) {
      const logMessage = `Título da mensagem de boas-vindas foi alterado:<br/>${value}`;
      updateAndLog(caminho, value, logMessage);
    }
  }

  if (urlParams.has("newMember.message.description")) {
    const caminho = "newMember.message.description";
    const value = urlParams.get(caminho);
    const guild = await getGuildData();
    if (guild[caminho] !== value) {
      const logMessage = `Descrição da mensagem de boas-vindas foi alterada:<br/>${value}`;
      updateAndLog(caminho, value, logMessage);
    }
  }

  history.pushState(null, null, `/servidor/${id}`);
}

setInterval(handleURLChange, 1000);
