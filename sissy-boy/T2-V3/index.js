(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-02-v3',
        debug: 0,
        testName: 'T2-V3 | Mobiele zoekbalk optimalisatie',
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
                .gmd-02-v3:has(.promobanners) .app .main {
                    padding-top: 7.5rem;
                }
                .gmd-02-v3 .app .app__main {
                    padding-top: 6.5rem;
                }
                .gmd-02-v3 .header__desktop-search {
                    display: none;
                }
                .gmd-02-v3 .header__navigation .navigation__toggle {
                    display: none;
                }
                .gmd-02-v3 .header__container .app__like-menu__item {
                    width: -moz-fit-content;
                    width: fit-content;
                    margin-left: auto;
                    padding: 0;
                }
                .gmd-02-v3 .header .header__logo {
                    top: unset;
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
                const footerMenu = document.querySelector('.app__like-menu .app__like-menu__item .mini-menu__icon')?.closest('.app__like-menu__item').cloneNode(true);
                const hamburger = document.querySelector('.header__navigation .navigation__toggle');

                if (!footerMenu || !hamburger) return;

                if (header.querySelector('.header__container .header__navigation .app__like-menu__item')) return;
                hamburger.insertAdjacentElement('beforebegin', footerMenu);
                header.querySelector('.header__container .header__navigation .app__like-menu__item').addEventListener('click', () => {
                    document.querySelector('.app__like-menu .app__like-menu__item .mini-menu__icon')?.closest('.app__like-menu__item').click()
                });
            }
        }

        moveSearch();

        const observer = new MutationObserver(() => {
            setTimeout(() => {
                moveSearch();
            })
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    });
})();