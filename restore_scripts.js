const fs = require('fs');
let html = fs.readFileSync('about.html', 'utf8');

const target = '</head>';
if (html.includes(target) && !html.includes('js/main.js')) {
    const scripts = `    <script src="js/cms-core.js?v=${Date.now()}"></script>
    <script src="js/site-loader.js?v=${Date.now()}"></script>
    <script src="js/projects-data.js?v=${Date.now()}"></script>
    <script src="js/main.js?v=${Date.now()}"></script>
</head>`;
    html = html.replace(target, scripts);
    fs.writeFileSync('about.html', html);
    console.log('Restored script tags to about.html');
} else {
    console.log('Script tags already exist or </head> not found');
}
