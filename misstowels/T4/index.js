(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-04',
        debug: 0,
        testName: 'T4 | PDP hiërarchie',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    // ✅ RUN ONLY ON THESE URLS
    const allowedUrls = [
        '/products/handdoek-beste-kwaliteit',
        '/products/hotelkwaliteit-handdoek-bundel-5-1-gratis',
        '/products/hotelkwaliteit-handdoek-bundel-8-4-gratis'
    ];

    if (!allowedUrls.some(url => location.pathname.includes(url))) {
        return;
    }

    waitForElement(".main-product__inner", ([producPage]) => {
        document.body.classList.add(testInfo.className)

        function updateTitle(el, html) {
            if (!el) return;

            const textNode = [...el.childNodes].find(
                node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            );

            if (textNode) {
                textNode.remove();
                el.insertAdjacentHTML('afterbegin', html);
            } else {
                el.insertAdjacentHTML('afterbegin', html);
            }
        }

        function swapElement() {
            const connectedTypes = document.querySelector('.main-product__product-information .product-information__connected-types');
            const variantSwitcher = document.querySelector('.main-product__product-information .product-information__variant-switcher');

            if (connectedTypes && variantSwitcher) {
                const sizeWrapper = variantSwitcher.querySelector('.input--primary')?.closest('.variant-switcher__variant-fieldset')
                const colorWrapper = variantSwitcher.querySelector('.input--swatch')?.closest('.variant-switcher__variant-fieldset')
                if (sizeWrapper.previousElementSibling != connectedTypes) {
                    sizeWrapper.insertAdjacentElement('beforebegin', connectedTypes)
                    const sizeTitle = sizeWrapper.querySelector('.variant-fieldset__title');
                    const connectedTitle = connectedTypes.querySelector('.connected-types__title');
                    const colorTitle = colorWrapper.querySelector('.variant-fieldset__title');

                    updateTitle(sizeTitle, `<span><span class="gmd-bold-text">Stap 1 — </span>Kies je formaat</span>`);
                    updateTitle(connectedTitle, `<span><span class="gmd-bold-text">Stap 2 — </span>Kies je set</span>`);
                    updateTitle(colorTitle, `<span><span class="gmd-bold-text">Stap 3 — </span>Selecteer je kleur</span>`);

                    waitForElement('.main-product__product-information .title-and-reviews__text', () => {
                        const description = document.querySelector('.main-product__product-information .title-and-reviews__text');
                        const usps = document.querySelector('.product-information__usps');
                        if (description && usps) {
                            usps.insertAdjacentElement('afterend', description);
                        }
                    })
                }
            }
        }
        swapElement();

        const mainProductInner = document.querySelector('.main-product__inner');
        if (mainProductInner) {
            const observer = new MutationObserver(() => {
                swapElement();
            })
            observer.observe(mainProductInner, {
                childList: true,
                subtree: true
            })
        }
    });
})();