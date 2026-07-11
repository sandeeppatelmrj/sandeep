const fs = require('fs');

let content = fs.readFileSync('js/projects-data.js', 'utf8');

// Extract the DEFAULT_PROJECTS array
const startIndex = content.indexOf('const DEFAULT_PROJECTS = [') + 25;
const endIndex = content.indexOf('];\n\nfunction getAllProjects()', startIndex) + 1;
const jsonStr = content.substring(startIndex, endIndex);

let projects = JSON.parse(jsonStr);

// Delete the requested projects
const toDelete = ['future-india', 'chrono-story', 'mercedes-eqc', 'national-archive-museum'];
projects = projects.filter(p => !toDelete.includes(p.id));

// Add Amber Fort
projects.push({
    id: 'amber-fort',
    title: 'Amber Fort Light Spectacular',
    subtitle: 'Projection Mapping & Light Show',
    tags: 'projection, mapping, light, architecture, historic',
    shortDescription: 'A magnificent light and sound spectacular projected onto the historic Amber Fort.',
    about: 'We created an immersive light and sound experience that brings the rich history of Amber Fort to life through stunning projection mapping.',
    roles: ['Creative Direction', 'Visual Design', 'Projection Mapping'],
    ctaLabel: 'View Case Study',
    ctaHref: 'project-detail.html?id=amber-fort',
    bannerImage: 'assets/projects/amber-fort/Amber_Fort_L&S_Show_Oct_16_2025-22.jpg',
    videoUrl: 'assets/projects/amber-fort/banner.mp4',
    isFeatured: true,
    order: 5,
    images: [
        'assets/projects/amber-fort/Amber Fort_Projection Mapping (1).mp4',
        'assets/projects/amber-fort/Amber_Fort_L&S_Show_Oct_16_2025-22.jpg',
        'assets/projects/amber-fort/Amber_Fort_L&S_Show_Oct_16_2025-23.jpg',
        'assets/projects/amber-fort/Amber_Fort_L&S_Show_Oct_16_2025-24.jpg',
        'assets/projects/amber-fort/Amber_Fort_L&S_Show_Oct_16_2025-25.jpg'
    ]
});

const newJsonStr = JSON.stringify(projects, null, 4);
content = content.substring(0, startIndex) + newJsonStr + content.substring(endIndex);

// Bump version
content = content.replace(/sandeep_projects_v10/g, 'sandeep_projects_v11');

fs.writeFileSync('js/projects-data.js', content, 'utf8');
console.log('Successfully updated projects-data.js');
