const fs = require('fs');

const dict = {
  'â•\x90': '═',
  '◈': '◈',
  '◽': '◽',
  '⬫': '⬫',
  '✎': '✎',
  '⊞': '⊞',
  '⟲': '⟲',
  '↗': '↗',
  '☰': '☰',
  '⬇': '⬇',
  '⬆': '⬆',
  '⚠': '⚠',
  '×': '×',
  '✅': '✅',
  'â—\x8F': '●',
  '○': '○',
  '′': '′',
  '⚙︎': '⚙︎',
  '⚙': '⚙',
  '™': '™',
  '—': '—',
  '─': '─',
  '✓': '✓',
  '→': '→',
  '↓': '↓',
  '↑': '↑',
  '←': '←',
  'é': 'é',
  '’': '’',
  '“': '“',
  'â€\x9D': '”',
  '”': '”',
  '•': '•',
  '©': '©'
};

const glob = require('fs').readdirSync('.');
glob.forEach(f => {
    if (!f.endsWith('.html') && !f.endsWith('.js') && !f.endsWith('.css')) return;
    let c = fs.readFileSync(f, 'utf8');
    let o = c;
    for (const [bad, good] of Object.entries(dict)) {
        c = c.split(bad).join(good);
    }
    // Also replace those weird fragments from last time just in case:
    c = c.replace(/converted \&check;/g, 'converted ');
    c = c.replace(/uploaded \&check;/g, 'uploaded ');
    c = c.replace(/converted \&check;to/g, 'converted to');
    
    if (c !== o) {
        fs.writeFileSync(f, c);
        console.log('Fixed mojibake in ' + f);
    }
});
