/* ============================================================
   CMS CORE ENGINE — Sandeep Patel Portfolio
   Handles: Storage, Drafts, Publishing, Version History,
            Media Library, Global Settings, Auto-Save
   ============================================================ */

const CMS_KEYS = {
    LIVE_DATA:      'sandeep_site_data_v2',
    DRAFT_DATA:     'sandeep_draft_data',
    PROJECTS:       'sandeep_projects_v25',
    MEDIA:          'sandeep_media_library',
    VERSIONS:       'sandeep_versions',
    SETTINGS:       'sandeep_global_settings',
    UPDATED:        'sandeep_site_data_v2_updated',
    PROJ_UPDATED:   'sandeep_projects_updated',
};

const MAX_VERSIONS = 10;

/* ── Default Global Settings ── */
const DEFAULT_SETTINGS = {
    logo_text:         'Sandeep Patel',
    logo_icon:         'S',
    primary_color:     '#F8F9FA',
    accent_color:      '#D98A29',
    bg_dark:           '#0B0B0B',
    bg_light:          '#F5F4F0',
    font_heading:      'Playfair Display',
    font_body:         'Space Grotesk',
    font_mono:         'Inter',
    nav_links:         'Work|work.html, Museum Experience|museum.html, What I Do|what-i-do.html, About|about.html, Contact|contact.html, My Story|sandeep-story.html',
    footer_tagline:    'Creating Stories Through Design, Technology & Imagination.',
    footer_brand:      'Inspire · Innovate · Impact',
    social_instagram:  'https://instagram.com/sandeeppatel',
    social_linkedin:   'https://linkedin.com/in/sandeeppatel',
    social_behance:    'https://behance.net/sandeeppatel',
    social_email:      'design.sandeeppatel@gmail.com',
    seo_home_title:    'Sandeep Patel | Immersive Graphic & AI Visual Designer',
    seo_home_desc:     'Sandeep Patel is a Graphic Designer, AI Visual Designer, and Museum Experience Designer.',
    seo_work_title:    'Work | Sandeep Patel',
    seo_about_title:   'About | Sandeep Patel',
    seo_contact_title: 'Contact | Sandeep Patel',
};

/* ── CMSStore ── Main storage class ─────────────────────── */
class CMSStore {
    constructor() {
        this._listeners = [];
    }

    _safeSetItem(key, val) {
        try {
            localStorage.setItem(key, val);
            return true;
        } catch (e) {
            console.error(`Failed to set item for key "${key}" in localStorage:`, e);
            const msg = 'Storage quota exceeded! Try compressing images or using image URLs instead of uploading files.';
            if (typeof toast === 'function') {
                toast(msg, 'error', 6000);
            } else {
                alert(msg);
            }
            return false;
        }
    }

    /* ── Site Content (Live) ── */
    getLiveData() {
        try {
            const raw = localStorage.getItem(CMS_KEYS.LIVE_DATA);
            if (!raw) return {};
            return JSON.parse(raw);
        } catch { return {}; }
    }

    setLiveData(data) {
        if (this._safeSetItem(CMS_KEYS.LIVE_DATA, JSON.stringify(data))) {
            this._safeSetItem(CMS_KEYS.UPDATED, Date.now().toString());
            window.dispatchEvent(new Event('siteDataUpdated'));
        }
    }

    /* ── Draft ── */
    getDraft() {
        try {
            const raw = localStorage.getItem(CMS_KEYS.DRAFT_DATA);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch { return null; }
    }

    saveDraft(data) {
        const draft = { data, savedAt: Date.now() };
        this._safeSetItem(CMS_KEYS.DRAFT_DATA, JSON.stringify(draft));
    }

    clearDraft() {
        localStorage.removeItem(CMS_KEYS.DRAFT_DATA);
    }

    hasDraft() {
        return !!localStorage.getItem(CMS_KEYS.DRAFT_DATA);
    }

    /* ── Publish ── */
    publish(data) {
        // Push current live → version history
        const currentLive = this.getLiveData();
        this._pushVersion(currentLive);
        // Set new live
        this.setLiveData(data);
        // Clear draft
        this.clearDraft();
        return true;
    }

    /* ── Version History ── */
    _pushVersion(data) {
        const versions = this.getVersions();
        versions.unshift({ data, savedAt: Date.now() });
        if (versions.length > MAX_VERSIONS) versions.length = MAX_VERSIONS;
        this._safeSetItem(CMS_KEYS.VERSIONS, JSON.stringify(versions));
    }

    getVersions() {
        try {
            const raw = localStorage.getItem(CMS_KEYS.VERSIONS);
            if (!raw) return [];
            return JSON.parse(raw);
        } catch { return (typeof DEFAULT_PROJECTS !== 'undefined') ? DEFAULT_PROJECTS : []; }
    }

    restoreVersion(index) {
        const versions = this.getVersions();
        if (!versions[index]) return false;
        this.publish(versions[index].data);
        return true;
    }

    /* ── Projects ── */
    getProjects() {
        try {
            const raw = localStorage.getItem(CMS_KEYS.PROJECTS);
            if (raw === null) {
                if (typeof DEFAULT_PROJECTS !== 'undefined') {
                    try { localStorage.setItem(CMS_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS)); } catch(e){}
                    return DEFAULT_PROJECTS;
                }
                return [];
            }
            return JSON.parse(raw);
        } catch { return (typeof DEFAULT_PROJECTS !== 'undefined') ? DEFAULT_PROJECTS : []; }
    }

    saveProjects(projects) {
        if (this._safeSetItem(CMS_KEYS.PROJECTS, JSON.stringify(projects))) {
            this._safeSetItem(CMS_KEYS.PROJ_UPDATED, Date.now().toString());
            window.dispatchEvent(new Event('projectsUpdated'));
            return true;
        }
        return false;
    }

    upsertProject(project) {
        const projects = this.getProjects();
        const idx = projects.findIndex(p => p.id === project.id);
        if (idx >= 0) {
            projects[idx] = project;
        } else {
            projects.push(project);
        }
        this.saveProjects(projects);
    }

    deleteProject(id) {
        const projects = this.getProjects().filter(p => p.id !== id);
        this.saveProjects(projects);
    }

    /* ── Global Settings ── */
    getSettings() {
        try {
            const raw = localStorage.getItem(CMS_KEYS.SETTINGS);
            if (!raw) return { ...DEFAULT_SETTINGS };
            return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
        } catch { return { ...DEFAULT_SETTINGS }; }
    }

    saveSettings(settings) {
        if (this._safeSetItem(CMS_KEYS.SETTINGS, JSON.stringify(settings))) {
            window.dispatchEvent(new Event('settingsUpdated'));
            return true;
        }
        return false;
    }

    /* ── Media Library ── */
    getMedia() {
        try {
            const raw = localStorage.getItem(CMS_KEYS.MEDIA);
            if (!raw) return [];
            return JSON.parse(raw);
        } catch { return (typeof DEFAULT_PROJECTS !== 'undefined') ? DEFAULT_PROJECTS : []; }
    }

    addMedia(item) {
        // item: { id, name, type, folder, dataUrl, size, addedAt }
        const media = this.getMedia();
        media.unshift(item);
        if (this._safeSetItem(CMS_KEYS.MEDIA, JSON.stringify(media))) {
            return item;
        }
        return null;
    }

    deleteMedia(id) {
        const media = this.getMedia().filter(m => m.id !== id);
        this._safeSetItem(CMS_KEYS.MEDIA, JSON.stringify(media));
    }

    getMediaFolders() {
        const media = this.getMedia();
        const folders = [...new Set(media.map(m => m.folder || 'General'))];
        return folders.length ? folders : ['General'];
    }

    /* ── Storage Stats ── */
    getStorageUsage() {
        let total = 0;
        for (const key of Object.values(CMS_KEYS)) {
            const val = localStorage.getItem(key);
            if (val) total += val.length * 2; // UTF-16
        }
        return {
            bytes: total,
            kb: (total / 1024).toFixed(1),
            mb: (total / 1024 / 1024).toFixed(2),
            percent: ((total / (5 * 1024 * 1024)) * 100).toFixed(1)
        };
    }
}

/* ── Auto-Save Utility ── */
class AutoSave {
    constructor(store, delay = 3000) {
        this.store = store;
        this.delay = delay;
        this._timer = null;
        this._indicator = null;
    }

    trigger(getData) {
        clearTimeout(this._timer);
        this._showIndicator('Saving draft…');
        this._timer = setTimeout(() => {
            const data = getData();
            this.store.saveDraft(data);
            this._showIndicator('Draft saved ✓');
            setTimeout(() => this._hideIndicator(), 2000);
        }, this.delay);
    }

    _showIndicator(msg) {
        if (!this._indicator) {
            this._indicator = document.createElement('div');
            this._indicator.id = 'cms-autosave-indicator';
            this._indicator.style.cssText = `
                position:fixed; bottom:1.5rem; right:1.5rem;
                background:rgba(20,20,20,0.95); color:#c9a96e;
                font-family:'Inter',sans-serif; font-size:0.7rem;
                padding:0.5rem 1rem; border-radius:4px; z-index:99999;
                border:1px solid rgba(201,169,110,0.3); letter-spacing:0.05em;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(this._indicator);
        }
        this._indicator.textContent = msg;
        this._indicator.style.opacity = '1';
    }

    _hideIndicator() {
        if (this._indicator) {
            this._indicator.style.opacity = '0';
        }
    }
}

/* ── Image Compression + WebP Conversion ── */
// Returns: { dataUrl: string, originalSize: number, convertedSize: number, originalName: string }
function cmsCompressImage(file, maxDim = 1200, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const originalSize = file.size;
        const originalName = file.name;
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > maxDim || height > maxDim) {
                    if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
                    else { width = Math.round((width * maxDim) / height); height = maxDim; }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);

                // Convert to WebP if supported, fallback to JPEG
                const supportsWebP = canvas.toDataURL('image/webp').indexOf('image/webp') !== -1;
                const outputMime = supportsWebP ? 'image/webp' : 'image/jpeg';
                const dataUrl = canvas.toDataURL(outputMime, quality);

                // Calculate approximate converted size from base64
                const base64Data = dataUrl.split(',')[1] || '';
                const convertedSize = Math.round((base64Data.length * 3) / 4);

                resolve({ dataUrl, originalSize, convertedSize, originalName, format: supportsWebP ? 'WebP' : 'JPEG' });
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/* ── Helper: Format bytes to human readable ── */
function cmsFormatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/* ── Show WebP conversion toast in CMS ── */
function cmsShowConversionInfo(originalSize, convertedSize, format, targetEl) {
    const saved = originalSize - convertedSize;
    const pct = originalSize > 0 ? Math.round((saved / originalSize) * 100) : 0;
    const msg = `✅ Converted to ${format} · Before: ${cmsFormatBytes(originalSize)} → After: ${cmsFormatBytes(convertedSize)} (${pct > 0 ? '-' + pct + '%' : '+' + Math.abs(pct) + '%'} size)`;
    if (targetEl) {
        targetEl.textContent = msg;
        targetEl.style.display = 'block';
    }
    return msg;
}

window.cmsFormatBytes = cmsFormatBytes;
window.cmsShowConversionInfo = cmsShowConversionInfo;

/* ── Unique ID generator ── */
function cmsGenerateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── Universal "Direct Link" Converter ──
   Converts common share links (Google Drive, Dropbox, OneDrive, GitHub) into
   direct, embeddable/downloadable links. Returns the original string unchanged
   if no known pattern matches, so it's always safe to call on any URL. */
function cmsToDirectLink(url) {
    if (!url || typeof url !== 'string') return url;
    const original = url.trim();
    if (!original) return original;

    try {
        // ── Google Drive ──
        // Formats handled:
        //   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        //   https://drive.google.com/open?id=FILE_ID
        //   https://drive.google.com/uc?id=FILE_ID&export=download (already direct)
        let m = original.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (m) {
            return `https://drive.google.com/uc?export=download&id=${m[1]}`;
        }
        m = original.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
        if (m) {
            return `https://drive.google.com/uc?export=download&id=${m[1]}`;
        }
        m = original.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (m && original.includes('drive.google.com')) {
            return `https://drive.google.com/uc?export=download&id=${m[1]}`;
        }

        // ── Google Docs / Sheets / Slides (export as direct file) ──
        m = original.match(/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/);
        if (m) {
            const type = m[1];
            const id = m[2];
            const exportFormat = type === 'document' ? 'pdf' : (type === 'spreadsheets' ? 'xlsx' : 'pptx');
            return `https://docs.google.com/${type}/d/${id}/export?format=${exportFormat}`;
        }

        // ── Dropbox ──
        // https://www.dropbox.com/s/xxxx/file.pdf?dl=0  →  ?dl=1
        if (original.includes('dropbox.com')) {
            if (original.includes('dl=0')) return original.replace('dl=0', 'dl=1');
            if (!original.includes('dl=1')) {
                return original + (original.includes('?') ? '&dl=1' : '?dl=1');
            }
            return original;
        }

        // ── OneDrive / SharePoint ──
        // share links generally need &download=1 appended
        if (original.includes('1drv.ms') || original.includes('onedrive.live.com') || original.includes('sharepoint.com')) {
            if (!original.includes('download=1')) {
                return original + (original.includes('?') ? '&download=1' : '?download=1');
            }
            return original;
        }

        // ── GitHub (blob → raw) ──
        m = original.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/(.+)/);
        if (m) {
            return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}`;
        }

        // No known pattern — return as-is (might already be a direct link)
        return original;
    } catch (e) {
        console.error('cmsToDirectLink error:', e);
        return original;
    }
}

/* ── Detects if a URL is a known "share page" link (not yet direct) ──
   Useful for showing a small UI hint like "Converted to direct link" */
function cmsIsShareLink(url) {
    if (!url) return false;
    return /drive\.google\.com\/(file|open)|docs\.google\.com\/(document|spreadsheets|presentation)|dropbox\.com.*dl=0|1drv\.ms|onedrive\.live\.com|sharepoint\.com|github\.com\/.+\/blob\//.test(url);
}

window.cmsToDirectLink = cmsToDirectLink;
window.cmsIsShareLink = cmsIsShareLink;

/* ── Global singleton ── */
const CMS = new CMSStore();
const CMS_AUTOSAVE = new AutoSave(CMS);

/* ── Expose to window ── */
window.CMS = CMS;
window.CMS_AUTOSAVE = CMS_AUTOSAVE;
window.cmsCompressImage = cmsCompressImage;
window.cmsGenerateId = cmsGenerateId;








