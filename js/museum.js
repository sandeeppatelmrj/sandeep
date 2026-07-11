/* ============================================================
   MUSEUM EXPERIENCE JS — Sandeep Patel Portfolio
   Handles: 3D corridor loading, Z-scrolling camera,
            volumetric lighting, hover micro-interactions,
            custom cursor spotlight, zoom click transition,
            and dynamic project loading from CMS.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMuseum();
});

function initMuseum() {
    // ── Load CMS Settings ──
    const siteData = getSiteData();
    applyMuseumGlobalStyles(siteData);

    // ── Get Active Projects ──
    const allProjects = typeof getAllProjects === 'function' ? getAllProjects() : [];
    // Filter out hidden projects and sort by order
    const activeProjects = allProjects.filter(p => !p.isHidden);
    activeProjects.sort((a, b) => {
        const orderA = a.order !== undefined ? parseInt(a.order) : 999;
        const orderB = b.order !== undefined ? parseInt(b.order) : 999;
        return orderA - orderB;
    });

    if (activeProjects.length === 0) {
        document.querySelector('.corridor-3d').innerHTML = `
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; font-family:var(--font-mono-museum); font-size:0.9rem;">
                NO ACTIVE PROJECTS FOUND.<br><br>
                <a href="admin.html" style="color:var(--color-accent-museum); text-decoration:underline;">ADD PROJECTS VIA CMS</a>
            </div>
        `;
        document.querySelector('.museum-preloader').classList.add('loaded');
        return;
    }

    // ── Render 3D Room and Reflection Clones ──
    renderMuseumCorridor(activeProjects, siteData);
    
    // ── Setup Ambient Particles ──
    initAmbientParticles(siteData);

    // ── Setup Custom Spotlight Cursor ──
    initSpotlightCursor();

    // ── Setup Scroll-driven Camera Z-axis Movement ──
    initCameraMovement(activeProjects, siteData);

    // ── Setup Entry Animations ──
    initEntryFlow(siteData);
}

/* ── Apply Site Customization Styles ── */
function applyMuseumGlobalStyles(data) {
    const root = document.documentElement;
    if (data.museum_text_color) root.style.setProperty('--color-text-museum', data.museum_text_color);
    if (data.museum_accent_color) root.style.setProperty('--color-accent-museum', data.museum_accent_color);
    if (data.museum_primary_font) root.style.setProperty('--font-heading-museum', data.museum_primary_font);
    if (data.museum_secondary_font) root.style.setProperty('--font-sans-museum', data.museum_secondary_font);
    if (data.museum_perspective_strength) root.style.setProperty('--perspective-strength', data.museum_perspective_strength);
    if (data.museum_corridor_width) root.style.setProperty('--corridor-width', data.museum_corridor_width);
    if (data.museum_hover_scale) root.style.setProperty('--hover-scale', data.museum_hover_scale);

    // Set background color/gradient/image
    const viewport = document.querySelector('.museum-viewport');
    if (viewport) {
        if (data.museum_bg_color) viewport.style.backgroundColor = data.museum_bg_color;
        if (data.museum_bg_gradient) viewport.style.backgroundImage = data.museum_bg_gradient;
    }

    // Custom CSS styling overrides for walls/floors
    const floor = document.querySelector('.corridor-floor');
    if (floor && data.museum_floor_style === 'stone') {
        floor.style.background = 'repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 2px, transparent 2px, transparent 150px), linear-gradient(to top, #08080a, #030303)';
    }

    // Set page SEO metadata
    if (data.museum_seo_title) document.title = data.museum_seo_title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.museum_seo_desc) metaDesc.setAttribute('content', data.museum_seo_desc);
}

/* ── Render 3D Wall Frames ── */
function renderMuseumCorridor(projects, data) {
    const corridor = document.getElementById('corridorRoom');
    if (!corridor) return;

    // Define spatial spacing parameters
    const corridorWidthVal = parseInt(data.museum_corridor_width) || 1200;
    const halfWidth = corridorWidthVal / 2;
    const depthSpacing = 1200; // Z-axis spacing between consecutive frames on same wall

    let html = `
        <!-- Ceiling -->
        <div class="corridor-ceiling" style="background: ${data.museum_wall_color ? `linear-gradient(to bottom, ${data.museum_wall_color}, #030303)` : ''};"></div>
        <!-- Floor -->
        <div class="corridor-floor"></div>
    `;

    // Draw spotlights dynamically on the ceiling
    const spotlightCount = parseInt(data.museum_spotlight_count) || 6;
    for (let i = 0; i < spotlightCount; i++) {
        const spotlightZ = -(i * 1000);
        html += `
            <div class="ceiling-spotlight" style="
                left: 50%;
                transform: translateX(-50%) translateZ(${spotlightZ}px);
                background: radial-gradient(ellipse at top, ${data.museum_lighting_color || '#D7B16A'} 0%, transparent 70%);
                opacity: ${data.museum_lighting_intensity || 1.0};
            "></div>
        `;
    }

    // Build the frames HTML
    projects.forEach((proj, idx) => {
        const isLeft = idx % 2 === 0;
        const zPos = -((idx + 1) * depthSpacing - 400); // Placing frames staggered in Z depth

        // Frame customizations from project fields or fallbacks
        const fWidth = proj.frameWidth || '360';
        const fHeight = proj.frameHeight || '260';
        const fGlass = proj.frameGlassEffect !== undefined ? proj.frameGlassEffect : '0.45';
        const fColor = proj.frameColor || data.museum_accent_color || '#D7B16A';
        const fBorder = proj.frameBorder || `2px solid ${fColor}`;
        const fShadow = proj.frameShadow || '0 20px 40px rgba(0,0,0,0.8)';
        const fSpotlightColor = proj.spotlightColor || data.museum_lighting_color || '#D7B16A';
        const fSpotlightIntensity = proj.spotlightIntensity !== undefined ? proj.spotlightIntensity : '0.9';

        // Translate parameters
        // Left wall frames are rotated Y (90deg) facing right wall. Right wall frames rotated Y (-90deg) facing left wall.
        const xOffset = isLeft ? -halfWidth : halfWidth;
        const yOffset = -50; // Centered vertically
        const rotationY = isLeft ? 90 : -90;

        // Wall Frame HTML
        html += `
            <!-- Frame Container (Z-depth and Wall Placement) -->
            <div class="museum-frame-container" 
                 id="container-${proj.id}"
                 style="transform: translate3d(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px), ${zPos}px) rotateY(${rotationY}deg);"
                 data-id="${proj.id}" 
                 data-z="${zPos}" 
                 data-x="${xOffset}"
                 data-y="${yOffset}"
                 data-rot-y="${rotationY}">
                
                <!-- Volumetric Spotlight Cone -->
                <div class="frame-spotlight-beam" style="
                    background: radial-gradient(ellipse at top, ${fSpotlightColor} 0%, transparent 75%);
                    opacity: ${fSpotlightIntensity};
                "></div>

                <!-- Realistic Frame -->
                <div class="museum-frame" style="
                    width: ${fWidth}px; 
                    height: ${fHeight}px; 
                    border: ${fBorder};
                    box-shadow: ${fShadow};
                ">
                    <!-- Soft Glow behind frame -->
                    <div class="frame-glow" style="background: radial-gradient(circle, ${fColor}33 0%, transparent 70%);"></div>
                    <div class="frame-highlight"></div>
                    <div class="frame-glass-reflection" style="opacity: ${fGlass}"></div>
                    
                    <!-- Media Area -->
                    <div class="frame-media">
                        <img src="${proj.bannerImage}" alt="${proj.title}" class="frame-image" loading="lazy">
                    </div>

                    <!-- Subtle Caption -->
                    <div class="frame-caption">
                        <h4 class="frame-title">${proj.title}</h4>
                        <span class="frame-subtitle">${proj.subtitle}</span>
                    </div>
                </div>
            </div>

            <!-- Flipped Reflected Floor Frame clone -->
            <div class="museum-frame-container reflected-frame" 
                 id="reflected-container-${proj.id}"
                 style="transform: translate3d(calc(-50% + ${xOffset}px), calc(-50% + 350px), ${zPos}px) rotateY(${rotationY}deg) scaleY(-1); opacity: 0.25; filter: blur(3px);"
                 data-id="${proj.id}">
                <div class="museum-frame" style="
                    width: ${fWidth}px; 
                    height: ${fHeight}px; 
                    border: ${fBorder};
                ">
                    <div class="frame-media">
                        <img src="${proj.bannerImage}" alt="${proj.title}" class="frame-image" loading="lazy">
                    </div>
                </div>
            </div>
        `;
    });

    corridor.innerHTML = html;
}

/* ── Setup Ambient Gold Particles ── */
function initAmbientParticles(data) {
    const container = document.getElementById('particlesContainer');
    if (!container || data.museum_bg_animation === 'none') return;

    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        
        // Random 3D placements
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 3 + 1;
        const speed = (Math.random() * 20 + 10) * (parseFloat(data.museum_animation_speed) || 1.0);

        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.backgroundColor = data.museum_accent_color || '#D7B16A';

        container.appendChild(p);

        // Animate particles drifting
        gsap.to(p, {
            y: `-=${Math.random() * 200 + 100}`,
            x: `+=${Math.random() * 100 - 50}`,
            opacity: 0,
            duration: speed,
            repeat: -1,
            ease: 'none',
            delay: Math.random() * -speed
        });
    }
}

/* ── Custom Spotlight Cursor ── */
function initSpotlightCursor() {
    const cursor = document.getElementById('museumCursor');
    const light = document.getElementById('museumCursorLight');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        gsap.to(light, { x: e.clientX, y: e.clientY, duration: 0.2, ease: 'power2.out' });
    });

    // Handle frame hover interactions to transform cursor into EXPLORE mode
    document.querySelectorAll('.museum-frame').forEach(frame => {
        frame.addEventListener('mouseenter', () => {
            cursor.classList.add('explore');
            // Subtle spotlight intensification
            const beam = frame.parentNode.querySelector('.frame-spotlight-beam');
            if (beam) gsap.to(beam, { opacity: 1.0, scaleX: 1.1, duration: 0.4 });
        });

        frame.addEventListener('mouseleave', () => {
            cursor.classList.remove('explore');
            // Reset spotlight intensity
            const beam = frame.parentNode.querySelector('.frame-spotlight-beam');
            if (beam) {
                const parent = frame.parentNode;
                const id = parent.getAttribute('data-id');
                const projects = typeof getAllProjects === 'function' ? getAllProjects() : [];
                const proj = projects.find(x => x.id === id);
                const intensity = (proj && proj.spotlightIntensity !== undefined) ? proj.spotlightIntensity : 0.9;
                gsap.to(beam, { opacity: intensity, scaleX: 1.0, duration: 0.4 });
            }
            // Reset frame 3D tilt
            gsap.to(frame, { rotateX: 0, rotateY: 0, scaleZ: 1, duration: 0.5, ease: 'power2.out' });
            const glass = frame.querySelector('.frame-glass-reflection');
            if (glass) gsap.to(glass, { x: 0, y: 0, duration: 0.5 });
        });

        // 3D Card Tilt on hover
        frame.addEventListener('mousemove', (e) => {
            const rect = frame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            // Calculate rotations based on cursor offset
            const rotateY = ((x - xc) / xc) * 10; // max 10 degrees
            const rotateX = -((y - yc) / yc) * 10; // max 10 degrees

            gsap.to(frame, { 
                rotateX: rotateX, 
                rotateY: rotateY, 
                z: 15, // push forward slightly in local 3D space
                duration: 0.2, 
                ease: 'power2.out' 
            });

            // Shift glass reflection overlay dynamically
            const glass = frame.querySelector('.frame-glass-reflection');
            if (glass) {
                const shiftX = ((x - xc) / xc) * 30; // max 30px shift
                const shiftY = ((y - yc) / yc) * 30;
                gsap.to(glass, { x: shiftX, y: shiftY, duration: 0.2 });
            }
        });
    });
}

/* ── Scroll-driven Camera Z-axis Movement ── */
let isZoomed = false; // Flag to prevent scroll modifications during zoom details view
function initCameraMovement(projects, data) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const corridor = document.getElementById('corridorRoom');
    const depthSpacing = 1200;
    
    // Total Z depth to walk is based on project count
    const totalZLength = (projects.length + 0.8) * depthSpacing;
    const speedMultiplier = parseFloat(data.museum_camera_speed) || 1.2;

    // Track smooth scrubbing along Z axis
    gsap.to(corridor, {
        z: () => {
            if (isZoomed) return corridor._gsap.z; // Freeze if zooming into a card
            return totalZLength;
        },
        ease: 'none',
        scrollTrigger: {
            trigger: '.museum-scroll-track',
            start: 'top top',
            end: 'bottom bottom',
            scrub: speedMultiplier, // Inertia/smoothing multiplier
            onUpdate: (self) => {
                // Fade out scroll instruction mouse icon after scrolling starts
                const scrollIndicator = document.getElementById('scrollIndicator');
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = self.progress > 0.05 ? '0' : '1';
                }
            }
        }
    });

    // Setup Click Event on frames to trigger Zoom Detail View
    document.querySelectorAll('.museum-frame').forEach(frame => {
        frame.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isZoomed) return;
            zoomIntoFrame(frame.parentNode);
        });
    });
}

/* ── Cinematic Click Zoom Detachment ── */
let activeZoomedContainer = null;
let savedScrollProgress = 0;

function zoomIntoFrame(container) {
    isZoomed = true;
    activeZoomedContainer = container;

    // Save current scroll position
    savedScrollProgress = window.scrollY;

    // Disable body scrolling by freezing the window scroll trigger track
    document.body.style.overflow = 'hidden';
    gsap.to('#scrollIndicator', { opacity: 0, duration: 0.3 });

    // Retrieve details from parent container data-attributes
    const id = container.getAttribute('data-id');
    const zPos = parseFloat(container.getAttribute('data-z'));
    const xPos = parseFloat(container.getAttribute('data-x'));
    const yPos = parseFloat(container.getAttribute('data-y'));
    const rotY = parseFloat(container.getAttribute('data-rot-y'));

    // Select the frame div inside container
    const frame = container.querySelector('.museum-frame');

    // Make spotlight extra bright
    const beam = container.querySelector('.frame-spotlight-beam');
    if (beam) gsap.to(beam, { opacity: 1.0, scaleX: 1.5, duration: 0.8 });

    // Build timeline for zoom
    const zoomTimeline = gsap.timeline({
        onComplete: () => {
            loadCaseStudyViewer(id);
        }
    });

    // 1. Center the corridor room on the clicked frame (compensating Z, X, Y coordinates)
    // Shift camera Z to exactly look at frame, shift X to center it, shift Y to center
    zoomTimeline.to('#corridorRoom', {
        x: -xPos,
        y: -yPos,
        z: -zPos + 400, // Zoom very close to frame
        duration: 1.5,
        ease: 'power3.inOut'
    }, 0);

    // 2. Rotate the frame from wall-facing rotation to face the screen directly (rotateY -> 0)
    zoomTimeline.to(container, {
        rotateY: 0,
        x: 0, // Align exactly horizontally
        y: 0, // Align exactly vertically
        duration: 1.5,
        ease: 'power3.inOut'
    }, 0);

    // 3. Scale frame up slightly
    zoomTimeline.to(frame, {
        scale: 1.08,
        borderColor: 'rgba(215,177,106,1)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.95)',
        duration: 1.5,
        ease: 'power3.inOut'
    }, 0);

    // 4. Blur out other elements in the 3D room
    document.querySelectorAll('.museum-frame-container').forEach(c => {
        if (c !== container) {
            gsap.to(c, { opacity: 0.05, duration: 1.0, ease: 'power2.out' });
            // Hide reflected companion too
            const ref = document.getElementById(`reflected-${c.id}`);
            if (ref) gsap.to(ref, { opacity: 0, duration: 1.0 });
        }
    });
    
    // Hide clicked reflection
    const clickedRef = document.getElementById(`reflected-container-${id}`);
    if (clickedRef) gsap.to(clickedRef, { opacity: 0, duration: 1.0 });
}

/* ── Zoom Back to Corridor Position ── */
function zoomOutFromFrame() {
    if (!activeZoomedContainer) return;

    // Hide project details screen
    const viewer = document.getElementById('projectViewer');
    viewer.classList.remove('active');

    // Retrieve original layout parameters
    const container = activeZoomedContainer;
    const zPos = parseFloat(container.getAttribute('data-z'));
    const xPos = parseFloat(container.getAttribute('data-x'));
    const yPos = parseFloat(container.getAttribute('data-y'));
    const rotY = parseFloat(container.getAttribute('data-rot-y'));
    const frame = container.querySelector('.museum-frame');
    const id = container.getAttribute('data-id');

    // Reset spotlight brightness
    const beam = container.querySelector('.frame-spotlight-beam');
    if (beam) {
        const projects = typeof getAllProjects === 'function' ? getAllProjects() : [];
        const proj = projects.find(x => x.id === id);
        const intensity = (proj && proj.spotlightIntensity !== undefined) ? proj.spotlightIntensity : 0.9;
        gsap.to(beam, { opacity: intensity, scaleX: 1.0, duration: 1.0 });
    }

    // Build timeline for return
    const returnTimeline = gsap.timeline({
        onComplete: () => {
            // Re-enable body scroll
            document.body.style.overflow = '';
            isZoomed = false;
            activeZoomedContainer = null;
            
            // Re-enable scroll triggers
            ScrollTrigger.refresh();
        }
    });

    // 1. Restore corridor position to pre-zoom coordinates
    const scrollProgress = savedScrollProgress / (document.documentElement.scrollHeight - window.innerHeight);
    const depthSpacing = 1200;
    const allProjects = typeof getAllProjects === 'function' ? getAllProjects() : [];
    const activeProjectsCount = allProjects.filter(p => !p.isHidden).length;
    const totalZLength = (activeProjectsCount + 0.8) * depthSpacing;
    const targetZ = scrollProgress * totalZLength;

    returnTimeline.to('#corridorRoom', {
        x: 0,
        y: 0,
        z: targetZ,
        duration: 1.4,
        ease: 'power3.inOut'
    }, 0);

    // 2. Rotate the frame back to its wall angle
    returnTimeline.to(container, {
        rotateY: rotY,
        x: `calc(-50% + ${xPos}px)`,
        y: `calc(-50% + ${yOffsetVal(container)}px)`,
        duration: 1.4,
        ease: 'power3.inOut'
    }, 0);

    // 3. Reset frame scale and border styling
    const siteData = getSiteData();
    const borderCol = (allProjects.find(x=>x.id===id)?.frameColor) || siteData.museum_accent_color || '#D7B16A';
    returnTimeline.to(frame, {
        scale: 1.0,
        borderColor: borderCol,
        boxShadow: (allProjects.find(x=>x.id===id)?.frameShadow) || '0 20px 40px rgba(0,0,0,0.8)',
        duration: 1.4,
        ease: 'power3.inOut'
    }, 0);

    // 4. Fade other elements back in
    document.querySelectorAll('.museum-frame-container').forEach(c => {
        gsap.to(c, { opacity: 1.0, duration: 1.0, ease: 'power2.out' });
    });
    document.querySelectorAll('.reflected-frame').forEach(r => {
        gsap.to(r, { opacity: 0.25, duration: 1.0, ease: 'power2.out' });
    });
}

function yOffsetVal(c) {
    return parseFloat(c.getAttribute('data-y')) || -50;
}

/* ── Fullscreen Case Study Builder ── */
function loadCaseStudyViewer(id) {
    const allProjects = typeof getAllProjects === 'function' ? getAllProjects() : [];
    const p = allProjects.find(x => x.id === id);
    if (!p) return;

    const viewer = document.getElementById('projectViewer');
    const container = document.getElementById('viewerDataContainer');
    if (!viewer || !container) return;

    // Construct gallery grid
    let galleryHtml = '';
    if (p.images && p.images.length > 0) {
        galleryHtml = `
            <div class="viewer-gallery-title">Exhibition Assets Gallery</div>
            <div class="viewer-gallery-grid">
                ${p.images.map((img, i) => `
                    <div class="viewer-gallery-item">
                        <img src="${img}" alt="Gallery Asset ${i + 1}" loading="lazy">
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Video media support
    let videoHtml = '';
    if (p.videoUrl) {
        // Resolve direct links vs embeds
        const urlLower = p.videoUrl.toLowerCase();
        const isYoutube = urlLower.includes('youtube.com') || urlLower.includes('youtu.be');
        const isVimeo = urlLower.includes('vimeo.com');
        
        if (isYoutube) {
            const ytId = p.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/)?.[1];
            if (ytId) {
                videoHtml = `<div class="viewer-video-embed"><iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}" allowfullscreen></iframe></div>`;
            }
        } else if (isVimeo) {
            const vimId = p.videoUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]+)\/posts\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/)?.[1];
            if (vimId) {
                videoHtml = `<div class="viewer-video-embed"><iframe src="https://player.vimeo.com/video/${vimId}?autoplay=1&loop=1&muted=1" allowfullscreen></iframe></div>`;
            }
        } else {
            videoHtml = `<div class="viewer-hero-image-wrap"><video src="${p.videoUrl}" autoplay loop muted playsinline></video></div>`;
        }
    }

    // Dynamic case description mapping
    container.innerHTML = `
        <div class="viewer-hero-image-wrap" style="display: ${videoHtml ? 'none' : 'block'};">
            <img src="${p.bannerImage}" alt="${p.title}">
        </div>

        ${videoHtml}

        <div class="viewer-grid">
            <div class="viewer-left">
                <h1>${p.title}</h1>
                <span class="viewer-subtitle">${p.subtitle || 'Exhibition Concept'}</span>

                <h3 class="viewer-section-title">The Challenge</h3>
                <div class="viewer-text">${p.about || 'A contemporary design thinking challenge addressing environmental layouts, user engagement, and storytelling.'}</div>

                <h3 class="viewer-section-title">Design Approach</h3>
                <div class="viewer-text">${p.approach || 'We established visual hierarchies and utilized grid structures combined with digital renders to optimize visitor flow and information visibility.'}</div>

                <h3 class="viewer-section-title">Final Delivery & Outcome</h3>
                <div class="viewer-text">${p.conclusion || 'An award-winning interactive installation setting new parameters for digital cultural heritage spaces.'}</div>
            </div>

            <div class="viewer-right">
                <div class="viewer-meta-card">
                    <div class="meta-group">
                        <span class="meta-label">Client</span>
                        <div class="meta-value">${p.client || 'Ministry of Cultural Heritage'}</div>
                    </div>
                    <div class="meta-group">
                        <span class="meta-label">Location / Year</span>
                        <div class="meta-value">${p.location || 'New Delhi, India'} · ${p.year || '2026'}</div>
                    </div>
                    <div class="meta-group">
                        <span class="meta-label">My Role</span>
                        <div class="meta-value">${p.role || 'Exhibition Designer & Planner'}</div>
                    </div>
                    <div class="meta-group">
                        <span class="meta-label">Software / Technology</span>
                        <div class="meta-value">${p.softwareUsed || 'Adobe Creative Suite, Figma, Unreal Engine'}</div>
                    </div>
                    ${p.awards ? `
                    <div class="meta-group">
                        <span class="meta-label">Awards & Recognition</span>
                        <div class="meta-value" style="color:var(--color-accent-museum); font-family:var(--font-heading-museum); font-size:1rem;">🏆 ${p.awards}</div>
                    </div>
                    ` : ''}
                    
                    ${p.ctaLabel ? `
                    <div class="meta-group" style="margin-top:2.5rem;">
                        <a href="${p.ctaHref || '#'}" target="_blank" style="
                            display: block;
                            text-align: center;
                            background: var(--color-accent-museum);
                            color: #000;
                            padding: 1rem;
                            border-radius: 4px;
                            font-family: var(--font-mono-museum);
                            font-size: 0.75rem;
                            letter-spacing: 0.1em;
                            text-decoration: none;
                            font-weight: bold;
                            transition: transform 0.3s, box-shadow 0.3s;
                        " onmouseenter="this.style.transform='translateY(-2px)';" onmouseleave="this.style.transform='none';">
                            ${p.ctaLabel.toUpperCase()}
                        </a>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>

        ${galleryHtml}
    `;

    // Activate the overlay
    viewer.classList.add('active');
    viewer.scrollTop = 0;
}

/* ── Entry Flow Cinematic Animations ── */
function initEntryFlow(data) {
    const preloader = document.getElementById('preloader');
    const heroEntry = document.getElementById('heroEntry');
    const enterBtn = document.getElementById('enterBtn');

    // 1. Simulate Preloader Progress
    let progress = 0;
    const progressEl = document.getElementById('preloaderProgress');
    const percentEl = document.getElementById('preloaderPercent');
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Fade preloader
            setTimeout(() => {
                preloader.classList.add('loaded');
                runHeroEntryAnimations();
            }, 600);
        }
        if (progressEl) progressEl.style.width = `${progress}%`;
        if (percentEl) percentEl.textContent = progress.toString().padStart(3, '0');
    }, 45);

    function runHeroEntryAnimations() {
        const tl = gsap.timeline();
        tl.to('.museum-hero-title', { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out' })
          .to('.museum-hero-subtitle', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=1.0')
          .to('.museum-hero-desc', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.9')
          .to(enterBtn, { opacity: 1, scale: 1, duration: 1.0, ease: 'back.out(1.7)' }, '-=0.8');
    }

    // 2. Click Enter Button to slide into 3D Space
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            // Animate overlay slide/fade away
            heroEntry.classList.add('entered');
            
            // Dynamic lens blur reset on corridor
            gsap.from('#corridorRoom', {
                filter: 'blur(10px)',
                z: -500,
                duration: 2.5,
                ease: 'power3.out',
                onComplete: () => {
                    // Make scroll instruction visible
                    const scrollIndicator = document.getElementById('scrollIndicator');
                    if (scrollIndicator) scrollIndicator.style.opacity = '1';
                }
            });

            // Play background audio if exists (optional)
        });
    }
}
