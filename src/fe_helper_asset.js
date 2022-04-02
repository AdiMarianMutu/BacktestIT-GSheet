<script>
  class HAsset {
    constructor(mainHelper) {
      this.h = mainHelper;
    }

    interface(data, isHybridView = false, doNotOverrideValues = false) {
      if (doNotOverrideValues) return data;

      const {
        index, // Index of the current iteration
        lastAssetRecord,
        orderPlacedDate,
        orderExecutionDate,
        sharePrice,
        investedAmt,
        _ticker
      } = data;
      const sharesBought = isHybridView ? 0 : this.h.asset.calculateAmountOfBoughtSharesPerPrice(investedAmt, sharePrice);
      const sharesOwned = sharesBought + (index === 0 ? 0 : lastAssetRecord.sharesOwned);

      return {
        orderPlacedDate,
        orderExecutionDate: isHybridView ? undefined : orderExecutionDate,
        investedAmt: isHybridView ? 0 : investedAmt,
        investedTot:
          // When we reached the hybrid view, we just update the value of the asset
          isHybridView ? 
            lastAssetRecord.investedTot :
            investedAmt + (index === 0 ? 0 : lastAssetRecord.investedTot),

        sharePrice,
        sharesBought,
        sharesOwned,
        value: this.h.asset.numberToFixed(index === 0 ? investedAmt : sharesOwned * sharePrice, this.h._b.DECIMAL_PLACES),
        _ticker
      };
    }

    getMainDataByTicker(ticker, isForBenchmark = false) {
      if (isForBenchmark) return this.h._b.data.benchmark;

      return this.h._b.data.assets.find((a) => a.ticker === ticker);
    }

    calculateAmountFromAllocation(allocation, amount) {
      return this.numberToFixed((allocation / 100) * amount, 2);
    }

    calculateAmountOfBoughtSharesPerPrice(amountInvested, sharePrice) {
      if (sharePrice === 0) return 0;

      return amountInvested / sharePrice;
    }

    calculateSharePriceInLocalCurrency(sharePrice, assetCurrency, date) {
      if (sharePrice === 0) return 0;

      const exchangeValues = this.h._b.data.exchanges.filter((exc) => exc.currency === assetCurrency)[0];
      const localSharePrice = this.getPriceByDate(exchangeValues, date, this.h._b.TO, true).price;

      sharePrice = sharePrice * localSharePrice;

      return sharePrice;
    }

    getPriceByDate(asset, date, maximumDate = null, usedForCurrencyExchange = false) {
      const assetData = asset.data[this.h.date.arrayGetIndexByDate(asset.data, date, maximumDate)];

      // For the case when the asset does not have enough historical data
      if (assetData === undefined) return { price: 0 };

      let sharePrice = assetData.price;

      if (usedForCurrencyExchange === false) {
        if (asset.currency !== this.h._b.CURRENCY && asset.currency !== '#N/A')
          sharePrice = this.calculateSharePriceInLocalCurrency(sharePrice, asset.currency, date);
      }

      return {
        price: this.numberToFixed(sharePrice, 2),
        date: this.h.date.newDateObj(assetData.date)
      };
    }

    sumAssetValues(asset, keyValue = undefined) {
      return asset.reduce((r, a) => {
        a.forEach((b, i) => {
          r[i] = (r[i] || 0) + (keyValue ? b[keyValue] : b);
        });

        return r;
      }, []);
    }

    cashflowCondition(index, currentDate, date) {
      return index === 0 || (
        // The monthly view
        (this.h._b.CASHFLOW === 'monthly' && (currentDate.getMonth() !== date.obj.month)) ||
        // The annually view
        (this.h._b.CASHFLOW === 'annually' && (
          // For past years
          (currentDate.getFullYear() !== date.obj.year) ||
          // For the current year the view is a year/month hybrid
          (currentDate.getFullYear() === this.h._b.TO.getFullYear() && currentDate.getMonth() !== date.obj.month)
        ))
      );
    }

    timeframeViewCondition(index, currentDate, date) {
      return index === 0 || (
        // The monthly view
        (this.h._b.TIMEFRAME_VIEW === 'monthly' && (currentDate.getMonth() !== date.obj.month)) ||
          // The annually view
          (this.h._b.TIMEFRAME_VIEW === 'annually' && (
            // For past years
            (currentDate.getFullYear() !== date.obj.year) ||
            // For the current year the view is a year/month hybrid
            (currentDate.getFullYear() === this.h._b.TO.getFullYear() && currentDate.getMonth() !== date.obj.month)
        ))
      );
    }

    numberToFixed(number, decimalPlaces) {
      return parseFloat(number.toFixed(decimalPlaces));
    }
  }
</script>