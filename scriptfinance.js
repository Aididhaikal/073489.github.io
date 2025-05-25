async function getCryptoData() {
  const coin = document.getElementById('cryptoInput').value.toLowerCase();
  const url = `https://api.coingecko.com/api/v3/coins/${coin}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Coin not found');
    const data = await response.json();

    const name = data.name;
    const price = data.market_data.current_price.usd;
    const symbol = data.symbol.toUpperCase();
    const history = await getCryptoMarketChart(coin);

    document.getElementById('cryptoInfo').innerHTML = `
      <strong>${name} (${symbol})</strong><br/>
      Current Price: $${price}
    `;

    const ctx = document.getElementById('cryptoChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: history.dates,
        datasets: [{
          label: `${name} Price (USD)`,
          data: history.prices,
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

  } catch (error) {
    document.getElementById('cryptoInfo').innerText = 'Coin not found or error fetching data.';
  }
}

async function getCryptoMarketChart(coin) {
  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`;
  const response = await fetch(url);
  const data = await response.json();

  const dates = data.prices.map(p => {
    const d = new Date(p[0]);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const prices = data.prices.map(p => p[1].toFixed(2));

  return { dates, prices };
}

