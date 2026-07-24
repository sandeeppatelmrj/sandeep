const fs = require('fs');
const backupStr = fs.readFileSync('cms_backup_2026-07-24.json', 'utf8');
const backup = JSON.parse(backupStr);

// Helper to safely get object from backup
function getParsed(key) {
    if (!backup[key]) return null;
    try { return JSON.parse(backup[key]); } catch(e) { return null; }
}

const projs = getParsed('sandeep_projects_v26');
if (projs) {
    fs.writeFileSync('js/projects-data.js', 'const DEFAULT_PROJECTS = ' + JSON.stringify(projs, null, 4) + ';');
}

const photo = getParsed('sandeep_photography_v2');
if (photo) {
    fs.writeFileSync('js/photography-data.js', 'const DEFAULT_PHOTOGRAPHY = ' + JSON.stringify(photo, null, 4) + ';');
}

const siteData = getParsed('sandeep_site_data_v2');
if (siteData) {
    let loader = fs.readFileSync('js/site-loader.js', 'utf8');
    const match = loader.match(/const DEFAULT_SITE_DATA = (\{[\s\S]*?\});/);
    if (match) {
        loader = loader.replace(match[0], 'const DEFAULT_SITE_DATA = ' + JSON.stringify(siteData, null, 4) + ';');
        fs.writeFileSync('js/site-loader.js', loader);
    }
}

const settings = getParsed('sandeep_global_settings');
if (settings) {
    let cContent = fs.readFileSync('js/cms-core.js', 'utf8');
    cContent = cContent.replace(/const DEFAULT_SETTINGS = \{[\s\S]*?\};\n/, `const DEFAULT_SETTINGS = ${JSON.stringify(settings, null, 4)};\n`);
    fs.writeFileSync('js/cms-core.js', cContent);
    
    let loader = fs.readFileSync('js/site-loader.js', 'utf8');
    const matchSettings = loader.match(/const DEFAULT_SETTINGS_FALLBACK = (.*?);/);
    if (matchSettings) {
        let newStr = '"' + JSON.stringify(settings).replace(/"/g, '\\"') + '"';
        loader = loader.replace(matchSettings[0], 'const DEFAULT_SETTINGS_FALLBACK = ' + newStr + ';');
        fs.writeFileSync('js/site-loader.js', loader);
    }
}

console.log('Fixed all data formats.');
