(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-07',
        debug: 0,
        testName: "T7 | Redesign PDP -> Redesign Cart (Extra)",
        testVersion: 'v1'
    };
    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement('.template-cart', () => {
        document.body.classList.add(testInfo.className);
        function removeEUR() {
            const sliderAmount = document.querySelectorAll('.gmd-07 .section-featured-collection .product-price__amount');
            if (sliderAmount.length) {
                document.querySelectorAll('.gmd-07 .section-featured-collection .product-price__amount').forEach(el => {
                    if (el.textContent.includes('EUR')) {
                        el.textContent = el.textContent.replace(/\s*EUR\b/g, '').trim();
                    }
                });
            }
        }
        removeEUR();
    });

})();   