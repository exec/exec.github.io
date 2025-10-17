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
     * Add floating ghosts and spooky emojis in background
     */
    function addFloatingGhosts() {
        const spookyEmojis = ['👻', '💀', '🦇', '🎃'];
        let activeGhosts = 0;
        const maxGhosts = 3; // Limit concurrent ghosts

        setInterval(() => {
            if (activeGhosts < maxGhosts && Math.random() > 0.7) { // 30% chance, max 3 at once
                activeGhosts++;
                const ghost = document.createElement('div');
                ghost.className = 'floating-ghost';
                ghost.textContent = spookyEmojis[Math.floor(Math.random() * spookyEmojis.length)];
                ghost.style.left = (Math.random() * 70 + 15) + 'vw';
                ghost.style.top = '100vh';
                ghost.style.animationDuration = (20 + Math.random() * 10) + 's';
                ghost.style.fontSize = '2.5rem';
                document.body.appendChild(ghost);

                // Remove after animation
                setTimeout(() => {
                    ghost.remove();
                    activeGhosts--;
                }, 30000);
            }
        }, 8000); // Much less frequent
    }

    /**
     * Create particle effect for a card
     */
    function createParticleEffect(card, effectType) {
        const container = document.createElement('div');
        container.className = 'halloween-particles';
        card.appendChild(container);

        let activeParticles = 0;
        const maxParticles = 6; // Limit active particles per card

        // Create particles periodically
        const particleInterval = setInterval(() => {
            // Stop if card is removed
            if (!card.isConnected) {
                clearInterval(particleInterval);
                return;
            }

            // Don't spawn if too many active
            if (activeParticles >= maxParticles) return;

            activeParticles++;
            const particle = document.createElement('div');
            particle.className = `particle ${effectType}`;

            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';

            // Random drift amount
            const drift = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--drift', drift + 'px');

            // Random duration
            const duration = 3 + Math.random() * 2;
            particle.style.animationDuration = duration + 's';

            container.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
                activeParticles--;
            }, duration * 1000);
        }, 800); // Much less frequent - every 800ms

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
     * Add subtle pulse effect on copy
     */
    function addSpookyPulse() {
        const originalHandleCopy = window.handleCopy;
        if (originalHandleCopy) {
            window.handleCopy = function(event) {
                // Call original
                originalHandleCopy.call(this, event);

                // Add subtle pulse to button instead of screen shake
                const btn = event.target;
                btn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 200);
            };
        }
    }

    /**
     * Initialize all Halloween effects
     */
    function initHalloweenEffects() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addFloatingGhosts();
                observeResultCards();
                makeInteractivePumpkin();
                addSpookyPulse();
            });
        } else {
            addFloatingGhosts();
            observeResultCards();
            makeInteractivePumpkin();
            addSpookyPulse();
        }

        console.log('🎃 Happy Halloween! Spooky effects activated! 🎃');
    }

    // Start the spooky magic!
    initHalloweenEffects();
})();
