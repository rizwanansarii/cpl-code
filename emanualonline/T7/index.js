(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-07',
        debug: 0,
        testName: 'T7 | PDP, tabs to accordions is ready for development!',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".catalog-product-view .price-final_price.price-box", ([]) => {
        document.querySelector('body').classList.add(testInfo.className);

        function buildAccordion() {
            if (!document.querySelector('.gmd-accordion')) {
                document.querySelector('section[x-data*="activeTab"]').classList.add('gmd-accordion');
                document.querySelectorAll('.gmd-accordion > div[id]').forEach((tab, index) => {
                    tab.classList.add('gmd-accordion-tab');
                    if (index == 0) tab.classList.add('gmd-active')
                    if (!tab.querySelector('.gmd-heading')) {
                        const heading = tab.closest('.gmd-accordion').querySelector(`label#${CSS.escape(tab.id)}`).textContent;
                        if (!tab.closest('.gmd-accordion').querySelector(`label#${CSS.escape(tab.id)}`).parentElement.classList.contains('old-heading-wrapper')) tab.closest('.gmd-accordion').querySelector(`label#${CSS.escape(tab.id)}`).parentElement.classList.add('old-heading-wrapper')
                        tab.insertAdjacentHTML('afterbegin', `
                            <h3 class="gmd-heading">${heading}
                                <span class="gmd-accordion-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="13" viewBox="0 0 22 13" fill="none">
                                        <path d="M9.83265 12.5968L0.34325 3.1073C-0.114416 2.64964 -0.114416 1.90764 0.34325 1.45003L1.45004 0.343238C1.90692 -0.113646 2.6474 -0.114526 3.10536 0.341285L10.6613 7.86184L18.2172 0.341285C18.6752 -0.114526 19.4157 -0.113646 19.8725 0.343238L20.9793 1.45003C21.437 1.90769 21.437 2.64968 20.9793 3.1073L11.49 12.5968C11.0323 13.0544 10.2903 13.0544 9.83265 12.5968Z" fill="#4C74CD"/>
                                    </svg>
                                </span>
                            </h3>`
                        );
                        tab.querySelector('.gmd-heading').addEventListener('click', () => {
                            const parent = tab.closest('.gmd-accordion');
                            parent.querySelectorAll('.gmd-accordion-tab').forEach(el => {
                                el.classList.remove('gmd-active');
                            });
                            tab.classList.add('gmd-active');
                            parent.querySelector(`label#${CSS.escape(tab.id)}`).click();
                        });
                    }
                })

            }
        }
        buildAccordion();
        const observer = new MutationObserver(() => {
            buildAccordion();
        });
        observer.observe(document.querySelector('.product-info-main .gmd-accordion'), {
            childList: true,
            subtree: true
        })



    })
})();
