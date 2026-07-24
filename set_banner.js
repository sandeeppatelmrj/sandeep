const fs = require('fs');

// 1. Update cms-core.js
let core = fs.readFileSync('js/cms-core.js', 'utf8');
if (!core.includes('photography_hero_banner')) {
    core = core.replace('home_hero_text_color:', 'photography_hero_banner: "index image/photography_banner.jpg",\n    home_hero_text_color:');
} else {
    core = core.replace(/photography_hero_banner:\s*['"].*?['"]/, 'photography_hero_banner: "index image/photography_banner.jpg"');
}
fs.writeFileSync('js/cms-core.js', core);

// 2. Update site-loader.js
let loader = fs.readFileSync('js/site-loader.js', 'utf8');
const match = loader.match(/const DEFAULT_SETTINGS_FALLBACK = (.*?);/);
if (match) {
    try {
        let str = match[1].trim();
        if (str.startsWith('"') && str.endsWith('"')) {
            str = str.substring(1, str.length - 1);
        }
        str = str.replace(/\\"/g, '"');
        let settings = JSON.parse(str);
        settings.photography_hero_banner = 'index image/photography_banner.jpg';
        let newStr = '"' + JSON.stringify(settings).replace(/"/g, '\\"') + '"';
        loader = loader.replace(match[0], 'const DEFAULT_SETTINGS_FALLBACK = ' + newStr + ';');
        fs.writeFileSync('js/site-loader.js', loader);
    } catch(e) {
        console.error('Failed to parse site-loader settings', e);
    }
}

// 3. Force version bump for SETTINGS so live site picks it up immediately
core = fs.readFileSync('js/cms-core.js', 'utf8');
core = core.replace(/SETTINGS:\s*'sandeep_global_settings(_v\d+)?'/, "SETTINGS:       'sandeep_global_settings_v3'");
fs.writeFileSync('js/cms-core.js', core);

console.log('Set photography_hero_banner successfully.');
