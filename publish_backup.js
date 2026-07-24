const fs = require('fs');

const backupStr = fs.readFileSync('cms_backup_2026-07-24.json', 'utf8');
const backup = JSON.parse(backupStr);

// 1. Update Projects
if (backup.sandeep_projects_v26) {
    let pContent = fs.readFileSync('js/projects-data.js', 'utf8');
    const firstLineEnd = pContent.indexOf('\n');
    pContent = `const DEFAULT_PROJECTS = ${JSON.stringify(backup.sandeep_projects_v26)};\n` + pContent.substring(firstLineEnd + 1);
    fs.writeFileSync('js/projects-data.js', pContent);
    console.log('Updated projects-data.js');
}

// 2. Update Photography
if (backup.sandeep_photography_v2) {
    fs.writeFileSync('js/photography-data.js', `const DEFAULT_PHOTOGRAPHY = ${JSON.stringify(backup.sandeep_photography_v2, null, 4)};`);
    console.log('Updated photography-data.js');
}

// 3. Update Settings
if (backup.sandeep_global_settings) {
    // In cms-core.js
    let cContent = fs.readFileSync('js/cms-core.js', 'utf8');
    cContent = cContent.replace(/const DEFAULT_SETTINGS = \{[\s\S]*?\};\n/, `const DEFAULT_SETTINGS = ${JSON.stringify(backup.sandeep_global_settings, null, 4)};\n`);
    fs.writeFileSync('js/cms-core.js', cContent);
    
    // In site-loader.js
    let loader = fs.readFileSync('js/site-loader.js', 'utf8');
    const matchSettings = loader.match(/const DEFAULT_SETTINGS_FALLBACK = (.*?);/);
    if (matchSettings) {
        let newStr = '"' + JSON.stringify(backup.sandeep_global_settings).replace(/"/g, '\\"') + '"';
        loader = loader.replace(matchSettings[0], 'const DEFAULT_SETTINGS_FALLBACK = ' + newStr + ';');
        fs.writeFileSync('js/site-loader.js', loader);
    }
    console.log('Updated global settings');
}

// 4. Update Site Data
if (backup.sandeep_site_data_v2) {
    let loader = fs.readFileSync('js/site-loader.js', 'utf8');
    const matchSiteData = loader.match(/const DEFAULT_SITE_DATA = (\{[\s\S]*?\});/);
    if (matchSiteData) {
        let newStr = JSON.stringify(backup.sandeep_site_data_v2);
        loader = loader.replace(matchSiteData[0], 'const DEFAULT_SITE_DATA = ' + newStr + ';');
        fs.writeFileSync('js/site-loader.js', loader);
    }
    console.log('Updated site data');
}

// 5. Inject force-cache-clear in site-loader.js
const versionKey = 'site_version_' + Date.now();
let loaderCode = fs.readFileSync('js/site-loader.js', 'utf8');
if (!loaderCode.includes('// FORCE CACHE CLEAR')) {
    const clearLogic = `
// FORCE CACHE CLEAR FOR LATEST PUBLISH
(function() {
    if (!localStorage.getItem('${versionKey}')) {
        localStorage.removeItem('sandeep_projects_v26');
        localStorage.removeItem('sandeep_photography_v2');
        localStorage.removeItem('sandeep_site_data_v2');
        localStorage.removeItem('sandeep_global_settings');
        localStorage.setItem('${versionKey}', '1');
        console.log('Cleared old local storage to load new published defaults.');
    }
})();
`;
    loaderCode = clearLogic + loaderCode;
    fs.writeFileSync('js/site-loader.js', loaderCode);
    console.log('Injected force-cache-clear');
} else {
    // Update existing
    loaderCode = loaderCode.replace(/if \(!localStorage\.getItem\('site_version_\d+'\)\) \{/, `if (!localStorage.getItem('${versionKey}')) {`);
    loaderCode = loaderCode.replace(/localStorage\.setItem\('site_version_\d+', '1'\);/, `localStorage.setItem('${versionKey}', '1');`);
    fs.writeFileSync('js/site-loader.js', loaderCode);
    console.log('Updated force-cache-clear');
}

// 6. Bump cache busters in HTML
const htmlFiles = ['Photography.html', 'admin.html', 'index.html', 'about.html', 'contact.html', 'museum.html', 'what-i-do.html', 'sandeep-story.html', 'work.html'];
const timestamp = Date.now();
htmlFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let html = fs.readFileSync(f, 'utf8');
        html = html.replace(/\?v=[0-9]+/g, '?v=' + timestamp);
        fs.writeFileSync(f, html);
    }
});
console.log('Updated cache busters to ' + timestamp);
