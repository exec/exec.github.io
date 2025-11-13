/**
 * 🎄 CHRISTMAS EFFECTS 2024 🎄
 * Temporary festive effects - remove after Christmas!
 */

(function() {
    'use strict';

    // Effect types for different result cards
    const effectTypes = ['snow', 'sparkle', 'aurora', 'star', 'twinkle'];
    let effectIndex = 0;

    /**
     * Add falling snowflakes and festive emojis in background
     */
    function addFallingSnowflakes() {
        const festiveEmojis = ['❄️', '⛄', '🎁', '⭐', '🔔'];
        let activeSnowflakes = 0;
        const maxSnowflakes = 5; // Limit concurrent snowflakes

        setInterval(() => {
            if (activeSnowflakes < maxSnowflakes && Math.random() > 0.6) { // 40% chance, max 5 at once
                activeSnowflakes++;
                const snowflake = document.createElement('div');
                snowflake.className = 'falling-snowflake';
                snowflake.textContent = festiveEmojis[Math.floor(Math.random() * festiveEmojis.length)];
                snowflake.style.left = (Math.random() * 90 + 5) + 'vw';
                snowflake.style.top = '-5vh';

                // Random drift and duration
                const drift = (Math.random() - 0.5) * 20;
                snowflake.style.setProperty('--snow-drift', drift + 'vw');
                snowflake.style.animationDuration = (10 + Math.random() * 8) + 's';
                snowflake.style.fontSize = (1.5 + Math.random()) + 'rem';

                document.body.appendChild(snowflake);

                // Remove after animation
                setTimeout(() => {
                    snowflake.remove();
                    activeSnowflakes--;
                }, 18000);
            }
        }, 6000); // Every 6 seconds
    }

    /**
     * Create particle effect for a card
     */
    function createParticleEffect(card, effectType) {
        const container = document.createElement('div');
        container.className = 'christmas-particles';
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
        }, 800); // Every 800ms

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
                            // Assign a rotating effect type
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
            if (!card.querySelector('.christmas-particles')) {
                const effectType = effectTypes[effectIndex % effectTypes.length];
                effectIndex++;
                createParticleEffect(card, effectType);
            }
        });
    }

    /**
     * Make the Christmas tree interactive
     */
    function makeInteractiveTree() {
        const tree = document.querySelector('.christmas-tree');
        if (tree) {
            tree.addEventListener('click', () => {
                // Festive jingle effect (without actual audio)
                tree.style.transform = 'scale(1.3) rotate(360deg)';
                setTimeout(() => {
                    tree.style.transform = '';
                }, 500);

                // Spawn multiple festive emojis
                const celebrationEmojis = ['🎁', '⭐', '❄️', '🔔', '✨'];
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => {
                        const emoji = document.createElement('div');
                        emoji.className = 'falling-snowflake';
                        emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                        emoji.style.left = (35 + Math.random() * 30) + 'vw';
                        emoji.style.top = '25vh';
                        emoji.style.animationDuration = (2 + Math.random() * 2) + 's';
                        emoji.style.fontSize = '2rem';

                        const drift = (Math.random() - 0.5) * 20;
                        emoji.style.setProperty('--snow-drift', drift + 'vw');

                        document.body.appendChild(emoji);

                        setTimeout(() => {
                            emoji.remove();
                        }, 4000);
                    }, i * 80);
                }
            });
        }
    }

    /**
     * Add subtle festive pulse effect on copy
     */
    function addFestivePulse() {
        const originalHandleCopy = window.handleCopy;
        if (originalHandleCopy) {
            window.handleCopy = function(event) {
                // Call original
                originalHandleCopy.call(this, event);

                // Add subtle pulse to button
                const btn = event.target;
                btn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 200);
            };
        }
    }

    /**
     * Initialize all Christmas effects
     */
    function initChristmasEffects() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addFallingSnowflakes();
                observeResultCards();
                makeInteractiveTree();
                addFestivePulse();
            });
        } else {
            addFallingSnowflakes();
            observeResultCards();
            makeInteractiveTree();
            addFestivePulse();
        }

        console.log('🎄 Merry Christmas! Festive effects activated! 🎄');
    }

    // Start the festive magic!
    initChristmasEffects();
})();
