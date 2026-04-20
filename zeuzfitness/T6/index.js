(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-06',
        debug: 0,
        testName: 'T6 | PLP productcards consistenter en met duidelijke primaire actie',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const translations = {
        en: {
            addToCart: "Add to cart",
            viewNow: "View now"
        },
        nl: {
            addToCart: "In winkelwagen",
            viewNow: "Nu bekijken"
        },
        it: {
            addToCart: "Aggiungi al carrello",
            viewNow: "Visualizza ora"
        },
        de: {
            addToCart: "In den Warenkorb",
            viewNow: "Jetzt ansehen"
        },
        es: {
            addToCart: "Añadir al carrito",
            viewNow: "Ver ahora"
        },
        fr: {
            addToCart: "Ajouter au panier",
            viewNow: "Voir maintenant"
        }
    };

    waitForElement(".collection .product-list", () => {
        document.body.classList.add(testInfo.className);
        const lang = document.documentElement.lang?.slice(0, 2)

        const globalColorMap = {};

        document.querySelectorAll('#accordion-filter-v-option-kleur label').forEach(label => {
            const name = label.querySelector('.sr-only')?.textContent?.trim().toLowerCase();
            if (!name) return;

            let raw = label.style.getPropertyValue('--swatch-background');

            if (!raw) {
                const style = label.getAttribute('style');
                const match = style?.match(/--swatch-background:\s*([^;]+)/);
                raw = match ? match[1].trim() : null;
            }

            if (raw) {
                globalColorMap[name] = raw;
            }
        });

        function applyColors() {
            const cards = document.querySelectorAll('.collection .product-list .product-card');

            cards.forEach((prod) => {

                const inputs = prod.querySelectorAll('.product-card__variant-list input[type="radio"]');

                inputs.forEach(input => {
                    const label = prod.querySelector(`label[for="${input.id}"]`);
                    if (!label) return;

                    const name = input.value.toLowerCase();
                    const color = globalColorMap[name];

                    if (!color) return;

                    if (label.classList.contains('gmd-processed')) return;
                    label.classList.add('gmd-processed');

                    label.innerHTML = `<span class="sr-only">${name}</span>`;

                    label.classList.remove('media-swatch');
                    label.classList.add('color-swatch');

                    label.style.setProperty('--swatch-background', color);
                    label.style.background = color;
                });

                if (!prod.querySelector('.gmd-btn-wrapper')) {
                    const prodLink = prod.querySelector('.product-card__figure a');
                    prod.querySelector('.product-card__info').insertAdjacentHTML('beforeend', `<div class="gmd-btn-wrapper"></div>`);
                    const buyNowBtn = prod.querySelector('.product-card__quick-buy .product-card__mobile-quick-buy-button')
                    if (buyNowBtn) {
                        prod.querySelector('.gmd-btn-wrapper').insertAdjacentElement('beforeend', prod.querySelector('.product-card__quick-buy'));
                        if (buyNowBtn.querySelector('div')) {
                            prod.querySelector('.product-card__info .product-card__quick-buy .product-card__mobile-quick-buy-button div').innerHTML = translations[lang].addToCart
                        } else {
                            prod.querySelector('.product-card__info .product-card__quick-buy .product-card__mobile-quick-buy-button').innerHTML = translations[lang].addToCart

                        }
                    }
                    prod.querySelector('.gmd-btn-wrapper').insertAdjacentHTML('beforeend', `
                        <a href="${prodLink.href}" class="gmd-link-wrapper">${translations[lang].viewNow}</a>
                    `);
                }
            });
        }

        applyColors();

        const observer = new MutationObserver(() => {
            applyColors();
        });

        observer.observe(document.querySelector('.shopify-section--main-collection'), {
            childList: true,
            subtree: true
        });

    });
})();