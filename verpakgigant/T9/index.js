(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-09',
        debug: 0,
        testName: "T9 | Checkout optimalisatie",
        testVersion: 'v1'
    };
    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const errorMsgs = {
        email: {
            error1: 'Vul je e-mailadres in',
            error2: 'Vul een geldig e-mailadres in'
        },
        firstName: 'Vul je voornaam in',
        lastName: 'Vul je achternaam in',
        phone: {
            error1: 'Vul je telefoonnummer in',
            error2: 'Vul een geldig telefoonnummer in'
        },
        houseNumber: 'Vul je huisnummer in',
        address: 'Vul je adres in',
        streetAndNumber: 'Vul je straat en huisnummer in',
        place: 'Vul je woonplaats in',
        country: 'Selecteer een land',
        postalCode: {
            error1: 'Vul je postcode in',
            error2: 'Vul een geldige postcode in'
        }
    };

    const postalCodeRules = {
        NL: /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/,   // 1234 AB
        BE: /^[1-9][0-9]{3}$/,                 // 1000
        DE: /^[0-9]{5}$/                       // 10115
    };

    waitForElement('.woocommerce-checkout', () => {
        document.body.classList.add(testInfo.className);
        function addRequiredPlaceholderAsterisk() {
            document.querySelectorAll('.form-row.validate-required input, .form-row.validate-required select').forEach(field => {
                const placeholder = field.getAttribute('placeholder');
                if (placeholder && !placeholder.trim().endsWith('*')) {
                    field.setAttribute('placeholder', `${placeholder} *`);
                }
            });
            document.querySelectorAll('.form-row.validate-required label').forEach(field => {
                const label = field;
                if (label && !label.childNodes[0].textContent.trim().includes('*')) {
                    field.childNodes[0].textContent = `${label.childNodes[0].textContent} *`
                }
            });

            const companyPlaceholder = document.querySelector('#billing_company_field input')?.getAttribute('placeholder');
            if (!companyPlaceholder?.includes(`"optioneel"`)) {
                document.querySelector('#billing_company_field input').setAttribute('placeholder', `${companyPlaceholder} "optioneel"`)
            }
            const companyLabel = document.querySelector('#billing_company_field label')?.textContent;
            if (!companyLabel?.includes(`"optioneel"`)) {
                document.querySelector('#billing_company_field label').textContent = `${companyLabel} "optioneel"`;
            }
        }
        addRequiredPlaceholderAsterisk();

        const mainform = document.querySelector('.woocommerce-billing-fields__field-wrapper')
        if (mainform) {
            mainform.insertAdjacentElement('afterend', document.querySelector('.woocommerce-shipping-fields'));
        }

        function validateField(input) {
            const row = input.closest('.form-row');
            const errorEl = row.querySelector('.gmd-error-msg');
            const value = input.value.trim();
            const name = input.name;
            let valid = true;

            if (name === 'billing_email') {

                if (!value) {
                    errorEl.textContent = errorMsgs.email.error1;
                    valid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorEl.textContent = errorMsgs.email.error2;
                    valid = false;
                }

            }

            else if (name === 'billing_postcode' || name === 'shipping_postcode') {

                const countryField =
                    name.startsWith('shipping')
                        ? '#shipping_country'
                        : '#billing_country';

                const country = document.querySelector(countryField)?.value;

                if (!value) {
                    errorEl.textContent = errorMsgs.postalCode.error1;
                    valid = false;
                } else {
                    const pattern = postalCodeRules[country];
                    if (pattern && !pattern.test(value)) {
                        errorEl.textContent = errorMsgs.postalCode.error2;
                        valid = false;
                    }
                }

            } else if (name === 'billing_phone' || name === 'shipping_phone') {
                if (!value) {
                    errorEl.textContent = errorMsgs.phone.error1;
                    valid = false;

                } else if (!/^[0-9+\s()-]+$/.test(value)) {
                    errorEl.textContent = errorMsgs.phone.error2;
                    valid = false;
                }
            }

            else {
                if (!value) {
                    valid = false;
                }
            }

            if (valid) {
                row.querySelector('.gmd-error-msg')?.classList.remove('gmd-invalid');
                row.classList.contains('validate-required') ? row.classList.remove('gmd-required-invalid') : '';
                row.classList.add('gmd-validate');
            } else {
                row.querySelector('.gmd-error-msg')?.classList.add('gmd-invalid');
                row.classList.contains('validate-required') ? row.classList.add('gmd-required-invalid') : '';
                row.classList.remove('gmd-validate');
            }

            return valid;
        }

        function bindValidationEvents(wrapper) {

            if (!wrapper) return;

            wrapper.addEventListener('focusout', function (e) {

                const input = e.target.closest('input:not([type="hidden"]), select');

                if (!input) return;

                const checkFields = wrapper.querySelectorAll('input.input-text');

                checkFields.forEach(field => {
                    if (field.value) {
                        validateField(field);
                    }
                });

                validateField(input);
            });

            wrapper.addEventListener('change', function (e) {

                const checkFields = wrapper.querySelectorAll('input.input-text');

                const isBilling = wrapper.classList.contains('woocommerce-billing-fields__field-wrapper');

                const postcodeField =
                    isBilling
                        ? 'billing_postcode'
                        : 'shipping_postcode';

                const streetField =
                    isBilling
                        ? 'billing_street_name'
                        : 'shipping_street_name';

                const cityField =
                    isBilling
                        ? 'billing_city'
                        : 'shipping_city';

                if (e.target.name === postcodeField) {
                    setTimeout(() => {
                        checkFields.forEach(field => {

                            if (field.name === streetField || field.name === cityField) {
                                const interval = setInterval(() => {
                                    if (!field.classList.contains('wcnlpc_spinner')) {
                                        clearInterval(interval);
                                        if (field.value) {
                                            validateField(field);
                                        }
                                    }
                                }, 200);
                            }
                        });
                    }, 500);

                } else {
                    checkFields.forEach(field => {
                        if (field.value) {
                            validateField(field);
                        }
                    });
                }
            });
        }

        function checkValidations() {
            const inputFields = document.querySelectorAll(`
                .woocommerce-billing-fields__field-wrapper .validate-required input.input-text,
                .woocommerce-billing-fields__field-wrapper .validate-required select,
                .woocommerce-shipping-fields__field-wrapper .validate-required input.input-text,
                .woocommerce-shipping-fields__field-wrapper .validate-required select
            `);
            inputFields.forEach((input) => {
                if (!input.closest('.form-row').querySelector('.gmd-error-msg')) {
                    input.closest('.form-row').insertAdjacentHTML('beforeend', `<div class="gmd-error-msg" aria-live="polite"></div>`)
                    const errorEl = input.closest('.form-row').querySelector('.gmd-error-msg');
                    const name = input.name;
                    let msg = '';
                    const fieldMap = {
                        billing_first_name: errorMsgs.firstName,
                        shipping_first_name: errorMsgs.firstName,

                        billing_last_name: errorMsgs.lastName,
                        shipping_last_name: errorMsgs.lastName,

                        billing_phone: errorMsgs.phone,
                        shipping_phone: errorMsgs.phone,

                        billing_email: errorMsgs.email.error1,
                        shipping_email: errorMsgs.email.error1,

                        billing_address_1: errorMsgs.streetAndNumber,
                        shipping_address_1: errorMsgs.streetAndNumber,

                        billing_street_name: errorMsgs.streetAndNumber,
                        shipping_street_name: errorMsgs.streetAndNumber,

                        billing_city: errorMsgs.place,
                        shipping_city: errorMsgs.place,

                        billing_country: errorMsgs.country,
                        shipping_country: errorMsgs.country,

                        billing_postcode: errorMsgs.postalCode.error1,
                        shipping_postcode: errorMsgs.postalCode.error1
                    };

                    msg = fieldMap[name] || '';
                    if (msg) {
                        errorEl.textContent = msg;
                    }
                }

            })
        }
        checkValidations();
        bindValidationEvents(document.querySelector('.woocommerce-billing-fields__field-wrapper'));
        bindValidationEvents(document.querySelector('.woocommerce-shipping-fields__field-wrapper'));

        function validateFilledFieldsOnLoad() {
            const inputFields = document.querySelectorAll('.woocommerce-billing-fields__field-wrapper input.input-text, .woocommerce-billing-fields__field-wrapper select');
            inputFields.forEach((input) => {
                const value = input.value.trim();
                if (value) {
                    validateField(input);
                }
            });
        }

        validateFilledFieldsOnLoad();

        document.addEventListener('click', function (e) {

            const btn = e.target.closest('#place_order');
            if (!btn) return;

            let selector = `
                .woocommerce-billing-fields__field-wrapper .validate-required input.input-text,
                .woocommerce-billing-fields__field-wrapper .validate-required select
            `;

            const shipDifferent = document.querySelector('#ship-to-different-address-checkbox');

            if (shipDifferent?.checked) {
                selector += `,
                    .woocommerce-shipping-fields__field-wrapper .validate-required input.input-text,
                    .woocommerce-shipping-fields__field-wrapper .validate-required select
                `;
            }

            const inputFields = document.querySelectorAll(selector);
            let firstInvalid = null;

            inputFields.forEach((input) => {
                const valid = validateField(input);
                if (!valid && !firstInvalid) {
                    firstInvalid = input;
                }
            });

            if (firstInvalid) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const billingBtn = document.querySelector('.gmd-expand-billing-address');
                if (billingBtn && !billingBtn.classList.contains('is-open')) {
                    billingBtn.click();
                }

                const shipDifferent = document.querySelector('#ship-to-different-address-checkbox');
                if (shipDifferent?.checked) {
                    const shippingBtn = document.querySelector('.gmd-expand-shipping-address');
                    if (shippingBtn && !shippingBtn.classList.contains('is-open')) {
                        shippingBtn.click();
                    }
                }
                firstInvalid.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                setTimeout(() => {
                    firstInvalid.focus();
                }, 300);
            }
        }, true);

        function syncBillingToShipping() {

            const fieldMap = {
                billing_first_name: 'shipping_first_name',
                billing_last_name: 'shipping_last_name',
                billing_company: 'shipping_company',
                billing_phone: 'shipping_phone'
            };

            // Live sync
            document.addEventListener('input', (e) => {

                const shippingEnabled = document.querySelector('#ship-to-different-address-checkbox')?.checked;

                if (!shippingEnabled) return;

                const shippingFieldName = fieldMap[e.target.name];

                if (!shippingFieldName) return;
                const shippingField = document.querySelector(`[name="${shippingFieldName}"]`);

                if (shippingField) {
                    shippingField.value = e.target.value;
                    shippingField.dispatchEvent(
                        new Event('change', { bubbles: true })
                    );
                }
            });

            document.addEventListener('change', (e) => {
                if (e.target.id !== 'ship-to-different-address-checkbox') {
                    return;
                }

                if (!e.target.checked) return;

                Object.entries(fieldMap).forEach(
                    ([billingName, shippingName]) => {
                        const billingField = document.querySelector(`[name="${billingName}"]`);
                        const shippingField = document.querySelector(`[name="${shippingName}"]`);

                        if (billingField && shippingField) {
                            shippingField.value = billingField.value;

                            shippingField.dispatchEvent(
                                new Event('change', {
                                    bubbles: true
                                })
                            );
                        }
                    }
                );
            });
        }

        syncBillingToShipping();

        function createAddressWrappers() {
            const billingWrapper = document.querySelector('.woocommerce-billing-fields__field-wrapper');
            const shippingWrapper = document.querySelector('.woocommerce-shipping-fields__field-wrapper');

            if (billingWrapper && !billingWrapper.querySelector('.gmd-billing-address-fields-wrapper')) {
                billingWrapper.insertAdjacentHTML('beforeend', `
                    <div class="gmd-billing-address-wrapper">
                        <div class="gmd-heading">Factuuradres</div>
                        <div class="gmd-billing-address-fields-wrapper"></div>
                        <a href="javascript:void(0)" class="gmd-expand-billing-address">Adres automatisch invoeren</a>
                    </div>
                `);
            }

            if (shippingWrapper && !shippingWrapper.querySelector('.gmd-shipping-address-fields-wrapper')) {
                shippingWrapper.insertAdjacentHTML('beforeend', `
                    <div class="gmd-shipping-address-wrapper">
                        <div class="gmd-heading">Afleveradres</div>
                        <div class="gmd-shipping-address-fields-wrapper"></div>
                        <a href="javascript:void(0)" class="gmd-expand-shipping-address">Adres automatisch invoeren</a>
                    </div>
                `);
            }
        }

        function moveFieldsIntoWrapper(
            parentSelector,
            fieldsWrapperSelector,
            wrapperParentSelector,
            fields
        ) {
            const parent = document.querySelector(parentSelector);

            if (!parent) return;

            const wrapperParent = parent.querySelector(wrapperParentSelector);
            const fieldsWrapper = parent.querySelector(fieldsWrapperSelector);

            if (!wrapperParent || !fieldsWrapper) return;

            while (fieldsWrapper.firstChild) {
                parent.insertBefore(
                    fieldsWrapper.firstChild,
                    wrapperParent
                );
            }

            fields.forEach(selector => {
                const field = parent.querySelector(selector);
                if (field) {
                    fieldsWrapper.appendChild(field);
                }
            });

            parent.appendChild(wrapperParent);
        }

        function moveAddressFields() {

            moveFieldsIntoWrapper(
                '.woocommerce-billing-fields__field-wrapper',
                '.gmd-billing-address-fields-wrapper',
                '.gmd-billing-address-wrapper',
                [
                    '#billing_address_1_field',
                    '#billing_city_field',
                    '#billing_postcode_field',
                    '#billing_country_field',
                    '#billing_state_field'
                ]
            );

            moveFieldsIntoWrapper(
                '.woocommerce-shipping-fields__field-wrapper',
                '.gmd-shipping-address-fields-wrapper',
                '.gmd-shipping-address-wrapper',
                [
                    '#shipping_address_1_field',
                    '#shipping_city_field',
                    '#shipping_postcode_field',
                    '#shipping_country_field',
                    '#shipping_state_field'
                ]
            );
        }

        function runAfterUpdate() {
            createAddressWrappers();
            moveAddressFields();
            checkValidations();
            bindValidationEvents(document.querySelector('.woocommerce-billing-fields__field-wrapper'));
            bindValidationEvents(document.querySelector('.woocommerce-shipping-fields__field-wrapper'));
            addRequiredPlaceholderAsterisk();
            bindAddressExpand();
        }

        function observeAddressFields() {
            // Wait 500ms after updated_checkout so RPGAAC finishes its DOM manipulation,
            // then reorganize with moveAddressFields which handles any resulting DOM state
            jQuery(document.body).on('updated_checkout', function () {
                setTimeout(runAfterUpdate, 500);
            });
        }

        createAddressWrappers();
        moveAddressFields();
        observeAddressFields();

        function bindAddressExpand() {

            document.querySelectorAll('.gmd-expand-billing-address, .gmd-expand-shipping-address').forEach(btn => {
                if (btn.dataset.gmdBound) return;
                btn.dataset.gmdBound = '1';
                btn.addEventListener('click', function () {
                    const isBilling = this.classList.contains('gmd-expand-billing-address');
                    const fields = isBilling
                        ? [
                            '#billing_city_field',
                            '#billing_country_field',
                            '#billing_state_field'
                        ]
                        : [
                            '#shipping_city_field',
                            '#shipping_country_field',
                            '#shipping_state_field'
                        ];

                    const showClass = isBilling
                        ? 'gmd-show-billing'
                        : 'gmd-show-shipping';

                    const isOpen = this.classList.toggle('is-open');

                    fields.forEach(selector => {
                        document.querySelector(selector)?.classList.toggle(
                            showClass,
                            isOpen
                        );
                    });

                    this.textContent = isOpen
                        ? 'Adres handmatig invoeren'
                        : 'Adres automatisch invoeren';
                });

            });

        }
    })
})();