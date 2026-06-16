(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-39',
        debug: 0,
        testName: "T39 | Toevoegen van afbeeldingen aan de categorieën in het menu",
        testVersion: 'v1'
    };
    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement('#mainmenu', () => {
        document.body.classList.add(testInfo.className)

        const MENU_IMAGES = {
            'rolgordijnen': `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M38.6395 4.0918H9.35547V43.9118H38.6395V4.0918Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M35.8606 9.04004H12.1406V41.292H35.8606V9.04004Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M41.6966 4.0918H6.30859V25.1678H41.6966V4.0918Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.7656 36.2638L26.5896 29.4438" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23.7031 36.5641L25.9151 34.3521" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M43.5369 4.0918H4.46094V7.2318H43.5369V4.0918Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'dakraam': `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M41.1607 29.3881L40.3367 25.4121L39.6047 21.8881L38.8127 18.0681L38.0447 14.3641L36.5567 7.2041H4.47266L5.96066 14.3641L6.72866 18.0681L7.52066 21.8881L8.25266 25.4121L9.07666 29.3881L11.4447 40.7961H43.5287L41.1607 29.3881Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M35.924 17.6799L35.104 13.7359L34.304 9.87988H7.83203L8.63203 13.7359L9.45203 17.6799L10.296 21.7519L11.26 26.2639H37.704L35.924 17.6799Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M40.1684 38.1199H13.6964L11.7324 28.5239H38.2044L40.1684 38.1199Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M38.2038 28.5242H11.7318L11.2598 26.2642H37.7038L38.2038 28.5242Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21.6289 34.0919L27.1929 28.5239" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M25.5625 34.3917L27.7785 32.1797" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'houten-jaloezien': `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M38.6414 4.0918H9.35742V43.9118H38.6414V4.0918Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M35.8606 9.04004H12.1406V41.292H35.8606V9.04004Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.7656 36.2638L26.5896 29.4438" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23.7031 36.5641L25.9151 34.3521" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M43.5369 4.0918H4.46094V7.2318H43.5369V4.0918Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24.0009 7.23193H4.95694L4.46094 9.28393H24.0009H43.5409L43.0449 7.23193H24.0009Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24.0009 11.0161H4.95694L4.46094 13.0721H24.0009H43.5409L43.0449 11.0161H24.0009Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24.0009 14.7998H4.95694L4.46094 16.8558H24.0009H43.5409L43.0449 14.7998H24.0009Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24.0009 18.5879H4.95694L4.46094 20.6399H24.0009H43.5409L43.0449 18.5879H24.0009Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24.0009 22.3721H4.95694L4.46094 24.4241H24.0009H43.5409L43.0449 22.3721H24.0009Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.748 7.23193V24.4239" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M37.2539 7.23193V24.4239" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'jaloezien': `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M6.9043 10.1838H41.0963L40.2323 7.2998H6.9043" fill="#585858"/>
                    <path d="M6.9043 10.1838H41.0963L40.2323 7.2998H6.9043" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.9043 15.3557H41.0963L40.2323 12.4717H6.9043" fill="#585858"/>
                    <path d="M6.9043 15.3557H41.0963L40.2323 12.4717H6.9043" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.9043 20.528H41.0963L40.2323 17.644H6.9043" fill="#585858"/>
                    <path d="M6.9043 20.528H41.0963L40.2323 17.644H6.9043" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.9043 25.6999H41.0963L40.2323 22.8159H6.9043" fill="#585858"/>
                    <path d="M6.9043 25.6999H41.0963L40.2323 22.8159H6.9043" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.9043 30.8718H41.0963L40.2323 27.9878H6.9043" fill="#585858"/>
                    <path d="M6.9043 30.8718H41.0963L40.2323 27.9878H6.9043" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.9043 35.7038H41.0963L40.2323 32.8198H6.9043" fill="#585858"/>
                    <path d="M6.9043 35.7038H41.0963L40.2323 32.8198H6.9043" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.9043 40.6838H41.0963L40.2323 37.7998H6.9043" fill="#585858"/>
                    <path d="M6.9043 40.6838H41.0963L40.2323 37.7998H6.9043" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M32.2215 7.27979H30.7695V40.6998H32.2215V7.27979Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'plissgordijnen': `
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <path d="M96.6001 10.2305H23.3901V109.78H96.6001V10.2305Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M89.6501 18.0205H30.3501V103.241H89.6501V18.0205Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M106.58 76.8408H54.0502H53.0002H13.4602L10.9402 81.3408L13.4602 85.8308H53.0002H54.0502H106.58L109.1 81.3408L106.58 76.8408Z" fill="#595859" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M106.58 58.8613H54.0502H53.0002H13.4602L10.9402 63.3613L13.4602 67.8513H53.0002H54.0502H106.58L109.1 63.3613L106.58 58.8613Z" fill="#595859" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M106.58 67.8516H54.0502H53.0002H13.4602L10.9402 72.3516L13.4602 76.8416H53.0002H54.0502H106.58L109.1 72.3516L106.58 67.8516Z" fill="#595859" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M106.58 40.8809H54.0502H53.0002H13.4602L10.9402 45.3809L13.4602 49.8709H53.0002H54.0502H106.58L109.1 45.3809L106.58 40.8809Z" fill="#595859" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M106.58 49.8711H54.0502H53.0002H13.4602L10.9402 54.3711L13.4602 58.8611H53.0002H54.0502H106.58L109.1 54.3711L106.58 49.8711Z" fill="#595859" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.9402 45.3809H109.1" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.9402 54.3711H109.1" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.9402 63.3613H107.87" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.9402 72.3506H109.1" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.9001 81.3408H109.06" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M108.84 32.0703H11.1501V39.9203H108.84V32.0703Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M108.84 83.8105H11.1501V91.6606H108.84V83.8105Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'duo-rolgordijnen': `
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <path d="M96.5999 10.2305H23.3899V109.78H96.5999V10.2305Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M89.6501 22.5996H30.3501V103.23H89.6501V22.5996Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M104.24 10.2305H15.77V62.9205H104.24V10.2305Z" fill="#585858" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M49.4099 90.6604L66.4699 73.6104" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M59.25 91.4099L64.78 85.8799" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M104.24 45.1104H15.77V54.0103H104.24V45.1104Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M104.24 27.3096H15.77V36.2096H104.24V27.3096Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M108.84 10.2305H11.1499V18.0805H108.84V10.2305Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'gordijnen': `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M38.6395 3.3999H9.35547V43.2199H38.6395V3.3999Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M35.8606 5.58398H12.1406V40.6H35.8606V5.58398Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.7656 35.572L26.5896 28.752" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23.7031 35.8722L25.9151 33.6602" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.6289 5.80811V43.2041L15.2449 42.8601C13.7329 41.4961 11.9449 41.4961 10.4289 42.8601L10.0449 43.2041V5.80811H15.6289Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M37.9551 5.80811V43.2041L37.5711 42.8601C36.0591 41.4961 34.2711 41.4961 32.7551 42.8601L32.3711 43.2041V5.80811H37.9551Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20.9009 5.80811V43.2281H15.6289V43.2081V43.2041V5.80811H20.9009Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.0449 5.80401V43.232L9.66094 43.576C8.14494 44.94 6.36094 44.94 4.84494 43.576L4.46094 43.232V5.80401L4.84494 5.46001C6.36094 4.09601 8.14494 4.09601 9.66094 5.46001L10.0449 5.80401Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21.209 5.80401V43.232L20.825 43.576C19.313 44.94 17.525 44.94 16.009 43.576L15.625 43.232V5.80401L16.009 5.46001C17.521 4.09601 19.309 4.09601 20.825 5.46001L21.209 5.80401Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M32.3731 5.80401V43.232L31.9891 43.576C30.4771 44.94 28.6891 44.94 27.1731 43.576L26.7891 43.232V5.80401L27.1731 5.46001C28.6851 4.09601 30.4731 4.09601 31.9891 5.46001L32.3731 5.80401Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M43.5371 5.80401V43.232L43.1531 43.576C41.6411 44.94 39.8531 44.94 38.3371 43.576L37.9531 43.232V5.80401L38.3371 5.46001C39.8491 4.09601 41.6371 4.09601 43.1531 5.46001L43.5371 5.80401Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M43.5369 3.3999H4.46094V6.5399H43.5369V3.3999Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'vouwgordijnen': `
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <path d="M96.5999 10.2305H23.3899V109.78H96.5999V10.2305Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M89.6501 22.5996H30.3501V103.23H89.6501V22.5996Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M49.4099 90.6604L66.4699 73.6104" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M59.25 91.4099L64.78 85.8799" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M108.84 10.2305H11.1499V18.0805H108.84V10.2305Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M101.88 62.9205H18.1199C15.7899 62.9205 14.0199 61.0005 14.4199 58.9105L15.5599 52.9105C15.7499 51.9005 15.8499 50.8805 15.8499 49.8605V29.9805H104.16V49.8605C104.16 50.8805 104.26 51.9005 104.45 52.9105L105.6 58.9105C106 61.0005 104.23 62.9205 101.9 62.9205H101.88Z" fill="#585858" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M101.88 54.3101H18.1199C15.7899 54.3101 14.0199 52.3901 14.4199 50.3001L15.5599 44.3001C15.7499 43.2901 15.8499 42.2701 15.8499 41.2501V21.3701H104.16V41.2501C104.16 42.2701 104.26 43.2901 104.45 44.3001L105.6 50.3001C106 52.3901 104.23 54.3101 101.9 54.3101H101.88Z" fill="#585858" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M101.88 46.4501H18.1199C15.7899 46.4501 14.0199 44.5301 14.4199 42.4401L15.5599 36.4401C15.7499 35.4301 15.8499 34.4101 15.8499 33.3901V18.0801H104.16V33.3901C104.16 34.4101 104.26 35.4301 104.45 36.4401L105.6 42.4401C106 44.5301 104.23 46.4501 101.9 46.4501H101.88Z" fill="#585858" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'lamellen': `
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <path d="M96.5999 8.5H23.3899V108.05H96.5999V8.5Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M89.1301 16.3496V101.51H30.8701V16.3496" fill="white"/>
                <path d="M89.1301 16.3496V101.51H30.8701V16.3496" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M108.84 8.5H11.1499V16.35H108.84V8.5Z" fill="white" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M49.4099 90.7905L66.4699 73.7305" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M59.25 91.5407L64.78 86.0107" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M25.6499 111.5L12.9399 108.05V16.3496H25.6499V111.5Z" fill="#585858" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M41.93 111.5L29.22 108.05V16.3496H41.93V111.5Z" fill="#585858" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M58.21 111.5L45.51 108.05V16.3496H58.21V111.5Z" fill="#585858" stroke="#1C1C16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'elektrische-raamdecoratie': `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M23.9998 40.9078C33.3378 40.9078 40.9078 33.3378 40.9078 23.9998C40.9078 14.6618 33.3378 7.0918 23.9998 7.0918C14.6618 7.0918 7.0918 14.6618 7.0918 23.9998C7.0918 33.3378 14.6618 40.9078 23.9998 40.9078Z" fill="#595859" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M29.9304 21.8279H23.9984V14.0239L18.0664 26.1719H23.9984V33.9759L29.9304 21.8279Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
            'horren': `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M43.7643 3.88379H4.23633V44.1118H43.7643V3.88379Z" fill="white" stroke="#1D1D17" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M41.0205 7.13574H6.98047V41.4717H41.0205V7.13574Z" fill="white" stroke="#1D1D17" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21.7365 7.13574H6.98047V41.4717H21.7365V7.13574Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M41.0216 7.13574H26.2656V41.4717H41.0216V7.13574Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <mask id="mask0_3470_12003" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="7" y="7" width="15" height="35">
                        <path d="M21.8159 7.13574H7.00391V41.4717H21.8159V7.13574Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask0_3470_12003)">
                        <path d="M21.7539 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19.3555 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16.957 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14.5547 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.1562 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.75586 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 39.0034H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 36.5474H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 34.0874H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 31.6274H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 29.1714H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 26.7114H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 24.2515H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 21.7954H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 19.3354H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 16.8755H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 14.4194H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 11.9595H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M40.8959 9.49951H7.41992" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <mask id="mask1_3470_12003" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="26" y="7" width="16" height="35">
                        <path d="M41.1897 7.13574H26.0938V41.4717H41.1897V7.13574Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask1_3470_12003)">
                        <path d="M40.8477 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M38.4492 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M36.0469 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M33.6484 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M31.2461 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M28.8477 7.10352V41.3995" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 39.0034H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 36.5474H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 34.0874H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 31.6274H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 29.1714H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 26.7114H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 24.2515H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 21.7954H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 19.3354H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 16.8755H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 14.4194H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 11.9595H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M59.9878 9.49951H26.5078" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <path d="M19.3865 41.4756H21.7305L21.7305 7.32358H19.3865L19.3865 41.4756Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M26.3318 41.4756H28.6758L28.6758 7.32358H26.3318L26.3318 41.4756Z" fill="#585858" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23.9992 38.3842C31.9433 38.3842 38.3832 31.9443 38.3832 24.0002C38.3832 16.0561 31.9433 9.61621 23.9992 9.61621C16.0552 9.61621 9.61523 16.0561 9.61523 24.0002C9.61523 31.9443 16.0552 38.3842 23.9992 38.3842Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M25.8477 20.3003L28.3797 20.5883C28.6277 20.6163 28.8437 20.7603 28.9637 20.9803L30.0077 22.8683C30.1037 23.0443 30.2637 23.1723 30.4557 23.2323L32.9437 23.9803" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M25.7656 19.3961L27.2696 18.5801C27.6456 18.3761 27.7896 17.9681 27.6056 17.6201C27.4336 17.2881 27.5576 16.9001 27.8976 16.6881L30.0256 15.3721" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22.1507 20.3003L19.6187 20.5883C19.3707 20.6163 19.1547 20.7603 19.0347 20.9803L17.9907 22.8683C17.8947 23.0443 17.7347 23.1723 17.5427 23.2323L15.0547 23.9803" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22.2288 19.3961L20.7247 18.5801C20.3487 18.3761 20.2047 17.9681 20.3887 17.6201C20.5607 17.2881 20.4367 16.9001 20.0967 16.6881L17.9688 15.3721" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24 33.5922C25.4735 33.5922 26.668 32.2312 26.668 30.5522C26.668 28.8733 25.4735 27.5122 24 27.5122C22.5265 27.5122 21.332 28.8733 21.332 30.5522C21.332 32.2312 22.5265 33.5922 24 33.5922Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M31.2953 30.6281C31.2633 32.2481 30.2233 33.9041 27.4033 32.9001C24.5833 31.8961 23.9993 28.9441 23.9993 28.9441C23.9993 28.9441 23.4153 31.8961 20.5953 32.9001C17.7713 33.9041 16.7353 32.2521 16.7033 30.6281C16.6713 29.0041 22.4753 19.0801 22.4753 19.0801L23.9993 19.7921L25.5233 19.0801C25.5233 19.0801 31.3273 29.0041 31.2953 30.6281Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24 28.9402V23.4922" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23.9973 20.3043C24.9473 20.3043 25.7173 19.5342 25.7173 18.5843C25.7173 17.6343 24.9473 16.8643 23.9973 16.8643C23.0474 16.8643 22.2773 17.6343 22.2773 18.5843C22.2773 19.5342 23.0474 20.3043 23.9973 20.3043Z" fill="white" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24.2305 16.7682L25.8825 14.4082" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23.7653 16.7682L22.1133 14.4082" stroke="#1C1C16" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
        };

        /* ── Find original nav item by text ─────────────────────── */
        function findNavItem(label) {
            return [...document.querySelectorAll('nav a, header a, .navigation a')]
                .find(a => a.innerText.trim().toLowerCase() === label.toLowerCase());
        }

        /* ── Get original image src from existing nav ───────────── */
        function getOriginalImg(navAnchor) {
            if (!navAnchor) return '';
            const img = navAnchor.querySelector('img') ||
                navAnchor.closest('li')?.querySelector('img');
            return img ? img.src : '';
        }

        function renderSubmenuColumn(items, level = 1, title = '', backLabel = 'Alle categorieën', href, bannerImage, bottomData) {
            // REMOVE SAME + NEXT LEVELS
            document.querySelectorAll('.gmd-submenu-column')
                .forEach(col => {

                    if (+col.dataset.level >= level) {
                        col.remove();
                    }
                });

            const column = document.createElement('div');

            column.className = 'gmd-submenu-column';

            column.dataset.level = level;

            // if (bannerImage && level === 1) {

            //     const banner = document.createElement('div');

            //     banner.className = 'gmd-submenu-banner';

            //     banner.innerHTML = `
            //         <img src="${bannerImage}" alt="${title}">
            //     `;
            // }

            column.style.zIndex = level + 10;
            column.style.transform = 'translateX(100%)';

            // ========================================
            // MOBILE BACK BUTTON
            // ========================================

            if (window.innerWidth <= 769) {

                const backBtn = document.createElement('div');

                backBtn.className = 'gmd-back-btn';

                backBtn.innerHTML = `
                    <span class="gmd-btn-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="transform: rotate(180deg);">
                            <path d="M6 3.33325L10.6667 7.99992L6 12.6666" stroke="#4B5563" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <span>${backLabel}</span>
                `;

                backBtn.addEventListener('click', () => {

                    // LEVEL 1
                    if (level === 1) {

                        document.querySelector('#gmd-mega-menu')
                            ?.classList.remove('gmd-submenu-mobile-open');

                        return;
                    }

                    column.style.transform = 'translateX(100%)';

                    setTimeout(() => {
                        column.remove();
                    }, 350);
                });

                column.prepend(backBtn);
            }

            if (title) {

                const heading = document.createElement('a');

                heading.className = 'gmd-submenu__title';

                heading.href = href;

                heading.textContent = title;

                column.appendChild(heading);
            }

            items.forEach(link => {

                const item = document.createElement('a');

                item.className = 'gmd-submenu__link';

                item.href = link.href;

                if (link.heading) {
                    const heading = document.createElement('div');

                    heading.className = 'gmd-submenu-heading';

                    heading.textContent = link.heading;

                    column.appendChild(heading);
                }

                item.innerHTML = `
                    <span>${link.label}</span>

                    ${link.children?.length ? `
                        <span class="gmd-submenu__link-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3.33325L10.6667 7.99992L6 12.6666"
                                    stroke="#4B5563"
                                    stroke-width="1.33333"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"/>
                            </svg>
                        </span>
                    ` : ''}
                `;

                // =========================================
                // HOVER
                // =========================================

                const triggerEvent =
                    window.innerWidth <= 769
                        ? 'click'
                        : 'mouseenter';

                item.addEventListener(triggerEvent, (e) => {
                    // ACTIVE STATE
                    [...column.children]
                        .forEach(el => el.classList.remove('is-active'));

                    item.classList.add('is-active');

                    // REMOVE NEXT LEVELS
                    document.querySelectorAll('.gmd-submenu-column')
                        .forEach(col => {

                            if (+col.dataset.level > level) {
                                col.remove();
                            }
                        });

                    // HAS CHILDREN
                    if (link.children?.length) {

                        // MOBILE
                        if (window.innerWidth <= 769) {

                            // FIRST CLICK = OPEN SUBMENU
                            if (!item.classList.contains('is-opened')) {

                                e.preventDefault();

                                // RESET OTHER OPENED ITEMS
                                column.querySelectorAll('.is-opened')
                                    .forEach(el => {
                                        el.classList.remove('is-opened');
                                    });

                                item.classList.add('is-opened');

                                renderSubmenuColumn(
                                    link.children,
                                    level + 1,
                                    link.label,
                                    title || 'Alle categorieën',
                                    link.href,
                                    link.bannerImage,
                                    link.bottomData
                                );

                                return;
                            }

                            // SECOND CLICK = REDIRECT
                            return;
                        }

                        // DESKTOP HOVER
                        renderSubmenuColumn(
                            link.children,
                            level + 1,
                            link.label,
                            title || 'Alle categorieën',
                            link.href,
                            link.bannerImage,
                            link.bottomData
                        );
                    }
                });

                column.appendChild(item);
            });

            if (window.innerWidth > 769 &&
                bottomData &&
                (bottomData.helperText || bottomData.buttonText)
            ) {
                const footer = document.createElement('div');

                footer.className = 'gmd-submenu-footer';

                footer.innerHTML = `
                    ${bottomData.helperText ? `
                        <div class="gmd-submenu-footer-text">
                            ${bottomData.helperText}
                        </div>
                    ` : ''}

                    ${bottomData.buttonText ? `${bottomData.buttonText.outerHTML}` : ''}
                `;

                column.appendChild(footer);

                const clonedBtn = footer.querySelector('.keuzehulp-button');

                if (clonedBtn && bottomData.buttonText) {

                    clonedBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        bottomData.buttonText.dispatchEvent(
                            new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true
                            })
                        );
                    });
                }
            }

            const bannerWrapper =
                document.querySelector('.gmd-banner-wrapper');

            if (bannerWrapper && level === 1) {

                bannerWrapper.innerHTML = bannerImage
                    ? `
                    <img
                        src="${bannerImage}"
                        class="gmd-banner-image"
                        alt="${title}"
                    >
                `
                    : '';
            }

            document
                .querySelector('.gmd-mega-right')
                .appendChild(column);

            if (window.innerWidth > 769 && bannerImage && level === 1) {

                document
                    .querySelector('.gmd-banner-column')
                    ?.remove();

                const banner = document.createElement('div');

                banner.className = 'gmd-banner-column';

                banner.innerHTML = `
                    <img
                        src="${bannerImage}"
                        alt="${title}"
                        class="gmd-banner-image"
                    >
                `;

                document
                    .querySelector('.gmd-mega-right')
                    .appendChild(banner);
            }
            requestAnimationFrame(() => {
                column.style.transform = 'translateX(0)';
            });
        }

        async function buildMenuJSON() {

            const result = [];

            document.querySelectorAll(
                '#mainmenu > ul > li.level0'
            ).forEach(item => {

                const parsed = parseMenuItem(item);

                if (parsed) {
                    result.push(parsed);
                }
            });

            function parseMenuItem(item) {

                const link = item.querySelector(':scope > a');

                if (!link) return null;

                // MEGA MENU PANEL
                const submenu = item.querySelector(
                    ':scope > .nav-panel--dropdown'
                );

                const label =
                    link.querySelector('span')
                        ?.textContent
                        .trim()
                    || link.textContent.trim();

                const key = label
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '');

                const imageUrl =
                    submenu?.querySelector('.nav-block--right picture source')
                        ?.getAttribute('srcset') || '';

                const bottomBlock =
                    submenu?.querySelector('.nav-block--bottom');

                const bottomData = {
                    serviceText:
                        bottomBlock?.querySelector('a')
                            ?.textContent.trim() || '',

                    sampleText:
                        bottomBlock?.querySelector('p a')
                            ?.textContent.trim() || '',

                    helperText:
                        bottomBlock?.querySelectorAll('p')[1]
                            ?.textContent.trim() || '',

                    buttonText:
                        bottomBlock?.querySelector('.keuzehulp-button')
                };

                const obj = {
                    key,
                    label,
                    href: link.href,
                    image: MENU_IMAGES[key] || null,
                    bannerImage: imageUrl,
                    bottomData
                };



                if (submenu) {

                    const children = [];

                    submenu
                        .querySelectorAll(
                            '.nav-submenu > li.level1'
                        )
                        .forEach(child => {

                            const parsed =
                                parseMenuItem(child);

                            if (parsed) {
                                parsed.heading =
                                    child.querySelector('.top_left_type')
                                        ?.textContent.trim() || '';
                                children.push(parsed);
                            }
                        });

                    if (children.length) {
                        obj.children = children;
                    }
                }

                return obj;
            }

            return result;
        }

        let MENU_DATA;
        (async () => {

            MENU_DATA = await buildMenuJSON();

            attachToNav();

        })();

        /* ── Build the mega menu DOM ─────────────────────────────── */
        function buildMegaMenu() {
            if (!document.querySelector('.gmd-navigation-toggle-wrapper')) {
                const logoWrapper = document.querySelector('.header-primary .logo-wrapper');
                if (logoWrapper) {
                    document.querySelector('.header-primary .logo-wrapper').insertAdjacentHTML('afterend', `
                    <div class="gmd-navigation-toggle-wrapper">
                        <div class="gmd-hamburger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M0 3.00595C0 2.72995 0.099 2.49295 0.297 2.29495C0.495 2.09695 0.732 1.99795 1.008 1.99795H16.992C17.268 1.99795 17.505 2.09695 17.703 2.29495C17.901 2.49295 18 2.72995 18 3.00595C18 3.28195 17.901 3.51595 17.703 3.70795C17.505 3.89995 17.268 3.99595 16.992 3.99595H1.008C0.732 3.99595 0.495 3.89995 0.297 3.70795C0.099 3.51595 0 3.28195 0 3.00595ZM0 8.99995C0 8.72395 0.099 8.48695 0.297 8.28895C0.495 8.09095 0.732 7.99195 1.008 7.99195H16.992C17.268 7.99195 17.505 8.09095 17.703 8.28895C17.901 8.48695 18 8.72395 18 8.99995C18 9.27595 17.901 9.51295 17.703 9.71095C17.505 9.90895 17.268 10.008 16.992 10.008H1.008C0.732 10.008 0.495 9.90895 0.297 9.71095C0.099 9.51295 0 9.27595 0 8.99995ZM0 14.994C0 14.718 0.099 14.484 0.297 14.292C0.495 14.1 0.732 14.004 1.008 14.004H16.992C17.268 14.004 17.505 14.1 17.703 14.292C17.901 14.484 18 14.718 18 14.994C18 15.27 17.901 15.507 17.703 15.705C17.505 15.903 17.268 16.002 16.992 16.002H1.008C0.732 16.002 0.495 15.903 0.297 15.705C0.099 15.507 0 15.27 0 14.994Z" fill="#2D2D2D"/>
                            </svg>
                        </div>
                        <div class="gmd-toggle">
                            Categorieën 
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                <path d="M10.668 3.80518L5.66797 8.80518L0.667969 3.80518" stroke="#2D2D2D" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>`);

                }
                const logoWrapperMobile = document.querySelector('.logo-wrapper--mobile');
                if (logoWrapperMobile) {
                    document.querySelector('.logo-wrapper--mobile').insertAdjacentHTML('beforebegin', `
                        <div class="gmd-mobile-hamburger">
                            <div class="gmd-hamburger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M0 3.00595C0 2.72995 0.099 2.49295 0.297 2.29495C0.495 2.09695 0.732 1.99795 1.008 1.99795H16.992C17.268 1.99795 17.505 2.09695 17.703 2.29495C17.901 2.49295 18 2.72995 18 3.00595C18 3.28195 17.901 3.51595 17.703 3.70795C17.505 3.89995 17.268 3.99595 16.992 3.99595H1.008C0.732 3.99595 0.495 3.89995 0.297 3.70795C0.099 3.51595 0 3.28195 0 3.00595ZM0 8.99995C0 8.72395 0.099 8.48695 0.297 8.28895C0.495 8.09095 0.732 7.99195 1.008 7.99195H16.992C17.268 7.99195 17.505 8.09095 17.703 8.28895C17.901 8.48695 18 8.72395 18 8.99995C18 9.27595 17.901 9.51295 17.703 9.71095C17.505 9.90895 17.268 10.008 16.992 10.008H1.008C0.732 10.008 0.495 9.90895 0.297 9.71095C0.099 9.51295 0 9.27595 0 8.99995ZM0 14.994C0 14.718 0.099 14.484 0.297 14.292C0.495 14.1 0.732 14.004 1.008 14.004H16.992C17.268 14.004 17.505 14.1 17.703 14.292C17.901 14.484 18 14.718 18 14.994C18 15.27 17.901 15.507 17.703 15.705C17.505 15.903 17.268 16.002 16.992 16.002H1.008C0.732 16.002 0.495 15.903 0.297 15.705C0.099 15.507 0 15.27 0 14.994Z" fill="#2D2D2D"/>
                                </svg>
                            </div>
                        </div>
                    `)
                }

            }

            if (!document.querySelector('.gmd-mega-menu')) {
                const langDropDown = document.querySelector('#lang-switcher-wrapper-regular')?.closest('.item');
                const myAcc = document.querySelector('.menu-header-mobile .my-account');
                const menu = document.createElement('div');
                menu.className = 'gmd-mega-menu';
                menu.id = 'gmd-mega-menu';

                // Left column
                const left = document.createElement('div');
                left.className = 'gmd-mega-left';

                const mobileTop = document.createElement('div');

                mobileTop.className = 'gmd-mobile-top';

                mobileTop.innerHTML = `
                    <div class="gmd-mobile-header">

                        <div class="gmd-mobile-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M15.8125 1.24609L14.5664 0L7.90625 6.66016L1.24609 0L0 1.24609L6.66016 7.90625L0 14.5664L1.24609 15.8125L7.90625 9.15234L14.5664 15.8125L15.8125 14.5664L9.15234 7.90625L15.8125 1.24609Z" fill="#2D2D2D"/>
                            </svg>
                        </div>

                        <div class="gmd-mobile-account">
                            ${myAcc.cloneNode(true).outerHTML}
                        </div>

                        <div class="gmd-mobile-language">
                            ${langDropDown ? langDropDown.cloneNode(true).outerHTML : ''}
                        </div>

                    </div>
                `;



                mobileTop.querySelector('.gmd-mobile-close')
                    .addEventListener('click', () => {

                        document.querySelector('#gmd-mega-menu')
                            ?.classList.add('is-close');
                        document.querySelector('#gmd-mega-menu')
                            ?.classList.remove('is-open');

                        document.querySelector('#gmd-mega-menu')
                            ?.classList.remove('gmd-submenu-mobile-open');
                        setTimeout(() => {

                            document.querySelector('#gmd-mega-menu')
                                ?.classList.remove('is-close');
                        }, 249);
                    });

                const heading = document.createElement('div');
                heading.className = 'gmd-mega-left__heading';
                heading.textContent = 'Categorieën';
                left.appendChild(heading);

                // Right column
                const right = document.createElement('div');
                right.className = 'gmd-mega-right';

                right.innerHTML = `
                    <div class="gmd-submenu-wrapper"></div>
                    <div class="gmd-banner-wrapper"></div>
                `;

                // let firstActiveSet = false;

                MENU_DATA.forEach(cat => {

                    const hasSubmenu = cat.children?.length;

                    // ─────────────────────────────────────────
                    // CATEGORY ITEM
                    // ─────────────────────────────────────────

                    const item = document.createElement('a');

                    item.className =
                        'gmd-cat-item' +
                        (hasSubmenu ? '' : ' gmd-cat-item--direct');

                    item.href = cat.href;

                    item.dataset.key = cat.key;

                    // ─────────────────────────────────────────
                    // IMAGE
                    // ─────────────────────────────────────────

                    let imageEl;

                    if (cat.image) {

                        imageEl = document.createElement('span');

                        imageEl.className = 'gmd-cat-item__img';

                        imageEl.innerHTML = cat.image;

                    } else {

                        imageEl = document.createElement('img');

                        imageEl.className = 'gmd-cat-item__img';

                        imageEl.alt = cat.label;

                        const origNav = findNavItem(cat.label);

                        const origSrc = getOriginalImg(origNav);

                        imageEl.src = origSrc || '';

                        if (!origSrc) {
                            imageEl.style.visibility = 'hidden';
                        }
                    }

                    item.appendChild(imageEl);

                    // ─────────────────────────────────────────
                    // LABEL
                    // ─────────────────────────────────────────

                    const label = document.createElement('span');

                    label.className = 'gmd-cat-item__label';

                    label.textContent = cat.label;

                    item.appendChild(label);

                    // ─────────────────────────────────────────
                    // ARROW
                    // ─────────────────────────────────────────

                    if (hasSubmenu) {

                        const arrow = document.createElement('span');

                        arrow.className = 'gmd-cat-item__arrow';

                        arrow.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3.33325L10.6667 7.99992L6 12.6666" stroke="#4B5563" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        `;

                        item.appendChild(arrow);
                    }

                    // ─────────────────────────────────────────
                    // DESKTOP HOVER
                    // ─────────────────────────────────────────

                    item.addEventListener('mouseenter', () => {

                        if (window.innerWidth <= 769) return;

                        // REMOVE ALL ACTIVE STATES
                        left.querySelectorAll('.gmd-cat-item')
                            .forEach(i => i.classList.remove('is-active'));

                        right.querySelectorAll(':scope > .gmd-submenu')
                            .forEach(s => s.classList.remove('is-active'));

                        // ALWAYS ACTIVE CURRENT LEFT ITEM
                        item.classList.add('is-active');

                        document.querySelector('.gmd-mega-right').innerHTML = '';

                        // IF NO SUBMENU
                        // STOP HERE
                        if (!hasSubmenu) {
                            return;
                        }

                        // RENDER SUBMENU
                        renderSubmenuColumn(
                            cat.children,
                            1,
                            cat.label,
                            'Alle categorieën',
                            cat.href,
                            cat.bannerImage,
                            cat.bottomData
                        );
                    });

                    // ─────────────────────────────────────────
                    // MOBILE CLICK
                    // ─────────────────────────────────────────

                    item.addEventListener('click', e => {

                        if (window.innerWidth > 769) {
                            if (hasSubmenu) {
                                e.preventDefault();
                            }

                            return;
                        }

                        if (!hasSubmenu) return;

                        e.preventDefault();

                        left.querySelectorAll('.gmd-cat-item')
                            .forEach(i => i.classList.remove('is-active'));

                        right.querySelectorAll(':scope > .gmd-submenu')
                            .forEach(s => s.classList.remove('is-active'));

                        item.classList.add('is-active');

                        document.querySelector('.gmd-mega-right').innerHTML = '';

                        renderSubmenuColumn(
                            cat.children,
                            1,
                            cat.label,
                            'Alle categorieën',
                            cat.href,
                            cat.bannerImage,
                            cat.bottomData
                        );

                        menu.classList.add('gmd-submenu-mobile-open');
                    });

                    // ─────────────────────────────────────────
                    // APPEND LEFT ITEM
                    // ─────────────────────────────────────────

                    left.appendChild(item);

                    // ─────────────────────────────────────────
                    // SUBMENU PANEL
                    // ─────────────────────────────────────────

                    if (hasSubmenu) {

                        const panel = document.createElement('div');

                        panel.className = 'gmd-submenu';

                        panel.dataset.submenu = cat.key;

                        // TITLE
                        const title = document.createElement('div');

                        title.className = 'gmd-submenu__title';

                        title.textContent = cat.label;

                        panel.appendChild(title);

                        // ─────────────────────────────────────────
                        // RECURSIVE CHILDREN
                        // ─────────────────────────────────────────

                        item.addEventListener('mouseenter', () => {

                            if (window.innerWidth <= 769) return;

                            document.querySelector('.gmd-mega-right').innerHTML = '';

                            renderSubmenuColumn(
                                cat.children,
                                1,
                                cat.label,
                                'Alle categorieën',
                                cat.href,
                                cat.bannerImage,
                                cat.bottomData
                            );
                        });

                        right.appendChild(panel);
                    }
                });

                const innerWrapper = document.createElement('div');

                innerWrapper.className = 'gmd-mega-inner container';
                innerWrapper.appendChild(mobileTop);
                innerWrapper.appendChild(left);
                innerWrapper.appendChild(right);

                const extraLinks = document.querySelector('#header-nav > ul')
                if (extraLinks) {
                    if (!document.querySelector('.gmd-extra-links')) {
                        left.insertAdjacentHTML('beforeend', `<div class="gmd-extra-links">${extraLinks.cloneNode(true).outerHTML}</div>`)
                    }
                }

                menu.appendChild(innerWrapper);

                // MOBILE OVERLAY CLICK CLOSE
                menu.addEventListener('click', (e) => {

                    // ONLY MOBILE
                    if (window.innerWidth > 769) return;

                    // CLICKED OUTSIDE MENU PANEL
                    if (!innerWrapper.contains(e.target)) {

                        menu.classList.remove('is-open');

                        menu.classList.remove(
                            'gmd-submenu-mobile-open'
                        );

                        document.body.classList.remove(
                            'gmd-overflow-hidden'
                        );
                    }
                });

                return menu;
            }

        }

        /* ── Attach menu to nav trigger ─────────────────────────── */
        function attachToNav() {
            // Find a suitable anchor in the main nav bar — the header/nav wrapper
            const navBar = document.querySelector('#header-container');
            if (!navBar) {
                console.warn('[gmd-menu] Nav element not found');
                return;
            }

            // Make nav wrapper relative for absolute positioning
            // navBar.style.position = 'relative';

            const megaMenu = buildMegaMenu();
            navBar.appendChild(megaMenu);

            // Find the "Voetbaltenues" link as the trigger anchor in the top bar
            // (the first category with a submenu is the main trigger)
            const triggerCategories = MENU_DATA.filter(c => c.children?.length);

            // Show menu on hover of any trigger nav link
            const navLink = document.querySelector(
                '.gmd-navigation-toggle-wrapper'
            );

            if (navLink) {

                const desktopTrigger = document.querySelector(
                    '.gmd-navigation-toggle-wrapper'
                );

                const mobileTrigger = document.querySelector(
                    '.gmd-mobile-hamburger'
                );

                // ========================================
                // RESET
                // ========================================

                function resetMegaMenu() {

                    megaMenu.querySelectorAll('.is-active')
                        .forEach(el => {
                            el.classList.remove('is-active');
                        });

                    const right = megaMenu.querySelector(
                        '.gmd-mega-right'
                    );

                    if (right) {
                        right.innerHTML = '';
                    }

                    document.body.classList.remove(
                        'gmd-overflow-hidden'
                    );
                }

                // ========================================
                // OPEN
                // ========================================

                function openMenu() {

                    resetMegaMenu();

                    megaMenu.classList.add('is-open');

                    document.body.classList.add(
                        'gmd-overflow-hidden'
                    );
                }

                // ========================================
                // CLOSE
                // ========================================

                function closeMenu() {

                    megaMenu.classList.remove('is-open');
                    megaMenu.classList.remove('gmd-submenu-mobile-open');

                    document.body.classList.remove(
                        'gmd-overflow-hidden'
                    );
                }

                // ========================================
                // DESKTOP
                // HOVER + CLICK
                // ========================================

                if (desktopTrigger) {

                    // HOVER
                    desktopTrigger.addEventListener(
                        'mouseenter',
                        () => {

                            if (window.innerWidth < 769) return;

                            openMenu();
                        }
                    );

                    // HOVER
                    megaMenu.addEventListener(
                        'mouseenter',
                        () => {

                            if (window.innerWidth < 769) return;

                            openMenu();
                        }
                    );

                    // CLICK
                    desktopTrigger.addEventListener(
                        'click',
                        (e) => {

                            e.preventDefault();
                            e.stopPropagation();

                            const isOpen =
                                megaMenu.classList.contains(
                                    'is-open'
                                );

                            if (isOpen) {

                                closeMenu();

                            } else {

                                openMenu();
                            }
                        }
                    );

                }

                // ========================================
                // MOBILE
                // CLICK ONLY
                // ========================================

                if (mobileTrigger) {

                    mobileTrigger.addEventListener(
                        'click',
                        (e) => {

                            e.preventDefault();
                            e.stopPropagation();

                            const isOpen =
                                megaMenu.classList.contains(
                                    'is-open'
                                );

                            if (isOpen) {

                                closeMenu();

                            } else {
                                openMenu();
                                window.scrollTo(0, 0);
                            }
                        }
                    );
                }

                // ========================================
                // OUTSIDE CLICK
                // ========================================

                document.addEventListener(
                    'click',
                    (e) => {

                        if (
                            !megaMenu.contains(e.target) &&
                            !desktopTrigger?.contains(e.target) &&
                            !mobileTrigger?.contains(e.target)
                        ) {
                            closeMenu();
                        }
                    }
                );

                // ========================================
                // DESKTOP MOUSE LEAVE
                // ========================================

                megaMenu.addEventListener(
                    'mouseleave',
                    () => {

                        if (window.innerWidth < 769) return;

                        closeMenu();
                    }
                );
                document.querySelector(".gmd-navigation-toggle-wrapper").addEventListener(
                    'mouseleave',
                    () => {

                        if (window.innerWidth < 769) return;

                        setTimeout(() => {
                            const megaMenu = document.querySelector(".gmd-mega-menu");

                            if (megaMenu && megaMenu.matches(":hover")) {
                                return; // Mouse is over mega menu, don't close
                            }

                            closeMenu();
                        }, 100);
                    }
                );
            }
        }
    })

})();