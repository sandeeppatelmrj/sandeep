const fs = require('fs');
let html = fs.readFileSync('about.html', 'utf8');

const badChunk = `                    left: 0;
                    width: 100%;
                    height: 35vh;
                    background: linear-gradient(to top, var(--bg-color) 0%, rgba(13, 12, 12, 0.8) 40%, transparent 100%);
                    z-index: 2;
                    pointer-events: none;
                }
                @media (max-width: 768px) {
                    .demo-hero .title {
                        font-size: 55px !important;
                        line-height: 1 !important;
                        margin-bottom: 20px !important;
                    }
                    .demo-hero .hero-content {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        padding: 0 20px 80px 20px !important;
                    }
                    .demo-hero .hero-right {
                        max-width: 100% !important;
                        text-align: left !important;
                    }
                    .demo-hero .demo-back-link {
                        top: 80px !important;
                        left: 20px !important;
                    }
                }
            </style>
                    <div class="carousel-item"><img src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600&auto=format&fit=crop" alt="Design 2"></div>`;

const goodChunk = `                    left: 0;
                    width: 100%;
                    height: 35vh;
                    background: linear-gradient(to top, var(--bg-color) 0%, rgba(13, 12, 12, 0.8) 40%, transparent 100%);
                    z-index: 2;
                    pointer-events: none;
                }
                @media (max-width: 768px) {
                    .demo-hero .title {
                        font-size: 55px !important;
                        line-height: 1 !important;
                        margin-bottom: 20px !important;
                    }
                    .demo-hero .hero-content {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        padding: 0 20px 80px 20px !important;
                        pointer-events: none !important;
                    }
                    .demo-hero .hero-right {
                        max-width: 100% !important;
                        text-align: left !important;
                    }
                    .demo-hero .demo-back-link {
                        top: 80px !important;
                        left: 20px !important;
                    }
                }
            </style>

            <div class="carousel-container">
                <div class="carousel-track">
                    <div class="carousel-item"><img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop" alt="Design 1"></div>
                    <div class="carousel-item"><img src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600&auto=format&fit=crop" alt="Design 2"></div>`;

html = html.replace(badChunk, goodChunk);
fs.writeFileSync('about.html', html);
console.log('Fixed about.html');
