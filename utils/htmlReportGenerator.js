// utils/htmlReportGenerator.js
// Generates a dark-themed HTML execution report for PathoAI Selenium tests
'use strict';

const fs   = require('fs');
const path = require('path');

const OUT_DIR  = path.join(process.cwd(), 'Test_Results', 'HTML');
const OUT_FILE = path.join(OUT_DIR, 'execution-report.html');

function generateHTMLReport({ results = [], stats = {}, duration = 0, typeMap = {} }) {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const total   = results.length;
  const passed  = stats.pass    || 0;
  const failed  = stats.fail    || 0;
  const pending = stats.pending || 0;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
  const runDate  = new Date().toLocaleString();
  const durSec   = (duration / 1000).toFixed(2);

  // Build type summary rows
  const typeSummaryRows = Object.entries(typeMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([type, s]) => {
      const rate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) : '0.0';
      const badge = parseFloat(rate) >= 90 ? 'badge-green' : parseFloat(rate) >= 70 ? 'badge-yellow' : 'badge-red';
      return `<tr>
        <td>${type}</td>
        <td class="center">${s.total}</td>
        <td class="center green">${s.passed}</td>
        <td class="center red">${s.failed}</td>
        <td class="center yellow">${s.pending}</td>
        <td class="center"><span class="badge ${badge}">${rate}%</span></td>
      </tr>`;
    }).join('\n');

  // Build test detail rows (group by suite)
  const suiteMap = {};
  results.forEach(r => {
    if (!suiteMap[r.suite]) suiteMap[r.suite] = [];
    suiteMap[r.suite].push(r);
  });

  const detailSections = Object.entries(suiteMap).map(([suite, tests]) => {
    const sp = tests.filter(t => t.status === 'PASS').length;
    const sf = tests.filter(t => t.status === 'FAIL').length;
    const rows = tests.map((t, i) => {
      const statusClass = t.status === 'PASS' ? 'status-pass' : t.status === 'FAIL' ? 'status-fail' : 'status-pending';
      const icon = t.status === 'PASS' ? '✅' : t.status === 'FAIL' ? '❌' : '⏭';
      const errHtml = t.error ? `<div class="error-trace">${escapeHtml(t.error)}</div>` : '';
      return `<tr>
        <td class="center dim">${i + 1}</td>
        <td>${escapeHtml(t.title)}</td>
        <td class="center"><span class="${statusClass}">${icon} ${t.status}</span></td>
        <td class="center dim">${t.duration}ms</td>
        <td>${errHtml}</td>
      </tr>`;
    }).join('\n');

    return `
    <div class="suite-block">
      <div class="suite-header">
        <span class="suite-title">📂 ${escapeHtml(suite)}</span>
        <span class="suite-meta">
          <span class="green">✅ ${sp}</span>
          ${sf > 0 ? `<span class="red">❌ ${sf}</span>` : ''}
          <span class="dim">${tests.length} tests</span>
        </span>
      </div>
      <table class="test-table">
        <thead><tr><th>#</th><th>Test</th><th>Status</th><th>Duration</th><th>Error</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }).join('\n');

  // Chart data for JS
  const chartLabels  = Object.keys(typeMap).map(k => `"${k}"`).join(',');
  const chartPassed  = Object.values(typeMap).map(v => v.passed).join(',');
  const chartFailed  = Object.values(typeMap).map(v => v.failed).join(',');
  const chartTotals  = Object.values(typeMap).map(v => v.total).join(',');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>PathoAI Selenium Test Report – ${runDate}</title>
<style>
  :root{--bg:#0f172a;--surface:#1e293b;--surface2:#334155;--border:#475569;
    --text:#e2e8f0;--dim:#94a3b8;--green:#22c55e;--red:#ef4444;--yellow:#fbbf24;
    --blue:#38bdf8;--purple:#a78bfa;--accent:#0ea5e9;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:'Segoe UI',system-ui,sans-serif;font-size:14px;line-height:1.6;}
  a{color:var(--accent);text-decoration:none;}
  /* ── Header ── */
  .header{background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%);
    padding:32px 40px;border-bottom:1px solid var(--border);text-align:center;}
  .header h1{font-size:2rem;font-weight:700;color:var(--blue);letter-spacing:1px;}
  .header .subtitle{color:var(--dim);margin-top:6px;font-size:0.95rem;}
  .header .run-info{margin-top:12px;display:flex;gap:24px;justify-content:center;flex-wrap:wrap;}
  .run-info span{background:var(--surface);padding:4px 14px;border-radius:20px;
    border:1px solid var(--border);font-size:0.85rem;color:var(--dim);}
  /* ── Stats cards ── */
  .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
    gap:16px;padding:28px 40px;}
  .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;
    padding:20px;text-align:center;transition:transform .2s;}
  .stat-card:hover{transform:translateY(-2px);}
  .stat-card .value{font-size:2.4rem;font-weight:800;line-height:1;}
  .stat-card .label{font-size:0.8rem;color:var(--dim);margin-top:6px;text-transform:uppercase;letter-spacing:.5px;}
  .card-total  .value{color:var(--blue);}
  .card-pass   .value{color:var(--green);}
  .card-fail   .value{color:var(--red);}
  .card-skip   .value{color:var(--yellow);}
  .card-rate   .value{color:var(--purple);}
  .card-time   .value{color:var(--accent);}
  /* ── Progress bar ── */
  .progress-section{padding:0 40px 28px;}
  .progress-label{display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;color:var(--dim);}
  .progress-bar{height:12px;background:var(--surface2);border-radius:6px;overflow:hidden;}
  .progress-fill{height:100%;border-radius:6px;
    background:linear-gradient(90deg,var(--green),var(--accent));transition:width 1s ease;}
  /* ── Charts ── */
  .charts-section{padding:0 40px 28px;display:grid;grid-template-columns:1fr 1fr;gap:24px;}
  .chart-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;}
  .chart-card h3{font-size:0.95rem;color:var(--blue);margin-bottom:14px;font-weight:600;}
  canvas{width:100%!important;max-height:280px;}
  /* ── Type summary table ── */
  .section{padding:0 40px 28px;}
  .section h2{font-size:1.1rem;font-weight:700;color:var(--blue);margin-bottom:14px;
    padding-bottom:8px;border-bottom:1px solid var(--border);}
  table{width:100%;border-collapse:collapse;font-size:0.875rem;}
  th{background:var(--surface2);color:var(--text);padding:10px 12px;text-align:left;
    border-bottom:2px solid var(--border);font-weight:600;}
  td{padding:9px 12px;border-bottom:1px solid #1e293b;}
  tr:nth-child(even) td{background:rgba(255,255,255,.02);}
  tr:hover td{background:rgba(56,189,248,.05);}
  .center{text-align:center;}
  .green{color:var(--green);}
  .red{color:var(--red);}
  .yellow{color:var(--yellow);}
  .dim{color:var(--dim);}
  /* ── Badges ── */
  .badge{padding:2px 10px;border-radius:12px;font-size:0.78rem;font-weight:700;}
  .badge-green{background:#166534;color:#86efac;}
  .badge-yellow{background:#78350f;color:#fde68a;}
  .badge-red{background:#7f1d1d;color:#fca5a5;}
  /* ── Test status ── */
  .status-pass{color:var(--green);font-weight:600;}
  .status-fail{color:var(--red);font-weight:600;}
  .status-pending{color:var(--yellow);font-weight:600;}
  /* ── Suite blocks ── */
  .suite-block{background:var(--surface);border:1px solid var(--border);
    border-radius:10px;margin-bottom:16px;overflow:hidden;}
  .suite-header{display:flex;justify-content:space-between;align-items:center;
    padding:12px 16px;background:var(--surface2);border-bottom:1px solid var(--border);}
  .suite-title{font-weight:700;font-size:0.95rem;color:var(--blue);}
  .suite-meta{display:flex;gap:12px;font-size:0.85rem;}
  .test-table{width:100%;border-collapse:collapse;font-size:0.82rem;}
  .test-table th{background:#0f1929;color:var(--dim);padding:7px 10px;font-weight:500;font-size:0.78rem;}
  .test-table td{padding:7px 10px;border-bottom:1px solid #1a2744;}
  .test-table tr:last-child td{border-bottom:none;}
  .error-trace{background:#1a0a0a;border:1px solid #7f1d1d;border-radius:6px;
    padding:8px;color:#fca5a5;font-family:monospace;font-size:0.78rem;white-space:pre-wrap;max-height:80px;overflow-y:auto;}
  /* ── Footer ── */
  .footer{text-align:center;padding:24px 40px;color:var(--dim);font-size:0.8rem;
    border-top:1px solid var(--border);background:var(--surface);}
  /* ── Responsive ── */
  @media(max-width:768px){
    .stats-grid{padding:20px;} .section{padding:0 16px 20px;}
    .charts-section{grid-template-columns:1fr;padding:0 16px 20px;}
    .header{padding:20px 16px;}
  }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <h1>🧪 PathoAI Selenium Test Report</h1>
  <p class="subtitle">Web E2E Test Suite — 1,100 Assertions across 110 Categories</p>
  <div class="run-info">
    <span>📅 ${runDate}</span>
    <span>⏱ Duration: ${durSec}s</span>
    <span>🌐 Chrome Headless</span>
    <span>🧩 Mocha + Selenium WebDriver</span>
    <span>🏥 PathoAI Health Platform</span>
  </div>
</div>

<!-- STATS CARDS -->
<div class="stats-grid">
  <div class="stat-card card-total">
    <div class="value">${total}</div>
    <div class="label">Total Tests</div>
  </div>
  <div class="stat-card card-pass">
    <div class="value">${passed}</div>
    <div class="label">Passed</div>
  </div>
  <div class="stat-card card-fail">
    <div class="value">${failed}</div>
    <div class="label">Failed</div>
  </div>
  <div class="stat-card card-skip">
    <div class="value">${pending}</div>
    <div class="label">Pending</div>
  </div>
  <div class="stat-card card-rate">
    <div class="value">${passRate}%</div>
    <div class="label">Pass Rate</div>
  </div>
  <div class="stat-card card-time">
    <div class="value">${durSec}s</div>
    <div class="label">Duration</div>
  </div>
</div>

<!-- PROGRESS BAR -->
<div class="progress-section">
  <div class="progress-label">
    <span>Overall Pass Rate</span>
    <span>${passed} / ${total} tests passed</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width:${passRate}%"></div>
  </div>
</div>

<!-- CHARTS -->
<div class="charts-section">
  <div class="chart-card">
    <h3>📊 Pass vs Fail by Category</h3>
    <canvas id="barChart"></canvas>
  </div>
  <div class="chart-card">
    <h3>🍩 Result Distribution</h3>
    <canvas id="doughnutChart"></canvas>
  </div>
</div>

<!-- TYPE SUMMARY TABLE -->
<div class="section">
  <h2>📋 Testing Types Summary</h2>
  <table>
    <thead>
      <tr><th>Test Type</th><th class="center">Total</th><th class="center">Passed</th>
      <th class="center">Failed</th><th class="center">Pending</th><th class="center">Pass Rate</th></tr>
    </thead>
    <tbody>${typeSummaryRows}</tbody>
  </table>
</div>

<!-- DETAILED RESULTS -->
<div class="section">
  <h2>🔍 Detailed Test Results</h2>
  ${detailSections}
</div>

<!-- FOOTER -->
<div class="footer">
  <p>Generated by <strong>PathoAI Test Suite</strong> · ${runDate} · Selenium WebDriver + Mocha + exceljs</p>
  <p style="margin-top:4px">© PathoAI Health Platform · <a href="https://github.com/srinivas939/pathoAi">github.com/srinivas939/pathoAi</a></p>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#334155';

// Bar chart – pass/fail by category
const barCtx = document.getElementById('barChart').getContext('2d');
new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: [${chartLabels}],
    datasets: [
      { label: 'Passed', data: [${chartPassed}], backgroundColor: 'rgba(34,197,94,0.8)', borderRadius: 4 },
      { label: 'Failed', data: [${chartFailed}], backgroundColor: 'rgba(239,68,68,0.8)',  borderRadius: 4 },
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: true,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index' } },
    scales: {
      x: { stacked: false, ticks: { maxRotation: 45, font: { size: 9 } } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }
});

// Doughnut chart – overall result distribution
const dCtx = document.getElementById('doughnutChart').getContext('2d');
new Chart(dCtx, {
  type: 'doughnut',
  data: {
    labels: ['Passed','Failed','Pending'],
    datasets: [{
      data: [${passed}, ${failed}, ${pending}],
      backgroundColor: ['rgba(34,197,94,0.85)','rgba(239,68,68,0.85)','rgba(251,191,36,0.85)'],
      borderColor: ['#22c55e','#ef4444','#fbbf24'],
      borderWidth: 2,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: true,
    cutout: '65%',
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: ctx => {
            const pct = ctx.dataset.data.reduce((a,b)=>a+b,0);
            return ' ' + ctx.label + ': ' + ctx.raw + ' (' + ((ctx.raw/pct)*100).toFixed(1) + '%)';
          }
        }
      }
    }
  }
});
</script>
</body>
</html>`;

  fs.writeFileSync(OUT_FILE, html, 'utf8');
  console.log(`🌐 HTML report saved  → ${OUT_FILE}`);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

module.exports = { generateHTMLReport };
