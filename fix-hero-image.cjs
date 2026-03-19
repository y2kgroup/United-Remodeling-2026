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
    'stone-pathways.html': 'walkways.png',
    'turf-installation.html': 'turf_installation.png',
    'wooden-pergolas.html': 'pergola_installation.png'
};

fs.readdirSync(dir).forEach(file => {
    if (imageMap[file]) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // Swap out the wrongly-captured Logo parameter from the newly built hero card and re-inject the exact AI asset matching the specialized view natively
        content = content.replace(
            /<img src="\.\/Uploads\/United%20Remodeling%20Logo\.svg" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Specialized Service View">/g,
            `<img src="./images/services/${imageMap[file]}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Specialized Service View">`
        );

        if (content !== fs.readFileSync(path.join(dir, file), 'utf8')) {
            fs.writeFileSync(path.join(dir, file), content);
            console.log(`Secured correct AI asset topology for ${file}`);
            count++;
        }
    }
});
console.log(`Successfully restored crisp architectural renderings across ${count} service modules.`);
