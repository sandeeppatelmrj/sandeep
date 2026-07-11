const fs = require('fs');
let c = fs.readFileSync('admin.html', 'utf8');
c = c.replace(/converted \&check;/g, 'converted ');
c = c.replace(/uploaded \&check;/g, 'uploaded ');
c = c.replace(/converted \&check;to/g, 'converted to');
fs.writeFileSync('admin.html', c);
console.log('Fixed syntax errors');
