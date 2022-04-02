class Backend {
  constructor() {
    this.h = new Helper();

    this.sheetSettings = this.h.app.sheets.settings;
    this.sheetData = this.h.app.sheets.data;

    this.settings = {
      startDate: this.h.parsers.date(this.h.parameters.get('Start Date')),
      endDate: this.h.parsers.date(this.h.parameters.get('End Date')),
      timeframeView: this.h.parameters.get('View'),
      contributions: {
        initialAmount: this.h.parameters.get('Initial Amount'),
        cashflow: this.h.parameters.get('Cashflow'),
        amount: this.h.parameters.get('Amount')
      },
      currency: this.h.parameters.get('Currency'),
      benchmark: this.h.parameters.get('Benchmark'), // Benchmark ticker
      tickers: this.h.parameters.get('Ticker'),
      decimalPlaces: this.h.parameters.get('Decimal Places'),
      _dataStatus: -1
    };

    this.data = {
      assets: [],
      exchanges: null,
      benchmark: null
    };
  }

  // Called by the front-end
  getData() {
    this._initData();

    if (this.settings._dataStatus === -1) {
      setDataTabStatus('error');

      return { settings: this.settings };
    }

    setDataTabStatus('ok');
    return { settings: this.settings, data: this.data };
  }

  setDataTabStatus(status) {
    let color = null;

    switch (status) {
      case 'init': color = '#434343'; break;
      case 'ok': color = '#00ff00'; break;
      case 'loading': color = '#ff9900'; break;
      case 'error': color = '#ff0000'; break;
    }
    
    this.h.app.sheets.data.setTabColor(color).activate();
  }


  _initData() {
    this.setDataTabStatus('loading');

    const dataRow = 3;

    // BENCHMARK DATA
    if (this.settings.benchmark !== null) {
      if (this.h.googleFin.add(this.settings.benchmark, 1, this.settings.startDate, this.settings.endDate, true) === -1) return;

      this.data.benchmark = {
        ticker: this.settings.benchmark,
        currency: this.sheetData.getRange(dataRow - 1, 1).getDisplayValue(),
        data: this.h.googleFin.getPrices(dataRow, 1)
      };
    }

    // ASSETS DATA
    let allocation = this.h.parameters.get('%');
    allocation = Array.isArray(allocation) ? allocation : [allocation];
    let assetsCurrentColumn = this.settings.benchmark === null ? 1 : 3;
    const tickers = Array.isArray(this.settings.tickers) ? this.settings.tickers : [this.settings.tickers];

    for (let tickerIndex = 0; tickerIndex < tickers.length; tickerIndex++, assetsCurrentColumn += 2) {
      const ticker = tickers[tickerIndex];

      // Add the GOOGLE FINANCE tickers function to the _data_ sheet
      if (this.h.googleFin.add(ticker, assetsCurrentColumn, this.settings.startDate, this.settings.endDate) === -1) return;

      // Get the prices data
      this.data.assets.push({
        ticker: ticker,
        allocation: allocation[tickerIndex],
        currency: this.sheetData.getRange(dataRow - 1, assetsCurrentColumn).getDisplayValue(),
        data: this.h.googleFin.getPrices(dataRow, assetsCurrentColumn)
      });
    };

    // CURRENCY EXCHANGE DATA
    const currencies = this.data.assets.filter((d) => d.currency !== this.settings.currency && d.currency !== '#N/A').map((d) => d.currency);

    for (let i = 0; i < currencies.length; i++) {
      const c = currencies[i];

      if (this.data.exchanges !== null && this.data.exchanges.some((e) => e.currency === c)) continue;

      // Add the GOOGLE FINANCE currency exchange tickers function to the _data_ sheet
      if(this.h.googleFin.add(`CURRENCY:${c}${this.settings.currency}`, assetsCurrentColumn, this.settings.startDate, this.settings.endDate, false, true) === -1) return;

      // Get the the exchange values
      this.data.exchanges = [];
      this.data.exchanges.push({
        currency: c,
        data: this.h.googleFin.getPrices(dataRow, assetsCurrentColumn)
      });

      assetsCurrentColumn += 2;
    }

    this.settings._dataStatus = 1;
  };
}