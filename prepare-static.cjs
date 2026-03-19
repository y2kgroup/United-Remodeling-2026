const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

const swiperCssCdn = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>';
const swiperJsCdn = '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>\n<script src="./main.js"></script>';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // 1. Fix absolute paths to explicit relative sub-references
        content = content.replace(/href="\/style\.css"/g, 'href="./style.css"');
        content = content.replace(/src="\/main\.js"/g, 'src="./main.js"');
        content = content.replace(/src="\/images\//g, 'src="./images/');
        content = content.replace(/src="\/uploads\//gi, 'src="./Uploads/'); // Fixes casing mapping automatically
        content = content.replace(/href="\/([a-zA-Z0-9-]+\.html)"/g, 'href="./$1"');
        content = content.replace(/href="\/"/g, 'href="./index.html"');

        // 2. Add Swiper HTML CDN references if they don't exist
        if (!content.includes('swiper-bundle.min.css')) {
            content = content.replace('</head>', `    ${swiperCssCdn}\n</head>`);
        }
        
        // 3. Replace module execution with raw CDN plus relative main.js
        content = content.replace(/<script type="module" src="\/?main\.js"><\/script>/g, swiperJsCdn);
        content = content.replace(/<script src="\/?main\.js"><\/script>/g, swiperJsCdn);
        
        // Clean up duplicate swiperJsCdn if doing subsequent runs
        if(content.split('<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>').length > 2) {
            content = content.replace('<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>\n', '');
        }

        fs.writeFileSync(path.join(dir, file), content);
        console.log(`Prepared static assets for ${file}`);
        count++;
    }
});

// Update main.js to remove Naked module imports which crash standalone browsers
const mainJsPath = path.join(dir, 'main.js');
let mainContent = fs.readFileSync(mainJsPath, 'utf8');
mainContent = mainContent.replace(/import Swiper from 'swiper\/bundle';\n/g, '');
mainContent = mainContent.replace(/import 'swiper\/css\/bundle';\n/g, '');
fs.writeFileSync(mainJsPath, mainContent);

console.log(`Mass rewrite completed across ${count} raw static views.`);
