const fs = require('fs');
let pContent = fs.readFileSync('js/projects-data.js', 'utf8');

if (!pContent.includes('function getAllProjects')) {
    pContent += `

function getAllProjects() {
    if (typeof CMS !== 'undefined' && typeof CMS.getProjects === 'function') {
        return CMS.getProjects();
    }
    try {
        const raw = localStorage.getItem('sandeep_projects_v26');
        if (raw) return JSON.parse(raw);
    } catch(e) {}
    return typeof DEFAULT_PROJECTS !== 'undefined' ? DEFAULT_PROJECTS : [];
}
`;
    fs.writeFileSync('js/projects-data.js', pContent);
    console.log('Restored getAllProjects');
}
