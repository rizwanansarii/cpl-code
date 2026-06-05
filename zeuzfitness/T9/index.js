(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-09',
        debug: 0,
        testName: 'T9 | PLP: subcategorieën altijd bereikbaar tijdens browsen (desktop sticky, mobiel in filter overlay)',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".collection .product-list", () => {
        document.body.classList.add(testInfo.className);

        const subCategory = document.querySelector('.collection__sub');
        const header = document.querySelector('.shopify-section--header');
        if (subCategory) {
            function checkSticky() {

                const stickyTop =
                    window.innerWidth <= 999
                        ? 201
                        : 219;

                subCategory.classList.toggle(
                    'gmd-is-sticky',
                    subCategory.getBoundingClientRect().top <= stickyTop
                );
            }

            window.addEventListener('scroll', checkSticky);
            window.addEventListener('resize', checkSticky);

            checkSticky();
            const drawer = document.querySelector('facet-drawer');
            if (drawer) {
                const shadow = drawer.shadowRoot;
                if (!shadow?.querySelector('.collection__sub')) {
                    shadow.querySelector('[part="header"]').append(
                        subCategory.cloneNode(true)
                    );
                    const style = document.createElement('style');

                    style.textContent = `
                        [part="header"] {
                            flex-wrap: wrap;
                        }
                        .collection__sub {
                            width: 100%;
                        }
                        .collection__sub-wrapper {
                            list-style: none;
                            display: flex;
                            justify-content: flex-start;
                            width: fit-content;
                            margin-left: auto;
                            margin-right: auto;
                            max-width: 100%;
                            flex-wrap: nowrap;
                            gap: 1rem;
                            overflow-x: auto;
                            padding: 0;
                            margin: 0;
                            padding-top: 1rem;
                            padding-bottom: .5rem;
                            margin-bottom: .5rem;
                        }
                        .collection__sub-item {
                            border-radius: 2px;
                            border: 1.5px solid rgba(46, 46, 46, .1);
                            padding: 10px 1.5rem;
                            text-transform: uppercase;
                            font-size: 14px;
                            font-weight: 700;
                            color: #2e2e2e;
                            display: flex;
                            align-items: center;
                            gap: .5rem;
                            transition: border-color .3s ease;
                            white-space: nowrap;
                            text-decoration: none;
                        }
                        .collection__sub-item-image {
                            width: 32px;
                            height: 32px;
                            overflow: hidden;
                        }
                        .collection__sub-item-image img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                        .collection__sub-wrapper--desktop {
                            display: none;
                        }
                    `;

                    shadow.prepend(style);
                }
            }
        }
    });
})();