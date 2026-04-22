const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // 1. Inject Swiper CSS
        if (!content.includes('swiper-bundle.min.css')) {
            content = content.replace('</head>', '    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>\n</head>');
        }

        // 2. Remove blur
        content = content.replace(/blur-\[4px\] scale-105 opacity-80 /g, '');
        content = content.replace(/ blur-\[4px\] scale-105 opacity-80/g, '');

        if (file !== 'index.html' && file !== 'about.html') {
            // 3. Swap 1024x1024 AI backgrounds with native 4K optimized photography utilizing proper URL encoding %20
            content = content.replace(/<img src="\.\/images\/services\/[^"]+\.png"[^>]+alt="([^"]+)"[^>]*>/, '<img src="./Uploads/Home%20slider%201.jpg" class="absolute inset-0 z-0 w-full h-full object-cover opacity-50 mix-blend-multiply" alt="$1">');
            
            content = content.replace(/<img src="\.\/Uploads\/[^"]+\.(png|jpg)"[^>]*alt="([^"]*Background[^"]*)"[^>]*>/, '<img src="./Uploads/Home%20slider%201.jpg" class="w-full h-full object-cover" alt="Premium Hero Background">');
        }

        if (content !== fs.readFileSync(path.join(dir, file), 'utf8')) {
            fs.writeFileSync(path.join(dir, file), content);
            console.log(`Executed layout and asset upgrades for ${file}`);
            count++;
        }
    }
});
console.log(`Successfully restored Swiper engine and 4K hero assets across ${count} views.`);
