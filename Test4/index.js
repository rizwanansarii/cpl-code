(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-sticky-ats',
        debug: 0,
        testName: 'T3 | Add Sticky ATS',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".single-product", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);
        document.querySelector('head').insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300..800&display=swap" rel="stylesheet">');

        const atsContent = {
            productName: document.querySelector('.product_title').innerHTML,
            price: document.querySelector('.entry-summary .price').innerHTML,
            image: document.querySelector('.wp-post-image').src,
            alt: document.querySelector('.wp-post-image').alt,
            tag: document.querySelector('.entry-summary .in-stock svg') ? document.querySelector('.entry-summary .in-stock svg').outerHTML : document.querySelector('.entry-summary .out-of-stock svg') ? document.querySelector('.entry-summary .out-of-stock svg').outerHTML : document.querySelector('.entry-summary .low-stock svg') ? document.querySelector('.entry-summary .low-stock svg').outerHTML : '',
            classForTag: document.querySelector('.entry-summary .in-stock svg') ? 'in-stock' : document.querySelector('.entry-summary .out-of-stock svg') ? 'out-of-stock' : document.querySelector('.entry-summary .low-stock svg') ? 'low-stock' : '',
            tagText: document.querySelector('.entry-summary .stock')?.innerText,
            quantity: document.querySelector('.input-text.qty').value,
            minQuantity: document.querySelector('.input-text.qty').min,
            maxQuantity: document.querySelector('.input-text.qty').getAttribute('max'),
            btnIcon: document.querySelector('.single_add_to_cart_button svg').outerHTML,
            btnText: document.querySelector('.single_add_to_cart_button').innerText,
        }
        document.querySelector('body').insertAdjacentHTML('beforeend', `
            <div class="sticky-ats-wrapper">
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
                                <div class="${atsContent.classForTag} stock">${atsContent.tag}<p class="${atsContent.classForTag + '-text'} tag-text">${atsContent.tagText}</p></div>
                            </div>
                        </div>
                    </div>
                    <div class="quantity-buy-btn-wrapper">
                        <div class="input-quantity-wrapper">
                            <input type="number" min="${atsContent.minQuantity}" max="${atsContent.maxQuantity}" class="quantity" value="${atsContent.quantity}" />
                        </div>
                        <div class="btn-wrapper">
                            <button class="buy-now-btn">${atsContent.btnIcon}${atsContent.btnText}</button>
                        </div>
                    </div>
                </div>
            </div>`
        );
        const buyNowButton = document.querySelector('.single_add_to_cart_button');
        const atsButton = document.querySelector('.buy-now-btn');
        if (buyNowButton) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            document.querySelector('.sticky-ats-wrapper').classList.add('active')
                            const interval = setInterval(() => {
                                if (document.querySelector('[id^="trustbadge-container-"]')) {
                                    clearInterval(interval);
                                    document.querySelector('[id^="trustbadge-container-"]').classList.add('trustbadge-container');
                                }
                            })
                        } else {
                            document.querySelector('.sticky-ats-wrapper').classList.remove('active')
                            const interval = setInterval(() => {
                                if (document.querySelector('[id^="trustbadge-container-"]')) {
                                    clearInterval(interval);
                                    document.querySelector('[id^="trustbadge-container-"]').classList.remove('trustbadge-container');
                                }
                            })
                        }
                    });
                },
                {
                    threshold: 0,
                }
            );
            observer.observe(buyNowButton);

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
                attributeFilter: ["class"]
            });

        }
        document.querySelector('.buy-now-btn').addEventListener('click', () => {
            buyNowButton.click();
        })

        const topInput = document.querySelector('.input-text.qty');
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

            const observeTarget = topInput.closest('.product-options-wrapper') || document.body;

            observer.observe(observeTarget, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }
    });

})();