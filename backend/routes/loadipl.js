const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function loadIPLData() {
  return new Promise((resolve, reject) => {
    const results = [];

    // ✅ Correct relative path using `path.resolve`
    const filePath = path.resolve(__dirname, '../matches.csv');

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        console.log(`📊 IPL dataset loaded with ${results.length} records`);
        resolve(results);
      })
      .on('error', (err) => {
        console.error("❌ Failed to load IPL data:", err);
        reject(err);
      });
  });
}

module.exports = loadIPLData;
