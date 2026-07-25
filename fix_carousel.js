const fs = require('fs');
let html = fs.readFileSync('about.html', 'utf8');

const badHtmlRegex = /<\/style>\s*<div class=\"carousel-item\">.*?(?=<div class=\"gradient-overlay-bottom\">)/s;

const goodHtml = `</style>
            <div class=\"carousel-container\">
                <div class=\"carousel-track\">
                    <div class=\"carousel-item\"><img src=\"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600&auto=format&fit=crop\" alt=\"Design 2\"></div>
                    <div class=\"carousel-item\"><img src=\"https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop\" alt=\"Design 3\"></div>
                    <div class=\"carousel-item\"><img src=\"https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop\" alt=\"Design 4\"></div>
                    <div class=\"carousel-item\"><img src=\"https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop\" alt=\"Design 5\"></div>
                    <div class=\"carousel-item\"><img src=\"https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?q=80&w=600&auto=format&fit=crop\" alt=\"Design 6\"></div>
                    <div class=\"carousel-item\"><img src=\"https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop\" alt=\"Design 7\"></div>
                </div>
            </div>
            `;

if (badHtmlRegex.test(html)) {
    html = html.replace(badHtmlRegex, goodHtml);
    fs.writeFileSync('about.html', html);
    console.log('Fixed carousel wrappers in about.html');
} else {
    console.log('Could not find bad HTML to fix');
}
