(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-02',
        debug: 0,
        testName: 'T10 | Add Sticky ATS',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".shopify-section .\\#product-meta .form", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        const atsContent = {
            productName: document.querySelector('.shopify-section .desktop-title .\\#product-title').innerHTML,
            price: document.querySelector('.shopify-section .\\#product-meta #b-price').innerHTML,
            image: document.querySelector('.\\#product-gallery-stage .\\#media-image-wrapper img').src,
            alt: document.querySelector('.\\#product-gallery-stage .\\#media-image-wrapper img').alt,
            quantity: document.querySelector('.shopify-section .\\#product-meta .qty-input').value,
            minQuantity: document.querySelector('.shopify-section .\\#product-meta .qty-input').min,
            maxQuantity: document.querySelector('.shopify-section .\\#product-meta .qty-input').getAttribute('max'),
            btnIcon: document.querySelector('.shopify-section .\\#product-meta .form img').src,
            btnText: document.querySelector('.shopify-section .\\#product-meta .form .\\#button').innerText,
        }
        document.querySelector('body').insertAdjacentHTML('beforeend', `
            <div class="gmd-sticky-ats-wrapper">
                <div class="gmd-ats-container">
                    <div class="gmd-ats-content-wrapper">
                        <div class="gmd-left-wrapper">
                            <div class="gmd-image-wrapper">
                                <img src="${atsContent.image}" alt="${atsContent.alt}" />
                            </div>
                            <div class="gmd-text-wrapper">
                                <div class="gmd-product-info-wrapper">
                                    <div class="gmd-product-name">${atsContent.productName}</div>
                                </div>
                                <div class="gmd-price-stock-wrapper">
                                    <div class="gmd-price">${atsContent.price}</div>
                                </div>
                            </div>
                        </div>
                        <div class="gmd-quantity-buy-btn-wrapper">
                            <div class="gmd-input-quantity-wrapper">
                                <button class="gmd-qty-minus">−</button>
                                <input type="number" min="${atsContent.minQuantity}" max="${atsContent.maxQuantity}" class="quantity" value="${atsContent.quantity}" />
                                <button class="gmd-qty-plus">+</button>
                            </div>
                            <div class="gmd-btn-wrapper">
                                <button class="gmd-buy-now-btn gmd-desktop">${atsContent.btnText}<img src="${atsContent.btnIcon}"/></button>
                                <button class="gmd-buy-now-btn gmd-mobile">In winkelwagen<img src="${atsContent.btnIcon}"/></button>
                            </div>
                        </div>
                    </div>
                    <div class="gmd-discount-line">Hoe meer je bestelt, hoe hoger je korting.</div>
                </div>
            </div>`
        );
        const buyNowButton = document.querySelector('.shopify-section .\\#product-meta .form .\\#button');
        const atsButton = document.querySelector('.gmd-buy-now-btn');
        if (buyNowButton) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            document.querySelector('.gmd-sticky-ats-wrapper').classList.add('gmd-active')
                            const interval = setInterval(() => {
                                if (document.querySelector('#ShopifyChat') && document.querySelector('#smile-ui-lite-launcher-frame-container') && document.querySelector('#CookiebotWidget')) {
                                    clearInterval(interval);
                                    document.querySelector('#ShopifyChat').classList.add('gmd-active-ats');
                                    document.querySelector('#smile-ui-lite-launcher-frame-container').classList.add('gmd-active-ats');
                                    document.querySelector('#CookiebotWidget').classList.add('gmd-active-ats');
                                    document.querySelector('.styles_StickyWidget__').classList.add('gmd-active-ats');
                                }
                            }, 100)
                        } else {
                            document.querySelector('.gmd-sticky-ats-wrapper').classList.remove('gmd-active')
                            const interval = setInterval(() => {
                                if (document.querySelector('#ShopifyChat') && document.querySelector('#smile-ui-lite-launcher-frame-container') && document.querySelector('#CookiebotWidget')) {
                                    clearInterval(interval);
                                    document.querySelector('#ShopifyChat').classList.remove('gmd-active-ats');
                                    document.querySelector('#smile-ui-lite-launcher-frame-container').classList.remove('gmd-active-ats');
                                    document.querySelector('#CookiebotWidget').classList.remove('gmd-active-ats');
                                    document.querySelector('.styles_StickyWidget__').classList.remove('gmd-active-ats');
                                }
                            }, 100)
                        }
                    });
                },
                {
                    threshold: 0,
                }
            );
            observer.observe(buyNowButton);

            waitForElement('.shopify-section .\\#product-meta .kaching-bundles', () => {
                const bundleContainer = document.querySelector('.shopify-section .\\#product-meta .kaching-bundles');
                if (bundleContainer) {
                    const priceObserver = new MutationObserver(() => {
                        const sourceEl = document.querySelector('.shopify-section .\\#product-meta .kaching-bundles__bar--selected .kaching-bundles__bar-label');
                        const targetEl = document.querySelector('.gmd-sticky-ats-wrapper .\\#price-item.\\@on-sale .\\#price-value');

                        if (!sourceEl || !targetEl) return;

                        const fullText = sourceEl.textContent.trim();
                        const price = fullText.split('/')[0].trim();
                        const [main, decimal] = price.replace('€', '').split(',');

                        targetEl.innerHTML = `€${main},<sub class="dcml">${decimal}</sub>`;
                    });
                    priceObserver.observe(bundleContainer, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                }
            });



            document.querySelector('.gmd-qty-minus').addEventListener('click', (button) => {
                const input = button.target.parentElement.querySelector('input');

                let value = parseInt(input.value, 10);
                const min = parseInt(input.min, 10) || 1;

                if (value > min) {
                    input.value = value - 1;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                }
            })
            document.querySelector('.gmd-qty-plus').addEventListener('click', (button) => {
                const input = button.target.parentElement.querySelector('input');

                let value = parseInt(input.value, 10);
                const max = parseInt(input.max, 10) || Infinity;

                if (value < max) {
                    input.value = value + 1;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                }
            })

        }
        document.querySelectorAll('.gmd-buy-now-btn').forEach((e) => {
            e.addEventListener('click', () => {
                buyNowButton.click();
            })
        })

        const topInput = document.querySelector('.shopify-section .\\#product-meta .qty-input');
        const atsInput = document.querySelector('.gmd-input-quantity-wrapper input');

        if (topInput && atsInput) {

            function sync(from, to) {
                if (to.value !== from.value) {
                    to.value = from.value;
                    to.dispatchEvent(new Event("input", { bubbles: true }));
                    to.dispatchEvent(new Event("change", { bubbles: true }));
                }
            }

            topInput.addEventListener("input", () => sync(topInput, atsInput));
            atsInput.addEventListener("input", () => sync(atsInput, topInput));

            const observer = new MutationObserver(() => {
                sync(topInput, atsInput);
                sync(atsInput, topInput);
            });

            const observeTarget = topInput.closest('.\\#product') || document.body;

            observer.observe(observeTarget, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }
    });
})();