<script>
  class HChart {
    constructor(mainHelper) {
      this.h = mainHelper;

      this.data = {
        labels: [],
        datasets: []
      };
    }

    initialize() {
      this.data.labels = this.generateLabels();
      this._insertData();
      
      {{chart_config.js}}
    }

    generateLabels() {
      let currentDate = this.h.date.newDateObj(this.h._b.FROM);
      let labels = [];

      this.h.date.iterateOverTimeframe(this.h._b.FROM, this.h._b.TO, (index, date) => {
        if (this.h.asset.timeframeViewCondition(index, currentDate, date)) {
          labels.push(date.str);

          currentDate = date.obj.self;
        }
      });

      return labels;
    }

    _insertData() {
      const datasets = [];

      // Add to the chart the invested amount
      datasets.push({
        label: 'Investment Amount',
        data: this.h.asset.sumAssetValues(this.h._b.amountInvested),
        fill: false,
        backgroundColor: 'rgba(109, 158, 235, 0.1)',
        borderColor: '#6d9eeb',
        borderDash: [10,5]
      });

      // Add to the chart the whole portfolio
      datasets.push({
        label: 'Portfolio',
        data: this.h.asset.sumAssetValues(this.h._b.assets, 'value'),
        backgroundColor: 'rgba(255, 153, 0, 0.1)',
        borderColor: '#ff9900',
        borderDash: [3,3]
      });

      // Add to the chart the benchmark
      if (this.h._b.data.benchmark !== null) {
        datasets.push({
          label: 'Benchmark',
          data: this.h._b.benchmark.map((v) => v.value),
          backgroundColor: 'rgba(147, 196, 125, 0.1)',
          borderColor: '#93c47d',
          borderDash: [5,5]
        });
      }

      // Add to the chart the assets
      this.h._b.data.assets.forEach((a, i) => {
        datasets.push({
          label: a.ticker,
          data: this.h._b.assets[i].map((v) => v.value),
          hidden: true,
        });
      });

      this.data.datasets = this.addDatasets(datasets);
    }

    calcPercentageDifference(x, y) {
      return parseFloat((((x - y) / y) * 100)).toFixed(2);
    }

    addDatasets(datasets) {
      const colors = this.getColors(datasets.length, 0.1);
      const _datasets = [];

      datasets.forEach((ds, i) => {
        _datasets.push({
          label: ds.label,
          fill: true,
          backgroundColor: ds.backgroundColor ?? colors[i].background,
          borderColor: ds.borderColor ?? colors[i].border,
          borderWidth: 2,
          data: ds.data,
          ...ds
        });
      });

      return _datasets;
    }

    getColors(numOfColors, backgroundAlpha) {
      const initialColor = Math.floor(Math.random() * 360);
      const increment = 360 / numOfColors;
      const hsls = [];
      
      for (let i = 0; i < numOfColors; i++) {
        const hslVal = Math.round((initialColor + (i * increment)) % 360);

        hsls.push({
          background: `hsla(${hslVal}, 100%, 50%, ${backgroundAlpha})`,
          border: `hsla(${hslVal}, 100%, 50%)`
        });
      }

      return hsls;
    }
  }
</script>
