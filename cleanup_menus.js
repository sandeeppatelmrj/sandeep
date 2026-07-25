const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const btnRegex = /<!-- Hamburger Button \(mobile only\) -->\s*<button class="hamburger-btn" id="hamburgerBtn"[\s\S]*?<\/button>/g;
const drawerRegex = /<!-- Mobile Navigation Drawer -->\s*<div class="mobile-menu-drawer" id="mobileMenuDrawer">[\s\S]*?<\/div>\s*<div class="mobile-menu-overlay" id="mobileMenuOverlay"><\/div>/g;
const scriptRegex = /<script>\s*\(\s*function\(\)\s*\{[\s\S]*?var btn = document.getElementById\('hamburgerBtn'\);[\s\S]*?\}\)\(\);\s*<\/script>/g;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    content = content.replace(btnRegex, '');
    content = content.replace(drawerRegex, '');
    content = content.replace(scriptRegex, '');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Cleaned up hardcoded mobile menu from ${file}`);
    }
});
