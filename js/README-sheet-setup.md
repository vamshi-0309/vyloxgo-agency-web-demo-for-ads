# Connect the Contact form to a Google Sheet

Every submission on `contact.html` (name, business name, phone, business type)
can land straight into a Google Sheet — no separate backend server needed.
Takes about 5 minutes, one-time setup.

## 1. Create the sheet
1. Go to [sheets.google.com](https://sheets.google.com) → new blank spreadsheet.
2. Name it something like `Vyloxgo Contact Leads`.

## 2. Add the script
1. In the sheet, go to **Extensions → Apps Script**.
2. Delete anything in the editor and paste the contents of `sheet-backend.gs` (in this same folder).
3. Click **Save** (the disk icon).

## 3. Deploy it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. Google will ask you to authorize — approve it (it's your own script).
5. Copy the **Web app URL** it gives you (ends in `/exec`).

## 4. Connect it to the website
1. Open `js/contact.js`.
2. Find this line near the top:
   ```js
   const WEBHOOK_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the placeholder with the URL you copied. Keep the quotes.
4. Save, redeploy the site (push to GitHub / re-upload).

## 5. Test it
1. Open your live `contact.html` page.
2. Submit a test entry.
3. Check your Google Sheet — a new tab called **Contact Leads** should appear with the row.

## Notes
- Until you do this setup, the form still works — it just opens an email
  to `vylox@gmail.com` with the details pre-filled instead of writing to a sheet.
- If you ever redeploy the Apps Script with changes, choose **Manage deployments →
  Edit → New version** so the same URL keeps working.
- Want leads split per client instead of one shared sheet? Duplicate the
  spreadsheet + script for each client and swap the URL in their copy of `contact.js`.
