// ===== AI熟語先生 - Massive Offline Mode =====

let allJukugo = [];    
let shownCount = 0;    

function isKanji(ch) {
  const c = ch.charCodeAt(0);
  return (c >= 0x4E00 && c <= 0x9FFF) || (c >= 0x3400 && c <= 0x4DBF);
}

function showError(msg) { document.getElementById('error-msg').textContent = msg; }
function clearError() { document.getElementById('error-msg').textContent = ''; }

function showLoading() {
  document.getElementById('results-container').innerHTML = `
    <div class="loading">
      <div class="spinner-wave">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <p class="loading-text">言葉を紡いでいます...</p>
    </div>`;
}

function renderCards(list, startIndex) {
  const container = document.getElementById('results-container');
  const existingBtn = container.querySelector('.more-btn-wrap');
  if (existingBtn) existingBtn.remove();

  list.forEach((item, i) => {
    const num = startIndex + i + 1;
    const card = document.createElement('div');
    card.className = 'jukugo-card';
    card.style.animationDelay = (i * 0.08 + 0.1) + 's';
    card.innerHTML = `
      <div class="jukugo-header">
        <span class="jukugo-num">${num}</span>
        <span class="jukugo-word">${item.jukugo}</span>
        <span class="jukugo-reading">【${item.reading}】</span>
      </div>
      <div class="jukugo-meaning"><strong>意味：</strong>${item.meaning}</div>
      <div class="jukugo-example"><strong>例文：</strong>${item.example}</div>`;
    container.appendChild(card);
  });
}

function showMoreButton() {
  if (shownCount >= allJukugo.length) return;
  const container = document.getElementById('results-container');
  const wrap = document.createElement('div');
  wrap.className = 'more-btn-wrap';
  wrap.innerHTML = `<button class="more-btn" onclick="showMore()">💡 もっと知りたい！</button>`;
  container.appendChild(wrap);
}

function showMore() {
  const next = allJukugo.slice(shownCount, shownCount + 5);
  renderCards(next, shownCount);
  shownCount += next.length;
  if (shownCount < allJukugo.length) showMoreButton();
}

function displayResults(data) {
  const container = document.getElementById('results-container');
  container.innerHTML = '';
  
  // 重複を削除（熟語名でユニークにする）
  const uniqueData = [];
  const seen = new Set();
  data.forEach(item => {
    if (!seen.has(item.jukugo)) {
      seen.add(item.jukugo);
      uniqueData.push(item);
    }
  });

  allJukugo = uniqueData;
  shownCount = 0;
  const first = uniqueData.slice(0, 5);
  renderCards(first, 0);
  shownCount = first.length;
  if (uniqueData.length > 5) showMoreButton();
}

function showNotFound(kanji) {
  document.getElementById('results-container').innerHTML = `
    <div class="not-found">
      <div class="not-found-icon">🍃</div>
      <p class="not-found-text">「${kanji}」のデータは、現在の辞書には含まれていません。<br>
      別の漢字をお試しください。</p>
    </div>`;
}

// --- Fetch Offline Data ---
async function fetchOfflineData(kanji) {
  // 演出としてAIが考えているような1.2秒のウェイトを入れる
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.OFFLINE_DB[kanji] || null);
    }, 1200);
  });
}

// --- Main Generate ---
async function generateJukugo() {
  const input = document.getElementById('kanji-input');
  const btn = document.getElementById('generate-btn');
  const kanji = input.value.trim();

  clearError();

  if (!kanji) { showError('漢字を一文字入力してください。'); input.focus(); return; }
  if (kanji.length !== 1) { showError('一文字だけ入力してください。'); input.focus(); return; }
  if (!isKanji(kanji)) { showError('漢字を入力してください。'); input.focus(); return; }

  btn.disabled = true;
  const originalBtnText = btn.querySelector('span:last-child').textContent;
  btn.querySelector('span:last-child').textContent = '考え中...';
  showLoading();

  try {
    const data = await fetchOfflineData(kanji);
    if (data && data.length > 0) {
      displayResults(data);
    } else {
      showNotFound(kanji);
    }
  } catch (e) {
    console.error(e);
    document.getElementById('results-container').innerHTML = `
      <div class="not-found">
        <div class="not-found-icon">⚠️</div>
        <p class="not-found-text">エラーが発生しました。<br>${e.message}</p>
      </div>`;
  } finally {
    btn.disabled = false;
    btn.querySelector('span:last-child').textContent = originalBtnText;
  }
}

function updateKanjiGrid() {
  const grade = document.getElementById('grade-select').value;
  const grid = document.getElementById('kanji-grid');
  grid.innerHTML = '';

  if (!grade || !KANJI_BY_GRADE[grade]) {
    grid.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">学年を選ぶと漢字が表示されます</p>';
    return;
  }

  KANJI_BY_GRADE[grade].forEach(k => {
    const chip = document.createElement('div');
    chip.className = 'kanji-chip';
    chip.textContent = k;
    chip.onclick = () => {
      document.getElementById('kanji-input').value = k;
      generateJukugo();
      document.getElementById('kanji-grid-wrap').open = false;
    };
    grid.appendChild(chip);
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('kanji-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') generateJukugo();
  });

  document.getElementById('kanji-input').focus();
});
