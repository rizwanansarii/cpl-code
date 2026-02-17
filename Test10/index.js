(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-sticky-ats',
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

    waitForElement(".form", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);
        document.querySelector('head').insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300..800&display=swap" rel="stylesheet">');

        const atsContent = {
            productName: document.querySelector('.desktop-title .\\#product-title').innerHTML,
            price: document.querySelector('#b-price').innerHTML,
            image: document.querySelector('.\\#product-gallery-stage .\\#media-image-wrapper img').src,
            alt: document.querySelector('.\\#product-gallery-stage .\\#media-image-wrapper img').alt,
            quantity: document.querySelector('.qty-input').value,
            minQuantity: document.querySelector('.qty-input').min,
            maxQuantity: document.querySelector('.qty-input').getAttribute('max'),
            btnIcon: document.querySelector('.form img').src,
            btnText: document.querySelector('.form .\\#button').innerText,
        }
        document.querySelector('body').insertAdjacentHTML('beforeend', `
            <div class="sticky-ats-wrapper">
                <div class="ats-container">
                    <div class="ats-content-wrapper">
                        <div class="left-wrapper">
                            <div class="image-wrapper">
                                <img src="${atsContent.image}" alt="${atsContent.alt}" />
                            </div>
                            <div class="text-wrapper">
                                <div class="product-info-wrapper">
                                    <div class="product-name">${atsContent.productName}</div>
                                </div>
                                <div class="price-stock-wrapper">
                                    <div class="price">${atsContent.price}</div>
                                </div>
                            </div>
                        </div>
                        <div class="quantity-buy-btn-wrapper">
                            <div class="input-quantity-wrapper">
                                <button class="qty-minus">−</button>
                                <input type="number" min="${atsContent.minQuantity}" max="${atsContent.maxQuantity}" class="quantity" value="${atsContent.quantity}" />
                                <button class="qty-plus">+</button>
                            </div>
                            <div class="btn-wrapper">
                                <button class="buy-now-btn desktop">${atsContent.btnText}<img src="${atsContent.btnIcon}"/></button>
                                <button class="buy-now-btn mobile">In winkelwagen<img src="${atsContent.btnIcon}"/></button>
                            </div>
                        </div>
                    </div>
                    <div class="discount-line">Hoe meer je bestelt, hoe hoger je korting.</div>
                </div>
            </div>`
        );
        const buyNowButton = document.querySelector('.form .\\#button');
        const atsButton = document.querySelector('.buy-now-btn');
        if (buyNowButton) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            document.querySelector('.sticky-ats-wrapper').classList.add('active')
                            const interval = setInterval(() => {
                                if (document.querySelector('#ShopifyChat') && document.querySelector('#smile-ui-lite-launcher-frame-container') && document.querySelector('#CookiebotWidget')) {
                                    clearInterval(interval);
                                    document.querySelector('#ShopifyChat').classList.add('active-ats');
                                    document.querySelector('#smile-ui-lite-launcher-frame-container').classList.add('active-ats');
                                    document.querySelector('#CookiebotWidget').classList.add('active-ats');
                                    document.querySelector('.styles_StickyWidget__').classList.add('active-ats');
                                }
                            }, 100)
                        } else {
                            document.querySelector('.sticky-ats-wrapper').classList.remove('active')
                            const interval = setInterval(() => {
                                if (document.querySelector('#ShopifyChat') && document.querySelector('#smile-ui-lite-launcher-frame-container') && document.querySelector('#CookiebotWidget')) {
                                    clearInterval(interval);
                                    document.querySelector('#ShopifyChat').classList.remove('active-ats');
                                    document.querySelector('#smile-ui-lite-launcher-frame-container').classList.remove('active-ats');
                                    document.querySelector('#CookiebotWidget').classList.remove('active-ats');
                                    document.querySelector('.styles_StickyWidget__').classList.remove('active-ats');
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

            waitForElement('.kaching-bundles', () => {
                const bundleContainer = document.querySelector('.kaching-bundles');
                if (bundleContainer) {
                    const priceObserver = new MutationObserver(() => {
                        const sourceEl = document.querySelector('.kaching-bundles__bar--selected .kaching-bundles__bar-label');
                        const targetEl = document.querySelector('.sticky-ats-wrapper .\\#price-item.\\@on-sale .\\#price-value');

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



            document.querySelector('.qty-minus').addEventListener('click', (button) => {
                const input = button.target.parentElement.querySelector('input');

                let value = parseInt(input.value, 10);
                const min = parseInt(input.min, 10) || 1;

                if (value > min) {
                    input.value = value - 1;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                }
            })
            document.querySelector('.qty-plus').addEventListener('click', (button) => {
                const input = button.target.parentElement.querySelector('input');

                let value = parseInt(input.value, 10);
                const max = parseInt(input.max, 10) || Infinity;

                if (value < max) {
                    input.value = value + 1;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                }
            })

            const buttonStateObserver = new MutationObserver(() => {
                if (buyNowButton.classList.contains('loading')) {
                    atsButton.classList.add('loading');
                } else {
                    atsButton.classList.remove('loading');
                }

                if (buyNowButton.classList.contains('added')) {
                    atsButton.classList.add('added');
                } else {
                    atsButton.classList.remove('added');
                }
            });

            buttonStateObserver.observe(buyNowButton, {
                attributes: true,
                attributeFilter: ["class", "disabled"]
            });

        }
        document.querySelector('.buy-now-btn').addEventListener('click', () => {
            buyNowButton.click();
        })

        const topInput = document.querySelector('.qty-input');
        const atsInput = document.querySelector('.input-quantity-wrapper input');

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