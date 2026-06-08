(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-12',
        debug: 0,
        testName: 'T12 | Prijs andere kleur geven op productpagina',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".shopify-section .\\#product", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);
    });
})();