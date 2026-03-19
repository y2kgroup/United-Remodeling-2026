const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const galleryPath = path.join(rootDir, 'gallery.html');
const indexPath = path.join(rootDir, 'index.html');
const aboutPath = path.join(rootDir, 'about.html');
const uploadsGalleryDir = path.join(rootDir, 'Uploads', 'gallery');

// Safely generate the list of explicitly mapped .jpg screenshots
let galleryImages = [];
try {
    const files = fs.readdirSync(uploadsGalleryDir);
    galleryImages = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpeg'));
} catch (err) {
    console.error('Failed to read Uploads/gallery:', err);
    process.exit(1);
}

// 1. Extract the Header and Footer wrappers natively from about.html
const aboutHtml = fs.readFileSync(aboutPath, 'utf8');

// Extract from top of document down to </header> (and Mobile Menu Overlay)
const topBoundary = aboutHtml.indexOf('<!-- Main Content -->');
const headAndNav = topBoundary !== -1 ? aboutHtml.slice(0, topBoundary + 21) : '';

const footerBoundary = aboutHtml.indexOf('<footer');
const footerAndScripts = footerBoundary !== -1 ? aboutHtml.slice(footerBoundary) : '';

// 2. Extract the Before & After Module natively from index.html (guaranteeing exact CSS symmetry)
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const beforeAfterStart = indexHtml.indexOf('<!-- Before & After Comparison Showcase -->');
const beforeAfterEnd = indexHtml.indexOf('<!-- Why Choose Us Banner -->');

let beforeAfterBlock = '';
if (beforeAfterStart !== -1 && beforeAfterEnd !== -1) {
    beforeAfterBlock = indexHtml.slice(beforeAfterStart, beforeAfterEnd);
} else {
    console.error('Warning: Before/After Hook not found in index.html, skipping module extraction.');
}

// 3. Assemble the CSS Masonry Layout
const masonryImagesLayout = galleryImages.map(img => {
    // encode URI specifically to handle spaces inside the filenames
    const encodedUri = encodeURI(`Uploads/gallery/${img}`);
    return `
        <div class="relative overflow-hidden rounded-2xl shadow-md group border border-slate-200 dark:border-slate-800 break-inside-avoid">
            <img src="./${encodedUri}" loading="lazy" class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" alt="Project Portfolio Snapshot">
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">zoom_in</span>
            </div>
        </div>
    `;
}).join('');

const masonrySection = `
    <!-- Massive Photo Gallery Portfolio -->
    <section class="max-w-[90rem] mx-auto px-6 py-20 bg-slate-50 dark:bg-background-dark">
        <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white tracking-tight">Complete Project <span class="italic text-[#f68712] font-light">Portfolio</span></h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto">Explore over 50 pristine visualizations covering structural framing, landscape engineering, and custom concrete assemblies natively captured on the job site.</p>
        </div>

        <!-- Pure CSS Masonry Grid Container -->
        <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            ${masonryImagesLayout}
        </div>
    </section>
`;

// 4. Subpage Custom Hero Assembly
const heroSection = `
    <!-- Subpage Hero -->
    <section class="relative w-full min-h-[40vh] flex flex-col items-center justify-center bg-slate-900 pt-32 pb-20 border-b border-slate-800 overflow-hidden">
        <!-- Subtle Glow Geometry -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div class="absolute -top-[40%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-[#f68712]/20 blur-[100px]"></div>
            <div class="absolute -bottom-[40%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-primary/20 blur-[100px]"></div>
        </div>
        
        <div class="relative z-20 text-center px-6">
            <span class="text-[#f68712] font-bold tracking-widest text-sm uppercase block mb-4">Our Finest Work</span>
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-white tracking-tight drop-shadow-2xl">
                Global <span class="italic text-primary font-light">Gallery</span>
            </h1>
        </div>
    </section>
`;

// 5. Structure the complete gallery.html
let globalGalleryHtml = headAndNav + 
    '\\n<main class="flex-1 w-full bg-white dark:bg-background-dark">\\n' + 
    heroSection + 
    '\\n<!-- Extracted Architecture Component -->\\n' + 
    beforeAfterBlock + 
    masonrySection + 
    '\\n</main>\\n' + 
    footerAndScripts;

// Fix document titles
globalGalleryHtml = globalGalleryHtml.replace(/<title>.*?<\/title>/, '<title>Global Portfolio Gallery | United Remodeling Landscaping</title>');

fs.writeFileSync(galleryPath, globalGalleryHtml, 'utf8');
console.log('Successfully Compiled gallery.html spanning 50 dynamic local image containers natively.');

// 6. Global Navigation Push Script
// We iterate over all HTML files in the immediate root directory.
const allFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

allFiles.forEach(file => {
    const p = path.join(rootDir, file);
    let code = fs.readFileSync(p, 'utf8');
    let changed = false;

    // Desktop Nav Hooks
    const targetNav = /<a class="nav-link text-lg font-serif font-medium hover:text-\[#f68712\] transition-colors text-slate-900 dark:text-slate-100" href="\.\/about\.html">About<\/a>/g;
    const replacementStr = `<a class="nav-link text-lg font-serif font-medium hover:text-[#f68712] transition-colors text-slate-900 dark:text-slate-100" href="./gallery.html">Gallery</a>\n            <a class="nav-link text-lg font-serif font-medium hover:text-[#f68712] transition-colors text-slate-900 dark:text-slate-100" href="./about.html">About</a>`;
    
    // Inject the Gallery link right before the About element if it isn't already there!
    if (code.includes('href="./gallery.html"') === false) {
        if (code.match(targetNav)) {
            code = code.replace(targetNav, replacementStr);
            changed = true;
        }
    }
    
    if (changed) {
        fs.writeFileSync(p, code, 'utf8');
        console.log(`[Routed] ${file} synchronized with Gallery hyper-link payload.`);
    }
});

console.log('Execution Global Rewrite Terminated Successfully.');
