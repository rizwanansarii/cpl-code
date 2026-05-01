(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-15',
        debug: 0,
        testName: 'T15 | Checkout: Heading verbeteren + CTA naar vervolgstap',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".checkout-index-index #checkout", async () => {
        document.body.classList.add(testInfo.className)
        function updateSteps() {
            document.querySelectorAll('.opc-progress-bar-item .progress__title').forEach((title) => {

                [...title.childNodes].forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('.')) {
                        node.nodeValue = node.nodeValue.replace('.', '').replace(/\u00a0/, '');
                    }
                });

                const label = title.querySelector('span:last-child');
                if (!label) return;

                const text = label.textContent.trim();

                if (text.includes('Prüfung')) {
                    label.textContent = 'Zahlung';
                }

                if (text === 'Bestätigung' || text === 'Confirmation') {
                    label.textContent = 'Erledigt';
                }
            });

            const bar = document.querySelector('.opc-progress-bar');
            if (!bar) return;

            const steps = document.querySelectorAll('.progress__item');

            let activeIndex = 0;

            steps.forEach((step, index) => {
                if (step.classList.contains('progress__item--active')) {
                    activeIndex = index;
                }
            });

            bar.classList.remove('progress-step-1', 'progress-step-2', 'progress-step-3');

            bar.classList.add(`progress-step-${activeIndex + 1}`);

            const nextBtn = document.querySelector('button.continue span');
            if (nextBtn) {
                if (nextBtn.textContent.trim() == 'Weiter') {
                    nextBtn.textContent = 'Weiter zur Zahlung'
                }
            }
        }

        updateSteps();

        new MutationObserver(updateSteps).observe(
            document.querySelector('#checkout'),
            {
                childList: true,
                subtree: true
            }
        );
    });
})();