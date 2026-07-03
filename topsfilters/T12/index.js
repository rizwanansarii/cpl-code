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

    waitForElement("#gallery", ([galleryEl]) => {
        document.body.classList.add(testInfo.className)
        // Grab the Alpine component instance bound to #gallery
        const galleryData = Alpine.$data(galleryEl);

        if (!galleryData || !Array.isArray(galleryData.images)) {
            console.warn('[' + testInfo.className + '] Gallery Alpine data not found');
            return;
        }

        const newImage = {
            img: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_desktop.png",
            full: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_desktop.png",
            thumb: "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/TPF/overview_filterklasse_mobile.png",
            caption: document.querySelector('.page-title').textContent,
            type: "image"
        };

        // Push into the reactive array — Alpine re-renders thumb + slide automatically
        galleryData.images.push(newImage);

        if (testInfo.debug) {
            console.log('[' + testInfo.className + '] Injected image into gallery', newImage);
        }
    });
})();