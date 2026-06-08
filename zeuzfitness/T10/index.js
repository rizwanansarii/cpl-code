(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-10',
        debug: 0,
        testName: 'T10',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".zoom-image--enabled", () => {
        document.body.classList.add(testInfo.className);
        function getGreenBtn() {
            const allBtns = document.querySelectorAll('a, button')
            if (allBtns.length) {
                allBtns.forEach(el => {

                    const bg = getComputedStyle(el).backgroundColor;

                    const match = bg.match(/\d+/g);

                    if (!match) return;

                    const [r, g, b] = match.map(Number);

                    if (r === 0 && g === 127 && b === 78) {
                        el.classList.add('gmd-red-btn');
                    }
                });
            }
        }
        getGreenBtn();

        const observer = new MutationObserver(() => {
            getGreenBtn();
        })
        observer.observe(document.body, {
            childList: true,
            subtree: CSSViewTransitionRule
        })
    });
})();