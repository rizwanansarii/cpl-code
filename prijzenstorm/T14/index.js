(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-14',
        debug: 0,
        testName: `T14 | Vergelijkbare product cart als op overview pagina's`,
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function swapCardsElement() {
        const cards = document.querySelectorAll('.custom-grid-section .\\#product-card');
        cards.forEach((card) => {
            const badges = card.querySelector('.\\#product-card-badges');
            const caption = card.querySelector('.\\#product-card-caption');

            if (!caption.querySelector('.\\#product-card-badges') && badges) {
                caption.insertAdjacentElement('afterbegin', badges);
                const text = badges.querySelector('.\\#product-card-badge').textContent.replace(/\s+/g, ' ').trim();
                const match = text.match(/^(\d+%)\s+(Goedkoper)\s+(dan elders)$/i);

                if (match) {
                    const [, percentage, goedkoper, elders] = match;

                    badges.querySelector('.\\#product-card-badge').innerHTML = `
                        <span class="percentage">${percentage}</span>
                        <span class="first-half">${goedkoper}</span>
                        <span class="second-half">${elders}</span>
                    `;
                }

                const rating = card.querySelector('.\\#product-card-rating-stars')
                if (rating) {
                    calculateRating(card);
                }
            }
        })
    }

    function calculateRating(card) {
        const stars = card.querySelectorAll('.\\#product-card-rating-stars use');

        let rating = 0;

        stars.forEach(star => {
            const href = star.getAttribute('href') || '';

            if (href.includes('star-half')) {
                rating += 0.5;
            } else if (href.includes('star-empty')) {
                rating += 0; // optional (can skip)
            } else if (href.includes('star')) {
                rating += 1;
            }
        });

        if (!card.querySelector('.gmd-star-count')) {
            card.querySelector('.\\#product-card-rating-stars').insertAdjacentHTML('afterend', `<div class="gmd-star-count">${rating}</div>`)
            const ratingCount = card.querySelector('.\\#product-card-rating-counter').innerHTML.trim();
            card.querySelector('.\\#product-card-rating-counter').innerHTML = `(${ratingCount})`;
        }

        return rating;
    }

    waitForElement(".hero-brand-slider-section", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        const cardWrapper = document.querySelectorAll('.custom-grid-section');
        if (cardWrapper) {
            cardWrapper.forEach((el) => {

                if (el.querySelector('.\\#hero-heading').textContent.trim() == 'Super Deals') {
                    el.classList.add('gmd-super-deal');
                } else if (el.querySelector('.\\#hero-heading').textContent.trim() == 'Populair') {
                    el.classList.add('gmd-popular');
                }
            })
        }

        setTimeout(() => {
            document.querySelectorAll(
                '.gmd-super-deal .swiper, .gmd-popular .swiper'
            ).forEach((el) => {
                const swiper = el.swiper;

                if (!swiper) return;

                swiper.params.breakpoints = {
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 14
                    },
                    600: {
                        slidesPerView: 3,
                        spaceBetween: 18
                    }
                };

                // swiper.params.centeredSlides = true;
                swiper.params.slidesOffsetBefore = 0;
                swiper.params.slidesOffsetAfter = 0;

                swiper.update();
            });
        }, 500);


        swapCardsElement();

        const observer = new MutationObserver(() => {
            swapCardsElement();
        })
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    });
})();