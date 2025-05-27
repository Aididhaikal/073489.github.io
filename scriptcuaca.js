const apiKey = "f885eadd34335a07e8846fcc212d32db"; 
let chartInstance = null;

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    if (!weatherRes.ok || !forecastRes.ok) throw new Error("City not found");

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    displayWeather(weatherData);
    displayForecast(forecastData);
    changeBackground(weatherData.weather[0].main);
  } catch (err) {
    alert("Error fetching weather data.");
    console.error(err);
  }
}

function displayWeather(data) {
  const container = document.getElementById("weatherInfo");
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  container.innerHTML = `
    <div class="bg-white p-6 rounded-2xl shadow-md border text-center space-y-2">
      <h2 class="text-xl font-bold text-blue-700">${data.name}, ${data.sys.country}</h2>
      <img src="${icon}" alt="Weather Icon" class="w-20 h-20 mx-auto" />
      <p class="text-lg font-semibold">${data.weather[0].description}</p>
      <p>🌡️ <strong>${data.main.temp}°C</strong> (Feels like ${data.main.feels_like}°C)</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind: ${data.wind.speed} m/s</p>
    </div>
  `;
}

function displayForecast(data) {
  const labels = [];
  const temps = [];

  // Ambil 1 data setiap 8 (3 jam x 8 = 24 jam = 1 hari)
  for (let i = 0; i < data.list.length; i += 8) {
    const entry = data.list[i];
    const date = new Date(entry.dt_txt);
    labels.push(date.toLocaleDateString("en-MY", { weekday: "short", day: "numeric" }));
    temps.push(entry.main.temp);
  }

  const ctx = document.getElementById("weatherChart").getContext("2d");

  if (chartInstance) chartInstance.destroy(); 

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

function changeBackground(condition) {
  const body = document.body;
  const conditions = {
    Clear: "from-yellow-100 via-white to-blue-100",
    Rain: "from-gray-400 via-blue-200 to-gray-100",
    Clouds: "from-gray-200 via-gray-100 to-white",
    Thunderstorm: "from-purple-400 via-blue-300 to-gray-100",
    Snow: "from-blue-100 via-white to-blue-200",
    Mist: "from-gray-100 via-white to-gray-300"
  };

  const defaultClass = "from-blue-100 via-white to-yellow-100";
  const gradientClass = conditions[condition] || defaultClass;

  body.className = `bg-gradient-to-br ${gradientClass} text-black font-sans min-h-screen p-4`;
}
