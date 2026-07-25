const fs = require('fs');
let html = fs.readFileSync('about.html', 'utf8');

// The multi_replace_file_content tool screwed up lines 14-27.
// I'll search for the messed up area and replace it manually.

const badTarget = `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
        <div class="preloader-hud-label top-right">REF.SP—01</div>`;

const goodReplacement = `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <!-- Lenis Smooth Scroll -->
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js"></script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css?v=1784940570546">
</head>
<body class="theme-dark">
    <!-- Preloader Overlay -->
    <div id="preloader" class="preloader-overlay" style="display: none !important;">
        <div class="preloader-corner tl"></div>
        <div class="preloader-corner tr"></div>
        <div class="preloader-corner bl"></div>
        <div class="preloader-corner br"></div>
        <div class="preloader-hud-label top-left">SYS // INIT</div>
        <div class="preloader-hud-label top-right">REF.SP—01</div>`;

if (html.includes(badTarget)) {
    html = html.replace(badTarget, goodReplacement);
    fs.writeFileSync('about.html', html);
    console.log('about.html fixed');
} else {
    console.log('could not find bad target in about.html');
}

// I'll also hide the preloader in sandeep-story.html
let story = fs.readFileSync('sandeep-story.html', 'utf8');
if (story.includes('<div id="preloader" class="preloader-overlay">')) {
    story = story.replace('<div id="preloader" class="preloader-overlay">', '<div id="preloader" class="preloader-overlay" style="display: none !important;">');
    fs.writeFileSync('sandeep-story.html', story);
    console.log('sandeep-story.html preloader hidden');
}

// Just in case, I'll do it for all HTML files to ensure they don't get stuck.
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('admin') && f !== 'about.html' && f !== 'sandeep-story.html');
for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('<div id="preloader" class="preloader-overlay">')) {
        content = content.replace('<div id="preloader" class="preloader-overlay">', '<div id="preloader" class="preloader-overlay" style="display: none !important;">');
        fs.writeFileSync(f, content);
    }
}
console.log('All preloaders hidden as failsafe');
