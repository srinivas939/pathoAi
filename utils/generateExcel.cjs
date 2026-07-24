// utils/generateExcel.cjs
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const OUT_DIR_EXCEL = path.join(process.cwd(), 'Test_Results', 'Excel');
const OUT_FILE      = path.join(OUT_DIR_EXCEL, 'selenium-report.xlsx');
const RESULTS_FILE  = path.join(process.cwd(), 'Test_Results', 'test-results.json');

try {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.error('test-results.json not found');
    process.exit(1);
  }
  const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));

  const wb = new ExcelJS.Workbook();
  wb.creator  = 'PathoAI Test Suite';
  wb.created  = new Date();
  wb.modified = new Date();

  // ── Sheet 1: Selenium Test Report ──────────────────────────────────
  const ws1 = wb.addWorksheet('Selenium Test Report');
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  const passColor  = 'FF22C55E';
  const failColor  = 'FFEF4444';
  const pendColor  = 'FFFBBF24';

  ws1.columns = [
    { header: '#',            key: 'no',       width: 6  },
    { header: 'Suite',        key: 'suite',    width: 35 },
    { header: 'Test Title',   key: 'title',    width: 60 },
    { header: 'Type',         key: 'type',     width: 22 },
    { header: 'Status',       key: 'status',   width: 10 },
    { header: 'Duration(ms)', key: 'duration', width: 14 },
    { header: 'Error',        key: 'error',    width: 50 },
  ];

  ws1.getRow(1).eachCell(cell => {
    cell.fill      = headerFill;
    cell.font      = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border    = { bottom: { style: 'medium', color: { argb: 'FF0EA5E9' } } };
  });

  results.forEach((r, i) => {
    const row = ws1.addRow({
      no:       i + 1,
      suite:    r.suite,
      title:    r.title,
      type:     r.type,
      status:   r.status,
      duration: r.duration,
      error:    r.error,
    });

    const statusCell = row.getCell('status');
    const color = r.status === 'PASS' ? passColor : r.status === 'FAIL' ? failColor : pendColor;
    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    statusCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    statusCell.alignment = { horizontal: 'center' };

    if (i % 2 === 1) {
      row.eachCell({ includeEmpty: true }, cell => {
        if (cell.col !== 5) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
        }
      });
    }
  });

  // ── Sheet 2: Testing Types Summary ────────────────────────────────
  const ws2 = wb.addWorksheet('Testing Types Summary');
  
  const typeMap = {};
  results.forEach(r => {
    if (!typeMap[r.type]) typeMap[r.type] = { total: 0, passed: 0, failed: 0, pending: 0 };
    typeMap[r.type].total++;
    if (r.status === 'PASS')    typeMap[r.type].passed++;
    if (r.status === 'FAIL')    typeMap[r.type].failed++;
    if (r.status === 'PENDING') typeMap[r.type].pending++;
  });

  ws2.columns = [
    { header: 'Test Type',  key: 'type',     width: 28 },
    { header: 'Total',      key: 'total',    width: 12 },
    { header: 'Passed',     key: 'passed',   width: 12 },
    { header: 'Failed',     key: 'failed',   width: 12 },
    { header: 'Pending',    key: 'pending',  width: 12 },
    { header: 'Pass Rate',  key: 'passRate', width: 14 },
  ];

  ws2.getRow(1).eachCell(cell => {
    cell.fill      = headerFill;
    cell.font      = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border    = { bottom: { style: 'medium', color: { argb: 'FF0EA5E9' } } };
  });

  Object.entries(typeMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([type, s]) => {
      const rate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) + '%' : '0.0%';
      const row = ws2.addRow({
        type,
        total:    s.total,
        passed:   s.passed,
        failed:   s.failed,
        pending:  s.pending,
        passRate: rate,
      });

      const rateCell = row.getCell('passRate');
      const rateNum  = parseFloat(rate);
      rateCell.fill  = {
        type: 'pattern', pattern: 'solid',
        fgColor: { argb: rateNum >= 90 ? 'FF166534' : rateNum >= 70 ? 'FF78350F' : 'FF7F1D1D' }
      };
      rateCell.font      = { bold: true, color: { argb: rateNum >= 90 ? 'FF86EFAC' : rateNum >= 70 ? 'FFFDE68A' : 'FFFCA5A5' } };
      rateCell.alignment = { horizontal: 'center' };

      row.getCell('passed').font = { color: { argb: 'FF22C55E' }, bold: true };
      row.getCell('failed').font = { color: { argb: 'FFEF4444' }, bold: true };
    });

  wb.xlsx.writeFile(OUT_FILE)
    .then(() => {
      console.log(`📊 Excel report saved → ${OUT_FILE}`);
      process.exit(0);
    })
    .catch(e => {
      console.error('Excel write error:', e.message);
      process.exit(1);
    });

} catch (e) {
  console.error('Excel report error:', e.message);
  process.exit(1);
}
