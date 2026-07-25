const fs = require('fs');
let html = fs.readFileSync('about.html', 'utf8');

const target = '.demo-hero .gradient-overlay-bottom {\r\n                    position: absolute;\r\n                    bottom: 0;\r\n                    <div class="carousel-item">';
const target2 = '.demo-hero .gradient-overlay-bottom {\n                    position: absolute;\n                    bottom: 0;\n                    <div class="carousel-item">';

const replacement = `.demo-hero .gradient-overlay-bottom {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 40vh;
                    background: linear-gradient(to top, #0d0c0c 0%, transparent 100%);
                    pointer-events: none;
                    z-index: 10;
                }
            </style>
            <div class="carousel-item">`;

if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync('about.html', html);
    console.log('about.html style tag fixed (Windows line endings)');
} else if (html.includes(target2)) {
    html = html.replace(target2, replacement);
    fs.writeFileSync('about.html', html);
    console.log('about.html style tag fixed (Unix line endings)');
} else {
    // If exact match fails, use regex
    const regex = /\.demo-hero \.gradient-overlay-bottom\s*\{\s*position:\s*absolute;\s*bottom:\s*0;\s*<div class="carousel-item">/s;
    if (regex.test(html)) {
        html = html.replace(regex, replacement);
        fs.writeFileSync('about.html', html);
        console.log('about.html style tag fixed via regex');
    } else {
        console.log('Target not found in about.html at all');
    }
}
