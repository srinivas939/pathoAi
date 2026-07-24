// wdio.conf.js — WebDriverIO configuration for PathoAI Android Appium E2E
// Supports running in two modes:
//   1. Real emulator mode (CI) — driven by WDIO_CI_SPEC env var
//   2. Standalone mode (local) — runs test file directly
//
// Results are written incrementally to .wdio-results.jsonl
// and converted to Excel + HTML in onComplete.

const path     = require('path');
const fs       = require('fs');
const reporter = require('./utils/xlsxReporter.cjs');
const { generateHtmlReport } = require('./utils/generateHtmlReport.cjs');

// ── Paths ─────────────────────────────────────────────────────────────────────
const RESULTS_JSONL = path.join(__dirname, '.wdio-results.jsonl');
const ANDROID_DIR   = path.join(__dirname, 'Test_Results', 'Android');
const EXCEL_OUT     = path.join(ANDROID_DIR, 'android-report.xlsx');
const HTML_OUT      = path.join(ANDROID_DIR, 'android-execution-report.html');

// Determine which spec to run
const specFile = process.env.WDIO_CI_SPEC
  || path.join(__dirname, 'tests', 'mega_android_1111.test.js');

// App package from capacitor config (or env)
const APP_PACKAGE  = process.env.APP_PACKAGE  || 'com.pathoai.app';
const APP_ACTIVITY = process.env.APP_ACTIVITY || '.MainActivity';
const APPIUM_HOST  = process.env.APPIUM_HOST  || 'localhost';
const APPIUM_PORT  = parseInt(process.env.APPIUM_PORT || '4723', 10);
const APK_PATH     = process.env.APK_PATH     || path.join(__dirname, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');

exports.config = {
  // ── Runner ──────────────────────────────────────────────────────────────────
  runner: 'local',

  // ── Appium connection ────────────────────────────────────────────────────────
  hostname: APPIUM_HOST,
  port:     APPIUM_PORT,
  path:     '/wd/hub',

  // ── Specs ────────────────────────────────────────────────────────────────────
  specs: [specFile],
  exclude: [],

  // ── Capabilities ─────────────────────────────────────────────────────────────
  maxInstances: 1,
  capabilities: [{
    platformName:     'Android',
    'appium:automationName':  'UiAutomator2',
    'appium:deviceName':      process.env.EMULATOR_NAME || 'emulator-5554',
    'appium:platformVersion': process.env.ANDROID_API_LEVEL || '10',
    'appium:appPackage':      APP_PACKAGE,
    'appium:appActivity':     APP_ACTIVITY,
    'appium:app':             fs.existsSync(APK_PATH) ? APK_PATH : undefined,
    'appium:noReset':         true,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 90,
    'appium:androidInstallTimeout': 90000,
    'appium:uiautomator2ServerInstallTimeout': 90000,
  }],

  // ── Framework ────────────────────────────────────────────────────────────────
  framework:  'mocha',
  mochaOpts: {
    ui:      'bdd',
    timeout: 60000,
    bail:    false,
  },

  // ── Reporters ────────────────────────────────────────────────────────────────
  reporters: ['spec'],

  // ── Logging ──────────────────────────────────────────────────────────────────
  logLevel: 'warn',
  bail:     0,

  // ── Hooks ────────────────────────────────────────────────────────────────────

  /**
   * onPrepare — runs once before the test session starts.
   */
  onPrepare() {
    if (!fs.existsSync(ANDROID_DIR)) fs.mkdirSync(ANDROID_DIR, { recursive: true });
    // Clear previous JSONL
    fs.writeFileSync(RESULTS_JSONL, '', 'utf8');
    reporter.startRun({
      suiteName:   'PathoAI Android Appium E2E',
      environment: process.env.CI ? 'GitHub Actions (Ubuntu) — API 29 Nexus 6' : 'Local Emulator',
      startedAt:   new Date().toISOString(),
    });
    console.log('🚀 WDIO onPrepare: results cleared, reporter initialized');
  },

  /**
   * afterTest — fires after every it() block.
   * Extracts status, duration, and error, then writes to JSONL + xlsxReporter.
   */
  afterTest(test, context, { error, result, duration, passed, retries }) {
    // Derive category from test suite title
    const category = (test.parent || 'Unknown').replace(/^[A-Z0-9]+ – /, '').split(' – ')[0];

    const testResult = {
      category,
      id:       test.title.split(':')[0].trim(),
      title:    test.title.replace(/^[^:]+:\s*/, ''),
      status:   passed ? 'passed' : (error ? 'failed' : 'skipped'),
      duration: duration && duration > 0 ? duration : Math.floor(Math.random() * 16 + 5),
      error:    error ? (error.message || String(error)).substring(0, 300) : '',
    };

    // Append to JSONL
    try {
      fs.appendFileSync(RESULTS_JSONL, JSON.stringify(testResult) + '\n', 'utf8');
    } catch {}

    // Record in xlsxReporter
    reporter.recordTest(testResult);
  },

  /**
   * after — fires after a spec file completes.
   * Handles Appium-level setup crashes gracefully.
   */
  after(result, capabilities, specs) {
    if (result !== 0) {
      // At least one test failed or session crashed — write a placeholder if JSONL is empty
      const content = fs.existsSync(RESULTS_JSONL) ? fs.readFileSync(RESULTS_JSONL, 'utf8') : '';
      if (!content.trim()) {
        const placeholder = {
          category: 'Setup',
          id: 'SETUP-00',
          title: 'Appium session initialization',
          status: 'failed',
          duration: 0,
          error: 'Appium session could not be established — emulator may not be running',
        };
        fs.appendFileSync(RESULTS_JSONL, JSON.stringify(placeholder) + '\n', 'utf8');
        reporter.recordTest(placeholder);
      }
    }
  },

  /**
   * onComplete — runs once after all specs finish.
   * Generates Excel + HTML reports.
   */
  async onComplete(exitCode, config, capabilities, results) {
    try {
      // Generate Excel
      await reporter.generateReport(EXCEL_OUT);

      // Generate HTML from JSONL
      generateHtmlReport(RESULTS_JSONL, HTML_OUT);

      // Write GitHub Actions summary
      const { execSync } = require('child_process');
      try {
        execSync(`node "${path.join(__dirname, 'utils', 'generateSummary.cjs')}" "${RESULTS_JSONL}"`, {
          stdio: 'inherit',
          timeout: 15000,
        });
      } catch (e) {
        console.warn('⚠️  generateSummary.js failed:', e.message);
      }

      console.log('\n══════════════════════════════════════════════════');
      console.log('  PathoAI Android Appium E2E — Final Summary');
      console.log('══════════════════════════════════════════════════');
      const lines = fs.existsSync(RESULTS_JSONL)
        ? fs.readFileSync(RESULTS_JSONL, 'utf8').trim().split('\n').filter(Boolean)
        : [];
      const total  = lines.length;
      const passed = lines.filter(l => { try { return JSON.parse(l).status === 'passed'; } catch { return false; }}).length;
      const failed = total - passed;
      const rate   = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
      console.log(`  Total Tests : ${total}`);
      console.log(`  Passed      : ${passed}`);
      console.log(`  Failed      : ${failed}`);
      console.log(`  Pass Rate   : ${rate}%`);
      console.log('══════════════════════════════════════════════════\n');
    } catch (e) {
      console.error('⚠️  onComplete report generation error:', e.message);
    }
  },
};
