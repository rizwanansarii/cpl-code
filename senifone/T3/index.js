(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-03',
        debug: 0,
        testName: "T3 | Levertijd dynamisch op PDP en in header",
        testVersion: 'v1'
    };
    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    let lang = document.querySelector("html").getAttribute("lang");


    //static time like when will deliver/which day
    const weekArray = {
        nl: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
        de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
    };

    const deliveryText = {
        nl: {
            orderBefore: ['Voor 17.00 uur besteld, ', 'is ', ' in huis'],
            orderToday: ['Vandaag besteld, ', 'is ', ' in huis']
        },
        de: {
            orderBefore: ['Vor 17 Uhr bestellt, ', 'am ', ' bei dir'],
            orderToday: ['Heute bestellt, ', 'am ', ' bei dir']
        }
    };

    const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
                        <path d="M5.43431 11.7643L0.234305 6.53442C-0.0781016 6.22021 -0.0781016 5.71077 0.234305 5.39654L1.36565 4.25865C1.67806 3.94442 2.18462 3.94442 2.49703 4.25865L6 7.78174L13.503 0.235652C13.8154 -0.0785507 14.3219 -0.0785507 14.6344 0.235652L15.7657 1.37353C16.0781 1.68774 16.0781 2.19718 15.7657 2.51141L6.56569 11.7644C6.25325 12.0786 5.74672 12.0786 5.43431 11.7643Z" fill="white"/>
                    </svg>`
    const calenderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                            <path d="M0 16.3125C0 17.2441 0.767857 18 1.71429 18H14.2857C15.2321 18 16 17.2441 16 16.3125V6.75H0V16.3125ZM11.4286 9.42188C11.4286 9.18984 11.6214 9 11.8571 9H13.2857C13.5214 9 13.7143 9.18984 13.7143 9.42188V10.8281C13.7143 11.0602 13.5214 11.25 13.2857 11.25H11.8571C11.6214 11.25 11.4286 11.0602 11.4286 10.8281V9.42188ZM11.4286 13.9219C11.4286 13.6898 11.6214 13.5 11.8571 13.5H13.2857C13.5214 13.5 13.7143 13.6898 13.7143 13.9219V15.3281C13.7143 15.5602 13.5214 15.75 13.2857 15.75H11.8571C11.6214 15.75 11.4286 15.5602 11.4286 15.3281V13.9219ZM6.85714 9.42188C6.85714 9.18984 7.05 9 7.28571 9H8.71429C8.95 9 9.14286 9.18984 9.14286 9.42188V10.8281C9.14286 11.0602 8.95 11.25 8.71429 11.25H7.28571C7.05 11.25 6.85714 11.0602 6.85714 10.8281V9.42188ZM6.85714 13.9219C6.85714 13.6898 7.05 13.5 7.28571 13.5H8.71429C8.95 13.5 9.14286 13.6898 9.14286 13.9219V15.3281C9.14286 15.5602 8.95 15.75 8.71429 15.75H7.28571C7.05 15.75 6.85714 15.5602 6.85714 15.3281V13.9219ZM2.28571 9.42188C2.28571 9.18984 2.47857 9 2.71429 9H4.14286C4.37857 9 4.57143 9.18984 4.57143 9.42188V10.8281C4.57143 11.0602 4.37857 11.25 4.14286 11.25H2.71429C2.47857 11.25 2.28571 11.0602 2.28571 10.8281V9.42188ZM2.28571 13.9219C2.28571 13.6898 2.47857 13.5 2.71429 13.5H4.14286C4.37857 13.5 4.57143 13.6898 4.57143 13.9219V15.3281C4.57143 15.5602 4.37857 15.75 4.14286 15.75H2.71429C2.47857 15.75 2.28571 15.5602 2.28571 15.3281V13.9219ZM14.2857 2.25H12.5714V0.5625C12.5714 0.253125 12.3143 0 12 0H10.8571C10.5429 0 10.2857 0.253125 10.2857 0.5625V2.25H5.71429V0.5625C5.71429 0.253125 5.45714 0 5.14286 0H4C3.68571 0 3.42857 0.253125 3.42857 0.5625V2.25H1.71429C0.767857 2.25 0 3.00586 0 3.9375V5.625H16V3.9375C16 3.00586 15.2321 2.25 14.2857 2.25Z" fill="#EE7855"/>
                        </svg>`

    function getDeliveryText(orderType, day, selector = 'header') {
        const text = deliveryText[lang][orderType];
        const dayName = weekArray[lang][day];
        if (document.querySelector('#shopify-section-announcement-bar') && selector == 'header') return text[0] + text[1] + dayName + text[2];
        if (document.querySelector('.quantity-submit-row .add-to-cart-holder') && selector == 'main') return `<b>${text[0]}</b>` + text[1] + dayName + text[2];
    }

    function getDeliveryDay(day, afterCutoff) {

        // Weekend → Tuesday
        if (day === 6 || day === 0) return 2;

        if (!afterCutoff) {
            switch (day) {
                case 1: return 2; // Mon → Tue
                case 2: return 3; // Tue → Wed
                case 3: return 4; // Wed → Thu
                case 4: return 5; // Thu → Fri
                case 5: return 1; // Fri → Mon
            }
        } else {
            switch (day) {
                case 1: return 3; // Mon → Wed
                case 2: return 4; // Tue → Thu
                case 3: return 5; // Wed → Fri
                case 4: return 1; // Thu → Mon
                case 5: return 2; // Fri → Tue
            }
        }
    }

    const getDeliveryTime = () => {

        const now = new Date();

        const amsterdamTime = new Date(
            now.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" })
        );

        const currentHour = amsterdamTime.getHours();
        const day = amsterdamTime.getDay();

        const afterCutoff = currentHour >= 17;

        const deliveryType = (day === 6 || day === 0)
            ? 'orderToday'
            : (afterCutoff ? 'orderToday' : 'orderBefore');

        const deliveryDay = getDeliveryDay(day, afterCutoff);

        const deliveryEl = document.querySelector(".gmd-usp-block .delivery-time-text");
        const deliveryProductEl = document.querySelector(".gmd-single-usp.single-usp");
        if (!deliveryEl) return;

        if (deliveryEl) deliveryEl.innerHTML = checkSvg + getDeliveryText(deliveryType, deliveryDay, 'header');
        if (deliveryProductEl) deliveryProductEl.innerHTML = `
            <div class="icon">
                ${calenderSvg}
            </div>
            <div class="text">
                <p>${getDeliveryText(deliveryType, deliveryDay, 'main')}</p>
            </div>`
            ;

    };

    waitForElement('#shopify-section-announcement-bar', () => {
        document.body.classList.add(testInfo.className);

        if (!document.querySelector('#shopify-section-announcement-bar .announcement .announcement__text .gmd-usp-block')) {
            const text = document.querySelector('#shopify-section-announcement-bar .announcement .announcement__text').textContent.trim();
            const parts = text.split('✓').filter(Boolean).map(t => t.trim());
            document.querySelector('#shopify-section-announcement-bar .announcement .announcement__text').innerHTML = `
            <div class="gmd-usp-block">
                <span class="usp-item first">${checkSvg} ${parts[0]}</span>
                <span class="usp-item second delivery-time-text"></span>
                <span class="usp-item third">${checkSvg} ${parts[2]}</span>
            </div>`;
            if (document.querySelector("#shopify-section-announcement-bar .announcement .announcement__text .gmd-usp-block")) {
                getDeliveryTime();
                setInterval(() => {
                    const now = new Date();
                    if (now.getSeconds() === 0) {
                        getDeliveryTime();
                    }
                }, 1000);
            }
        }
    });

    waitForElement('.quantity-submit-row .add-to-cart-holder', () => {
        document.body.classList.add(testInfo.className);

        if (!document.querySelector('.add-to-cart-holder .usps .gmd-single-usp.single-usp')) {
            document.querySelector('.add-to-cart-holder .usps').insertAdjacentHTML('beforeend', `<div class="gmd-single-usp single-usp gmd-delivery"></div>`);
            if (document.querySelector(".gmd-single-usp.single-usp")) {
                getDeliveryTime();
                setInterval(() => {
                    const now = new Date();
                    if (now.getSeconds() === 0) {
                        getDeliveryTime();
                    }
                }, 1000);
            }
        }
    });

})();
