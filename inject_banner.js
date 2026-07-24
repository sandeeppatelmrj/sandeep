const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const funcs = `
let photoHeroBannerUrl = '';

function loadPhotoHeroBanner() {
    const data = CMS.getSiteData();
    document.getElementById('photoHeroTitle').value = data.photography_hero_title || '';
    document.getElementById('photoHeroSubtitle').value = data.photography_hero_subtitle || '';
    const banner = data.photography_hero_banner || '';
    document.getElementById('photoHeroUrlInput').value = banner.startsWith('data:') ? '' : banner;
    if (banner) {
        photoHeroBannerUrl = banner;
    } else {
        photoHeroBannerUrl = '';
    }
    renderPhotoHeroPreview();
}

function savePhotoHeroBanner() {
    const title = document.getElementById('photoHeroTitle').value.trim();
    const subtitle = document.getElementById('photoHeroSubtitle').value.trim();
    const inputUrl = document.getElementById('photoHeroUrlInput').value.trim();
    
    let finalUrl = photoHeroBannerUrl;
    if (inputUrl) {
        finalUrl = resolveDirectMediaUrl(inputUrl);
    }
    
    const data = CMS.getSiteData();
    data.photography_hero_title = title;
    data.photography_hero_subtitle = subtitle;
    data.photography_hero_banner = finalUrl;
    
    try {
        localStorage.setItem(CMS_KEYS.LIVE_DATA, JSON.stringify(data));
        toast('Photography Hero Banner saved', 'success');
        if (typeof CMS.trigger === 'function') {
            CMS.trigger(() => data);
        }
    } catch(e) {
        toast('Failed to save Hero Banner (Quota Exceeded)', 'error');
    }
}

function renderPhotoHeroPreview() {
    const prev = document.getElementById('photoHeroPreview');
    const inputUrl = document.getElementById('photoHeroUrlInput').value.trim();
    let src = inputUrl ? resolveDirectMediaUrl(inputUrl) : photoHeroBannerUrl;
    
    if (!src) {
        prev.style.display = 'none';
        prev.innerHTML = '';
        return;
    }
    prev.style.display = 'block';
    if (src.includes('.mp4') || src.startsWith('data:video')) {
        prev.innerHTML = '<video src="' + src + '" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>';
    } else if (src.includes('youtube.com') || src.includes('player.vimeo.com') || src.includes('/preview')) {
        prev.innerHTML = '<iframe src="' + src + '" style="width:100%;height:100%;border:none;"></iframe>';
    } else {
        prev.innerHTML = '<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;">';
    }
}

async function handlePhotoHeroUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const result = await cmsConvertToWebp(file, 1920, 0.85);
        photoHeroBannerUrl = result.dataUrl;
        document.getElementById('photoHeroUrlInput').value = '';
        renderPhotoHeroPreview();
        toast('File compressed and ready to save', 'success');
    } catch (err) {
        toast('Failed to load image', 'error');
        console.error(err);
    }
}
`;

html = html.replace('function renderPhotographyList() {', funcs + '\nfunction renderPhotographyList() {');
fs.writeFileSync('admin.html', html);
console.log('Injected Photo Hero Banner functions into admin.html');
