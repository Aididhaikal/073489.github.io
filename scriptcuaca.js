const apiKey = 'f885eadd34335a07e8846fcc212d32db'; 

let chart = null;

function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    alert("Sila masukkan nama bandar atau negeri.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Bandar tidak dijumpai.");
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const feelsLike = data.main.feels_like;
      const humidity = data.main.humidity;
      const weather = data.weather[0].description;
      const cityName = data.name;

      // Tunjukkan data cuaca
      document.getElementById('weatherResult').innerHTML = `
        <h3>Cuaca di ${cityName}</h3>
        <p><strong>Suhu:</strong> ${temp}°C</p>
        <p><strong>Terasa Seperti:</strong> ${feelsLike}°C</p>
        <p><strong>Kelembapan:</strong> ${humidity}%</p>
        <p><strong>Keadaan:</strong> ${weather}</p>
      `;

      document.getElementById('weatherContainer').style.display = 'block';
      renderChart(temp, feelsLike, humidity);
    })
    .catch(error => {
      document.getElementById('weatherResult').innerHTML = `<p style="color:red;">${error.message}</p>`;
      document.getElementById('weatherContainer').style.display = 'none';
    });
}

function renderChart(temp, feelsLike, humidity) {
  const ctx = document.getElementById('weatherChart').getContext('2d');

  if (chart !== null) {
    chart.destroy(); // Buang carta lama jika ada
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Suhu', 'Terasa Seperti', 'Kelembapan'],
      datasets: [{
        label: 'Data Cuaca',
        data: [temp, feelsLike, humidity],
        backgroundColor: ['#00bcd4', '#2196f3', '#ffc107']
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });
}
