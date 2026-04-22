const fs = require('fs');
const path = require('path');

const dir = __dirname;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Match the entire line containing href="/portfolio.html" (both desktop and mobile formats, also footer)
        const portfolioRegex = /^[^\n]*href="\/portfolio\.html"[^\n]*\n?/gm;
        
        const newContent = content.replace(portfolioRegex, '');
        
        if (content !== newContent) {
            fs.writeFileSync(path.join(dir, file), newContent);
            console.log(`Removed Portfolio from ${file}`);
        }
    }
});
console.log('Portfolio removal complete.');
