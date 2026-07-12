function getMediaEmbedHtml(url, className, styleStr = "", shouldAutoplay = false) {
    if (!url || url.trim() === "") return '';
    url = url.trim();
    const pointerEvents = className.includes('horizontal-card-video') ? 'pointer-events:none;' : '';
    if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com') || url.includes('drive.google.com/file/d/')) {
        let finalUrl = url;
        if (url.includes('youtube.com') && !url.includes('playsinline=')) {
            finalUrl += (url.includes('?') ? '&' : '?') + 'playsinline=1';
        }
        return `<iframe class="${className}" src="${finalUrl}" style="${styleStr}; ${pointerEvents} border:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen playsinline frameborder="0"></iframe>`;
    }
    const autoAttr = shouldAutoplay ? ' autoplay' : '';
    return `<video class="${className}" src="${url}"${autoAttr} loop muted playsinline controlsList="nodownload" disablePictureInPicture style="${styleStr}" onerror="this.style.display='none'"></video>`;
}
/* ============================================================
   MAIN.JS ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Sandeep Patel Portfolio
   Handles: Cursor, Page Transitions, Hero Canvas,
            FAQ, Contact Wizard, Portfolio Grid,
            Horizontal Scroll (Trionn-style), Scroll Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initInteractiveBg();
    initHeroInteractiveCanvas();
    initCursor();
    initCardSpotlight();
    initMagneticButtons();
    init3DTilt();
    initTransitions();
    initSelectedWorkMarquee();
    initBeforeAfterReveal();
    initScrollspy();
    initFAQ();
    initWizard();
    initPortfolioGrid();
    initFeaturedProjects();
    initWorkProjects();
    initProjectDetail();
    initScrollAnimations();
    initHomeHero();
    initPartnersGrid();
    initHomeOverhaulAnimations();
    initJourneyTimeline();
    initArchiveProjects();
    initScrollDotsNav();
    
    // Lenis is statically loaded, initialize it directly
    initLenis();

    // Handle initial hash smooth scroll
    handleInitialHashScroll();
});

function handleInitialHashScroll() {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSec = document.getElementById(targetId);
        if (targetSec) {
            // Scroll to top first to prevent default jump
            window.scrollTo(0, 0);
            
            setTimeout(() => {
                if (window.lenis) {
                    window.lenis.scrollTo(targetSec, { offset: -80, duration: 1.5 });
                } else {
                    window.scrollTo({
                        top: targetSec.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }, 600); // delay to let dynamic rendering settle
        }
    }
}

/* ==========================================================
   0b. Interactive Background Canvas (Full-Page Particle Web)
   ========================================================== */
function initInteractiveBg() {
    const canvas = document.getElementById('interactive-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 75;
    const connectionDist = 110;
    const mouse = { x: null, y: null, targetX: null, targetY: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.targetX = null;
        mouse.targetY = null;
    });

    // Track scroll position & velocity
    let scrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        scrollVelocity += scrollY - lastScrollY;
        lastScrollY = scrollY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.radius = Math.random() * 1.5 + 1.0;
            this.color = Math.random() > 0.3 ? 'rgba(255, 255, 255,' : 'rgba(217, 138, 41,';
            this.baseOpacity = Math.random() * 0.2 + 0.1;
            this.opacity = this.baseOpacity;
        }

        update(visualX, visualY) {
            let forceX = 0;
            let forceY = 0;
            let forceOpacity = 0;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - visualX;
                const dy = mouse.y - visualY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    forceX = (dx / dist) * force * 0.8;
                    forceY = (dy / dist) * force * 0.8;
                    forceOpacity = force * 0.35;
                }
            }

            // Normal drift + scroll velocity vertical wind reaction + mouse force
            this.x += this.vx + forceX;
            this.y += this.vy - scrollVelocity * 0.05 + forceY;

            // Keep base coordinates wrapped inside canvas space
            if (this.x < 0) this.x += width;
            if (this.x > width) this.x -= width;
            if (this.y < 0) this.y += height;
            if (this.y > height) this.y -= height;

            this.opacity = Math.min(0.65, this.baseOpacity + forceOpacity);
        }

        draw(visualX, visualY) {
            ctx.beginPath();
            ctx.arc(visualX, visualY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (mouse.targetX !== null && mouse.targetY !== null) {
            if (mouse.x === null) {
                mouse.x = mouse.targetX;
                mouse.y = mouse.targetY;
            } else {
                mouse.x += (mouse.targetX - mouse.x) * 0.08;
                mouse.y += (mouse.targetY - mouse.y) * 0.08;
            }
        } else {
            mouse.x = null;
            mouse.y = null;
        }

        // Slowly decay scroll velocity
        scrollVelocity *= 0.92;

        const visualCoords = [];
        particles.forEach(p => {
            let visualX = p.x;
            let visualY = (p.y - scrollY * 0.15) % height;
            if (visualY < 0) visualY += height;

            p.update(visualX, visualY);
            
            visualX = p.x;
            visualY = (p.y - scrollY * 0.15) % height;
            if (visualY < 0) visualY += height;

            p.draw(visualX, visualY);
            visualCoords.push({ x: visualX, y: visualY });
        });

        for (let i = 0; i < visualCoords.length; i++) {
            const vc1 = visualCoords[i];
            
            if (mouse.x !== null && mouse.y !== null) {
                const mdx = mouse.x - vc1.x;
                const mdy = mouse.y - vc1.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < mouse.radius) {
                    const alpha = (1 - mdist / mouse.radius) * 0.12;
                    ctx.strokeStyle = `rgba(217, 138, 41, ${alpha})`;
                    ctx.lineWidth = 0.55;
                    ctx.beginPath();
                    ctx.moveTo(vc1.x, vc1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            for (let j = i + 1; j < visualCoords.length; j++) {
                const vc2 = visualCoords[j];
                const dx = vc1.x - vc2.x;
                const dy = vc1.y - vc2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.07;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.45;
                    ctx.beginPath();
                    ctx.moveTo(vc1.x, vc1.y);
                    ctx.lineTo(vc2.x, vc2.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================
   0b-2. Hero Section Interactive Background Canvas
   ========================================================== */
function initHeroInteractiveCanvas() {
    const canvas = document.getElementById('hero-interactive-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = document.getElementById('section-home-hero');
    if (!container) return;

    let width = canvas.width = container.clientWidth;
    let height = canvas.height = container.clientHeight;

    // Handle Resize
    window.addEventListener('resize', () => {
        if (container.clientWidth && container.clientHeight) {
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
        }
    });

    const particles = [];
    const trailParticles = [];
    const maxParticles = 90;
    const connectionDist = 120;
    const mouse = { x: null, y: null, targetX: null, targetY: null, radius: 240 };

    // Track mouse within the hero container bounds
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;

        // Spawn 2 trail particles on mouse move
        if (mouse.x !== null && mouse.y !== null) {
            for (let k = 0; k < 2; k++) {
                trailParticles.push(new TrailParticle(mouse.targetX, mouse.targetY));
            }
            if (trailParticles.length > 120) trailParticles.shift();
        }
    });

    container.addEventListener('mouseleave', () => {
        mouse.targetX = null;
        mouse.targetY = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Drifts slowly
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            // Warm white (75%) and accent amber/orange (25%)
            this.color = Math.random() > 0.25 ? 'rgba(255, 255, 255,' : 'rgba(255, 107, 0,';
            this.baseOpacity = Math.random() * 0.3 + 0.15;
            this.opacity = this.baseOpacity;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulseAngle = Math.random() * Math.PI;
        }

        update() {
            let forceX = 0;
            let forceY = 0;
            let forceOpacity = 0;

            // Soft organic wave motion (simulating wind/fluid flow)
            this.pulseAngle += this.pulseSpeed;
            const waveX = Math.sin(this.pulseAngle + this.y * 0.01) * 0.15;
            const waveY = Math.cos(this.pulseAngle + this.x * 0.01) * 0.15;

            // Gravity attraction to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Pull force directed towards cursor
                    forceX = (dx / dist) * force * 0.35;
                    forceY = (dy / dist) * force * 0.35;
                    forceOpacity = force * 0.4;
                }
            }

            // Apply forces
            this.x += this.vx + waveX + forceX;
            this.y += this.vy + waveY + forceY;

            // Wrap around boundaries
            if (this.x < 0) this.x += width;
            if (this.x > width) this.x -= width;
            if (this.y < 0) this.y += height;
            if (this.y > height) this.y -= height;

            // Pulsing natural opacity + mouse proximity brightness
            const pulse = Math.sin(this.pulseAngle) * 0.05;
            this.opacity = Math.max(0.05, Math.min(0.85, this.baseOpacity + pulse + forceOpacity));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Float upward and outward
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = -Math.random() * 1.5 - 0.5;
            this.radius = Math.random() * 2.5 + 1.5;
            this.opacity = 1.0;
            this.decay = Math.random() * 0.015 + 0.015;
            // Dynamic glowing amber color
            this.color = 'rgba(255, 107, 0,';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= this.decay;
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Smooth mouse coordinates tracking
        if (mouse.targetX !== null && mouse.targetY !== null) {
            if (mouse.x === null) {
                mouse.x = mouse.targetX;
                mouse.y = mouse.targetY;
            } else {
                mouse.x += (mouse.targetX - mouse.x) * 0.1;
                mouse.y += (mouse.targetY - mouse.y) * 0.1;
            }
        } else {
            mouse.x = null;
            mouse.y = null;
        }

        // Draw Base Particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Update & Draw Trail Particles
        for (let k = trailParticles.length - 1; k >= 0; k--) {
            const tp = trailParticles[k];
            tp.update();
            if (tp.opacity <= 0) {
                trailParticles.splice(k, 1);
            } else {
                tp.draw();
            }
        }

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            // Connection to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const mdx = mouse.x - p1.x;
                const mdy = mouse.y - p1.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < mouse.radius - 60) {
                    const alpha = (1 - mdist / (mouse.radius - 60)) * 0.15;
                    ctx.strokeStyle = `rgba(255, 107, 0, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Connection to neighboring particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    // Line fades as distance increases
                    const alpha = (1 - dist / connectionDist) * 0.12;
                    // If one of them is amber, make connection orange-ish, else white
                    const strokeColor = (p1.color.includes('107') || p2.color.includes('107')) 
                        ? `rgba(255, 107, 0, ${alpha})`
                        : `rgba(255, 255, 255, ${alpha})`;
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 0.4;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================
   0c. ScrollTrigger Clean Revert & Reset Helper
   ========================================================== */
function killScrollTriggersForSection(section) {
    if (typeof ScrollTrigger === 'undefined' || !section) return;
    ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section || (st.vars.trigger && section.contains(st.vars.trigger))) {
            st.kill(true); // Forces revert of spacer and elements to original DOM state
        }
    });
}

/* ==========================================================
   0. Lenis Smooth Scroll
   ========================================================== */
function initLenis() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
        lerp: 0.07,
        smoothWheel: true,
        smoothTouch: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis;
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Listen for CMS live updates ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
window.addEventListener('storage', e => {
    if (e.key === 'sandeep_projects_v22' || e.key === 'sandeep_projects_updated') {
        initPortfolioGrid();
        initFeaturedProjects();
        initWorkProjects();
    }
});
window.addEventListener('projectsUpdated', () => {
    initPortfolioGrid();
    initFeaturedProjects();
    initWorkProjects();
});

/* ==========================================================
   1. Custom Magnetic Cursor
   ========================================================== */
function initCursor() {
    const cursor = document.createElement('div');
    const ring   = document.createElement('div');
    const label  = document.createElement('span');
    cursor.className = 'custom-cursor';
    ring.className   = 'custom-cursor-ring';
    label.className  = 'cursor-label';
    label.textContent = 'VIEW';
    ring.appendChild(label);
    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    });

    (function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
        requestAnimationFrame(animateRing);
    })();

    document.addEventListener('mouseover', e => {
        const target = e.target;
        if (target.closest('.horizontal-card')) {
            document.body.classList.add('hovering-project');
        } else if (target.closest('a, button, input, textarea, [role="button"], .faq-question, .project-card')) {
            document.body.classList.add('hovering');
        }
    });
    document.addEventListener('mouseout', e => {
        const target = e.target;
        if (target.closest('.horizontal-card')) {
            document.body.classList.remove('hovering-project');
        } else if (target.closest('a, button, input, textarea, [role="button"], .faq-question, .project-card')) {
            document.body.classList.remove('hovering');
        }
    });
}

/* ==========================================================
   2. Seamless Page Transitions (Wipe Effect)
   ========================================================== */
function initTransitions() {
    let overlay = document.querySelector('.pl-trans-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'pl-trans-overlay';
        document.body.appendChild(overlay);

        gsap.set(overlay, { y: '0%' });
        gsap.timeline({ onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }) })
            .to(overlay, { y: '-100%', duration: 0.5, ease: 'power2.inOut' });
    }

    // Handle back-forward cache pageshow to prevent screen locking
    window.addEventListener('pageshow', e => {
        if (e.persisted) {
            const overlay = document.querySelector('.pl-trans-overlay');
            if (overlay) {
                gsap.set(overlay, { y: '-100%', pointerEvents: 'none' });
            }
        }
    });

    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href') || '';
        
        // Skip links that are empty, external, or target blank
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || link.getAttribute('target') === '_blank') return;
        
        // Only target internal HTML links (e.g. contain .html, project-detail, or index.html)
        const isHtmlLink = href.includes('.html') || href.includes('project-detail') || href.startsWith('index.html');
        if (!isHtmlLink) return;

        // Skip links that point to an anchor on the CURRENT page
        try {
            const targetUrlObj = new URL(link.href, window.location.href);
            const currentUrlObj = new URL(window.location.href);
            
            const normTarget = targetUrlObj.pathname.replace(/\/$/, '').replace('/index.html', '');
            const normCurrent = currentUrlObj.pathname.replace(/\/$/, '').replace('/index.html', '');
            
            if (normTarget === normCurrent) {
                return;
            }
        } catch (err) {
            if (href.startsWith('#')) return;
        }

        e.preventDefault();
        const targetUrl = href;
        const overlay = document.querySelector('.pl-trans-overlay') || document.createElement('div');
        if (!overlay.parentNode) {
            overlay.className = 'pl-trans-overlay';
            document.body.appendChild(overlay);
        }

        gsap.set(overlay, { y: '100%', pointerEvents: 'all' });
        gsap.timeline({ onComplete: () => { window.location.href = targetUrl; } })
            .to(overlay, { y: '0%', duration: 0.5, ease: 'power2.inOut' });
    });
}

/* ==========================================================
   3. Navigation, Selected Work Marquee, & Comparison Reveal
   ========================================================== */
function initSelectedWorkMarquee() {
    const track = document.getElementById('selectedWorkMarqueeTrack');
    const viewport = document.getElementById('selectedWorkViewport');
    const prevBtn = document.getElementById('swPrevBtn');
    const nextBtn = document.getElementById('swNextBtn');
    const counter = document.getElementById('swCounter');

    if (!track || !viewport) return;

    let projs = getAllProjects().filter(p => !p.isHidden);
    
    // Check if custom featured projects are set in CMS
    const siteData = (typeof getSiteData === 'function') ? getSiteData() : {};
    const featuredIdsStr = siteData.home_featured_projects;
    if (featuredIdsStr && featuredIdsStr.trim().length > 0) {
        const featuredIds = featuredIdsStr.split(',').map(s => s.trim());
        projs = featuredIds.map(id => projs.find(p => p.id === id)).filter(Boolean).slice(0, 10);
    } else {
        // Fallback to old behavior (max 10)
        let featured = projs.filter(p => p.isFeatured);
        projs = featured.length ? featured : projs.slice(0, 10);
    }

    if (!projs.length) {
        track.innerHTML = '<div style="padding: 3rem; color: rgba(255,255,255,0.4); font-family: var(--font-mono);">No featured projects available.</div>';
        if (counter) counter.textContent = '0 / 0';
        // Hide nav controls
        const controls = document.querySelector('.selected-work-controls');
        if (controls) controls.style.display = 'none';
        const hint = document.querySelector('.selected-work-drag-hint');
        if (hint) hint.style.display = 'none';
        return;
    }

    const cardsHtml = projs.map((p, idx) => {
        const img   = p.bannerImage || 'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800&h=450&fit=crop&q=60';
        const order = (idx + 1).toString().padStart(2, '0');
        const href  = p.ctaHref || `project-detail.html?id=${p.id}`;
        return `
            <a href="${href}" class="marquee-card" data-sw-index="${idx}" draggable="false">
                <div class="marquee-card-media">
                    <img src="${img}" alt="${p.title}" class="marquee-card-img" loading="lazy" draggable="false">
                </div>
                <div class="marquee-card-info">
                    <span class="marquee-card-meta">${order} &middot; ${p.subtitle || 'PROJECT'}</span>
                    <h3 class="marquee-card-title">${p.title}</h3>
                    <p class="marquee-card-desc">${p.shortDescription || ''}</p>
                </div>
            </a>
        `;
    }).join('');

    // Duplicate for infinite marquee
    track.innerHTML = cardsHtml + cardsHtml;
    
    // Add infinite marquee classes
    track.classList.add('infinite-marquee-track');

    // Controls remain visible
    const hint = document.querySelector('.selected-work-drag-hint');
    if (hint) hint.innerHTML = '<span class="drag-hint-text" style="color:var(--color-accent);font-family:var(--font-mono);">Smooth Auto-Scrolling</span>';

    // Hook buttons to jump animation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentStyle = window.getComputedStyle(track);
            let currentDelay = parseFloat(currentStyle.animationDelay) || 0;
            track.style.animationDelay = (currentDelay + 2) + 's';
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentStyle = window.getComputedStyle(track);
            let currentDelay = parseFloat(currentStyle.animationDelay) || 0;
            track.style.animationDelay = (currentDelay - 2) + 's';
        });
    }
}

function initBeforeAfterReveal() {
    const container = document.getElementById('imageRevealContainer');
    if (!container) return;

    const afterWrap = document.getElementById('revealImgAfter');
    const handle = document.getElementById('revealHandle');
    const innerImg = document.getElementById('revealInnerImage');

    let targetPercent = 50;
    let currentPercent = 50;

    // Sync image width to wrapper size to prevent distortion
    function syncImageWidth() {
        if (innerImg && container) {
            innerImg.style.width = container.offsetWidth + 'px';
        }
    }

    syncImageWidth();
    window.addEventListener('resize', syncImageWidth);
    if (window.CMS) {
        window.addEventListener('siteDataUpdated', () => setTimeout(syncImageWidth, 100));
    }

    // Capture interaction positions
    function handleMove(clientX) {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        targetPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));

        // Parallax offset
        const normX = (x / rect.width) - 0.5;
        const normY = 0.0; // Horizontal focus

        if (typeof gsap !== 'undefined') {
            gsap.to('.parallax-reveal-img', {
                x: -normX * 6,
                duration: 0.6,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        }
    }

    container.addEventListener('mousemove', e => {
        handleMove(e.clientX);
    });

    container.addEventListener('touchmove', e => {
        if (e.touches && e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
        targetPercent = 50;
        if (typeof gsap !== 'undefined') {
            gsap.to('.parallax-reveal-img', {
                x: 0,
                duration: 1.0,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        }
    });

    container.addEventListener('touchend', () => {
        targetPercent = 50;
        if (typeof gsap !== 'undefined') {
            gsap.to('.parallax-reveal-img', {
                x: 0,
                duration: 1.0,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        }
    });

    // Render loop using lerp for smooth luxury transition
    function renderRevealLoop() {
        currentPercent += (targetPercent - currentPercent) * 0.12;

        if (afterWrap) {
            afterWrap.style.width = currentPercent + '%';
            const mask = `linear-gradient(to right, #000 0%, #000 calc(${currentPercent}% - 25px), transparent calc(${currentPercent}% + 25px), transparent 100%)`;
            afterWrap.style.maskImage = mask;
            afterWrap.style.webkitMaskImage = mask;
        }
        if (handle) {
            handle.style.left = currentPercent + '%';
        }

        requestAnimationFrame(renderRevealLoop);
    }
    requestAnimationFrame(renderRevealLoop);
}

function initScrollspy() {
    const sections = document.querySelectorAll('section[id^="section-home-"]');
    const navLinks = document.querySelectorAll('.nav-links a.nav-scroll-link');

    if (!sections.length || !navLinks.length) return;

    const checkSpy = () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 120; // Offset for header height

        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.offsetHeight;
            if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', checkSpy);
    checkSpy();

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href.includes('#')) {
                const targetId = href.split('#')[1];
                const targetSec = document.getElementById(targetId);
                if (targetSec) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetSec.offsetTop - 80, // Header spacing adjust
                        behavior: 'smooth'
                    });
                    
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    history.pushState(null, null, '#' + targetId);
                }
            }
        });
    });
}

/* ==========================================================
   4. FAQ Accordion
   ========================================================== */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentNode;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                const ans = item.querySelector('.faq-answer');
                ans.style.maxHeight = ans.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================
   5. Contact Wizard
   ========================================================== */
function initWizard() {
    const wizard = document.getElementById('contactWizard');
    if (!wizard) return;
    const steps = [
        { q: "What's your name?",              placeholder: 'John Doe',             type: 'text',  name: 'name' },
        { q: "What is your email address?",     placeholder: 'email@example.com',    type: 'email', name: 'email' },
        { q: "What service are you looking for?", placeholder: 'Museum design, AI visuals...', type: 'text', name: 'service' },
        { q: "Tell us about your project",      placeholder: 'Details here...',        type: 'text',  name: 'details' },
        { q: "What is your approximate budget?",placeholder: 'e.g. $5,000',         type: 'text',  name: 'budget' },
    ];
    let step = 0; const data = {};
    const indicator   = wizard.querySelector('.wizard-step-indicator');
    const questionEl  = wizard.querySelector('.wizard-question');
    const inputEl     = wizard.querySelector('.wizard-input');
    const prevBtn     = wizard.querySelector('.btn-prev');
    const nextBtn     = wizard.querySelector('.btn-next');

    function render() {
        const s = steps[step];
        indicator.textContent  = `0${step+1} / 0${steps.length}`;
        questionEl.textContent = s.q;
        inputEl.placeholder    = s.placeholder;
        inputEl.type           = s.type;
        inputEl.value          = data[s.name] || '';
        prevBtn.style.visibility = step === 0 ? 'hidden' : 'visible';
        nextBtn.textContent      = step === steps.length-1 ? 'Submit' : 'Next';
        inputEl.focus();
    }

    nextBtn.addEventListener('click', () => {
        data[steps[step].name] = inputEl.value;
        if (step < steps.length-1) { step++; render(); }
        else {
            indicator.textContent  = 'Success ✨';
            questionEl.textContent = "Thank you — let's create something great!";
            inputEl.style.display = prevBtn.style.display = nextBtn.style.display = 'none';
        }
    });
    prevBtn.addEventListener('click', () => { if (step > 0) { data[steps[step].name] = inputEl.value; step--; render(); } });
    inputEl.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); nextBtn.click(); } });
    render();
}

/* ==========================================================
   6. Work Page Portfolio Grid
   ========================================================== */
function initPortfolioGrid() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    const projects = getAllProjects();
    grid.innerHTML = '';

    if (!projects.length) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;padding:6rem 0;text-align:center;border:1px solid var(--border-current);border-radius:4px;">
                <p class="font-mono" style="color:var(--muted-current);margin-bottom:2rem;">No projects uploaded yet.</p>
                <a href="admin.html" class="btn btn-primary" style="display:inline-block;">Go to CMS to Upload</a>
            </div>`;
        return;
    }

    projects.forEach((p, idx) => {
        const theme = idx % 2 === 0 ? 'card-dark' : 'card-light';
        const img   = p.bannerImage
            ? `<img src="${p.bannerImage}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;display:block;">`
            : `<div class="project-img-placeholder">${p.title}</div>`;
        grid.insertAdjacentHTML('beforeend', `
            <a href="project-detail.html?id=${p.id}" class="project-card ${theme} gsap-fade-up">
                <div class="corner-plus tl"></div><div class="corner-plus tr"></div>
                <div class="corner-plus bl"></div><div class="corner-plus br"></div>
                <div class="project-img-wrap">${img}</div>
                <div class="project-info">
                    <div>
                        <h3 class="project-title">${p.title}</h3>
                        <span class="project-meta">${p.subtitle || ''}</span>
                    </div>
                    <div class="project-arrow">→</div>
                </div>
            </a>`);
    });

    initScrollAnimations();
}

/* ==========================================================
   7. Homepage Featured Projects — Trionn-style Horizontal Scroll
   ========================================================== */
function initFeaturedProjects() {
    const section = document.getElementById('featuredProjectsSection');
    if (!section) return;

    const projects = getAllProjects();
    _renderFeaturedProjects(section, projects);
}

function _renderFeaturedProjects(section, projects) {
    // Kill old scroll triggers first to revert pinning/layout spacer divs!
    killScrollTriggersForSection(section);

    // Filter out hidden projects
    const filtered = projects.filter(p => !p.isHidden);
    
    // Sort by order ascending
    filtered.sort((a, b) => {
        const orderA = a.order !== undefined ? parseInt(a.order) : 999;
        const orderB = b.order !== undefined ? parseInt(b.order) : 999;
        return orderA - orderB;
    });

    // Homepage: only show featured projects. Fallback to all if none are featured.
    let displayProjs = filtered.filter(p => p.isFeatured);
    if (displayProjs.length === 0) {
        displayProjs = filtered;
    }

    section.classList.remove('horizontal-scroll-container'); // Reset older class
    section.innerHTML = '';

    const pinnedContainer = document.createElement('div');
    pinnedContainer.className = 'pinned-container';

    // Premium header using Homepage CMS keys
    pinnedContainer.innerHTML = `
        <div class="selected-work-header">
            <span class="selected-work-pretitle font-mono" data-cms-key="home_featured_label">SELECTED WORK</span>
            <h2 class="selected-work-title" data-cms-key="home_featured_title">Selected Work &amp; Explorations</h2>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'horizontal-scroll-wrapper';
    wrapper.id = 'hsWrapper';

    if (!displayProjs.length) {
        wrapper.insertAdjacentHTML('beforeend', `
            <div class="horizontal-empty-card">
                <p class="font-mono">No featured projects yet.</p>
                <a href="admin.html" class="btn btn-primary" style="margin-top: 1rem;">Add via CMS</a>
            </div>`);
        pinnedContainer.appendChild(wrapper);
        section.appendChild(pinnedContainer);
        return;
    }

    displayProjs.forEach((p, i) => {
        const orderNum = (i + 1).toString().padStart(2, '0');
        const imgTag = p.bannerImage
            ? `<img class="horizontal-card-thumbnail" src="${p.bannerImage}" alt="${p.title}" onerror="this.style.display='none'">`
            : `<div class="horizontal-card-img-placeholder">${p.title}</div>`;
        const mediaTag = p.videoUrl ? getMediaEmbedHtml(p.videoUrl, "horizontal-card-video") : "";

        const cardLink = p.ctaHref || `project-detail.html?id=${p.id}`;
        const cardCtaLabel = p.ctaLabel || 'VIEW';

        wrapper.insertAdjacentHTML('beforeend', `
            <div class="horizontal-card" data-href="${cardLink}">
                <div class="horizontal-card-media-wrap">
                    ${imgTag}
                    ${mediaTag}
                </div>
                <div class="horizontal-card-info">
                    <div class="horizontal-card-text">
                        <span class="horizontal-card-meta font-mono">${orderNum} — ${p.subtitle || 'PROJECT'}</span>
                        <h3 class="horizontal-card-title">${p.title}</h3>
                        <p class="horizontal-card-desc">${p.shortDescription || p.about?.slice(0, 100) || ''}</p>
                    </div>
                    <a href="${cardLink}" class="horizontal-card-cta" onclick="event.stopPropagation();">
                        <span>${cardCtaLabel}</span>
                        <div class="cta-arrow">→</div>
                    </a>
                </div>
            </div>`);
    });

    pinnedContainer.appendChild(wrapper);
    
    // Add "drag to explore →" button indicator below horizontal slider
    const exploreBtn = document.createElement('div');
    exploreBtn.className = 'explore-indicator-wrap';
    exploreBtn.style.cssText = 'text-align: center; margin-top: 4rem; position: relative; z-index: 5;';
    exploreBtn.innerHTML = `
        <div class="explore-indicator font-mono" style="display: inline-flex; align-items: center; gap: 1rem; color: #FFFFFF; opacity: 0.5; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase;">
            <span>drag to explore</span>
            <span style="font-size: 1.1rem; animation: slideRight 1.5s infinite; display: inline-block;">→</span>
        </div>
    `;
    pinnedContainer.appendChild(exploreBtn);

    section.appendChild(pinnedContainer);

    // Make whole card clickable
    section.querySelectorAll('.horizontal-card[data-href]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', e => {
            if (!e.target.closest('a')) {
                window.location.href = card.dataset.href;
            }
        });
    });

    // Update DOM texts from CMS keys if applicable
    if (typeof updateDOMFromCMS === 'function') {
        updateDOMFromCMS();
    }

    _initHorizontalScrollGSAP(section, wrapper);
}

function _initHorizontalScrollGSAP(section, wrapper) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray('.horizontal-card', wrapper);

    /* Kill any existing ScrollTrigger instances for this trigger and its cards */
    ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section || cards.includes(st.vars.trigger)) {
            st.kill();
        }
    });

    if (window.innerWidth <= 1024) {
        // Reset card properties on mobile/tablet
        gsap.set(cards, { opacity: 1, scale: 1, x: 0, filter: "none" });

        // Simple premium fade-up entrance for cards on mobile
        cards.forEach(card => {
            gsap.fromTo(card,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );

            // Mobile video play/pause on screen entry
            const video = card.querySelector('video, iframe');
            if (video) {
                ScrollTrigger.create({
                    trigger: card,
                    start: "top 70%",
                    end: "bottom 30%",
                    onEnter: () => {
                        if (video.tagName === "VIDEO") video.play().catch(err => {});
                        gsap.to(video, { opacity: 1, duration: 0.4 });
                    },
                    onLeave: () => {
                        if (video.tagName === "VIDEO") video.pause();
                        gsap.to(video, { opacity: 0, duration: 0.4 });
                    },
                    onEnterBack: () => {
                        if (video.tagName === "VIDEO") video.play().catch(err => {});
                        gsap.to(video, { opacity: 1, duration: 0.4 });
                    },
                    onLeaveBack: () => {
                        if (video.tagName === "VIDEO") video.pause();
                        gsap.to(video, { opacity: 0, duration: 0.4 });
                    }
                });
            }
        });
        return;
    }

    // Set initial reveal state on desktop
    gsap.set(cards, { opacity: 0, scale: 0.95, x: 300, filter: "blur(10px)" });

    /* Pinned horizontal scroll scrollDist calculation */
    const scrollDist = wrapper.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(wrapper, {
        x: () => -scrollDist,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1.5, // Easing and inertia
            start: 'top top',
            end: () => '+=' + (scrollDist + window.innerHeight * 0.4),
            invalidateOnRefresh: true,
        }
    });

    /* Progressive reveal for each card */
    cards.forEach((card, i) => {
        // Entrance reveal: opacity, scale, blur, and x-position
        gsap.to(card, {
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left 95%", // starts entering screen from right
                end: "left 65%",   // fully active when it moves 30% in
                scrub: true,
            }
        });

        // Video play/pause on desktop horizontal entry
        const video = card.querySelector('video, iframe');
        if (video) {
            ScrollTrigger.create({
                trigger: card,
                containerAnimation: scrollTween,
                start: "left 90%", // plays when card is well inside the viewport
                end: "right 10%",  // pauses when card exits to the left
                onEnter: () => {
                    if (video.tagName === "VIDEO") video.play().catch(err => console.log("Auto-play blocked:", err));
                    gsap.to(video, { opacity: 1, duration: 0.5 });
                },
                onLeave: () => {
                    if (video.tagName === "VIDEO") video.pause();
                    gsap.to(video, { opacity: 0, duration: 0.5 });
                },
                onEnterBack: () => {
                    if (video.tagName === "VIDEO") video.play().catch(err => console.log("Auto-play blocked:", err));
                    gsap.to(video, { opacity: 1, duration: 0.5 });
                },
                onLeaveBack: () => {
                    if (video.tagName === "VIDEO") video.pause();
                    gsap.to(video, { opacity: 0, duration: 0.5 });
                }
            });
        }
    });

    // Refresh ScrollTrigger when window resizes to recalculate scrollDist
    window.addEventListener('resize', () => ScrollTrigger.refresh());
}

/* ==========================================================
   8. Project Case Study Detail Page
   ========================================================== */
function initProjectDetail() {
    const root = document.getElementById('projectDetailRoot');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) { window.location.href = 'index.html#section-home-selected-work'; return; }

    const p = getAllProjects().find(x => x.id === id);
    if (!p) { window.location.href = 'index.html#section-home-selected-work'; return; }

    document.title = `${p.title} | Case Study | Sandeep Patel`;

    // ——— Build Behance-style gallery (full-width, auto height, stacked vertically AFTER details) ———
    const allImages = [...(p.images || [])];
    const galleryHtml = allImages.length ? `<div class="pd-img-stack"><span class="pd-gallery-label font-mono">WORK / GALLERY</span>${allImages.map((src, i) => { const isVideo = src.toLowerCase().endsWith(".mp4") || src.toLowerCase().includes("youtube.com") || src.toLowerCase().includes("youtu.be") || src.toLowerCase().includes("vimeo.com") || src.toLowerCase().includes("drive.google.com/file/d/"); if (isVideo) { return `<div class="pd-img-row gsap-fade-up" style="margin-bottom: 2rem;">${getMediaEmbedHtml(src, "", "width:100%; height:auto; display:block; border-radius:12px; aspect-ratio: 16/9;")}</div>`; } return `<div class="pd-img-row gsap-fade-up"><img src="${src}" alt="${p.title} - image ${i + 1}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`; }).join("")}</div>` : "";

    // ——— Sidebar detail rows ———
    const sidebarRows = [
        p.client   ? `<span class="pd-sidebar-label">Client</span><span class="pd-sidebar-value">${p.client}</span>` : '',
        p.year     ? `<span class="pd-sidebar-label">Year</span><span class="pd-sidebar-value">${p.year}</span>` : '',
        p.role     ? `<span class="pd-sidebar-label">Role</span><span class="pd-sidebar-value">${p.role}</span>` : '',
        p.location ? `<span class="pd-sidebar-label">Location</span><span class="pd-sidebar-value">${p.location}</span>` : '',
        p.softwareUsed ? `<span class="pd-sidebar-label">Tools</span><span class="pd-sidebar-value">${p.softwareUsed}</span>` : '',
        p.awards   ? `<span class="pd-sidebar-label">Awards</span><span class="pd-sidebar-value">${p.awards}</span>` : '',
        (p.roles||[]).length ? `<span class="pd-sidebar-label">Responsibilities</span>
            <ul class="pd-sidebar-roles">${(p.roles||[]).map(r=>`<li>${r}</li>`).join('')}</ul>` : '',
    ].filter(Boolean).join('');

    // ——— External links ———
    const extLinks = [
        p.linkLive      && `<li><a href="${p.linkLive}" target="_blank">Live Website <span>↗</span></a></li>`,
        p.linkBehance   && `<li><a href="${p.linkBehance}" target="_blank">Behance <span>↗</span></a></li>`,
        p.linkInstagram && `<li><a href="${p.linkInstagram}" target="_blank">Instagram <span>↗</span></a></li>`,
        p.linkFigma     && `<li><a href="${p.linkFigma}" target="_blank">Figma File <span>↗</span></a></li>`,
        p.linkPdf       && `<li><a href="${p.linkPdf}" target="_blank">PDF Case Study <span>↗</span></a></li>`,
        p.linkVideo     && `<li><a href="${p.linkVideo}" target="_blank">Video Tour <span>↗</span></a></li>`,
    ].filter(Boolean).join('');

    // ——— Banner: video takes priority, then image ———
    const bannerMedia = p.videoUrl ? getMediaEmbedHtml(p.videoUrl, "pd-banner-media", "", true)
        : p.bannerImage
            ? `<img class="pd-banner-media" src="${p.bannerImage}" alt="${p.title}" onerror="this.style.display='none'">`
            : `<div class="pd-banner-media" style="background:linear-gradient(135deg,#1a1a2e,#0b0b0b);"></div>`;

    root.innerHTML = `
        <!-- ——— FULL-BLEED BANNER ——— -->
        <div class="pd-banner">
            ${bannerMedia}
            <div class="pd-banner-overlay"></div>
            <a href="index.html#section-home-selected-work" class="pd-back-link">← Back to Work</a>
            <div class="pd-banner-meta">
                <span class="pd-banner-category">${p.subtitle || ''}</span>
                <h1 class="pd-banner-title">${p.title}</h1>
                ${p.tags ? `<div class="pd-banner-tags">${p.tags.split(',').map(t=>`<span class="pd-banner-tag">${t.trim()}</span>`).join('')}</div>` : ''}
            </div>
        </div>

        <!-- ——— ABOUT + SIDEBAR (details shown BEFORE gallery, as per Behance layout) ——— -->
        <div class="pd-info-row">
            <div class="pd-info-body">
                ${p.shortDescription ? `<p style="font-size:1.15rem;color:var(--color-light-muted);line-height:1.9;margin-bottom:3rem;font-weight:300;">${p.shortDescription}</p>` : ''}
                ${p.about ? `<h2>The Challenge</h2><p>${p.about}</p>` : ''}
                ${p.approach ? `<h2>Approach</h2><p>${p.approach}</p>` : ''}
                ${p.conclusion ? `<h2>Conclusion</h2><p>${p.conclusion}</p>` : ''}
            </div>
            <div class="pd-sidebar">
                ${sidebarRows}
                ${extLinks ? `<span class="pd-sidebar-label">Links</span><ul class="pd-ext-links">${extLinks}</ul>` : ''}
                ${p.ctaLabel ? `<a href="${p.ctaHref||'contact.html'}" ${(p.ctaHref&&(p.ctaHref.startsWith('http'))) ? 'target="_blank"' : ''} class="btn btn-primary" style="margin-top:1.5rem;display:block;text-align:center;">${p.ctaLabel}</a>` : ''}
            </div>
        </div>

        <!-- ——— GALLERY: Behance-style full-width, auto-height, stacked vertically ——— -->
        ${galleryHtml}

        <!-- ——— CTA FOOTER ——— -->
        <div class="pd-cta">
            <h2>Like what you see?</h2>
            <div class="pd-cta-btns">
                <a href="contact.html" class="btn btn-primary">Start a Conversation</a>
                <a href="index.html#section-home-selected-work" class="btn btn-outlined">See More Work</a>
            </div>
        </div>
    `;

    initScrollAnimations();
}

/* ==========================================================
   9. Scroll Animations via GSAP
   ========================================================== */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.gsap-fade-up').forEach(el => {
        if (el._gsapFadeInit) return;
        el._gsapFadeInit = true;
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
        });
    });

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !document.getElementById('section-home-hero')) {
        gsap.from(heroTitle, { y: 60, opacity: 0, duration: 1.1, delay: 0.2, ease: 'power3.out' });
    }
}

/* ==========================================================
   7b. Work Page Showcase — Horizontal Scroll Gallery
   ========================================================== */
function initWorkProjects() {
    const section = document.getElementById('workProjectsSection');
    if (!section) return;

    const projects = getAllProjects();
    _renderWorkProjects(section, projects);
}

function _renderWorkProjects(section, projects) {
    // Kill old scroll triggers first
    killScrollTriggersForSection(section);

    // Filter out hidden projects
    const filtered = projects.filter(p => !p.isHidden);
    
    // Sort by order ascending
    filtered.sort((a, b) => {
        const orderA = a.order !== undefined ? parseInt(a.order) : 999;
        const orderB = b.order !== undefined ? parseInt(b.order) : 999;
        return orderA - orderB;
    });

    section.innerHTML = '';

    if (!filtered.length) {
        section.insertAdjacentHTML('beforeend', `
            <div class="tr-container" style="padding: 10rem 0; text-align: center;">
                <p class="font-mono">No projects found.</p>
                <a href="admin.html" class="btn btn-primary" style="margin-top: 2rem;">Upload via CMS</a>
            </div>`);
        return;
    }

    // Create the container element for vertical staggered showcase
    const container = document.createElement('div');
    container.className = 'work-vertical-container';

    // Add visual vertical timeline line
    const timelineLine = document.createElement('div');
    timelineLine.className = 'work-timeline-line';
    container.appendChild(timelineLine);

    filtered.forEach((p, i) => {
        const orderNum = (i + 1).toString().padStart(2, '0');
        const imgTag = p.bannerImage
            ? `<img class="horizontal-card-thumbnail" src="${p.bannerImage}" alt="${p.title}" loading="lazy" onerror="this.style.display='none'">`
            : `<div class="horizontal-card-img-placeholder">${p.title}</div>`;
        
        // Autoplay, loop, muted, no controls, lazy loaded video
        const mediaTag = p.videoUrl ? getMediaEmbedHtml(p.videoUrl, "horizontal-card-video") : "";

        const cardLink = p.ctaHref || `project-detail.html?id=${p.id}`;
        const cardCtaLabel = p.ctaLabel || 'Explore Project';

        // Stagger left/right: odd indices are row-left, even indices are row-right
        const rowClass = i % 2 === 0 ? 'row-left' : 'row-right';

        container.insertAdjacentHTML('beforeend', `
            <div class="staggered-project-row ${rowClass}">
                <div class="staggered-project-card" data-href="${cardLink}">
                    <div class="project-media-16-9">
                        ${imgTag}
                        ${mediaTag}
                    </div>
                    <div class="project-info-wrap">
                        <span class="project-card-meta">${orderNum} — ${p.subtitle || p.category || 'PROJECT'}</span>
                        <h2 class="project-card-title">${p.title}</h2>
                        <p class="project-card-desc">${p.shortDescription || (p.about ? p.about.slice(0, 140) + '...' : '')}</p>
                        <span class="project-card-cta">
                            <span>${cardCtaLabel}</span>
                            <span class="cta-arrow">→</span>
                        </span>
                    </div>
                </div>
            </div>
        `);
    });

    section.appendChild(container);

    // Make the entire card clickable
    container.querySelectorAll('.staggered-project-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', e => {
            if (!e.target.closest('a')) {
                window.location.href = card.dataset.href;
            }
        });
    });

    // Update DOM from CMS keys
    if (typeof updateDOMFromCMS === 'function') {
        updateDOMFromCMS();
    }

    // Video play/pause behaviour using IntersectionObserver (triggered at 60% visibility)
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                const video = card.querySelector('video, iframe');
                if (!video) return;

                if (entry.isIntersecting) {
                    if (video.tagName === "VIDEO") video.play().catch(err => {
                        console.log("Video play failed or was interrupted:", err);
                    });
                    gsap.to(video, { opacity: 1, duration: 0.5 });
                } else {
                    if (video.tagName === "VIDEO") video.pause();
                }
            });
        }, {
            threshold: 0.6
        });

        container.querySelectorAll('.staggered-project-card').forEach(card => {
            videoObserver.observe(card);
        });
    }

    // GSAP ScrollTrigger Reveal Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        container.querySelectorAll('.staggered-project-row').forEach(row => {
            const card = row.querySelector('.staggered-project-card');
            if (!card) return;

            // Set initial state: scale 0.98, opacity 0, y 80px, blur 8px
            gsap.set(card, {
                opacity: 0,
                y: 80,
                scale: 0.98,
                filter: 'blur(8px)'
            });

            // Trigger animation when the top of the row reaches 85% of the viewport height
            gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: row,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Trigger ScrollTrigger refresh to align positions correctly
        ScrollTrigger.refresh();
    }
}

/* ==========================================================
   3b. Redesigned Home Hero Animations & Interactions
   ========================================================== */
function initHomeHero() {
    const hero = document.getElementById('section-home-hero');
    if (!hero) return;
    
    const heading = hero.querySelector('.hero-title');
    const pretitle = hero.querySelector('.hero-pretitle');
    const scrollInd = hero.querySelector('.hero-scroll-indicator');
    const monolith = hero.querySelector('.monolith-wrapper');
    const monolithSvg = hero.querySelector('.monolith-svg');
    const glowBase = hero.querySelector('.monolith-glow-base');
    const rightText = hero.querySelector('.right-side-text');
    const arrow = hero.querySelector('.hero-scroll-arrow');
    const floatingContainer = hero.querySelector('.hero-floating-elements');
    const bgGlow = hero.querySelector('.hero-bg-glow');
    
    // Rotating word selectors
    const words = hero.querySelectorAll('.rotating-word');
    const wordWrap = hero.querySelector('.rotating-word-wrap');
    
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 1. Calculate Word Widths to Prevent CLS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    const wordWidths = [];
    function measureWordWidths() {
        if (!words.length || !wordWrap) return;
        
        words.forEach((word, idx) => {
            // Temporarily style to measure natural width
            const prevDisplay = word.style.display;
            const prevPosition = word.style.position;
            const prevOpacity = word.style.opacity;
            
            word.style.display = 'inline-block';
            word.style.position = 'relative';
            word.style.opacity = '0';
            
            const rect = word.getBoundingClientRect();
            wordWidths[idx] = rect.width;
            
            // Restore styles
            word.style.display = '';
            word.style.position = '';
            word.style.opacity = '';
        });
        
        // Set initial width to first word
        wordWrap.style.width = (wordWidths[0] + 30) + 'px';
    }
    
    if (document.fonts) {
        document.fonts.ready.then(measureWordWidths);
    } else {
        setTimeout(measureWordWidths, 500);
    }
    window.addEventListener('resize', measureWordWidths);
    
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 2. Entrance Animation Timeline ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });
    
    // Set initial states for entrance
    gsap.set(hero, { opacity: 0 });
    const lineTexts = hero.querySelectorAll('.line-text');
    if (lineTexts.length) {
        gsap.set(lineTexts, { y: '110%' });
    }
    if (pretitle) gsap.set(pretitle, { opacity: 0, x: -15 });
    if (scrollInd) gsap.set(scrollInd, { opacity: 0, y: 15 });
    if (monolithSvg) gsap.set(monolithSvg, { opacity: 0, scale: 0.85 });
    if (glowBase) gsap.set(glowBase, { opacity: 0 });
    if (rightText) gsap.set(rightText, { opacity: 0, y: 20 });
    if (bgGlow) gsap.set(bgGlow, { opacity: 0 });
    if (words.length) {
        gsap.set(words, { y: '110%', opacity: 0, scale: 0.98, filter: 'blur(5px)' });
    }
    
    // Build animation steps
    tl.to(hero, { opacity: 1, duration: 0.4 });
    if (bgGlow) {
        tl.to(bgGlow, { opacity: 1, duration: 1.2 }, '-=0.2');
    }
    if (lineTexts.length) {
        tl.to(lineTexts, { y: '0%', duration: 0.9, stagger: 0.1 }, '-=0.9');
    }
    if (pretitle) {
        tl.to(pretitle, { opacity: 1, x: 0, duration: 0.7 }, '-=0.8');
    }
    if (monolithSvg) {
        tl.to(monolithSvg, { opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.4)' }, '-=0.9');
    }
    if (glowBase) {
        tl.to(glowBase, { opacity: 1, duration: 1.4 }, '-=0.9');
    }
    if (rightText) {
        tl.to(rightText, { opacity: 1, y: 0, duration: 0.8 }, '-=0.8');
    }
      
    // Animate first word in
    if (words.length) {
        tl.to(words[0], {
            y: '0%',
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
            pointerEvents: 'auto'
        }, '-=0.5');
    }
    
    tl.to(scrollInd, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
      .add(() => {
          if (arrow) {
              gsap.to(arrow, {
                  y: 8,
                  duration: 0.8,
                  repeat: -1,
                  yoyo: true,
                  ease: 'power1.inOut'
              });
          }
          startWordRotation();
      }, '-=0.2');
      
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 3. Rotating Word Animation Loop ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    let currentWordIdx = 0;
    let rotationInterval;
    
    function startWordRotation() {
        if (words.length <= 1) return;
        
        if (rotationInterval) clearInterval(rotationInterval);
        
        rotationInterval = setInterval(() => {
            const outgoing = words[currentWordIdx];
            currentWordIdx = (currentWordIdx + 1) % words.length;
            const incoming = words[currentWordIdx];
            
            const rotationTl = gsap.timeline();
            
            // Outgoing animates out
            rotationTl.to(outgoing, {
                y: '-110%',
                opacity: 0,
                scale: 0.98,
                filter: 'blur(5px)',
                duration: 0.6,
                ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: 'none'
            }, 0);
            
            // Adjust wrap width to incoming word width
            if (wordWidths[currentWordIdx] !== undefined) {
                wordWrap.style.width = (wordWidths[currentWordIdx] + 30) + 'px';
            }
            
            // Incoming animates in
            gsap.set(incoming, { y: '110%', opacity: 0, scale: 0.98, filter: 'blur(5px)' });
            rotationTl.to(incoming, {
                y: '0%',
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.6,
                ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: 'auto'
            }, 0);
        }, 2000);
    }
      
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 4. Scroll Trigger Scale & Fade Out ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    const innerContainer = hero.querySelector('.hero-inner-container');
    if (innerContainer && typeof ScrollTrigger !== 'undefined') {
        gsap.to(innerContainer, {
            scale: 0.93,
            opacity: 0,
            y: -70,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true
            }
        });
    }
    
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 5. Mousemove Parallax ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    if (window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const normX = (clientX / innerWidth) - 0.5;
            const normY = (clientY / innerHeight) - 0.5;
            
            if (monolith) {
                gsap.to(monolith, {
                    x: -normX * 20,
                    y: -normY * 20,
                    duration: 1.2,
                    ease: 'power2.out'
                });
            }
            if (heading) {
                gsap.to(heading, {
                    x: normX * 20,
                    y: normY * 20,
                    duration: 1.2,
                    ease: 'power2.out'
                });
            }
            if (bgGlow) {
                gsap.to(bgGlow, {
                    x: normX * 12,
                    y: normY * 12,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            }
            if (floatingContainer) {
                gsap.to(floatingContainer, {
                    x: normX * 15,
                    y: normY * 15,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            }
        });
    }
    
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 6. Floating Background Circles ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    if (floatingContainer) {
        floatingContainer.innerHTML = '';
        const count = 4;
        
        for (let i = 0; i < count; i++) {
            const circle = document.createElement('div');
            circle.className = 'floating-circle';
            
            const size = Math.random() * 120 + 100;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.left = `${Math.random() * 80 + 10}%`;
            circle.style.top = `${Math.random() * 80 + 10}%`;
            circle.style.opacity = Math.random() * 0.02 + 0.015;
            
            floatingContainer.appendChild(circle);
            
            gsap.to(circle, {
                x: () => (Math.random() - 0.5) * 80,
                y: () => (Math.random() - 0.5) * 80,
                scale: () => Math.random() * 0.25 + 0.85,
                duration: () => Math.random() * 12 + 12,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 1.5
            });
        }
    }
}

/* ==========================================================
   3c. Partners Logo Grid & Overhaul Animations
   ========================================================== */
function initPartnersGrid() {
    const grid = document.getElementById('partnersGrid');
    if (!grid) return;
    
    const data = getSiteData();
    const partners = (data.home_partners_list || '').split(',').map(p => p.trim()).filter(Boolean);
    grid.innerHTML = '';
    
    partners.forEach(p => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="partner-item">
                <span class="partner-text-logo">${p}</span>
            </div>
        `);
    });
}

function initHomeOverhaulAnimations() {
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 1. Frosted navigation on scroll ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    const header = document.querySelector('header');
    if (header) {
        const lightSections = document.querySelectorAll('.theme-sand, .theme-light');
        const checkScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            let isLight = false;
            const headerRect = header.getBoundingClientRect();
            const headerCenterY = headerRect.top + (headerRect.height / 2);
            
            lightSections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if (headerCenterY >= rect.top && headerCenterY <= rect.bottom) {
                    isLight = true;
                }
            });
            
            if (isLight) {
                header.classList.add('on-light-bg');
            } else {
                header.classList.remove('on-light-bg');
            }
        };
        window.addEventListener('scroll', checkScroll);
        checkScroll(); // run on load
    }
    
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 2. Corner rotating badge text animation ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    const badgeWords = document.querySelectorAll('.corner-rotating-badge .badge-word');
    if (badgeWords.length > 1) {
        let currentIdx = 0;
        setInterval(() => {
            const active = badgeWords[currentIdx];
            active.classList.remove('active');
            active.classList.add('exit');
            
            setTimeout(() => {
                active.classList.remove('exit');
            }, 600);
            
            currentIdx = (currentIdx + 1) % badgeWords.length;
            badgeWords[currentIdx].classList.add('active');
        }, 3500);
    }
    
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 3. Testimonials 3D Tilt Effect (now handled globally by init3DTilt) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    
    
    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 4. Section 06 Scrolling Typography Anim ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    const scrollSection = document.getElementById('section-home-scrolling-text');
    const charSpans = document.querySelectorAll('.huge-scrolling-title .char-span');
    if (scrollSection && charSpans.length && typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo(charSpans, 
            {
                x: (i) => (i - charSpans.length / 2) * 40,
                opacity: 0,
                scale: 0.8
            },
            {
                x: 0,
                opacity: 1,
                scale: 1,
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: scrollSection,
                    start: 'top 90%',
                    end: 'bottom 50%',
                    scrub: 1.2
                }
            }
        );
    }
}

/* ==========================================================
   08. Journey Timeline & Filterable Project Archive
   ========================================================== */

function initJourneyTimeline() {
    const timeline = document.querySelector('.journey-timeline');
    if (!timeline || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    const fill = timeline.querySelector('.timeline-fill');
    const items = timeline.querySelectorAll('.timeline-item');
    
    // Animate timeline line drawing down
    gsap.fromTo(fill, 
        { height: '0%' },
        { 
            height: '100%', 
            ease: 'none',
            scrollTrigger: {
                trigger: timeline,
                start: 'top 30%',
                end: 'bottom 80%',
                scrub: true
            }
        }
    );
    
    // Light up timeline nodes as they enter the screen
    items.forEach(item => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 65%',
            onEnter: () => {
                item.classList.add('active-node');
            },
            onLeaveBack: () => {
                item.classList.remove('active-node');
            }
        });
    });
}

function initArchiveProjects() {
    const grid = document.getElementById('archiveProjectGrid');
    if (!grid) return;
    
    const filterButtons = document.querySelectorAll('.archive-filter-btn');
    const projects = getAllProjects();
    let currentFilter = 'all';
    let currentSearch = '';

    function matchesFilter(p, filterTag) {
        if (filterTag === 'all') return true;
        const tags = (p.tags || '').toLowerCase();
        const subtitle = (p.subtitle || '').toLowerCase();
        if (filterTag === 'campaign') return tags.includes('campaign') || tags.includes('ad') || tags.includes('branding') || tags.includes('advertising') || subtitle.includes('campaign') || subtitle.includes('ad');
        if (filterTag === 'museum') return tags.includes('museum') || tags.includes('experience') || tags.includes('exhibition') || tags.includes('interaction') || subtitle.includes('museum') || subtitle.includes('experience') || subtitle.includes('exp');
        if (filterTag === 'projection') return tags.includes('projection') || tags.includes('mapping') || tags.includes('3d') || tags.includes('light') || subtitle.includes('projection') || subtitle.includes('mapping');
        if (filterTag === 'ai') return tags.includes('ai') || tags.includes('storytelling') || tags.includes('cinematic') || subtitle.includes('ai') || subtitle.includes('storytelling');
        return false;
    }

    function matchesSearch(p, query) {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
            (p.title || '').toLowerCase().includes(q) ||
            (p.subtitle || '').toLowerCase().includes(q) ||
            (p.tags || '').toLowerCase().includes(q) ||
            (p.shortDescription || '').toLowerCase().includes(q)
        );
    }
    
    function renderArchive() {
        grid.innerHTML = '';
        
        const filtered = projects.filter(p => matchesFilter(p, currentFilter) && matchesSearch(p, currentSearch));
        
        if (!filtered.length) {
            grid.innerHTML = `<div style="grid-column: span 2; text-align: center; padding: 4rem 0; font-family: var(--font-mono); color: var(--muted-current);">No projects found.</div>`;
            return;
        }
        
        filtered.forEach((p, i) => {
            const cardLink = p.ctaHref || `project-detail.html?id=${p.id}`;
            const imgTag = p.bannerImage
                ? `<img class="archive-card-img" src="${p.bannerImage}" alt="${p.title}" loading="lazy" width="600" height="338">`
                : `<div class="horizontal-card-img-placeholder">${p.title}</div>`;
                
            const cardHTML = `
                <a href="${cardLink}" class="archive-card gsap-archive-item" style="opacity: 0; transform: translateY(20px);">
                    <div class="archive-card-media">
                        ${imgTag}
                    </div>
                    <div class="archive-card-info">
                        <span class="archive-card-meta font-mono">${p.tags || p.subtitle || 'PROJECT'}</span>
                        <h3 class="archive-card-title" style="font-weight: bold;">${p.title}</h3>
                    </div>
                </a>
            `;
            grid.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        // GSAP animate elements in
        const cards = grid.querySelectorAll('.gsap-archive-item');
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: 'power1.out',
            overwrite: 'auto'
        });
    }
    
    // Initial Render
    renderArchive();
    
    // Filter button click listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;

            const currentCards = grid.querySelectorAll('.gsap-archive-item');
            if (currentCards.length) {
                gsap.to(currentCards, {
                    opacity: 0,
                    y: -10,
                    duration: 0.25,
                    stagger: 0.04,
                    ease: 'power2.in',
                    onComplete: () => renderArchive()
                });
            } else {
                renderArchive();
            }
        });
    });

    // Search input live filter
    const searchInput = document.getElementById('archiveSearchInput');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentSearch = searchInput.value.trim();
                const currentCards = grid.querySelectorAll('.gsap-archive-item');
                if (currentCards.length) {
                    gsap.to(currentCards, {
                        opacity: 0,
                        y: -8,
                        duration: 0.2,
                        ease: 'power2.in',
                        onComplete: () => renderArchive()
                    });
                } else {
                    renderArchive();
                }
            }, 200);
        });
    }
}

/* ==========================================================
   09. Spotlight, Magnetic & 3D Tilt Cursor Interactivities
   ========================================================== */
function initCardSpotlight() {
    document.addEventListener('mousemove', e => {
        // Spotlight for cards
        const card = e.target.closest('.service-item, .value-card, .testimonial-card');
        if (card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }

        // Mouse-interactive glow for hero section background
        const heroGlow = document.querySelector('#section-home-hero .hero-bg-glow');
        if (heroGlow) {
            const rect = heroGlow.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroGlow.style.setProperty('--mouse-x', `${x}px`);
            heroGlow.style.setProperty('--mouse-y', `${y}px`);
        }
    });
}

function initMagneticButtons() {
    if (window.innerWidth <= 768) return;

    let activeEl = null;

    document.addEventListener('mousemove', e => {
        const el = e.target.closest('.nav-links a, .btn, .explore-indicator');
        
        if (el) {
            if (activeEl !== el) {
                if (activeEl) {
                    gsap.to(activeEl, {
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.4)",
                        overwrite: "auto"
                    });
                }
                activeEl = el;
            }
            
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dX = e.clientX - centerX;
            const dY = e.clientY - centerY;
            
            gsap.to(el, {
                x: dX * 0.35,
                y: dY * 0.35,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        } else {
            if (activeEl) {
                gsap.to(activeEl, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto"
                });
                activeEl = null;
            }
        }
    });

    document.addEventListener('mouseleave', () => {
        if (activeEl) {
            gsap.to(activeEl, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.4)",
                overwrite: "auto"
            });
            activeEl = null;
        }
    });
}

function init3DTilt() {
    if (window.innerWidth <= 768) return;

    let activeCard = null;

    document.addEventListener('mousemove', e => {
        const card = e.target.closest('.service-item, .testimonial-card, .value-card, .marquee-card');
        
        if (card) {
            if (activeCard !== card) {
                if (activeCard) {
                    gsap.to(activeCard, {
                        rotateY: 0,
                        rotateX: 0,
                        ease: 'power2.out',
                        duration: 0.5
                    });
                }
                activeCard = card;
            }
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.height) - 0.5;
            
            gsap.to(card, {
                rotateY: normX * 8,
                rotateX: -normY * 8,
                transformPerspective: 800,
                ease: 'power2.out',
                duration: 0.5,
                overwrite: 'auto'
            });
        } else {
            if (activeCard) {
                gsap.to(activeCard, {
                    rotateY: 0,
                    rotateX: 0,
                    ease: 'power2.out',
                    duration: 0.5,
                    overwrite: 'auto'
                });
                activeCard = null;
            }
        }
    });

    document.addEventListener('mouseleave', () => {
        if (activeCard) {
            gsap.to(activeCard, {
                rotateY: 0,
                rotateX: 0,
                ease: 'power2.out',
                duration: 0.5,
                overwrite: 'auto'
            });
            activeCard = null;
        }
    });
}

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Only show preloader once per session (on first opening the site)
    if (sessionStorage.getItem('sandeep_preloader_shown')) {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();
        return;
    }
    sessionStorage.setItem('sandeep_preloader_shown', 'true');

    // Lock scrolling during preloader
    if (window.lenis) {
        window.lenis.stop();
    }
    document.body.style.overflow = 'hidden'; // Always set, always clear on exit

    const percentEl = document.getElementById('preloader-percent');
    const barEl = document.getElementById('preloader-bar');
    const captionEl = document.getElementById('preloader-caption');
    let count = 0;

    // JARVIS-style HUD status captions cycling in the bottom-left corner
    const captions = [
        '> Initializing systems',
        '> Loading assets',
        '> Calibrating interface',
        '> Rendering environment',
        '> All systems nominal'
    ];
    let captionIdx = 0;
    let captionInterval = null;
    if (captionEl) {
        captionInterval = setInterval(() => {
            captionIdx = Math.min(captionIdx + 1, captions.length - 1);
            captionEl.textContent = captions[captionIdx];
        }, 520);
    }

    const counterInterval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 3;
        if (count >= 100) {
            count = 100;
            clearInterval(counterInterval);
            if (captionInterval) clearInterval(captionInterval);
            if (captionEl) captionEl.textContent = '> System ready';

            barEl.style.width = '100%';
            if (percentEl) percentEl.textContent = '100';

            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            preloader.style.display = 'none';
                            // Always clear the body overflow lock set at preloader start
                            document.body.style.overflow = '';
                            if (window.lenis) {
                                window.lenis.start();
                            }
                        }
                    });
                    // Power-down: HUD corners/labels fade, then whole overlay
                    // contracts to center (like a screen turning off) and vanishes.
                    tl.to('.preloader-corner, .preloader-hud-label', {
                        opacity: 0, duration: 0.3, ease: 'power2.in', stagger: 0.05
                    })
                    .to('.preloader-core-glow', {
                        scale: 0, opacity: 0, duration: 0.4, ease: 'power3.in'
                    }, '-=0.2')
                    .to('.preloader-content', {
                        opacity: 0, scale: 0.85, duration: 0.4, ease: 'power3.in'
                    }, '-=0.3')
                    .to(preloader, {
                        opacity: 0, duration: 0.5, ease: 'power2.inOut'
                    }, '-=0.1');
                } else {
                    // Fallback if GSAP not loaded yet
                    preloader.style.opacity = '0';
                    preloader.style.transition = 'opacity 0.6s ease';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.style.overflow = '';
                        if (window.lenis) window.lenis.start();
                    }, 650);
                }
            }, 300);
        } else {
            if (percentEl) percentEl.textContent = count.toString().padStart(2, '0');
            barEl.style.width = count + '%';
        }
    }, 40);
}

/* ==========================================================
   VERTICAL SCROLL DOTS NAVIGATION
   ========================================================== */
function initScrollDotsNav() {
    const nav = document.getElementById('scroll-dots-nav');
    const list = document.getElementById('scrollDotsList');
    const fill = document.getElementById('scrollDotsFill');
    if (!nav || !list) return;

    const SECTIONS = [
        { id: 'section-home-hero',           label: 'Home' },
        { id: 'section-home-about',          label: 'About' },
        { id: 'section-home-what-i-do',      label: 'What I Do' },
        { id: 'section-home-tools',          label: 'Tools' },
        { id: 'section-home-journey',        label: 'Journey' },
        { id: 'section-home-education',      label: 'Education' },
        { id: 'section-home-selected-work',  label: 'Selected Work' },
        { id: 'section-home-archive',        label: 'The Archive' },
        { id: 'section-home-testimonials',   label: 'Testimonials' },
        { id: 'section-home-scrolling-text', label: 'Studio' },
    ];

    const validSections = SECTIONS.filter(s => document.getElementById(s.id));
    if (!validSections.length) return;

    // Build dots
    validSections.forEach((s, i) => {
        const li = document.createElement('li');
        li.className = 'scroll-dot-item' + (i === 0 ? ' active' : '');
        li.dataset.index = i;
        li.innerHTML = `
            <span class="scroll-dot-label">${s.label}</span>
            <button class="scroll-dot-btn" aria-label="Go to ${s.label}"></button>
        `;
        li.addEventListener('click', () => {
            const target = document.getElementById(s.id);
            if (!target) return;
            if (window.lenis) {
                window.lenis.scrollTo(target, { offset: -60, duration: 1.2 });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        list.appendChild(li);
    });

    const dots = Array.from(list.querySelectorAll('.scroll-dot-item'));
    let activeIndex = 0;
    let ticking = false;

    function setActive(index) {
        if (index === activeIndex && dots[index]?.classList.contains('active')) return;
        activeIndex = index;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        if (fill) {
            const pct = validSections.length > 1
                ? (index / (validSections.length - 1)) * 100
                : 0;
            fill.style.height = pct + '%';
        }
    }

    function updateActiveSection() {
        const winH = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset;
        let bestIdx = 0;
        let bestScore = -Infinity;

        validSections.forEach((s, i) => {
            const el = document.getElementById(s.id);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const score = -(Math.abs(rect.top + rect.height / 2 - winH / 2));
            if (score > bestScore) { bestScore = score; bestIdx = i; }
        });

        setActive(bestIdx);

        if (scrollY > 100) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial update after a small delay to let DOM settle
    setTimeout(updateActiveSection, 500);
}

// ÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â
//  SITE-WIDE CMS VIDEO MUTE TOGGLE
//  Reads the same 'cms_video_muted' localStorage key set from the
//  Gallery's CMS panel and applies it to every <video> element on
//  whichever page is currently loaded (project cards, project detail
//  banner, etc), so the single CMS switch controls audio everywhere.
// ÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚ÂÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â
function _getCmsVideoMutePref() {
    try {
        const v = localStorage.getItem('cms_video_muted');
        if (v === null) return true; // default: muted
        return v === 'true';
    } catch (e) { return true; }
}

function _applyCmsVideoMuteToPage() {
    const muted = _getCmsVideoMutePref();
    document.querySelectorAll('video').forEach(v => { v.muted = muted; });
}

document.addEventListener('DOMContentLoaded', () => {
    _applyCmsVideoMuteToPage();
    // Re-apply whenever new project cards/videos get inserted dynamically
    const observer = new MutationObserver(() => _applyCmsVideoMuteToPage());
    observer.observe(document.body, { childList: true, subtree: true });
    // Keep in sync if the CMS panel mute toggle is changed in another tab
    window.addEventListener('storage', (e) => {
        if (e.key === 'cms_video_muted') _applyCmsVideoMuteToPage();
    });
});



