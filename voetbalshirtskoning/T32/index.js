(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-32',
        debug: 0,
        testName: 'T32 | Button voor bedrukking toevoegen',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function syncFields(sourceRoot, targetRoot) {

        sourceRoot.querySelectorAll('input, select, textarea').forEach(sourceField => {
            const name = sourceField.name;

            if (!name) return;

            sourceField.addEventListener('input', () => {
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
    }

    waitForElement("#product-options-wrapper", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);
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
                            <h2 class="gmd-title">Personaliseer je product</h2>
                        </div>
                    </div>
                </div>`
            );
            // setTimeout(() => {
            document.querySelector('.gmd-personalize-content').insertAdjacentElement('beforeend', document.querySelector('#product-options-wrapper').cloneNode(true));
            syncFields(
                document.querySelector('.gmd-personalize-content #product-options-wrapper'),
                document.querySelector('.product-main-info #product-options-wrapper')
            );
            document.querySelector('.gmd-personalize-content .product-options-wrapper').insertAdjacentElement('afterend', document.querySelector('.product-addtocart-button').cloneNode(true));
            // }, 200)
        }
        const usps = document.querySelector('.product-usp-wrapper');
        if (!document.querySelector('.gmd-printing-wrapper')) {
            usps.insertAdjacentHTML('beforebegin', `
                <div class="gmd-printing-wrapper">
                    <button class="gmd-printing-btn">Bedrukking toevoegen</button>
                </div>    
                `)

            document.querySelector('.gmd-printing-btn').addEventListener('click', (e) => {
                const productFieldsDesk = document.querySelectorAll(".product-main-info .form-select")
                const productFieldsMob = document.querySelectorAll(".product-options-mobile")
                let hasEmptyRequiredField = true;
                if (productFieldsDesk.length) hasEmptyRequiredField = Array.from(document.querySelectorAll(".product-main-info .form-select")).some(field => field.required && !field.value);
                if (productFieldsMob.length) hasEmptyRequiredField = document.querySelectorAll(".product-options-mobile")[0].querySelector('.field input:checked') ? false : true;
                if (!hasEmptyRequiredField) {
                    openPersonalizePopup();
                } else {
                    document.querySelector('.product-main-info .product-addtocart-button').click();
                }
            })
        }

        function openPersonalizePopup() {
            document.querySelector('.gmd-personalize-overlay')?.classList.add('is-open');
            document.querySelector('.gmd-personalize-popup')?.classList.add('is-open');
            document.body.classList.add('gmd-overflow-hidden');
            const inputCheckbox = document.querySelector('.gmd-personalize-popup #product-options-wrapper .option-printing input[type="checkbox"]');
            if (!inputCheckbox.checked) {
                setTimeout(() => {
                    inputCheckbox.click();
                }, 200)
            }
        }

        function closePersonalizePopup() {
            document.querySelector('.gmd-personalize-overlay')?.classList.remove('is-open');
            document.querySelector('.gmd-personalize-popup')?.classList.remove('is-open');
            document.body.classList.remove('gmd-overflow-hidden');
            const inputCheckbox = document.querySelector('.gmd-personalize-popup #product-options-wrapper .option-printing input[type="checkbox"]');
            if (inputCheckbox.checked) {
                inputCheckbox.click();
            }
        }

        const overlay = document.querySelector('.gmd-personalize-overlay');
        const popup = document.querySelector('.gmd-personalize-popup');
        const closeBtn = document.querySelector('.gmd-personalize-close');

        closeBtn.addEventListener('click', closePersonalizePopup);

        overlay.addEventListener('click', closePersonalizePopup);

        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
})();