
document.addEventListener('DOMContentLoaded', () => {
    // Nav Active State
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/index.html') || (href === '/' && currentPath === '/index.html')) {
            link.classList.add('font-bold', 'text-primary');
            link.classList.remove('font-medium');
        } else {
            link.classList.remove('font-bold', 'text-primary');
            link.classList.add('font-medium');
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const openBtn = document.getElementById('mobile-menu-open');
    const closeBtn = document.getElementById('mobile-menu-close');

    if (openBtn && closeBtn && mobileMenu) {
        openBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    // Services Swiper
    if (document.querySelector('.services-swiper')) {
        new Swiper('.services-swiper', {
            slidesPerView: 'auto',
            centeredSlides: true,
            loop: true,
            speed: 3000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            spaceBetween: 24,
            grabCursor: true,
            navigation: {
                nextEl: '.services-next',
                prevEl: '.services-prev',
            },
            breakpoints: {
                768: {
                    spaceBetween: 32,
                }
            }
        });
    }

    // Quote Modal Logic
    const quoteModal = document.getElementById('quote-modal');
    const quoteBtns = document.querySelectorAll('.open-quote-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (quoteModal) {
        const modalContent = quoteModal.querySelector('div');

        const openModal = () => {
            quoteModal.classList.remove('opacity-0', 'pointer-events-none');
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
            document.body.style.overflow = 'hidden';
            if (mobileMenu) mobileMenu.classList.add('hidden');
        };

        const closeModal = () => {
            quoteModal.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.add('scale-95');
            modalContent.classList.remove('scale-100');
            document.body.style.overflow = '';
        };

        if (quoteBtns) {
            quoteBtns.forEach(btn => btn.addEventListener('click', openModal));
        }
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

        quoteModal.addEventListener('click', (e) => {
            if (e.target === quoteModal) closeModal();
        });

        // Web3Forms Submission Logic for all forms
        const contactForms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');
        
        contactForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Find result div and submit button relative to THIS form
                let result = form.querySelector('[id^="form-result"]');
                let submitBtn = form.querySelector('button[type="submit"]');
                
                if (!result) return;
                
                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);
                
                result.classList.remove('hidden', 'text-green-600', 'text-red-500', 'dark:text-green-400', 'dark:text-red-400');
                result.classList.add('text-slate-600', 'dark:text-slate-400');
                result.innerHTML = "Sending request...";
                
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
                }

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let jsonResponse = await response.json();
                    if (response.status == 200) {
                        result.innerHTML = "Success! We will contact you soon.";
                        result.classList.remove('text-slate-600', 'dark:text-slate-400');
                        result.classList.add('text-green-600', 'dark:text-green-400');
                        form.reset();
                        setTimeout(() => {
                            if (typeof closeModal === 'function') closeModal();
                            result.classList.add('hidden');
                        }, 3000);
                    } else {
                        result.innerHTML = jsonResponse.message || "Something went wrong!";
                        result.classList.remove('text-slate-600', 'dark:text-slate-400');
                        result.classList.add('text-red-500', 'dark:text-red-400');
                    }
                })
                .catch(error => {
                    result.innerHTML = "Something went wrong!";
                    result.classList.remove('text-slate-600', 'dark:text-slate-400');
                    result.classList.add('text-red-500', 'dark:text-red-400');
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                    }
                });
            });
        });
    }

    // Privacy Modal Logic
    const privacyModal = document.getElementById('privacy-modal');
    const privacyLinks = document.querySelectorAll('.open-privacy-modal, #privacy-link');
    const closePrivacyBtn = document.getElementById('close-privacy-btn');
    const acceptPrivacyBtn = document.getElementById('accept-privacy-btn');

    if (privacyModal && privacyLinks.length > 0) {
        privacyLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                privacyModal.classList.remove('opacity-0', 'pointer-events-none');
                
                // Add minor entrance animation
                const content = privacyModal.querySelector('div');
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            });
        });

        const closePrivacy = () => {
            const content = privacyModal.querySelector('div');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => {
                privacyModal.classList.add('opacity-0', 'pointer-events-none');
            }, 100);
        };

        if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', closePrivacy);
        if (acceptPrivacyBtn) acceptPrivacyBtn.addEventListener('click', closePrivacy);
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closePrivacy();
        });
    }

});

// --- Interactive Before/After Sliders ---
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.comparison-slider');
    sliders.forEach(slider => {
        const range = slider.querySelector('.comparison-range');
        const beforeImg = slider.querySelector('.before-img');
        const line = slider.querySelector('.slider-line');
        
        const updateSlider = (val) => {
            beforeImg.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
            line.style.left = `${val}%`;
            if (range) range.value = val;
        };

        let isDragging = false;
        
        const dragSlider = (e) => {
            if (!isDragging) return;
            const rect = slider.getBoundingClientRect();
            // Fallback for touch vs mouse events
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            
            let percent = ((clientX - rect.left) / rect.width) * 100;
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            
            updateSlider(percent);
        };

        // Desktop Pointer Events
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            slider.style.cursor = 'ew-resize';
            dragSlider(e);
        });
        window.addEventListener('mouseup', () => {
            isDragging = false;
            slider.style.cursor = 'default';
        });
        window.addEventListener('mousemove', dragSlider);

        // Mobile Touch Events
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            dragSlider(e);
        }, {passive: true});
        
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (isDragging) {
                // Prevent vertical scroll while actively swiping the slider
                if (e.cancelable) e.preventDefault(); 
                dragSlider(e);
            }
        }, {passive: false});

        // Initialize Native Values
        if (range) {
            range.style.display = 'none'; // hide generic range input since we overlaid full pointer events
            updateSlider(range.value);
        }
    });
});


// --- Global Gallery Lightbox Physics ---
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
