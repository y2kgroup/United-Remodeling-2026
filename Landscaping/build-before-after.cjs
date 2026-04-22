const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(targetFile, 'utf8');

// Ensure we don't accidentally inject multiple times
if (htmlContent.includes('<!-- Before & After Comparison Showcase -->')) {
    console.log('Before & After section already exists. Removing legacy sequence for regeneration...');
    const start = htmlContent.indexOf('<!-- Before & After Comparison Showcase -->');
    const end = htmlContent.indexOf('<!-- Why Choose Us Banner -->');
    htmlContent = htmlContent.slice(0, start) + htmlContent.slice(end);
}

// Fixed payload pairs mapping exactly to the 8 specific images in the Uploads folder
const sliders = [
    {
        title: "Deck & Pergola Assembly",
        before: "./Uploads/Before and After/Before - An aging wooden deck transformed into a beautiful, multi-level deck covered by a striking white pergola..jpeg",
        after: "./Uploads/Before and After/After -An aging wooden deck transformed into a beautiful, multi-level deck covered by a striking white pergola..jpg"
    },
    {
        title: "Artificial Turf & Pathways",
        before: "./Uploads/Before and After/Before - An overgrown, patchy front yard transformed into a meticulously manicured landscape featuring vibrant artificial turf, clean pathways, and defined garden beds..jpeg",
        after: "./Uploads/Before and After/After - An overgrown, patchy front yard transformed into a meticulously manicured landscape featuring vibrant artificial turf, clean pathways, and defined garden beds..jpg"
    },
    {
        title: "Pristine Luxury Driveway",
        before: "./Uploads/Before and After/Before - Cracked driveway completely transformed into a pristine, modern.jpeg",
        after: "./Uploads/Before and After/After - Cracked driveway completely transformed into a pristine, modern.jpg"
    },
    {
        title: "Geometric Slab Slat Driveway",
        before: "./Uploads/Before and After/Before - cracked concrete driveway completely transformed into a sleek, modern entrance featuring large geometric slabs intersected by clean strips of grass..jpeg",
        after: "./Uploads/Before and After/After - cracked concrete driveway completely transformed into a sleek, modern entrance featuring large geometric slabs intersected by clean strips of grass..jpg"
    }
];

let itemsHtml = '';
sliders.forEach(slider => {
    // We strictly use absolute URI encoding since filenames have massive spaces and symbols natively
    const encodeURI = (url) => url.split('/').map(segment => encodeURIComponent(segment)).join('/').replace(/%2E/g, '.');

    itemsHtml += `
            <!-- Comparison Node -->
            <div class="flex flex-col gap-4">
                <div class="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl comparison-slider group border-4 border-white dark:border-slate-800 bg-slate-900">
                    
                    <!-- After Image (Base) -->
                    <img src="${slider.after}" class="absolute inset-0 w-full h-full object-cover pointer-events-none" alt="After Transformation">
                    
                    <!-- Before Image (Clip-Path Overlay) -->
                    <img src="${slider.before}" class="absolute inset-0 w-full h-full object-cover pointer-events-none before-img z-10" style="clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);" alt="Before Transformation">
                    
                    <!-- Dark Gradient Overlay for the labels -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <!-- Labels -->
                    <div class="absolute top-4 left-6 z-20 px-4 py-1.5 bg-slate-900/80 backdrop-blur text-white text-xs font-bold tracking-widest uppercase rounded-full border border-white/20 pointer-events-none transition-all duration-300 transform group-hover:-translate-y-1">Before</div>
                    <div class="absolute top-4 right-6 z-20 px-4 py-1.5 bg-[#f68712]/90 backdrop-blur text-white text-xs font-bold tracking-widest uppercase rounded-full border border-white/20 pointer-events-none transition-all duration-300 transform group-hover:-translate-y-1">After</div>

                    <!-- Slider Input Override -->
                    <input type="range" min="0" max="100" value="50" class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40 comparison-range m-0 outline-none">
                    
                    <!-- Slider Interface Handle -->
                    <div class="absolute top-0 bottom-0 left-[50%] w-1 bg-white z-30 pointer-events-none slider-line -translate-x-1/2 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#f68712] border-4 border-white transform transition-transform group-hover:scale-110">
                            <span class="material-symbols-outlined text-2xl font-bold">swap_horiz</span>
                        </div>
                    </div>
                </div>
            </div>`;
});


const payloadSection = `
    <!-- Before & After Comparison Showcase -->
    <section class="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200 dark:border-slate-800">
        <div class="text-center mb-16 relative">
            <h2 class="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white tracking-tight leading-tight">
                See The <span class="italic text-[#f68712] font-light">Transformation</span>
            </h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto">
                Drag the interactive sliders to reveal the breathtaking difference our premium landscape and hardscape installations bring to California homes.
            </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            ${itemsHtml}
        </div>
    </section>

    `;

// The injection point is explicitly before <!-- Why Choose Us Banner -->
const injectionHook = '<!-- Why Choose Us Banner -->';
if (htmlContent.includes(injectionHook)) {
    htmlContent = htmlContent.replace(injectionHook, payloadSection + injectionHook);
} else {
    console.error("Critical Failure: Injection hook missing!");
    process.exit(1);
}

fs.writeFileSync(targetFile, htmlContent, 'utf8');

// Additionally, we need to append the tiny block of Javascript into main.js uniquely to power the interactions
const mainjsTarget = path.join(__dirname, 'main.js');
let mainjsContent = fs.readFileSync(mainjsTarget, 'utf8');

const jsHook = '// --- Interactive Before/After Sliders ---';
if (!mainjsContent.includes(jsHook)) {
    const interactionScript = `
${jsHook}
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.comparison-slider');
    sliders.forEach(slider => {
        const range = slider.querySelector('.comparison-range');
        const beforeImg = slider.querySelector('.before-img');
        const line = slider.querySelector('.slider-line');
        const updateSlider = (val) => {
            beforeImg.style.clipPath = \`polygon(0 0, \${val}% 0, \${val}% 100%, 0 100%)\`;
            line.style.left = \`\${val}%\`;
        };
        range.addEventListener('input', (e) => updateSlider(e.target.value));
        // Also support tapping on mobile
        range.addEventListener('change', (e) => updateSlider(e.target.value));
    });
});
`;
    fs.writeFileSync(mainjsTarget, mainjsContent + '\\n' + interactionScript, 'utf8');
    console.log("Interactive JS Engine initialized in main.js");
}

console.log("Before/After Grid Assembly injected flawlessly!");
