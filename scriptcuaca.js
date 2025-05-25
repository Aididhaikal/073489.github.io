async function getWeatherData() {
  const city = document.getElementById('cityInput').value;
  const apiKey = 'f885eadd34335a07e8846fcc212d32db'; 
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    document.getElementById('weatherInfo').innerText = 'City not found.';
    return;
  }

  const data = await response.json();
  document.getElementById('weatherInfo').innerHTML = `
    <strong>${data.name}</strong><br/>
    Temperature: ${data.main.temp}°C<br/>
    Weather: ${data.weather[0].description}
  `;

  // Dummy chart data (boleh ganti dengan API 5-day forecast kalau nak)
  const ctx = document.getElementById('weatherChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Temperature (°C)',
        data: [22, 24, 23, 26, 25],
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderColor: 'black',
        borderWidth: 2,
        fill: true,
        tension: 0.4
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
