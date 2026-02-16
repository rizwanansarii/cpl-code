(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-delivery-time',
        debug: 0,
        testName: 'T9 | Add Estimate Delivery time',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const daysInDutch = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
    const dutchHolidays = {
        2025: [
            '2025-01-01', // Nieuwjaarsdag
            '2025-04-18', // Goede Vrijdag
            '2025-04-20', // Pasen
            '2025-04-21', // Tweede Paasdag
            '2025-04-27', // Koningsdag
            '2025-05-05', // Bevrijdingsdag
            '2025-05-29', // Hemelvaartsdag
            '2025-06-08', // Pinksteren
            '2025-06-09', // Tweede Pinksterdag
            '2025-12-25', // Kerstmis
            '2025-12-26'  // Tweede Kerstdag
        ],
        2026: [
            '2026-01-01',
            '2026-04-03',
            '2026-04-05',
            '2026-04-06',
            '2026-04-27',
            '2026-05-05',
            '2026-05-14',
            '2026-05-24',
            '2026-05-25',
            '2026-12-25',
            '2026-12-26'
        ]
    };

    function getTimeNow() {
        return new Date(
            new Date().toLocaleString("en-US", { timeZone: "Europe/Amsterdam" })
        );
    }

    function getCutoffHour(day, isHoliday = false) {
        // Weekend or holiday -> 19:00
        if (day === 0 || day === 6 || isHoliday) return 19;
        return 22;
    }

    function isHoliday(date) {
        const year = date.getFullYear();
        const dateString = date.toISOString().split('T')[0];

        return dutchHolidays[year]?.includes(dateString);
    }

    function isWorkingDay(day) {
        const day = date.getDay();
        return day !== 0 && day !== 6 && !isHoliday(date);
    }

    function getNextWorkingDay(startDay, amount = 1) {
        let d = startDay;
        let count = amount;

        while (count > 0) {
            d = (d + 1) % 7;
            if (isWorkingDay(d)) count--;
        }

        return d;
    }

    function calculateDelivery() {
        const now = getTimeNow();
        const currentHour = now.getHours();
        const currentDay = now.getDay();

        const cutoffHour = getCutoffHour(currentDay);

        const isBeforeCutoff = currentHour < cutoffHour;

        let deliveryDay;

        if (isBeforeCutoff) {
            deliveryDay = getNextWorkingDay(currentDay, 1);
        } else {
            deliveryDay = getNextWorkingDay(currentDay, 2);
        }

        const isTomorrow = deliveryDay === (currentDay + 1) % 7;

        return {
            deliveryDay,
            isTomorrow,
            cutoffHour
        };
    }

    function getCountdown(cutoffHour) {
        const now = getTimeNow();
        const cutoff = new Date(now);

        cutoff.setHours(cutoffHour, 0, 0, 0);

        if (now >= cutoff) {
            cutoff.setDate(cutoff.getDate() + 1);
        }

        const diff = cutoff - now;

        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return {
            hours,
            minutes,
            seconds
        };
    }

    function generateDeliveryText() {
        const { deliveryDay, isTomorrow, cutoffHour } = calculateDelivery();
        const { hours, minutes, seconds } = getCountdown(cutoffHour);

        const timerHTML = `<span class="gmd-dp-timer"><span class="gmd-dp-time">${hours}u ${minutes}m ${seconds}s</span></span>`;

        const dayText = isTomorrow ? 'morgen' : daysInDutch[deliveryDay];

        return `
        <div class="gmd-dp-wrapper">
            <span class="gmd-dp-dot"></span>
            Binnen ${timerHTML} besteld, 
            <span class="gmd-dp-day">${dayText}</span> in huis
        </div>
        `;
    }

    function updateTimers(cartWrapper) {
        const { cutoffHour } = calculateDelivery();
        const { hours, minutes, seconds } = getCountdown(cutoffHour);
        cartWrapper.querySelectorAll('.gmd-dp-time').forEach(el => {
            el.textContent = `${hours}u ${minutes}m ${seconds}s`;
        });
    }

    function injectDeliveryMessage() {
        const lineItems = document.querySelectorAll('.woocommerce-cart-form .cart_item, #offcanvasCart .og-cart-items .row');

        lineItems.forEach(item => {
            if (item.querySelector('.gmd-dp-wrapper')) return;

            const targetEl = item.classList.contains('cart_item') ? item.querySelector('.col .row') : item.querySelector('.no-products');

            if (!targetEl) return;

            item.classList.contains('cart_item') ? targetEl.insertAdjacentHTML('beforeend', generateDeliveryText()) : targetEl.insertAdjacentHTML('beforebegin', generateDeliveryText());
        });
    }

    function observeCartChanges(targetContainer) {

        const container = targetContainer;

        if (!container) return;

        const observer = new MutationObserver(() => {
            injectDeliveryMessage();
        });

        observer.observe(container, {
            childList: true,
            subtree: true
        });
    }

    waitForElement(".woocommerce-cart", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        const cartForm = document.querySelector(".woocommerce-cart-form");
        const lineItems = document.querySelectorAll('.woocommerce-cart-form .cart_item');
        injectDeliveryMessage();
        observeCartChanges(cartForm, lineItems);
        setInterval(() => updateTimers(cartForm), 1000);
    });

    waitForElement(".og-cart-items .row", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);
        const cartForm = document.querySelector("#offcanvasCart");

        const lineItems = document.querySelectorAll('#offcanvasCart .og-cart-items .row');
        injectDeliveryMessage();
        observeCartChanges(cartForm);
        setInterval(() => updateTimers(cartForm), 1000);
    });

})();