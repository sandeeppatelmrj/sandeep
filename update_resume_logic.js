const fs = require('fs');
let content = fs.readFileSync('js/site-loader.js', 'utf8');

const target = '    /* Element visibility */';
const insertion = `    /* Resume Download Button */
    const resumeBtn = document.getElementById('resumeDownloadBtn');
    if (resumeBtn) {
        if (data.home_about_resume_file && data.home_about_resume_file.length > 10) {
            resumeBtn.href = data.home_about_resume_file;
            resumeBtn.download = data.home_about_resume_filename || 'resume.pdf';
            resumeBtn.style.display = 'inline-flex';
        } else {
            resumeBtn.style.display = 'none';
        }
    }

`;

if (content.includes(target) && !content.includes('Resume Download Button')) {
    content = content.replace(target, insertion + target);
    fs.writeFileSync('js/site-loader.js', content);
    console.log('Resume logic added.');
} else {
    console.log('Target not found or already added.');
}
