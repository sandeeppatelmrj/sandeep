const fs = require('fs');
let mainJs = fs.readFileSync('js/main.js', 'utf8');

const badLine = "function initPreloader() { setTimeout(() => { const p = document.getElementById(\\'preloader\\'); if (p) { p.style.display = \\'none\\'; document.body.style.overflow = \\'\\'; if (window.lenis) window.lenis.start(); console.log(\\'preloaderFailsafe triggered\\'); } }, 3000);";
const goodLine = "function initPreloader() { setTimeout(() => { const p = document.getElementById('preloader'); if (p) { p.style.display = 'none'; document.body.style.overflow = ''; if (window.lenis) window.lenis.start(); console.log('preloaderFailsafe triggered'); } }, 3000);";

mainJs = mainJs.replace(badLine, goodLine);

fs.writeFileSync('js/main.js', mainJs);
console.log('Fixed syntax error in main.js');
