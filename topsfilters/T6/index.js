(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-06',
        debug: 0,
        testName: 'T6 | Toon een sticky add to cart button zodra de main CTA gepasseerd is',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const replaceEuroSignAndDecimals = () => {
        const elements = document.querySelectorAll('.gmd-sticky-ats-wrapper .woocommerce-Price-amount bdi');

        elements.forEach((bdi) => {
            let text = bdi.textContent;

            if (!text) return;

            let updated = text
                .replaceAll('€', '')
                .replaceAll(',00', ',-')
            // .trim();

            // Only update if changed
            if (updated !== text.trim()) {
                bdi.textContent = updated;
            }
        });
    };

    waitForElement(".catalog-product-view", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        const atsContent = {
            productName: document.querySelector('.product-info-main .title-cart-checkout')?.innerHTML,
            productImage: document.querySelector('.product-info-main #gallery .invisible')?.src,
            productAlt: document.querySelector('.product-info-main #gallery .invisible')?.alt,
            addToCartBtn: document.querySelector('.product-info-main #product-addtocart-button').outerHTML,
            price: document.querySelector('.product-info-main .price-final_price')
        }

        function loadTest() {
            if (!document.querySelector('.gmd-sticky-ats-wrapper')) {
                document.querySelector('body').insertAdjacentHTML('beforeend', `
                        <div class="gmd-sticky-ats-wrapper">
                            <div class="gmd-ats-container columns">
                                <div class="gmd-ats-content-wrapper">
                                    <div class="gmd-product-wrapper">
                                        <div class="image-wrapper">
                                            <img src="${atsContent.productImage}" alt="${atsContent.productAlt}"/>
                                        </div>
                                        <div class="gmd-text-wrapper">
                                            <div class="gmd-product-info-wrapper">
                                                <div class="gmd-product-name">${atsContent.productName}</div>
                                                <div class="gmd-product-usp">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0362 4.76351C15.2049 4.93228 15.2997 5.16116 15.2997 5.39981C15.2997 5.63846 15.2049 5.86733 15.0362 6.03611L7.83618 13.2361C7.6674 13.4048 7.43853 13.4996 7.19988 13.4996C6.96123 13.4996 6.73235 13.4048 6.56358 13.2361L2.96358 9.63611C2.79964 9.46637 2.70892 9.23902 2.71097 9.00305C2.71302 8.76707 2.80767 8.54134 2.97454 8.37447C3.14141 8.2076 3.36714 8.11295 3.60312 8.1109C3.83909 8.10885 4.06644 8.19957 4.23618 8.36351L7.19988 11.3272L13.7636 4.76351C13.9324 4.59478 14.1612 4.5 14.3999 4.5C14.6385 4.5 14.8674 4.59478 15.0362 4.76351Z" fill="#00B900"/>
                                                    </svg>
                                                    <span>100 dagen <b>gratis retour</b></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="gmd-price-stock-wrapper">
                                            <div class="gmd-price">${atsContent.price.outerHTML}</div>
                                        </div>
                                        <div class="gmd-btn-wrapper">
                                            ${atsContent.addToCartBtn}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                );
            }

            const targetEl = document.querySelector('.product-info-main #product-addtocart-button');
            if (targetEl) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            const sticky = document.querySelector('.gmd-sticky-ats-wrapper');
                            if (!entry.isIntersecting) {
                                sticky.classList.add('gmd-active');
                            } else {
                                sticky.classList.remove('gmd-active');
                            }
                        });
                    },
                    {
                        threshold: 0,
                    }
                );
                observer.observe(targetEl);
            }

            function handleButtonClick(customBtnSelector, originalBtnSelector) {
                const customBtn = document.querySelector(customBtnSelector);
                const originalBtn = document.querySelector(originalBtnSelector);

                if (!customBtn || !originalBtn) return;

                customBtn.addEventListener('click', () => {
                    originalBtn.click();
                });
            }

            // replaceEuroSignAndDecimals()
            handleButtonClick('.gmd-btn-wrapper #product-addtocart-button', '.product-info-main #product-addtocart-button');
        }
        loadTest();
    })
})();
