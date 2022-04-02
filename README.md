# Backtest-IT (Using Google Sheet) - Useful to backtest a stock/crypto portfolio

## Instructions
Create a new Google Spreadsheet file, add all the files from the `src` folder to the `AppScript` console (`Extensions > AppScript`).<br>

<b>When creating a file with an extension `.gs.js` (from the `src` folder) inside the AppScript, do <i>not</i> add any extension.<br>
The files with `.js`/`.css` must be created as `HTML` files in AppScript.</b><br>

You must also rename the first worksheet to `Settings` and add a new one named `_data_`.<br>
<b>Inside the `Settings` worksheet you must have the exact parameters shown in the screenshot below. (<i>Of course you can change them based on your assets/timeframe and so on</i>)</b><br>
<p align="center">
    <img alt="Official Logo" src="/resources/parameters.png" width="850" /><br/>
</p>
<br>

<b>
- You can use any ticker available from Google.<br>
- When using an asset which is not available in your local currency, the script will automatically convert the foreign asset price to the local currency at the moment in time when the transaction would have been bought.</b>