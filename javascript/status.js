let arrayPings = [],
  arrayLabels = [];

const maxDataPoints = 60;

var ctx = document.getElementById("myChart").getContext("2d");

var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: arrayLabels,
    datasets: [
      {
        label: "Latência",
        data: arrayPings,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

async function loadLantecy() {
  fetch("/api/onny")
    .then((result) => result.json())
    .then(async (response) => {
      if (response.status != "offline") {
        if (response.ping.toString() == "-1") return;

        const now = new Date().toLocaleTimeString();
        arrayLabels.push(now);
        arrayPings.push(response.ping);

        if (arrayLabels.length > maxDataPoints) {
          arrayLabels.shift();
          arrayPings.shift();
        }

        document.getElementById(
          "onnyLantecy"
        ).textContent = `Atualmente estou rodando com ${response.ping}ms de latência.`;

        myChart.update();
      }
    });
}

loadLantecy();
setInterval(loadLantecy, 5000);
