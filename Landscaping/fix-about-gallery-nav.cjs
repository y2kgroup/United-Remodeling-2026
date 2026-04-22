const fs = require('fs');
const path = require('path');

const targetFiles = ['about.html', 'gallery.html'];
const replacement = `<a class="nav-link text-lg font-serif font-medium hover:text-[#f68712] transition-colors text-slate-900 dark:text-slate-100" href="./gallery.html">Gallery</a>`;

targetFiles.forEach(file => {
    const p = path.join(__dirname, file);
    let code = fs.readFileSync(p, 'utf8');

    // Find the Services link (which is not active on these pages) and append Gallery right after it
    const servicesRegex = /(<a class="nav-link text-lg font-serif font-medium hover:text-\[#f68712\] transition-colors text-slate-900 dark:text-slate-100" href="\.\/services\.html">Services.*?<\/a>)/g;
    
    if (code.includes('href="./gallery.html"') === false) {
        code = code.replace(servicesRegex, `$1\n            ${replacement}`);
        fs.writeFileSync(p, code, 'utf8');
        console.log(`Successfully injected Gallery route natively into ${file}`);
    } else {
        console.log(`${file} already contains Gallery.`);
    }
});
