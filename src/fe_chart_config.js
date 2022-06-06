<script>
  new Chart(
    document.getElementById('chart'),
    {
      type: 'line',
      data: this.data,
      options: {
        borderColor: '#fff',
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff', 
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            displayColors: true,
            backgroundColor: 'rgb(32, 32, 32)',
            callbacks: {
              label: (tooltipItem) => {
                const item = tooltipItem.dataset;
                const lbl = item.label;
                const index = tooltipItem.dataIndex;

                const isPortfolioOrBenchmark = lbl === 'Portfolio' || lbl === 'Benchmark';
                // Using var for hoisting
                if (isPortfolioOrBenchmark) {
                  const amountInvested = this.data.datasets[0].data[index];
                  // Calculating the percentage difference between the portfolio/benchmark relative to the amount invested
                  var profitPercentageDifference = this.h.chart.calcPercentageDifference(item.data[index], amountInvested);

                  profitPercentageDifference = `${profitPercentageDifference < 0 ? `${profitPercentageDifference}` : `+${profitPercentageDifference}`}`;
                }

                return [`${lbl}: ${item.data[index]}${isPortfolioOrBenchmark && profitPercentageDifference != 0 ? ` (${profitPercentageDifference}%)` : ''}`];
              },
            }
          },
        },
        scales: {
          y: {  
            ticks: {
              color: '#fff',
              font: {
                size: 15, 
              },
              beginAtZero: true,
              callback: (label, index, labels) => parseInt(label)
            }
          },
          x: { 
            ticks: {
              color: '#fff', 
              font: {
                size: 14 
              },
              beginAtZero: true
            }
          }
        }
      }
    }
  );
</script>
