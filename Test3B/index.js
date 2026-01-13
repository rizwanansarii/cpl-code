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

    waitForElement(".shopify-section", ([producPage]) => {
        if (location.pathname === '/products' || location.pathname === '/products/') {
            return;
        } else {
            document.querySelector('body').classList.add(testInfo.className);
            const atsContent = {
                productName: document.querySelector('h1').innerHTML,
                price: document.querySelector('.price--show-badge .price__regular .price-item').innerHTML
            }
            document.querySelector('#MainContent').insertAdjacentHTML('afterbegin', `
                <div class="sticky-ats-wrapper">
                    <div class="text-wrapper">
                        <div class="product-info-wrapper">
                            <div class="product-name">${atsContent.productName}</div>
                            <div class="price">${atsContent.price}</div>
                        </div>
                        <div class="btn-wrapper"><button class="buy-now-btn">Buy Now</button></div>
                    </div>
                </div>`
            );

            document.querySelector('.buy-now-btn').addEventListener('click', () => {
                document.querySelector('.shopify-payment-button__button').click();
            })

            // side drawer
            const drawer = document.querySelector('.drawer');
            if (drawer) {
                const observer = new MutationObserver(() => {
                    updateDrawerContent();
                });

                observer.observe(drawer, { childList: true, subtree: true });
            }

            function updateDrawerContent() {
                console.log("Drawer updated — applying changes...");

                if (document.querySelector('.totals__subtotal').innerHTML == 'Subtotal') {
                    document.querySelector('.totals__subtotal').innerHTML = 'Total';
                    const wrapper = document.createElement('div');
                    wrapper.className = 'total-wrapper';
                    document.querySelector('.totals__subtotal').parentNode.insertBefore(wrapper, document.querySelector('.totals__subtotal'));
                    wrapper.appendChild(document.querySelector('.totals__subtotal'));
                    document.querySelector('.totals__subtotal').insertAdjacentHTML('afterend', `<div class="shipping-tag">Free Shipping</div>`)
                }
                // document.querySelector('.tax-note').insertAdjacentHTML('beforebegin', `<div class="shipping-tag">Free Shipping</div>`)
            }

        }

    });

})();