let financeChart;

async function getCryptoData() {
  const crypto = document.getElementById("cryptoInput").value.toLowerCase();
  const days = document.getElementById("daysFilter").value;
  const infoDiv = document.getElementById("financeInfo");
  const chartCanvas = document.getElementById("financeChart");

  if (!crypto) {
    infoDiv.innerHTML = `<p class="text-red-600 font-semibold">Please enter a cryptocurrency name.</p>`;
    if (financeChart) financeChart.destroy();
    return;
  }

  infoDiv.innerHTML = `<p class="text-green-700 font-semibold">Loading data for ${crypto}...</p>`;

  try {
    // Fetch market data
    const marketRes = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}`);
    if (!marketRes.ok) throw new Error("Cryptocurrency not found");

    const marketData = await marketRes.json();

    const {
      image,
      market_data: {
        current_price,
        price_change_percentage_24h,
        high_24h,
        low_24h
      }
    } = marketData;

    // Display info
    infoDiv.innerHTML = `
      <div class="bg-white p-6 rounded-xl shadow-lg border border-green-300">
        <div class="flex items-center gap-4 mb-4">
          <img src="${image.thumb}" alt="Icon" class="w-12 h-12 rounded-full shadow-md" />
          <h2 class="text-2xl font-bold text-green-900">${marketData.name} (${marketData.symbol.toUpperCase()})</h2>
        </div>
        <p><strong>Current Price:</strong> $${current_price.usd.toLocaleString()}</p>
        <p><strong>24h Change:</strong> <span class="${price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}">${price_change_percentage_24h.toFixed(2)}%</span></p>
        <p><strong>High 24h:</strong> $${high_24h.usd.toLocaleString()}</p>
        <p><strong>Low 24h:</strong> $${low_24h.usd.toLocaleString()}</p>
      </div>
    `;

    // Fetch price history based on days selected
    const chartRes = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${days}`);
    if (!chartRes.ok) throw new Error("Failed to fetch price history");

    const chartData = await chartRes.json();

    const labels = chartData.prices.map(price => {
      const date = new Date(price[0]);
      // Format label nicely depending on days
      if (days <= 7) {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      } else {
        return date.toLocaleDateString();
      }
    });

    const prices = chartData.prices.map(price => price[1]);

    // Destroy old chart if exists
    if (financeChart) financeChart.destroy();

    financeChart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Price (USD)",
          data: prices,
          borderColor: "#059669",
          backgroundColor: "rgba(5, 150, 105, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 5,
        }]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => `$${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: val => "$" + val.toLocaleString()
            },
            beginAtZero: false
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 30
            }
          }
        }
      }
    });

  } catch (error) {
    infoDiv.innerHTML = `<p class="text-red-600 font-semibold">Error: ${error.message}</p>`;
    if (financeChart) financeChart.destroy();
  }
}
