const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ==========================================
// ★ 先生へ：ここに各種設定を入れてください！
// ==========================================

// 1. 熟語生成のためのAIキー
const API_KEY = "AIzaSyAUvSGFnQPIEglVkRc9Eqxj_d02-TOLXGo"; 
const MODEL_NAME = "gemini-2.0-flash";

// 2. ネット自動更新（GitHub）のための設定（※空のままだとローカル更新のみになります）
const GITHUB_TOKEN = ""; // GitHubのPersonal Access Token
const GITHUB_OWNER = ""; // GitHubのユーザー名（例: "taro-yamada"）
const GITHUB_REPO  = ""; // リポジトリ名（例: "kanji-jukugo-app"）

// ==========================================

const AUTO_FILE_PATH = path.join(__dirname, 'data-auto.js');
const DB_JSON_PATH = path.join(__dirname, 'auto-database.json');

// kanji-list.js から漢字一覧を読み込む
const kanjiListContent = fs.readFileSync(path.join(__dirname, 'kanji-list.js'), 'utf8');
const match = kanjiListContent.match(/\[([\s\S]*?)\]/);
let KANJI_LIST = [];
if (match) {
    const strList = match[1].match(/"(.*?)"/g);
    if (strList) {
        KANJI_LIST = strList.map(s => s.replace(/"/g, ''));
    }
}

let autoDb = {};
if (fs.existsSync(DB_JSON_PATH)) {
    autoDb = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
}

async function fetchNewJukugo(kanji) {
    const existing = autoDb[kanji] ? autoDb[kanji].map(j => j.jukugo).join(', ') : '特になし';
    const prompt = `あなたは小学生向けの国語の先生です。
漢字「${kanji}」を使った熟語を新たに2つ生成してください。
以下の熟語は既にあるので【絶対に】除外してください： ${existing}
出力は必ず以下のJSON配列のみとしてください。Markdown記号(\`\`\`json)などは一切含めないでください。
[{"jukugo": "熟語", "reading": "よみ", "meaning": "意味", "example": "例文"}]`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: [{parts: [{text: prompt}]}],
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json"
            }
        })
    });
    
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`API Error ${res.status}: ${err}`);
    }
    
    const data = await res.json();
    if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response from API");
    }
    
    const text = data.candidates[0].content.parts[0].text;
    try {
        return JSON.parse(text);
    } catch(e) {
        throw new Error("JSON Parse Error: " + text);
    }
}

async function deployToGitHub() {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) return;
    
    console.log("🚀 インターネット上のアプリ（GitHub）を自動更新（アップロード）しています...");
    
    const filesToUpdate = ['data-auto.js', 'auto-database.json'];
    
    for (const filename of filesToUpdate) {
        const filePath = path.join(__dirname, filename);
        if (!fs.existsSync(filePath)) continue;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const encodedContent = Buffer.from(content, 'utf8').toString('base64');
        
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`;
        
        // 1. ファイルの現状（SHA）を取得
        let sha = undefined;
        try {
            const getRes = await fetch(url, {
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github.v3+json",
                    "User-Agent": "Auto-Updater-Script"
                }
            });
            if (getRes.ok) {
                const getData = await getRes.json();
                sha = getData.sha;
            }
        } catch (e) {
            // 新規作成の場合はSHAなしでOK
        }
        
        // 2. ファイルを更新（PUT）
        const body = {
            message: `🤖 AI自動更新: ${filename} に新しい熟語を追加しました`,
            content: encodedContent,
        };
        if (sha) body.sha = sha;
        
        try {
            const putRes = await fetch(url, {
                method: 'PUT',
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github.v3+json",
                    "Content-Type": "application/json",
                    "User-Agent": "Auto-Updater-Script"
                },
                body: JSON.stringify(body)
            });
            
            if (!putRes.ok) {
                console.error(`❌ ${filename} のGitHubアップロードに失敗しました。キーや名前が正しいか確認してください。 (${putRes.status})`);
            }
        } catch (e) {
            console.error(`❌ ${filename} のGitHub通信エラー: ${e.message}`);
        }
    }
    console.log("🌐 GitHubへの自動アップロードが完了しました！数分後に児童の画面にも最新の辞書が反映されます。");
}

async function runLoop() {
    console.log("==========================================");
    console.log(" 🌟 自動生成 ＆ ネット自動公開システム 🌟");
    console.log("==========================================\\n");
    console.log("この画面を開いたままにしておくと、自動的に新しい熟語を追加し、");
    console.log("1時間に1回のペースでインターネット（Netlify）へ自動更新します。\\n");
    
    let loopCount = 0;
    
    while(true) {
        const kanji = KANJI_LIST[Math.floor(Math.random() * KANJI_LIST.length)];
        console.log(`[${new Date().toLocaleTimeString()}] 「${kanji}」の新しい熟語をAIに考えてもらっています...`);
        
        try {
            const newItems = await fetchNewJukugo(kanji);
            
            if (newItems && Array.isArray(newItems)) {
                if (!autoDb[kanji]) autoDb[kanji] = [];
                autoDb[kanji].push(...newItems);
                
                // 1. 保存
                fs.writeFileSync(DB_JSON_PATH, JSON.stringify(autoDb, null, 2));
                
                // 2. data-auto.js 更新
                let jsContent = `// 自動生成された追加熟語データ\\n`;
                jsContent += `const autoData = ${JSON.stringify(autoDb, null, 2)};\\n`;
                jsContent += `for (const k in autoData) {\\n`;
                jsContent += `  if (window.OFFLINE_DB[k]) {\\n`;
                jsContent += `    window.OFFLINE_DB[k] = window.OFFLINE_DB[k].concat(autoData[k]);\\n`;
                jsContent += `  }\\n`;
                jsContent += `}\\n`;
                fs.writeFileSync(AUTO_FILE_PATH, jsContent);
                console.log(`✨ 成功！「${kanji}」の熟語を${newItems.length}個追加しました。（${newItems.map(i => i.jukugo).join(', ')}）`);
                
                loopCount++;
                // 初回のデータ追加時、または1時間（12回）ごとにGitHubに自動デプロイ
                if ((loopCount === 1 || loopCount % 12 === 0) && GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO) {
                    await deployToGitHub();
                }
            }
        } catch (e) {
            console.error(`❌ エラー発生: ${e.message}`);
        }
        
        console.log("⏳ 次の生成まで5分待機します...\\n");
        await new Promise(r => setTimeout(r, 300000));
    }
}

if (API_KEY === "ここにAPIキーを貼り付ける" || API_KEY === "") {
    console.error("【エラー】 APIキーが設定されていません！");
    console.error("auto-updater.js を開いて、ご自身のAI用APIキーを貼り付けてください。");
    setTimeout(() => {}, 60000); 
} else {
    runLoop();
}
