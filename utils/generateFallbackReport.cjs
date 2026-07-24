// utils/generateFallbackReport.js
// Called by ci_run_tests.sh when WDIO/Appium fails to start.
// Writes a minimal Excel + HTML report indicating the setup failure.

const path = require('path');
const fs   = require('fs');
const ExcelJS = require('exceljs');

async function generateFallbackReport() {
  const outDir = path.join(process.cwd(), 'Test_Results', 'Android');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const runDate = new Date().toISOString();
  const errorMsg = process.env.FALLBACK_ERROR || 'Appium/WDIO setup failed — emulator or APK not available';

  // ── Excel fallback ────────────────────────────────────────────────────────────
  const wb = new ExcelJS.Workbook();
  wb.creator = 'PathoAI CI Fallback';
  wb.created = new Date();

  const ws = wb.addWorksheet('Summary');
  ws.columns = [
    { header: 'Field',  key: 'field',  width: 30 },
    { header: 'Value',  key: 'value',  width: 50 },
  ];

  const darkFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  const headerRow = ws.getRow(1);
  headerRow.fill = darkFill;
  headerRow.font = { name: 'Calibri', bold: true, size: 11, color: { argb: 'FFFFFFFF' } };

  const rows = [
    ['Suite',        'PathoAI Android Appium E2E'],
    ['Status',       'SETUP FAILURE'],
    ['Run Date',     runDate],
    ['Total Tests',  '0 (setup incomplete)'],
    ['Passed',       '0'],
    ['Failed',       '0'],
    ['Pass Rate',    '0.00%'],
    ['Error',        errorMsg],
    ['CI Run',       process.env.GITHUB_RUN_NUMBER || 'local'],
    ['Node Version', process.version],
  ];

  for (const [field, value] of rows) {
    const r = ws.addRow({ field, value });
    r.fill = darkFill;
    r.font = { name: 'Calibri', size: 10, color: { argb: 'FFE2E8F0' } };
    r.getCell('field').font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF94A3B8' } };
  }

  const xlsxPath = path.join(outDir, 'android-report.xlsx');
  await wb.xlsx.writeFile(xlsxPath);
  console.log(`⚠️  Fallback Excel report saved → ${xlsxPath}`);

  // ── HTML fallback ─────────────────────────────────────────────────────────────
  const htmlPath = path.join(outDir, 'android-execution-report.html');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PathoAI Android E2E — Setup Failure</title>
<style>
  body { background:#060d1c; color:#e2e8f0; font-family:system-ui,sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
  .card { background:#0d1829; border:1px solid #1a2744; border-radius:14px; padding:48px; max-width:600px; text-align:center; }
  h1 { color:#ef4444; font-size:1.8rem; margin-bottom:12px; }
  p { color:#94a3b8; font-size:0.95rem; line-height:1.6; }
  .badge { display:inline-block; background:rgba(239,68,68,.15); color:#fca5a5; padding:6px 16px; border-radius:20px; font-size:0.85rem; margin:16px 0; }
  .error { background:#1a0a0a; border:1px solid #7f1d1d; border-radius:8px; padding:14px; color:#fca5a5; font-family:monospace; font-size:0.8rem; text-align:left; margin-top:16px; }
</style>
</head>
<body>
<div class="card">
  <h1>⚠️ Appium Setup Failure</h1>
  <div class="badge">SETUP INCOMPLETE</div>
  <p>The Android Emulator or Appium server could not start during this CI run.<br>All 1,111 test cases were not executed.</p>
  <div class="error"><strong>Error:</strong> ${errorMsg}</div>
  <p style="margin-top:20px;font-size:0.8rem;color:#475569">Run Date: ${runDate} · CI: ${process.env.GITHUB_RUN_NUMBER || 'local'}</p>
</div>
</body>
</html>`;

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`⚠️  Fallback HTML report saved → ${htmlPath}`);

  // Also write minimal JSONL so downstream steps don't crash
  const jsonlPath = path.join(process.cwd(), '.wdio-results.jsonl');
  fs.writeFileSync(jsonlPath, '', 'utf8');
  console.log(`⚠️  Empty JSONL created → ${jsonlPath}`);
}

generateFallbackReport().catch(e => {
  console.error('Fallback report generation failed:', e.message);
  process.exit(1);
});
