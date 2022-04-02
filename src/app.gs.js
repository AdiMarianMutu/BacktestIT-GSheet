class App {
  constructor() {
    this.activeSheet = this.get().getActiveSpreadsheet();

    this.sheets = {
      settings: this.activeSheet.getSheetByName('Settings'),
      data: this.activeSheet.getSheetByName('_data_')
    }
  }

  get() { return SpreadsheetApp; }
}