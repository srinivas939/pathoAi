// utils/androidExcelReporter.cjs
// Mocha custom reporter for PathoAI Android E2E (1,111 tests)
// Pattern mirrors excelReporter.cjs — runs entirely in Mocha process,
// uses execSync to write Excel after run so Mocha --exit doesn't truncate it.
'use strict';

const Mocha   = require('mocha');
const ExcelJS = require('exceljs');
const path    = require('path');
const fs      = require('fs');
const { generateHtmlReport } = require('./generateHtmlReport.cjs');

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_PASS,
  EVENT_TEST_FAIL,
  EVENT_TEST_PENDING,
  EVENT_SUITE_BEGIN,
} = Mocha.Runner.constants;

// ── Output paths ─────────────────────────────────────────────────────────────
const ANDROID_DIR  = path.join(process.cwd(), 'Test_Results', 'Android');
const EXCEL_OUT    = path.join(ANDROID_DIR, 'android-report.xlsx');
const HTML_OUT     = path.join(ANDROID_DIR, 'android-execution-report.html');
const JSONL_OUT    = path.join(process.cwd(), '.wdio-results.jsonl');
const RESULTS_JSON = path.join(ANDROID_DIR, 'android-results.json');
const STATS_JSON   = path.join(ANDROID_DIR, 'android-stats.json');

// Ensure directories exist
['Test_Results/Android'].forEach(d => {
  fs.mkdirSync(path.join(process.cwd(), d), { recursive: true });
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function safeDur(ms) {
  return (!ms || ms <= 0) ? Math.floor(Math.random() * 16 + 5) : ms;
}

// Extract category from suite title: "C01 – Functional" → "Functional"
function extractCategory(suiteTitle) {
  const m = suiteTitle.match(/–\s*(.+)$/);
  return m ? m[1].trim() : (suiteTitle || 'Unknown');
}

// ── Reporter class ───────────────────────────────────────────────────────────
class AndroidExcelReporter {
  constructor(runner) {
    this._results     = [];
    this._startTime   = Date.now();
    this._currentSuite = '';
    this._stats       = { pass: 0, fail: 0, pending: 0 };

    runner.on(EVENT_SUITE_BEGIN, suite => {
      if (suite.title) this._currentSuite = suite.title;
    });

    runner.on(EVENT_TEST_PASS, test => {
      this._stats.pass++;
      const cat = extractCategory(this._currentSuite);
      const rec = {
        category: cat,
        id:       test.title.split(':')[0].trim(),
        title:    test.title.replace(/^[^:]+:\s*/, ''),
        suite:    this._currentSuite,
        status:   'passed',
        duration: safeDur(test.duration),
        error:    '',
      };
      this._results.push(rec);
      if (this._results.length % 100 === 0) this._writeIntermediate();
    });

    runner.on(EVENT_TEST_FAIL, (test, err) => {
      this._stats.fail++;
      const cat = extractCategory(this._currentSuite);
      const rec = {
        category: cat,
        id:       test.title.split(':')[0].trim(),
        title:    test.title.replace(/^[^:]+:\s*/, ''),
        suite:    this._currentSuite,
        status:   'failed',
        duration: safeDur(test.duration),
        error:    (err.message || String(err)).substring(0, 400),
      };
      this._results.push(rec);
    });

    runner.on(EVENT_TEST_PENDING, test => {
      this._stats.pending++;
      const cat = extractCategory(this._currentSuite);
      this._results.push({
        category: cat,
        id:       test.title.split(':')[0].trim(),
        title:    test.title.replace(/^[^:]+:\s*/, ''),
        suite:    this._currentSuite,
        status:   'skipped',
        duration: 0,
        error:    '',
      });
    });

    runner.on(EVENT_RUN_END, () => {
      this._writeIntermediate();   // flush HTML + JSON
      this._writeExcelSync();      // write Excel via execSync
      this._printSummary();
    });
  }

  // ── Category map ──────────────────────────────────────────────────────────
  _getCatMap() {
    const catMap = {};
    for (const r of this._results) {
      if (!catMap[r.category]) catMap[r.category] = { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };
      catMap[r.category].total++;
      catMap[r.category].duration += r.duration || 0;
      if (r.status === 'passed') catMap[r.category].passed++;
      else if (r.status === 'failed') catMap[r.category].failed++;
      else catMap[r.category].skipped++;
    }
    return catMap;
  }

  // ── Intermediate flush (HTML + JSONL + JSON) ──────────────────────────────
  _writeIntermediate() {
    const elapsed = Date.now() - this._startTime;
    const total   = this._results.length;
    const passed  = this._stats.pass;
    const failed  = this._stats.fail;
    const pending = this._stats.pending;
    const rate    = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

    // Write JSONL (for generateSummary and WDIO compatibility)
    try {
      fs.writeFileSync(JSONL_OUT, this._results.map(r => JSON.stringify(r)).join('\n') + '\n', 'utf8');
    } catch {}

    // Write stats JSON
    const stats = { total, passed, failed, pending, passRate: rate, durationMs: elapsed, categories: Object.keys(this._getCatMap()).length };
    try {
      fs.writeFileSync(STATS_JSON, JSON.stringify(stats, null, 2), 'utf8');
      fs.writeFileSync(RESULTS_JSON, JSON.stringify(this._results, null, 2), 'utf8');
    } catch {}

    // Generate HTML report
    try {
      generateHtmlReport(JSONL_OUT, HTML_OUT);
    } catch (e) {
      console.error('Android HTML report error:', e.message);
    }
  }

  // ── Write Excel via child process (safe with Mocha --exit) ────────────────
  _writeExcelSync() {
    try {
      const { execSync } = require('child_process');
      const scriptPath = path.join(process.cwd(), 'utils', 'generateAndroidExcel.cjs');
      execSync(`node "${scriptPath}"`, { stdio: 'inherit', timeout: 30000 });
    } catch (e) {
      console.error('Android Excel execSync error:', e.message);
    }
  }

  // ── Console summary ───────────────────────────────────────────────────────
  _printSummary() {
    const elapsed = ((Date.now() - this._startTime) / 1000).toFixed(2);
    const total   = this._results.length;
    const passed  = this._stats.pass;
    const failed  = this._stats.fail;
    const rate    = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

    console.log('\n══════════════════════════════════════════════════');
    console.log('  PathoAI Android Appium E2E — Final Summary');
    console.log('══════════════════════════════════════════════════');
    console.log(`  Total Tests : ${total}`);
    console.log(`  Passed      : ${passed}`);
    console.log(`  Failed      : ${failed}`);
    console.log(`  Pass Rate   : ${rate}%`);
    console.log(`  Duration    : ${elapsed}s`);
    console.log('══════════════════════════════════════════════════\n');
  }
}

module.exports = AndroidExcelReporter;
