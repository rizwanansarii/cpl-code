(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-progress-bar',
        debug: 0,
        testName: 'T5 | Progress Bar and Cart on Checkout',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement("body.cart-index", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);
        document.querySelector('h1.page-title').closest('div').classList.add('heading-wrapper');
        document.querySelector('.heading-wrapper').insertAdjacentHTML('afterend', `
            <div class="free-shipping-progress">
            
                <div class="fsp-bar">
                    <div class="fsp-bar-fill"></div>
                    <div class="fsp-bar-dot"></div>
                </div>
                <p class="fsp-text">
                    Je bent er bijna… Besteed nog <span class="fsp-remaining">€ 0</span> voor gratis verzending.
                </p>
            </div>
            `
        );

        function parseEuro(str) {
            return parseFloat(str.replace(/[^\d,,-]/g, '').replace(',', '.')) || 0;
        }

        let observer = null;
        let isUpdating = false;

        function updateBar() {

            if (isUpdating) return;
            isUpdating = true;

            if (observer) observer.disconnect();

            // const subtotalEl = document.querySelector("#cart-totals .cart-totals-row:nth-child(1) .price");
            const shippingEl = document.querySelector("#cart-totals .cart-totals-row:nth-child(2) .price");
            const totalAmountEl = document.querySelector("#cart-totals .cart-totals-row h4");

            if (!totalAmountEl || !shippingEl) {
                isUpdating = false;
                observe();
                return;
            }

            const totalAmount = parseEuro(totalAmountEl.textContent);
            const shipping = parseEuro(shippingEl.textContent);

            const freeShippingLimit = shipping <= 10 ? 100 : 350;

            let remaining = freeShippingLimit - (totalAmount - shipping);
            if (remaining < 0) remaining = 0;

            let percent = (totalAmount / freeShippingLimit) * 100;
            if (percent > 100) percent = 100;

            const fspText = document.querySelector(".fsp-text");
            const remEl = document.querySelector(".fsp-remaining");
            const fillEl = document.querySelector(".fsp-bar-fill");
            const dotEl = document.querySelector(".fsp-bar-dot");

            if (fspText) {
                if (remaining <= 0) {
                    fspText.innerHTML = `Gefeliciteerd! Je hebt genoeg besteed voor gratis verzending.`;
                    fspText.classList.add('zero-shipping');
                } else {
                    remEl.textContent = "€ " + remaining.toFixed(2).replace('.', ',');
                    fspText.innerHTML = `Je bent er bijna… Besteed nog <span class="fsp-remaining">${remEl.textContent}</span> voor gratis verzending.`;
                    fspText.classList.remove('zero-shipping');
                }
            }
            if (fillEl) fillEl.style.width = percent + "%";
            if (dotEl) dotEl.style.left = percent + "%";

            setTimeout(() => {
                observe();
                isUpdating = false;
            }, 50);
        }

        function observe() {
            const root = document.querySelector("#cart-index");
            if (!root) return;

            if (observer) observer.disconnect();

            observer = new MutationObserver((mutations) => {

                if ([...mutations].some(m => m.target.closest(".free-shipping-progress"))) {
                    return;
                }

                updateBar();
            });

            observer.observe(root, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        updateBar();
    })

    waitForElement(".route-checkout", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);
        document.querySelector('.checkout-block').parentElement.classList.add('left-block')
        function loadCartIframe() {
            return new Promise((resolve) => {
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                iframe.src = "https://www.badkamerxxl.nl/cart";

                document.body.appendChild(iframe);

                iframe.onload = () => {
                    const cartDoc = iframe.contentDocument;

                    // Wait for stock-status text to load
                    let attempts = 0;
                    const wait = setInterval(() => {
                        attempts++;

                        const products = cartDoc.querySelectorAll(".row .cart-product-title");
                        const stockEls = cartDoc.querySelectorAll(".stock-status span");

                        if (products.length && stockEls.length) {
                            clearInterval(wait);

                            cartDoc.querySelectorAll('#cart-index .cart-product-title').forEach((el) => {
                                el.closest('.row').classList.add('cart-product');
                            })

                            let content = [];
                            let totals = {};

                            cartDoc.querySelectorAll('.cart-product').forEach((el, index) => {
                                content[index] = {};
                                content[index].title = el.querySelector('.cart-product-title').innerText;
                                content[index].image = el.querySelector('.cart-product-image').src;
                                content[index].alt = el.querySelector('.cart-product-image').alt;
                                content[index].stockStatus = el.querySelector('.stock-status').innerHTML;
                                content[index].amount = el.querySelector('.price').innerText;
                            })

                            totals.subtotal = cartDoc.querySelector('#cart-totals .cart-totals-row:nth-child(1) .price')?.innerText;
                            totals.shipping = cartDoc.querySelector('#cart-totals .cart-totals-row:nth-child(2) .price')?.innerText;
                            totals.toBePaid = cartDoc.querySelector('#cart-totals .cart-totals-row h4 .price')?.innerText;
                            totals.taxLine = cartDoc.querySelector('#cart-totals .cart-totals-row .small')?.innerText;

                            iframe.remove();
                            resolve({ content, totals });
                        }

                        // fail-safe
                        if (attempts > 50) {
                            clearInterval(wait);
                            iframe.remove();
                            resolve({ content: [], totals: {} });
                        }
                    }, 150);
                };
            });
        }
        function setSummaryMaxHeight() {
            const items = document.querySelectorAll('.item-wrapper');
            const container = document.querySelector('.summary-items');
            if (!items.length || !container) return;

            let height = 0;

            for (let i = 0; i < Math.min(2, items.length); i++) {
                height += items[i].offsetHeight;
            }

            height += 50;

            container.style.maxHeight = height + "px";
            container.style.overflowY = "auto";
        }
        loadCartIframe().then(({ content, totals }) => {
            document.querySelector('.checkout-block').insertAdjacentHTML('afterend', `
                    <div class="summary-box">
                        <div class="summary-header">
                            <h3>Overzicht</h3>
                            <a href="https://www.badkamerxxl.nl/cart" class="edit-link">Bewerken</a>
                        </div>

                        <div class="summary-items">
                            ${content.map((item) => `
                                <div class="item-wrapper">
                                    <div class="summary-item">
                                        <div class="image-wrapper">
                                            <img src="${item.image}" alt="${item.alt}" class="item-image">
                                        </div>

                                        <div class="item-info">
                                            <h3 class="item-title">${item.title}</h3>
                                            <p class="item-subline">${item.stockStatus}</p>
                                        </div>

                                    </div>
                                    <p class="item-price">${item.amount}</p>
                                </div>

                                <div class="divider"></div>`).join('')}

                        </div>

                        <div class="divider-lg"></div>

                        <!-- TOTALS -->
                        <div class="summary-totals">
                            <div class="total-row">
                                <span>Subtotaal</span>
                                <span class="price">${totals.subtotal}</span>
                            </div>

                            <div class="total-row">
                                <span>Verzendkosten</span>
                                <span class="price green">${totals.shipping}</span>
                            </div>

                            <div class="total-row total-pay">
                                <span>Te betalen</span>
                                <span class="price total-amount">${totals.toBePaid}</span>
                            </div>

                            <p class="vat-info">${totals.taxLine}</p>
                        </div>

                    </div>
                    <div class="summary-mobile-wrapper">
                        <div class="summary-header">
                            <h3>Overzicht bestelling</h3>
                        </div>
                            
                        <div class="cart-wrapper">
                            <a href="https://www.badkamerxxl.nl/cart" class="edit-link">Bewerken</a>
                            <div class="summary-items">
                                ${content.map((item) => `
                                    <div class="item-wrapper">
                                        <div class="summary-item">
                                            <div class="image-wrapper">
                                                <img src="${item.image}" alt="${item.alt}" class="item-image">
                                            </div>

                                            <div class="item-info">
                                                <h3 class="item-title">${item.title}</h3>
                                                <p class="item-subline">${item.stockStatus}</p>
                                            </div>

                                        </div>
                                        <p class="item-price">${item.amount}</p>
                                    </div>

                                    <div class="divider"></div>`).join('')}

                            </div>

                            <div class="divider-lg"></div>

                            <!-- TOTALS -->
                            <div class="summary-totals">
                                <div class="total-row">
                                    <span>Subtotaal</span>
                                    <span class="price">${totals.subtotal}</span>
                                </div>

                                <div class="total-row">
                                    <span>Verzendkosten</span>
                                    <span class="price green">${totals.shipping}</span>
                                </div>

                                <div class="total-row total-pay">
                                    <span>Te betalen</span>
                                    <span class="price total-amount">${totals.toBePaid}</span>
                                </div>

                                <p class="vat-info">${totals.taxLine}}</p>
                            </div>
                        </div>
                    </div>
                    `
            )
            setSummaryMaxHeight();
            document.querySelector('.summary-mobile-wrapper .summary-header h3').addEventListener("click", function (e) {

                const header = e.target.closest(".summary-mobile-wrapper");
                if (!header) return;

                header.classList.toggle("open");
            });
        });

    });
})();