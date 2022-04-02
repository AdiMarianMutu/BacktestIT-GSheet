<script>
  {{helper_date.js}}
  {{helper_asset.js}}
  {{helper_chart.js}}

  class Helpers {
    constructor(backtestObj) {
      this._b = backtestObj;

      this.date = new HDate(this);
      this.asset = new HAsset(this);
      this.chart = new HChart(this);
    }

    dataAdaptMonthlyCashflowToAnnuallyView() {
      const _do = (_asset, isForBenchmark = false) => {
        _asset.forEach((asset, i) => {
          let currentDate = this.date.newDateObj(asset[0].orderPlacedDate);
          const annuallyView = [];
          let totalInvestment;

          if (isForBenchmark === false) totalInvestment = [];

          asset.forEach((asset, index) => {
            const date = this.date.newDateObj(asset.orderPlacedDate);
            const isHybridView = currentDate.getFullYear() === this._b.TO.getFullYear() && currentDate.getMonth() !== date.getMonth();

            if (index === 0 ||
              // It will generate an hybrid view, where the last year is shown as a monthly view
              ((currentDate.getFullYear() != date.getFullYear()) || isHybridView) 
            ) {
              const lastAssetRecord = index === 0 ? undefined : annuallyView[annuallyView.length - 1];
              const orderPlacedDate = date;

              annuallyView.push(this.asset.interface(asset, false, true));

              if (isForBenchmark === false) totalInvestment.push(asset.investedTot);

              currentDate = date;
            }
          });

          if (isForBenchmark === false) {
            this._b.assets[i] = annuallyView;
            this._b.amountInvested[i] = totalInvestment;
          } else
            this._b.benchmark = annuallyView;
        });
      };

      _do(this._b.assets, false);
      if (this._b.data.benchmark !== null) _do([this._b.benchmark], true);
    }

    dataAdaptAnnuallyCashflowToMonthlyView() {
      const _do = (_asset, assetIndex, isForBenchmark = false) => {
        let currentDate = this.date.newDateObj(this._b.FROM);
        const monthlyView = [];
        let totalInvestment;

        if (isForBenchmark === false) totalInvestment = [];

        this.date.iterateOverTimeframe(this._b.FROM, this._b.TO, (index, date) => {
          if (this.asset.timeframeViewCondition(index, currentDate, date)) {
            const assetData = _asset[this.date.arrayGetIndexByDate(_asset, date.obj.self, null, 'orderPlacedDate')];
            const orderPlacedDate = date.obj.self;
            let lastAssetRecord;
            let orderExecutionDate;
            let sharePrice;
            let investedAmt;
            let _ticker;
            
            if (assetData) {
              lastAssetRecord = monthlyView[monthlyView.length - 1];
              orderExecutionDate = assetData.orderExecutionDate;
              sharePrice = assetData.sharePrice;
              investedAmt = assetData.investedAmt;
              _ticker = assetData._ticker;

              monthlyView.push(this.asset.interface({
                index,
                lastAssetRecord,
                orderPlacedDate,
                orderExecutionDate,
                sharePrice,
                investedAmt,
                _ticker
              }, false));

              if (isForBenchmark === false) totalInvestment.push(assetData.investedTot);
            } else {
              lastAssetRecord = monthlyView[monthlyView.length - 1];
              orderExecutionDate = lastAssetRecord.orderExecutionDate;
              sharePrice = this.asset.getPriceByDate(this.asset.getMainDataByTicker(lastAssetRecord._ticker, isForBenchmark), orderPlacedDate, this.date.getLastDayOfMonth(orderPlacedDate)).price;
              investedAmt = lastAssetRecord.investedAmt;
              _ticker = lastAssetRecord._ticker;

              monthlyView.push(this.asset.interface({
                index,
                lastAssetRecord,
                orderPlacedDate,
                orderExecutionDate,
                sharePrice,
                investedAmt,
                _ticker
              }, true));

              if (isForBenchmark === false) totalInvestment.push(index === 0 ? 0 : totalInvestment[totalInvestment.length - 1]);
            }

            currentDate = this.date.newDateObj(date.obj.self);
          }
        });

        if (isForBenchmark === false) {
          this._b.assets[assetIndex] = monthlyView;
          this._b.amountInvested[assetIndex] = totalInvestment;
        } else
          this._b.benchmark = monthlyView;
      };

      this._b.assets.forEach((asset, i) => {
        _do(asset, i, false);
      });
      
      if (this._b.data.benchmark !== null) _do(this._b.benchmark, null, true);
    }

    dataLoadedWithSuccess() {
      if (this._b.settings._dataStatus === -1) return false;

      if (this._b.data.benchmark !== null)
        if (this._b.data.benchmark.length === 0) return false;

      if (this._b.data.exchanges !== null)
        for (const e of this._b.data.exchanges)
          if (e.data.length === 0) return false;

      for (const a of this._b.data.assets)
        if (a.data.length === 0) return false;

      return true;
    }

    static showError({title, message, userSettings}, stack) {
      $('.main-container').css('display', 'none');

      const container = $('#error-msg');
      container.find('h1').html(`<b>${title}</b>`);
      container.find('h2').html(`${message}.<br><p style="font-size: 1.1rem;">Close this window and try again<br>or<br>If the issue persists, click <a target="_blank" href="<?github_repo_issues_url?>">here</a> to open a new issue on the <b>official GitHub repository</b>.<br><i><b>Please do not forget to add the error details shown below</b></i></p>`);

      const errorInfoContainer = $('.stack-error');
      
      if (stack) {
        const stackContainer = $(errorInfoContainer.find('.container')[0]);
        const name = stackContainer.find('#stack-name');
        const message = stackContainer.find('#stack-message');
        const error = stackContainer.find('#stack-e');

        name.html(`<b>${stack.name}</b>`);
        message.html(`<b>${stack.message}</b>`);
        error.html(stack.error);
      }
      if (userSettings) {
        const userSettingsContainer = errorInfoContainer.find('.user-settings-container');
        userSettingsContainer.find('p').html(`<b>${JSON.stringify(userSettings)}</b>`);
      }

      if (stack || userSettings) errorInfoContainer.css('display', 'block');

      $('#error-msg').css('display', 'flex');
    }
  }
</script>