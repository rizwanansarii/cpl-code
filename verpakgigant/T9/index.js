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

        phone: 'Vul je telefoonnummer in',

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

                if (
                    placeholder &&
                    !placeholder.trim().endsWith('*')
                ) {
                    field.setAttribute(
                        'placeholder',
                        `${placeholder} *`
                    );
                }
            });
            document.querySelectorAll('.form-row.validate-required label').forEach(field => {

                const label = field;

                if (
                    label &&
                    !label.childNodes[0].textContent.trim().includes('*')
                ) {
                    field.childNodes[0].textContent = `${label.childNodes[0].textContent} *`
                }
            });
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

            } else {
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

        // const target = document.querySelector('.woocommerce-billing-fields__field-wrapper');
        // if (target) {
        //     const observer = new MutationObserver(() => {
        //         checkValidations();
        //     });
        //     observer.observe(target, {
        //         childList: true,
        //         // subtree: true,
        //         // attributes: true,
        //         // attributeFilter: ["class"]
        //     })
        // }

        document.addEventListener('click', function (e) {

            const btn = e.target.closest('#place_order');
            if (!btn) return;

            const inputFields = document.querySelectorAll('.woocommerce-billing-fields__field-wrapper .validate-required input.input-text, .woocommerce-billing-fields__field-wrapper .validate-required select');
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
                firstInvalid.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                setTimeout(() => {
                    firstInvalid.focus();
                }, 300);
            }
        }, true);

        function createAddressWrappers() {
            const billingWrapper = document.querySelector('.woocommerce-billing-fields__field-wrapper');
            const shippingWrapper = document.querySelector('.woocommerce-shipping-fields__field-wrapper');

            if (billingWrapper && !billingWrapper.querySelector('.gmd-billing-address-fields-wrapper')) {
                billingWrapper.insertAdjacentHTML('beforeend', '<section class="gmd-billing-address-fields-wrapper"></section>');
            }

            if (shippingWrapper && !shippingWrapper.querySelector('.gmd-shipping-address-fields-wrapper')) {
                shippingWrapper.insertAdjacentHTML('beforeend', '<section class="gmd-shipping-address-fields-wrapper"></section>');
            }
        }

        function moveAddressFields() {
            const billingContainer = document.querySelector('.gmd-billing-address-fields-wrapper');
            const shippingContainer = document.querySelector('.gmd-shipping-address-fields-wrapper');

            const billingFields = [
                '#billing_address_1_field',
                '#billing_house_number_field',
                '#billing_city_field',
                '#billing_state_field',
                '#billing_postcode_field',
                '#billing_country_field'
            ];

            const shippingFields = [
                '#shipping_address_1_field',
                '#shipping_house_number_field',
                '#shipping_city_field',
                '#shipping_state_field',
                '#shipping_postcode_field',
                '#shipping_country_field'
            ];

            if (billingContainer && !document.querySelector('.woocommerce-billing-fields__field-wrapper .rpgaac_billing #billing_address_1_field')) {
                billingFields.forEach(selector => {
                    const field = document.querySelector(selector);
                    console.log(field, 'field')
                    if (field && field.parentElement !== billingContainer) {
                        billingContainer.insertAdjacentElement('afterbegin', field);
                    }
                });
            }

            // if (shippingContainer) {
            //     shippingFields.forEach(selector => {
            //         const field = document.querySelector(selector);
            //         if (field && field.parentElement !== shippingContainer) {
            //             shippingContainer.insertAdjacentElement('afterbegin', field);
            //         }
            //     });
            // }
        }

        function observeAddressFields() {
            const billingWrapper = document.querySelectorAll('.woocommerce-billing-fields__field-wrapper .form-row');
            const shippingWrapper = document.querySelectorAll('.woocommerce-shipping-fields__field-wrapper .form-row');

            const config = {
                childList: true,
                subtree: true
            };

            const billingObserver = new MutationObserver(() => {
                if (billingWrapper.length) {
                    moveAddressFields();
                }
            })

            billingObserver.observe(document.querySelector('.woocommerce-billing-fields__field-wrapper'), config);

            // if (shippingWrapper.length) {
            //     new MutationObserver(callback).observe(document.querySelector('.woocommerce-shipping-fields__field-wrapper'), config);
            // }
        }

        createAddressWrappers();
        moveAddressFields();
        observeAddressFields();

        const form = document.querySelector('form.woocommerce-checkout');
        if (form) {
            const observer = new MutationObserver(() => {
                addRequiredPlaceholderAsterisk();
            })
            observer.observe(form, {
                childList: true,
                subtree: true
            })
        }
    })
})();