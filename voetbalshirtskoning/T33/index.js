(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-33',
        debug: 0,
        testName: `T33 | 'In winkelwagen' veranderen naar 'kies maat'`,
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function validatePrinting(root) {
        const checkbox = root.querySelector('.option-printing input[type="checkbox"]');
        const nameInput = root.querySelector('.option-name input');
        const numberInput = root.querySelector('.option-rugnummer input');

        if (!checkbox || !nameInput || !numberInput) {
            return true;
        }

        if (!checkbox.checked) {
            nameInput.setCustomValidity('');
            return true;
        }

        const hasValue = nameInput.value.trim() || numberInput.value.trim();

        if (!hasValue) {
            nameInput.setCustomValidity(
                'Vul minimaal een naam of een nummer in.'
            );

            return false;
        }

        nameInput.setCustomValidity('');
        return true;
    }

    function syncFields(sourceRoot, targetRoot) {

        sourceRoot.querySelectorAll('input, select, textarea').forEach(sourceField => {
            const name = sourceField.name;

            if (!name) return;

            ['input', 'change'].forEach(eventName => {
                sourceField.addEventListener(eventName, () => {
                    const targetField = targetRoot.querySelector(`[name="${CSS.escape(name)}"]`);
                    if (!targetField) return;

                    // CHECKBOX
                    if (sourceField.type === 'checkbox') {
                        targetField.checked = sourceField.checked;

                        targetField.dispatchEvent(
                            new Event('change', {
                                bubbles: true
                            })
                        );

                        // PRINTING OPTION
                        if (sourceField.closest('.option-printing')) {
                            if (!sourceField.checked) {
                                ['.option-name input', '.option-rugnummer input'].forEach(selector => {
                                    const sourceInput = sourceRoot.querySelector(selector);
                                    const targetInput = targetRoot.querySelector(selector);

                                    if (sourceInput) {
                                        sourceInput.value = '';
                                        sourceInput.dispatchEvent(
                                            new Event('input', {
                                                bubbles: true
                                            })
                                        );
                                    }

                                    if (targetInput) {
                                        targetInput.value = '';
                                        targetInput.dispatchEvent(
                                            new Event('input', {
                                                bubbles: true
                                            })
                                        );
                                    }
                                });
                            }
                        }

                        return;
                    }

                    // RADIO
                    if (sourceField.type === 'radio') {
                        const radio = targetRoot.querySelector(`[name="${CSS.escape(name)}"][value="${sourceField.value}"]`);

                        if (radio) {
                            radio.checked = sourceField.checked;

                            radio.dispatchEvent(
                                new Event('change', {
                                    bubbles: true
                                })
                            );
                        }

                        return;
                    }

                    // TEXT / SELECT
                    targetField.value = sourceField.value;

                    targetField.dispatchEvent(
                        new Event('input', {
                            bubbles: true
                        })
                    );

                    targetField.dispatchEvent(
                        new Event('change', {
                            bubbles: true
                        })
                    );
                });
            });
        });
    }

    waitForElement(".product-info-main", ([producPage]) => {
        if (document.querySelector('.product.alert.stock') || document.querySelector('.product-main-info.simple')) {
            return;
        }
        document.querySelector('body').classList.add(testInfo.className);
        setTimeout(() => {
            const sizeLabel = document.querySelector('.product-main-info .label.text-base')?.textContent.trim() || 'Kies maat';
            if (!document.querySelector('.gmd-personalize-overlay')) {
                document.body.insertAdjacentHTML('beforeend', `
                    <div class="gmd-personalize-overlay"></div>
                    <div class="gmd-personalize-popup">
                        <div class="gmd-personalize-popup-inner">
                            <button class="gmd-personalize-close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path d="M7.07139 19.5L5.67139 18.1L11.2714 12.5L5.67139 6.9L7.07139 5.5L12.6714 11.1L18.2714 5.5L19.6714 6.9L14.0714 12.5L19.6714 18.1L18.2714 19.5L12.6714 13.9L7.07139 19.5Z" fill="#4B5563"/>
                                </svg></button>
                            <div class="gmd-personalize-content">

                                <div class="gmd-step gmd-step-1">
                                    <div class="gmd-popup-header">
                                        <h2 class="gmd-title"></h2>
                                        <button class="gmd-personalize-close gmd-mobile">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M7.07139 19.5L5.67139 18.1L11.2714 12.5L5.67139 6.9L7.07139 5.5L12.6714 11.1L18.2714 5.5L19.6714 6.9L14.0714 12.5L19.6714 18.1L18.2714 19.5L12.6714 13.9L7.07139 19.5Z" fill="#4B5563"/>
                                            </svg>
                                        </button>
                                    </div>

                                    ${document.querySelector('.size-chart-modal-wrapper') ? document.querySelector('.size-chart-modal-wrapper')?.cloneNode(true).outerHTML : ''}

                                    <div class="gmd-size-options"></div>
                                    <div class="gmd-step-1-footer"></div>
                                </div>

                                <div class="gmd-step gmd-step-2 hidden">
                                    <div class="gmd-popup-header">
                                        <h2 class="gmd-title">Personaliseer je product</h2>
                                        <button class="gmd-personalize-close gmd-mobile">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M7.07139 19.5L5.67139 18.1L11.2714 12.5L5.67139 6.9L7.07139 5.5L12.6714 11.1L18.2714 5.5L19.6714 6.9L14.0714 12.5L19.6714 18.1L18.2714 19.5L12.6714 13.9L7.07139 19.5Z" fill="#4B5563"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                );
                // setTimeout(() => {
                if (document.querySelector('#product-options-wrapper')) {
                    document.querySelector('.gmd-step-2').insertAdjacentElement('beforeend', document.querySelector('#product-options-wrapper').cloneNode(true));
                    syncFields(
                        document.querySelector('.gmd-step-2 #product-options-wrapper'),
                        document.querySelector('.product-main-info #product-options-wrapper')
                    );

                    const popupCheckbox = document.querySelector('.gmd-personalize-popup .option-printing input[type="checkbox"]');

                    popupCheckbox.addEventListener('change', () => {

                        document.querySelectorAll('.gmd-personalize-popup .option-name, .gmd-personalize-popup .option-rugnummer')
                            .forEach(el => {
                                el.classList.toggle('hidden', !popupCheckbox.checked);
                            });
                    });
                    const popupRoot = document.querySelector('.gmd-personalize-popup #product-options-wrapper');

                    const nameInput = popupRoot.querySelector('.option-name input');
                    const numberInput = popupRoot.querySelector('.option-rugnummer input');

                    [nameInput, numberInput].forEach(input => {
                        input?.addEventListener('input', () => {

                            const hasValue = nameInput.value.trim() || numberInput.value.trim();
                            if (hasValue) {
                                nameInput.setCustomValidity('');
                            }
                        });
                    });
                    document.querySelector('.gmd-step-2 .product-options-wrapper').insertAdjacentElement('afterend', document.querySelector('.product-main-info .product-addtocart-button').cloneNode(true));
                    document.querySelector('.gmd-step-2 .product-addtocart-button').insertAdjacentHTML('afterend', `
                        <div class="gmd-skip-personalize-wrapper">
                            <button class="gmd-skip-personalize-btn">Doorgaan zonder bedrukking</button>
                        </div> `
                    );
                }
                // }, 200)
            }
            const usps = document.querySelector('.product-usp-wrapper');
            if (!document.querySelector('.gmd-printing-wrapper')) {
                usps.insertAdjacentHTML('beforebegin', `
                    <div class="gmd-size-wrapper">
                        <button class="gmd-size-btn">Kies ${sizeLabel}</button>
                    </div>    
                    ${document.querySelector('#product-options-wrapper') ? `
                        <div class="gmd-printing-wrapper">
                            <button class="gmd-printing-btn">Bedrukking toevoegen</button>
                        </div>` : ''
                    }    
                `)
            }

            let popupMode = '';
            document.querySelectorAll('.gmd-printing-btn, .gmd-size-btn')?.forEach((el) => {
                el.addEventListener('click', (e) => {
                    // const productFieldsDesk = document.querySelectorAll(".product-main-info .form-select")
                    // const productFieldsMob = document.querySelectorAll(".product-options-mobile")
                    // let hasEmptyRequiredField = true;
                    // if (productFieldsDesk.length) hasEmptyRequiredField = Array.from(document.querySelectorAll(".product-main-info .form-select")).some(field => field.required && !field.value);
                    // if (productFieldsMob.length) hasEmptyRequiredField = document.querySelectorAll(".product-options-mobile")[0].querySelector('.field input:checked') ? false : true;
                    // if (!hasEmptyRequiredField) {
                    if (e.target.classList.contains('gmd-size-btn')) {
                        popupMode = 'size';
                    } else {
                        popupMode = 'printing';
                    }
                    openPersonalizePopup();
                    // } else {
                    //     document.querySelector('.product-main-info .product-addtocart-button').click();
                    // }
                })
            })
            function bindStep1Buttons() {
                document.querySelector('.gmd-personalize-btn')?.addEventListener('click', () => {
                    document.querySelector('.gmd-step-1').classList.add('hidden');
                    document.querySelector('.gmd-step-2').classList.remove('hidden');
                    const inputCheckbox = document.querySelector('.gmd-personalize-popup #product-options-wrapper .option-printing input[type="checkbox"]');
                    if (document.querySelector('.gmd-personalize-popup #product-options-wrapper') && !inputCheckbox.checked) {
                        setTimeout(() => {
                            inputCheckbox.click();
                        }, 200)
                    }

                });

                document.querySelector('.gmd-next-btn')?.addEventListener('click', () => {
                    document.querySelector('.gmd-step-1').classList.add('hidden');
                    document.querySelector('.gmd-step-2').classList.remove('hidden');
                    const inputCheckbox = document.querySelector('.gmd-personalize-popup #product-options-wrapper .option-printing input[type="checkbox"]');
                    if (document.querySelector('.gmd-personalize-popup #product-options-wrapper') && !inputCheckbox.checked) {
                        setTimeout(() => {
                            inputCheckbox.click();
                        }, 200)
                    }

                });

            }

            function renderStep1Footer() {

                const footer = document.querySelector('.gmd-step-1-footer');

                if (!footer) return;

                if (popupMode === 'size') {

                    footer.innerHTML = `
                        ${document.querySelector('#product-options-wrapper') ? `
                            <button class="gmd-btn-secondary gmd-personalize-btn">
                                Bedrukken
                            </button>
                        ` : ''}

                        ${document.querySelector('.product-main-info .product-addtocart-button').cloneNode(true).outerHTML}
                    `;

                } else {

                    footer.innerHTML = `
                        <button class="gmd-btn-primary gmd-next-btn">
                            Ga verder met bedrukken
                        </button>
                    `;
                }

                bindStep1Buttons();
            }

            document.querySelectorAll('.gmd-personalize-content .product-addtocart-button, .gmd-personalize-content .gmd-skip-personalize-btn')?.forEach((el) => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    const popupRoot = document.querySelector('.gmd-personalize-popup #product-options-wrapper');
                    if (e.target.classList.contains('product-addtocart-button') && e.target.closest('.gmd-step-2')) {
                        if (!validatePrinting(popupRoot)) {
                            popupRoot.querySelector('.option-name input').reportValidity();
                            return;
                        }
                    }
                    if (e.target.classList.contains('gmd-skip-personalize-btn')) {
                        const inputCheckbox = document.querySelector('.gmd-personalize-popup #product-options-wrapper .option-printing input[type="checkbox"]');
                        if (document.querySelector('.gmd-personalize-popup #product-options-wrapper') && inputCheckbox.checked) {
                            inputCheckbox.click();
                        }
                    }
                    document.querySelector('.product-main-info .product-addtocart-button').click();
                    closePersonalizePopup();
                })
            })

            function openPersonalizePopup() {
                const title = document.querySelector('.gmd-step-1 .gmd-title');

                if (title) {
                    title.textContent =
                        popupMode === 'printing'
                            ? `Selecteer eerst een ${sizeabel}`
                            : `Kies ${sizeLabel}`;
                }

                document.querySelector('.gmd-personalize-overlay')?.classList.add('is-open');
                document.querySelector('.gmd-personalize-popup')?.classList.add('is-open');
                document.body.classList.add('gmd-overflow-hidden');

            }

            function closePersonalizePopup() {
                document.querySelector('.gmd-personalize-overlay')?.classList.remove('is-open');
                document.querySelector('.gmd-personalize-popup')?.classList.remove('is-open');
                document.body.classList.remove('gmd-overflow-hidden');
                const inputCheckbox = document.querySelector('.gmd-personalize-popup #product-options-wrapper .option-printing input[type="checkbox"]');
                if (document.querySelector('.gmd-personalize-popup #product-options-wrapper') && inputCheckbox.checked) {
                    inputCheckbox.click();
                }

                // Reset to Step 1
                document.querySelector('.gmd-step-1')?.classList.remove('hidden');
                document.querySelector('.gmd-step-2')?.classList.add('hidden');

                // Remove footer buttons
                document.querySelector('.gmd-step-1-footer').innerHTML = '';

                // Reset custom socks checkbox
                const socksToggle = document.querySelector('.gmd-socks-toggle');
                if (socksToggle) {
                    socksToggle.checked = false;
                }

                // Hide socks options
                document.querySelector('.gmd-socks-group')?.classList.add('hidden');

                // Remove active states from custom options
                document.querySelectorAll('.gmd-bundle-option.is-active')?.forEach(el => el.classList.remove('is-active'));

                // Reset original desktop selects
                document.querySelectorAll('.fieldset-bundle-options select')?.forEach(select => {
                    select.selectedIndex = 0;
                    select.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));
                });

                // Reset original mobile radios
                document.querySelectorAll('.product-options-mobile input[type="radio"]')?.forEach(radio => {
                    radio.checked = false;
                    radio.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));
                });
                // Reset original mobile radios — configurable product attribute selectors
                document.querySelectorAll('[data-testid="product-attribute-option-renderer"]').forEach(root => {
                    // Silently uncheck, without firing 'change' (that would re-select the last radio processed)
                    root.querySelectorAll('input[type="radio"]').forEach(radio => {
                        radio.checked = false;
                    });

                    // Find the attribute id from the field name, e.g. super_attribute[322]
                    const anyInput = root.querySelector('[name^="super_attribute"]');
                    const match = anyInput?.name.match(/super_attribute\[(\d+)\]/);
                    if (!match) return;
                    const attributeId = match[1];

                    // Clear the actual Alpine selection state directly, same as selecting the
                    // desktop select's empty "Kies een optie..." option would do
                    const scopeEl = root.closest('[x-data]');
                    if (scopeEl && typeof Alpine !== 'undefined') {
                        const data = Alpine.$data(scopeEl);
                        if (data && typeof data.changeOption === 'function') {
                            data.changeOption(attributeId, '');
                        }
                    }
                });

                // Rebuild Step 1 UI
                createBundleOptions();

                // Reset popup mode
                popupMode = '';
            }

            const overlay = document.querySelector('.gmd-personalize-overlay');
            const popup = document.querySelector('.gmd-personalize-popup');
            document.querySelectorAll('.gmd-personalize-close').forEach(btn => {
                btn.addEventListener('click', closePersonalizePopup);
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.querySelector('.gmd-personalize-popup')?.classList.contains('is-open')) {
                    closePersonalizePopup();
                }
            });
            overlay.addEventListener('click', closePersonalizePopup);

            popup.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            window.addEventListener('pageshow', (event) => {
                document.querySelectorAll('.option-name input, .option-rugnummer input').forEach(input => {
                    input.value = '';
                });
                document.querySelectorAll('.option-printing input[type="checkbox"]').forEach(input => {
                    if (input.checked) {
                        input.click();
                    }
                });
            });

            function createBundleOptions(root = document) {

                let selectSize;
                let selectSocks;
                let mobileSelectSize;
                let mobileSelectSocks;
                if (document.querySelectorAll('.product-main-info .form-select').length) {
                    document.querySelectorAll('.product-main-info .form-select').forEach((select) => {
                        if (!select.closest('.option-sokken')) {
                            selectSize = select;
                        }
                        if (select.closest('.option-sokken')) {
                            selectSocks = select;
                        }
                    })
                }

                if (document.querySelectorAll('.product-options-mobile:has(>.field.choice)').length) {
                    document.querySelectorAll('.product-options-mobile:has(>.field.choice)').forEach((select) => {
                        if (!select.closest('.option-sokken')) {
                            mobileSelectSize = select;
                        }
                        if (select.closest('.option-sokken')) {
                            mobileSelectSocks = select;
                        }
                    })
                }

                const footer = document.querySelector('.gmd-step-1-footer');

                if (footer) {
                    footer.innerHTML = '';
                }

                if (root.querySelector('.gmd-bundle-options') || (!selectSize && !mobileSelectSize)) {
                    return;
                }

                const wrapper = document.createElement('div');
                wrapper.className = 'gmd-bundle-options';

                const container = document.querySelector('.gmd-step-1 .gmd-size-options');
                container.innerHTML = '';

                function renderOptions(title, originalField, isSocks = false) {

                    if (!originalField) return;
                    const group = document.createElement('div');

                    group.className = `gmd-option-group ${isSocks ? 'gmd-socks-group hidden' : 'gmd-shirt-group'}`;

                    group.innerHTML = `
                        <div class="gmd-bundle-options"></div>
                    `;

                    const wrapper = group.querySelector('.gmd-bundle-options');


                    // ==========================
                    // DESKTOP
                    // ==========================
                    if (originalField.matches('select')) {

                        [...originalField.options].forEach(option => {

                            if (!option.value) return;
                            const productPrice = document.querySelector('.final-price .price-wrapper .price')?.textContent.trim()
                            const price = isSocks
                                ? (
                                    option.querySelector('.price-wrapper')?.textContent.trim() ||
                                    option.querySelector('.price')?.textContent.trim()
                                )
                                : productPrice;
                            const item = document.createElement('div');

                            item.className = 'gmd-bundle-option';
                            item.dataset.value = option.value;

                            item.innerHTML = `
                                <div class="gmd-bundle-option-title">
                                    ${option.querySelector('.product-name') ? option.querySelector('.product-name').textContent.trim() : option.text}
                                </div>
                                <div class="gmd-bundle-option-price">
                                    € ${price}
                                </div>
                            `;

                            if (option.disabled) {
                                item.classList.add('is-disabled');
                            }

                            if (option.selected) {
                                item.classList.add('is-active');
                            }

                            item.addEventListener('click', () => {
                                if (option.disabled) return;

                                if (isSocks) {
                                    document.querySelector('.gmd-socks-toggle').checked = true;
                                }
                                wrapper.querySelectorAll('.gmd-bundle-option')
                                    .forEach(el => el.classList.remove('is-active'));

                                item.classList.add('is-active');

                                originalField.value = option.value;

                                originalField.dispatchEvent(
                                    new Event('change', {
                                        bubbles: true
                                    })
                                );

                                if (!isSocks) {
                                    renderStep1Footer();
                                }

                            });

                            wrapper.appendChild(item);

                        });

                        originalField.addEventListener('change', () => {

                            wrapper.querySelectorAll('.gmd-bundle-option')
                                .forEach(el => {

                                    el.classList.toggle(
                                        'is-active',
                                        el.dataset.value === originalField.value
                                    );

                                });

                        });

                    } else {

                        // ==========================
                        // MOBILE
                        // ==========================

                        originalField.querySelectorAll('.field.choice').forEach(choice => {

                            const radio = choice.querySelector('input');
                            const label = choice.querySelector('.product-name') || choice.querySelector('label  ');

                            const productPrice = document.querySelector('.final-price .price-wrapper .price')?.textContent.trim()

                            const price = isSocks
                                ? (
                                    choice.querySelector('.option-sokken-price .price-wrapper')?.textContent.trim() ||
                                    choice.querySelector('.price-wrapper .price')?.textContent.trim() ||
                                    choice.querySelector('.price-wrapper')?.textContent.trim()
                                )
                                : productPrice;

                            if (!radio || !label) return;

                            const item = document.createElement('div');

                            item.className = 'gmd-bundle-option';
                            item.dataset.value = radio.value;

                            item.innerHTML = `
                                <div class="gmd-bundle-option-title">
                                    ${label.textContent.trim()}
                                </div>
                                <div class="gmd-bundle-option-price">
                                    € ${price}
                                </div>
                            `;

                            if (radio.disabled) {
                                item.classList.add('is-disabled');
                            }

                            if (radio.checked) {
                                item.classList.add('is-active');
                            }

                            item.addEventListener('click', () => {
                                if (radio.disabled) return;

                                if (isSocks) {
                                    document.querySelector('.gmd-socks-toggle').checked = true;
                                }
                                radio.click();

                                if (!isSocks) {
                                    renderStep1Footer();
                                }

                            });

                            radio.addEventListener('change', () => {

                                wrapper.querySelectorAll('.gmd-bundle-option')
                                    .forEach(el => {

                                        el.classList.toggle(
                                            'is-active',
                                            radio.checked &&
                                            el.dataset.value === radio.value
                                        );

                                    });

                            });

                            wrapper.appendChild(item);

                        });

                    }

                    container.appendChild(group);
                }

                renderOptions('Maat shirt', selectSize || mobileSelectSize);
                if (document.querySelector('.option-sokken')) {
                    renderOptions('Sokken (optioneel)', selectSocks || mobileSelectSocks, true);
                }

                // Create popup checkbox
                if (document.querySelector('.option-sokken')) {
                    const checkboxWrapper = document.createElement('div');

                    checkboxWrapper.className = 'gmd-socks-checkbox';

                    checkboxWrapper.innerHTML = `
                        <label class="gmd-checkbox-label">
                            <input type="checkbox" class="gmd-socks-toggle">
                            <span>Sokken (optioneel)</span>
                        </label>
                    `;
                    const shirtGroup = container.querySelector('.gmd-shirt-group');

                    if (shirtGroup) {
                        shirtGroup.insertAdjacentElement('afterend', checkboxWrapper);
                    }

                    const socksGroup = container.querySelector('.gmd-socks-group');

                    if (socksGroup) {
                        socksGroup.classList.add('hidden');
                    }

                    const socksToggle = checkboxWrapper.querySelector('.gmd-socks-toggle');

                    socksToggle.addEventListener('change', () => {

                        const isChecked = socksToggle.checked;

                        socksGroup?.classList.toggle('hidden', !isChecked);

                        // Clear socks selection when unchecked
                        if (!isChecked) {

                            // Desktop
                            if (selectSocks) {

                                selectSocks.selectedIndex = 0;

                                selectSocks.dispatchEvent(
                                    new Event('change', {
                                        bubbles: true
                                    })
                                );
                            }

                            // Mobile
                            if (mobileSelectSocks) {

                                mobileSelectSocks
                                    .querySelectorAll('input[type="radio"]')
                                    .forEach(radio => {

                                        radio.checked = false;

                                        radio.dispatchEvent(
                                            new Event('change', {
                                                bubbles: true
                                            })
                                        );

                                    });

                            }

                            socksGroup?.querySelectorAll('.gmd-bundle-option')
                                .forEach(el => el.classList.remove('is-active'));
                        }

                    });
                }

            }

            createBundleOptions();

            function createOptionGroup(title, originalField, type) {

                if (!originalField) return null;

                const wrapper = document.createElement('div');
                wrapper.className = `gmd-option-group gmd-${type}-group`;

                wrapper.innerHTML = `
                    <div class="gmd-option-title">${title}</div>
                    <div class="gmd-bundle-options"></div>
                `;

                const optionsWrapper = wrapper.querySelector('.gmd-bundle-options');

                // Desktop
                if (originalField.matches('select')) {

                    [...originalField.options].forEach(option => {

                        if (!option.value) return;

                        const item = document.createElement('div');

                        item.className = 'gmd-bundle-option';
                        item.dataset.value = option.value;

                        item.innerHTML = `
                            <div class="gmd-bundle-option-title">${option.text.trim()}</div>
                            <div class="gmd-bundle-option-price">€39,95</div>
                        `;

                        if (option.selected) {
                            item.classList.add('is-active');
                        }

                        item.addEventListener('click', () => {

                            optionsWrapper.querySelectorAll('.gmd-bundle-option')
                                .forEach(el => el.classList.remove('is-active'));

                            item.classList.add('is-active');

                            originalField.value = option.value;

                            originalField.dispatchEvent(new Event('change', {
                                bubbles: true
                            }));
                        });

                        optionsWrapper.appendChild(item);
                    });

                    originalField.addEventListener('change', () => {

                        optionsWrapper.querySelectorAll('.gmd-bundle-option')
                            .forEach(el => {

                                el.classList.toggle(
                                    'is-active',
                                    el.dataset.value === originalField.value
                                );

                            });

                    });

                } else {

                    // Mobile radios

                    originalField.querySelectorAll('.field.choice').forEach(choice => {

                        const radio = choice.querySelector('input');
                        const label = choice.querySelector('.product-name');

                        if (!radio || !label) return;

                        const item = document.createElement('div');

                        item.className = 'gmd-bundle-option';
                        item.dataset.value = radio.value;

                        item.innerHTML = `
                            <div class="gmd-bundle-option-title">${label.textContent.trim()}</div>
                            <div class="gmd-bundle-option-price">€39,95</div>
                        `;

                        item.addEventListener('click', () => radio.click());

                        radio.addEventListener('change', () => {

                            optionsWrapper.querySelectorAll('.gmd-bundle-option')
                                .forEach(el => {

                                    el.classList.toggle(
                                        'is-active',
                                        radio.checked &&
                                        el.dataset.value === radio.value
                                    );

                                });

                        });

                        optionsWrapper.appendChild(item);

                    });

                }

                return wrapper;
            }
        }, 200)
    });
})();