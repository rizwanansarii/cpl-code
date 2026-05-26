(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-34',
        debug: 0,
        testName: "T31 | Toevoegen van afbeeldingen aan de categorieën in het menu",
        testVersion: 'v1'
    };
    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement('#header', () => {
        document.body.classList.add(testInfo.className)

        const MENU_IMAGES = {
            'wk-2026': 'https://www.voetbalshirtskoning.nl/img/gsy1lbof0hDnQAkR-C9PD8OutUbW3Pq2Oei2kumDgU4/resize:fit:700:560/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3QvZS9rL2VrLTg4LXNoaXJ0LXRodWlzLTE5ODgta2luZC12b2x3YXNzZW5lbl8yLmpwZz93aWR0aD03MDAmaGVpZ2h0PTU2MA.jpg',
            'voetbaltenues': 'https://voetbalshirtskoning.nl/img/oZoa4Apa9aix9Z04LSlATJW0EQKVpVp1BQaBPyMxjSQ/resize:fit:300:300/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3QvZi9jL2ZjLWJhcmNlbG9uYS12b2V0YmFsdGVudWUtbGFtaW5lLXlhbWFsLWtpbmQtMjAyNS0yMDI2LmpwZz93aWR0aD0zMDAmaGVpZ2h0PTMwMA.jpg',
            'voetbalshirts': 'https://voetbalshirtskoning.nl/img/YRKaBGa7aa1Me0E1gUjihQwPg-u8UxV-ZRUracr-71k/resize:fit:300:300/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3Qvbi9lL25lZGVybGFuZHMtZWxmdGFsLXZvZXRiYWx0ZW51ZS11aXQta2luZC12b2x3YXNzZW5lbi5qcGc_d2lkdGg9MzAwJmhlaWdodD0zMDA.jpg',
            'trainingspakken': 'https://voetbalshirtskoning.nl/img/1B-cGY3-QSArmoqkYfcriSFYUUp6PTovVckc1FgbQbA/resize:fit:300:300/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3QvZi9jL2ZjLWJhcmNlbG9uYS10cmFpbmluZ3NwYWsta2luZC16d2FydC5qcGc_d2lkdGg9MzAwJmhlaWdodD0zMDA.jpg',
            'fanshop': 'https://voetbalshirtskoning.nl/img/utiYQEvR_OzTLONoOYWF4sPmgA7hvIgk6Ns0zbMOlso/resize:fit:300:300/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3QvcC9vL3BvcnR1Z2FsLXZvZXRiYWx0ZW51ZS1yb25hbGRvLWtpbmQtdm9sd2Fzc2VuZW4uanBnP3dpZHRoPTMwMCZoZWlnaHQ9MzAw.jpg',
            'voetbaldoelen': 'https://voetbalshirtskoning.nl/img/0EzGtleJ9gnfIp47WXIU8MQCyoHGY9zFGjtbDENoo0U/resize:fit:300:300/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3QvaC9vL2hvb2ZkYWZiZWVsZGluZy0xXzFfLmpwZz93aWR0aD0zMDAmaGVpZ2h0PTMwMA.jpg',
            'voetbalsokken': 'https://voetbalshirtskoning.nl/img/jWkqYxvI6k29KydGCPctoXBRJ99uq9bxo8tmtziQeCI/resize:fit:300:300/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3Qvbi9lL25lZGVybGFuZHMtZWxmdGFsLXZvZXRiYWxzb2trZW4tb3JhbmplLmpwZz93aWR0aD0zMDAmaGVpZ2h0PTMwMA.jpg',
            'voetballen': 'https://voetbalshirtskoning.nl/img/zPhj2ZgUrhbd7QRRYrxO4KdHzYlbIWtCs8t5A_xaaIQ/resize:fit:300:300/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3QvYy9oL2NoYW1waW9ucy1sZWFndWUtZnJvc3Qtdm9ldGJhbC12b29ya2FudC5qcGc_d2lkdGg9MzAwJmhlaWdodD0zMDA.jpg',
            'bedrukken': 'https://voetbalshirtskoning.nl/img/Zk-MFZYSOkHlU6HIH7K-zKkW-BprocVvCPiwSFmq3UU/resize:fit:700:560/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3Qvbi9lL25lZGVybGFuZHMtZWxmdGFsLXNoaXJ0LWJlZHJ1a2tlbi5qcGc_d2lkdGg9NzAwJmhlaWdodD01NjA.jpg',
            'sale': 'https://voetbalshirtskoning.nl/img/V_yfnyZ1_TnqbqndDE0qKw2eDaG3TwP0CBPJ1etIqlc/resize:fit:300:300/aHR0cHM6Ly93d3cudm9ldGJhbHNoaXJ0c2tvbmluZy5ubC9tZWRpYS9jYXRhbG9nL3Byb2R1Y3Qvci9lL3JlYWwtbWFkcmlkLXZvZXRiYWx0ZW51ZS1tYmFwcGUta2luZF8xLmpwZz93aWR0aD0zMDAmaGVpZ2h0PTMwMA.jpg',
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

        function renderSubmenuColumn(items, level = 1, title = '', backLabel = 'Categorie') {
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

            column.style.zIndex = level + 10;
            column.style.transform = 'translateX(100%)';

            // ========================================
            // MOBILE BACK BUTTON
            // ========================================

            if (window.innerWidth <= 1023) {

                const backBtn = document.createElement('button');

                backBtn.className = 'gmd-back-btn';

                backBtn.innerHTML = `
                    <span>
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

                const heading = document.createElement('div');

                heading.className = 'gmd-submenu__title';

                heading.textContent = title;

                column.appendChild(heading);
            }

            items.forEach(link => {

                const item = document.createElement('a');

                item.className = 'gmd-submenu__link';

                item.href = link.href;

                item.innerHTML = `
                    ${link.image ? `
                        <img 
                            src="${link.image}" 
                            class="gmd-submenu-image"
                        >
                    ` : ''}

                    <span>${link.label}</span>

                    ${link.children?.length ? `
                        <span class="gmd-submenu__link-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3.33325L10.6667 7.99992L6 12.6666" stroke="#4B5563" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                    ` : ''}
                `;

                // =========================================
                // HOVER
                // =========================================

                const triggerEvent =
                    window.innerWidth <= 1023
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
                        if (window.innerWidth <= 1023) {

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
                                    title || 'Categorie'
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
                            title || 'Categorie'
                        );
                    }
                });

                column.appendChild(item);
            });

            document
                .querySelector('.gmd-mega-right')
                .appendChild(column);
            requestAnimationFrame(() => {
                column.style.transform = 'translateX(0)';
            });
        }

        function buildMenuJSON() {

            function parseMenuItem(item) {

                const link = item.querySelector(':scope > a');

                if (!link) return null;

                const label =
                    link.querySelector('.link-text')?.textContent.trim()
                    || link.textContent.trim();

                const key = label
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '');

                const obj = {
                    key,

                    label,

                    href: link.href,

                    image:
                        MENU_IMAGES[key]
                        || null
                };

                const submenu = item.querySelector(':scope > .submenu');

                if (submenu) {

                    const children = [];

                    submenu
                        .querySelectorAll(':scope > .menu-item, :scope > a[href]')
                        .forEach(child => {
                            const target =
                                child.matches('a[href]')
                                    ? child.parentElement
                                    : child;

                            const parsed = parseMenuItem(target);

                            if (parsed) {
                                children.push(parsed);
                            }
                        });

                    if (children.length) {
                        obj.children = children;
                    }
                }

                return obj;
            }

            const result = [];

            // FIXED SELECTOR
            document.querySelectorAll(
                '#mobile-menu .mobile-menu-catalog-nav-root .level-0.menu-item'
            ).forEach(item => {

                // only real root items
                if (item.closest('.submenu')) return;

                const parsed = parseMenuItem(item);

                if (parsed) {
                    result.push(parsed);
                }
            });

            return result;
        }
        document.querySelector('#mobile-menu-toggler')?.click();

        let MENU_DATA;
        setTimeout(() => {

            MENU_DATA = buildMenuJSON();
            document.querySelector('a[aria-label="Close mobile menu"]')?.click();
            attachToNav();
        }, 500);

        /* ── Build the mega menu DOM ─────────────────────────────── */
        function buildMegaMenu() {
            if (!document.querySelector('.gmd-navigation-toggle-wrapper')) {
                const logoWrapper = document.querySelector('.header-content > .logo-wrapper');
                if (logoWrapper) {
                    document.querySelector('.header-content > .logo-wrapper').insertAdjacentHTML('afterend', `
                    <div class="gmd-navigation-toggle-wrapper">
                        <div class="gmd-hamburger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M0 3.00601C0 2.73001 0.099 2.49301 0.297 2.29501C0.495 2.09701 0.732 1.99801 1.008 1.99801H16.992C17.268 1.99801 17.505 2.09701 17.703 2.29501C17.901 2.49301 18 2.73001 18 3.00601C18 3.28201 17.901 3.51602 17.703 3.70801C17.505 3.90001 17.268 3.99601 16.992 3.99601H1.008C0.732 3.99601 0.495 3.90001 0.297 3.70801C0.099 3.51602 0 3.28201 0 3.00601ZM0 9.00001C0 8.72401 0.099 8.48701 0.297 8.28901C0.495 8.09101 0.732 7.99201 1.008 7.99201H16.992C17.268 7.99201 17.505 8.09101 17.703 8.28901C17.901 8.48701 18 8.72401 18 9.00001C18 9.27601 17.901 9.51301 17.703 9.71101C17.505 9.90901 17.268 10.008 16.992 10.008H1.008C0.732 10.008 0.495 9.90901 0.297 9.71101C0.099 9.51301 0 9.27601 0 9.00001ZM0 14.994C0 14.718 0.099 14.484 0.297 14.292C0.495 14.1 0.732 14.004 1.008 14.004H16.992C17.268 14.004 17.505 14.1 17.703 14.292C17.901 14.484 18 14.718 18 14.994C18 15.27 17.901 15.507 17.703 15.705C17.505 15.903 17.268 16.002 16.992 16.002H1.008C0.732 16.002 0.495 15.903 0.297 15.705C0.099 15.507 0 15.27 0 14.994Z" fill="white"/>
                            </svg>
                        </div>
                        <div class="gmd-toggle">
                            categorieën 
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                <path d="M10.6667 4.19482L5.66675 9.19482L0.666748 4.19482" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>`);

                    document.querySelector('.header-content > .logo-wrapper').insertAdjacentHTML('beforebegin', `
                        <div class="gmd-mobile-hamburger">
                            <div class="gmd-hamburger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M0 3.00601C0 2.73001 0.099 2.49301 0.297 2.29501C0.495 2.09701 0.732 1.99801 1.008 1.99801H16.992C17.268 1.99801 17.505 2.09701 17.703 2.29501C17.901 2.49301 18 2.73001 18 3.00601C18 3.28201 17.901 3.51602 17.703 3.70801C17.505 3.90001 17.268 3.99601 16.992 3.99601H1.008C0.732 3.99601 0.495 3.90001 0.297 3.70801C0.099 3.51602 0 3.28201 0 3.00601ZM0 9.00001C0 8.72401 0.099 8.48701 0.297 8.28901C0.495 8.09101 0.732 7.99201 1.008 7.99201H16.992C17.268 7.99201 17.505 8.09101 17.703 8.28901C17.901 8.48701 18 8.72401 18 9.00001C18 9.27601 17.901 9.51301 17.703 9.71101C17.505 9.90901 17.268 10.008 16.992 10.008H1.008C0.732 10.008 0.495 9.90901 0.297 9.71101C0.099 9.51301 0 9.27601 0 9.00001ZM0 14.994C0 14.718 0.099 14.484 0.297 14.292C0.495 14.1 0.732 14.004 1.008 14.004H16.992C17.268 14.004 17.505 14.1 17.703 14.292C17.901 14.484 18 14.718 18 14.994C18 15.27 17.901 15.507 17.703 15.705C17.505 15.903 17.268 16.002 16.992 16.002H1.008C0.732 16.002 0.495 15.903 0.297 15.705C0.099 15.507 0 15.27 0 14.994Z" fill="white"/>
                                </svg>
                            </div>
                        </div>
                    `)
                }
            }

            const menu = document.createElement('div');
            menu.className = 'gmd-mega-menu';
            menu.id = 'gmd-mega-menu';

            // Left column
            const left = document.createElement('div');
            left.className = 'gmd-mega-left';

            const mobileTop = document.createElement('div');

            mobileTop.className = 'gmd-mobile-top';

            mobileTop.innerHTML = `
                <button class="gmd-mobile-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M10 30L30 10M10 10L30 30" stroke="#4B5563" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `;

            left.appendChild(mobileTop);

            mobileTop.querySelector('.gmd-mobile-close')
                .addEventListener('click', () => {
                    document.querySelector('#gmd-mega-menu')
                        ?.classList.remove('is-open');

                    document.querySelector('#gmd-mega-menu')
                        ?.classList.remove('gmd-submenu-mobile-open');
                });

            const heading = document.createElement('div');
            heading.className = 'gmd-mega-left__heading';
            heading.textContent = 'Categorie';
            left.appendChild(heading);

            // Right column
            const right = document.createElement('div');
            right.className = 'gmd-mega-right';

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

                const img = document.createElement('img');

                img.className = 'gmd-cat-item__img';

                img.alt = cat.label;

                if (cat.image) {

                    img.src = cat.image;

                } else {

                    const origNav = findNavItem(cat.label);

                    const origSrc = getOriginalImg(origNav);

                    img.src = origSrc || '';

                    if (!origSrc) {
                        img.style.visibility = 'hidden';
                    }
                }

                // ─────────────────────────────────────────
                // LABEL
                // ─────────────────────────────────────────

                const label = document.createElement('span');

                label.className = 'gmd-cat-item__label';

                label.textContent = cat.label;

                item.appendChild(img);

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

                    if (window.innerWidth <= 1023) return;

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
                        cat.label
                    );
                });

                // ─────────────────────────────────────────
                // MOBILE CLICK
                // ─────────────────────────────────────────

                item.addEventListener('click', e => {

                    if (window.innerWidth >= 1023) {

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
                        'Categorie'
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

                        if (window.innerWidth <= 1023) return;

                        document.querySelector('.gmd-mega-right').innerHTML = '';

                        renderSubmenuColumn(
                            cat.children,
                            1,
                            cat.label
                        );
                    });

                    right.appendChild(panel);
                }
            });

            const innerWrapper = document.createElement('div');

            innerWrapper.className = 'gmd-mega-inner columns';

            innerWrapper.appendChild(left);
            innerWrapper.appendChild(right);

            menu.appendChild(innerWrapper);

            // MOBILE OVERLAY CLICK CLOSE
            menu.addEventListener('click', (e) => {

                // ONLY MOBILE
                if (window.innerWidth > 1023) return;

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

        /* ── Attach menu to nav trigger ─────────────────────────── */
        function attachToNav() {
            // Find a suitable anchor in the main nav bar — the header/nav wrapper
            const navBar = document.querySelector('#header');
            if (!navBar) {
                console.warn('[gmd-menu] Nav element not found');
                return;
            }

            // Make nav wrapper relative for absolute positioning
            navBar.style.position = 'relative';

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

                            if (window.innerWidth <= 1023) return;

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

                        if (window.innerWidth <= 1023) return;

                        closeMenu();
                    }
                );
            }
        }
    })

})();