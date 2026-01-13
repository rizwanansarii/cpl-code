(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-checkout-page',
        debug: 0,
        testName: 'T2 | Change input state for checkout page',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".continue", ([producPage]) => {
        (() => {

            let initialized = false;
            document.querySelector('body').classList.add(testInfo.className);

            const observer = new MutationObserver(() => {
                const form = document.querySelector('.gmd-checkout-page #checkout-step-shipping');
                const inputs = document.querySelectorAll('.gmd-checkout-page #shipping-new-address-form input[type="text"]');
                const select = document.querySelectorAll('.gmd-checkout-page #shipping-new-address-form select');
                const continueBtn = document.querySelector('.continue');
                if (form && inputs.length > 5 && continueBtn && select.length > 0 && !initialized) {
                    initialized = true;
                    runCheckoutEnhancement();
                } else {
                    return;
                }

                initialized = true;
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });


            function runCheckoutEnhancement() {

                document.querySelector('body').classList.add(testInfo.className);

                const inputs = document.querySelectorAll('.gmd-checkout-page #shipping-new-address-form input[type="text"], .gmd-checkout-page #shipping-new-address-form select');

                const wrapInputs = document.querySelectorAll('.gmd-checkout-page #checkout-step-shipping input[type="email"], .gmd-checkout-page #shipping-new-address-form input[type="text"], .gmd-checkout-page #shipping-new-address-form select');

                const emailField = document.querySelector('.gmd-checkout-page #checkout-step-shipping input[type="email"]');

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                const requiredInputs = document.querySelectorAll('.gmd-checkout-page #shipping-new-address-form ._required input[type="text"]');

                wrapInputs.forEach(input => {
                    if (!input.parentElement.classList.contains('input-wrapper')) {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'input-wrapper';
                        input.parentNode.insertBefore(wrapper, input);
                        wrapper.appendChild(input);
                    }
                });

                function inputEvent(input) {
                    if (input.value && !input.closest('._error')) {
                        input.classList.add('valid');
                        input.closest('.input-wrapper').classList.add('valid-input');
                    } else {
                        input.classList.remove('valid');
                        input.closest('.input-wrapper').classList.remove('valid-input');
                    }
                }

                if (emailField) {
                    if (emailRegex.test(emailField.value.trim())) {
                        emailField.classList.add('valid');
                        emailField.closest('.input-wrapper').classList.add('valid-input');
                    } else {
                        emailField.classList.remove('valid');
                        emailField.closest('.input-wrapper').classList.remove('valid-input');
                    }
                }

                inputs.forEach(input => inputEvent(input));

                inputs.forEach(input => {
                    input.addEventListener('keyup', e => inputEvent(e.target));
                });

                if (emailField) {
                    emailField.addEventListener('focusout', e => {
                        if (e.target.classList.contains('valid')) {
                            e.target.closest('.input-wrapper').classList.add('valid-input');
                        } else {
                            e.target.closest('.input-wrapper').classList.remove('valid-input');
                        }
                    });
                }

                const dp = document.querySelector('._has-datepicker');
                if (dp) {
                    dp.addEventListener('focusout', e => {
                        if (e.target.value) {
                            e.target.classList.add('valid');
                            e.target.closest('.input-wrapper').classList.add('valid-input');
                        } else {
                            e.target.classList.remove('valid');
                            e.target.closest('.input-wrapper').classList.remove('valid-input');
                        }
                    });
                }

                document.querySelectorAll('.gmd-checkout-page #shipping-new-address-form select').forEach(select => {
                    select.addEventListener('change', e => {
                        if (e.target.value) {
                            e.target.classList.add('valid');
                            e.target.closest('.input-wrapper').classList.add('valid-input');
                        } else {
                            e.target.classList.remove('valid');
                            e.target.closest('.input-wrapper').classList.remove('valid-input');
                        }
                    });
                });

                const continueBtn = document.querySelector('.continue');
                if (continueBtn) {
                    continueBtn.addEventListener('click', () => {
                        if (document.querySelector('#customer-email-fieldset #customer-email')?.classList.contains('valid')) {
                            let match = false;

                            requiredInputs.forEach(input => {
                                if (!input.classList.contains('valid') && input.closest('._error') && !match) {
                                    input.focus();
                                    match = true;
                                }
                            });
                        }
                    });
                }
            }

        })();

    });

})();