(() => {
    'use strict';

    const testInfo = {
        className: 'gmd-46',
        debug: 0,
        testName: 'T46 | Categorieen als lijn weergeven in het menu + afbeeldingen weghalen mobiel',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);

        if (timer <= 0) return;

        ((!isVariable && elements.length >= minElements) ||
            (isVariable && typeof window[waitFor] !== 'undefined'))
            ? callback(elements)
            : setTimeout(() => {
                waitForElement(waitFor, callback, minElements, isVariable, timer - frequency, frequency);
            }, frequency);
    }

    waitForElement('#header_menu', () => {

        const headerUsp = document.querySelector('#header_usp');
        headerUsp.classList.add('main-container')
        const topLinks = document.querySelectorAll(
            '.col-6.text-right > p.d-inline-block'
        );

        if (headerUsp && topLinks.length) {

            const extraLinks = document.createElement('div');
            extraLinks.className = 'gmd-header-links';

            topLinks.forEach(link => {
                extraLinks.appendChild(link);
            });

            headerUsp.appendChild(extraLinks);
        }

        const catLinks = [...document.querySelectorAll('.category_menu_cat')];
        const subPanels = [...document.querySelectorAll('.category_menu_sub_cat')];
        const openTrigger = document.getElementById('open_category_menu');
        const headerMenuEl = document.querySelector('.header_menu, #header_menu');

        if (!catLinks.length || !subPanels.length || !openTrigger || !headerMenuEl) {
            return;
        }

        const menuWrapper = document.createElement('div');
        menuWrapper.className = 'gmd-menu-wrapper row';

        const overlay = document.createElement('div');
        overlay.className = 'gmd-menu-overlay row';

        // document.body.appendChild(overlay);

        const flatRow = document.createElement('div');
        flatRow.className = 'gmd-cat-row d-inline-flex';

        const panelContainer = document.createElement('div');
        panelContainer.className = 'gmd-sub-panel-container main-container row';

        menuWrapper.append(flatRow, panelContainer, overlay);

        // Move original panels
        subPanels.forEach(panel => panelContainer.appendChild(panel));

        function showPanelFor(rootName) {

            let hasPanel = false;

            // Update submenu
            subPanels.forEach(panel => {

                const active = panel.dataset.root_name === rootName;

                panel.classList.toggle('is-active', active);

                if (active) {
                    hasPanel = true;
                }

            });

            // Update top menu active state
            flatRow.querySelectorAll('a').forEach(link => {
                link.classList.toggle(
                    'is-active',
                    link.dataset.rootName === rootName
                );
            });

            if (!hasPanel) {
                flatRow.querySelectorAll('a').forEach(link => {
                    link.classList.remove('is-active');
                });
            }

            return hasPanel;

        }

        function closeMenu() {

            menuWrapper.classList.remove('is-open');
            overlay.classList.remove('is-visible');

            flatRow.querySelectorAll('a').forEach(link => {
                link.classList.remove('is-active');
            });

            subPanels.forEach(panel => {
                panel.classList.remove('is-active');
            });

        }

        function createMenuLink({ text, href, title = text, rootName = null, originalLink = null }) {

            const link = document.createElement('a');

            link.className = 'd-inline-block text-primary mr-3';
            link.href = href;
            link.title = title;
            link.textContent = text;
            link.dataset.rootName = rootName || '';

            link.addEventListener('mouseenter', () => {

                // No submenu
                if (!rootName || !originalLink) {
                    closeMenu();
                    return;
                }

                // Original behaviour
                originalLink.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                originalLink.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

                // setTimeout(() => {

                const hasPanel = showPanelFor(rootName);

                menuWrapper.classList.toggle('is-open', hasPanel);
                overlay.classList.toggle('is-visible', hasPanel);

                // }, 150);

            });

            link.addEventListener('mouseleave', (e) => {

                // If moving into the submenu, keep it open
                if (panelContainer.contains(e.relatedTarget)) {
                    return;
                }

                closeMenu();

            });

            return link;
        }

        catLinks.forEach(link => {

            flatRow.appendChild(
                createMenuLink({
                    text: link.dataset.root_name,
                    href: link.href,
                    title: link.title || link.dataset.root_name,
                    rootName: link.dataset.root_name,
                    originalLink: link
                })
            );

        });

        flatRow.appendChild(
            createMenuLink({
                text: 'Acties',
                href: '/acties',
                title: 'Acties'
            })
        );

        panelContainer.addEventListener('mouseleave', (e) => {

            const to = e.relatedTarget;

            if (to && menuWrapper.contains(to)) {
                return;
            }

            closeMenu();

        });

        // Replace old trigger
        const oldTriggerWrapper = openTrigger.closest('.d-inline-block');

        if (oldTriggerWrapper) {
            oldTriggerWrapper.insertAdjacentElement('afterend', flatRow);
            oldTriggerWrapper.remove();
        }

        // Insert panels below menu
        headerMenuEl.insertAdjacentElement('afterend', menuWrapper);

        // Show first category
        // showPanelFor(catLinks[0].dataset.root_name);

        document.body.classList.add(testInfo.className);

    });

})();