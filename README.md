# Backtest-IT (Using Google Sheet) - Useful to backtest a stock/crypto portfolio

## Instructions
### For average user
Just copy the original spreadsheet and edit the `Settings` tab to your needs.
 - Spreadsheet URL: [https://docs.google.com/spreadsheets/d/1FSt_jmLzgepf5z5nTZne8F3A1YYu1t0mVojmqdRHKCE/edit?usp=drivesdk](https://docs.google.com/spreadsheets/d/1FSt_jmLzgepf5z5nTZne8F3A1YYu1t0mVojmqdRHKCE/edit?usp=drivesdk)

1. Extensions > Apps Script
2. Open the `be_init.gs` file (**left side menu**)
3. Click `run` (**top tool bar**)
4. Whenever you want to refresh the data just click on the `Backtest` button (**on the main spreadsheet toolbar, *not the Apps Script page***) then `Refresh`

### For developers
Create a new Google Spreadsheet file, add all the files from the `src` folder to the `Apps Script` console (`Extensions > Apps Script`).<br>

<b>When creating a file with an extension `.gs.js` (from the `src` folder) inside the Apps Script, do <i>not</i> add any extension.<br>
The files with `.js`/`.css` must be created as `HTML` files in Apps Script.</b><br>

You must also rename the first worksheet to `Settings` and add a new one named `_data_`.<br>
<b>Inside the `Settings` worksheet you must have the exact parameters shown in the screenshot below. (<i>Of course you can change them based on your assets/timeframe and so on</i>)</b><br>
<p align="center">
    <img alt="Settings Parameters" src="/resources/parameters.png" width="850" /><br/>
</p>
<br>

When you have completed adding all the files, go to the `be_init.gs` file and click `Run`. It will create a new item menu on the spreadsheet with a `Refresh` button.<br>

## Preview

<p align="center">
    <img alt="Chart Window" src="/resources/chart_example.png" width="900" /><br/>
  Example of the Chart window which will pop-up when running the script.
</p> 

<br><b>
- You can use any ticker available from Google.<br>
- When using an asset which is not available in your local currency, the script will automatically convert the foreign asset price to the local currency at the moment in time when the transaction would have been placed.</b>
