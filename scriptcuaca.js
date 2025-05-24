const apiKey = 'f885eadd34335a07e8846fcc212d32db'; 
let chart = null;

function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found.");
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const feelsLike = data.main.feels_like;
      const humidity = data.main.humidity;
      const wind = data.wind.speed;
      const condition = data.weather[0].description;
      const cityName = data.name;
      const country = data.sys.country;

      // Isi ke elemen HTML
      document.getElementById('weatherTitle').innerText = `Weather in ${cityName}, ${country}`;
      document.getElementById('temp').innerText = temp.toFixed(2);
      document.getElementById('condition').innerText = condition;
      document.getElementById('humidity').innerText = humidity;
      document.getElementById('wind').innerText = wind;

      document.getElementById('weatherContainer').style.display = 'block';

      renderChart(temp, feelsLike, humidity);
    })
    .catch(err => {
      alert(err.message);
      document.getElementById('weatherContainer').style.display = 'none';
    });
}

function renderChart(temp, feelsLike, humidity) {
  const ctx = document.getElementById('weatherChart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Temperature', 'Feels Like', 'Humidity'],
      datasets: [{
        label: 'Weather Metrics',
        data: [temp, feelsLike, humidity],
        backgroundColor: '#007bff33',
        borderColor: '#007bff',
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#333' }
        },
        x: {
          ticks: { color: '#333' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#333' }
        }
      }
    }
  });
}
