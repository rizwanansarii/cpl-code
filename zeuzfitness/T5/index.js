(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-05',
        debug: 0,
        testName: 'T5 | PDP sticky Add to Cart altijd zichtbaar en variant opties tonen',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function customDropdown(customClass, options, selected) {
        const selectOptions = options;
        const selectValue = selected;
        const optionsHTML = [...selectOptions].map((opt) => {

            let isActive = customClass === 'size-dropdown'
                ? opt.textContent == selectValue.value
                : opt.checked;

            let colorDot = '';

            // 🎯 ONLY FOR COLOR DROPDOWN
            if (customClass === 'color-dropdown') {
                const label = document.querySelector(`label[for="${opt.id}"]`);
                const color = label?.style.getPropertyValue('--swatch-background');

                if (color) {
                    colorDot = `<span class="color-circle"><span class="color-dot" style="background: ${color}"></span></span>`;
                }
            }

            return `
        <div class="custom-select__option ${isActive ? 'active' : ''}" 
            data-value="${opt.value}">
            
            <span class="dot-wrapper">
                ${colorDot}
                <span class="option-label">${opt.value}</span>
            </span>
        </div>
    `;
        }).join("");

        const wrapper = document.createElement("div");
        wrapper.className = "custom-select";

        let selectedColorDot = '';

        if (customClass === 'color-dropdown') {
            const label = document.querySelector(`label[for="${selectValue.id}"]`);
            const color = label?.style.getPropertyValue('--swatch-background');

            if (color) {
                selectedColorDot = `<span class="color-circle"><span class="color-dot" style="background: ${color}"></span></span>`;
            }
        }

        wrapper.insertAdjacentHTML("afterbegin", `
            <div class="custom-select__selected">
                <span class="dot-wrapper">
                    ${selectedColorDot}
                    <span class="selected-text">${selectValue.value}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 9L12 15L6 9" stroke="#00010A" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="custom-select__dropdown">
                ${optionsHTML}
            </div>`
        );

        const selectedText = wrapper.querySelector(".selected-text");
        const dropdown = wrapper.querySelector(".custom-select__dropdown");

        // 👉 Event delegation (BEST with insertAdjacentHTML)
        dropdown.addEventListener("click", (e) => {
            e.stopPropagation(); // 🔥 prevent wrapper toggle
            const item = e.target.closest(".custom-select__option");
            if (!item || item.classList.contains('disabled')) return;

            const value = item.dataset.value;

            // ===== UPDATE SELECTED UI =====
            if (customClass === 'color-dropdown') {

                // 🔍 find original radio input
                const radio = document.querySelector(
                    `.product input[type="radio"][value="${value}"]`
                );

                // 🔍 find corresponding label (for color)
                const label = document.querySelector(`label[for="${radio?.id}"]`);
                const color = label?.style.getPropertyValue('--swatch-background');

                const selectedWrapper = wrapper.querySelector('.custom-select__selected');

                selectedWrapper.innerHTML = `
                    <span class="dot-wrapper">
                        <span class="color-circle"><span class="color-dot" style="background: ${color}"></span></span>
                        <span class="selected-text">${value}</span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 9L12 15L6 9" stroke="#00010A" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round"/>
                    </svg>
                `;

            } else {
                // normal (size dropdown)
                selectedText.textContent = value;
            }

            dropdown.querySelectorAll(".active")
                .forEach(el => el.classList.remove("active"));

            item.classList.add("active");

            wrapper.classList.remove("open");

            // 🔥 SYNC TO MAIN
            if (customClass === 'color-dropdown') {

                const radio = document.querySelector(
                    `.product input[type="radio"][value="${value}"]`
                );

                if (radio && !radio.checked) {
                    radio.click();
                }

            } else if (customClass === 'size-dropdown') {

                const realOption = document.querySelector(
                    `.product .popover-listbox button[value="${value}"]`
                );

                if (realOption) {
                    realOption.click();
                }
            }
        });

        // toggle
        const trigger = wrapper;

        trigger.addEventListener("click", (e) => {
            e.stopPropagation(); // 🔥 prevent bubbling
            wrapper.classList.toggle("open");
        });

        // outside click
        document.addEventListener("click", (e) => {
            if (!wrapper.contains(e.target)) wrapper.classList.remove("open");
        });

        // mount
        document.querySelector(".gmd-quantity-wrapper").insertAdjacentElement('beforeend', wrapper);
        wrapper.closest('.custom-select').classList.add(customClass);
    }

    waitForElement(".product .product-info", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        const atsContent = {
            productName: document.querySelector('.product .product-info__title')?.innerHTML,
            price: document.querySelector('.product .product-info .price-list')?.outerHTML,
            image: document.querySelector('.product .product-gallery__media img')?.src,
            alt: document.querySelector('.product .product-gallery__media img')?.alt,
            quantityWrapper: document.querySelector('.product .product-info .quantity-selector')?.outerHTML,
            variantWrapper: document.querySelector('.product .product-info .variant-picker')?.cloneNode(true),
            quantity: document.querySelector('.product .product-info .quantity-selector input')?.value,
            minQuantity: document.querySelector('.product .product-info .quantity-selector input')?.min,
            buyNowBtn: document.querySelector('.product .product-info .buy-buttons')?.outerHTML,
        }
        if (!document.querySelector('.gmd-sticky-ats-wrapper')) {
            document.querySelector('body').insertAdjacentHTML('beforeend', `
                <div class="section gmd-sticky-ats-wrapper">
                    <div class="gmd-ats-container">
                        <div class="gmd-ats-content-wrapper">
                            <div class="gmd-left-wrapper">
                                <div class="gmd-image-wrapper">
                                    <img src="${atsContent.image}" alt="${atsContent.alt}" />
                                </div>
                                <div class="gmd-text-wrapper">
                                    <div class="gmd-product-info-wrapper">
                                        <div class="gmd-product-name">${atsContent.productName}</div>
                                        <div class="gmd-price-stock-wrapper">
                                            <div class="gmd-price">${atsContent.price}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="gmd-quantity-buy-btn-wrapper">
                                <div class="gmd-quantity-wrapper">
                                    ${atsContent.quantityWrapper}
                                </div>
                                <div class="gmd-btn-wrapper">
                                    ${atsContent.buyNowBtn}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            );
        }

        // document.querySelector('.gmd-btn-wrapper').insertAdjacentElement('beforebegin', atsContent.variantWrapper)
        // document.querySelector('.gmd-quantity-buy-btn-wrapper .select').closest('.relative').querySelector('.select').setAttribute('aria-controls', 'size-dropdown')
        // document.querySelector('.gmd-quantity-buy-btn-wrapper .select').closest('.relative').querySelector('.popover').setAttribute('id', 'size-dropdown')
        // document.querySelector('.gmd-quantity-buy-btn-wrapper .popover-listbox').setAttribute('aria-owns', 'size-dropdown-selected-value')

        const sizeOptions = document.querySelectorAll(".product .popover-listbox button")
        if (sizeOptions.length && !document.querySelector('.size-dropdown')) {
            const customClass = 'size-dropdown';
            const selectValue = document.querySelector(".product .popover-listbox input");
            customDropdown(customClass, sizeOptions, selectValue)
        }
        const colorOptions = document.querySelectorAll(".product .variant-picker__option-values input[type='radio']")
        if (colorOptions.length && !document.querySelector('.color-dropdown')) {
            const customClass = 'color-dropdown'
            const selectValue = document.querySelector(".product .variant-picker__option-values input[type='radio']:checked");
            customDropdown(customClass, colorOptions, selectValue)
        }



        function syncMainToSticky() {

            const product = document.querySelector('.product');

            // ===== SIZE =====
            const sizeOptions = product.querySelectorAll('.popover-listbox button');
            const activeSize = product.querySelector('.popover-listbox button[aria-selected="true"]');

            const sizeDropdown = document.querySelector('.size-dropdown');

            if (sizeDropdown) {

                // ✅ loop all options (for disabled sync)
                sizeOptions.forEach(real => {
                    const value = real.value;

                    const custom = sizeDropdown.querySelector(
                        `.custom-select__option[data-value="${value}"]`
                    );

                    if (!custom) return;

                    // 🔥 DISABLED SYNC
                    if (real.classList.contains('is-disabled')) {
                        custom.classList.add('disabled');
                    } else {
                        custom.classList.remove('disabled');
                    }

                    // 🔥 ACTIVE SYNC
                    if (real.getAttribute('aria-selected') === 'true') {
                        custom.classList.add('active');

                        const label = sizeDropdown.querySelector('.custom-select__selected .selected-text');
                        if (label && label.textContent !== value) {
                            label.textContent = value;
                        }
                    } else {
                        custom.classList.remove('active');
                    }
                });
            }

            // ===== COLOR =====
            const colorOptions = product.querySelectorAll('.variant-picker__option-values input[type="radio"]');
            const activeColor = product.querySelector('.variant-picker__option-values input[type="radio"]:checked');

            const dropdown = document.querySelector('.color-dropdown');
            if (dropdown) {

                colorOptions.forEach(real => {
                    const value = real.value;

                    const custom = dropdown.querySelector(
                        `.custom-select__option[data-value="${value}"]`
                    );

                    if (!custom) return;

                    // 🔍 get label (important for hidden + color)
                    const labelEl = document.querySelector(`label[for="${real.id}"]`);

                    // ===== DISABLED / HIDDEN SYNC =====
                    if (labelEl?.hasAttribute('hidden')) {
                        custom.setAttribute('hidden', true);
                    } else {
                        custom.removeAttribute('hidden');
                    }

                    // ===== ACTIVE SYNC =====
                    if (real.checked) {
                        custom.classList.add('active');

                        const color = labelEl?.style.getPropertyValue('--swatch-background');

                        const selectedWrapper = dropdown.querySelector('.custom-select__selected');

                        if (selectedWrapper) {
                            selectedWrapper.innerHTML = `
                            <span class="dot-wrapper">
                                <span class="color-circle"><span class="color-dot" style="background: ${color}"></span></span>
                                <span class="selected-text">${value}</span>
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 9L12 15L6 9" stroke="#00010A" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round"/>
                            </svg>
                        `;
                        }

                    } else {
                        custom.classList.remove('active');
                    }
                });
            }

            // button
            const addToCartBtn = document.querySelector('.product .buy-buttons');
            const addToCartBtnSticky = document.querySelector('.gmd-sticky-ats-wrapper .buy-buttons');
            if (addToCartBtn) {
                if (addToCartBtn.querySelector('button').getAttribute('aria-busy')) {
                    addToCartBtnSticky.querySelector('button').setAttribute('aria-busy', true)
                } else {
                    addToCartBtnSticky.querySelector('button').removeAttribute('aria-busy')
                }
                // if (addToCartBtn.querySelector('.essential-preorder-container-active')) {
                //     addToCartBtnSticky.querySelector('button div').textContent = addToCartBtn.querySelector('button div').textContent;
                //     addToCartBtnSticky.querySelector('button div').textContent = addToCartBtn.querySelector('.essential-preorder-container-active button div')?.textContent;
                // } else {
                //     addToCartBtnSticky.querySelector('button div').textContent = addToCartBtn.querySelector('button div').textContent;
                // }
            }
        }

        syncMainToSticky()

        const variantContainer = document.querySelector('.product');

        if (variantContainer) {

            let rafId = null;

            const observer = new MutationObserver(() => {

                // 🔥 debounce using RAF (prevents spam)
                if (rafId) cancelAnimationFrame(rafId);

                rafId = requestAnimationFrame(() => {
                    syncMainToSticky();
                });
            });

            observer.observe(variantContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['aria-busy']
            });
        }



        const buyNowButton = document.querySelector('.product .product-info .buy-buttons');
        const atsButton = document.querySelector('.gmd-btn-wrapper .buy-buttons button');
        if (buyNowButton) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        const sticky = document.querySelector('.gmd-sticky-ats-wrapper');
                        if (!entry.isIntersecting && !document.querySelector('.product-info__buy-buttons:has(.product-info__notify.visible) .product-info__buy-form')) {
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

        }
        atsButton.addEventListener('click', () => {
            buyNowButton.querySelector('button').click();
        })

        const topInput = document.querySelector('.product .product-info .quantity-selector__input');
        const atsInput = document.querySelector('.gmd-quantity-buy-btn-wrapper .quantity-selector__input');

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
            topInput.addEventListener("change", () => sync(topInput, atsInput));
            atsInput.addEventListener("change", () => sync(atsInput, topInput));

        }
    });
})();