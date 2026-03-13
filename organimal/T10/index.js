(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-10',
        debug: 0,
        testName: 'T10 | Groene vinkjes bij correcte invoer (Inline validatie)',
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
            error1: 'E-mail is een vereist veld.',
            error2: 'E-mail is geen geldig e-mailadres.'
        },
        firstName: 'Voornaam is een vereist veld.',
        lastName: 'Achternaam is een vereist veld.',
        houseNumber: 'Huisnummer is een vereist veld.',
        address: 'Adres is een vereist veld.',
        place: 'Woonplaats is een vereist veld.',
        postalCode: {
            error1: 'Postcode is een vereist veld.',
            error2: 'Postcode is geen geldige postcode.'
        },
    }

    const postalCodeRules = {
        NL: /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/,   // 1234 AB
        BE: /^[1-9][0-9]{3}$/,                 // 1000
        DE: /^[0-9]{5}$/                       // 10115
    };

    waitForElement(".woocommerce-billing-fields__field-wrapper", ([]) => {
        document.body.classList.add(testInfo.className)

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

            else if (name === 'billing_postcode') {

                const country = document.querySelector('#billing_country').value;

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

            }

            else {

                if (!value || (value && row.classList.contains('woocommerce-invalid'))) {

                    valid = false;
                }

            }

            if (valid) {
                row.querySelector('.gmd-error-msg').classList.remove('gmd-invalid');
                row.classList.contains('validate-required') ? row.classList.remove('gmd-required-invalid') : '';
                row.classList.add('gmd-validate');
            } else {
                row.querySelector('.gmd-error-msg').classList.add('gmd-invalid');
                row.classList.contains('validate-required') ? row.classList.add('gmd-required-invalid') : '';
                row.classList.remove('gmd-validate');
            }

            return valid;
        }

        function checkValidations() {
            const inputFields = document.querySelectorAll('.woocommerce-billing-fields__field-wrapper input:not([type="hidden"]), .woocommerce-billing-fields__field-wrapper select');
            inputFields.forEach((input) => {
                if (!input.closest('.form-row').querySelector('.gmd-error-msg')) {
                    input.closest('.form-row').insertAdjacentHTML('beforeend', `<div class="gmd-error-msg" aria-live="polite"></div>`)
                    const errorEl = input.closest('.form-row').querySelector('.gmd-error-msg');
                    const name = input.name;
                    let msg = '';
                    if (name === 'billing_email') {
                        msg = errorMsgs.email.error1;
                    }

                    if (name === 'billing_first_name') {
                        msg = errorMsgs.firstName;
                    }

                    if (name === 'billing_last_name') {
                        msg = errorMsgs.lastName;
                    }

                    if (name === 'billing_house_number') {
                        msg = errorMsgs.houseNumber;
                    }

                    if (name === 'billing_street_name') {
                        msg = errorMsgs.address;
                    }

                    if (name === 'billing_city') {
                        msg = errorMsgs.place;
                    }

                    if (name === 'billing_postcode') {
                        msg = errorMsgs.postalCode.error1;
                    }

                    if (msg) {
                        errorEl.textContent = msg;
                    }
                }
                const wrapper = document.querySelector('.woocommerce-billing-fields__field-wrapper');

                wrapper.addEventListener('focusout', function (e) {
                    const input = e.target.closest('input:not([type="hidden"]), select');
                    if (!input) return;
                    validateField(input);
                });
                // wrapper.addEventListener('change', function (e) {
                //     const input = e.target.closest('select');
                //     if (!input) return;
                //     validateField(input);
                // });
            })
        }
        checkValidations();

        function validateFilledFieldsOnLoad() {
            const inputFields = document.querySelectorAll('.woocommerce-billing-fields__field-wrapper input:not([type="hidden"]), .woocommerce-billing-fields__field-wrapper select');

            inputFields.forEach((input) => {
                const value = input.value.trim();
                if (value) {
                    validateField(input);
                }
            });
        }

        validateFilledFieldsOnLoad();

        const target = document.querySelector('.woocommerce-billing-fields__field-wrapper');
        if (target) {
            const observer = new MutationObserver(() => {
                checkValidations();
            });
            observer.observe(target, {
                childList: true,
                // subtree: true,
                // attributes: true,
                // attributeFilter: ["class"]
            })
        }

        document.addEventListener('click', function (e) {

            const btn = e.target.closest('#place_order');
            if (!btn) return;

            const inputFields = document.querySelectorAll(
                '.woocommerce-billing-fields__field-wrapper .validate-required input:not([type="hidden"]), .woocommerce-billing-fields__field-wrapper .validate-required     select'
            );

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

                firstInvalid.focus();

            }

        }, true);
    })
})();