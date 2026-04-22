const fs = require('fs');
const path = require('path');

const galleryPath = path.join(__dirname, 'gallery.html');
const mainjsPath = path.join(__dirname, 'main.js');

// 1. Rewrite Gallery Grid Elements dynamically to act as Lightbox Triggers
let galleryHtml = fs.readFileSync(galleryPath, 'utf8');

// The original grid layout
const originalHook = `pointer-events-none flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100`;

// Removing pointer-events-none from the hover, and adding a specific class to trigger the Lightbox
const updatedHook = `cursor-pointer flex items-center justify-center lightbox-trigger">
                <span class="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100`;

if (galleryHtml.includes(originalHook)) {
    galleryHtml = galleryHtml.split(originalHook).join(updatedHook);
}

// 2. Inject the generic Lightbox DOM node into the footer payload so it renders universally
const lightboxDOM = `

    <!-- Global Full-Screen Image Lightbox -->
    <div id="gallery-lightbox" class="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
        <!-- Close Button -->
        <button id="lightbox-close" class="absolute top-6 right-6 lg:top-10 lg:right-10 size-12 flex items-center justify-center bg-white/10 hover:bg-[#f68712] text-white rounded-full backdrop-blur transition-colors duration-300">
            <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        
        <!-- Modal Image Array Container -->
        <div class="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <img id="lightbox-image" src="" class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transform scale-95 transition-transform duration-300" alt="Full Screen Project Preview">
        </div>
    </div>
`;

// Insert the Lightbox precisely before the closing </main> or </body> tag
if (!galleryHtml.includes('id="gallery-lightbox"')) {
    if (galleryHtml.includes('</main>')) {
        galleryHtml = galleryHtml.replace('</main>', `${lightboxDOM}\n</main>`);
    } else {
        galleryHtml = galleryHtml.replace('</body>', `${lightboxDOM}\n</body>`);
    }
}

fs.writeFileSync(galleryPath, galleryHtml, 'utf8');
console.log('gallery.html AST successfully updated with Lightbox layout layers natively!');

// 3. Inject native interaction mechanics securely into main.js
let mainjsContent = fs.readFileSync(mainjsPath, 'utf8');

const lightboxJS = `
// --- Global Gallery Lightbox Physics ---
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox && triggers.length > 0) {
        // Open Lightbox
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                // Ascend to the parent container and find the target image source
                const parentBox = trigger.closest('.relative.overflow-hidden');
                if (parentBox) {
                    const imgNode = parentBox.querySelector('img');
                    if (imgNode) {
                        const targetSrc = imgNode.getAttribute('src');
                        lightboxImage.setAttribute('src', targetSrc);
                        
                        // Fade in logic natively executing scale animation
                        lightbox.classList.remove('opacity-0', 'pointer-events-none');
                        setTimeout(() => {
                            lightboxImage.classList.remove('scale-95');
                            lightboxImage.classList.add('scale-100');
                        }, 50);
                    }
                }
            });
        });

        // Close logic sequence securely encapsulating transitions
        const closeLightbox = () => {
            lightboxImage.classList.remove('scale-100');
            lightboxImage.classList.add('scale-95');
            setTimeout(() => {
                lightbox.classList.add('opacity-0', 'pointer-events-none');
            }, 50);
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('pointer-events-none')) {
                closeLightbox();
            }
        });
    }
});
`;

if (!mainjsContent.includes('Global Gallery Lightbox Physics')) {
    fs.writeFileSync(mainjsPath, mainjsContent + '\n' + lightboxJS, 'utf8');
    console.log('main.js natively configured to execute Lightbox DOM clicks globally!');
} else {
    console.log('Lightbox JS hook already heavily embedded in main.js.');
}
