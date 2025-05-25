let financeChart;

async function getCryptoData() {
  const crypto = document.getElementById("cryptoInput").value.toLowerCase();
  const infoDiv = document.getElementById("financeInfo");
  const chartCanvas = document.getElementById("financeChart");

  infoDiv.innerHTML = "Loading...";

  try {
    // Fetch market data
    const marketRes = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}`);
    if (!marketRes.ok) throw new Error("Invalid cryptocurrency");

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
      <div class="bg-white p-4 rounded-lg shadow-md">
        <div class="flex items-center gap-3 mb-3">
          <img src="${image.thumb}" alt="Icon" class="w-10 h-10">
          <h2 class="text-xl font-semibold">${marketData.name} (${marketData.symbol.toUpperCase()})</h2>
        </div>
        <p><strong>Current Price:</strong> $${current_price.usd.toLocaleString()}</p>
        <p><strong>24h Change:</strong> ${price_change_percentage_24h.toFixed(2)}%</p>
        <p><strong>High 24h:</strong> $${high_24h.usd.toLocaleString()}</p>
        <p><strong>Low 24h:</strong> $${low_24h.usd.toLocaleString()}</p>
      </div>
    `;

    // Fetch price history
    const chartRes = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=7`);
    const chartData = await chartRes.json();

    const labels = chartData.prices.map(price => {
      const date = new Date(price[0]);
      return `${date.getMonth() + 1}/${date.getDate()}`;
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
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              callback: value => "$" + value.toLocaleString()
            }
          }
        }
      }
    });

  } catch (error) {
    infoDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    if (financeChart) financeChart.destroy();
  }
}
