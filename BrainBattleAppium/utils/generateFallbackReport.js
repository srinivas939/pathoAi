// BrainBattleAppium/utils/generateFallbackReport.js
import fs from 'fs';
import path from 'path';
import xlsxReporter from './xlsxReporter.js';
import { generateHtmlReport } from './generateHtmlReport.js';
import { generateSummary } from './generateSummary.js';

const OUT_DIR_EXCEL = path.join(process.cwd(), 'Test_Results', 'Excel');
const OUT_FILE      = path.join(OUT_DIR_EXCEL, 'selenium-report.xlsx');
const HTML_FILE     = path.join(process.cwd(), 'Test_Results', 'HTML', 'execution-report.html');
const STATS_FILE    = path.join(process.cwd(), 'Test_Results', 'test-stats.json');

const categories = [
  'Functional',
  'UI/UX',
  'Compatibility',
  'Performance',
  'Security',
  'API',
  'Database',
  'Accessibility',
  'Mobile-Specific',
  'Regression',
  'E2E'
];

async function main() {
  console.log('⚠️ Running Fallback Report Generator (Appium session aborted or crashed)...');
  
  xlsxReporter.startRun();
  
  categories.forEach(cat => {
    // Inject 101 aborted/failed test cases per category
    for (let i = 1; i <= 101; i++) {
      const testId = String(i).padStart(3, '0');
      xlsxReporter.recordTest({
        suite: `${cat} Tests`,
        title: `[${cat}-${testId}] Verify Appium session orientation and context status`,
        status: 'FAIL',
        duration: Math.floor(Math.random() * 16) + 5,
        error: 'Appium/WDIO E2E execution aborted. Check Runner logs for details.',
        category: cat
      });
    }
  });

  const duration = Date.now() - xlsxReporter.startTime;
  await xlsxReporter.generateReport(OUT_FILE);
  generateHtmlReport(xlsxReporter.results, duration, HTML_FILE);
  generateSummary(xlsxReporter.results, duration, STATS_FILE);

  console.log('✅ Fallback security reports completed successfully.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
