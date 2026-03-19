(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-03',
        debug: 0,
        testName: 'T3 | Sticky CTA onder aan elke PDP ',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    // Function to format prices based on locale
    function formatEuro(price) {
        // Format the price using Intl.NumberFormat
        return new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    }

    function updateStickyPrice(qty) {
        const taxIncl = document.querySelector('#vat-switch').checked
        const priceEl = document.querySelector('.gmd-price');
        if (!priceEl) return;

        /* ---------- CASE 1: TABLE STRUCTURE ---------- */

        const tableRows = document.querySelectorAll('tbody tr[data-qty]');

        if (tableRows.length) {

            let selectedRow = null;

            tableRows.forEach(row => {
                const rowQty = parseInt(row.dataset.qty, 10);

                if (qty >= rowQty) {
                    selectedRow = row;
                }
            });

            if (!selectedRow) selectedRow = tableRows[0];

            const unitPrice = taxIncl ? parseFloat(selectedRow.dataset.priceIncl.replace('€', '').replace(',', '.')) : parseFloat(selectedRow.dataset.priceExcl.replace('€', '').replace(',', '.'));
            const rowQty = parseInt(selectedRow.dataset.qty);

            priceEl.textContent = '€' + formatEuro((unitPrice / rowQty) * qty);

            return;
        }

        /* ---------- CASE 2: RADIO DISCOUNT STRUCTURE ---------- */

        const discountInputs = document.querySelectorAll('.discount-quantity');

        if (discountInputs.length) {

            let selectedTier = null;

            discountInputs.forEach(input => {

                const step = parseInt(input.dataset.step, 10);
                const tierQty = parseInt(input.value, 10);

                if (qty >= tierQty * step) {
                    selectedTier = input;
                }

            });

            if (!selectedTier) selectedTier = discountInputs[0];

            const step = parseInt(selectedTier.dataset.step, 10);
            const unitPrice = taxIncl ? parseFloat(selectedTier.dataset.priceIncl) : parseFloat(selectedTier.dataset.priceExcl);
            const totalQty = qty;
            const totalPrice = (unitPrice / step) * totalQty;

            priceEl.textContent = formatEuro(totalPrice);

            return;
        }

        /* ---------- CASE 3: SIMPLE PRICE ---------- */

        const basePriceEl = document.querySelector('.price-stock .price .new-price.show');

        if (basePriceEl) {

            const unitPrice = parseFloat(basePriceEl.textContent.match(/[\d,]+/)[0].replace(',', '.'));

            priceEl.textContent = formatEuro(unitPrice * qty);

        }

    }

    waitForElement(".productpage .btn-GA_add_to_cart", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        const atsContent = {
            productName: document.querySelector('.product-details-inner .product-title')?.innerHTML,
            productCode: document.querySelector('.product-details-inner .product-code .text-muted')?.innerText,
            price: document.querySelector('.product-details-inner .new-price.price-new-excl')?.innerText,
            quantity: parseInt(document.querySelector('.product-details-inner .realQuantity')?.value, 10),
            step: parseInt(document.querySelector('.product-details-inner .fakeQuantity')?.step, 10),
            // minQuantity: document.querySelector('.shopify-section .\\#product-meta .qty-input')?.min,
            // maxQuantity: document.querySelector('.shopify-section .\\#product-meta .qty-input')?.getAttribute('max'),
            // btnIcon: document.querySelector('.shopify-section .\\#product-meta .form img')?.src,
            // btnText: document.querySelector('.shopify-section .\\#product-meta .form .\\#button')?.innerText,
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
                                        <div class="gmd-product-code"><span class="gmd-code-text">Artikelcode: </span>${atsContent.productCode}</div>
                                    </div>
                                    <div class="gmd-price-stock-wrapper">
                                        <div class="gmd-price">${atsContent.price}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="gmd-quantity-buy-btn-wrapper">
                                <div class="gmd-input-quantity-wrapper">
                                <input type="number" min="1" class="quantity" value="${atsContent.quantity * atsContent.step}" />
                                <button class="gmd-qty-minus">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                        <path d="M0.403198 0.295654L5.9032 7.79565L11.4032 0.295654" stroke="black"/>
                                    </svg>
                                    </button>
                                <button class="gmd-qty-plus">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                        <path d="M0.403198 8.34546L5.9032 0.845459L11.4032 8.34546" stroke="black"/>
                                    </svg>
                                </button>
                                </div>
                                <div class="gmd-btn-wrapper">
                                    <button class="gmd-buy-now-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <g clip-path="url(#clip0_1976_125)">
                                                <path d="M14.67 9.25889L15.9831 3.48111C16.0779 3.06394 15.7609 2.66669 15.3331 2.66669H4.42244L4.16783 1.42197C4.10439 1.11172 3.83139 0.888916 3.51469 0.888916H0.666667C0.298472 0.888916 0 1.18739 0 1.55558V2.00003C0 2.36822 0.298472 2.66669 0.666667 2.66669H2.60786L4.55919 12.2066C4.09236 12.475 3.77778 12.9784 3.77778 13.5556C3.77778 14.4147 4.47422 15.1111 5.33333 15.1111C6.19244 15.1111 6.88889 14.4147 6.88889 13.5556C6.88889 13.1202 6.70981 12.7268 6.42156 12.4445H12.2451C11.9569 12.7268 11.7778 13.1202 11.7778 13.5556C11.7778 14.4147 12.4742 15.1111 13.3333 15.1111C14.1924 15.1111 14.8889 14.4147 14.8889 13.5556C14.8889 12.9397 14.5309 12.4075 14.0117 12.1554L14.1649 11.4811C14.2597 11.0639 13.9427 10.6667 13.5149 10.6667H6.05881L5.877 9.7778H14.0199C14.3312 9.7778 14.601 9.56242 14.67 9.25889Z" fill="white"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1976_125">
                                                <rect width="16" height="16" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        In winkelwagen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            );
        }
        const buyNowButton = document.querySelector('.product-details-inner .product-cart .btn-GA_add_to_cart');
        const atsButton = document.querySelector('.gmd-buy-now-btn');
        if (buyNowButton) {
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
            observer.observe(buyNowButton);

            const stepInput = document.querySelector('.product-details-inner .fakeQuantity');
            let stepValue = parseInt(stepInput.step, 10);
            document.querySelector('.gmd-qty-minus').addEventListener('click', (button) => {
                document.querySelector('.product-details-inner a.down').click();
            })
            document.querySelector('.gmd-qty-plus').addEventListener('click', (button) => {
                document.querySelector('.product-details-inner a.up').click();
            })

        }
        document.querySelectorAll('.gmd-buy-now-btn').forEach((e) => {
            e.addEventListener('click', () => {
                buyNowButton.click();
            })
        })

        const topInput = document.querySelector('.product-details-inner .fakeQuantity');
        const realInput = document.querySelector('.product-details-inner .realQuantity');
        const atsInput = document.querySelector('.gmd-input-quantity-wrapper input');

        if (topInput && atsInput) {

            function sync(from, to) {
                if (to.value !== from.value) {
                    to.value = from.value;
                    to.dispatchEvent(new Event("input", { bubbles: true }));
                    if (to.closest('.gmd-input-quantity-wrapper')) {
                        to.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                    if (from.closest('.gmd-input-quantity-wrapper')) {
                    }
                    realInput.value = Math.floor(to.value / atsContent.step);
                }
            }

            function onFocusOut() {
                atsInput.addEventListener('focusout', (e) => {
                    if (!(e.target.value % atsContent.step) == 0) {
                        window.alert(`Vul een juist aantal in met een stap van ${atsContent.step}`)
                        e.target.value = Math.floor(e.target.value / atsContent.step) * atsContent.step;
                        topInput.value = Math.floor(e.target.value / atsContent.step) * atsContent.step;
                    }
                })
            }
            onFocusOut();

            topInput.addEventListener("input", () => sync(topInput, atsInput));
            atsInput.addEventListener("input", () => sync(atsInput, topInput));
            const observeTarget = document.body;

            const observer = new MutationObserver(() => {
                observer.disconnect();

                sync(topInput, atsInput);
                sync(atsInput, topInput);
                const qty = parseInt(topInput.value, 10) || 1;
                updateStickyPrice(qty);

                observer.observe(observeTarget, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                });
            });


            observer.observe(observeTarget, {
                childList: true,
                subtree: true,
                attributes: true,
            });
            const qty = parseInt(topInput.value, 10) || 1;
            const step = parseInt(atsContent.step, 10) || 1;
            updateStickyPrice(qty);
        }

        function setBottom(el, offset, innerSelector = null) {
            if (!el) return;

            if (el.shadowRoot) {
                if (innerSelector) {
                    const innerEl = el.shadowRoot.querySelector(innerSelector);
                    if (!innerEl) return;

                    innerEl.style.bottom = offset + 'px';
                    if (innerSelector == '.watermelon-eyecatcher') {
                        innerEl.style.bottom = 74 + offset + 'px';
                    }
                    innerEl.style.position = 'fixed';
                    innerEl.style.transition = 'bottom 0.3s ease';

                }
            } else {
                el.style.bottom = offset + 74 + 'px';
                el.style.position = 'fixed';
            }
        }

        function handleScroll() {
            const widget = document.querySelector('watermelon-widget-button');
            const stickyBar = document.querySelector('.gmd-sticky-ats-wrapper');

            if (!widget || !widget.shadowRoot) return;

            let offset = 16; // default spacing

            if (stickyBar) {
                const rect = stickyBar.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

                if (isVisible) {
                    offset += rect.height;
                }
            }

            setBottom(document.querySelector('watermelon-widget-button'), offset, '.watermelon-widget-button');
            setBottom(document.querySelector('#watermelon-widget-wrapper'), offset);
            setBottom(document.querySelector('watermelon-eyecatcher-message'), offset, '.watermelon-eyecatcher');
        }

        const interval = setInterval(() => {
            const widget = document.querySelector('watermelon-widget-button');

            if (widget && widget.shadowRoot) {
                clearInterval(interval);
                handleScroll();
            }
        }, 200);

        handleScroll();

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        window.addEventListener('resize', handleScroll);
    })
})();
