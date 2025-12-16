document.addEventListener('DOMContentLoaded', () => {
    const heroH1 = document.querySelector('.hero-content h1');
    const heroP = document.querySelector('.hero-content p');
    const heroSection = document.querySelector('.hero');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const logoContainer = document.querySelector('.logo-container');

    // Reload page on logo click
    if (logoContainer) {
        logoContainer.addEventListener('click', () => {
            navLinks.classList.remove('active'); // Close menu if open (optional safety)
            window.scrollTo(0, 0); // Optional: scroll to top
            location.reload();
        });
    }

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Function to wrap individual letters in spans, GROUPED BY WORD
    function wrapContent(element) {
        const text = element.innerText;
        element.innerHTML = '';

        // Split by spaces to get words
        const words = text.split(' ');

        const allCharSpans = [];

        words.forEach((wordText, index) => {
            // Create a container for the word (keeps letters together)
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word-block');

            // Split word into chars
            const chars = wordText.split('');
            chars.forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.classList.add('char-span');
                charSpan.innerText = char;
                wordSpan.appendChild(charSpan);
                allCharSpans.push(charSpan);
            });

            element.appendChild(wordSpan);

            // Add space after word (except last one)
            if (index < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.innerHTML = '&nbsp;';
                spaceSpan.classList.add('space-span'); // helper class if needed
                element.appendChild(spaceSpan);
            }
        });

        return allCharSpans;
    }

    const h1Spans = wrapContent(heroH1);
    const pSpans = wrapContent(heroP);
    const allSpans = [...h1Spans, ...pSpans];

    // Mouse move event
    heroSection.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        allSpans.forEach(span => {
            const rect = span.getBoundingClientRect();
            const spanX = rect.left + rect.width / 2;
            const spanY = rect.top + rect.height / 2;

            const dist = Math.sqrt(Math.pow(mouseX - spanX, 2) + Math.pow(mouseY - spanY, 2));
            const radius = 150;

            if (dist < radius) {
                const intensity = 1 - (dist / radius);
                const smoothIntensity = Math.pow(intensity, 2);

                // Effects - REDUCED INTENSITY
                const scale = 1 + (smoothIntensity * 0.3);
                const translateY = -(smoothIntensity * 6);

                span.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            } else {
                span.style.transform = 'scale(1) translateY(0)';
            }
        });
    });

    // Reset on leave
    heroSection.addEventListener('mouseleave', () => {
        allSpans.forEach(span => {
            span.style.transform = 'scale(1) translateY(0)';
        });
    });
    // Lightbox Logic
    const galleryImages = ["Caminhão.png", "medidas_caminhão.png"];
    let currentSlideIndex = 0;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    // Make functions global for HTML onclick access
    window.openLightbox = function (index) {
        currentSlideIndex = index;
        lightbox.style.display = "block";
        lightboxImg.src = galleryImages[currentSlideIndex];

        // Push state for Back Button support
        history.pushState({ modalOpen: true }, "Modal", "#lightbox");
    }

    window.closeLightbox = function () {
        lightbox.style.display = "none";
        // Clean up URL if needed (optional)
        if (location.hash === "#lightbox") {
            history.back();
        }
    }

    // Handle Back Button (Popstate)
    window.addEventListener('popstate', (event) => {
        if (lightbox.style.display === "block") {
            lightbox.style.display = "none"; // Just hide it, history is already popped
        }
    });

    window.changeSlide = function (n) {
        currentSlideIndex += n;
        if (currentSlideIndex >= galleryImages.length) currentSlideIndex = 0;
        if (currentSlideIndex < 0) currentSlideIndex = galleryImages.length - 1;
        lightboxImg.src = galleryImages[currentSlideIndex];
    }

    // Close on Click Outside
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Clicked on the dark overlay, not the image
                window.closeLightbox();
            }
        });
    }

    // Close on ESC Key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && lightbox.style.display === "block") {
            window.closeLightbox();
        }
    });

    // Swipe Logic for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) window.changeSlide(1); // Swipe Left -> Next
        if (touchEndX > touchStartX + 50) window.changeSlide(-1); // Swipe Right -> Prev
    }
});
