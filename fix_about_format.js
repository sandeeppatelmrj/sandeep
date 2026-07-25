const fs = require('fs');
let html = fs.readFileSync('about.html', 'utf8');
const search = '    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>';
const idx1 = html.indexOf(search);
const idx2 = html.indexOf('<div class="preloader-hud-label bottom-left"');

if (idx1 !== -1 && idx2 !== -1) {
    const badPart = html.substring(idx1, idx2);
    const goodReplacement = search + '\n' +
        '    <!-- Lenis Smooth Scroll -->\n' +
        '    <script src="https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js"></script>\n' +
        '    <!-- Custom CSS -->\n' +
        '    <link rel="stylesheet" href="css/style.css?v=' + Date.now() + '">\n' +
        '</head>\n' +
        '<body class="theme-dark">\n' +
        '    <!-- Preloader Overlay -->\n' +
        '    <div id="preloader" class="preloader-overlay" style="display: none !important;">\n' +
        '        <div class="preloader-corner tl"></div>\n' +
        '        <div class="preloader-corner tr"></div>\n' +
        '        <div class="preloader-corner bl"></div>\n' +
        '        <div class="preloader-corner br"></div>\n' +
        '        <div class="preloader-hud-label top-left">SYS // INIT</div>\n' +
        '        <div class="preloader-hud-label top-right">REF.SP—01</div>\n' +
        '        ';
    html = html.replace(badPart, goodReplacement);
    fs.writeFileSync('about.html', html);
    console.log('about.html fixed completely');
} else {
    console.log('could not find indices');
}
