// utils/generateAndroidExcel.cjs
// Standalone Excel writer for Android Appium results.
// Called via execSync from androidExcelReporter.cjs after Mocha finishes.
// Reads: Test_Results/Android/android-results.json
// Writes: Test_Results/Android/android-report.xlsx  (3 sheets)
'use strict';

const ExcelJS = require('exceljs');
const path    = require('path');
const fs      = require('fs');

const ANDROID_DIR  = path.join(process.cwd(), 'Test_Results', 'Android');
const RESULTS_FILE = path.join(ANDROID_DIR, 'android-results.json');
const EXCEL_OUT    = path.join(ANDROID_DIR, 'android-report.xlsx');

if (!fs.existsSync(RESULTS_FILE)) {
  console.error('android-results.json not found — skipping Excel generation');
  process.exit(0);
}

const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));

// ── Stats ─────────────────────────────────────────────────────────────────────
const total   = results.length;
const passed  = results.filter(r => r.status === 'passed').length;
const failed  = results.filter(r => r.status === 'failed').length;
const skipped = results.filter(r => r.status === 'skipped').length;
const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
const totalDur = results.reduce((a, r) => a + (r.duration || 0), 0);
const runDate  = new Date().toISOString();

// ── Category map ─────────────────────────────────────────────────────────────
const catMap = {};
for (const r of results) {
  if (!catMap[r.category]) catMap[r.category] = { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };
  catMap[r.category].total++;
  catMap[r.category].duration += r.duration || 0;
  if (r.status === 'passed') catMap[r.category].passed++;
  else if (r.status === 'failed') catMap[r.category].failed++;
  else catMap[r.category].skipped++;
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const darkBg  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
const bandEven= { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111827' } };
const bandOdd = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A2744' } };
const passFill= { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF052E16' } };
const failFill= { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF450A0A' } };
const catFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };

function hdrFont(argb = 'FFFFFFFF') { return { name: 'Calibri', bold: true, size: 11, color: { argb } }; }
function cellFont(argb = 'FFE2E8F0') { return { name: 'Calibri', size: 10, color: { argb } }; }

function styleHeaderRow(row, cols) {
  for (let c = 1; c <= cols; c++) {
    const cell = row.getCell(c);
    cell.fill = darkBg;
    cell.font = hdrFont();
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = { bottom: { style: 'medium', color: { argb: 'FF38BDF8' } } };
  }
  row.height = 22;
}

function bandRow(row, isEven, cols = 8) {
  for (let c = 1; c <= cols; c++) {
    row.getCell(c).fill = isEven ? bandEven : bandOdd;
    row.getCell(c).font = cellFont();
    row.getCell(c).alignment = { vertical: 'middle' };
  }
  row.height = 16;
}

// ── Build workbook ────────────────────────────────────────────────────────────
async function build() {
  const wb = new ExcelJS.Workbook();
  wb.creator  = 'PathoAI Android E2E';
  wb.created  = new Date();
  wb.modified = new Date();

  // ════════════════════════════════════════════════════════════════════════════
  // SHEET 1 — Summary
  // ════════════════════════════════════════════════════════════════════════════
  const ws1 = wb.addWorksheet('Summary', { properties: { tabColor: { argb: 'FF22D3EE' } } });
  ws1.getColumn(1).width = 30;
  ws1.getColumn(2).width = 44;

  // Title
  ws1.mergeCells('A1:B1');
  const titleCell = ws1.getCell('A1');
  titleCell.value     = '📱 PathoAI — Android Appium E2E Summary';
  titleCell.font      = { name: 'Calibri', bold: true, size: 16, color: { argb: 'FF38BDF8' } };
  titleCell.fill      = darkBg;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws1.getRow(1).height = 36;

  const metaRows = [
    ['Suite',          'PathoAI Android Appium E2E — 1,111 Tests'],
    ['Environment',    process.env.CI ? 'GitHub Actions (Ubuntu 22.04)' : 'Local Mock Mode'],
    ['Run Date',       runDate],
    ['CI Run #',       process.env.GITHUB_RUN_NUMBER || 'local'],
    ['Node Version',   process.version],
    ['', ''],
    ['Total Tests',    total],
    ['✅ Passed',      passed],
    ['❌ Failed',      failed],
    ['⏭ Skipped',     skipped],
    ['Pass Rate',      `${passRate}%`],
    ['Total Duration', `${totalDur}ms`],
    ['', ''],
    ['Categories',     Object.keys(catMap).length],
    ['Avg Duration/Test', `${total > 0 ? (totalDur / total).toFixed(1) : 0}ms`],
  ];

  let rowNum = 2;
  for (const [label, value] of metaRows) {
    const r = ws1.getRow(rowNum++);
    r.getCell(1).value = label;
    r.getCell(2).value = value;
    r.getCell(1).font  = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FF94A3B8' } };
    r.getCell(2).font  = cellFont();
    r.getCell(1).fill  = catFill;
    r.getCell(2).fill  = catFill;
    r.height = 18;
  }

  // Highlight pass rate
  const prCell = ws1.getRow(12).getCell(2);
  const prColor = parseFloat(passRate) >= 99 ? 'FF22C55E' : parseFloat(passRate) >= 90 ? 'FFFBBF24' : 'FFEF4444';
  prCell.font = { name: 'Calibri', bold: true, size: 13, color: { argb: prColor } };

  // ════════════════════════════════════════════════════════════════════════════
  // SHEET 2 — By Category
  // ════════════════════════════════════════════════════════════════════════════
  const ws2 = wb.addWorksheet('By Category', { properties: { tabColor: { argb: 'FF818CF8' } } });
  ws2.columns = [
    { header: '#',           key: 'num',      width: 6  },
    { header: 'Category',   key: 'category', width: 22 },
    { header: 'Total',      key: 'total',    width: 10 },
    { header: 'Passed',     key: 'passed',   width: 10 },
    { header: 'Failed',     key: 'failed',   width: 10 },
    { header: 'Skipped',    key: 'skipped',  width: 10 },
    { header: 'Pass Rate',  key: 'passRate', width: 12 },
    { header: 'Duration (ms)', key: 'duration', width: 16 },
  ];
  styleHeaderRow(ws2.getRow(1), 8);

  let ci = 1;
  let rowIdx2 = 1;
  for (const [cat, s] of Object.entries(catMap)) {
    rowIdx2++;
    const rate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) : '0.0';
    const r2 = ws2.addRow({
      num: ci++, category: cat, total: s.total,
      passed: s.passed, failed: s.failed, skipped: s.skipped,
      passRate: `${rate}%`, duration: s.duration,
    });
    bandRow(r2, rowIdx2 % 2 === 0, 8);
    r2.getCell('passed').font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF4ADE80' } };
    if (s.failed > 0) r2.getCell('failed').font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFCA5A5' } };
  }

  // Totals row
  const tot2 = ws2.addRow({
    num: '', category: 'TOTAL',
    total, passed, failed, skipped,
    passRate: `${passRate}%`,
    duration: totalDur,
  });
  tot2.font  = hdrFont('FFFBBF24');
  tot2.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  tot2.height = 20;
  const prFont = { name: 'Calibri', bold: true, size: 12, color: { argb: parseFloat(passRate) >= 99 ? 'FF4ADE80' : 'FFFCA5A5' } };
  tot2.getCell('passRate').font = prFont;

  // ════════════════════════════════════════════════════════════════════════════
  // SHEET 3 — Test Cases (detailed)
  // ════════════════════════════════════════════════════════════════════════════
  const ws3 = wb.addWorksheet('Test Cases', { properties: { tabColor: { argb: 'FF34D399' } } });
  ws3.columns = [
    { header: '#',             key: 'num',      width: 6  },
    { header: 'Category',     key: 'category', width: 20 },
    { header: 'Test ID',      key: 'id',       width: 12 },
    { header: 'Test Title',   key: 'title',    width: 58 },
    { header: 'Status',       key: 'status',   width: 10 },
    { header: 'Duration (ms)',key: 'duration', width: 14 },
    { header: 'Error',        key: 'error',    width: 40 },
  ];
  styleHeaderRow(ws3.getRow(1), 7);

  // Freeze header
  ws3.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  // Auto-filter
  ws3.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 7 } };

  let rowIdx3 = 1;
  for (const [idx, r] of results.entries()) {
    rowIdx3++;
    const tcRow = ws3.addRow({
      num:      idx + 1,
      category: r.category,
      id:       r.id,
      title:    r.title,
      status:   (r.status || 'passed').toUpperCase(),
      duration: r.duration,
      error:    r.error || '',
    });
    bandRow(tcRow, rowIdx3 % 2 === 0, 7);

    // Status cell
    const sc = tcRow.getCell('status');
    if (r.status === 'passed') {
      sc.font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FF4ADE80' } };
      sc.fill = passFill;
    } else if (r.status === 'failed') {
      sc.font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FFFCA5A5' } };
      sc.fill = failFill;
    } else {
      sc.font = { name: 'Calibri', bold: true, size: 10, color: { argb: 'FFFBBF24' } };
    }

    // Error cell
    if (r.error) {
      tcRow.getCell('error').font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FFFCA5A5' } };
    }
  }

  // ── Write file ──────────────────────────────────────────────────────────────
  if (!fs.existsSync(ANDROID_DIR)) fs.mkdirSync(ANDROID_DIR, { recursive: true });
  await wb.xlsx.writeFile(EXCEL_OUT);

  const size = fs.statSync(EXCEL_OUT).size;
  console.log(`📊 Android Excel report saved → ${EXCEL_OUT} (${(size / 1024).toFixed(1)} KB)`);
}

build().catch(e => {
  console.error('generateAndroidExcel.cjs error:', e.message);
  process.exit(1);
});
