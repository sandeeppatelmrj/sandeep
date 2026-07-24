const fs = require('fs');
let loader = fs.readFileSync('js/site-loader.js', 'utf8');

const match = loader.match(/const DEFAULT_SITE_DATA = (\{[\s\S]*?\});/);
if (match) {
    try {
        let str = match[1];
        let settings = JSON.parse(str);
        settings.photography_hero_banner = 'index image/photography_banner.jpg';
        let newStr = JSON.stringify(settings);
        loader = loader.replace(match[0], 'const DEFAULT_SITE_DATA = ' + newStr + ';');
        fs.writeFileSync('js/site-loader.js', loader);
        console.log('Updated DEFAULT_SITE_DATA');
    } catch(e) {
        console.error('Failed to parse DEFAULT_SITE_DATA', e);
    }
}
