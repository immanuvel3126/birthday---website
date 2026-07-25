// ============================================================
// PARTICLE SYSTEM - Canvas-based background effects
// Handles hearts and sparkles floating across the viewport
// ============================================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.running = false;
        this.maxParticles = 50;
        this.maxHearts = 20;
        this.maxSparkles = 30;
        this.heartColors = ['#FF6B9D', '#FF85A2', '#FFB3C6'];
        this.sparkleColors = ['#FFD700', '#C084FC', '#FFB3C6'];
        this._resizeTimeout = null;

        // Bind methods
        this._boundResize = this._debouncedResize.bind(this);
        this._boundAnimate = this.animate.bind(this);
    }

    // --------------------------------------------------------
    // Initialization
    // --------------------------------------------------------
    init() {
        if (!this.canvas) {
            console.warn('ParticleSystem: No canvas element provided.');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', this._boundResize);
    }

    // --------------------------------------------------------
    // Debounced resize handler (100ms debounce)
    // --------------------------------------------------------
    _debouncedResize() {
        clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(() => {
            this.resize();
        }, 100);
    }

    // --------------------------------------------------------
    // Resize canvas to fill viewport
    // --------------------------------------------------------
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // --------------------------------------------------------
    // Add a heart-shaped particle
    // --------------------------------------------------------
    addHeart() {
        // Count current hearts
        const heartCount = this.particles.filter(p => p.type === 'heart').length;
        if (heartCount >= this.maxHearts || this.particles.length >= this.maxParticles) return;

        const size = 8 + Math.random() * 7; // 8-15px
        this.particles.push({
            type: 'heart',
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + size, // Start below viewport
            size: size,
            color: this.heartColors[Math.floor(Math.random() * this.heartColors.length)],
            speedY: -(0.5 + Math.random() * 1.2), // Float upward
            swaySpeed: 0.01 + Math.random() * 0.02,
            swayAmplitude: 20 + Math.random() * 30,
            swayOffset: Math.random() * Math.PI * 2,
            originX: 0, // Set after creation
            opacity: 0,
            phase: 'fadeIn', // fadeIn -> stay -> fadeOut
            life: 0,
            maxLife: 300 + Math.random() * 200, // frames
            fadeInDuration: 40,
            fadeOutStart: 0 // calculated later
        });

        const heart = this.particles[this.particles.length - 1];
        heart.originX = heart.x;
        heart.fadeOutStart = heart.maxLife - 60;
    }

    // --------------------------------------------------------
    // Add a sparkle/dot particle
    // --------------------------------------------------------
    addSparkle() {
        const sparkleCount = this.particles.filter(p => p.type === 'sparkle').length;
        if (sparkleCount >= this.maxSparkles || this.particles.length >= this.maxParticles) return;

        this.particles.push({
            type: 'sparkle',
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: 2 + Math.random() * 3, // 2-5px
            color: this.sparkleColors[Math.floor(Math.random() * this.sparkleColors.length)],
            opacity: 0,
            twinkleSpeed: 0.02 + Math.random() * 0.04,
            twinkleOffset: Math.random() * Math.PI * 2,
            life: 0,
            maxLife: 200 + Math.random() * 300
        });
    }

    // --------------------------------------------------------
    // Update all particles
    // --------------------------------------------------------
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life++;

            if (p.type === 'heart') {
                // Movement
                p.y += p.speedY;
                p.x = p.originX + Math.sin(p.life * p.swaySpeed + p.swayOffset) * p.swayAmplitude;

                // Opacity phases
                if (p.life < p.fadeInDuration) {
                    p.opacity = p.life / p.fadeInDuration;
                } else if (p.life > p.fadeOutStart) {
                    p.opacity = Math.max(0, 1 - (p.life - p.fadeOutStart) / (p.maxLife - p.fadeOutStart));
                } else {
                    p.opacity = 1;
                }
            } else if (p.type === 'sparkle') {
                // Twinkle opacity oscillation
                const twinkle = Math.sin(p.life * p.twinkleSpeed + p.twinkleOffset);
                const baseFade = p.life < 30 ? p.life / 30 :
                    (p.life > p.maxLife - 30 ? Math.max(0, (p.maxLife - p.life) / 30) : 1);
                p.opacity = baseFade * (0.3 + 0.7 * ((twinkle + 1) / 2));
            }

            // Remove dead or off-screen particles
            const isOffScreen = p.y < -p.size * 2 || p.y > this.canvas.height + p.size * 2 ||
                p.x < -p.size * 2 || p.x > this.canvas.width + p.size * 2;
            if (p.life >= p.maxLife || isOffScreen) {
                this.particles.splice(i, 1);
            }
        }
    }

    // --------------------------------------------------------
    // Draw all particles to canvas
    // --------------------------------------------------------
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;

            if (p.type === 'heart') {
                this._drawHeart(p.x, p.y, p.size, p.color);
            } else if (p.type === 'sparkle') {
                this._drawSparkle(p.x, p.y, p.size, p.color);
            }

            this.ctx.restore();
        }
    }

    // --------------------------------------------------------
    // Draw a heart shape using canvas paths
    // --------------------------------------------------------
    _drawHeart(x, y, size, color) {
        const ctx = this.ctx;
        const s = size / 2;

        ctx.beginPath();
        ctx.moveTo(x, y + s * 0.4);

        // Left curve
        ctx.bezierCurveTo(
            x - s, y - s * 0.2,
            x - s, y - s * 0.8,
            x, y - s * 0.4
        );

        // Right curve
        ctx.bezierCurveTo(
            x + s, y - s * 0.8,
            x + s, y - s * 0.2,
            x, y + s * 0.4
        );

        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Soft glow
        ctx.shadowColor = color;
        ctx.shadowBlur = size * 0.6;
        ctx.fill();
    }

    // --------------------------------------------------------
    // Draw a sparkle/glowing circle
    // --------------------------------------------------------
    _drawSparkle(x, y, size, color) {
        const ctx = this.ctx;

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color + '80');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner bright dot
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
    }

    // --------------------------------------------------------
    // Main animation loop
    // --------------------------------------------------------
    animate() {
        if (!this.running) return;

        // Spawn new particles periodically
        if (Math.random() < 0.03) this.addHeart();
        if (Math.random() < 0.05) this.addSparkle();

        this.update();
        this.draw();

        this.animationId = requestAnimationFrame(this._boundAnimate);
    }

    // --------------------------------------------------------
    // Start the animation
    // --------------------------------------------------------
    start() {
        if (this.running) return;
        this.running = true;
        this.init();

        // Seed initial sparkles
        for (let i = 0; i < 10; i++) {
            this.addSparkle();
        }
        for (let i = 0; i < 5; i++) {
            this.addHeart();
        }

        this.animate();
    }

    // --------------------------------------------------------
    // Stop the animation
    // --------------------------------------------------------
    stop() {
        this.running = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        window.removeEventListener('resize', this._boundResize);
        clearTimeout(this._resizeTimeout);
    }
}