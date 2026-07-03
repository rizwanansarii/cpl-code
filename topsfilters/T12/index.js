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

    function waitForCondition(checkFn, callback, timer = 10000, frequency = 50) {
        const result = checkFn();
        if (result) {
            callback(result);
            return;
        }
        if (timer <= 0) {
            if (testInfo.debug) console.warn('[' + testInfo.className + '] waitForCondition timed out');
            return;
        }
        setTimeout(() => waitForCondition(checkFn, callback, timer - frequency, frequency), frequency);
    }

    // Wait for the spec cell itself, not just a nearby section
    waitForElement('td[data-th="Filterklasse"]', ([filterklasseCell]) => {
        const currentValue = filterklasseCell.textContent.trim();
        if (!targetValues.includes(currentValue)) {
            if (testInfo.debug) console.log('[' + testInfo.className + '] Filterklasse not in target list:', currentValue);
            return;
        }

        // Only now wait for the gallery to be ready and inject
        waitForElement('#gallery', ([galleryEl]) => {
            waitForCondition(
                () => (typeof Alpine !== 'undefined' ? Alpine : null),
                () => {

                    // Retry until Alpine has hydrated #gallery and images is a real array
                    waitForCondition(
                        () => {
                            const data = Alpine.$data(galleryEl);
                            return (data && Array.isArray(data.images)) ? data : null;
                        },
                        (galleryData) => {
                            document.body.classList.add(testInfo.className);

                            const newImage = {
                                img: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_desktop.png",
                                full: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_desktop.png",
                                thumb: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_mobile.png",
                                caption: document.querySelector('.page-title')?.textContent?.trim() || '',
                                type: "image"
                            };

                            galleryData.images.push(newImage);

                            if (testInfo.debug) {
                                console.log('[' + testInfo.className + '] Injected image', newImage);
                            }
                        }
                    );
                }
            );
        });
    });
})();