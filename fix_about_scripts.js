const fs = require('fs');
let content = fs.readFileSync('about.html', 'utf8');

// Find the scripts block in <head>
const scriptsRegex = /<script src="js\/cms-core\.js[\s\S]*?<script src="js\/main\.js[\s\S]*?<\/script>\s*/;
const match = content.match(scriptsRegex);

if (match) {
    // Remove it from current location
    content = content.replace(match[0], '');
    
    // Inject before </body>
    const target = '</body>';
    if (content.includes(target)) {
        content = content.replace(target, match[0] + '\n' + target);
        fs.writeFileSync('about.html', content);
        console.log('Moved scripts to the end of about.html');
    } else {
        console.log('</body> not found');
    }
} else {
    console.log('Scripts not found in about.html');
}
