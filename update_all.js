const fs = require('fs');
const path = require('path');

const allProjDir = 'all project';
const destAssetsDir = 'assets/projects';

// 1. Process Projects
let newProjects = [];
let dirs = fs.readdirSync(allProjDir);

for(let d of dirs) {
    let p = path.join(allProjDir, d);
    if(fs.statSync(p).isDirectory()) {
        let slug = d.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        let dest = path.join(destAssetsDir, slug);
        if(!fs.existsSync(dest)) {
            fs.mkdirSync(dest, {recursive:true});
        }
        
        let files = fs.readdirSync(p);
        let images = [];
        let bannerImage = '';
        let videoUrl = '';
        
        for(let f of files) {
            let srcPath = path.join(p, f);
            let destPath = path.join(dest, f);
            fs.copyFileSync(srcPath, destPath);
            
            let urlPath = 'assets/projects/' + slug + '/' + f;
            if (f.toLowerCase() === 'banner.mp4') {
                videoUrl = urlPath;
            } else if (f.toLowerCase() === 'banner.jpg' || f.toLowerCase() === 'banner.png') {
                bannerImage = urlPath;
            } else if (f.match(/\.(jpg|jpeg|png|mp4)$/i)) {
                images.push(urlPath);
            }
        }
        
        // Push to array
        newProjects.push({
            id: slug,
            title: d,
            subtitle: "Project Update",
            tags: "design, architecture, art",
            ctaLabel: "View Project",
            ctaHref: "project-detail.html?id=" + slug,
            bannerImage: bannerImage,
            videoUrl: videoUrl,
            images: images,
            isFeatured: false,
            order: 10
        });
    }
}

// Read old projects to inherit text fields (about, tags, etc.)
let pData = fs.readFileSync('js/projects-data.js', 'utf8');
let startIdx = pData.indexOf('const DEFAULT_PROJECTS = ') + 25;
let endIdx = pData.indexOf('];\n\nfunction getAllProjects()', startIdx) + 1;
let oldProjects = JSON.parse(pData.substring(startIdx, endIdx));

for(let np of newProjects) {
    let old = oldProjects.find(x => x.id === np.id || x.title.toLowerCase() === np.title.toLowerCase());
    if (old) {
        np.title = old.title;
        np.subtitle = old.subtitle || np.subtitle;
        np.tags = old.tags || np.tags;
        np.shortDescription = old.shortDescription || "";
        np.about = old.about || "";
        np.roles = old.roles || [];
        np.isFeatured = old.isFeatured || false;
        np.order = old.order || 10;
        
        // Preserve missing media if old had it (though we just overwrote folder, so whatever is in folder should win)
        if (!np.bannerImage) np.bannerImage = old.bannerImage;
        if (!np.videoUrl) np.videoUrl = old.videoUrl;
    }
}

let newJsonStr = JSON.stringify(newProjects, null, 4);
pData = pData.substring(0, startIdx) + newJsonStr + pData.substring(endIdx);
pData = pData.replace(/sandeep_projects_v\d+/g, 'sandeep_projects_v16');
fs.writeFileSync('js/projects-data.js', pData);

let cms = fs.readFileSync('js/cms-core.js', 'utf8');
cms = cms.replace(/sandeep_projects_v\d+/g, 'sandeep_projects_v16');
fs.writeFileSync('js/cms-core.js', cms);

let htmls = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for(let h of htmls) {
    let hc = fs.readFileSync(h, 'utf8');
    hc = hc.replace(/projects-data\.js\?v=\d+/g, 'projects-data.js?v=16');
    fs.writeFileSync(h, hc);
}

// 2. Process Gallery Images
let galDir = 'GALLERY IMAGES';
let galFiles = fs.readdirSync(galDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
let galPhotos = galFiles.map(f => {
    return { title: f.split('.')[0], url: 'GALLERY IMAGES/' + encodeURIComponent(f) };
});

let gHtml = fs.readFileSync('gallery.html', 'utf8');
let gStart = gHtml.indexOf('const GALLERY_PHOTOS = [');
let gEnd = gHtml.indexOf('];', gStart) + 2;

let newGStr = 'const GALLERY_PHOTOS = ' + JSON.stringify(galPhotos, null, 4) + ';';
gHtml = gHtml.substring(0, gStart) + newGStr + gHtml.substring(gEnd);
fs.writeFileSync('gallery.html', gHtml);

console.log('Success');
