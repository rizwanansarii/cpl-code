(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-02',
        debug: 0,
        testName: 'T2 | Vermijd sticky header en sticky search voor betere overview op mobile',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement("#header", ([producPage]) => {
        let lastScroll = 0;

        const header = document.querySelector('.page-header');

        function handleScroll() {
            if (window.innerWidth > 767) return;
            document.querySelector('body').classList.add(testInfo.className)

            const currentScroll = window.scrollY;

            if (currentScroll > lastScroll && currentScroll > 5 && currentScroll > 120) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }

            lastScroll = currentScroll;
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
                header.classList.remove('header-hidden');
                document.querySelector('body').classList.remove(testInfo.className)
            }
        });
    });
})();