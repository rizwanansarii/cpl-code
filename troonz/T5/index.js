(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-05',
        debug: 0,
        testName: 'T5 | Cross sell slider cart',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const isFrench = window.Shopify && Shopify.locale === 'fr';

    const translations = {
        title: isFrench ? 'Complétez votre commande :' : 'Maak je bestelling compleet:',

        button: isFrench ? 'Ajouter' : 'Voeg toe'
    };
    const products = [
        {
            "title": "Troonz Dreamscape Plus",
            "price": "<price-list class=\"price-list  \"><sale-price class=\"font-bold text-lg\" style=\"color: #00041d; font-weight: 900; font-size: 24px;\">\n      <span class=\"sr-only\">&lt;span style=\"color: red; font-weight: bold;\"&gt;{{ price }}&lt;/span&gt;</span>\n      €70,20\n    </sale-price>\n\n    <compare-at-price class=\"line-through text-gray-500 text-5xl\" style=\"font-size: 17px;\">\n      <span class=\"sr-only\">Normale prijs</span>\n      €88,00\n    </compare-at-price></price-list>",
            "image": "https://troonz.com/cdn/shop/files/Milano_1.png?v=1757056067&width=160",
            "variantId": "50305980301645"
        },
        {
            "title": "Troonz Pocketpillow Plus",
            "price": "<price-list class=\"price-list  \"><sale-price class=\"font-bold text-lg\" style=\"color: #00041d; font-weight: 900; font-size: 24px;\">\n      <span class=\"sr-only\">&lt;span style=\"color: red; font-weight: bold;\"&gt;{{ price }}&lt;/span&gt;</span>\n      €78,30\n    </sale-price>\n\n    <compare-at-price class=\"line-through text-gray-500 text-5xl\" style=\"font-size: 17px;\">\n      <span class=\"sr-only\">Normale prijs</span>\n      €98,00\n    </compare-at-price></price-list>",
            "image": "https://troonz.com/cdn/shop/files/o_5.png?v=1757056032&width=160",
            "variantId": "51383385915725"
        },
        {
            "title": "Troonz Hoofdkussen Portofino",
            "price": "<price-list class=\"price-list  \"><sale-price class=\"font-bold text-lg\" style=\"color: #00041d; font-weight: 900; font-size: 24px;\">\n      <span class=\"sr-only\">&lt;span style=\"color: red; font-weight: bold;\"&gt;{{ price }}&lt;/span&gt;</span>\n      €39,95\n    </sale-price>\n\n    <compare-at-price class=\"line-through text-gray-500 text-5xl\" style=\"font-size: 17px;\">\n      <span class=\"sr-only\">Normale prijs</span>\n      €49,95\n    </compare-at-price></price-list>",
            "image": "https://troonz.com/cdn/shop/files/ShopifyBaboe_5_1.png?v=1757056141&width=160",
            "variantId": "43594606870758"
        }
    ]


    waitForElement(".shopify-section-group-overlay-group .cart-drawer", () => {
        document.body.classList.add(testInfo.className);

        const isFrench = Shopify.locale === 'fr';
        const translations = {
            title: isFrench ? 'Complétez votre commande :' : 'Maak je bestelling compleet:',

            button: isFrench ? 'Ajouter' : 'Voeg toe'
        };

        const sliderEle = `
        <div class="gmd-product-recommendation">
            <div class="gmd-order-info">${translations.title}</div>
            <div class="swiper gmd-cross-sell-swiper">
                <div class="gmd-cross-sell-wrapper swiper-wrapper">
                </div>
            </div>
            <div class="swiper-button-prev gmd-cross-prev"></div>
            <div class="swiper-button-next gmd-cross-next"></div>
        </div>`

        async function addToCart(variantId, quantity = 1) {
            try {
                const response = await fetch('/cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: variantId,
                        quantity: quantity
                    })
                });

                const data = await response.json();
                return data;

            } catch (error) {
                console.error('Add to cart error:', error);
            }
        }

        function updateTrustpilot() {
            if (!document.querySelector('.gmd-product-recommendation')) {
                if (document.querySelector('.footer-row')) {
                    document.querySelector('.footer-row').insertAdjacentHTML('afterbegin', sliderEle);
                    for (var i = 0; products.length > i; i++) {
                        document.querySelector('.gmd-cross-sell-swiper .swiper-wrapper').insertAdjacentHTML('beforeend', `
                            <div class="swiper-slide">
                                    <div class="gmd-cross-card">
                                        <div class="gmd-image-wrapper">
                                            <img src="${products[i].image}" alt="${products[i].title}" />
                                        </div>
                                        <div class="gmd-text-wrapper">
                                            <h4>${products[i].title}</h4>
                                            <div class="gmd-price">
                                                ${products[i].price}
                                            </div>
                                        </div>
                                        <div class="gmd-btn-wrapper">
                                            <button class="gmd-add-to-cart" data-id="${products[i].variantId}"}>${translations.button}</button>
                                            <pill-loader class="pill-loader">
                                                <div class="loader-dots">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                
                                                <svg class="loader-checkmark" fill="none" width="9" height="8" viewBox="0 0 9 8">
                                                    <path d="M1 3.5 3.3 6 8 1" stroke="currentColor" stroke-width="2"></path>
                                                </svg>
                                            </pill-loader>
                                        </div>
                                    </div>
                                </div>
                            `)
                    }
                    document.querySelectorAll('.gmd-cross-sell-swiper .gmd-add-to-cart').forEach((el) => {
                        el.addEventListener('click', async (e) => {
                            e.target.closest('.gmd-btn-wrapper').querySelector('.pill-loader').setAttribute("aria-busy", true);
                            const variantId = e.target.dataset.id;
                            await addToCart(variantId)
                            e.target.closest('.gmd-btn-wrapper').querySelector('.pill-loader').setAttribute("aria-busy", false);
                            document.dispatchEvent(new CustomEvent('cart:refresh'));
                        })
                    })
                    const checkSlider = setInterval(() => {
                        if (typeof Swiper != 'undefined') {
                            clearInterval(checkSlider);
                            new Swiper(".gmd-cross-sell-swiper", {
                                direction: "horizontal",
                                autoWidth: true,
                                loop: true,
                                slidesPerView: 1,
                                spaceBetween: 22,
                                centeredSlides: false,      // keep slides aligned to the left
                                pagination: false,
                                navigation: {
                                    nextEl: ".gmd-product-recommendation .gmd-cross-next",
                                    prevEl: ".gmd-product-recommendation .gmd-cross-prev",
                                },
                                breakpoints: {
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    768: {
                                        slidesPerView: 1,
                                        centeredSlidesBounds: true,
                                        freeMode: false,
                                        watchSlidesProgress: true,
                                    }
                                }
                            });
                        }
                    }, 500);
                }
            }

        }
        // initial run
        updateTrustpilot();

        // watch slider reloads (VERY important for sliders)
        const observer = new MutationObserver((mutations) => {
            // mutations.forEach(mutation => {
            //     mutation.addedNodes.forEach(node => {
            //         if (node.nodeType === 1) {
            updateTrustpilot();
            //         }
            //     });
            // });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();