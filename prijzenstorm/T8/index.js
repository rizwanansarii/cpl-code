(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-08',
        debug: 0,
        testName: 'T8 | Sale items meer als deals positioneren',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function formatPrice(price) {
        // Format the price using Intl.NumberFormat
        return new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    }

    async function swapCardsElement() {
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

        const dealsMap = await getSuperDeals();

        const pdpCards = document.querySelectorAll('.\\#product-card a');

        let hasMatch = false;

        const pageProducts = [];

        pdpCards.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const handle = href.split('/products/')[1]?.split('?')[0];
            if (!handle) return;
            if (dealsMap[handle]) {
                hasMatch = true;
                pageProducts.push({ link, handle });
            }
        });

        pageProducts.forEach(({ link, handle }) => {

            const card = link.closest('.\\#product-card');
            if (!card || card.querySelector('.gmd-badge')) return;

            const save = dealsMap[handle].save.replace('.', ',');

            card.querySelector('.\\#product-card-media').insertAdjacentHTML('afterbegin', `
                <div class="gmd-badge-wrapper">
                    <span class="gmd-badge">SUPERDEAL</span>
                    <span class="gmd-save">Bespaar <span class="gmd-bold">€${formatPrice(dealsMap[handle].save)}</span></span>
                </div>
            `);
        });
    }

    function calculateRating(card) {
        const stars = card.querySelectorAll('.\\#product-card-rating-stars use');

        let rating = 0;

        stars.forEach(star => {
            const href = star.getAttribute('href') || '';

            if (href.includes('star-half')) {
                rating += 0.5;
            } else if (href.includes('star-empty')) {
                rating += 0;
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

    async function getSuperDeals() {
        const res = await fetch('https://prijzenstorm.nl/collections/super-deals/products.json');
        const data = await res.json();

        const dealsMap = {};

        data.products.forEach(product => {
            const variant = product.variants[0];

            const price = variant.price;
            const compare = variant.compare_at_price;

            if (compare && compare > price) {
                dealsMap[product.handle] = {
                    save: (compare - price).toFixed(2)
                };
            }
        });

        return dealsMap;
    }

    waitForElement(".\\#collection-inner", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        swapCardsElement();

        const cardsWrapper = document.querySelector('.\\#collection-inner');
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