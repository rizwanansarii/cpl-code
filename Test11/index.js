(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-007',
        debug: 0,
        testName: 'T7 | Add Estimate Shipping time',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".catalog-product-view", () => {
        document.querySelector('body').classList.add(testInfo.className)
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

        function getLatestDispatch(statusText) {
            const today = getNow();

            if (statusText.includes("Vorübergehend nicht verfügbar")) {
                return null;
            }

            if (statusText.includes("Sofort versandfertig")) {
                return today;
            }

            if (statusText.includes("1–3")) {
                return addBusinessDays(today, 3);
            }

            if (statusText.includes("7 - 10")) {
                const d = new Date(today);
                d.setDate(d.getDate() + 10);
                return shiftToNextBusinessDay(d);
            }

            return null;
        }

        function formatGermanDate(date) {
            const formatted = new Intl.DateTimeFormat('de-DE', {
                weekday: 'short',
                day: '2-digit',
                month: 'short'
            }).format(date);

            return formatted.replace(/\.$/, '');
        }

        function getUPSLine() {
            const now = getNow();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            const beforeCutoff = isBusinessDay(now) && (hours < 16 || (hours === 16 && minutes < 30));

            if (beforeCutoff) {
                return `<span>UPS Express: <span class="gmd-bold-text">1 Werktag nach Versand</span> (Bestellung bis 16:30)</span>`;
            }

            return `<span>UPS Express: <span class="gmd-bold-text">1 Werktag nach Versand</span> (bis 16:30 am nächsten Werktag)</span>`;
        }

        function renderShippingTimeline(targetEl, mainContainer, location) {

            const target = targetEl;
            if (!target) return;

            if (mainContainer.querySelector('.gmd-shipping-timeline')) return;

            const statusEl = document.querySelector('.product-info-main .amstockstatus-status-container .amstockstatus');
            if (!statusEl) return;

            const statusText = statusEl.textContent.trim();

            const statusForAts = statusText.includes('Versandfertig in') ? statusText.replace('Versandfertig in ', '') : statusText;

            const dispatchDate = getLatestDispatch(statusText);
            const iconSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
                    <path d="M21.7653 7.36727L20.13 4.11636C19.9476 3.75254 19.6662 3.44663 19.3176 3.23326C18.9689 3.0199 18.567 2.9076 18.1573 2.90909H14.6667V2.18182C14.665 1.60368 14.4326 1.04971 14.0204 0.640902C13.6082 0.232097 13.0496 0.00168653 12.4667 0H4.4C3.81705 0.00168653 3.25846 0.232097 2.84624 0.640902C2.43403 1.04971 2.2017 1.60368 2.2 2.18182V2.90909H0.733333C0.538841 2.90909 0.352315 2.98571 0.214788 3.1221C0.0772617 3.25849 0 3.44348 0 3.63636C0 3.82924 0.0772617 4.01423 0.214788 4.15062C0.352315 4.28701 0.538841 4.36363 0.733333 4.36363H5.13333C5.32783 4.36363 5.51435 4.44026 5.65188 4.57665C5.7894 4.71304 5.86667 4.89802 5.86667 5.0909C5.86667 5.28379 5.7894 5.46877 5.65188 5.60516C5.51435 5.74155 5.32783 5.81818 5.13333 5.81818H2.2C2.00551 5.81818 1.81898 5.8948 1.68146 6.03119C1.54393 6.16758 1.46667 6.35256 1.46667 6.54545C1.46667 6.73833 1.54393 6.92332 1.68146 7.05971C1.81898 7.1961 2.00551 7.27272 2.2 7.27272H6.6C6.79449 7.27272 6.98102 7.34934 7.11855 7.48573C7.25607 7.62212 7.33333 7.80711 7.33333 7.99999C7.33333 8.19288 7.25607 8.37786 7.11855 8.51425C6.98102 8.65064 6.79449 8.72726 6.6 8.72726H0.733333C0.538841 8.72726 0.352315 8.80389 0.214788 8.94028C0.0772617 9.07667 0 9.26165 0 9.45454C0 9.64742 0.0772617 9.83241 0.214788 9.9688C0.352315 10.1052 0.538841 10.1818 0.733333 10.1818H2.2V11.6364C2.20171 12.2145 2.43404 12.7685 2.84625 13.1773C3.25846 13.5861 3.81705 13.8165 4.4 13.8182H5.22867C5.39064 14.4431 5.75778 14.9967 6.27217 15.3918C6.78655 15.7868 7.41892 16.0008 8.06951 16C8.72011 15.9992 9.35191 15.7835 9.86527 15.3872C10.3786 14.9908 10.7443 14.4362 10.9047 13.8109C10.9361 13.8169 10.968 13.8194 11 13.8182H13.9333C13.9653 13.8194 13.9973 13.8169 14.0287 13.8109C14.1889 14.4368 14.555 14.9918 15.069 15.3883C15.583 15.7848 16.2155 16 16.8667 16C17.5178 16 18.1504 15.7848 18.6643 15.3883C19.1783 14.9918 19.5444 14.4368 19.7047 13.8109C19.7361 13.8169 19.768 13.8194 19.8 13.8182H21.2667C21.461 13.8176 21.6472 13.7408 21.7846 13.6045C21.922 13.4683 21.9994 13.2836 22 13.0909V8.34181C21.9999 8.00321 21.9195 7.66939 21.7653 7.36727ZM8.06667 14.5454C7.77659 14.5454 7.49302 14.4601 7.25183 14.3003C7.01064 14.1405 6.82265 13.9133 6.71164 13.6475C6.60064 13.3817 6.57159 13.0893 6.62818 12.8071C6.68477 12.525 6.82446 12.2658 7.02958 12.0624C7.23469 11.859 7.49603 11.7204 7.78053 11.6643C8.06504 11.6082 8.35994 11.637 8.62794 11.7471C8.89593 11.8572 9.125 12.0436 9.28616 12.2828C9.44732 12.522 9.53333 12.8032 9.53333 13.0909C9.53219 13.4763 9.3773 13.8456 9.10249 14.1182C8.82769 14.3907 8.4553 14.5443 8.06667 14.5454ZM16.8667 14.5454C16.5766 14.5454 16.293 14.4601 16.0518 14.3003C15.8106 14.1405 15.6227 13.9133 15.5116 13.6475C15.4006 13.3817 15.3716 13.0893 15.4282 12.8071C15.4848 12.525 15.6245 12.2658 15.8296 12.0624C16.0347 11.859 16.296 11.7204 16.5805 11.6643C16.865 11.6082 17.1599 11.637 17.4279 11.7471C17.6959 11.8572 17.925 12.0436 18.0862 12.2828C18.2473 12.522 18.3333 12.8032 18.3333 13.0909C18.3322 13.4763 18.1773 13.8456 17.9025 14.1182C17.6277 14.3907 17.2553 14.5443 16.8667 14.5454ZM14.6667 7.27272V4.36363H18.1573C18.2941 4.36198 18.4287 4.39864 18.5454 4.4694C18.6621 4.54016 18.7564 4.64214 18.8173 4.76363L20.0787 7.27272H14.6667Z" fill="#3EB01A"/>
                </svg>
            `;

            let line1;

            if (!dispatchDate) {
                line1 = statusText;
            } else {
                line1 = `Spätestens versandt: ${formatGermanDate(dispatchDate)}`;
            }

            let html = `
                <div class="gmd-shipping-timeline main">
                    <div class="gmd-line-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 18 16" fill="none">
                            <circle cx="11" cy="8" r="4" fill="${statusForAts.includes('7 - 10') ? `#E0E000` : statusForAts.includes('Vorübergehend nicht verfügbar') ? `#FF9500` : `#3EB01A`}"/>
                        </svg>
                        <span class="gmd-line-1-text">${line1}</span>
                    </div>
                    ${!statusText.includes("Vorübergehend nicht verfügbar") ? `
                        <div class="gmd-line-2">
                            ${iconSvg} ${getUPSLine()}
                        </div>
                        ` : ``}
                </div>
            `;

            html += `</div>`;

            target.insertAdjacentHTML(location, html);
        }

        const targetMain = document.querySelector('.product-info-main .price-box');
        const mainContainer = document.querySelector('.product-info-main');
        renderShippingTimeline(targetMain, mainContainer, 'afterend');
    });
})();