class Helper {
  constructor() {
    this.app = new App();

    this.parsers = {
      date: (date) => {
        date = date.replace(/,|-|\//g, ',');

        if (date.includes(' ')) date = date.substring(0, date.indexOf(' '));

        const values = date.split(',');

        // The date string is reversed (dd,MM,YYYY)
        if (values[2].length === 4) {
          const year = values[2];
          const day = values[0];

          values[0] = year;
          values[2] = day;
        }

        return `${values[0]},${values[1]},${values[2]}`;
      }
    }

    this.parameters = {
      get: (name) => {
        const param = this.app.sheets.settings.createTextFinder(name).matchEntireCell(true).findNext();
        const values = this.app.sheets.settings
          .getRange(param.getRowIndex() + 1, param.getColumn(), this.app.sheets.settings.getLastRow(), 1)
          .getDisplayValues();
        const parsedValues = [];

        this.array.filterMap(values, (v) => {
          const value = v[0];

          if (value === '') return 'break';

          parsedValues.push(value === 'None' ? null : (isNaN(+value) ? value : +value));
        });

        return parsedValues.length === 1 ? parsedValues[0] : parsedValues;
      }
    };

    this.sheet = {
      editCell: (sheet, value, row, column, numRows, numCols, merge, style) => {
        const cell = sheet.getRange(row, column, numRows ? numRows : 1, numCols ? numCols : 1);

        if (value !== null) {
          const isFormula = value.charAt(0) === '=';
          isFormula ? cell.setFormula(value) : cell.setValue(value);
          
          if (merge === true) cell.merge().setHorizontalAlignment('center');
        }

        if (style) {
          const { backgroundColor, fontColor, border } = style;

          if (border) {
            if (border.all === true)
              cell.setBorder(true, true, true, true, true, true, border.color, border.style);
            else
              cell.setBorder(border.top, border.left, border.bottom, border.right, border.vertical, border.horizontal, border.color, border.style);
          }
          if (backgroundColor) cell.setBackground(backgroundColor);
          if (fontColor) cell.setFontColor(fontColor);
        }
      }
    };

    this.googleFin = {
      add: (ticker, column, startDate, endDate, isForBenchmark = false, isForCurrencyExchange = false) => {
        const sheet = app.sheets.data;

        // Add ticker title
        this.sheet.editCell(sheet, ticker, 1, column, 1, 2, true, {
          backgroundColor: isForBenchmark ? '#93c47d' : (isForCurrencyExchange ? '#ffd966' : '#ff9900'),
          fontColor: 'black',
          border: { all: true }
        });

        // Add ticker currency
        this.sheet.editCell(sheet, isForCurrencyExchange ? 'EXCHANGE' : `=GOOGLEFINANCE("${ticker}", "currency")`, 2, column, 1, 2, true, {
          backgroundColor: '#666666',
          fontColor: 'white',
          border: { all: true }
        });

        // Add GOOGLE FINANCE funct
        this.sheet.editCell(sheet, `=GOOGLEFINANCE("${ticker}", "price", DATE(${startDate}), DATE(${endDate}), "DAILY")`, 3, column, 1, 1, false);
        this.sheet.editCell(sheet, null, 3, column, 1, 2, false, {
          backgroundColor: '#434343',
          fontColor: 'white',
          border: { all: true }
        });

        // Data did not load correctly
        if (sheet.getRange(3, column).getDisplayValue() !== 'Date')
          return -1;
      },
      getPrices: (dataRow, column) => {
        const values = this.app.sheets.data.getRange(dataRow + 1, column, this.app.sheets.data.getLastRow(), 2).getDisplayValues();
        const dataObj = [];
        let rows = 0;

        this.array.filterMap(values, (v) => {
          if (v[0] === '') return 'break';

          dataObj.push({ date: this.parsers.date(v[0]), price: +v[1] });
          rows++;
        });

        // Change style of current row
        this.sheet.editCell(this.app.sheets.data, null, dataRow + 1, column, rows, 2, false, {
          backgroundColor: '#434343',
          fontColor: 'white',
          border: { all: true }
        });

        return dataObj;
      }
    };

    this.array = {
      filterMap: (array, fnCallback) => {
        const arrayLen = array.length;
        for (let i = 0; i < arrayLen; i++)
          if (fnCallback(array[i], i) === 'break') break;
      }
    };
  }
}