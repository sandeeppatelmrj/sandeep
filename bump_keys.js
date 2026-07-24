const fs = require('fs');
let content = fs.readFileSync('js/cms-core.js', 'utf8');

content = content.replace("PROJECTS:       'sandeep_projects_v25'", "PROJECTS:       'sandeep_projects_v26'");
content = content.replace("SETTINGS:       'sandeep_global_settings'", "SETTINGS:       'sandeep_global_settings_v2'");
content = content.replace("PHOTOGRAPHY:    'sandeep_photography_v1'", "PHOTOGRAPHY:    'sandeep_photography_v2'");

fs.writeFileSync('js/cms-core.js', content);
console.log('Bumped CMS_KEYS versions');
