const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(targetFile, 'utf8');

const servicesMap = {
    "Landscape Design": "landscape-design.html",
    "Landscape Flowers": "landscape-flowers.html",
    "Turf Installation": "turf-installation.html",
    "Landscape Lighting": "landscape-lighting.html",
    "Hardscaping & Stones": "hardscaping-stones.html",
    "Retaining Walls": "retaining-walls.html",
    "Concrete Patios": "concrete-patios.html",
    "Custom Driveways": "custom-driveways.html",
    "Wooden Pergolas": "wooden-pergolas.html",
    "Stone Pathways": "stone-pathways.html"
};

let modifiedCount = 0;

// Hyper-strict capture groups preserving literal DOM node architecture
// $1 = <div class="relative h-56 w-full">\s*
// $2 = <img src="..." class="..." alt="...">
// $3 = "Alt Text" boundary check
// $4 = \s*</div>[\s\S]*?<h3 ...>
// $5 = "Title text inside H3"
// $6 = </h3>
const pattern = /(<div class="relative h-56 w-[100%]">|<div class="relative h-56 w-full">)(\s*)(<img src="[^"]+" class="[^"]+" alt="([^"]+)">)(\s*<\/div>[\s\S]*?<h3 class="text-xl font-medium text-slate-900 dark:text-white mb-3 tracking-tight font-serif">)(.*?)(<\/h3>)/g;

htmlContent = htmlContent.replace(pattern, (match, divOpen, spaces1, imgTag, altText, betweenTags, titleText, h3Close) => {
    let url = servicesMap[titleText.trim()];
    
    if (!url) {
        url = titleText.trim().toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') + '.html';
    }

    modifiedCount++;

    // Reconstruct the perfectly safe DOM tree!
    // We physically wrap the $3 (img tag) and $5 (Title text) inside A tags.
    // We leave $1, $4, and $6 completely chemically untouched, securing the parent DOM!
    return `${divOpen}${spaces1}<a href="./${url}" class="block w-full h-full overflow-hidden cursor-pointer group">${imgTag}</a>${betweenTags}<a href="./${url}" class="hover:text-primary transition-colors cursor-pointer">${titleText}</a>${h3Close}`;
});

if (modifiedCount > 0) {
    fs.writeFileSync(targetFile, htmlContent, 'utf8');
    console.log(`Successfully mapped ${modifiedCount} service elements to their respective hyper-links purely preserving DOM boundaries!`);
} else {
    console.log('Zero modifications executed. Regex might be misaligned.');
}
