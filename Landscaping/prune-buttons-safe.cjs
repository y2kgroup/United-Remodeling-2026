const fs = require('fs');
const path = require('path');
const dir = __dirname;
let countButton = 0;

const preciseButtonStrings = [
    `<button class="open-quote-modal inline-flex min-w-[200px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-[#f68712] text-white text-base font-bold tracking-wide hover:shadow-[0_0_20px_rgba(246,135,18,0.5)] hover:-translate-y-1 transition-all">\n                        Get a Free Estimate\n                    </button>`,
    `<button class="open-quote-modal inline-flex min-w-[200px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-[#f68712] text-white text-base font-bold tracking-wide hover:shadow-[0_0_20px_rgba(246,135,18,0.5)] hover:-translate-y-1 transition-all">\n                    Get a Free Estimate\n                </button>`
];

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html' && file !== 'services.html') {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        if (file.includes('landscape-design') || file.includes('concrete-patios') || file.includes('custom-driveways') || 
            file.includes('hardscaping') || file.includes('landscape-flowers') || file.includes('landscape-lighting') ||
            file.includes('retaining-walls') || file.includes('stone-pathways') || file.includes('turf-installation') || 
            file.includes('wooden-pergolas')) {
            
            const splitHero = content.split('<!-- Content Block -->');
            if (splitHero.length > 1) {
                let heroHTML = splitHero[0];
                const originalHero = heroHTML;
                preciseButtonStrings.forEach(btn => {
                    if (heroHTML.includes(btn)) {
                        heroHTML = heroHTML.replace(btn, '');
                    }
                });
                
                if (heroHTML !== originalHero) {
                    console.log(`Successfully truncated duplicate CTA for ${file}`);
                    countButton++;
                } else {
                    console.log(`Warning: Failed to match explicit string in ${file}. Executing precise Regex isolation...`);
                    // If tabs/spacing differ, we use a much safer Regex that does NOT span across nested tags
                    const safeRegex = /<button class="open-quote-modal[^>]*>\s*Get a Free Estimate\s*<\/button>/;
                    heroHTML = heroHTML.replace(safeRegex, '');
                    if (heroHTML !== originalHero) countButton++;
                }

                splitHero[0] = heroHTML;
                content = splitHero.join('<!-- Content Block -->');
            }
        }

        fs.writeFileSync(path.join(dir, file), content);
    }
});

console.log(`Pruned ${countButton} artifact buttons natively using explicitly scoped memory references.`);
