// utils/generateSummary.js
// Appends a Markdown summary to the GitHub Actions Job Summary ($GITHUB_STEP_SUMMARY).
// Usage: node utils/generateSummary.js <results-jsonl-path>

const fs   = require('fs');
const path = require('path');

function generateSummary(resultsPath) {
  // ── Load results ─────────────────────────────────────────────────────────────
  let results = [];
  if (fs.existsSync(resultsPath)) {
    const lines = fs.readFileSync(resultsPath, 'utf8').trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try { results.push(JSON.parse(line)); } catch {}
    }
  }

  const total    = results.length;
  const passed   = results.filter(r => r.status === 'passed').length;
  const failed   = results.filter(r => r.status === 'failed').length;
  const skipped  = results.filter(r => r.status === 'skipped' || r.status === 'pending').length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
  const totalDur = results.reduce((a, r) => a + (r.duration || 0), 0);
  const runDate  = new Date().toISOString();

  // Category breakdown
  const catMap = {};
  for (const r of results) {
    if (!catMap[r.category]) catMap[r.category] = { total: 0, passed: 0, failed: 0 };
    catMap[r.category].total++;
    if (r.status === 'passed') catMap[r.category].passed++;
    else catMap[r.category].failed++;
  }

  const passBadge = parseFloat(passRate) >= 99 ? '🟢' : parseFloat(passRate) >= 80 ? '🟡' : '🔴';

  // ── Build Markdown ────────────────────────────────────────────────────────────
  let md = `## 📱 PathoAI Android Appium E2E — Test Summary\n\n`;
  md += `> **Run Date**: ${runDate}  \n`;
  md += `> **Environment**: Android Emulator API 29 (Nexus 6) · GitHub Actions Ubuntu\n\n`;

  md += `### ${passBadge} Overall Results\n\n`;
  md += `| Metric | Value |\n|--------|-------|\n`;
  md += `| Total Tests | **${total}** |\n`;
  md += `| ✅ Passed | **${passed}** |\n`;
  md += `| ❌ Failed | **${failed}** |\n`;
  md += `| ⏭ Skipped | **${skipped}** |\n`;
  md += `| 📊 Pass Rate | **${passRate}%** |\n`;
  md += `| ⏱ Duration | **${totalDur}ms** |\n\n`;

  md += `### 📋 By Category\n\n`;
  md += `| # | Category | Total | Passed | Failed | Pass Rate |\n`;
  md += `|---|----------|------:|-------:|-------:|----------:|\n`;

  let idx = 1;
  for (const [cat, s] of Object.entries(catMap)) {
    const rate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) : '0.0';
    const icon = parseFloat(rate) >= 99 ? '🟢' : parseFloat(rate) >= 80 ? '🟡' : '🔴';
    md += `| ${idx++} | ${icon} ${cat} | ${s.total} | ${s.passed} | ${s.failed} | **${rate}%** |\n`;
  }

  if (parseFloat(passRate) >= 99) {
    md += `\n> 🏆 **Perfect Score!** All ${total} Appium tests passed with a ${passRate}% pass rate.\n`;
  } else if (failed > 0) {
    md += `\n> ⚠️ **${failed} test(s) failed.** See the HTML report for details.\n`;
  }

  md += `\n### 🔗 Reports\n\n`;
  md += `- 📄 [HTML Execution Report](../reports/latest/android-execution-report.html)\n`;
  md += `- 📊 [Excel Report](../reports/latest/android-report.xlsx)\n`;

  // ── Write to GITHUB_STEP_SUMMARY ─────────────────────────────────────────────
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    fs.appendFileSync(summaryFile, md, 'utf8');
    console.log(`📝 GitHub Actions summary written → ${summaryFile}`);
  } else {
    console.log('ℹ️  GITHUB_STEP_SUMMARY not set — printing summary to stdout:\n');
    console.log(md);
  }

  // Also save locally as a markdown file
  const localDir = path.join(process.cwd(), 'Test_Results', 'Android');
  if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
  const localPath = path.join(localDir, 'summary.md');
  fs.writeFileSync(localPath, md, 'utf8');
  console.log(`📝 Local summary saved → ${localPath}`);
}

// ── CLI entrypoint ────────────────────────────────────────────────────────────
const resultsArg = process.argv[2] || path.join(process.cwd(), '.wdio-results.jsonl');
generateSummary(resultsArg);
