const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

// 1. Fix services.html Landscape Design Image Path
const servicesHTMLPath = path.join(dir, 'services.html');
let servicesContent = fs.readFileSync(servicesHTMLPath, 'utf8');
servicesContent = servicesContent.replace(
    /<!-- 1: Landscape Design -->\s*<a href="\.\/landscape-design\.html" class="block group h-full relative p-1">\s*<div class="relative w-full aspect-\[4\/3\] rounded-2xl overflow-hidden mb-6">\s*<img src="\.\/Uploads\/services_collage_bg\.png"/g,
    `<!-- 1: Landscape Design -->
            <a href="./landscape-design.html" class="block group h-full relative p-1">
                <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                    <img src="./images/services/landscape_design.png"`
);
// Make an aggressive fallback fix just in case the above structure isn't perfectly spaced
servicesContent = servicesContent.replace(
    /<img src="[^"]*" class="absolute inset-0 z-0 w-full h-full object-cover" alt="Landscape Design">/,
    '<img src="./images/services/landscape_design.png" class="absolute inset-0 z-0 w-full h-full object-cover" alt="Landscape Design">'
);
servicesContent = servicesContent.replace(
    /<img src="[^"]*" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Landscape Design">/,
    '<img src="./images/services/landscape_design.png" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Landscape Design">'
);
fs.writeFileSync(servicesHTMLPath, servicesContent);
console.log('Successfully patched services.html Landscape Design thumbnail grid.');

// 2. Fix the body headings text globally inside the content chunk, and 3. Inject Favicon universally
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // Inject Favicon into `<head>` if not already present
        if (!content.includes('<link rel="icon"')) {
            content = content.replace(
                /<\/title>/,
                `</title>\n    <!-- Favicon -->\n    <link rel="icon" type="image/svg+xml" href="./Uploads/United%20Remodeling%20Logo.svg">`
            );
        }

        // Fix the body headings bleed ONLY if the file contains the <!-- Content Block --> architecture.
        if (content.includes('<!-- Content Block -->')) {
            const splitContent = content.split('<!-- Content Block -->');
            // The hero is in splitContent[0], the body is in splitContent[1]
            if (splitContent.length > 1) {
                // Restore headings text color in the body HTML
                let bodyContent = splitContent[1];
                bodyContent = bodyContent.replace(/text-3xl font-serif font-medium text-white/g, 'text-3xl font-serif font-medium text-slate-900 dark:text-white');
                bodyContent = bodyContent.replace(/text-2xl font-serif font-medium text-white/g, 'text-2xl font-serif font-medium text-slate-900 dark:text-white');
                
                // Ensure specifically the 'Bringing Your Vision to Life' and 'Our Process' headings are locked back to dark mode compat formatting natively
                bodyContent = bodyContent.replace(/<h2 class="[^"]*">Bringing Your Vision to Life<\/h2>/, '<h2 class="text-3xl font-serif font-medium text-slate-900 dark:text-white mb-6">Bringing Your Vision to Life</h2>');
                bodyContent = bodyContent.replace(/<h3 class="[^"]*">Our Process<\/h3>/, '<h3 class="text-2xl font-serif font-medium text-slate-900 dark:text-white mt-12 mb-4">Our Process</h3>');

                splitContent[1] = bodyContent;
                content = splitContent.join('<!-- Content Block -->');
            }
        }

        fs.writeFileSync(path.join(dir, file), content);
        count++;
    }
});
console.log(`Successfully restored lower-page heading contrasts and universally injected Favicons across ${count} web templates.`);
