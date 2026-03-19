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

    // 1. Upgrade Section Background to absolute dark-mode with dual ambient orbs seamlessly radiating primary brand colors
    content = content.replace(
        /<section class="relative w-full min-h-\[50vh\] flex items-center bg-slate-50 dark:bg-background-dark pt-32 pb-12 lg:pt-40 lg:pb-20 border-b border-slate-200 dark:border-slate-800">\s*<div class="container/,
        `<section class="relative w-full min-h-[50vh] flex items-center bg-slate-900 pt-32 pb-12 lg:pt-40 lg:pb-20 border-b border-slate-800 overflow-hidden">
        <!-- Subtle Gradient Glows -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div class="absolute -top-[40%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-[#f68712]/20 blur-[100px]"></div>
            <div class="absolute -bottom-[40%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-primary/20 blur-[100px]"></div>
        </div>
        <div class="container`
    );

    // 2. Force H1 Text White natively (overriding lightmode toggle logic for this specific immersive banner)
    content = content.replace(/text-slate-900 dark:text-white tracking-tight leading-tight/g, 
        'text-white tracking-tight leading-tight drop-shadow-lg');

    // 3. Force Paragraph Text Light Slate natively
    content = content.replace(/text-slate-600 dark:text-slate-400 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed pt-4 pb-2/g,
        'text-slate-300 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed pt-4 pb-2 drop-shadow-md');

    // Remove any straggler 'text-slate-900 dark:text-white' from dynamically injected H1s just in case
    content = content.replace(/text-slate-900 dark:text-white/g, 'text-white');

    if (content !== fs.readFileSync(path.join(dir, file), 'utf8')) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log(`Executed majestic brand-gradient pop overlay styling for ${file}`);
        count++;
    }
});
console.log(`Successfully elevated visual prestige across ${count} templates utilizing glowing dynamic gradients.`);
