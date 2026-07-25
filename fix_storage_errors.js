const fs = require('fs');

// Fix main.js
let mainJs = fs.readFileSync('js/main.js', 'utf8');

const oldPreloaderSessionCheck = `    if (sessionStorage.getItem('sandeep_preloader_shown')) {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();
        return;
    }
    sessionStorage.setItem('sandeep_preloader_shown', 'true');`;

const newPreloaderSessionCheck = `    let shown = false;
    try { shown = sessionStorage.getItem('sandeep_preloader_shown'); } catch(e) {}
    if (shown) {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();
        return;
    }
    try { sessionStorage.setItem('sandeep_preloader_shown', 'true'); } catch(e) {}`;

mainJs = mainJs.replace(oldPreloaderSessionCheck, newPreloaderSessionCheck);
mainJs = mainJs.replace(/\?v=[0-9]+/g, '?v=' + Date.now());
fs.writeFileSync('js/main.js', mainJs);
console.log('Fixed main.js');

// Fix site-loader.js
let siteLoaderJs = fs.readFileSync('js/site-loader.js', 'utf8');

const oldForceCacheClear = `  // FORCE CACHE CLEAR FOR LATEST PUBLISH
  (function() {
      if (!localStorage.getItem('site_version_1784936139044')) {
          localStorage.removeItem('sandeep_projects_v26');
          localStorage.removeItem('sandeep_photography_v2');
          localStorage.removeItem('sandeep_site_data_v2');
          localStorage.removeItem('sandeep_global_settings');
          localStorage.setItem('site_version_1784936139044', '1');
          console.log('Cleared old local storage to load new published defaults.');
      }
  })();`;

const newForceCacheClear = `  // FORCE CACHE CLEAR FOR LATEST PUBLISH
  (function() {
      try {
          if (!localStorage.getItem('site_version_1784936139044')) {
              localStorage.removeItem('sandeep_projects_v26');
              localStorage.removeItem('sandeep_photography_v2');
              localStorage.removeItem('sandeep_site_data_v2');
              localStorage.removeItem('sandeep_global_settings');
              localStorage.setItem('site_version_1784936139044', '1');
              console.log('Cleared old local storage to load new published defaults.');
          }
      } catch(e) {}
  })();`;

siteLoaderJs = siteLoaderJs.replace(oldForceCacheClear, newForceCacheClear);
siteLoaderJs = siteLoaderJs.replace(/\?v=[0-9]+/g, '?v=' + Date.now());
fs.writeFileSync('js/site-loader.js', siteLoaderJs);
console.log('Fixed site-loader.js');
