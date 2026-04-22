const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const allFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

let successCount = 0;

allFiles.forEach(file => {
    const p = path.join(rootDir, file);
    let code = fs.readFileSync(p, 'utf8');

    // In the Desktop Header, Gallery does not exist yet.
    // The Mobile header might already have it, but we only target the Desktop header structure: `text-base`
    // We look for the exact line containing `href="./about.html"` in the `<nav...>` desktop block.

    // A flexible regex that catches the About link on desktop (which uses text-base, not text-lg)
    // We split on `<!-- Social Media, License, Quote Button -->` to restrict our search to the header only.
    const headerSplit = code.split('<!-- Social Media, License, Quote Button -->');
    
    if (headerSplit.length > 1) {
        let headerBlock = headerSplit[0];
        
        // Match the `About` anchor tag securely
        const aboutRegex = /(<a class="nav-link text-base[^>]*?href="\.\/about\.html">About<\/a>)/g;
        
        if (!headerBlock.includes('href="./gallery.html"')) {
            // It doesn't have Gallery in the desktop header yet!
            headerBlock = headerBlock.replace(aboutRegex, `<a class="nav-link text-base font-serif font-medium transition-colors hover:text-[#f68712]" href="./gallery.html">Gallery</a>\n$1`);
            
            // Rejoin the file
            code = headerBlock + '<!-- Social Media, License, Quote Button -->' + headerSplit[1];
            fs.writeFileSync(p, code, 'utf8');
            successCount++;
            console.log(`Pushed Gallery Desktop route to ${file}`);
        }
    }
});

console.log(`Desktop Header Sync Complete: ${successCount} files updated.`);
