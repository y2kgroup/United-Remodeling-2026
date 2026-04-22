const fs = require('fs');
const path = require('path');
const dir = __dirname;
let countHeader = 0;
let countButton = 0;

// 1. Extract the perfect, completely updated Header from index.html
const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const headerMatch = indexHtml.match(/<header[^>]*>[\s\S]*?<\/header>/);
if (!headerMatch) {
    console.error("Failed to extract Header from index.html");
    process.exit(1);
}
const unifiedHeader = headerMatch[0];

// 2. Erase the extra "Get a Free Estimate" button from the Service Side-by-Side Hero
const extraButtonRegex = /<button class="open-quote-modal[^>]*>.*?Get a Free Estimate[^<]*<\/button>/g;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html') {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // Sync Header
        const targetHeaderMatch = content.match(/<header[^>]*>[\s\S]*?<\/header>/);
        if (targetHeaderMatch) {
            content = content.replace(targetHeaderMatch[0], unifiedHeader);
            console.log(`Synced header logic for ${file}`);
            countHeader++;
        }

        // Wipe extraneous CTA Button inside the Hero Section strictly on the 10 bespoke AI Service Pages
        if (file.includes('landscape-design') || file.includes('concrete-patios') || file.includes('custom-driveways') || 
            file.includes('hardscaping') || file.includes('landscape-flowers') || file.includes('landscape-lighting') ||
            file.includes('retaining-walls') || file.includes('stone-pathways') || file.includes('turf-installation') || 
            file.includes('wooden-pergolas')) {
            
            // Cut precisely at the Content Block divider
            const splitHero = content.split('<!-- Content Block -->');
            if (splitHero.length > 1) {
                let heroHTML = splitHero[0];
                const originalHero = heroHTML;
                heroHTML = heroHTML.replace(extraButtonRegex, '');
                if (heroHTML !== originalHero) {
                    console.log(`Successfully truncated duplicate CTA for ${file}`);
                    countButton++;
                }
                splitHero[0] = heroHTML;
                content = splitHero.join('<!-- Content Block -->');
            }
        }

        fs.writeFileSync(path.join(dir, file), content);
    }
});

console.log(`Globally synced ${countHeader} headers and pruned ${countButton} artifact buttons.`);
