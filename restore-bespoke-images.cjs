const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

const imageMap = {
    'concrete-patios.html': 'concrete_patio.png',
    'custom-driveways.html': 'custom_driveway.png',
    'hardscaping-stones.html': 'hardscaping.png',
    'landscape-design.html': 'landscape_design.png',
    'landscape-flowers.html': 'flower_beds.png',
    'landscape-lighting.html': 'outdoor_lighting.png',
    'retaining-walls.html': 'retaining_wall.png',
    'services.html': '../Uploads/services_collage_bg.png', // special
    'stone-pathways.html': 'walkways.png',
    'turf-installation.html': 'turf_installation.png',
    'wooden-pergolas.html': 'pergola_installation.png'
};

fs.readdirSync(dir).forEach(file => {
    if (imageMap[file]) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // Look for the single unified background image tag we injected earlier
        const targetImage = imageMap[file].includes('Uploads') 
            ? './Uploads/services_collage_bg.png' 
            : `./images/services/${imageMap[file]}`;

        // Swap out the universal Home Slider 1 image and remove the overly dark mix-blend-multiply CSS
        content = content.replace(
            /<img src="\.\/Uploads\/Home%20slider%201\.jpg" class="absolute inset-0 z-0 w-full h-full object-cover opacity-50 mix-blend-multiply" alt="([^"]+)">/g, 
            `<img src="${targetImage}" class="absolute inset-0 z-0 w-full h-full object-cover" alt="$1">`
        );
        content = content.replace(
            /<img src="\.\/Uploads\/Home%20slider%201\.jpg" class="w-full h-full object-cover" alt="([^"]+)">/g, 
            `<img src="${targetImage}" class="w-full h-full object-cover" alt="$1">`
        );
        
        // Find the overlay directly beneath the image and make sure it's just a clean 40% dark overlay for text contrast instead of completely solid black
        content = content.replace(/<div class="absolute inset-0 bg-slate-900\/60 mix-blend-multiply"><\/div>/g, '<div class="absolute inset-0 bg-slate-900/40"></div>');
        content = content.replace(/<div class="absolute inset-0 bg-slate-900\/60"><\/div>/g, '<div class="absolute inset-0 bg-slate-900/40"></div>');

        fs.writeFileSync(path.join(dir, file), content);
        console.log(`Restored unique background for ${file}`);
        count++;
    }
});
console.log(`Successfully mapped bespoke imagery to ${count} service pages.`);
