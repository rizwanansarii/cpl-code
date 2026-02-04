(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-saved-amount',
        debug: 0,
        testName: 'T6 | Add Saved Amount',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function formatEuro(value) {
        return `€${value.toFixed(2).replace('.', ',')}`;
    }

    // function formatEurowithoutSign(value) {
    //     return `${value.toFixed(2).replace('.', ',')}`;
    // }

    function formatEurowithoutSign(value) {
        return new Intl.NumberFormat('nl-NL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    function parseEuro(str) {
        return parseFloat(str.replace(/[^\d,,-]/g, '').replace(',', '.')) || 0;
    }

    function getDiscountData(oldPriceEl, basePriceEl, qtyEl) {
        if (!oldPriceEl || !basePriceEl) return null;

        const oldPrice = parseEuro(oldPriceEl.textContent);
        const basePrice = parseEuro(basePriceEl.textContent);
        const qty = qtyEl ? parseEuro(qtyEl.value || qtyEl.textContent) : 1;

        const savedAmount = (oldPrice - basePrice) * qty;
        const discountPercent = Math.round((savedAmount / (oldPrice * qty)) * 100);

        return { oldPrice, basePrice, qty, savedAmount, discountPercent };
    }

    function renderDiscount(target, data, extraClass = '', whereToInsert) {
        if (!target || !data || data.savedAmount <= 0) return;

        target.querySelector('.saved-amount')?.remove();
        target.querySelector('.saved-discount')?.remove();

        if (data.oldPrice > 100) {
            target.insertAdjacentHTML(
                whereToInsert,
                `<span class="saved-amount ${extraClass}">Je bespaart ${formatEuro(data.savedAmount)}</span>`
            );
        } else {
            target.insertAdjacentHTML(
                whereToInsert,
                `<span class="saved-discount ${extraClass}">Je bespaart -${data.discountPercent}%</span>`
            );
        }
    }



    function observeAndRun(target, callback) {
        if (!target) return;

        const mo = new MutationObserver(() => {
            mo.disconnect();
            callback();
            mo.observe(target, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });

        mo.observe(target, {
            childList: true,
            subtree: true,
            characterData: true
        });

        callback();
    }

    waitForElement("body.page-product-bundle", () => {
        document.querySelector('body').classList.add(testInfo.className);

        function updateBundles() {

            const oldPriceEl = document.querySelector('.bundle-info .control-wrapper .product-info-price-wrapper .old-price .price-excluding-tax .price');
            const basePriceEl = document.querySelector('.bundle-info .control-wrapper .product-info-price-wrapper [data-price-type="basePrice"] .price');

            const discountData = getDiscountData(oldPriceEl, basePriceEl);

            const target = document.querySelector('.bundle-info .control-wrapper .product-info-price-wrapper .special-price [data-price-type="basePrice"]');
            const data = {
                oldPrice: discountData.oldPrice,
                savedAmount: discountData.savedAmount,
                discountPercent: discountData.discountPercent
            }
            renderDiscount(target, data, '', 'afterbegin');
        }

        const priceContainer = document.querySelector('.bundle-info .control-wrapper');
        observeAndRun(priceContainer, updateBundles);
    });

    waitForElement(".block-minicart", () => {
        document.querySelector('body').classList.add(testInfo.className);

        function updateMiniCart() {
            document.querySelectorAll('.block-minicart .minicart-items-wrapper .product-item')
                .forEach(item => {

                    const oldPriceEl = item.querySelector('.price-wrapper .old-price .price');
                    const basePriceEl = item.querySelector('.price-wrapper .special-price .price');
                    const qtyTarget = item.querySelector('.product-qty');
                    const qtyEl = item.querySelector('.product-qty .qty');

                    if (oldPriceEl) {
                        const discountData = getDiscountData(oldPriceEl, basePriceEl, qtyEl)
                        const data = {
                            oldPrice: discountData.oldPrice,
                            savedAmount: discountData.savedAmount,
                            discountPercent: discountData.discountPercent
                        }

                        renderDiscount(qtyTarget, data, 'mini', 'beforeend');
                    }

                });
        }

        const miniCart = document.querySelector('.block-minicart');
        observeAndRun(miniCart, updateMiniCart);

    });

    waitForElement(".cart-summary", () => {
        document.querySelector('body').classList.add(testInfo.className);
        const cartItem = document.querySelectorAll('#shopping-cart-table > .cart.item')
        if (cartItem) {
            let totalSavedAmount = 0;
            let totalWithoutDisc = 0;
            document.querySelectorAll('#shopping-cart-table > .cart.item').forEach((item) => {
                if (item.querySelectorAll('.subtotal .cart-price').length > 1) {
                    const oldPriceEl = item.querySelector('.subtotal .cart-price:nth-child(1) .price');
                    const basePriceEl = item.querySelector('.subtotal .cart-price:nth-child(2) .price');
                    const qtyEl = item.querySelector('.input-text.qty');
                    const target = item.querySelector('.price-excluding-tax');

                    if (oldPriceEl) {
                        const oldPrice = parseEuro(oldPriceEl.textContent);
                        const basePrice = parseEuro(basePriceEl.textContent);
                        const qty = parseEuro(qtyEl.value);

                        const savedAmount = (oldPrice - basePrice);

                        totalWithoutDisc = totalWithoutDisc + oldPrice;
                        totalSavedAmount = totalSavedAmount + savedAmount;
                        const discountPercent = Math.round((savedAmount / oldPrice) * 100);

                        item.querySelector('.saved-amount.mini.checkout-page')?.remove();
                        item.querySelector('.saved-discount.mini.checkout-page')?.remove();

                        if (oldPrice > 100) {
                            target.insertAdjacentHTML(
                                'afterend',
                                `<span class="saved-amount mini checkout-page">Je bespaart ${formatEuro(savedAmount)}</span>`
                            );
                        }
                        if (oldPrice <= 100) {
                            target.insertAdjacentHTML(
                                'afterend',
                                `<span class="saved-discount mini checkout-page">Je bespaart -${discountPercent}%</span>`
                            );
                        }
                    }
                } else {
                    totalWithoutDisc = totalWithoutDisc + parseEuro(item.querySelector('.subtotal .cart-price .price').textContent)
                }
            })

            const totalSummary = document.querySelector('.cart-summary');

            if (totalSummary) {
                const mo = new MutationObserver(() => {
                    mo.disconnect();
                    updateAmount();
                    mo.observe(totalSummary, { childList: true, subtree: true, characterData: true });
                });

                mo.observe(totalSummary, { childList: true, subtree: true, characterData: true });

                updateAmount();
            }

            function updateAmount() {
                const subTotalEl = document.querySelector('table .totals.sub .amount .price');
                if (subTotalEl) subTotalEl.innerHTML = formatEurowithoutSign(totalWithoutDisc);
                if (subTotalEl && !document.querySelector('table.totals .totals.disc')) {
                    document.querySelector('table.totals .totals.sub').insertAdjacentHTML('afterend', `
                        <tr class="totals disc">
                            <th class="mark" scope="row">Korting</th>
                            <td class="amount">
                                <span class="price discount" attr: {'data-th': title}" data-th="Korting">- ${formatEurowithoutSign(totalSavedAmount)}</span>
                            </td>
                        </tr>
                        `)
                }
            }

        }
    });

    waitForElement(".opc-block-summary", () => {
        document.querySelector('body').classList.add(testInfo.className);
        const checkoutSummary = document.querySelector('.opc-block-summary');
        if (checkoutSummary) {
            let totalSavedAmount = 0;
            let totalWithoutDisc = 0;

            const wait = setInterval(() => {
                const itemsCart = document.querySelector('.opc-block-summary .items-in-cart');
                if (!itemsCart) return;

                clearInterval(wait);

                const summary = document.querySelector('.opc-block-summary .minicart-items');
                if (!summary) return;

                function recalcTotals() {
                    totalSavedAmount = 0;
                    totalWithoutDisc = 0;

                    summary.querySelectorAll('.product-item').forEach(item => {
                        const oldPriceEl = item.querySelector('.subtotal .cart-price .old-price');
                        const priceEl = item.querySelector('.subtotal .cart-price .price:last-child');
                        const qtyEl = item.querySelector('.input-text.qty');

                        if (!priceEl) return;

                        const basePrice = parseEuro(priceEl.textContent);

                        if (oldPriceEl) {
                            const oldPrice = parseEuro(oldPriceEl.textContent);
                            totalWithoutDisc += oldPrice;
                            totalSavedAmount += (oldPrice - basePrice);
                        } else {
                            totalWithoutDisc += basePrice;
                        }
                    });

                    updateAmount();
                }

                function updateAmount() {
                    const subTotalEl = document.querySelector('table .totals.sub .price');
                    if (subTotalEl) {
                        subTotalEl.textContent = formatEurowithoutSign(totalWithoutDisc);
                    }

                    const subRow = document.querySelector('table .totals.sub');
                    if (subRow && !document.querySelector('table .totals.disc')) {
                        subRow.insertAdjacentHTML('afterend', `
                            <tr class="totals disc">
                                <th class="mark">Korting</th>
                                <td class="amount">
                                <span class="price discount">- ${formatEurowithoutSign(totalSavedAmount)}</span>
                                </td>
                            </tr>
                            `);
                    } else {
                        if (document.querySelector('table .totals.disc')) {
                            document.querySelector('table .totals.disc .discount').textContent = `- ${formatEurowithoutSign(totalSavedAmount)}`;
                        }
                    }
                }

                const mo = new MutationObserver(() => {
                    recalcTotals();
                });

                mo.observe(summary, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });

                recalcTotals();
            }, 100);
        }
    });
})();