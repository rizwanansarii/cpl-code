(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-25',
        debug: 0,
        testName: `T25 | Kosten benoemen in laatste funnel stap`,
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement('#wijcbf_bookly_form', () => {

        function getSelectedServicePrice() {
            const priceEl = document.querySelector('#wijcbf_category .wijcbf_service.selected .wijcbf_service_price');
            return priceEl ? priceEl.textContent.trim() : null;
        }

        function insertPriceIntoSummary() {
            const summaryEl = document.querySelector('#wijcbf_personal_data #wijcbf_summary');
            if (!summaryEl) return;

            if (summaryEl.querySelector('.gmd-bold')) return;

            const price = getSelectedServicePrice();
            if (!price) return;

            const updated = summaryEl.innerHTML.replace(/geselecteerd\.\s*$/, `voor <span class="gmd-bold">${price}</span> geselecteerd.`);

            if (updated !== summaryEl.innerHTML) {
                summaryEl.innerHTML = updated;
            }
        }

        function isStep4Visible() {
            const step = document.getElementById('wijcbf_personal_data');
            return step && step.style.display !== 'none' && window.getComputedStyle(step).display !== 'none';
        }

        function hideField() {
            if (document.querySelector('#wijcbf_personal_data')) {
                const foundByField = document.querySelector('#found_by')?.closest('.wijcbf_field');
                if (foundByField && !foundByField.classList.contains('hidden')) {
                    foundByField.classList.add('hidden');
                }
            }
        }

        function runIfVisible() {
            document.body.classList.add(testInfo.className)
            if (!isStep4Visible()) return;
            insertPriceIntoSummary();
            hideField();
        }
        runIfVisible();

        const target = document.querySelector('#wijcbf_personal_data');
        const observer = new MutationObserver(() => {
            if (target) {
                runIfVisible();
            }
        })
        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        })
    });
})();