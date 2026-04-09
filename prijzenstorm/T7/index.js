(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-07',
        debug: 0,
        testName: 'T7 | Kleinere productcarts',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function swapCardsElement() {
        const cards = document.querySelectorAll('.\\#collection-inner .\\#collection-grid .\\#product-card');
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

    waitForElement(".\\#collection-inner", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        swapCardsElement();

        const cardsWrapper = document.querySelector('.\\#collection-inner .\\#collection-grid .\\#grid');
        if (cardsWrapper) {
            const observer = new MutationObserver(() => {
                swapCardsElement();
            })
            observer.observe(cardsWrapper, {
                childList: true,
                subtree: true
            })
        }
    });
})();