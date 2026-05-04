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

        function buildAccordionJSON() {
            const data = [];

            const labels = document.querySelectorAll('.tab-control');

            labels.forEach(label => {
                const id = label.id;
                if (!id) return;

                // ⚠️ IMPORTANT: escape ID (because of "reviews.tab")
                const content = document.querySelector(`div#${CSS.escape(id)}`);

                if (!content) return;

                data.push({
                    id: id,
                    header: label.textContent.trim(),
                    content: content.innerHTML
                });
            });
            return data;
        }

        function buildAccordion() {
            if (!document.querySelector('.gmd-accordion')) {
                document.querySelector('.product-info-main').insertAdjacentHTML('beforeend', `
                    <div class="gmd-accordion"></div>
                `);
                let accordionContent = '';
                buildAccordionJSON().map((item, index) => {
                    accordionContent += `
                        <div class="gmd-accordion__item ${index == 0 ? 'active' : ' '}">
                            <div class="gmd-accordion__header">
                                <span>${item.header}</span>
                                <span class="gmd-accordion__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="13" viewBox="0 0 22 13" fill="none">
                                        <path d="M9.83265 12.5968L0.34325 3.1073C-0.114416 2.64964 -0.114416 1.90764 0.34325 1.45003L1.45004 0.343238C1.90692 -0.113646 2.6474 -0.114526 3.10536 0.341285L10.6613 7.86184L18.2172 0.341285C18.6752 -0.114526 19.4157 -0.113646 19.8725 0.343238L20.9793 1.45003C21.437 1.90769 21.437 2.64968 20.9793 3.1073L11.49 12.5968C11.0323 13.0544 10.2903 13.0544 9.83265 12.5968Z" fill="#4C74CD"/>
                                    </svg>
                                </span>
                            </div>
                            <div class="gmd-accordion__content">
                                <div class="gmd-accordion__content-inner">
                                    ${item.content}
                                </div>
                            </div>
                        </div>
                    `;
                });
                document.addEventListener('click', (e) => {
                    const item = e.target.closest('.gmd-accordion__item');
                    if (!item) return;

                    if (item.classList.contains('active')) return;

                    document.querySelectorAll('.gmd-accordion__item').forEach(el => {
                        el.classList.remove('active');
                    });

                    item.classList.add('active');
                });
            } else {
                let accordionContent = '';
                buildAccordionJSON().map((item, index) => {
                    accordionContent += `
                        <div class="gmd-accordion__item ${index == 0 ? 'active' : ' '}">
                            <div class="gmd-accordion__header">
                                <span>${item.header}</span>
                                <span class="gmd-accordion__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="13" viewBox="0 0 22 13" fill="none">
                                        <path d="M9.83265 12.5968L0.34325 3.1073C-0.114416 2.64964 -0.114416 1.90764 0.34325 1.45003L1.45004 0.343238C1.90692 -0.113646 2.6474 -0.114526 3.10536 0.341285L10.6613 7.86184L18.2172 0.341285C18.6752 -0.114526 19.4157 -0.113646 19.8725 0.343238L20.9793 1.45003C21.437 1.90769 21.437 2.64968 20.9793 3.1073L11.49 12.5968C11.0323 13.0544 10.2903 13.0544 9.83265 12.5968Z" fill="#4C74CD"/>
                                    </svg>
                                </span>
                            </div>
                            <div class="gmd-accordion__content">
                                <div class="gmd-accordion__content-inner">
                                    ${item.content}
                                </div>
                            </div>
                        </div>
                    `;
                });
                document.querySelector('.gmd-accordion').innerHTML = accordionContent;
            }
        }
        buildAccordion();
        const observer = new MutationObserver(() => {
            buildAccordion();
        });
        observer.observe(document.querySelector('.product-info-main section[x-data]'), {
            childList: true,
            subtree: true
        })



    })
})();
