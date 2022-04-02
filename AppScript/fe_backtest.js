<script>
  class Backtest {
    constructor({ settings, data }) {
      this.settings = settings;
      this.data = data;

      // Show data from backend
      console.warn(settings, data);
      
      this.h = new Helpers(this);

      if (this.h.dataLoadedWithSuccess() === false) {
        Helpers.showError({title: 'Google Finance Failed to load the data', message: 'Please check the data on the <b>_data_</b> sheet', userSettings: settings});

        return;
      }

      this.CURRENCY = this.settings.currency;
      this.FROM = this.h.date.newDateObj(this.settings.startDate);
      this.TO = this.h.date.newDateObj(this.settings.endDate);
      this.INITIAL_AMOUNT = this.settings.contributions.initialAmount;
      this.AMOUNT = this.settings.contributions.amount;
      this.TIMEFRAME_VIEW = this.settings.timeframeView.toLowerCase();
      this.CASHFLOW = this.settings.contributions.cashflow.toLowerCase();
      this.DECIMAL_PLACES = this.settings.decimalPlaces;

      this.amountInvested = [];
      this.benchmark;
      this.assets = [];

      this.init();
    }

    init() {
      // Get the performance records
      this.generateData();

      if (this.TIMEFRAME_VIEW === 'annually' && this.CASHFLOW === 'monthly') this.h.dataAdaptMonthlyCashflowToAnnuallyView();
      if (this.TIMEFRAME_VIEW === 'monthly' && this.CASHFLOW === 'annually') this.h.dataAdaptAnnuallyCashflowToMonthlyView();

      console.log({ assets: this.assets }, { benchmark: this.benchmark }, { amountInvested: this.amountInvested });

      // Draw the chart
      this.h.chart.initialize();
    }

    generateData() {
      // Assets & amount invested processed data
      this.data.assets.forEach((asset) => {
        const r = this.generateDataForAsset(asset);

        this.assets.push(r.perfRecord);
        this.amountInvested.push(r.investedRecord);
      });

      // Benchmark processed data
      if (this.data.benchmark !== null)
        this.benchmark = this.generateDataForAsset(this.data.benchmark, true).perfRecord;
    }

    generateDataForAsset(asset, isBenchmark = false) {
      let currentDate = this.h.date.newDateObj(this.FROM);
      const perfRecord = [];
      let investedRecord;
      //let sharesAmt = 0;

      if (isBenchmark === false) investedRecord = [];

      this.h.date.iterateOverTimeframe(this.FROM, this.TO, (index, date) => {
        if (this.h.asset.cashflowCondition(index, currentDate, date)) {
          // When in hybrid mode we just update the asset value based on the price
          const isHybridView = this.CASHFLOW === 'annually' && currentDate.getFullYear() === this.h._b.TO.getFullYear();

          const lastAssetRecord = perfRecord[perfRecord.length - 1];
          const orderPlacedDate = date.obj.self;
          const { price: sharePrice, date: orderExecutionDate } = this.h.asset.getPriceByDate(asset, date.obj.self, this.h.date.getLastDayOfMonth(date.obj.self));
          const investedAmt = 
            sharePrice === 0 ? 0 : (
              // The benchmark allocation is always 100%
              this.h.asset.calculateAmountFromAllocation(isBenchmark ? 100 : asset.allocation, index === 0 ? this.INITIAL_AMOUNT : this.AMOUNT)
            );
          const _ticker = asset.ticker;

          perfRecord.push(this.h.asset.interface({
            index,
            lastAssetRecord,
            orderPlacedDate,
            orderExecutionDate,
            sharePrice,
            investedAmt,
            _ticker
          }, isHybridView));

          // Invested amount record
          // (The benchmark does not contribute to the amount spent)
          if (isBenchmark === false) investedRecord.push(isHybridView ? investedRecord[investedRecord.length - 1] : investedAmt + (index > 0 ? investedRecord[investedRecord.length - 1] : 0));

          currentDate = this.h.date.newDateObj(date.obj.self);
        }
      });

      return {
        perfRecord,
        investedRecord
      }
    }
  }
</script>