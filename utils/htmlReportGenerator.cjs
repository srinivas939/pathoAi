// utils/htmlReportGenerator.cjs
// Generates a dark-themed HTML execution report for PathoAI Selenium tests
'use strict';

const fs   = require('fs');
const path = require('path');

const OUT_DIR  = path.join(process.cwd(), 'Test_Results', 'HTML');
const OUT_FILE = path.join(OUT_DIR, 'execution-report.html');

function generateHTMLReport({ results = [], stats = {}, duration = 0, typeMap = {} }) {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const total    = results.length;
  const passed   = stats.pass    || 0;
  const failed   = stats.fail    || 0;
  const pending  = stats.pending || 0;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
  const runDate  = new Date().toLocaleString();
  const durSec   = (duration / 1000).toFixed(2);

  // Build type summary rows
  const typeSummaryRows = Object.entries(typeMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([type, s]) => {
      const rate  = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) : '0.0';
      const badge = parseFloat(rate) >= 90 ? 'badge-green' : parseFloat(rate) >= 70 ? 'badge-yellow' : 'badge-red';
      return `<tr>
        <td>${escapeHtml(type)}</td>
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
    const sp   = tests.filter(t => t.status === 'PASS').length;
    const sf   = tests.filter(t => t.status === 'FAIL').length;
    const rows = tests.map((t, i) => {
      const statusClass = t.status === 'PASS' ? 'status-pass' : t.status === 'FAIL' ? 'status-fail' : 'status-pending';
      const icon        = t.status === 'PASS' ? '✅' : t.status === 'FAIL' ? '❌' : '⏭';
      const errHtml     = t.error ? `<div class="error-trace">${escapeHtml(t.error)}</div>` : '';
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
  const chartLabels = Object.keys(typeMap).map(k => `"${escapeHtml(k)}"`).join(',');
  const chartPassed = Object.values(typeMap).map(v => v.passed).join(',');
  const chartFailed = Object.values(typeMap).map(v => v.failed).join(',');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>PathoAI – Selenium E2E Test Report · ${runDate}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  :root{
    --bg:#0f172a;--surface:#1e293b;--surface2:#334155;--border:#475569;
    --text:#e2e8f0;--dim:#94a3b8;--green:#22c55e;--red:#ef4444;--yellow:#fbbf24;
    --blue:#38bdf8;--purple:#a78bfa;--accent:#0ea5e9;--orange:#f97316;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;font-size:14px;line-height:1.6;}
  a{color:var(--accent);text-decoration:none;}
  a:hover{text-decoration:underline;}

  /* ── Header ── */
  .header{
    background:linear-gradient(135deg,#0d1b2e 0%,#1a3a5c 40%,#0d1b2e 100%);
    padding:36px 48px;border-bottom:2px solid var(--accent);text-align:center;
    position:relative;overflow:hidden;
  }
  .header::before{
    content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse at 20% 50%, rgba(14,165,233,0.08) 0%, transparent 60%),
               radial-gradient(ellipse at 80% 50%, rgba(167,139,250,0.06) 0%, transparent 60%);
    pointer-events:none;
  }
  .header h1{font-size:2.2rem;font-weight:800;color:var(--blue);letter-spacing:1.5px;position:relative;}
  .header .subtitle{color:var(--dim);margin-top:8px;font-size:1rem;position:relative;}
  .header .run-info{margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;}
  .run-info span{
    background:rgba(255,255,255,0.05);backdrop-filter:blur(4px);
    padding:5px 16px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);
    font-size:0.82rem;color:var(--dim);
  }

  /* ── Stats cards ── */
  .stats-grid{
    display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));
    gap:16px;padding:28px 48px;
  }
  .stat-card{
    background:var(--surface);border:1px solid var(--border);border-radius:14px;
    padding:22px 20px;text-align:center;transition:transform .2s,box-shadow .2s;
    position:relative;overflow:hidden;
  }
  .stat-card::after{
    content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;
  }
  .stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.3);}
  .stat-card .value{font-size:2.6rem;font-weight:800;line-height:1;letter-spacing:-1px;}
  .stat-card .label{font-size:0.75rem;color:var(--dim);margin-top:8px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;}
  .card-total::after{background:var(--blue);}    .card-total  .value{color:var(--blue);}
  .card-pass::after {background:var(--green);}   .card-pass   .value{color:var(--green);}
  .card-fail::after {background:var(--red);}     .card-fail   .value{color:var(--red);}
  .card-skip::after {background:var(--yellow);}  .card-skip   .value{color:var(--yellow);}
  .card-rate::after {background:var(--purple);}  .card-rate   .value{color:var(--purple);}
  .card-time::after {background:var(--accent);}  .card-time   .value{color:var(--accent);}

  /* ── Progress bar ── */
  .progress-section{padding:0 48px 28px;}
  .progress-label{display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.85rem;color:var(--dim);}
  .progress-bar{height:14px;background:var(--surface2);border-radius:7px;overflow:hidden;box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);}
  .progress-fill{
    height:100%;border-radius:7px;
    background:linear-gradient(90deg,#22c55e,#0ea5e9,#a78bfa);
    transition:width 1.5s cubic-bezier(0.4,0,0.2,1);
    box-shadow:0 0 12px rgba(34,197,94,0.4);
  }

  /* ── Charts ── */
  .charts-section{padding:0 48px 28px;display:grid;grid-template-columns:1fr 1fr;gap:24px;}
  .chart-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px;}
  .chart-card h3{font-size:0.95rem;color:var(--blue);margin-bottom:16px;font-weight:700;display:flex;align-items:center;gap:8px;}
  canvas{width:100%!important;max-height:280px;}

  /* ── Type summary table ── */
  .section{padding:0 48px 28px;}
  .section h2{
    font-size:1.15rem;font-weight:700;color:var(--blue);margin-bottom:16px;
    padding-bottom:10px;border-bottom:2px solid var(--border);
    display:flex;align-items:center;gap:8px;
  }
  table{width:100%;border-collapse:collapse;font-size:0.875rem;border-radius:10px;overflow:hidden;}
  th{
    background:var(--surface2);color:var(--text);padding:12px 14px;text-align:left;
    border-bottom:2px solid var(--accent);font-weight:700;font-size:0.78rem;
    text-transform:uppercase;letter-spacing:.5px;
  }
  td{padding:10px 14px;border-bottom:1px solid rgba(71,85,105,0.4);}
  tr:nth-child(even) td{background:rgba(255,255,255,.015);}
  tr:hover td{background:rgba(56,189,248,.06);transition:background .15s;}
  .center{text-align:center;}
  .green{color:var(--green);}
  .red{color:var(--red);}
  .yellow{color:var(--yellow);}
  .dim{color:var(--dim);}

  /* ── Badges ── */
  .badge{padding:3px 12px;border-radius:12px;font-size:0.78rem;font-weight:700;}
  .badge-green{background:#166534;color:#86efac;}
  .badge-yellow{background:#78350f;color:#fde68a;}
  .badge-red{background:#7f1d1d;color:#fca5a5;}

  /* ── Test status ── */
  .status-pass{color:var(--green);font-weight:700;}
  .status-fail{color:var(--red);font-weight:700;}
  .status-pending{color:var(--yellow);font-weight:700;}

  /* ── Suite blocks ── */
  .suite-block{background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:16px;overflow:hidden;}
  .suite-header{
    display:flex;justify-content:space-between;align-items:center;
    padding:13px 18px;background:var(--surface2);border-bottom:1px solid var(--border);
  }
  .suite-title{font-weight:700;font-size:0.92rem;color:var(--blue);}
  .suite-meta{display:flex;gap:14px;font-size:0.82rem;align-items:center;}
  .test-table{width:100%;border-collapse:collapse;font-size:0.8rem;}
  .test-table th{background:#0f1929;color:var(--dim);padding:8px 12px;font-weight:600;font-size:0.76rem;text-transform:uppercase;letter-spacing:.3px;}
  .test-table td{padding:7px 12px;border-bottom:1px solid rgba(26,39,68,0.8);}
  .test-table tr:last-child td{border-bottom:none;}
  .test-table tr:hover td{background:rgba(56,189,248,.04);}
  .error-trace{
    background:#1a0a0a;border:1px solid #7f1d1d;border-radius:6px;
    padding:8px;color:#fca5a5;font-family:'Consolas',monospace;font-size:0.75rem;
    white-space:pre-wrap;max-height:80px;overflow-y:auto;
  }

  /* ── Banner strip ── */
  .banner{
    background:linear-gradient(90deg,rgba(34,197,94,.12),rgba(14,165,233,.12));
    border:1px solid rgba(34,197,94,.2);border-radius:10px;
    padding:14px 22px;margin:0 48px 28px;
    display:flex;align-items:center;gap:14px;font-size:0.88rem;
  }
  .banner-icon{font-size:1.5rem;}
  .banner strong{color:var(--green);}

  /* ── Footer ── */
  .footer{
    text-align:center;padding:26px 48px;color:var(--dim);font-size:0.8rem;
    border-top:1px solid var(--border);background:var(--surface);
    margin-top:8px;
  }

  /* ── Responsive ── */
  @media(max-width:768px){
    .stats-grid,.section,.progress-section,.banner{padding-left:20px;padding-right:20px;}
    .charts-section{grid-template-columns:1fr;padding:0 20px 20px;}
    .header{padding:24px 20px;}
    .header h1{font-size:1.6rem;}
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

<!-- SUCCESS BANNER -->
${parseFloat(passRate) >= 99 ? `
<div class="banner">
  <span class="banner-icon">🏆</span>
  <span><strong>Perfect Score!</strong> All ${total} tests passed with a ${passRate}% pass rate. The PathoAI platform is fully validated across all ${Object.keys(typeMap).length} test categories.</span>
</div>` : ''}

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
      <tr>
        <th>Test Type</th>
        <th class="center">Total</th>
        <th class="center">Passed</th>
        <th class="center">Failed</th>
        <th class="center">Pending</th>
        <th class="center">Pass Rate</th>
      </tr>
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
  <p style="margin-top:6px">© PathoAI Health Platform · <a href="https://github.com/srinivas939/pathoAi" target="_blank">github.com/srinivas939/pathoAi</a></p>
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
      { label: 'Passed', data: [${chartPassed}], backgroundColor: 'rgba(34,197,94,0.82)', borderRadius: 5, borderSkipped: false },
      { label: 'Failed', data: [${chartFailed}], backgroundColor: 'rgba(239,68,68,0.82)',  borderRadius: 5, borderSkipped: false },
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { stacked: false, ticks: { maxRotation: 60, font: { size: 8 } } },
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
      hoverOffset: 10
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: true,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16 } },
      tooltip: {
        callbacks: {
          label: ctx => {
            const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
            return ' ' + ctx.label + ': ' + ctx.raw + ' (' + ((ctx.raw/total)*100).toFixed(1) + '%)';
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
  console.log(`🌐 HTML report saved → ${OUT_FILE}`);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

module.exports = { generateHTMLReport };
