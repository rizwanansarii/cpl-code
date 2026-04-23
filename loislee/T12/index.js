(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-12',
        debug: 0,
        testName: 'T12 | Verbeterde sticky add to cart op PDP',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const replaceEuroSignAndDecimals = () => {
        // Traverse all elements on the page
        const elements = document.querySelectorAll('.gmd-sticky-ats-wrapper .woocommerce-Price-amount');
        // Loop through each element
        elements.forEach((element) => {
            // Only process elements with child nodes of type Text
            element.childNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // Replace € and ",00" in the text content
                    const updatedText = node.nodeValue
                        .replaceAll('€ ', '').replaceAll('€', '')
                    // Update the node content if there's a change
                    if (updatedText !== node.nodeValue) {
                        node.nodeValue = updatedText;
                    }
                    if (node.nodeValue.includes(",00")) {
                        console.log(element, node.nodeValue)
                        const updatedText1 = node.nodeValue
                            .replaceAll(',00', ',-')
                        // Update the node content if there's a change
                        if (updatedText1 !== node.nodeValue) {
                            node.nodeValue = updatedText1;
                        }
                    }
                }
            });
        });
    };

    waitForElement(".single-product .product", ([producPage]) => {
        if (!document.querySelector('.wcsatt-options-wrapper')) {
            document.querySelector('body').classList.add(testInfo.className);

            const atsContent = {
                productName: document.querySelector('.product .product_title')?.innerHTML,
                productImage: document.querySelector('.product .woocommerce-product-gallery__image .wp-post-image')?.src,
                productAlt: document.querySelector('.product .woocommerce-product-gallery__image .wp-post-image')?.alt,
                addToCartBtn: document.querySelector('.product .single_add_to_cart_button').outerHTML,
                price: document.querySelector('.product .price')?.outerHTML
            }

            function loadTest() {
                if (!document.querySelector('.gmd-sticky-ats-wrapper')) {
                    document.querySelector('body').insertAdjacentHTML('beforeend', `
                        <div class="gmd-sticky-ats-wrapper">
                            <div class="gmd-ats-container">
                                <div class="gmd-ats-content-wrapper">
                                    <div class="gmd-product-wrapper">
                                        <div class="image-wrapper">
                                            <img src="${atsContent.productImage}" alt="${atsContent.productAlt}"/>
                                        </div>
                                        <div class="gmd-text-wrapper">
                                            <div class="gmd-product-info-wrapper">
                                                <div class="gmd-product-name">${atsContent.productName}</div>
                                            </div>
                                            <div class="gmd-price-stock-wrapper">
                                                <div class="gmd-price">${atsContent.price}</div>
                                            </div>
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
                const targetEl = document.querySelector('.product .single_add_to_cart_button');
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
                            document.querySelector('#launcher'),
                            document.querySelector('iframe[name="Messaging window"]'),
                            document.querySelector('[aria-label*="Ruby says"]'),
                            document.querySelector('#to-top'),
                            document.querySelector('iframe[title="Close message"]')?.closest('div')?.parentElement,
                            document.querySelector('.cky-revisit-bottom-left'),
                        ];

                        selectors.forEach(selector => {
                            const el = selector;
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
                    });

                    const observer = new MutationObserver(() => {
                        const customBtn = document.querySelector(customBtnSelector);
                        const originalBtn = document.querySelector(originalBtnSelector);
                        const cloneBtn = originalBtn?.closest('form').querySelector('.added_to_cart')?.cloneNode(true)
                        if (originalBtn && originalBtn.innerText != customBtn.innerText) {
                            customBtn.innerHTML = originalBtn.innerText
                        }
                        if (originalBtn && originalBtn.classList.contains('added')) {
                            customBtn.classList.add('added');
                        }
                        if (originalBtn && originalBtn.closest('form').querySelector('.added_to_cart')) {
                            if (!document.querySelector('.gmd-btn-wrapper .added_to_cart')) {
                                customBtn.closest('.gmd-btn-wrapper').insertAdjacentElement('beforeend', cloneBtn)
                            }
                        }
                        replaceEuroSignAndDecimals();

                    })


                    observer.observe(document.querySelector('.product'), {
                        childList: true,
                        subtree: true
                    })
                }

                replaceEuroSignAndDecimals()
                handleButtonClick('.gmd-btn-wrapper .single_add_to_cart_button', '.product .single_add_to_cart_button');

                if (document.querySelector('.gmd-price').innerText.length > 6) {
                    document.body.classList.add('decrease-font-size');
                }
            }
            loadTest();
            const testMutation = new MutationObserver(() => {
                if (!document.querySelector('.gmd-sticky-ats-wrapper')) {
                    loadTest();
                }
            })
            testMutation.observe(document.body, {
                childList: true,
                subtree: true,
            })
        }
    })
})();
