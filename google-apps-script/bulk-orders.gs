// NeuroAdaptive Leadership — Bulk Order Form Backend
// Google Apps Script Web App
//
// SETUP INSTRUCTIONS:
// 1. Go to sheets.google.com → create a new spreadsheet → name it "NAL Bulk Orders"
// 2. In the spreadsheet, click Extensions → Apps Script
// 3. Delete any existing code and paste this entire file
// 4. Click Save (disk icon)
// 5. Click Deploy → New Deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Click Deploy → copy the Web App URL
// 7. Open bulk-buyer.html in your code editor
//    and replace YOUR_APPS_SCRIPT_WEB_APP_URL with the copied URL
// 8. Save and push to GitHub

const NOTIFICATION_EMAIL = 'drj@drjasonjones.com';
const SHEET_NAME = 'Bulk Orders';
const THANK_YOU_URL = 'https://neuroadaptiveleadership.com/thank-you.html';

function doPost(e) {
  try {
    const p = e.parameter;

    const name         = p.name         || '';
    const organization = p.organization || '';
    const address      = p.address      || '';
    const phone        = p.phone        || '';
    const email        = p.email        || '';
    const quantity     = parseInt(p.quantity) || 0;
    const bookType     = p.bookType     || 'paperback';
    const pricePerBook = bookType === 'hardcover' ? 23 : 15;
    const estTotal     = pricePerBook * quantity;

    // ── Write to Google Sheet ──────────────────────
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp', 'Name', 'Organization', 'Address',
        'Phone', 'Email', 'Quantity', 'Book Type',
        'Price / Book', 'Est. Total'
      ]);
      // Freeze header row
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      name,
      organization,
      address,
      phone,
      email,
      quantity,
      bookType.charAt(0).toUpperCase() + bookType.slice(1),
      '$' + pricePerBook,
      '$' + estTotal
    ]);

    // ── Email Jason ────────────────────────────────
    GmailApp.sendEmail(
      NOTIFICATION_EMAIL,
      'New Bulk Order Request — ' + name + ' · ' + quantity + ' copies',
      'A new bulk order request has been submitted on neuroadaptiveleadership.com.\n\n' +
      '─────────────────────────────────────\n' +
      'CONTACT INFORMATION\n' +
      '─────────────────────────────────────\n' +
      'Name:          ' + name + '\n' +
      'Organization:  ' + organization + '\n' +
      'Address:       ' + address + '\n' +
      'Phone:         ' + phone + '\n' +
      'Email:         ' + email + '\n\n' +
      '─────────────────────────────────────\n' +
      'ORDER DETAILS\n' +
      '─────────────────────────────────────\n' +
      'Quantity:      ' + quantity + ' copies\n' +
      'Format:        ' + bookType.charAt(0).toUpperCase() + bookType.slice(1) + '\n' +
      'Price / Book:  $' + pricePerBook + '\n' +
      'Est. Total:    $' + estTotal + '\n\n' +
      '─────────────────────────────────────\n\n' +
      'Please reach out to ' + name + ' at ' + email +
      ' (or ' + phone + ') to process payment.\n\n' +
      'View all orders in the NAL Bulk Orders spreadsheet in your Google Drive.'
    );

    // ── Confirmation email to customer ─────────────
    if (email) {
      GmailApp.sendEmail(
        email,
        'We received your bulk order request — NeuroAdaptive Leadership',
        'Dear ' + name + ',\n\n' +
        'Thank you for your interest in purchasing NeuroAdaptive Leadership in bulk!\n\n' +
        'Here is a summary of your request:\n\n' +
        '  Quantity:  ' + quantity + ' ' + bookType + ' ' + (quantity === 1 ? 'copy' : 'copies') + '\n' +
        '  Est. Total: $' + estTotal + ' (payment to be collected by our team)\n\n' +
        'Someone from our team will reach out to you within 1–2 business days ' +
        'to collect your payment information and confirm your order.\n\n' +
        'Please allow four to six weeks for printing and delivery once payment is confirmed.\n\n' +
        'Best regards,\n' +
        'Jason Jones, Ph.D.\n' +
        'NeuroAdaptive Leadership\n' +
        'neuroadaptiveleadership.com'
      );
    }

  } catch (err) {
    Logger.log('Bulk order error: ' + err.message);
  }

  // Always redirect to the thank-you page
  return HtmlService.createHtmlOutput(
    '<html><head>' +
    '<meta http-equiv="refresh" content="0;url=' + THANK_YOU_URL + '">' +
    '</head><body>' +
    '<p>Redirecting... <a href="' + THANK_YOU_URL + '">Click here if not redirected</a></p>' +
    '</body></html>'
  );
}
