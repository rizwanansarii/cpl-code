(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-34',
        debug: 0,
        testName: 'T34 | Specifieke leverdatum tonen',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function getNow() {
        return new Date(
            new Date().toLocaleString("en-US", { timeZone: "Europe/Amsterdam" })
        );
    }

    function isBusinessDay(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    }

    function addBusinessDays(date, days) {
        let d = new Date(date.getTime());

        while (days > 0) {
            d.setDate(d.getDate() + 1);
            if (isBusinessDay(d)) days--;
        }

        return d;
    }

    function shiftToNextBusinessDay(date) {
        let d = new Date(date);
        while (!isBusinessDay(d)) {
            d.setDate(d.getDate() + 1);
        }
        return d;
    }

    function normalizeStatus(s) {
        return (s || "")
            .replace(/[–—−]/g, "-")
            .replace(/\s*-\s*/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    }
    // function isAfterCutoff1730(date) {
    //     const h = date.getHours();
    //     const m = date.getMinutes();
    //     return h > 11 || (h === 11 && m >= 0);
    // }

    function getBaseShipDay() {
        // "today" in Amsterdam time
        const now = getNow();

        // start from today, but always align to business day
        let base = shiftToNextBusinessDay(now);

        // if it's a business day AND after 17:30, move to next business day
        // if (isBusinessDay(now) && isAfterCutoff1730(now)) {
        //     base = addBusinessDays(base, 1);
        // }

        // normalize time (optional, but keeps formatting consistent)
        base.setHours(12, 0, 0, 0);
        return base;
    }

    function formatDutchDate(date) {
        const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

        const day = date.getDate();
        const month = months[date.getMonth()];

        return `voor ${day} ${month} in huis`;
    }

    function getLatestDispatch(statusText) {
        const baseDay = getBaseShipDay();
        const s = normalizeStatus(statusText);

        // Unavailable: no date
        if (s.includes("Vorübergehend nicht verfügbar")) return null;

        // Sofort: ships on baseDay (today if before cutoff, next business day if after cutoff / weekend)
        if (s.includes("Sofort versandfertig")) {
            return baseDay;
        }

        // ✅ RANGE (e.g. 2 - 4 werkdagen)
        let match = s.match(/(\d+)\s*[-–]\s*(\d+)/);
        if (match) {
            const maxDays = parseInt(match[2], 10);
            const finalDate = addBusinessDays(baseDay, maxDays);
            return formatDutchDate(finalDate);
        }

        // ✅ SINGLE VALUE (e.g. 10 werkdagen)
        match = s.match(/(\d+)\s*werkdagen/);
        if (match) {
            const days = parseInt(match[1], 10);
            const finalDate = addBusinessDays(baseDay, days);
            return formatDutchDate(finalDate);
        }

        return null;
    }

    function renderShippingTimeline(targetEl, mainContainer, location) {

        const target = targetEl;
        if (!target) return;

        if (mainContainer.querySelector('.gmd-shipping-timeline')) return;

        const statusEl = document.querySelector('#tab_details_eigenschappen .delivery-time');
        if (!statusEl) return;

        const statusText = statusEl.textContent.trim();

        const dispatchDate = getLatestDispatch(statusText);

        let line1;

        if (dispatchDate) {
            if (!mainContainer.classList.contains('product-options-bottom')) {
                line1 = `Levertijd: ${dispatchDate}`;
            } else {
                line1 = `${dispatchDate.charAt(0).toUpperCase() + dispatchDate.slice(1)}`;
            }
        }

        let html = `<span class="gmd-shipping-timeline">${line1}</span>`;



        target.insertAdjacentHTML(location, html);
    }

    waitForElement(".catalog-product-view #tab_details_eigenschappen .delivery-time", () => {
        document.querySelector('body').classList.add(testInfo.className)

        function loadTest() {
            const targetMain = document.querySelector('#tab_details_eigenschappen .delivery-time');
            const mainContainer = document.querySelector('#tab_details_eigenschappen');
            if (!mainContainer.querySelector('.gmd-shipping-timeline')) {
                renderShippingTimeline(targetMain, mainContainer, 'afterend');
            }
            waitForElement(".catalog-product-view .product-options-bottom .delivery-time", () => {
                const mainContainer = document.querySelector('.product-options-bottom');
                const deliveryText = document.querySelector('.product-options-bottom .delivery-time p');
                const html = deliveryText.innerHTML;
                if (!mainContainer.querySelector('.gmd-shipping-timeline')) {
                    const parts = html.split(/<br\s*\/?>/i);

                    if (parts.length === 2) {
                        deliveryText.innerHTML = `
                            <span class="gmd-delivery-text">${parts[0].trim()}</span><br>
                            <span class="gmd-shipping-text">${parts[1].trim()}</span>
                        `;
                        const targetMain = document.querySelector('.product-options-bottom .delivery-time .gmd-delivery-text');
                        renderShippingTimeline(targetMain, mainContainer, 'afterend');
                    }
                }
            });
        }
        loadTest();
        const target = document.querySelector('.product-add-form');

        if (target) {
            const observer = new MutationObserver(() => {
                loadTest();
            })
            observer.observe(target, {
                childList: true,
                subtree: true
            })
        }


    });
})();