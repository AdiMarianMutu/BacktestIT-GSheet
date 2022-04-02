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
          }
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