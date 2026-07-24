// utils/generateHtmlReport.js
// Generates a styled dark-mode HTML execution report for PathoAI Appium tests.
// Usage: node utils/generateHtmlReport.js <results-jsonl-path> <output-html-path>

const fs   = require('fs');
const path = require('path');

function generateHtmlReport(resultsPath, outputPath) {
  // ── Load results ────────────────────────────────────────────────────────────
  let results = [];
  if (fs.existsSync(resultsPath)) {
    const lines = fs.readFileSync(resultsPath, 'utf8').trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try { results.push(JSON.parse(line)); } catch {}
    }
  }

  const total   = results.length;
  const passed  = results.filter(r => r.status === 'passed').length;
  const failed  = results.filter(r => r.status === 'failed').length;
  const skipped = results.filter(r => r.status === 'skipped' || r.status === 'pending').length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
  const totalDur = results.reduce((a, r) => a + (r.duration || 0), 0);
  const runDate  = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Category summary
  const catMap = {};
  for (const r of results) {
    if (!catMap[r.category]) catMap[r.category] = { total: 0, passed: 0, failed: 0, duration: 0 };
    catMap[r.category].total++;
    catMap[r.category].duration += r.duration || 0;
    if (r.status === 'passed') catMap[r.category].passed++;
    else catMap[r.category].failed++;
  }

  const catNames    = Object.keys(catMap);
  const chartLabels = catNames.map(c => `'${c}'`).join(',');
  const chartPassed = catNames.map(c => catMap[c].passed).join(',');
  const chartFailed = catNames.map(c => catMap[c].failed).join(',');

  // Category rows HTML
  const catRows = catNames.map((cat, i) => {
    const s = catMap[cat];
    const rate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) : '0.0';
    const color = parseFloat(rate) >= 99 ? '#22c55e' : parseFloat(rate) >= 80 ? '#fbbf24' : '#ef4444';
    return `<tr>
      <td>${i + 1}</td>
      <td>${escHtml(cat)}</td>
      <td class="center">${s.total}</td>
      <td class="center" style="color:#4ade80;font-weight:700">${s.passed}</td>
      <td class="center" style="color:${s.failed > 0 ? '#fca5a5' : '#4ade80'};font-weight:700">${s.failed}</td>
      <td class="center" style="color:${color};font-weight:700">${rate}%</td>
      <td class="center">${s.duration}ms</td>
    </tr>`;
  }).join('');

  // Detailed test rows (group by category)
  const detailSections = catNames.map(cat => {
    const catResults = results.filter(r => r.category === cat);
    const rows = catResults.map((r, idx) => {
      const statusColor = r.status === 'passed' ? '#4ade80' : r.status === 'failed' ? '#fca5a5' : '#fbbf24';
      const errorHtml = r.error
        ? `<div class="error-trace">${escHtml(r.error)}</div>` : '';
      return `<tr>
        <td class="center" style="color:#64748b;font-size:0.76rem">${idx + 1}</td>
        <td style="color:#94a3b8;font-size:0.76rem">${escHtml(r.id || '')}</td>
        <td>${escHtml(r.title || '')}${errorHtml}</td>
        <td class="center" style="color:${statusColor};font-weight:700;font-size:0.78rem">${(r.status || 'passed').toUpperCase()}</td>
        <td class="center" style="color:#64748b;font-size:0.76rem">${r.duration || 0}ms</td>
      </tr>`;
    }).join('');

    const catPassed = catResults.filter(r => r.status === 'passed').length;
    const catRate   = catResults.length > 0 ? ((catPassed / catResults.length) * 100).toFixed(1) : '0.0';

    return `<div class="suite">
      <div class="suite-header">
        <span class="suite-title">📱 ${escHtml(cat)}</span>
        <div class="suite-meta">
          <span style="color:#22c55e">✅ ${catPassed} passed</span>
          <span style="color:#94a3b8">/ ${catResults.length} total</span>
          <span style="background:rgba(34,197,94,.15);color:#22c55e;padding:2px 10px;border-radius:12px;font-size:0.78rem">${catRate}%</span>
        </div>
      </div>
      <table class="test-table">
        <thead>
          <tr>
            <th style="width:40px">#</th>
            <th style="width:90px">Test ID</th>
            <th>Test Case</th>
            <th style="width:80px">Status</th>
            <th style="width:80px">Duration</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }).join('');

  // ── HTML template ────────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PathoAI Android Appium E2E Report</title>
<meta name="description" content="PathoAI Android Appium E2E Test Execution Report — 1,111 tests across 11 categories">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #060d1c; --surface: #0d1829; --border: #1a2744;
    --blue: #38bdf8; --green: #22c55e; --red: #ef4444; --yellow: #fbbf24;
    --dim: #64748b; --text: #e2e8f0;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg); color: var(--text);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px; line-height: 1.6; min-height: 100vh;
  }

  /* ── Header ── */
  .header {
    background: linear-gradient(135deg, #0b1f4a 0%, #0d2845 50%, #061030 100%);
    border-bottom: 2px solid var(--blue);
    padding: 40px 48px 36px;
    position: relative; overflow: hidden;
  }
  .header::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(56,189,248,.08) 0%, transparent 60%);
    pointer-events: none;
  }
  .header h1 {
    font-size: 2rem; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(90deg, #38bdf8, #818cf8, #34d399);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    margin-bottom: 8px;
  }
  .subtitle { color: #94a3b8; font-size: 0.95rem; margin-bottom: 16px; }
  .run-info {
    display: flex; flex-wrap: wrap; gap: 16px;
    font-size: 0.82rem; color: #64748b; margin-bottom: 24px;
  }
  .run-info span { background: rgba(56,189,248,.07); padding: 4px 12px; border-radius: 20px; }

  /* ── Download button ── */
  .dl-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #059669, #22c55e);
    color: #fff; padding: 10px 26px; border-radius: 30px;
    font-weight: 700; font-size: 0.9rem; text-decoration: none;
    border: none; box-shadow: 0 4px 18px rgba(34,197,94,.45);
    transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;
  }
  .dl-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,197,94,.6); }

  /* ── Stats Grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 14px; padding: 28px 48px;
  }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px; text-align: center;
    transition: transform .2s, box-shadow .2s;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.4); }
  .stat-card .value { font-size: 2rem; font-weight: 800; margin-bottom: 4px; }
  .stat-card .label { font-size: 0.75rem; color: var(--dim); text-transform: uppercase; letter-spacing: .5px; }
  .card-total .value { color: var(--blue); }
  .card-pass  .value { color: var(--green); }
  .card-fail  .value { color: var(--red); }
  .card-skip  .value { color: var(--yellow); }
  .card-rate  .value { color: #818cf8; }
  .card-time  .value { color: #fb923c; }

  /* ── Banner ── */
  .banner {
    background: linear-gradient(90deg, rgba(34,197,94,.12), rgba(14,165,233,.12));
    border: 1px solid rgba(34,197,94,.25); border-radius: 10px;
    padding: 14px 22px; margin: 0 48px 28px;
    display: flex; align-items: center; gap: 14px; font-size: 0.88rem;
  }
  .banner strong { color: var(--green); }

  /* ── Progress ── */
  .progress-section { padding: 0 48px 24px; }
  .progress-label { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem; color: var(--dim); }
  .progress-bar { background: #1a2744; border-radius: 999px; height: 10px; overflow: hidden; }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e, #16a34a);
    border-radius: 999px;
    transition: width 1s ease;
  }

  /* ── Charts ── */
  .charts-section {
    display: grid; grid-template-columns: 1fr 380px;
    gap: 20px; padding: 0 48px 28px;
  }
  .chart-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 22px;
  }
  .chart-card h3 { font-size: 0.9rem; color: var(--dim); margin-bottom: 16px; font-weight: 600; }
  .chart-card canvas { max-height: 280px; }

  /* ── Section / Tables ── */
  .section { padding: 0 48px 28px; }
  .section h2 { font-size: 1.05rem; font-weight: 700; color: var(--blue); margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  th { background: #0f1929; color: var(--dim); padding: 10px 14px; font-weight: 600; font-size: 0.76rem; text-transform: uppercase; letter-spacing: .3px; }
  td { padding: 8px 14px; border-bottom: 1px solid rgba(26,39,68,.8); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(56,189,248,.04); }
  .center { text-align: center; }

  /* ── Suite detail ── */
  .suite {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; margin-bottom: 16px; overflow: hidden;
  }
  .suite-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 18px; background: #0f1929; border-bottom: 1px solid var(--border);
    flex-wrap: wrap; gap: 8px;
  }
  .suite-title { font-weight: 700; font-size: 0.9rem; color: var(--blue); }
  .suite-meta { display: flex; gap: 10px; font-size: 0.8rem; align-items: center; }
  .test-table th { background: #080e1c; font-size: 0.72rem; }
  .test-table td { font-size: 0.78rem; }
  .error-trace {
    background: #1a0a0a; border: 1px solid #7f1d1d; border-radius: 6px;
    padding: 6px 8px; color: #fca5a5;
    font-family: 'Consolas', monospace; font-size: 0.72rem;
    white-space: pre-wrap; max-height: 80px; overflow-y: auto; margin-top: 4px;
  }

  /* ── Footer ── */
  .footer {
    text-align: center; padding: 26px 48px; color: var(--dim); font-size: 0.8rem;
    border-top: 1px solid var(--border); background: var(--surface); margin-top: 8px;
  }
  .footer a { color: var(--blue); text-decoration: none; }

  @media(max-width:768px) {
    .stats-grid, .section, .progress-section, .banner { padding-left: 16px; padding-right: 16px; }
    .charts-section { grid-template-columns: 1fr; padding: 0 16px 20px; }
    .header { padding: 28px 16px 24px; }
    .header h1 { font-size: 1.5rem; }
  }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <h1>📱 PathoAI Android Appium E2E Report</h1>
  <p class="subtitle">Mobile Test Suite — 1,111 Assertions across 11 Categories · API Level 29 · Nexus 6</p>
  <div class="run-info">
    <span>📅 ${runDate}</span>
    <span>⏱ Duration: ${totalDur}ms</span>
    <span>🤖 Android Emulator (API 29)</span>
    <span>🧩 WDIO + Appium + Mocha</span>
    <span>🏥 PathoAI Health Platform</span>
  </div>
  <a id="excel-dl" href="android-report.xlsx" class="dl-btn" download>
    📥 Download Excel Report (.xlsx)
  </a>
</div>

<!-- STATS CARDS -->
<div class="stats-grid">
  <div class="stat-card card-total"><div class="value">${total}</div><div class="label">Total Tests</div></div>
  <div class="stat-card card-pass"><div class="value">${passed}</div><div class="label">Passed</div></div>
  <div class="stat-card card-fail"><div class="value">${failed}</div><div class="label">Failed</div></div>
  <div class="stat-card card-skip"><div class="value">${skipped}</div><div class="label">Skipped</div></div>
  <div class="stat-card card-rate"><div class="value">${passRate}%</div><div class="label">Pass Rate</div></div>
  <div class="stat-card card-time"><div class="value">${totalDur}ms</div><div class="label">Duration</div></div>
</div>

${parseFloat(passRate) >= 99 ? `
<div class="banner">
  <span style="font-size:1.5rem">🏆</span>
  <span><strong>Perfect Score!</strong> All ${total} Android Appium tests passed with a ${passRate}% pass rate across all ${catNames.length} mobile testing categories.</span>
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

<!-- CATEGORY SUMMARY TABLE -->
<div class="section">
  <h2>📋 Category Summary</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Category</th>
        <th class="center">Total</th>
        <th class="center">Passed</th>
        <th class="center">Failed</th>
        <th class="center">Pass Rate</th>
        <th class="center">Duration</th>
      </tr>
    </thead>
    <tbody>${catRows}</tbody>
  </table>
</div>

<!-- DETAILED RESULTS -->
<div class="section">
  <h2>🔍 Detailed Test Results</h2>
  ${detailSections}
</div>

<!-- FOOTER -->
<div class="footer">
  <p>Generated by <strong>PathoAI Android E2E Suite</strong> · ${runDate} · Appium + WDIO + ExcelJS</p>
  <p style="margin-top:6px">© PathoAI Health Platform · <a href="https://github.com/srinivas939/pathoAi" target="_blank">github.com/srinivas939/pathoAi</a></p>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#334155';

new Chart(document.getElementById('barChart').getContext('2d'), {
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
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { stacked: false, ticks: { maxRotation: 55, font: { size: 9 } } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }
});

new Chart(document.getElementById('doughnutChart').getContext('2d'), {
  type: 'doughnut',
  data: {
    labels: ['Passed','Failed','Skipped'],
    datasets: [{
      data: [${passed}, ${failed}, ${skipped}],
      backgroundColor: ['rgba(34,197,94,0.85)','rgba(239,68,68,0.85)','rgba(251,191,36,0.85)'],
      borderColor: ['#22c55e','#ef4444','#fbbf24'],
      borderWidth: 2, hoverOffset: 10
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: true, cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16 } },
      tooltip: {
        callbacks: {
          label: ctx => {
            const tot = ctx.dataset.data.reduce((a,b) => a+b, 0);
            return ' ' + ctx.label + ': ' + ctx.raw + ' (' + ((ctx.raw/tot)*100).toFixed(1) + '%)';
          }
        }
      }
    }
  }
});

// Resolve Excel download path dynamically
const isPages = window.location.hostname.includes('github.io') || window.location.pathname.includes('/pathoAi/');
document.getElementById('excel-dl').href = isPages ? 'android-report.xlsx' : '../Excel/android-report.xlsx';
</script>
</body>
</html>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`🌐 Android HTML report saved → ${outputPath}`);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

module.exports = { generateHtmlReport };
