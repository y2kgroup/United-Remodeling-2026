const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html' && file !== 'about.html') {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // Apply a beautiful glass-blur upscaling mask to AI Images spanning 100vw displays
        content = content.replace(/class="w-full h-full object-cover"/g, 'class="w-full h-full object-cover blur-[4px] scale-105 opacity-80"');
        
        if (content !== fs.readFileSync(path.join(dir, file), 'utf8')) {
            fs.writeFileSync(path.join(dir, file), content);
            console.log(`Upgraded high-end ambient hero filter for ${file}`);
            count++;
        }
    }
});
console.log(`Ambient image improvements pushed to ${count} service landing pages.`);
