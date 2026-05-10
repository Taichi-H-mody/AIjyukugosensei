// 自動生成された追加熟語データ
const autoData = {};

for (const k in autoData) {
  if (window.OFFLINE_DB[k]) {
    window.OFFLINE_DB[k] = window.OFFLINE_DB[k].concat(autoData[k]);
  } else {
    window.OFFLINE_DB[k] = autoData[k];
  }
}
