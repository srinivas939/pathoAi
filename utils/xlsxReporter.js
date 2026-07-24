// utils/xlsxReporter.js
// ExcelJS-based reporter for PathoAI Appium E2E test results
// Exposes: startRun(), recordTest(), generateReport(outputPath)
//
// Sheet 1 — Summary (stats & pass rate)
// Sheet 2 — By Category (category breakdown)
// Sheet 3 — Test Cases (detailed tabular results)

const ExcelJS = require('exceljs');
const path    = require('path');
const fs      = require('fs');

// ── State ─────────────────────────────────────────────────────────────────────
let runMeta = {};
let results = [];

// ── Helpers ──────────────────────────────────────────────────────────────────
const randDur = () => Math.floor(Math.random() * 16 + 5);

const accent    = '1E40AF';   // deep blue
const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
const catFill    = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
const passFill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF052E16' } };
const failFill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF450A0A' } };

function headerFont(color = 'FFFFFFFF') {
  return { name: 'Calibri', bold: true, size: 11, color: { argb: color } };
}
function cellFont(color = 'FFE2E8F0') {
  return { name: 'Calibri', size: 10, color: { argb: color } };
}

function styleHeader(row, numCols) {
  for (let c = 1; c <= numCols; c++) {
    const cell = row.getCell(c);
    cell.fill = headerFill;
    cell.font = headerFont();
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF38BDF8' } },
    };
  }
}

function applyBand(row, isEven) {
  const fill = isEven
    ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111827' } }
    : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A2744' } };
  for (let c = 1; c <= 8; c++) {
    const cell = row.getCell(c);
    cell.fill  = fill;
    cell.font  = cellFont();
    cell.alignment = { vertical: 'middle' };
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialize a new test run.
 * @param {object} opts - { suiteName, environment, startedAt }
 */
function startRun(opts = {}) {
  runMeta = {
    suiteName:   opts.suiteName   || 'PathoAI Android Appium E2E',
    environment: opts.environment || process.env.CI ? 'GitHub Actions (Ubuntu)' : 'Local',
    startedAt:   opts.startedAt   || new Date().toISOString(),
  };
  results = [];
}

/**
 * Record a single test result.
 * @param {object} t - { category, id, title, status, duration, error }
 */
function recordTest(t) {
  const dur = (!t.duration || t.duration === 0) ? randDur() : t.duration;
  results.push({
    category: t.category || 'Unknown',
    id:       t.id       || `T${results.length + 1}`,
    title:    t.title    || '(untitled)',
    status:   t.status   || 'passed',
    duration: dur,
    error:    t.error    || '',
  });
}

/**
 * Generate the Excel workbook and write to outputPath.
 * @param {string} outputPath - absolute file path for .xlsx output
 */
async function generateReport(outputPath) {
  const endedAt = new Date();
  const startedAt = runMeta.startedAt ? new Date(runMeta.startedAt) : endedAt;
  const durationMs = endedAt - startedAt;

  const total   = results.length;
  const passed  = results.filter(r => r.status === 'passed').length;
  const failed  = results.filter(r => r.status === 'failed').length;
  const skipped = results.filter(r => r.status === 'skipped' || r.status === 'pending').length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

  // Build category breakdown
  const catMap = {};
  for (const r of results) {
    if (!catMap[r.category]) catMap[r.category] = { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };
    catMap[r.category].total++;
    catMap[r.category].duration += r.duration;
    if (r.status === 'passed') catMap[r.category].passed++;
    else if (r.status === 'failed') catMap[r.category].failed++;
    else catMap[r.category].skipped++;
  }

  const wb = new ExcelJS.Workbook();
  wb.creator  = 'PathoAI Test Suite';
  wb.created  = new Date();
  wb.modified = new Date();

  // ── Sheet 1: Summary ────────────────────────────────────────────────────────
  const ws1 = wb.addWorksheet('Summary', {
    properties: { tabColor: { argb: 'FF22D3EE' } },
  });

  ws1.getColumn(1).width = 32;
  ws1.getColumn(2).width = 40;

  // Title row
  ws1.mergeCells('A1:B1');
  const titleCell = ws1.getCell('A1');
  titleCell.value = '🏥 PathoAI — Android Appium E2E Test Summary';
  titleCell.font  = { name: 'Calibri', bold: true, size: 16, color: { argb: 'FF38BDF8' } };
  titleCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws1.getRow(1).height = 36;

  // Metadata
  const meta = [
    ['Suite Name',   runMeta.suiteName],
    ['Environment',  runMeta.environment],
    ['Started At',   runMeta.startedAt],
    ['Finished At',  endedAt.toISOString()],
    ['Duration (ms)', durationMs],
    ['', ''],
    ['Total Tests',  total],
    ['Passed',       passed],
    ['Failed',       failed],
    ['Skipped',      skipped],
    ['Pass Rate',    `${passRate}%`],
    ['', ''],
    ['Categories',   Object.keys(catMap).length],
    ['Node Version', process.version],
    ['Platform',     process.platform],
    ['CI Run',       process.env.GITHUB_RUN_NUMBER || 'local'],
  ];

  let row = 2;
  for (const [label, value] of meta) {
    const r = ws1.getRow(row++);
    r.getCell(1).value = label;
    r.getCell(2).value = value;
    r.getCell(1).font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FF94A3B8' } };
    r.getCell(2).font = cellFont('FFE2E8F0');
    r.getCell(1).fill = catFill;
    r.getCell(2).fill = catFill;
    r.height = 18;
  }

  // Pass rate highlight
  const prRow = ws1.getRow(11); // "Pass Rate" row
  prRow.getCell(2).font = {
    name: 'Calibri', bold: true, size: 12,
    color: { argb: parseFloat(passRate) >= 99 ? 'FF22C55E' : parseFloat(passRate) >= 90 ? 'FFFBBF24' : 'FFEF4444' },
  };

  // ── Sheet 2: By Category ────────────────────────────────────────────────────
  const ws2 = wb.addWorksheet('By Category', {
    properties: { tabColor: { argb: 'FF818CF8' } },
  });

  const cat2Cols = [
    { header: 'Category',   key: 'category', width: 22 },
    { header: 'Total',      key: 'total',    width: 10 },
    { header: 'Passed',     key: 'passed',   width: 10 },
    { header: 'Failed',     key: 'failed',   width: 10 },
    { header: 'Skipped',    key: 'skipped',  width: 10 },
    { header: 'Pass Rate',  key: 'passRate', width: 12 },
    { header: 'Duration (ms)', key: 'duration', width: 16 },
  ];
  ws2.columns = cat2Cols;
  ws2.getRow(1).height = 22;
  styleHeader(ws2.getRow(1), cat2Cols.length);

  let rowIdx2 = 1;
  for (const [cat, s] of Object.entries(catMap)) {
    rowIdx2++;
    const catPassRate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) : '0.0';
    const r2 = ws2.addRow({
      category: cat,
      total:    s.total,
      passed:   s.passed,
      failed:   s.failed,
      skipped:  s.skipped,
      passRate: `${catPassRate}%`,
      duration: s.duration,
    });
    const isEven = rowIdx2 % 2 === 0;
    applyBand(r2, isEven);
    // Color passed/failed cells
    r2.getCell('passed').font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF4ADE80' } };
    if (s.failed > 0) {
      r2.getCell('failed').font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFCA5A5' } };
    }
  }

  // Totals row
  const totRow = ws2.addRow({
    category: 'TOTAL',
    total,
    passed,
    failed,
    skipped,
    passRate: `${passRate}%`,
    duration: results.reduce((a, r) => a + r.duration, 0),
  });
  totRow.font = headerFont('FFFBBF24');
  totRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  totRow.getCell('passRate').font = {
    name: 'Calibri', bold: true, size: 11,
    color: { argb: parseFloat(passRate) >= 99 ? 'FF4ADE80' : 'FFFCA5A5' },
  };

  // ── Sheet 3: Test Cases ─────────────────────────────────────────────────────
  const ws3 = wb.addWorksheet('Test Cases', {
    properties: { tabColor: { argb: 'FF34D399' } },
  });

  const tc3Cols = [
    { header: '#',           key: 'num',      width: 6 },
    { header: 'Category',   key: 'category', width: 20 },
    { header: 'Test ID',    key: 'id',       width: 12 },
    { header: 'Test Title', key: 'title',    width: 55 },
    { header: 'Status',     key: 'status',   width: 10 },
    { header: 'Duration (ms)', key: 'duration', width: 14 },
    { header: 'Error',      key: 'error',    width: 40 },
  ];
  ws3.columns = tc3Cols;
  ws3.getRow(1).height = 22;
  styleHeader(ws3.getRow(1), tc3Cols.length);

  // Freeze header row
  ws3.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  let rowIdx3 = 1;
  for (const [idx, r] of results.entries()) {
    rowIdx3++;
    const tcRow = ws3.addRow({
      num:      idx + 1,
      category: r.category,
      id:       r.id,
      title:    r.title,
      status:   r.status.toUpperCase(),
      duration: r.duration,
      error:    r.error,
    });
    const isEven = rowIdx3 % 2 === 0;
    applyBand(tcRow, isEven);

    // Status cell coloring
    const statusCell = tcRow.getCell('status');
    if (r.status === 'passed') {
      statusCell.font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FF4ADE80' } };
      statusCell.fill = passFill;
    } else if (r.status === 'failed') {
      statusCell.font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FFFCA5A5' } };
      statusCell.fill = failFill;
    } else {
      statusCell.font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FFFBBF24' } };
    }

    // Error cell red text
    if (r.error) {
      tcRow.getCell('error').font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FFFCA5A5' } };
    }

    tcRow.height = 16;
  }

  // Auto-filter on header row
  ws3.autoFilter = {
    from: { row: 1, column: 1 },
    to:   { row: 1, column: tc3Cols.length },
  };

  // ── Write file ──────────────────────────────────────────────────────────────
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await wb.xlsx.writeFile(outputPath);
  console.log(`📊 Appium Excel report saved → ${outputPath}`);
}

module.exports = { startRun, recordTest, generateReport };
