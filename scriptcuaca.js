const apiKey = "f885eadd34335a07e8846fcc212d32db"; // Ganti dengan API key kamu dari OpenWeather
const weatherInfo = document.getElementById("weatherInfo");
const cityInput = document.getElementById("cityInput");
let weatherChart;

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert("Please enter a city.");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
    getForecast(city);
    cityInput.value = ""; // Kosongkan input selepas cari
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function displayWeather(data) {
  const weatherMain = data.weather[0].main;
  let icon = "❓";

  switch (weatherMain) {
    case "Clear": icon = "☀️"; break;
    case "Clouds": icon = "⛅"; break;
    case "Rain": icon = "🌧️"; break;
    case "Drizzle": icon = "🌦️"; break;
    case "Thunderstorm": icon = "⛈️"; break;
    case "Snow": icon = "❄️"; break;
    case "Mist":
    case "Fog":
    case "Haze": icon = "🌫️"; break;
    default: icon = "❓";
  }

  updateBackground(weatherMain);

  const html = `
    <div class="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 space-y-2 text-center">
      <h2 class="text-2xl font-bold">${data.name}, ${data.sys.country}</h2>
      <div class="text-5xl">${icon}</div>
      <p class="text-gray-800 text-lg">${weatherMain}</p>
      <p>🌡️ <strong>${data.main.temp} °C</strong></p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind: ${data.wind.speed} m/s</p>
      <p class="italic text-gray-500">Updated just now</p>
    </div>
  `;
  weatherInfo.innerHTML = html;
}

function updateBackground(weatherMain) {
  const body = document.body;
  body.className = "";

  switch (weatherMain) {
    case "Clear":
      body.className = "bg-gradient-to-br from-yellow-100 via-yellow-200 to-white text-black";
      break;
    case "Clouds":
      body.className = "bg-gradient-to-br from-gray-200 via-gray-100 to-white text-black";
      break;
    case "Rain":
    case "Drizzle":
      body.className = "bg-gradient-to-br from-blue-300 via-blue-500 to-gray-200 text-white";
      break;
    case "Thunderstorm":
      body.className = "bg-gradient-to-br from-purple-800 via-gray-800 to-black text-white";
      break;
    case "Snow":
      body.className = "bg-gradient-to-br from-blue-100 via-white to-gray-100 text-black";
      break;
    case "Mist":
    case "Fog":
    case "Haze":
      body.className = "bg-gradient-to-br from-gray-300 via-gray-100 to-white text-black";
      break;
    default:
      body.className = "bg-white text-black";
  }
}

async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    const labels = [];
    const temps = [];

    // Ambil data setiap 3 jam, tapi kita pilih satu per 8 jam (3x8 = 24 jam)
    for (let i = 0; i < data.list.length; i += 8) {
      const time = new Date(data.list[i].dt_txt);
      labels.push(time.toLocaleDateString("en-MY", { weekday: "short" }));
      temps.push(data.list[i].main.temp);
    }

    drawChart(labels, temps);
  } catch (error) {
    console.error("Forecast error:", error);
  }
}

function drawChart(labels, temps) {
  const ctx = document.getElementById("weatherChart").getContext("2d");

  if (weatherChart) weatherChart.destroy(); // Reset chart dulu

  weatherChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Forecast (°C)",
        data: temps,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#1e40af"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          title: { display: true, text: "Temperature (°C)" },
          beginAtZero: false
        }
      }
    }
  });
}
