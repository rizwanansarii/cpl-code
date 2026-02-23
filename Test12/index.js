(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-012',
        debug: 0,
        testName: 'T12 | Show Cart Popup',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".n_pdp-pdp-page", () => {
        document.querySelector('body').classList.add(testInfo.className);
        function cartItems(cartDOM) {
            return `
            ${[...cartDOM.querySelectorAll('.shop-cart_body .shop-cart_item')].map((item) => `
            <div class="gmd-popup-product">
                <div class="gmd-product-left">
                    <div class="gmd-product-image">
                        <img src="${item.querySelector('.article img').src}" alt="${item.querySelector('.article img').alt}" />
                    </div>
                    <div class="gmd-product-name">${item.querySelector('.item-name').innerText}</div>
                </div>
                <div class="gmd-product-price">${item.querySelector('.total-price').innerText}</div>
            </div>`).join('')}`;
        }

        function fetchUpdatedCart() {
            fetch('https://www.ongediertebestrijden.shop/winkelwagen/')
                .then(response => response.text())
                .then(html => {

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    if (!document.querySelector('.gmd-cart-popup')) {
                        popupCartData(doc);
                        document.querySelector('body').classList.add('gmd-overflow-hidden');
                    } else {
                        document.querySelector('.gmd-item-cart-wrapper').innerHTML = cartItems(doc)
                        document.querySelector('.gmd-cart-summary .gmd-subtotal .gmd-price').innerHTML = doc.querySelector('.price-product-total-wrapper .price-product-total').innerText;
                        document.querySelector('.gmd-cart-summary .gmd-shipping-charge .gmd-price ').innerHTML = doc.querySelector('.price-shipping-wrapper .price-shipping').innerText;
                        document.querySelector('.gmd-cart-summary .gmd-total .gmd-price').innerHTML = doc.querySelector('.price-total-wrapper .price-total').innerText;
                        document.querySelector('.gmd-cart-popup').classList.add('gmd-active')
                        document.querySelector('body').classList.add('gmd-overflow-hidden')
                    }
                })
                .catch(err => console.error('Error fetching cart:', err));
        }

        function popupCartData(cartDOM) {
            const newPopup = `
            <div class="gmd-cart-popup gmd-active">
                <div class="gmd-cart-popup-overlay">
                    <div class="gmd-cart-popup-modal">
                    
                        <div class="gmd-popup-header">
                            <h3>Toegevoegd aan je mandje</h3>
                            <div class="gmd-popup-close-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <path d="M28 12.7121L26.2879 11L19.5 17.7879L12.7121 11L11 12.7121L17.7879 19.5L11 26.2879L12.7121 28L19.5 21.2121L26.2879 28L28 26.2879L21.2121 19.5L28 12.7121Z" fill="black" fill-opacity="0.75"/>
                                </svg>
                            </div>
                        </div>
                        <div class="gmd-item-cart-wrapper">
                            ${cartItems(cartDOM)}
                        </div>
    
                        <div class="gmd-cart-summary">
                        <div class="gmd-row gmd-subtotal">
                            <span class="gmd-heading-text">Subtotaal</span>
                            <span class="gmd-price">${cartDOM.querySelector('.price-product-total-wrapper .price-product-total').innerText}</span>
                        </div>
                        <div class="gmd-row gmd-shipping-charge">
                            <span class="gmd-heading-text">Verzendkosten</span>
                            <span class="gmd-price">${cartDOM.querySelector('.price-shipping-wrapper .price-shipping').innerText}</span>
                        </div>
                        <div class="gmd-row gmd-total">
                            <span class="gmd-heading-text">Totaal</span>
                            <span class="gmd-price">${cartDOM.querySelector('.price-total-wrapper .price-total').innerText}</span>
                        </div>
                        </div>
    
                        <div class="gmd-cart-actions">
                        <a href="/winkelwagen/" class="btn gmd-cart-btn">Direct afrekenen</a>
                        <a href="#" class="btn gmd-continue-shopping-btn">Verder winkelen</a>
                        </div>
    
                        <div class="gmd-cart-usp">${document.querySelector('.n_pdp-usp-list-wrapper').innerHTML}</div>
    
                        <div class="gmd-cart-payment-options">${cartDOM.querySelector('.payments-methods').innerHTML}</div>
                    </div>
                </div>
            </div>
            `;
            document.querySelector('body').insertAdjacentHTML("beforeend", newPopup);
            document.querySelectorAll('.gmd-popup-header .gmd-popup-close-btn, .gmd-cart-actions .gmd-continue-shopping-btn').forEach((e) => {
                e.addEventListener('click', () => {
                    document.querySelector('.gmd-cart-popup').classList.remove('gmd-active')
                    document.querySelector('body').classList.remove('gmd-overflow-hidden')
                })
            })
        }

        document.querySelector('.add-to-cart-by-popup').addEventListener('click', (e) => {
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (method, url) {
                if (typeof url === 'string' && url.includes('/winkelwagen/toevoegen/')) {
                    this.addEventListener('load', function () {
                        if (this.status === 200) {
                            fetchUpdatedCart();
                        }
                    });
                }
                return originalOpen.apply(this, arguments);
            };
        })
    });
})();