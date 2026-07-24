// BrainBattleAppium/utils/generateSummary.js
import fs from 'fs';
import path from 'path';

export function generateSummary(results, duration, statsFilePath) {
  try {
    fs.mkdirSync(path.dirname(statsFilePath), { recursive: true });

    const total = results.length;
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const pending = results.filter(r => r.status === 'PENDING').length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
    const durSec = (duration / 1000).toFixed(2);

    const stats = {
      total,
      passed,
      failed,
      pending,
      passRate,
      duration: durSec,
      categories: new Set(results.map(r => r.category)).size
    };

    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2), 'utf8');
    console.log(`📝 Summary stats saved: ${statsFilePath}`);
  } catch (e) {
    console.error('Failed to generate summary statistics:', e.message);
  }
}
