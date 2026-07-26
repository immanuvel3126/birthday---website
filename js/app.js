// ============================================================
// WEBSITE CONFIGURATION
// Change these values to customize your birthday website
// Month is 0-indexed: 0=Jan, 1=Feb, ..., 6=Jul, ..., 11=Dec
// ============================================================
const CONFIG = {
    birthdayDate: new Date(2026, 6, 25,8,57,0 ), // July 1, 2026, 12:00 AM
    birthdayGirl: 'kavya',
    createdBy: 'Immanuvel',
    maxPhotos: 10,
    maxVideos: 10,
    autoSlideInterval: 4000,
    photoFormats: ['jpg', 'jpeg', 'png', 'webp'],
    videoFormats: ['mp4', 'webm', 'ogg'],
    loveNotes: [
        '❤️ I Love You',
        '❤️ MY QUEEN',
        '❤️ My Happiness',
        '❤️ Forever Together',
        '❤️ My CHELLO',
        '❤️ Love You',
        '❤️ my kutti ulagam'
    ]
};


// ============================================================
// 1. COUNTDOWN MANAGER
// Manages the lock screen countdown to the birthday date
// ============================================================
class CountdownManager {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.intervalId = null;
        this.heartIntervalId = null;
        this.daysEl = document.getElementById('count-days');
        this.hoursEl = document.getElementById('count-hours');
        this.minutesEl = document.getElementById('count-minutes');
        this.secondsEl = document.getElementById('count-seconds');
        this.particlesContainer = document.getElementById('countdown-particles');
        this.countdownScreen = document.getElementById('countdown-screen');
    }

    start() {
        this.update();
        this.intervalId = setInterval(() => this.update(), 1000);

        // Floating hearts in countdown screen
        this.heartIntervalId = setInterval(() => {
            this._createFloatingHeart();
        }, 2000);
    }

    update() {
        const now = new Date();
        const diff = CONFIG.birthdayDate - now;

        if (diff <= 0) {
            this.stop();
            this.onComplete();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
        if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
        if (this.minutesEl) this.minutesEl.textContent = String(minutes).padStart(2, '0');
        if (this.secondsEl) this.secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    _createFloatingHeart() {
        if (!this.particlesContainer) return;
        const hearts = ['💕', '💖', '💗', '💝', '❤️', '💜'];
        const heart = document.createElement('div');
        heart.className = 'countdown-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 90 + 5 + '%';
        heart.style.animationDuration = (4 + Math.random() * 3) + 's';
        heart.style.fontSize = (14 + Math.random() * 14) + 'px';
        this.particlesContainer.appendChild(heart);

        // Clean up after animation
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    onComplete() {
        if (this.countdownScreen) {
            this.countdownScreen.style.transition = 'opacity 0.8s ease';
            this.countdownScreen.style.opacity = '0';

            setTimeout(() => {
                this.countdownScreen.classList.remove('active');
                this.countdownScreen.style.opacity = '';
                this.countdownScreen.style.transition = '';

                const openingScreen = document.getElementById('opening-screen');
                if (openingScreen) {
                    openingScreen.classList.add('active');
                }

                // Trigger the callback passed to the constructor
                if (typeof this._externalOnComplete === 'function') {
                    this._externalOnComplete();
                }
            }, 800);
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.heartIntervalId) {
            clearInterval(this.heartIntervalId);
            this.heartIntervalId = null;
        }
    }
}

// Fix: The constructor takes onComplete, but the class also defines onComplete as a method.
// We resolve this by storing the callback separately.
// Re-structuring CountdownManager properly:

class CountdownManagerFixed {
    constructor(onCompleteCallback) {
        this._onCompleteCallback = onCompleteCallback;
        this.intervalId = null;
        this.heartIntervalId = null;
        this.daysEl = document.getElementById('count-days');
        this.hoursEl = document.getElementById('count-hours');
        this.minutesEl = document.getElementById('count-minutes');
        this.secondsEl = document.getElementById('count-seconds');
        this.particlesContainer = document.getElementById('countdown-particles');
        this.countdownScreen = document.getElementById('countdown-screen');
    }

    start() {
        this.update();
        this.intervalId = setInterval(() => this.update(), 1000);

        // Periodically spawn floating hearts
        this.heartIntervalId = setInterval(() => {
            this._createFloatingHeart();
        }, 2000);
    }

    update() {
        const now = new Date();
        const diff = CONFIG.birthdayDate - now;

        if (diff <= 0) {
            this.stop();
            this.onComplete();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
        if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
        if (this.minutesEl) this.minutesEl.textContent = String(minutes).padStart(2, '0');
        if (this.secondsEl) this.secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    _createFloatingHeart() {
        if (!this.particlesContainer) return;
        const hearts = ['💕', '💖', '💗', '💝', '❤️', '💜'];
        const heart = document.createElement('div');
        heart.className = 'countdown-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (Math.random() * 90 + 5) + '%';
        heart.style.animationDuration = (4 + Math.random() * 3) + 's';
        heart.style.fontSize = (14 + Math.random() * 14) + 'px';
        this.particlesContainer.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    onComplete() {
        if (this.countdownScreen) {
            this.countdownScreen.style.transition = 'opacity 0.8s ease';
            this.countdownScreen.style.opacity = '0';

            setTimeout(() => {
                this.countdownScreen.classList.remove('active');
                this.countdownScreen.style.opacity = '';
                this.countdownScreen.style.transition = '';

                const openingScreen = document.getElementById('opening-screen');
                if (openingScreen) {
                    openingScreen.classList.add('active');
                }

                if (typeof this._onCompleteCallback === 'function') {
                    this._onCompleteCallback();
                }
            }, 800);
        } else {
            // No countdown screen, just fire callback
            if (typeof this._onCompleteCallback === 'function') {
                this._onCompleteCallback();
            }
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.heartIntervalId) {
            clearInterval(this.heartIntervalId);
            this.heartIntervalId = null;
        }
    }
}


// ============================================================
// 2. OPENING MANAGER
// Handles the birthday opening animation sequence
// ============================================================
class OpeningManager {
    constructor(onEnter) {
        this._onEnter = onEnter;
        this.openingScreen = document.getElementById('opening-screen');
        this.typedEl = document.getElementById('opening-typed');
        this.subtitleEl = document.getElementById('opening-subtitle');
        this.enterBtn = document.getElementById('enter-btn');
        this.confettiContainer = document.getElementById('opening-confetti');
        this.petalsContainer = document.getElementById('opening-petals');
        this.heartsContainer = document.getElementById('opening-hearts');
        this._started = false;
    }

    start() {
        if (this._started) return;
        this._started = true;

        // Launch all effects simultaneously
        this.createConfetti();
        this.createPetals();
        this.createFloatingHearts();
        this.typeText(`Happy Birthday ${CONFIG.birthdayGirl}aaa`);

        // Show subtitle after typing completes (~3s delay)
        setTimeout(() => {
            if (this.subtitleEl) this.subtitleEl.classList.add('visible');
        }, 3000);

        // Show enter button after 5 seconds
        setTimeout(() => {
            if (this.enterBtn) {
                this.enterBtn.classList.remove('hidden');
                this.enterBtn.classList.add('visible');
            }
        }, 5000);

        // Enter button click handler
        if (this.enterBtn) {
            this.enterBtn.addEventListener('click', () => this._handleEnter());
        }
    }

    typeText(text) {
        if (!this.typedEl) return;
        this.typedEl.textContent = '';
        let index = 0;

        const typeInterval = setInterval(() => {
            if (index < text.length) {
                this.typedEl.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }

    createConfetti() {
        if (!this.confettiContainer) return;
        const colors = ['#FF6B9D', '#C084FC', '#FFD700', '#FFB3C6', '#FF85A2', '#E879F9', '#FBBF24'];
        const count = 80 + Math.floor(Math.random() * 21); // 80-100

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = (Math.random() * 3) + 's';
            confetti.style.animationDuration = (2 + Math.random() * 3) + 's';

            // Random size
            const size = 6 + Math.random() * 8;
            confetti.style.width = size + 'px';
            confetti.style.height = size * (0.6 + Math.random() * 0.8) + 'px';

            // Random initial rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            this.confettiContainer.appendChild(confetti);
        }
    }

    createPetals() {
        if (!this.petalsContainer) return;
        const count = 30 + Math.floor(Math.random() * 11); // 30-40

        for (let i = 0; i < count; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDelay = (Math.random() * 5) + 's';
            petal.style.animationDuration = (4 + Math.random() * 4) + 's';
            petal.style.opacity = (0.4 + Math.random() * 0.6).toString();

            // Random pink/white shade
            const pinkShade = Math.random() > 0.3 ? '#FFB3C6' : '#FFFFFF';
            petal.style.backgroundColor = pinkShade;

            this.petalsContainer.appendChild(petal);
        }
    }

    createFloatingHearts() {
        if (!this.heartsContainer) return;
        const hearts = ['💕', '💖', '💗', '💝', '❤️', '💜', '🩷', '🤍'];
        const count = 20 + Math.floor(Math.random() * 11); // 20-30

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'opening-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = (Math.random() * 4) + 's';
            heart.style.animationDuration = (3 + Math.random() * 4) + 's';
            heart.style.fontSize = (16 + Math.random() * 20) + 'px';
            this.heartsContainer.appendChild(heart);
        }
    }

    _handleEnter() {
        if (!this.openingScreen) return;

        this.openingScreen.style.transition = 'opacity 0.8s ease';
        this.openingScreen.style.opacity = '0';

        setTimeout(() => {
            this.openingScreen.classList.remove('active');
            this.openingScreen.style.opacity = '';
            this.openingScreen.style.transition = '';

            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.style.display = 'block';
            }

            if (typeof this._onEnter === 'function') {
                this._onEnter();
            }
        }, 800);
    }
}


// ============================================================
// 3. GALLERY MANAGER
// Photo gallery with slider, fullscreen, touch support
// ============================================================
class GalleryManager {
    constructor() {
        this.photos = [];
        this.currentSlide = 0;
        this.autoSlideId = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.track = document.getElementById('gallery-track');
        this.prevBtn = document.getElementById('gallery-prev');
        this.nextBtn = document.getElementById('gallery-next');
        this.dotsContainer = document.getElementById('gallery-dots');
        this.fullscreenOverlay = document.getElementById('gallery-fullscreen');
        this.fullscreenClose = document.getElementById('fullscreen-close');
        this.fullscreenImg = document.getElementById('fullscreen-img');
        this.galleryContainer = document.getElementById('gallery-container');
        this.galleryEmpty = document.getElementById('gallery-empty');
    }

    async init() {
        await this.loadPhotos();

        if (this.photos.length === 0) {
            // No photos found
            if (this.galleryEmpty) this.galleryEmpty.style.display = 'block';
            if (this.galleryContainer) this.galleryContainer.style.display = 'none';
            return;
        }

        this.createSlides();
        this.createDots();
        this._bindEvents();
        this.initTouchSupport();
        this.startAutoSlide();
    }

    async loadPhotos() {
        const loaded = [];

        for (let n = 1; n <= CONFIG.maxPhotos; n++) {
            let found = false;
            for (const format of CONFIG.photoFormats) {
                const src = `photos/photo${n}.${format}`;
                try {
                    const url = await this.tryLoadImage(src);
                    loaded.push(url);
                    found = true;
                    break; // Found a valid format, skip others
                } catch (e) {
                    // Format not found, try next
                }
            }
        }

        this.photos = loaded;
    }

    tryLoadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject();
            img.src = src;
        });
    }

    createSlides() {
        if (!this.track) return;
        this.track.innerHTML = '';

        this.photos.forEach((url, index) => {
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';

            const img = document.createElement('img');
            img.className = 'gallery-img';
            img.src = url;
            img.alt = `Our moment ${index + 1}`;
            img.loading = 'lazy';

            // Click to open fullscreen
            img.addEventListener('click', () => this.openFullscreen(url));

            slide.appendChild(img);
            this.track.appendChild(slide);
        });
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';

        this.photos.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    goToSlide(index) {
        if (this.photos.length === 0) return;

        // Wrap around
        if (index < 0) index = this.photos.length - 1;
        if (index >= this.photos.length) index = 0;

        this.currentSlide = index;

        if (this.track) {
            this.track.style.transform = `translateX(-${index * 100}%)`;
        }

        // Update dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.gallery-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideId = setInterval(() => this.nextSlide(), CONFIG.autoSlideInterval);
    }

    stopAutoSlide() {
        if (this.autoSlideId) {
            clearInterval(this.autoSlideId);
            this.autoSlideId = null;
        }
    }

    openFullscreen(src) {
        if (!this.fullscreenOverlay || !this.fullscreenImg) return;
        this.fullscreenImg.src = src;
        this.fullscreenOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeFullscreen() {
        if (!this.fullscreenOverlay) return;
        this.fullscreenOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    initTouchSupport() {
        const container = this.galleryContainer || this.track;
        if (!container) return;

        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.stopAutoSlide();
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', () => {
            const diff = this.touchStartX - this.touchEndX;
            const minSwipe = 50;

            if (Math.abs(diff) > minSwipe) {
                if (diff > 0) {
                    this.nextSlide(); // Swipe left = next
                } else {
                    this.prevSlide(); // Swipe right = prev
                }
            }
            this.startAutoSlide();
        }, { passive: true });
    }

    _bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.stopAutoSlide();
                this.startAutoSlide();
            });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.stopAutoSlide();
                this.startAutoSlide();
            });
        }

        // Fullscreen close
        if (this.fullscreenClose) {
            this.fullscreenClose.addEventListener('click', () => this.closeFullscreen());
        }

        // Close on backdrop click
        if (this.fullscreenOverlay) {
            this.fullscreenOverlay.addEventListener('click', (e) => {
                if (e.target === this.fullscreenOverlay) {
                    this.closeFullscreen();
                }
            });
        }

        // Pause auto-slide on hover
        const section = document.getElementById('gallery-section');
        if (section) {
            section.addEventListener('mouseenter', () => this.stopAutoSlide());
            section.addEventListener('mouseleave', () => this.startAutoSlide());
        }

        // Keyboard: Escape to close fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeFullscreen();
        });
    }
}


// ============================================================
// 3B. VIDEO MANAGER
// Video gallery with dynamic loading and synchronized play controls
// ============================================================
class VideoManager {
    constructor() {
        this.videos = [];
        this.grid = document.getElementById('video-grid');
        this.emptyEl = document.getElementById('video-empty');
        this.section = document.getElementById('video-section');
    }

    async init() {
        await this.loadVideos();

        if (this.videos.length === 0) {
            // Hide section or show empty text
            if (this.emptyEl) this.emptyEl.style.display = 'block';
            if (this.section) this.section.style.display = 'none';
            return;
        }

        if (this.section) this.section.style.display = 'block';
        if (this.emptyEl) this.emptyEl.style.display = 'none';

        this.render();
    }

    async loadVideos() {
        const loaded = [];

        for (let n = 1; n <= CONFIG.maxVideos; n++) {
            let foundSrc = null;
            // Scan for video formats
            for (const format of CONFIG.videoFormats) {
                const src = `videos/video${n}.${format}`;
                try {
                    foundSrc = await this.tryLoadVideo(src);
                    break;
                } catch (e) {
                    // Try next format
                }
            }

            if (foundSrc) {
                // Scan for optional custom thumbnail/poster
                let foundThumb = null;
                const thumbFormats = ['jpg', 'jpeg', 'png', 'webp'];
                for (const tFormat of thumbFormats) {
                    const thumbSrc = `videos/video${n}_thumb.${tFormat}`;
                    try {
                        foundThumb = await this.tryLoadImage(thumbSrc);
                        break;
                    } catch (e) {
                        // Try next format
                    }
                }

                loaded.push({
                    src: foundSrc,
                    poster: foundThumb,
                    index: n
                });
            }
        }

        this.videos = loaded;
    }

    tryLoadVideo(src) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = src;
            video.preload = 'metadata';

            // On desktop browsers loadedmetadata works well
            video.onloadedmetadata = () => resolve(src);

            // Fallback for some browsers / protocols
            video.oncanplay = () => resolve(src);

            video.onerror = () => reject();

            // Timeout to prevent hanging if file doesn't exist
            setTimeout(() => reject(), 1500);
        });
    }

    tryLoadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject();
            img.src = src;
        });
    }

    render() {
        if (!this.grid) return;
        this.grid.innerHTML = '';

        this.videos.forEach((videoData) => {
            const card = document.createElement('div');
            card.className = 'video-card glass-card';

            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';

            const video = document.createElement('video');
            video.className = 'video-element';
            video.src = videoData.src;
            video.preload = 'metadata';
            if (videoData.poster) {
                video.poster = videoData.poster;
            }

            const playBtn = document.createElement('div');
            playBtn.className = 'video-play-btn';
            playBtn.setAttribute('aria-label', 'Play video');
            playBtn.innerHTML = '▶';

            wrapper.appendChild(video);
            wrapper.appendChild(playBtn);

            const info = document.createElement('div');
            info.className = 'video-info';

            const title = document.createElement('h3');
            title.className = 'video-title';
            title.textContent = `Our Special Moment ${videoData.index} ❤️`;
            info.appendChild(title);

            card.appendChild(wrapper);
            card.appendChild(info);

            // Play synchronization logic
            const playVideo = () => {
                // Pause all other videos
                const allVideos = document.querySelectorAll('.video-element');
                allVideos.forEach((v) => {
                    if (v !== video) {
                        v.pause();
                        v.removeAttribute('controls');
                        const cardParent = v.closest('.video-card');
                        if (cardParent) {
                            const btn = cardParent.querySelector('.video-play-btn');
                            if (btn) btn.classList.remove('hidden');
                        }
                    }
                });

                video.setAttribute('controls', 'true');
                video.play();
                playBtn.classList.add('hidden');
            };

            card.addEventListener('click', (e) => {
                // If clicked controls, let standard behavior handle it
                if (video.hasAttribute('controls') && e.target === video) {
                    return;
                }
                playVideo();
            });

            // Re-show play button when video ends
            video.addEventListener('ended', () => {
                video.removeAttribute('controls');
                playBtn.classList.remove('hidden');
            });

            // Support pause events (e.g. from native controls)
            video.addEventListener('pause', () => {
                if (video.seeking) return; // ignore seeking pause
                playBtn.classList.remove('hidden');
            });

            video.addEventListener('play', () => {
                playBtn.classList.add('hidden');
            });

            this.grid.appendChild(card);
        });
    }
}


// ============================================================
// 4. LETTER MANAGER
// Handles the love letter envelope opening and text reveal
// ============================================================
class LetterManager {
    constructor() {
        this.envelope = document.getElementById('letter-envelope');
        this.seal = document.getElementById('letter-seal');
        this.paper = document.getElementById('letter-paper');
        this.textContainer = document.getElementById('letter-text');
        this.isOpened = false;
    }

    init() {
        // Click to open
        if (this.envelope) {
            this.envelope.addEventListener('click', () => this.openEnvelope());
        }
        if (this.seal) {
            this.seal.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEnvelope();
            });
        }

        // Keyboard accessibility
        if (this.envelope) {
            this.envelope.setAttribute('tabindex', '0');
            this.envelope.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openEnvelope();
                }
            });
        }
    }

    openEnvelope() {
        if (this.isOpened) return;
        this.isOpened = true;

        // Open the envelope
        if (this.envelope) {
            this.envelope.classList.add('opened');
        }

        // Show paper after envelope opens
        setTimeout(() => {
            if (this.paper) {
                this.paper.classList.add('visible');
            }
        }, 800);

        // Display letter text
        setTimeout(() => {
            this.displayLetter();
        }, 1200);
    }

    displayLetter() {
        if (!this.textContainer) return;

        // Read from global LOVE_LETTER variable
        let letterText = '';
        try {
            if (typeof LOVE_LETTER !== 'undefined' && LOVE_LETTER) {
                letterText = LOVE_LETTER;
            } else {
                letterText = 'Every moment with you is a beautiful memory. Happy Birthday, my love! ❤️';
            }
        } catch (e) {
            letterText = 'Every moment with you is a beautiful memory. Happy Birthday, my love! ❤️';
        }

        // Format: convert newlines to paragraphs
        const paragraphs = letterText.split('\n').filter(line => line.trim() !== '');
        let html = '';
        paragraphs.forEach(para => {
            html += `<p>${this._escapeHTML(para)}</p>`;
        });

        this.textContainer.innerHTML = html;

        // Add reveal animation class
        this.textContainer.classList.add('letter-revealed');
    }

    _escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}


// ============================================================
// 5. MEMORIES MANAGER
// Renders the timeline of memories from MEMORIES_DATA
// ============================================================
class MemoriesManager {
    constructor() {
        this.timeline = document.getElementById('timeline');
    }

    render() {
        if (!this.timeline) return;

        let memoriesData = [];
        try {
            if (typeof MEMORIES_DATA !== 'undefined' && Array.isArray(MEMORIES_DATA)) {
                memoriesData = MEMORIES_DATA;
            }
        } catch (e) {
            console.warn('MemoriesManager: MEMORIES_DATA not available.');
            return;
        }

        if (memoriesData.length === 0) return;

        this.timeline.innerHTML = '';

        memoriesData.forEach((memory) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';

            const dot = document.createElement('div');
            dot.className = 'timeline-dot';
            item.appendChild(dot);

            const card = document.createElement('div');
            card.className = 'memory-card glass-card';

            // Only add image if provided and non-empty
            if (memory.image && memory.image.trim() !== '') {
                const img = document.createElement('img');
                img.className = 'memory-image';
                img.src = memory.image;
                img.alt = memory.title || 'Memory';
                img.loading = 'lazy';

                // Handle broken images gracefully
                img.addEventListener('error', () => {
                    img.style.display = 'none';
                });

                card.appendChild(img);
            }

            if (memory.date) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'memory-date';
                dateSpan.textContent = memory.date;
                card.appendChild(dateSpan);
            }

            if (memory.title) {
                const title = document.createElement('h3');
                title.className = 'memory-title';
                title.textContent = memory.title;
                card.appendChild(title);
            }

            if (memory.description) {
                const desc = document.createElement('p');
                desc.className = 'memory-description';
                desc.textContent = memory.description;
                card.appendChild(desc);
            }

            item.appendChild(card);
            this.timeline.appendChild(item);
        });
    }
}


// ============================================================
// 6. REASONS MANAGER
// Renders flip cards for "reasons I love you" from REASONS_DATA
// ============================================================
class ReasonsManager {
    constructor() {
        this.grid = document.getElementById('reasons-grid');
        this.isMobile = window.innerWidth <= 768;
    }

    render() {
        if (!this.grid) return;

        let reasonsData = [];
        try {
            if (typeof REASONS_DATA !== 'undefined' && Array.isArray(REASONS_DATA)) {
                reasonsData = REASONS_DATA;
            }
        } catch (e) {
            console.warn('ReasonsManager: REASONS_DATA not available.');
            return;
        }

        if (reasonsData.length === 0) return;

        this.grid.innerHTML = '';

        reasonsData.forEach((reason) => {
            const card = document.createElement('div');
            card.className = 'reason-card';

            const inner = document.createElement('div');
            inner.className = 'reason-inner';

            // Front face
            const front = document.createElement('div');
            front.className = 'reason-front';

            const emoji = document.createElement('span');
            emoji.className = 'reason-emoji';
            emoji.textContent = reason.emoji || '❤️';

            const title = document.createElement('h3');
            title.className = 'reason-title';
            title.textContent = reason.title || '';

            front.appendChild(emoji);
            front.appendChild(title);

            // Back face
            const back = document.createElement('div');
            back.className = 'reason-back';

            const desc = document.createElement('p');
            desc.className = 'reason-description';
            desc.textContent = reason.description || '';

            back.appendChild(desc);

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);

            // Mobile: toggle flip on click
            if (this.isMobile) {
                card.addEventListener('click', () => {
                    card.classList.toggle('flipped');
                });
            }

            this.grid.appendChild(card);
        });

        // Listen for resize to update mobile detection
        window.addEventListener('resize', this._handleResize.bind(this));
    }

    _handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        // If switching between mobile/desktop, re-render for correct behavior
        if (wasMobile !== this.isMobile) {
            this.render();
        }
    }
}


// ============================================================
// 7. GIFT MANAGER
// Gift box opening animation with explosion effects
// ============================================================
class GiftManager {
    constructor() {
        this.giftBox = document.getElementById('gift-box');
        this.giftLid = document.getElementById('gift-lid');
        this.openBtn = document.getElementById('gift-open-btn');
        this.revealEl = document.getElementById('gift-reveal');
        this.effectsContainer = document.getElementById('gift-effects');
        this.isOpened = false;
    }

    init() {
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.openGift());
        }
    }

    openGift() {
        if (this.isOpened) return;
        this.isOpened = true;

        // 1. Open the gift box
        if (this.giftBox) {
            this.giftBox.classList.add('opened');
        }

        // 2. Create explosion effects
        this.createExplosion();

        // 3. After explosion, reveal content
        setTimeout(() => {
            if (this.giftBox) this.giftBox.style.display = 'none';
            if (this.openBtn) this.openBtn.style.display = 'none';

            if (this.revealEl) {
                this.revealEl.style.display = 'block';
                // Trigger reflow for animation
                this.revealEl.offsetHeight;
                this.revealEl.classList.add('visible');
            }

            this.createFireworks();

            // Brief background glow
            document.body.classList.add('gift-glow');
            setTimeout(() => {
                document.body.classList.remove('gift-glow');
            }, 2000);
        }, 1500);
    }

    createExplosion() {
        if (!this.effectsContainer) return;
        this.effectsContainer.innerHTML = '';

        // Heart emojis (40-50)
        const heartEmojis = ['❤️', '💖', '💗', '💕', '💝', '🩷', '💜'];
        const heartCount = 40 + Math.floor(Math.random() * 11);
        for (let i = 0; i < heartCount; i++) {
            this._createExplosionParticle(
                heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
                'explosion-emoji'
            );
        }

        // Flower emojis (20-30)
        const flowerEmojis = ['🌸', '🌺', '🌷', '🌹', '🌻', '💐'];
        const flowerCount = 20 + Math.floor(Math.random() * 11);
        for (let i = 0; i < flowerCount; i++) {
            this._createExplosionParticle(
                flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
                'explosion-emoji'
            );
        }

        // Confetti pieces (60-80)
        const confettiColors = ['#FF6B9D', '#C084FC', '#FFD700', '#FFB3C6', '#FF85A2', '#67E8F9', '#FBBF24'];
        const confettiCount = 60 + Math.floor(Math.random() * 21);
        for (let i = 0; i < confettiCount; i++) {
            const piece = document.createElement('div');
            piece.className = 'explosion-confetti';
            const size = 5 + Math.random() * 8;
            piece.style.width = size + 'px';
            piece.style.height = size * (0.5 + Math.random() * 0.8) + 'px';
            piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            piece.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
            piece.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
            piece.style.setProperty('--rot', Math.random() * 720 + 'deg');
            piece.style.animationDelay = (Math.random() * 0.3) + 's';
            this.effectsContainer.appendChild(piece);
        }

        // Sparkle emojis (10-15)
        const sparkleEmojis = ['✨', '⭐', '🌟', '💫'];
        const sparkleCount = 10 + Math.floor(Math.random() * 6);
        for (let i = 0; i < sparkleCount; i++) {
            this._createExplosionParticle(
                sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)],
                'explosion-emoji explosion-sparkle'
            );
        }
    }

    _createExplosionParticle(emoji, className) {
        const el = document.createElement('div');
        el.className = className;
        el.textContent = emoji;
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 250;
        el.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        el.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        el.style.animationDelay = (Math.random() * 0.4) + 's';
        el.style.fontSize = (16 + Math.random() * 16) + 'px';
        this.effectsContainer.appendChild(el);
    }

    createFireworks() {
        if (!this.revealEl) return;

        const count = 15;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'firework-sparkle';
                sparkle.textContent = '✨';
                sparkle.style.left = (Math.random() * 80 + 10) + '%';
                sparkle.style.top = (Math.random() * 80 + 10) + '%';
                sparkle.style.fontSize = (14 + Math.random() * 14) + 'px';
                this.revealEl.appendChild(sparkle);

                setTimeout(() => sparkle.remove(), 1500);
            }, i * 200);
        }
    }
}


// ============================================================
// 8. FLOATING NOTES MANAGER
// Creates floating love notes that drift across the screen
// ============================================================
class FloatingNotesManager {
    constructor() {
        this.container = document.getElementById('floating-notes');
        this.intervalId = null;
        this.maxNotes = 6;
    }

    start() {
        if (!this.container) return;

        // Spawn first note immediately
        this.createNote();

        // Spawn new notes at random intervals (3-5 seconds)
        this._scheduleNext();
    }

    _scheduleNext() {
        const delay = 3000 + Math.random() * 2000; // 3-5s
        this.intervalId = setTimeout(() => {
            this.createNote();
            this._scheduleNext();
        }, delay);
    }

    createNote() {
        if (!this.container) return;

        // Limit max visible notes
        const currentNotes = this.container.querySelectorAll('.love-note');
        if (currentNotes.length >= this.maxNotes) return;

        const noteText = CONFIG.loveNotes[Math.floor(Math.random() * CONFIG.loveNotes.length)];
        const note = document.createElement('div');
        note.className = 'love-note';
        note.textContent = noteText;
        note.style.left = (5 + Math.random() * 85) + '%';
        note.style.animationDuration = (6 + Math.random() * 4) + 's';
        note.style.animationDelay = (Math.random() * 2) + 's';

        this.container.appendChild(note);

        // Remove after animation completes
        note.addEventListener('animationend', () => {
            note.remove();
        });
    }

    stop() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }
}


// ============================================================
// 9. SCROLL MANAGER
// Handles scroll-triggered animations via IntersectionObserver
// ============================================================
class ScrollManager {
    constructor() {
        this.observer = null;
        this.timelineObserver = null;
    }

    init() {
        // Observer for main content sections
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all content sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            this.observer.observe(section);
        });

        // Separate observer for timeline items (staggered animation)
        this.timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered delay based on position
                    const items = document.querySelectorAll('.timeline-item');
                    const index = Array.from(items).indexOf(entry.target);
                    entry.target.style.transitionDelay = (index * 0.15) + 's';
                    entry.target.classList.add('animate-in');
                    this.timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -10px 0px'
        });

        // Observe timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            this.timelineObserver.observe(item);
        });
    }
}


// ============================================================
// 10. ENDING MANAGER
// Generates decorative stars in the ending section
// ============================================================
class EndingManager {
    constructor() {
        this.starsContainer = document.getElementById('ending-stars');
    }

    createStars() {
        if (!this.starsContainer) return;

        const count = 50 + Math.floor(Math.random() * 31); // 50-80

        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';

            const size = 2 + Math.random() * 2; // 2-4px
            star.style.width = size + 'px';
            star.style.height = size + 'px';

            star.style.animationDelay = (Math.random() * 5) + 's';

            this.starsContainer.appendChild(star);
        }
    }
}


// ============================================================
// MAIN APPLICATION
// Orchestrates all managers and handles initialization flow
// ============================================================
class BirthdayApp {
    constructor() {
        this.particleSystem = null;
        this.countdownManager = null;
        this.openingManager = null;
        this.galleryManager = null;
        this.videoManager = null;
        this.letterManager = null;
        this.memoriesManager = null;
        this.reasonsManager = null;
        this.giftManager = null;
        this.floatingNotesManager = null;
        this.scrollManager = null;
        this.endingManager = null;
    }

    init() {
        const isBirthdayOrAfter = this.checkBirthdayDate();
        const hasVisited = localStorage.getItem('kavya_birthday_visited') === 'true';

        if (!isBirthdayOrAfter) {
            // Before the birthday — show countdown
            this.startCountdown();
        } else if (hasVisited) {
            // Returning visitor after birthday — skip to main content
            this._skipToMainContent();
        } else {
            // First visit on/after birthday — show opening
            this.startOpening();
        }
    }

    /**
     * Check if the current date is on or after the birthday.
     * @returns {boolean} true if birthday has arrived or passed
     */
    checkBirthdayDate() {
        return new Date() >= CONFIG.birthdayDate;
    }

    /**
     * Start the countdown lock screen.
     */
    startCountdown() {
        const countdownScreen = document.getElementById('countdown-screen');
        if (countdownScreen) {
            countdownScreen.classList.add('active');
        }

        this.countdownManager = new CountdownManagerFixed(() => {
            // Countdown reached zero — start opening
            this.startOpening();
        });
        this.countdownManager.start();
    }

    /**
     * Start the birthday opening animation sequence.
     */
    startOpening() {
        const openingScreen = document.getElementById('opening-screen');
        if (openingScreen && !openingScreen.classList.contains('active')) {
            // Hide countdown if visible
            const countdownScreen = document.getElementById('countdown-screen');
            if (countdownScreen) countdownScreen.classList.remove('active');

            openingScreen.classList.add('active');
        }

        this.openingManager = new OpeningManager(() => {
            // Enter button clicked — show main content
            localStorage.setItem('kavya_birthday_visited', 'true');
            this.startMainContent();
        });
        this.openingManager.start();
    }

    /**
     * Skip directly to main content (for returning visitors).
     */
    _skipToMainContent() {
        // Hide all screens
        const countdownScreen = document.getElementById('countdown-screen');
        const openingScreen = document.getElementById('opening-screen');
        if (countdownScreen) countdownScreen.classList.remove('active');
        if (openingScreen) openingScreen.classList.remove('active');

        // Show main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.style.display = 'block';

        this.startMainContent();
    }

    /**
     * Initialize all main content managers.
     */
    startMainContent() {
        try {
            // Initialize particle system
            const canvas = document.getElementById('particles-canvas');
            if (canvas) {
                this.particleSystem = new ParticleSystem(canvas);
                this.particleSystem.start();
            }

            // Gallery
            this.galleryManager = new GalleryManager();
            this.galleryManager.init();

            // Videos
            this.videoManager = new VideoManager();
            this.videoManager.init();

            // Love Letter
            this.letterManager = new LetterManager();
            this.letterManager.init();

            // Memories Timeline
            this.memoriesManager = new MemoriesManager();
            this.memoriesManager.render();

            // Reasons
            this.reasonsManager = new ReasonsManager();
            this.reasonsManager.render();

            // Gift
            this.giftManager = new GiftManager();
            this.giftManager.init();

            // Floating Notes
            this.floatingNotesManager = new FloatingNotesManager();
            this.floatingNotesManager.start();

            // Scroll Animations
            this.scrollManager = new ScrollManager();
            this.scrollManager.init();

            // Ending Stars
            this.endingManager = new EndingManager();
            this.endingManager.createStars();

        } catch (error) {
            console.error('BirthdayApp: Error initializing main content:', error);
        }
    }
}


// ============================================================
// AUTO-START
// Initialize the app when the DOM is fully loaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new BirthdayApp();
    app.init();
});
