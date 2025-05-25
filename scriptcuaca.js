const apiKey = 'f885eadd34335a07e8846fcc212d32db'; // Ganti dengan API key kamu
const weatherInfo = document.getElementById('weatherInfo');
const cityInput = document.getElementById('cityInput');
const chartCanvas = document.getElementById('weatherChart');
let weatherChart;

// Fungsi utama
async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert("Please enter a city name");

  // API URLs
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);
    
    if (!currentRes.ok || !forecastRes.ok) throw new Error("City not found");

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    displayWeather(currentData);
    displayChart(forecastData);

  } catch (error) {
    alert(error.message);
    weatherInfo.innerHTML = '';
    if (weatherChart) weatherChart.destroy();
  }
}

// Papar cuaca semasa
function displayWeather(data) {
  const html = `
    <div class="bg-gray-100 p-4 rounded-xl shadow">
      <h2 class="text-xl font-bold mb-2">${data.name}, ${data.sys.country}</h2>
      <p class="text-gray-700 mb-1">🌡️ Temperature: ${data.main.temp} °C</p>
      <p class="text-gray-700 mb-1">🌬️ Wind: ${data.wind.speed} m/s</p>
      <p class="text-gray-700 mb-1">💧 Humidity: ${data.main.humidity}%</p>
      <p class="text-gray-700">☁️ Weather: ${data.weather[0].description}</p>
    </div>
  `;
  weatherInfo.innerHTML = html;
}

// Papar carta suhu
function displayChart(data) {
  const labels = [];
  const temps = [];

  // Ambil data 5 hari (setiap 3 jam → pilih waktu 12 tengah hari)
  data.list.forEach(item => {
    if (item.dt_txt.includes("12:00:00")) {
      labels.push(item.dt_txt.split(' ')[0]);
      temps.push(item.main.temp);
    }
  });

  if (weatherChart) weatherChart.destroy();

  weatherChart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temp (°C)',
        data: temps,
        borderColor: 'black',
        backgroundColor: 'rgba(0,0,0,0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
