const fs = require('fs');
const vm = require('vm');

const files = [
  'kanji-list.js',
  'data-1.js',
  'data-2.js',
  'data-3.js',
  'data-4.js',
  'data-5.js',
  'data-6.js',
  'data-extra-1.js',
  'data-extra-2.js',
  'data-extra-3.js',
  'data-extra-4.js',
  'data-extra-5.js',
  'data-extra-6.js',
  'script.js'
];

const sandbox = { window: {}, document: { addEventListener: () => {}, getElementById: () => ({ addEventListener: () => {} }) }, console };
vm.createContext(sandbox);

try {
  for (const f of files) {
    if (fs.existsSync(f)) {
      const code = fs.readFileSync(f, 'utf8');
      vm.runInContext(code, sandbox, { filename: f });
    } else {
      console.log('Missing:', f);
    }
  }
  console.log('OFFLINE_DB keys count:', Object.keys(sandbox.window.OFFLINE_DB || {}).length);
  if (sandbox.window.OFFLINE_DB && sandbox.window.OFFLINE_DB['異']) {
    console.log('Items for 異:', sandbox.window.OFFLINE_DB['異'].length);
  }
} catch (e) {
  console.error('Error:', e);
}
