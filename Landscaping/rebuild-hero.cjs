const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

const servicePages = [
    'concrete-patios.html', 'custom-driveways.html', 'hardscaping-stones.html',
    'landscape-design.html', 'landscape-flowers.html', 'landscape-lighting.html',
    'retaining-walls.html', 'stone-pathways.html', 'turf-installation.html',
    'wooden-pergolas.html'
];

servicePages.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Extract the image source
    const imgMatch = content.match(/<img src="([^"]+)"/);
    if (!imgMatch) return;
    const imgSrc = imgMatch[1];

    // Extract the H1 block completely (handling multi-line)
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    let h1Content = h1Match ? h1Match[1].trim() : 'Premium Service';
    
    // Some h1Content might have 'text-white' spans, change them to dark mode compatible dynamic colors natively
    h1Content = h1Content.replace(/text-white/g, 'text-slate-900 dark:text-white');

    const newHero = `    <!-- Subpage Hero -->
    <section class="relative w-full min-h-[50vh] flex items-center bg-slate-50 dark:bg-background-dark pt-32 pb-12 lg:pt-40 lg:pb-20 border-b border-slate-200 dark:border-slate-800">
        <div class="container mx-auto px-6 relative z-20">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div class="space-y-6 text-center lg:text-left order-2 lg:order-1">
                    <span class="text-primary font-bold tracking-widest text-sm uppercase block">Premium Installation</span>
                    <h1 class="text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-slate-900 dark:text-white tracking-tight leading-tight">
                        ${h1Content}
                    </h1>
                    <p class="text-lg text-slate-600 dark:text-slate-400 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed pt-4 pb-2">
                        Experience the absolute finest quality in California. Our deeply experienced architects craft striking, enduring installations structurally optimized for lasting value.
                    </p>
                    <button class="open-quote-modal inline-flex min-w-[200px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-[#f68712] text-white text-base font-bold tracking-wide hover:shadow-[0_0_20px_rgba(246,135,18,0.5)] hover:-translate-y-1 transition-all">
                        Get a Free Estimate
                    </button>
                </div>
                <!-- Native Resolution Image Anchor -->
                <div class="relative w-full max-w-lg mx-auto aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl order-1 lg:order-2 border-8 border-white dark:border-slate-800 bg-slate-200">
                    <img src="${imgSrc}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Specialized Service View">
                </div>
            </div>
        </div>
    </section>`;

    // Replace everything between <!-- Subpage Hero --> and <!-- Content Block -->
    content = content.replace(/<!-- Subpage Hero -->[\s\S]*?<!-- Content Block -->/, newHero + '\n\n    <!-- Content Block -->');

    fs.writeFileSync(path.join(dir, file), content);
    console.log(`Re-architected native layout for ${file}`);
    count++;
});

console.log(`Successfully refactored ${count} hero templates utilizing 1:1 image boundaries.`);
