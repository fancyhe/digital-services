function forcerefresh2() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");
    var range = spreadsheet.getRange('D1');

    // Avoid content clear - will trigger updates twice
    // range.clearContent();
    // SpreadsheetApp.flush();

    range.setValue(new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
}