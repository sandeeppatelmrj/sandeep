const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let h = fs.readFileSync(f, 'utf8');
    // Replace: </a></li> \n <!-- Hamburger Button
    // With:    </a></li> \n </ul> \n <!-- Hamburger Button
    if (h.includes('<!-- Hamburger Button') && !h.includes('</ul>\n            <!-- Hamburger Button')) {
        h = h.replace(/<\/a><\/li>\s*<!-- Hamburger Button/g, '</a></li>\n            </ul>\n            <!-- Hamburger Button');
        fs.writeFileSync(f, h);
    }
});
console.log('Fixed missing ul tags.');
