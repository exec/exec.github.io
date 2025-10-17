/**
 * 🎃 HALLOWEEN EFFECTS 2024 🎃
 * Temporary spooky effects - remove after Halloween!
 */

(function() {
    'use strict';

    // Effect types for different result cards
    const effectTypes = ['fire', 'poison', 'ghost', 'magic', 'blood'];
    let effectIndex = 0;

    /**
     * Physics-based spider web system
     */
    class PhysicsSpiderWeb {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.vx = 0;
            this.vy = 0;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.damping = 0.95;

            // Create canvas
            this.canvas = document.createElement('canvas');
            this.canvas.width = size;
            this.canvas.height = size;
            this.ctx = this.canvas.getContext('2d');

            // Create container
            this.element = document.createElement('div');
            this.element.className = 'physics-spider-web';
            this.element.appendChild(this.canvas);
            document.body.appendChild(this.element);

            this.drawWeb();
        }

        drawWeb() {
            const ctx = this.ctx;
            const centerX = this.size / 2;
            const centerY = this.size / 2;
            const maxRadius = this.size / 2 - 10;

            ctx.clearRect(0, 0, this.size, this.size);

            // Add glow effect
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(200, 200, 200, 0.5)';
            ctx.strokeStyle = 'rgba(220, 220, 220, 0.5)';
            ctx.lineWidth = 1.5;

            // Draw radial strands
            const numStrands = 8;
            for (let i = 0; i < numStrands; i++) {
                const angle = (i / numStrands) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * maxRadius,
                    centerY + Math.sin(angle) * maxRadius
                );
                ctx.stroke();
            }

            // Draw concentric circles
            const numCircles = 5;
            for (let i = 1; i <= numCircles; i++) {
                const radius = (maxRadius / numCircles) * i;
                ctx.beginPath();

                // Make it irregular/organic
                const points = 16;
                for (let j = 0; j <= points; j++) {
                    const angle = (j / points) * Math.PI * 2;
                    const variation = 1 + (Math.sin(angle * 3 + i) * 0.1);
                    const r = radius * variation;
                    const px = centerX + Math.cos(angle) * r;
                    const py = centerY + Math.sin(angle) * r;

                    if (j === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
                ctx.stroke();
            }

            // Draw spider in center
            ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
            ctx.fill();

            // Spider legs
            const legLength = 8;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                const legX = centerX + Math.cos(angle) * legLength;
                const legY = centerY + Math.sin(angle) * legLength;
                ctx.lineTo(legX, legY);
                ctx.stroke();
            }
        }

        applyForce(fx, fy) {
            this.vx += fx;
            this.vy += fy;
        }

        update() {
            // Apply damping
            this.vx *= this.damping;
            this.vy *= this.damping;

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Update rotation
            this.rotation += this.rotationSpeed;
            this.rotationSpeed *= 0.98;

            // Keep in bounds (with elastic bounce)
            const margin = this.size / 2;
            if (this.x < margin) {
                this.x = margin;
                this.vx *= -0.5;
            }
            if (this.x > window.innerWidth - margin) {
                this.x = window.innerWidth - margin;
                this.vx *= -0.5;
            }
            if (this.y < margin) {
                this.y = margin;
                this.vy *= -0.5;
            }
            if (this.y > window.innerHeight - margin) {
                this.y = window.innerHeight - margin;
                this.vy *= -0.5;
            }

            // Update DOM
            this.element.style.transform = `translate(${this.x - this.size/2}px, ${this.y - this.size/2}px) rotate(${this.rotation}rad)`;
        }

        destroy() {
            this.element.remove();
        }
    }

    // Spider web manager
    const spiderWebs = [];
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    function createSpiderWebs() {
        // Create 4-6 spider webs at random positions
        const numWebs = 4 + Math.floor(Math.random() * 3);

        for (let i = 0; i < numWebs; i++) {
            const size = 100 + Math.random() * 100;
            const x = size/2 + Math.random() * (window.innerWidth - size);
            const y = size/2 + Math.random() * (window.innerHeight - size);
            spiderWebs.push(new PhysicsSpiderWeb(x, y, size));
        }
    }

    function updateSpiderWebs() {
        // Calculate scroll velocity
        const currentScrollY = window.scrollY;
        scrollVelocity = (currentScrollY - lastScrollY) * 0.5;
        lastScrollY = currentScrollY;

        // Apply scroll force to all webs
        spiderWebs.forEach(web => {
            web.applyForce(0, scrollVelocity * 0.1);
            web.update();
        });

        requestAnimationFrame(updateSpiderWebs);
    }

    // Handle window resize
    function handleResize() {
        // Reposition webs if they're out of bounds
        spiderWebs.forEach(web => {
            const margin = web.size / 2;
            if (web.x > window.innerWidth - margin) {
                web.x = window.innerWidth - margin;
            }
            if (web.y > window.innerHeight - margin) {
                web.y = window.innerHeight - margin;
            }
        });
    }

    /**
     * Add floating ghosts in background
     */
    function addFloatingGhosts() {
        const ghosts = ['👻', '💀', '🦇'];

        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                const ghost = document.createElement('div');
                ghost.className = 'floating-ghost';
                ghost.textContent = ghosts[Math.floor(Math.random() * ghosts.length)];
                ghost.style.left = Math.random() * 100 + 'vw';
                ghost.style.top = '100vh';
                ghost.style.animationDuration = (20 + Math.random() * 20) + 's';
                document.body.appendChild(ghost);

                // Remove after animation
                setTimeout(() => {
                    ghost.remove();
                }, 30000);
            }
        }, 5000);
    }

    /**
     * Create particle effect for a card
     */
    function createParticleEffect(card, effectType) {
        const container = document.createElement('div');
        container.className = 'halloween-particles';
        card.appendChild(container);

        // Create particles periodically
        const particleInterval = setInterval(() => {
            // Stop if card is removed
            if (!card.isConnected) {
                clearInterval(particleInterval);
                return;
            }

            const particle = document.createElement('div');
            particle.className = `particle ${effectType}`;

            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';

            // Random drift amount
            const drift = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--drift', drift + 'px');

            // Random delay
            particle.style.animationDelay = Math.random() * 2 + 's';

            // Random duration
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';

            container.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 5000);
        }, 300 + Math.random() * 200);

        // Store interval ID on card for cleanup
        card._particleInterval = particleInterval;
    }

    /**
     * Observe when result cards are added
     */
    function observeResultCards() {
        const resultsContainers = document.querySelectorAll('.results-section');

        resultsContainers.forEach(container => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('result-card')) {
                            // Assign a random effect type
                            const effectType = effectTypes[effectIndex % effectTypes.length];
                            effectIndex++;

                            // Add particle effect
                            setTimeout(() => {
                                createParticleEffect(node, effectType);
                            }, 100);
                        }
                    });

                    // Cleanup intervals for removed cards
                    mutation.removedNodes.forEach((node) => {
                        if (node._particleInterval) {
                            clearInterval(node._particleInterval);
                        }
                    });
                });
            });

            observer.observe(container, { childList: true });
        });

        // Add effects to existing cards
        document.querySelectorAll('.result-card').forEach((card) => {
            if (!card.querySelector('.halloween-particles')) {
                const effectType = effectTypes[effectIndex % effectTypes.length];
                effectIndex++;
                createParticleEffect(card, effectType);
            }
        });
    }

    /**
     * Make the pumpkin interactive
     */
    function makeInteractivePumpkin() {
        const pumpkin = document.querySelector('.halloween-pumpkin');
        if (pumpkin) {
            pumpkin.addEventListener('click', () => {
                // Spooky laugh sound effect (without actual audio)
                pumpkin.style.transform = 'scale(1.3) rotate(360deg)';
                setTimeout(() => {
                    pumpkin.style.transform = '';
                }, 500);

                // Spawn multiple ghosts
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const ghost = document.createElement('div');
                        ghost.className = 'floating-ghost';
                        ghost.textContent = '👻';
                        ghost.style.left = (40 + Math.random() * 20) + 'vw';
                        ghost.style.top = '30vh';
                        ghost.style.animationDuration = (3 + Math.random() * 2) + 's';
                        document.body.appendChild(ghost);

                        setTimeout(() => {
                            ghost.remove();
                        }, 5000);
                    }, i * 100);
                }
            });
        }
    }

    /**
     * Add spooky screenshake on copy
     */
    function addSpookyScreenshake() {
        const originalHandleCopy = window.handleCopy;
        if (originalHandleCopy) {
            window.handleCopy = function(event) {
                // Call original
                originalHandleCopy.call(this, event);

                // Add screenshake
                document.body.style.animation = 'screenshake 0.3s ease-in-out';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 300);
            };
        }
    }

    // Screenshake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes screenshake {
            0%, 100% { transform: translate(0, 0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 2px); }
            20%, 40%, 60%, 80% { transform: translate(2px, -2px); }
        }
    `;
    document.head.appendChild(style);

    /**
     * Initialize all Halloween effects
     */
    function initHalloweenEffects() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createSpiderWebs();
                updateSpiderWebs();
                addFloatingGhosts();
                observeResultCards();
                makeInteractivePumpkin();
                addSpookyScreenshake();
                window.addEventListener('resize', handleResize);
            });
        } else {
            createSpiderWebs();
            updateSpiderWebs();
            addFloatingGhosts();
            observeResultCards();
            makeInteractivePumpkin();
            addSpookyScreenshake();
            window.addEventListener('resize', handleResize);
        }

        console.log('🎃 Happy Halloween! Spooky effects activated! 🎃');
    }

    // Start the spooky magic!
    initHalloweenEffects();
})();
