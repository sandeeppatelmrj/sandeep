const fs = require('fs');
let siteLoader = fs.readFileSync('js/site-loader.js', 'utf8');

const oldDrawerHTML = `      drawer.innerHTML = \`
          <div class="mobile-menu-inner">
              <nav class="mobile-menu-nav">
                  <ul class="mobile-nav-links">
                  </ul>
              </nav>
          </div>
      \`;`;

const newDrawerHTML = `      drawer.innerHTML = \`
          <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close menu" style="position: absolute; top: 25px; right: 5vw; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 16px; border-radius: 30px; font-size: 14px; cursor: pointer; z-index: 1000;">&#x2715; Close</button>
          <div class="mobile-menu-inner">
              <nav class="mobile-menu-nav">
                  <ul class="mobile-nav-links">
                  </ul>
              </nav>
          </div>
      \`;`;

siteLoader = siteLoader.replace(oldDrawerHTML, newDrawerHTML);

const oldListener = `      // Toggle click listener
      hamburgerBtn.addEventListener('click', () => toggleMenu());`;
      
const newListener = `      // Toggle click listener
      hamburgerBtn.addEventListener('click', () => toggleMenu());
      
      // Close button listener
      const closeBtn = drawer.querySelector('#drawerCloseBtn');
      if (closeBtn) {
          closeBtn.addEventListener('click', () => toggleMenu(true));
      }`;

siteLoader = siteLoader.replace(oldListener, newListener);

fs.writeFileSync('js/site-loader.js', siteLoader);
console.log('Updated site-loader.js');
