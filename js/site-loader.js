/* ============================================================
   SITE LOADER ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Syncs CMS content to every page
   Reads from localStorage and injects into data-cms-key elements.
   Also applies global settings (colors, fonts, logo, nav, SEO).
   ============================================================ */

const DEFAULT_SITE_DATA = {"home_hero_pretitle":"WORK","home_hero_title":"SELECTED<br>WORK &<br>EXPLORATIONS","home_hero_subtitle":"A curated collection of immersive museum experiences, projection mapping spectacles, cinematic AI films, brand campaigns and interactive digital worlds.","home_hero_scroll_label":"SCROLL TO EXPLORE","home_hero_monolith_name":"","home_hero_monolith_tagline":"","home_hero_btn1":"View Projects","home_hero_btn1_href":"work.html","home_hero_btn2":"Let's Collaborate","home_hero_btn2_href":"contact.html","home_hero_canvas_label":"MUSEUM Â· PROJECTION Â· AI VISUALS","home_hero_canvas_sub":"Experience Storytelling","home_stat1_num":"3+","home_stat1_label":"Years Experience","home_stat2_num":"50+","home_stat2_label":"Projects Delivered","home_stat3_num":"10+","home_stat3_label":"Museum & Exp Concepts","home_stat4_num":"1000+","home_stat4_label":"AI Visuals Created","home_mission_label":"MISSION STATEMENT","home_mission_title":"Bringing spaces, brands, and narratives to life using design thinking and emerging AI tools.","home_featured_label":"SELECTED WORK & EXPLORATIONS","home_featured_title":"Selected Work & Explorations","home_about_text":"Designing immersive experiences through storytelling, projection mapping, museum installations, interactive exhibitions, AI filmmaking and visual branding.","home_about_profile_badge":"","home_about_bio_p1":"I am a Graphic Designer and AI Visual Designer specializing in visual storytelling, museum experiences, projection mapping, and creative campaigns. Over the last three years, I have worked across branding, advertising, exhibition design, and AI-powered content creation.","home_about_bio_p2":"Adept at delivering concept-to-execution excellence, I combine grid layouts with generative AI tools to craft narratives that engage audiences across physical and digital spaces. Detail-oriented and grounded in timeless design principles, I thrive on collaborative projects that value innovation, clarity, and emotional resonance â€” always aiming to create immersive experiences that people remember.","home_partners_list":"NEXUS CULTURAL, CHRONOS MEDIA, MUSEUM WORKSHOPS, AURA LABS, ECHO EXPERIENCES, FUTURA BRANDING","home_testimonial1_quote":"Sandeep has a unique ability to bridge historic storytelling with futuristic AI design concepts, creating stunning layouts that capture our museum's vision.","home_testimonial1_author":"Museum Project Lead","home_testimonial1_company":"Exhibition Specialist","home_testimonial1_project":"HAL Heritage Museum","home_testimonial2_quote":"The architectural projection show was breathtaking. Sandeep's mapping precision and cinematic motion timing were flawless from storyboard to final light show.","home_testimonial2_author":"Cultural Director","home_testimonial2_company":"State Heritage Council","home_testimonial2_project":"Ravidas Projection Spectacular","home_testimonial3_quote":"Stunning AI pre-visualizations. Sandeep developed full style sheets, creature designs, and cinematic environments that aligned our film production teams instantly.","home_testimonial3_author":"Executive Producer","home_testimonial3_company":"Aura Films & Media","home_testimonial3_project":"Agnipankh Pre-Viz","work_hero_pretitle":"WORK","work_hero_title":"Selected<br>Work &<br>Explorations","work_hero_subtitle":"A curated collection of immersive museum experiences, projection mapping spectacles, and cinematic AI visual stories. Scroll down to explore the gallery.","work_label":"SELECTED WORK","work_title":"A curated showcase of immersive museum experiences, projection mapping concepts, and AI visual storytelling.","about_label":"SANDEEP PATEL","about_title":"Bridging physical spaces and digital frontiers.","about_bio_p1":"I am Sandeep Patel, a Graphic Designer and AI Visual Designer specializing in visual storytelling, museum experiences, projection mapping, and creative campaigns. Over the last three years, I have worked with cultural developers and media agencies to design layouts, graphics, and experiences that bridge the gap between history and technology.","about_bio_p2":"By combining core graphic layouts with generative AI pre-visualization tools, I establish clear pipelines for spatial design. I believe in grid precision, high contrast, and dynamic motion to create unforgettable physical and digital worlds.","about_path_title":"Professional Path","about_path_items":"Museum Concepts & Interactive Journeys, Large-scale Architectural Projection Mapping, Digital & Print Brand Campaigns, Exhibition & Visual Storytelling, Cinematic AI Pre-Visualization & Production","about_values_subtitle":"Principles guiding my creative choices.","about_value1_title":"Driven by Excellence","about_value1_text":"Continuous learning and exploration of emerging AI toolsets to push visual limits beyond standard formats.","about_value2_title":"Honesty & Authenticity","about_value2_text":"Crafting true visual connections. Creating campaigns and cultural spaces that remain sincere to their stories.","about_value3_title":"Purposeful Decisions","about_value3_text":"Avoiding standard trends. Prioritizing layout, typography, and storytelling to deliver measurable impact.","about_testimonial_label":"WHAT CLIENTS SAY","about_testimonial_quote":"Design is not just about visuals. It's about delivering impact. Sandeep has a unique ability to bridge historic storytelling with futuristic AI design concepts, creating stunning layouts that capture our museum's vision.","about_testimonial_author":"Museum Project Lead","about_testimonial_role":"Exhibition Specialist Â· India","what_label":"CAPABILITIES","what_title":"Design disciplines where visual narrative, human experience, and spatial technology connect.","what_main_service1_title":"Museum & Experience Design","what_main_service1_items":"Concept Development, Exhibition Storytelling, Interactive Installations, Visitor Journey Planning, Spatial Visual Design","what_main_service2_title":"Projection Mapping Design","what_main_service2_items":"Storyboard Creation, Visual Development, Motion Concepts, Historic & Cultural Narratives, Immersive Event Experiences","what_main_service3_title":"AI Visual Storytelling","what_main_service3_items":"Film Pre-Visualization, AI World Building, Character Design, Cinematic Image Generation, AI Film Production","what_main_service4_title":"Brand & Advertising Design","what_main_service4_items":"Campaign Design, Print Advertising, Outdoor Media, Social Media Campaigns, Brand Identity Systems","what_philosophy_title":"Every great design begins with a story.","what_philosophy_desc":"I believe visuals should do more than look beautifulâ€”they should communicate, inspire, and create emotional connections. My process combines strategy, storytelling, design thinking, and emerging AI technologies to create experiences that leave a lasting impact.","what_service1_title":"Graphic Design","what_service1_items":"Adobe Photoshop, Adobe Illustrator, CorelDRAW, Canva","what_service2_title":"AI & Visual Generators","what_service2_items":"Midjourney, Magnific AI, Google Flow, ChatGPT & Google Gemini","what_service3_title":"Productivity & Layout","what_service3_items":"Figma, Framer, Notion","story_label":"BRAND IDENTITY","story_title":"The story behind the Sandeep Patel identity and the three pillars of my creative approach.","story_main_title":"Combining the power of three elements: Design, Technology, and Imagination.","story_p1":"Every immersive show, projection map, or brand experience is powered by the balance of three aspects: Strategy (The Groundwork), Design Thinking (The Execution), and AI/Emerging Tech (The Evolution). This trinity shapes every creative canvas.","story_p2":"Inspired by the fantasy film project Agnipankh â€” The Last Dragon, the dragon represents power, continuous transformation, and fearless creative execution. It stands as a visual symbol of bridging cultural narratives with technological futures.","story_mascot_title":"Agnipankh: The Dragon","story_quote":"True growth is not about adding more, but about becoming more.","story_quote_desc":"Visual storytelling must evolve. By adapting AI pre-visualization and interactive layouts, I deliver narratives that live beyond standard digital boundaries.","contact_label":"GET IN TOUCH","contact_title":"Let's Create Something Meaningful.","contact_email":"design.sandeeppatel@gmail.com","contact_phone":"+91 8565923951","contact_loc_title":"LOCATION","contact_loc_val":"India / Remote Worldwide","contact_rate_title":"AVAILABILITY","contact_rate_val":"Currently taking on new concepts","contact_faq_subtitle":"Frequently Asked Questions","contact_faq1_q":"What kind of work do you take on?","contact_faq1_a":"I specialize in museum experience concepts, large-scale projection mapping visuals, AI-powered pre-visualization for films, spatial design, and brand advertising campaigns.","contact_faq2_q":"Who do you usually work with?","contact_faq2_a":"I partner with museum developers, event production agencies, creative directors, film producers, cultural institutions, and ambitious brands looking for high-fidelity visual storytelling.","contact_faq3_q":"How do projects typically begin?","contact_faq3_a":"We start with a short scoping conversation to discuss your creative requirements. Once details are aligned, I provide a detailed mood board, visual style frame, and project timeline proposal.","contact_faq4_q":"Can we sign an NDA before starting?","contact_faq4_a":"Absolutely. I respect intellectual property and am happy to sign a Non-Disclosure Agreement (NDA) before you share detailed layouts or project specifications.","contact_faq5_q":"How are projects priced and paid for?","contact_faq5_a":"Pricing is milestone-based or calculated on a value-driven project basis depending on the scope of visual development, assets required, and delivery schedules.","section_home_hero_visible":"true","section_home_stats_visible":"true","section_home_mission_visible":"true","section_home_projects_visible":"true","home_hero_bg_color":"#0B0B0B","home_hero_text_color":"#FFFFFF","home_hero_font_family":"","home_hero_gallery_btn_visibility":"hide","home_hero_particles_visibility":"show","home_journey_title":"Three Years of Creative Evolution.","home_selected_work_label":"05 â€” SELECTED WORK & EXPLORATIONS","home_selected_work_title":"Selected Work & Explorations","home_light_sound_label":"07 â€” LIGHT & SOUND SHOWS","home_light_sound_title":"Light & Sound Shows","home_light_sound_scroll_text":"LIGHT & SOUND SHOWS","home_about_bg_color":"#E2DCD3","home_about_text_color":"#1A1A1A","home_about_font_family":"","home_about_resume_file":"index image/SANDEEP RESUME.jpg","home_about_resume_filename":"SANDEEP RESUME.png","home_what_i_do_bg_color":"#E2DCD3","home_what_i_do_text_color":"#FFFFFF","home_what_i_do_font_family":"","home_journey_bg_color":"#0B0B0B","home_journey_text_color":"#FFFFFF","home_journey_font_family":"","home_education_bg_color":"#E2DCD3","home_education_text_color":"#1A1A1A","home_education_font_family":"","home_selected_work_bg_color":"#0B0B0B","home_selected_work_text_color":"#FFFFFF","home_selected_work_font_family":"","home_testimonials_bg_color":"#0B0B0B","home_testimonials_text_color":"#FFFFFF","home_testimonials_font_family":"","home_light_sound_bg_color":"#0B0B0B","home_light_sound_text_color":"#FFFFFF","home_light_sound_font_family":"","home_archive_bg_color":"#E2DCD3","home_archive_text_color":"#1A1A1A","home_archive_font_family":"","home_edu_col1_date":"2021 â€” 2023","home_edu_col1_title":"Master Of Fine Arts","home_edu_col1_subtitle":"Visualization & Design â€” C.S.J.M. University Kanpur","home_edu_col1_desc":"Specialized in visual systems, layout theory, user flow designs, and experimental AI art pipelines.","home_edu_col2_date":"2018 â€” 2021","home_edu_col2_title":"Bachelor Of Fine Arts","home_edu_col2_subtitle":"Applied Art â€” C.S.J.M. University Kanpur","home_edu_col2_desc":"Grounded in classical art foundations, layout grids, branding principles, and typographic designs.","home_edu_col3_date":"2016 â€” 2018","home_edu_col3_title":"High School Certificate","home_edu_col3_subtitle":"Pt. Deen Dayal Intermediate College Maharajganj - Uttar Pradesh Board","home_edu_col3_desc":"Completed early academic foundation with focus on communication design and basic graphics theory.","home_what_i_do_card1_bg_color":"#000000","home_what_i_do_card1_text_color":"#FFFFFF","home_what_i_do_card2_bg_color":"#000000","home_what_i_do_card2_text_color":"#FFFFFF","home_what_i_do_card3_bg_color":"#000000","home_what_i_do_card3_text_color":"#FFFFFF","home_what_i_do_card4_bg_color":"#000000","home_what_i_do_card4_text_color":"#FFFFFF","museum_title":"MUSEUM EXPERIENCE","museum_subtitle":"Interactive Digital Gallery","museum_desc":"Explore my selected architectural and design concepts in an immersive 3D-like physical corridor.","museum_text_color":"#F8F9FA","museum_accent_color":"#D7B16A","museum_primary_font":"'Cormorant Garamond', serif","museum_secondary_font":"'Inter', sans-serif","museum_corridor_width":"1200px","museum_corridor_length":"4000px","museum_wall_style":"concrete","museum_wall_color":"#050505","museum_wall_texture":"smooth","museum_ceiling_style":"minimalist","museum_floor_style":"polished","museum_spotlight_count":"6","museum_spotlight_position":"center","museum_fog_density":"0.2","museum_perspective_strength":"800px","museum_lighting_intensity":"1.0","museum_lighting_color":"#D7B16A","museum_ambient_overlay":"rgba(0,0,0,0.6)","museum_bg_color":"#050505","museum_bg_image":"","museum_bg_video":"","museum_bg_gradient":"linear-gradient(180deg, #050505 0%, #0c0c0c 100%)","museum_bg_animation":"subtle-drift","museum_animation_speed":"1.0","museum_hover_scale":"1.05","museum_hover_glow":"rgba(215, 177, 106, 0.4)","museum_camera_speed":"1.2","museum_motion_blur":"enabled","museum_seo_title":"Museum Experience | Sandeep Patel","museum_seo_desc":"A premium interactive virtual museum hallway showcasing digital design concepts.","museum_og_image":"","museum_slug":"museum","home_hero_canvas_color_mode":"auto","home_hero_canvas_color":"#FF6B00","project_gallery_gap":"20px","home_featured_projects":"dettol, iccs-museum, nimhans-brain-and-mind-museum, ravidas-museum, reliance-experience-centre, sabarmati-ashram-memorial, dinosaur-fossil-national-park, hal-museum, yuge-yugeen-bharat-museum, amber-fort-light-spectacular","home_about_profile_image":"index image/About Section Profile Image.jpg","home_hero_bg_image":"index image/index hero banner.jpg","light_sound_reveal_img1":"index image/Comparison Image 1 (Base - drop zone).jpg","light_sound_reveal_img2":"index image/Comparison Image 2 (Masked - drop zone).jpg","home_about_bg_image":"","home_what_i_do_bg_image":"","home_journey_bg_image":"","home_education_bg_image":"","home_selected_work_bg_image":"","home_testimonials_bg_image":"","home_light_sound_bg_image":"","home_archive_bg_image":""};

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Merge stored data with defaults ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function getSiteData() {
    if (typeof CMS !== 'undefined') {
        return { ...DEFAULT_SITE_DATA, ...CMS.getLiveData() };
    }
    try {
        const raw = localStorage.getItem('sandeep_site_data_v2');
        const parsed = raw ? JSON.parse(raw) : {};
        return { ...DEFAULT_SITE_DATA, ...parsed };
    } catch {
        return { ...DEFAULT_SITE_DATA };
    }
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Apply global settings (colors, fonts, logo, nav) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function applyGlobalSettings() {
    const settings = (typeof CMS !== 'undefined') ? CMS.getSettings() : (() => {
        try { return JSON.parse(localStorage.getItem('sandeep_global_settings') || '{}'); } catch { return {}; }
    })();
    const s = { ...DEFAULT_SETTINGS_FALLBACK, ...settings };

    /* Color overrides */
    const root = document.documentElement;
    if (s.primary_color)  root.style.setProperty('--color-dark-text',  s.primary_color);
    if (s.accent_color)   root.style.setProperty('--color-accent',     s.accent_color);
    if (s.bg_dark)        root.style.setProperty('--color-dark-bg',    s.bg_dark);
    if (s.bg_light)       root.style.setProperty('--color-light-bg',   s.bg_light);

    /* Logo */
    const logoText = document.querySelector('.logo-text');
    const logoIcon = document.querySelector('.logo-icon');
    if (logoText && s.logo_text) logoText.textContent = s.logo_text;
    if (logoIcon && s.logo_icon) logoIcon.textContent = s.logo_icon;

    /* Footer */
    // const footerCopy = document.querySelector('.footer-copy-text');
    // if (footerCopy && s.footer_tagline) footerCopy.textContent = s.footer_tagline;
    const footerBrand = document.querySelector('.footer-brand');
    if (footerBrand && s.footer_brand) footerBrand.textContent = s.footer_brand;

    /* Apply Social Links dynamically from global settings */
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const txt = link.textContent.toLowerCase();
        
        if (s.social_instagram && (href.includes('instagram.com') || txt.includes('instagram'))) {
            link.href = s.social_instagram;
        }
        if (s.social_behance && (href.includes('behance.net') || txt.includes('behance'))) {
            link.href = s.social_behance;
        }
        if (s.social_linkedin && (href.includes('linkedin.com') || txt.includes('linkedin'))) {
            link.href = s.social_linkedin;
        }
    });
}

const DEFAULT_SETTINGS_FALLBACK = {
    logo_text:      'Sandeep Patel',
    logo_icon:      'S',
    primary_color:  '#F8F9FA',
    accent_color:   '#D98A29',
    bg_dark:        '#0B0B0B',
    bg_light:       '#E2DCD3',
    footer_tagline: 'Creating Stories Through Design, Technology & Imagination.',
    footer_brand:   'Inspire · Innovate · Impact',
    social_instagram:  'https://www.instagram.com/sandy_clickzzzz',
    social_linkedin:   'https://www.linkedin.com/in/sandeep-patel-ab5878237',
    social_behance:    'https://www.behance.net/sandeeppat2070',
};

/* ─── Inject CMS data into DOM ─── */
function updateDOMFromCMS() {
    const data = getSiteData();
    document.documentElement.style.setProperty('--project-gallery-gap', data.project_gallery_gap || '0px');
    
    // Apply Hero background color dynamically
    const heroBg = data.home_hero_bg_color || '#0B0B0B';
    const heroSec = document.getElementById('section-home-hero');
    if (heroSec) {
        heroSec.style.backgroundColor = heroBg;
    }

    // Apply Section styling dynamically
    const sectionsToStyle = [
        { id: 'section-home-hero',          prefix: 'home_hero' },
        { id: 'section-home-about',         prefix: 'home_about' },
        { id: 'section-home-what-i-do',     prefix: 'home_what_i_do' },
        { id: 'section-home-journey',        prefix: 'home_journey' },
        { id: 'section-home-education',      prefix: 'home_education' },
        { id: 'section-home-selected-work',  prefix: 'home_selected_work' },
        { id: 'section-home-testimonials',   prefix: 'home_testimonials' },
        { id: 'section-home-scrolling-text', prefix: 'home_light_sound' },
        { id: 'section-home-archive',        prefix: 'home_archive' }
    ];

    sectionsToStyle.forEach(secInfo => {
        const el = document.getElementById(secInfo.id);
        if (!el) return;

        const bgColor = data[`${secInfo.prefix}_bg_color`];
        const bgImage = data[`${secInfo.prefix}_bg_image`];
        const textColor = data[`${secInfo.prefix}_text_color`];
        const fontFamily = data[`${secInfo.prefix}_font_family`];

        if (bgColor) {
            el.style.backgroundColor = bgColor;
            el.style.setProperty('--bg-current', bgColor);
            // If it's the hero, also save it in the old color key just in case
            if (secInfo.prefix === 'home_hero') {
                data.home_hero_bg_color = bgColor;
            }
        }
        
        if (bgImage) {
            el.style.backgroundImage = bgImage.startsWith('url') ? bgImage : `url('${bgImage}')`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat = 'no-repeat';
        } else {
            el.style.backgroundImage = '';
        }
        
        if (textColor) {
            el.style.color = textColor;
            el.style.setProperty('--text-current', textColor);
            
            // Set colors on all children inside unless they are a specific badge/accent or overridden
            el.querySelectorAll('h1, h2, h3, h4, h5, p, span, li, a').forEach(child => {
                if (!child.classList.contains('badge-title') && 
                    !child.classList.contains('timeline-date') && 
                    !child.classList.contains('project-card-meta') && 
                    !child.classList.contains('marquee-card-meta') && 
                    !child.classList.contains('section-label')) {
                    child.style.color = textColor;
                }
            });
        }
        
        if (fontFamily) {
            el.style.fontFamily = fontFamily;
            el.style.setProperty('--font-heading', fontFamily);
            el.style.setProperty('--font-sans', fontFamily);
            
            el.querySelectorAll('h1, h2, h3, h4, h5, p, span, li, a').forEach(child => {
                child.style.fontFamily = fontFamily;
            });
        }
    });

    // Apply What I Do Card colors dynamically
    for (let i = 1; i <= 4; i++) {
        const cardEl = document.getElementById(`what-i-do-card-${i}`);
        if (cardEl) {
            const cardBg = data[`home_what_i_do_card${i}_bg_color`];
            const cardText = data[`home_what_i_do_card${i}_text_color`];
            
            if (cardBg) {
                cardEl.style.setProperty('background-color', cardBg, 'important');
                cardEl.style.setProperty('--bg-current', cardBg, 'important');
            }
            if (cardText) {
                cardEl.style.setProperty('color', cardText, 'important');
                cardEl.style.setProperty('--text-current', cardText, 'important');
                
                let mutedColor = cardText;
                let borderColor = cardText;
                if (cardText.startsWith('#') && cardText.length === 7) {
                    mutedColor = cardText + '99'; // ~60% opacity
                    borderColor = cardText + '26'; // ~15% opacity
                }
                cardEl.style.setProperty('--muted-current', mutedColor, 'important');
                cardEl.style.setProperty('--border-current', borderColor, 'important');
                
                // Override text color inline for elements inside this specific card to prevent section-wide overrides
                cardEl.querySelectorAll('h3, span, li').forEach(child => {
                    if (child.classList.contains('service-num') || child.tagName === 'LI') {
                        child.style.setProperty('color', mutedColor, 'important');
                    } else {
                        child.style.setProperty('color', cardText, 'important');
                    }
                });
            }
        }
    }

    document.querySelectorAll('[data-cms-key]').forEach(el => {
        const key = el.getAttribute('data-cms-key');
        if (data[key] === undefined) return;
        const val = data[key];

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = val;
        } else if (el.tagName === 'IMG') {
            if (val) el.src = val;
        } else if (el.tagName === 'A') {
            if (key.includes('email')) el.href = `mailto:${val}`;
            else if (key.includes('phone')) el.href = `tel:${val.replace(/\s/g, '')}`;
            else if (key.includes('href')) el.href = val;
            else el.innerHTML = val;
        } else if (el.classList.contains('service-sublist') || el.tagName === 'UL' || el.tagName === 'OL') {
            const items = val.split(',').map(i => i.trim()).filter(Boolean);
            el.innerHTML = items.map(i => `<li>${i}</li>`).join('');
        } else {
            el.innerHTML = val;
        }
    });

    /* Particles Canvas Visibility */
    if (data.home_hero_particles_visibility === 'hide') {
        const particleCanvas1 = document.getElementById('interactive-bg');
        if (particleCanvas1) particleCanvas1.remove();
        const particleCanvas2 = document.getElementById('hero-interactive-canvas');
        if (particleCanvas2) particleCanvas2.remove();
    }

    /* Element visibility */
    document.querySelectorAll('[data-cms-visibility]').forEach(el => {
        const key = el.getAttribute('data-cms-visibility');
        if (data[key] === 'hide') {
            el.style.display = 'none';
        } else {
            el.style.display = '';
        }
    });

    /* Section visibility */
    const visibilityKeys = Object.keys(data).filter(k => k.startsWith('section_'));
    visibilityKeys.forEach(k => {
        const sectionId = k.replace('section_', '').replace(/_visible$/, '').replace(/_/g, '-');
        const el = document.getElementById(sectionId) || document.querySelector(`[data-section="${sectionId}"]`);
        if (el) el.style.display = data[k] === 'false' ? 'none' : '';
    });

    // Dynamic Active Nav Link Highlighting based on current pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksList = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    if (currentPath !== 'index.html' && currentPath !== '') {
        navLinksList.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            if (currentPath.includes('about') && href.includes('about')) {
                link.classList.add('active');
            } else if (currentPath.includes('what-i-do') && href.includes('what-i-do')) {
                link.classList.add('active');
            } else if (currentPath.includes('contact') && href.includes('contact')) {
                link.classList.add('active');
            } else if ((window.location.pathname.includes('/work/') || currentPath.includes('work') || currentPath.includes('project-detail')) && href.includes('selected-work')) {
                link.classList.add('active');
            }
        });
    }
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Dynamic Lenis Loader ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
/* Lenis loader removed (Lenis is loaded statically via script tags in HTML) */

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Init on DOM Ready ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
document.addEventListener('DOMContentLoaded', () => {
    // Schema migration: Seed missing default keys to localStorage sandeep_site_data_v2
    try {
        const raw = localStorage.getItem('sandeep_site_data_v2');
        if (raw) {
            const data = JSON.parse(raw);
            let updated = false;
            for (const key in DEFAULT_SITE_DATA) {
                if (data[key] === undefined) {
                    data[key] = DEFAULT_SITE_DATA[key];
                    updated = true;
                }
            }
            // If the old home title is still the default, update it to the new one
            if (data.home_hero_title === 'Immersive<br>Visual<br>Experiences.') {
                data.home_hero_title = DEFAULT_SITE_DATA.home_hero_title;
                data.home_hero_pretitle = DEFAULT_SITE_DATA.home_hero_pretitle;
                data.home_hero_subtitle = DEFAULT_SITE_DATA.home_hero_subtitle;
                updated = true;
            }

            // Force update the home about section if it contains the old placeholder data
            if (data.home_about_profile_badge === 'CREATIVE DIRECTOR Ãƒâ€šÃ‚Â· DELHI' || (data.home_about_bio_p1 && data.home_about_bio_p1.indexOf('15+ years of experience') !== -1)) {
                data.home_about_profile_badge = DEFAULT_SITE_DATA.home_about_profile_badge;
                data.home_about_bio_p1 = DEFAULT_SITE_DATA.home_about_bio_p1;
                data.home_about_bio_p2 = DEFAULT_SITE_DATA.home_about_bio_p2;
                updated = true;
            }
            if (updated) {
                localStorage.setItem('sandeep_site_data_v2', JSON.stringify(data));
            }
        } else {
            localStorage.setItem('sandeep_site_data_v2', JSON.stringify(DEFAULT_SITE_DATA));
        }
    } catch (e) {
        console.error('Error during site data schema migration:', e);
    }

    // Migrate default settings if old
    try {
        const rawSettings = localStorage.getItem('sandeep_global_settings');
        if (rawSettings) {
            const settings = JSON.parse(rawSettings);
            let updatedSettings = false;
            if (settings.accent_color === '#C9A96E') {
                settings.accent_color = '#D98A29';
                updatedSettings = true;
            }
            if (settings.bg_dark === '#000000') {
                settings.bg_dark = '#0B0B0B';
                updatedSettings = true;
            }
            if (updatedSettings) {
                localStorage.setItem('sandeep_global_settings', JSON.stringify(settings));
            }
        }
    } catch (e) {
        console.error('Error migrating global settings:', e);
    }

    applyGlobalSettings();
    updateDOMFromCMS();
    initMobileMenu();
    initProjectPaginationAndRelated();
    // Dispatch lenisLoaded immediately since Lenis is statically loaded in the HTML
    window.dispatchEvent(new Event('lenisLoaded'));
});

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ React to live updates ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
window.addEventListener('storage', e => {
    if (e.key === 'sandeep_site_data_v2' || e.key === 'sandeep_site_data_v2_updated' || e.key === 'sandeep_global_settings') {
        applyGlobalSettings();
        updateDOMFromCMS();
        if (typeof initPartnersGrid === 'function') {
            initPartnersGrid();
        }
    }
});

window.addEventListener('siteDataUpdated', () => { 
    updateDOMFromCMS(); 
    if (typeof initPartnersGrid === 'function') {
        initPartnersGrid();
    }
});
window.addEventListener('settingsUpdated',  () => { applyGlobalSettings(); });

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Expose helpers globally ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
window.getSiteData    = getSiteData;
window.updateDOMFromCMS = updateDOMFromCMS;

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Accessible Mobile Hamburger Menu & Drawer Overlay ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function initMobileMenu() {
    const navWrapper = document.querySelector('.nav-wrapper');
    if (!navWrapper) return;

    // Check if hamburger button already exists (prevent duplicate insertion)
    if (document.getElementById('hamburger-btn')) return;

    // Create Hamburger Button
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.id = 'hamburger-btn';
    hamburgerBtn.className = 'hamburger-btn';
    hamburgerBtn.setAttribute('aria-label', 'Toggle Navigation');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-controls', 'mobile-menu-drawer');
    hamburgerBtn.innerHTML = `
        <span class="hamburger-line line-top"></span>
        <span class="hamburger-line line-bottom"></span>
    `;

    navWrapper.appendChild(hamburgerBtn);

    // Create Mobile Drawer Overlay
    const drawer = document.createElement('div');
    drawer.id = 'mobile-menu-drawer';
    drawer.className = 'mobile-menu-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
        <div class="mobile-menu-inner">
            <nav class="mobile-menu-nav">
                <ul class="mobile-nav-links">
                </ul>
            </nav>
        </div>
    `;

    document.body.appendChild(drawer);

    // Clone navigation links from desktop menu
    const desktopLinks = document.querySelectorAll('.nav-links a');
    const mobileLinksUl = drawer.querySelector('.mobile-nav-links');
    
    desktopLinks.forEach(link => {
        const li = document.createElement('li');
        const mobileLink = document.createElement('a');
        mobileLink.className = 'mobile-nav-link';
        mobileLink.href = link.getAttribute('href');
        if (link.classList.contains('nav-scroll-link')) {
            mobileLink.className += ' nav-scroll-link';
        }
        mobileLink.innerHTML = `<span>${link.textContent}</span>`;
        li.appendChild(mobileLink);
        mobileLinksUl.appendChild(li);
    });

    // Toggle menu state
    function toggleMenu(forceClose = false) {
        const isOpen = hamburgerBtn.classList.contains('open');
        const shouldOpen = !isOpen && !forceClose;

        // Recalculate focusable elements inside drawer dynamically
        const focusableElements = drawer.querySelectorAll('a, button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (shouldOpen) {
            // Open Menu
            hamburgerBtn.classList.add('open');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            drawer.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
            document.body.classList.add('menu-open');
            
            if (window.lenis) {
                window.lenis.stop();
            }
            
            // Focus on first element in menu
            setTimeout(() => {
                if (firstFocusable) firstFocusable.focus();
            }, 100);
        } else {
            // Close Menu
            hamburgerBtn.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('menu-open');
            
            if (window.lenis) {
                window.lenis.start();
            }
            
            // Return focus to hamburger button
            hamburgerBtn.focus();
        }
    }

    // Toggle click listener
    hamburgerBtn.addEventListener('click', () => toggleMenu());

    // Click inside links closes menu
    mobileLinksUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(true);
        });
    });

    // Keyboard accessibility focus trapping
    drawer.addEventListener('keydown', (e) => {
        const focusableElements = drawer.querySelectorAll('a, button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            const activeEl = document.activeElement;
            if (e.shiftKey) { // Shift + Tab
                if (activeEl === firstFocusable) {
                    if (lastFocusable) lastFocusable.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (activeEl === lastFocusable) {
                    if (firstFocusable) firstFocusable.focus();
                    e.preventDefault();
                }
            }
        } else if (e.key === 'Escape') {
            toggleMenu(true);
        }
    });

    // Handle touch/click outside to close
    drawer.addEventListener('click', (e) => {
        if (e.target === drawer || e.target.classList.contains('mobile-menu-inner')) {
            toggleMenu(true);
        }
    });
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Dynamic Pagination & Related Projects for Case Studies ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function initProjectPaginationAndRelated() {
    // Check if we are on a project page
    const isProjectDetail = window.location.pathname.includes('project-detail.html');
    const isSubfolderWork = window.location.pathname.includes('/work/');
    if (!isProjectDetail && !isSubfolderWork) return;

    // Helper to get current project ID
    let currentId = null;
    if (isProjectDetail) {
        const params = new URLSearchParams(window.location.search);
        currentId = params.get('id');
    } else if (isSubfolderWork) {
        // e.g. /work/nike-campaign.html -> nike-campaign
        const filename = window.location.pathname.split('/').pop() || '';
        currentId = filename.replace('.html', '');
    }

    if (!currentId) return;

    // Load projects list
    let projects = [];
    if (typeof getAllProjects === 'function') {
        projects = getAllProjects();
    } else {
        // Fallback if projects-data is not loaded yet
        try {
            const raw = localStorage.getItem('sandeep_projects_v24');
            projects = raw ? JSON.parse(raw) : [];
        } catch(e) {
            return;
        }
    }

    if (!projects || !projects.length) return;

    // Filter visible projects and sort them
    const activeProjects = projects.filter(p => !p.isHidden);
    // Sort by order ascending
    activeProjects.sort((a, b) => {
        const orderA = a.order !== undefined ? parseInt(a.order) : 999;
        const orderB = b.order !== undefined ? parseInt(b.order) : 999;
        return orderA - orderB;
    });

    const currentIndex = activeProjects.findIndex(p => p.id === currentId);
    if (currentIndex === -1) return;

    // Find footer element
    const footer = document.querySelector('footer');
    if (!footer) return;

    // Helper to format paths dynamically based on subdirectory
    function formatHref(targetHref) {
        if (!targetHref) return '#';
        if (targetHref.startsWith('http') || targetHref.startsWith('mailto')) return targetHref;
        if (isSubfolderWork) {
            if (targetHref.startsWith('work/')) {
                return targetHref.substring(5); // remove 'work/'
            } else {
                return '../' + targetHref; // go up to root
            }
        } else {
            return targetHref;
        }
    }

    // 1. Generate Pagination (Previous / Next)
    const prevProj = activeProjects[(currentIndex - 1 + activeProjects.length) % activeProjects.length];
    const nextProj = activeProjects[(currentIndex + 1) % activeProjects.length];

    if (prevProj && nextProj && activeProjects.length > 1) {
        const paginationHtml = `
            <div class="project-pagination">
                <a href="${formatHref(prevProj.ctaHref || 'project-detail.html?id=' + prevProj.id)}" class="pagination-item pagination-prev">
                    <span class="pagination-label font-mono">PREVIOUS PROJECT</span>
                    <span class="pagination-title">${prevProj.title}</span>
                </a>
                <a href="${formatHref(nextProj.ctaHref || 'project-detail.html?id=' + nextProj.id)}" class="pagination-item pagination-next">
                    <span class="pagination-label font-mono">NEXT PROJECT</span>
                    <span class="pagination-title">${nextProj.title}</span>
                </a>
            </div>
        `;
        footer.before(parseHTML(paginationHtml));
    }

    // 2. Generate Related Projects
    const related = [];
    if (activeProjects.length > 1) {
        related.push(nextProj);
        if (activeProjects.length > 2) {
            const nextNextProj = activeProjects[(currentIndex + 2) % activeProjects.length];
            related.push(nextNextProj);
        }
    }

    if (related.length > 0) {
        const relatedHtml = `
            <div class="related-projects-section">
                <div class="tr-container">
                    <span class="section-label font-mono">RELATED WORK</span>
                    <div class="related-projects-grid">
                        ${related.map(p => {
                            const cardHref = formatHref(p.ctaHref || 'project-detail.html?id=' + p.id);
                            return `
                                <a href="${cardHref}" class="related-project-card">
                                    <div class="related-card-image-wrap">
                                        <img src="${p.bannerImage || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80'}" alt="${p.title}">
                                    </div>
                                    <div class="related-card-info">
                                        <span class="related-card-category font-mono">${p.subtitle || ''}</span>
                                        <h4 class="related-card-title">${p.title}</h4>
                                    </div>
                                </a>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        footer.before(parseHTML(relatedHtml));
    }
}

// Helper to convert HTML string to DOM element
function parseHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}














