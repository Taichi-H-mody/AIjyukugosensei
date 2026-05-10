// 自動生成された追加熟語データ (初期状態は空です)
// パソコンの裏側で auto-updater.js を起動すると、ここにどんどんデータが自動追記されます。
const autoData = {};
for (const k in autoData) {
  if (window.OFFLINE_DB[k]) {
    window.OFFLINE_DB[k] = window.OFFLINE_DB[k].concat(autoData[k]);
  }
}
