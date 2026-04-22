const fs = require('fs');
const path = require('path');

const galleryPath = path.join(__dirname, 'gallery.html');
const mainjsPath = path.join(__dirname, 'main.js');

// 1. Inject the Next and Prev buttons natively into the Lightbox DOM Array
let galleryHtml = fs.readFileSync(galleryPath, 'utf8');

const navButtonsHtml = `
        <!-- Directional Navigation Arrows -->
        <button id="lightbox-prev" class="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 size-14 flex items-center justify-center bg-white/10 hover:bg-[#f68712] text-white rounded-full backdrop-blur transition-all duration-300 transform hover:scale-110 z-[110]">
            <span class="material-symbols-outlined text-3xl">chevron_left</span>
        </button>
        <button id="lightbox-next" class="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 size-14 flex items-center justify-center bg-white/10 hover:bg-[#f68712] text-white rounded-full backdrop-blur transition-all duration-300 transform hover:scale-110 z-[110]">
            <span class="material-symbols-outlined text-3xl">chevron_right</span>
        </button>
`;

// Insert the exact navigation buttons strictly alongside the close button container
if (!galleryHtml.includes('id="lightbox-prev"')) {
    const closeLocation = galleryHtml.indexOf('<!-- Modal Image Array Container -->');
    if (closeLocation !== -1) {
        galleryHtml = galleryHtml.slice(0, closeLocation) + navButtonsHtml + '\\n        ' + galleryHtml.slice(closeLocation);
        fs.writeFileSync(galleryPath, galleryHtml, 'utf8');
        console.log('Successfully injected Lightbox Nav Arrow DOM structure into gallery.html natively.');
    }
}

// 2. Eradicate the old Javascript hook and inject the Sequential array navigation script
let mainjsContent = fs.readFileSync(mainjsPath, 'utf8');
const oldJsBlockStart = mainjsContent.indexOf('// --- Global Gallery Lightbox Physics ---');

if (oldJsBlockStart !== -1) {
    mainjsContent = mainjsContent.slice(0, oldJsBlockStart); // completely severe the old logic payload
}

const advancedLightboxJS = `// --- Global Gallery Lightbox Physics ---
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const nextBtn = document.getElementById('lightbox-next');
    const prevBtn = document.getElementById('lightbox-prev');
    const triggers = Array.from(document.querySelectorAll('.lightbox-trigger')); // parse as true Array uniquely tracking current positioning

    let currentIndex = 0;

    if (lightbox && triggers.length > 0) {
        
        // Dynamic loading function explicitly targeting exact array indices
        const updateLightboxImage = (index) => {
            const trigger = triggers[index];
            const parentBox = trigger.closest('.relative.overflow-hidden');
            if (parentBox) {
                const imgNode = parentBox.querySelector('img');
                if (imgNode) {
                    // Extract precise SRC native to the grid box
                    const targetSrc = imgNode.getAttribute('src');
                    
                    // Simple snap effect to signify image transformation cleanly
                    lightboxImage.classList.add('opacity-0');
                    setTimeout(() => {
                        lightboxImage.setAttribute('src', targetSrc);
                        lightboxImage.classList.remove('opacity-0');
                    }, 150);
                }
            }
        };

        // Initialize array binds
        triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                currentIndex = index;
                updateLightboxImage(currentIndex);
                
                // Spawn sequential overlay sequence natively executing fade vectors
                lightbox.classList.remove('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    lightboxImage.classList.remove('scale-95', 'opacity-0');
                    lightboxImage.classList.add('scale-100');
                }, 50);
            });
        });

        const showNext = () => {
            currentIndex = (currentIndex + 1) % triggers.length;
            updateLightboxImage(currentIndex);
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + triggers.length) % triggers.length;
            updateLightboxImage(currentIndex);
        };

        if(nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
        if(prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

        const closeLightbox = () => {
            lightboxImage.classList.remove('scale-100');
            lightboxImage.classList.add('scale-95');
            setTimeout(() => {
                lightbox.classList.add('opacity-0', 'pointer-events-none');
            }, 50);
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            // Only trigger close if explicitly clicking the blurry background directly
            if (e.target === lightbox) closeLightbox();
        });

        // Universal keyboard routing hooks
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('pointer-events-none')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }
});
`;

fs.writeFileSync(mainjsPath, mainjsContent + advancedLightboxJS, 'utf8');
console.log('Successfully upgraded main.js sequentially with Next/Prev hardware navigation and array mapping globally!');
