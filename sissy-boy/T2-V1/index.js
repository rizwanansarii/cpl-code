(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-02-v1',
        debug: 0,
        testName: 'T2-V1 | Mobiele zoekbalk optimalisatie',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function injectCSS() {
        if (document.getElementById('gmd-style')) return;

        const style = document.createElement('style');
        style.id = 'gmd-style';

        style.innerHTML = `
            @media (max-width: 767px) {
                .gmd-02-v1:has(.promobanners) .app .main {
                    padding-top: 7.5rem;
                }
                .gmd-02-v1 .app .app__main {
                    padding-top: 6.5rem;
                }
                .gmd-02-v1 .header__desktop-search {
                    margin-bottom: 0;
                }

                .gmd-02-v1 .header__desktop-search .search-fake {
                    max-width: fit-content;
                    padding: 0 8px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    waitForElement("#main", () => {
        injectCSS();
        function moveSearch() {
            if (window.innerWidth <= 767) {
                document.querySelector('body').classList.add(testInfo.className)
                const header = document.querySelector('.header')
                const headerSearch = document.querySelector('.header__desktop-search');
                const hamburger = document.querySelector('.header__navigation');

                if (!headerSearch || !hamburger) return;

                if (header.querySelector('.header__container .header__desktop-search')) return;
                hamburger.insertAdjacentElement('beforebegin', headerSearch);
            }
        }

        moveSearch();

        const observer = new MutationObserver(() => {
            moveSearch();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
})();