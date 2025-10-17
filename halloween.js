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
     * Add spider webs to corners
     */
    function addSpiderWebs() {
        const webTopLeft = document.createElement('div');
        webTopLeft.className = 'spider-web top-left';
        document.body.appendChild(webTopLeft);

        const webTopRight = document.createElement('div');
        webTopRight.className = 'spider-web top-right';
        document.body.appendChild(webTopRight);
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
                addSpiderWebs();
                addFloatingGhosts();
                observeResultCards();
                makeInteractivePumpkin();
                addSpookyScreenshake();
            });
        } else {
            addSpiderWebs();
            addFloatingGhosts();
            observeResultCards();
            makeInteractivePumpkin();
            addSpookyScreenshake();
        }

        console.log('🎃 Happy Halloween! Spooky effects activated! 🎃');
    }

    // Start the spooky magic!
    initHalloweenEffects();
})();
