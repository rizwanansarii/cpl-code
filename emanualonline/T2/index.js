(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-02',
        debug: 0,
        testName: 'T2 | Optimize sticky add to cart footer',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".catalog-product-view", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        const atsContent = {
            productName: document.querySelector('.product-info-main .page-title')?.innerHTML,
            addToCartBtn: document.querySelector('.product-info-main #product-addtocart-button'),
            buyNowButton: document.querySelector('.product-info-main #product-quickbuy-button'),
            btnIcon: `<picture class="leading-5 text-white">
                        <img src="https://cdm.emanualonline.com/static/version1773240684/frontend/MageCloud/hyva/en_US/MageCloud_AmastyStripe/images/credit-cart-icon.png" alt="Credit Cart Payment Icons" width="37" height="30" class="p-0 m-0 max-w-full h-auto text-center align-middle border-0" loading="lazy">
                    </picture>`,
            price: document.querySelector('.product-info-main .price-final_price.price-box')?.innerHTML
        }

        if (!document.querySelector('.gmd-sticky-ats-wrapper')) {
            document.querySelector('body').insertAdjacentHTML('beforeend', `
                <div class="gmd-sticky-ats-wrapper">
                    <div class="gmd-ats-container">
                        <div class="gmd-ats-content-wrapper">
                            <div class="gmd-left-wrapper">
                                <div class="gmd-text-wrapper">
                                    <div class="gmd-product-info-wrapper">
                                        <div class="gmd-product-name">${atsContent.productName}</div>
                                        <div class="gmd-feature-bar">
                                            <div class="gmd-feature-item">
                                                <span class="gmd-feature-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <circle cx="10" cy="10" r="9.5" fill="white" stroke="#1EC28E"/>
                                                        <path d="M8.73609 13.8429L5.16108 10.3563C4.94631 10.1468 4.94631 9.80718 5.16108 9.59769L5.93888 8.8391C6.15366 8.62961 6.50193 8.62961 6.71671 8.8391L9.125 11.1878L14.2833 6.1571C14.4981 5.94763 14.8463 5.94763 15.0611 6.1571L15.8389 6.91569C16.0537 7.12516 16.0537 7.46479 15.8389 7.67428L9.51391 13.8429C9.29911 14.0524 8.95087 14.0524 8.73609 13.8429Z" fill="#1EC28E"/>
                                                    </svg>
                                                </span>
                                                <span class="gmd-feature-text">Lifetime Access</span>
                                            </div>
                                            <div class="gmd-feature-item">
                                                <span class="gmd-feature-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <circle cx="10" cy="10" r="9.5" fill="white" stroke="#1EC28E"/>
                                                        <path d="M8.73609 13.8429L5.16108 10.3563C4.94631 10.1468 4.94631 9.80718 5.16108 9.59769L5.93888 8.8391C6.15366 8.62961 6.50193 8.62961 6.71671 8.8391L9.125 11.1878L14.2833 6.1571C14.4981 5.94763 14.8463 5.94763 15.0611 6.1571L15.8389 6.91569C16.0537 7.12516 16.0537 7.46479 15.8389 7.67428L9.51391 13.8429C9.29911 14.0524 8.95087 14.0524 8.73609 13.8429Z" fill="#1EC28E"/>
                                                    </svg>
                                                </span>
                                                <span class="gmd-feature-text">Instant Download</span>
                                            </div>
                                            <div class="gmd-feature-item">
                                                <span class="gmd-feature-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <circle cx="10" cy="10" r="9.5" fill="white" stroke="#1EC28E"/>
                                                        <path d="M8.73609 13.8429L5.16108 10.3563C4.94631 10.1468 4.94631 9.80718 5.16108 9.59769L5.93888 8.8391C6.15366 8.62961 6.50193 8.62961 6.71671 8.8391L9.125 11.1878L14.2833 6.1571C14.4981 5.94763 14.8463 5.94763 15.0611 6.1571L15.8389 6.91569C16.0537 7.12516 16.0537 7.46479 15.8389 7.67428L9.51391 13.8429C9.29911 14.0524 8.95087 14.0524 8.73609 13.8429Z" fill="#1EC28E"/>
                                                    </svg>
                                                </span>
                                                <span class="gmd-feature-text">Printable & Searchable</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="gmd-price-stock-wrapper">
                                        <div class="gmd-price">${atsContent.price}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="gmd-btn-wrapper">
                                ${atsContent.buyNowButton ? `<button class="gmd-buy-now-btn relative">${atsContent.btnIcon}<span class="gmd-btn-text">Buy Now</span></button>` : ''}
                                ${atsContent.addToCartBtn ? `<button class="gmd-add-to-cart-btn relative"><span class="gmd-btn-text">Add to cart</span></button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>`
            );
        }
        const targetEl = document.querySelector('.product-info-main .product-add-form #product-quickbuy-button');
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
                        syncFloatingWidgets();
                    });
                },
                {
                    threshold: 0,
                }
            );
            observer.observe(targetEl);

            function syncFloatingWidgets() {
                const isActive = document.querySelector('.gmd-sticky-ats-wrapper')?.classList.contains('gmd-active');

                const selectors = [
                    '#chat-button',
                    '.whatsapp',
                ];

                selectors.forEach(selector => {
                    const el = document.querySelector(selector);
                    if (!el) return;
                    el.classList.toggle('gmd-active-ats', !!isActive);
                });
            }
            const bodyObserver = new MutationObserver(syncFloatingWidgets);

            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            syncFloatingWidgets();
        }

        function handleButtonClick(customBtnSelector, originalBtnSelector) {
            const customBtn = document.querySelector(customBtnSelector);
            const originalBtn = document.querySelector(originalBtnSelector);

            if (!customBtn || !originalBtn) return;

            customBtn.addEventListener('click', () => {
                originalBtn.click();
                customBtn.classList.add('is-loading');
                customBtn.insertAdjacentHTML('afterbegin', `
                    <div class="absolute inset-0 flex justify-center items-center loader">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" xml:space="preserve" width="32" height="32">
                            <path fill="#fff" d="M73 50c0-12.7-10.3-23-23-23S27 37.3 27 50m3.9 0c0-10.5 8.5-19.1 19.1-19.1S69.1 39.5 69.1 50">
                                <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
                            </path>
                        </svg>
                    </div>
                `);

                setTimeout(() => {
                    customBtn.classList.remove('is-loading');
                    customBtn.querySelector('.loader')?.remove();
                }, 1000);

            });
        }

        handleButtonClick('.gmd-buy-now-btn', '.product-info-main .product-add-form #product-quickbuy-button');
        handleButtonClick('.gmd-add-to-cart-btn', '.product-info-main .product-add-form #product-addtocart-button');

        if (document.querySelector('.gmd-price').innerText.length > 6) {
            document.body.classList.add('decrease-font-size');
        }
    })
})();
