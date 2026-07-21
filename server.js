const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const LEADS_FILE = path.join(__dirname, 'leads.csv');

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static website files
app.use(express.static(__dirname));

// Form submission endpoint
app.post('/api/submit', (req, res) => {
  const { name, business, phone, businessType, submittedAt } = req.body;

  // Format data for CSV
  const timestamp = submittedAt || new Date().toISOString();
  const safeName = (name || '').replace(/"/g, '""');
  const safeBusiness = (business || '').replace(/"/g, '""');
  const safePhone = (phone || '').replace(/"/g, '""');
  const safeBusinessType = (businessType || '').replace(/"/g, '""');

  const csvLine = `"${timestamp}","${safeName}","${safeBusiness}","${safePhone}","${safeBusinessType}"\n`;

  // Write headers if file doesn't exist
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, '"Timestamp","Name","Business Name","Phone Number","Business Type"\n');
  }

  // Append lead to CSV
  fs.appendFile(LEADS_FILE, csvLine, (err) => {
    if (err) {
      console.error('Error saving lead to CSV:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to save lead' });
    }
    console.log(`[Lead Saved]: ${name} (${business})`);
    res.json({ status: 'success' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` Vyloxgo Server is running locally!`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Leads CSV: ${LEADS_FILE}`);
  console.log(`==================================================`);
});
