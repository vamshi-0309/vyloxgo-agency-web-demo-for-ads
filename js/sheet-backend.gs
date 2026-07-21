/**
 * Vyloxgo — contact form → Google Sheet
 * ---------------------------------------------------
 * This runs inside Google Apps Script (script.google.com), NOT in the
 * website itself. It receives the form submission and appends a row
 * to a Google Sheet, exactly like your WhatsApp bot's lead sheet.
 *
 * Setup: see README-sheet-setup.md in this same folder.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Contact Leads');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Contact Leads');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Business Name', 'Phone Number', 'Business Type']);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.business || '',
    data.phone || '',
    data.businessType || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
