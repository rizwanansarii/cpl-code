(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-12',
        debug: 0,
        testName: 'T12 | Filterklassen toevoegen als informatieve afbeelding',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const targetValues = [
        'F7', 'F9', 'G3', 'G4', 'G4+F7', 'M5', 'G2', 'G3+M6',
        'M6', 'G4+M6', 'G3+F7', 'G4+M5', 'G4+F9', 'M5+F7',
        'G3+G4', 'G2+F7'
    ];

    // Wait for the spec cell itself, not just a nearby section
    waitForElement('td[data-th="Filterklasse"]', ([filterklasseCell]) => {
        const currentValue = filterklasseCell.textContent.trim();
        if (!targetValues.includes(currentValue)) {
            if (testInfo.debug) console.log('[' + testInfo.className + '] Filterklasse not in target list:', currentValue);
            return;
        }

        // Only now wait for the gallery to be ready and inject
        waitForElement('#gallery', ([galleryEl]) => {
            setTimeout(() => {
                if (typeof Alpine === 'undefined') {
                    if (testInfo.debug) console.warn('[' + testInfo.className + '] Alpine not loaded');
                    return;
                }

                const galleryData = Alpine.$data(galleryEl);
                if (!galleryData || !Array.isArray(galleryData.images)) {
                    if (testInfo.debug) console.warn('[' + testInfo.className + '] Gallery Alpine data not found');
                    return;
                }

                document.body.classList.add(testInfo.className);
                const newImage = {
                    img: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_desktop.png",
                    full: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_desktop.png",
                    thumb: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_mobile.png",
                    caption: document.querySelector('.page-title').textContent,
                    type: "image"
                };

                galleryData.images.push(newImage);

                if (testInfo.debug) {
                    console.log('[' + testInfo.className + '] Injected image', newImage);
                }
            })
        });
    });
})();