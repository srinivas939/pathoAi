// scripts/parseK6Summary.js
// Alias wrapper for CommonJS version parseK6Summary.cjs
const { parseAndGenerateReports, getMetricValue } = require('./parseK6Summary.cjs');

module.exports = { parseAndGenerateReports, getMetricValue };

if (require.main === module) {
  const argFile = process.argv[2];
  parseAndGenerateReports(argFile).catch(err => {
    console.error('Error parsing k6 summary:', err);
    process.exit(1);
  });
}
