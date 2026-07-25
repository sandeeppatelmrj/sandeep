const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('admin'));

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Add Close Button
    if (html.includes('class="mobile-menu-drawer"') && !html.includes('drawer-close-btn')) {
        html = html.replace(
            /(<div class="mobile-menu-drawer"[^>]*>)/,
            '$1\n        <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close menu" style="position: absolute; top: 25px; right: 5vw; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 16px; border-radius: 30px; font-size: 14px; cursor: pointer; z-index: 1000;">&#x2715; Close</button>'
        );
        changed = true;
    }

    // Add Close Button Logic
    if (changed && html.includes('function openMenu()')) {
        html = html.replace(
            /btn\.classList\.remove\('open'\);[\s\S]*?\}\)/,
            "btn.classList.remove('open');\n              overlay.classList.remove('open');\n              document.body.style.overflow = '';\n          }\n          if (document.getElementById('drawerCloseBtn')) {\n              document.getElementById('drawerCloseBtn').addEventListener('click', closeMenu);\n          }\n          overlay.addEventListener('click', closeMenu);"
        );
    }
    
    // Bump cache buster for all JS to ensure hard reload
    if (changed) {
        html = html.replace(/\?v=[0-9]+/g, '?v=' + Date.now());
        fs.writeFileSync(file, html);
        console.log('Updated ' + file);
    }
});
