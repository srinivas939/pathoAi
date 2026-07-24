// BrainBattleAppium/wdio.conf.js
import fs from 'fs';
import path from 'path';
import xlsxReporter from './utils/xlsxReporter.js';
import { generateHtmlReport } from './utils/generateHtmlReport.js';
import { generateSummary } from './utils/generateSummary.js';

const RESULTS_JSONL = path.join(process.cwd(), '.wdio-results.jsonl');

export const config = {
  runner: 'local',
  port: 4723,
  specs: [
    process.env.WDIO_CI_SPEC || './tests/12_e2e/mega_android_1100.test.js'
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '10.0',
    'appium:automationName': 'UiAutomator2',
    'appium:app': path.join(process.cwd(), 'android/app/build/outputs/apk/debug/app-debug.apk'),
    'appium:appPackage': 'com.pathoai.app',
    'appium:appActivity': 'com.pathoai.app.MainActivity',
    'appium:newCommandTimeout': 240,
    'appium:noReset': false,
    'appium:isHeadless': true
  }],
  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },

  // ── HOOKS ────────────────────────────────────────────────────────
  onPrepare: function () {
    // Initialize results JSONL file
    if (fs.existsSync(RESULTS_JSONL)) {
      fs.unlinkSync(RESULTS_JSONL);
    }
    xlsxReporter.startRun();
  },

  afterTest: function (test, context, { error, result, duration, passed }) {
    const testResult = {
      suite: test.parent || 'General',
      title: test.title,
      status: passed ? 'PASS' : 'FAIL',
      duration: duration || 0,
      error: error ? error.message : '',
      category: test.parent ? test.parent.split(' ')[0] : 'General'
    };

    // Write incrementally to JSONL
    fs.appendFileSync(RESULTS_JSONL, JSON.stringify(testResult) + '\n', 'utf8');
  },

  after: function (result, capabilities, specs) {
    // Intercept fatal crash setups
    if (result !== 0 && resultsEmpty()) {
      const fallbackResult = {
        suite: 'Setup',
        title: 'Fatal Appium or Application crash during initial setup',
        status: 'FAIL',
        duration: 1000,
        error: 'WebDriverIO execution failed early; Appium connection could not be established.',
        category: 'Functional'
      };
      fs.appendFileSync(RESULTS_JSONL, JSON.stringify(fallbackResult) + '\n', 'utf8');
    }
  },

  onComplete: async function (exitCode, config, capabilities, results) {
    console.log('🏁 WDIO run finished. Generating Excel & HTML reports...');
    
    // Reload results from JSONL
    const finalResults = [];
    if (fs.existsSync(RESULTS_JSONL)) {
      const lines = fs.readFileSync(RESULTS_JSONL, 'utf8').trim().split('\n');
      lines.forEach(line => {
        if (line) {
          finalResults.push(JSON.parse(line));
        }
      });
    }

    // Populate reporter with reloaded results
    xlsxReporter.startRun();
    finalResults.forEach(r => {
      xlsxReporter.recordTest(r);
    });

    const EXCEL_OUT = path.join(process.cwd(), 'Test_Results', 'Excel', 'selenium-report.xlsx');
    const HTML_OUT  = path.join(process.cwd(), 'Test_Results', 'HTML', 'execution-report.html');
    const STATS_OUT = path.join(process.cwd(), 'Test_Results', 'test-stats.json');

    const duration = Date.now() - xlsxReporter.startTime;
    await xlsxReporter.generateReport(EXCEL_OUT);
    generateHtmlReport(xlsxReporter.results, duration, HTML_OUT);
    generateSummary(xlsxReporter.results, duration, STATS_OUT);
    
    console.log('✅ Custom WebDriverIO Excel and HTML report generation complete!');
  }
};

function resultsEmpty() {
  if (!fs.existsSync(RESULTS_JSONL)) return true;
  return fs.readFileSync(RESULTS_JSONL, 'utf8').trim().length === 0;
}
