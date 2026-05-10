const fs = require('fs');
eval(fs.readFileSync('kanji-list.js', 'utf8'));
global.window = {};
global.window.OFFLINE_DB = {};
eval(fs.readFileSync('data-1.js', 'utf8'));
eval(fs.readFileSync('data-2.js', 'utf8'));
eval(fs.readFileSync('data-3.js', 'utf8'));
eval(fs.readFileSync('data-4.js', 'utf8'));
eval(fs.readFileSync('data-5.js', 'utf8'));
eval(fs.readFileSync('data-6.js', 'utf8'));

const db = global.window.OFFLINE_DB;
let totalMissing = 0;
const report = [];

for (const k of GRADE6_KANJI) {
  const count = db[k] ? db[k].length : 0;
  if (count < 10) {
    const need = 10 - count;
    report.push({ kanji: k, current: count, need: need });
    totalMissing += need;
  }
}

fs.writeFileSync('missing_report.json', JSON.stringify({ totalMissing, report }, null, 2));
console.log(`Total missing jukugo to reach 10 per kanji: ${totalMissing}`);
