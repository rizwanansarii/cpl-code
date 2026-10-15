(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-49',
        debug: 0,
        testName: `T49 | Lijnweergave filterbox ATF (desktop) + Sticky filter boven (Mobile)`,
        testVersion: 'v1'
    };

    const TARGET_PATHS = [
        '/kranen/badkranen/inbouw-badkranen',
        '/badkamermeubels/badmeubel-sets'
    ];

    const currentPath = window.location.pathname.replace(/\/$/, '');

    if (!TARGET_PATHS.some(path => currentPath === path)) return;
    if (document.body.dataset.gmd49Initialized === 'true') return;

    document.body.classList.add(testInfo.className);
    document.body.dataset.gmd49Initialized = 'true';

    const $ = window.jQuery;

    function waitForElement(selector, callback, attempts = 400) {
        const element = document.querySelector(selector);

        if (element) {
            callback(element);
            return;
        }

        if (attempts > 0) {
            window.setTimeout(
                () => waitForElement(selector, callback, attempts - 1),
                25
            );
        }
    }

    function getSelectedFilters(originalFilter) {
        if (!originalFilter) {
            return [];
        }

        const selected = [];

        const filterKey = originalFilter.dataset.filterKey;

        if (!filterKey) {
            return selected;
        }

        originalFilter.querySelectorAll('a[data-add][data-remove]').forEach((link) => {

            const input = link.querySelector('input');

            if (input?.checked) {
                selected.push({
                    input,
                    link,
                    value: link.dataset.value || ''
                });
            }
        });

        const currentUrl = new URL(window.location.href);

        const selectedValues = currentUrl.searchParams.getAll(filterKey);

        if (selected.length === 0) {

            originalFilter.querySelectorAll('a[data-add][data-remove]').forEach((link) => {

                try {
                    const addUrl = new URL(
                        link.dataset.add,
                        window.location.origin
                    );

                    const value = addUrl.searchParams.get(filterKey);

                    if (value && selectedValues.includes(value)) {
                        selected.push({
                            input: link.querySelector('input'),
                            link,
                            value
                        });
                    }

                } catch (_) {
                    // Ignore malformed data-add URLs.
                }
            });
        }

        if (selected.length === 0 && selectedValues.length > 0) {

            const isSliderFilter = originalFilter.querySelector(
                '.slider_price, ' +
                '.slider_delivery_days, ' +
                '.slider_stock_m2, ' +
                '.from_to_slider'
            );

            if (isSliderFilter) {

                selected.push({
                    input: null,
                    link: {
                        dataset: {
                            key: filterKey,
                            value: selectedValues.join(','),
                            add: ''
                        }
                    },

                    value: selectedValues.join(',')
                });
            }
        }

        return selected;
    }

    function updateFilterState(originalFilter, visualFilter) {
        if (!originalFilter || !visualFilter) {
            return;
        }

        const selected = getSelectedFilters(originalFilter);
        const selectedCount = selected.length;

        const count = visualFilter.querySelector(
            '.gmd-filter-count'
        );

        if (count) {
            if (selectedCount > 0) {
                count.textContent = String(selectedCount);
                count.classList.add('gmd-filter-count-visible');
            } else {
                count.textContent = '';
                count.classList.remove('gmd-filter-count-visible');
            }
        }

        visualFilter.classList.toggle('gmd-filter-active', selectedCount > 0);

        const selectedLinkKeys = new Set(
            selected
                .filter(({ link }) => link)
                .map(({ link }) => {
                    return [
                        link.dataset.key || '',
                        link.dataset.value || '',
                        link.dataset.add || ''
                    ].join('::');
                })
        );

        visualFilter.querySelectorAll('.gmd-filter-panel a[data-add]').forEach((visualLink) => {
            const key = [
                visualLink.dataset.key || '',
                visualLink.dataset.value || '',
                visualLink.dataset.add || ''
            ].join('::');

            const input = visualLink.querySelector('input');

            if (input) {
                input.checked = selectedLinkKeys.has(key);
            }
        });
    }

    function closeAllFilters(except = null) {
        document.querySelectorAll('.gmd-filter-toolbar .category-specs-filter.gmd-filter-open').forEach((filter) => {
            if (filter !== except) {
                filter.classList.remove('gmd-filter-open');
            }
        });
    }

    function findOriginalOption(originalFilter, visualLink) {
        if (!originalFilter || !visualLink) {
            return null;
        }

        const links = originalFilter.querySelectorAll('a[data-add]');

        for (const link of links) {
            if (
                (
                    visualLink.dataset.add &&
                    link.dataset.add ===
                    visualLink.dataset.add
                ) ||
                (
                    visualLink.dataset.key &&
                    visualLink.dataset.value &&
                    link.dataset.key ===
                    visualLink.dataset.key &&
                    link.dataset.value ===
                    visualLink.dataset.value
                )
            ) {
                return link;
            }
        }

        return null;
    }

    function removeClonedSliderMarkup(visualFilter) {
        const sliderSelectors = [
            '.from_to_slider',
            '.slider_price',
            '.slider_delivery_days',
            '.slider_stock_m2'
        ];

        sliderSelectors.forEach((selector) => {
            visualFilter.querySelectorAll(selector).forEach((slider) => {
                slider.replaceChildren();

                slider.classList.remove(
                    'noUi-target',
                    'noUi-ltr',
                    'noUi-rtl',
                    'noUi-horizontal',
                    'noUi-vertical',
                    'noUi-txt-dir-ltr',
                    'noUi-txt-dir-rtl'
                );
            });
        });
    }

    function initializeVisualSliders(visualFilter) {
        if (!visualFilter) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                const sliderTypes = [
                    [
                        '.slider_price',
                        'loadPriceSlider'
                    ],
                    [
                        '.slider_delivery_days',
                        'loadStockSlider'
                    ],
                    [
                        '.slider_stock_m2',
                        'loadStockM2Slider'
                    ],
                    [
                        '.from_to_slider',
                        'loadFromToSliders'
                    ]
                ];

                sliderTypes.forEach(
                    ([selector, functionName]) => {

                        const pageWindow = typeof unsafeWindow !== 'undefined'
                            ? unsafeWindow
                            : window;

                        const initializer = pageWindow[functionName];

                        if (typeof initializer !== 'function') {
                            return;
                        }

                        visualFilter.querySelectorAll(selector).forEach((slider) => {

                            const rect = slider.getBoundingClientRect();

                            if (slider.noUiSlider && (rect.width === 0 || rect.height === 0)) {
                                try {
                                    slider.noUiSlider.destroy();
                                } catch (error) {
                                    console.warn(
                                        '[T49] Could not destroy old slider',
                                        error
                                    );
                                }
                            }

                            if (slider.noUiSlider) {
                                return;
                            }

                            const visibleRect = slider.getBoundingClientRect();

                            if (visibleRect.width <= 0 || visibleRect.height <= 0) {
                                return;
                            }

                            try {
                                initializer(slider);

                            } catch (error) {
                                console.error(
                                    `[T49] ${functionName} failed`,
                                    error,
                                    slider
                                );
                            }
                        });
                    }
                );
            });
        });
    }

    function createVisualFilter(
        originalFilter,
        index
    ) {
        const visualFilter = originalFilter.cloneNode(true);

        visualFilter.classList.remove(
            'gmd-original-sidebar',
            'gmd-filter-open',
            'gmd-filter-active'
        );

        visualFilter.dataset.gmdVisual = 'true';

        visualFilter.removeAttribute(
            'data-gmd49-ready'
        );

        visualFilter.querySelectorAll('.modal').forEach((modal) => modal.remove());

        visualFilter.querySelectorAll('input[id]').forEach((input, inputIndex) => {
            const oldId = input.id;

            const newId = `gmd-49-visual-${index}-${inputIndex}`;

            input.id = newId;

            visualFilter.querySelectorAll(`label[for="${CSS.escape(oldId)}"]`).forEach((label) => {
                label.htmlFor = newId;
            });
        });

        removeClonedSliderMarkup(
            visualFilter
        );

        const title = visualFilter.querySelector('.category-product-filter-title');

        const titleText = title?.querySelector('.row > .col-12');

        if (!title || !titleText) {
            return visualFilter;
        }

        title.querySelectorAll('.row > .col-12.d-flex').forEach((element) => {
            element.remove();
        });

        titleText.querySelectorAll('.gmd-filter-count, .gmd-filter-chevron').forEach((el) => el.remove());

        const count = document.createElement('span');

        count.className = 'gmd-filter-count';

        titleText.appendChild(count);

        const chevron = document.createElement('span');

        chevron.className = 'gmd-filter-chevron';

        chevron.setAttribute(
            'aria-hidden',
            'true'
        );

        titleText.appendChild(chevron);

        const panel = document.createElement('div');

        panel.className = 'gmd-filter-panel';

        Array.from(
            visualFilter.children
        ).forEach((child) => {
            if (!child.contains(title)) {
                panel.appendChild(child);
            }
        });

        visualFilter.appendChild(panel);

        title.addEventListener('click', (event) => {
            if (event.target.closest('a.popup-opener')) {
                return;
            }

            if (event.target.closest('.gmd-filter-panel')) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const wasOpen = visualFilter.classList.contains('gmd-filter-open');

            closeAllFilters(visualFilter);

            visualFilter.classList.toggle('gmd-filter-open', !wasOpen);

            if (!wasOpen) {
                visualFilter.classList.add('gmd-filter-open');

                initializeVisualSliders(visualFilter);

                window.setTimeout(() => {
                    initializeSpecialSliders();
                }, 50);
            }
        }
        );

        visualFilter.querySelectorAll('.gmd-filter-panel input').forEach((visualInput) => {
            visualInput.addEventListener('change', (event) => {
                event.stopPropagation();

                const visualLink = visualInput.closest('a[data-add][data-remove]');

                const originalLink = findOriginalOption(originalFilter, visualLink);

                const originalInput = originalLink?.querySelector('input');

                if (!originalInput) {
                    return;
                }

                originalInput.checked = visualInput.checked;

                if ($) {
                    $(originalInput).trigger('change');
                } else {
                    originalInput.dispatchEvent(
                        new Event('change', {
                            bubbles: true
                        }
                        )
                    );
                }
            }
            );
        });

        updateFilterState(
            originalFilter,
            visualFilter
        );

        return visualFilter;
    }

    function initializeSpecialSliders() {

        const pageWindow = typeof unsafeWindow !== 'undefined'
            ? unsafeWindow
            : window;

        const priceSlider = document.querySelector('.gmd-filter-toolbar .slider_price');

        if (priceSlider && !priceSlider.noUiSlider && typeof pageWindow.loadPriceSlider === 'function') {
            pageWindow.loadPriceSlider('.gmd-filter-toolbar .slider_price');
        }

        const deliverySlider = document.querySelector('.gmd-filter-toolbar .slider_delivery_days');

        if (deliverySlider && !deliverySlider.noUiSlider && typeof pageWindow.loadStockSlider === 'function') {
            pageWindow.loadStockSlider('.gmd-filter-toolbar .slider_delivery_days');
        }
    }

    function initFilters() {
        const originalWrapper = document.querySelector('.category-product-filters');

        const categoryProducts = document.querySelector('.category-products');

        if (!originalWrapper || !categoryProducts) {
            return;
        }

        if (document.querySelector('.gmd-filter-toolbar')) {
            return;
        }

        const originalFilters = Array.from(
            originalWrapper.querySelectorAll('.category-specs-filter')
        );

        if (!originalFilters.length) {
            return;
        }

        const toolbar = document.createElement('div');

        toolbar.className = 'gmd-filter-toolbar';

        const filterRow = document.createElement('div');

        filterRow.className = 'gmd-filter-row';

        /*
        * Clone the original featured-pages block.
        * Keep the original sidebar element untouched.
        */
        const originalFeaturedPages = originalWrapper.querySelector('.cat-featured-pages');

        let featuredPagesClone = null;

        if (originalFeaturedPages) {
            featuredPagesClone = originalFeaturedPages.cloneNode(true);
            featuredPagesClone.classList.add('gmd-featured-pages-clone');
        }

        originalFilters.forEach(
            (originalFilter, index) => {
                const visualFilter = createVisualFilter(originalFilter, index);

                filterRow.appendChild(visualFilter);
            }
        );

        if (featuredPagesClone) {
            toolbar.appendChild(featuredPagesClone);
        }

        toolbar.append(filterRow);

        // Show 2 rows initially and add "Alle filters"

        const allFiltersButton = document.createElement('button');

        allFiltersButton.type = 'button';
        allFiltersButton.className = 'gmd-all-filters-btn';

        allFiltersButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M0.625 6.875H10.0633C10.2092 7.74768 10.6595 8.54046 11.3344 9.11257C12.0094 9.68467 12.8652 9.99909 13.75 10C14.6345 9.9981 15.4898 9.68332 16.1646 9.11139C16.8393 8.53946 17.2899 7.74725 17.4367 6.875H19.375C19.5408 6.875 19.6997 6.80915 19.8169 6.69194C19.9342 6.57473 20 6.41576 20 6.25C20 6.08424 19.9342 5.92527 19.8169 5.80806C19.6997 5.69085 19.5408 5.625 19.375 5.625H17.4367C17.1383 3.85333 15.6067 2.5 13.75 2.5C11.8933 2.5 10.3617 3.85333 10.0633 5.625H0.625C0.45924 5.625 0.300269 5.69085 0.183058 5.80806C0.065848 5.92527 0 6.08424 0 6.25C0 6.41576 0.065848 6.57473 0.183058 6.69194C0.300269 6.80915 0.45924 6.875 0.625 6.875ZM13.75 3.75C14.413 3.75 15.0489 4.01339 15.5178 4.48223C15.9866 4.95107 16.25 5.58696 16.25 6.25C16.25 6.91304 15.9866 7.54893 15.5178 8.01777C15.0489 8.48661 14.413 8.75 13.75 8.75C13.087 8.75 12.4511 8.48661 11.9822 8.01777C11.5134 7.54893 11.25 6.91304 11.25 6.25C11.25 5.58696 11.5134 4.95107 11.9822 4.48223C12.4511 4.01339 13.087 3.75 13.75 3.75ZM19.375 13.125H9.93667C9.63833 11.3533 8.10667 10 6.25 10C4.39333 10 2.86167 11.3533 2.56333 13.125H0.625C0.45924 13.125 0.300269 13.1908 0.183058 13.3081C0.065848 13.4253 0 13.5842 0 13.75C0 13.9158 0.065848 14.0747 0.183058 14.1919C0.300269 14.3092 0.45924 14.375 0.625 14.375H2.56333C2.70915 15.2477 3.15951 16.0405 3.83445 16.6126C4.50938 17.1847 5.36522 17.4991 6.25 17.5C7.13451 17.4981 7.98983 17.1833 8.66455 16.6114C9.33928 16.0395 9.78991 15.2473 9.93667 14.375H19.375C19.5408 14.375 19.6997 14.3092 19.8169 14.1919C19.9342 14.0747 20 13.9158 20 13.75C20 13.5842 19.9342 13.4253 19.8169 13.3081C19.6997 13.1908 19.5408 13.125 19.375 13.125ZM6.25 16.25C5.58696 16.25 4.95107 15.9866 4.48223 15.5178C4.01339 15.0489 3.75 14.413 3.75 13.75C3.75 13.087 4.01339 12.4511 4.48223 11.9822C4.95107 11.5134 5.58696 11.25 6.25 11.25C6.91304 11.25 7.54893 11.5134 8.01777 11.9822C8.48661 12.4511 8.75 13.087 8.75 13.75C8.75 14.413 8.48661 15.0489 8.01777 15.5178C7.54893 15.9866 6.91304 16.25 6.25 16.25Z" fill="#212529"/>
            </svg>
            <span>Alle filters</span>
        `;

        filterRow.appendChild(allFiltersButton);


        filterRow.appendChild(allFiltersButton);

        const visualFilters = Array.from(
            filterRow.querySelectorAll(':scope > .category-specs-filter')
        );

        let filtersExpanded = window.__gmd49FiltersExpanded === true;

        function updateFilterRows() {
            if (
                filtersExpanded ||
                window.__gmd49FiltersExpanded === true
            ) {
                filtersExpanded = true;
                allFiltersButton.classList.add('gmd-btn-hidden');

                visualFilters.forEach(filter => {
                    filter.classList.remove('gmd-filter-hidden');
                });

                return;
            }

            allFiltersButton.classList.remove('gmd-btn-hidden');
            // Reset all filters before measuring.
            visualFilters.forEach(filter => {
                filter.classList.remove('gmd-filter-hidden');
            });

            if (filtersExpanded) {
                allFiltersButton.style.display = 'none';
                return;
            }

            // Measure the natural positions of all filters.
            const getRows = () => {
                const rows = new Map();

                visualFilters.forEach(filter => {
                    const top = Math.round(filter.getBoundingClientRect().top);

                    if (!rows.has(top)) rows.set(top, []);
                    rows.get(top).push(filter);
                });

                return [...rows.entries()].sort((a, b) => a[0] - b[0]);
            };

            let rows = getRows();

            // Hide filters from row 3 onward.
            if (rows.length > 2) {
                const thirdRowTop = rows[2][0];

                visualFilters.forEach(filter => {
                    if (
                        Math.round(filter.getBoundingClientRect().top) >= thirdRowTop
                    ) {
                        filter.classList.add('gmd-filter-hidden');
                    }
                });
            }


            // Keep the button at the end of row 2.
            filterRow.appendChild(allFiltersButton);

            let attempts = 0;

            // Reserve space for Alle filters + Clear filters.
            const filtersToReserveSpace = 2;

            const currentRows = getRows();

            if (currentRows.length >= 2) {
                const secondRowTop = currentRows[1][0];

                const secondRowFilters = visualFilters.filter(filter =>
                    !filter.classList.contains('gmd-filter-hidden') &&
                    Math.round(filter.getBoundingClientRect().top) === secondRowTop
                );

                secondRowFilters
                    .slice(-filtersToReserveSpace)
                    .forEach(filter => {
                        filter.classList.add('gmd-filter-hidden');
                    });
            }


            while (attempts < 20) {
                const visibleFilters = visualFilters.filter(
                    filter => !filter.classList.contains('gmd-filter-hidden')
                );

                const visibleRows = new Map();

                visibleFilters.forEach(filter => {
                    const top = Math.round(filter.getBoundingClientRect().top);

                    if (!visibleRows.has(top)) visibleRows.set(top, []);
                    visibleRows.get(top).push(filter);
                });

                const rowEntries = [...visibleRows.entries()].sort(
                    (a, b) => a[0] - b[0]
                );

                if (rowEntries.length < 2) break;

                const secondRowTop = rowEntries[1][0];
                const secondRowFilters = rowEntries[1][1];
                const lastFilter = secondRowFilters[secondRowFilters.length - 1];

                filterRow.insertBefore(
                    allFiltersButton,
                    lastFilter.nextElementSibling
                );

                const buttonRect = allFiltersButton.getBoundingClientRect();
                const lastRect = lastFilter.getBoundingClientRect();
                const rowRect = filterRow.getBoundingClientRect();

                if (
                    buttonRect.top >= secondRowTop - 2 &&
                    buttonRect.top <= lastRect.bottom &&
                    buttonRect.right <= rowRect.right + 1
                ) {
                    break;
                }

                // Hide only one filter per attempt, from row 2.
                const filterToHide = secondRowFilters[secondRowFilters.length - 1];

                if (!filterToHide) break;

                filterToHide.classList.add('gmd-filter-hidden');
                attempts++;
            }

            allFiltersButton.querySelector('span').textContent = 'Alle filters';


        }

        allFiltersButton.addEventListener('click', () => {
            filtersExpanded = true;
            window.__gmd49FiltersExpanded = true;

            allFiltersButton.classList.add('gmd-btn-hidden');

            updateFilterRows();
        });


        // Move the clear-filters control into the toolbar.


        function moveClearFiltersButton() {
            const originalClearFilters = document.querySelector(
                '.remove-filters:not(.gmd-clear-filters-clone)'
            );

            if (!originalClearFilters) return;

            let clonedClearFilters = filterRow.querySelector(
                '.gmd-clear-filters-clone'
            );

            if (!clonedClearFilters) {
                clonedClearFilters = originalClearFilters.cloneNode(true);

                clonedClearFilters.classList.add('gmd-clear-filters-clone');
                clonedClearFilters.classList.add('gmd-clear-filters-inline');

                clonedClearFilters.classList.remove('gmd-filter-hidden');

                clonedClearFilters.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    originalClearFilters.click();
                });

                filterRow.appendChild(clonedClearFilters);
            } else {
                // Keep the clone's content in sync with the original.
                clonedClearFilters.innerHTML = originalClearFilters.innerHTML;
                clonedClearFilters.className = originalClearFilters.className;
                clonedClearFilters.classList.add(
                    'gmd-clear-filters-clone',
                    'gmd-clear-filters-inline'
                );
                clonedClearFilters.classList.remove('gmd-filter-hidden');
            }
        }



        function checkClearFiltersButton() {
            // Check after the website has updated its filter DOM.
            window.setTimeout(() => {
                moveClearFiltersButton();
            }, 100);
        }

        document.addEventListener('change', (event) => {
            if (
                event.target.matches(
                    '.gmd-filter-toolbar input, .category-product-filters input'
                )
            ) {
                checkClearFiltersButton();
            }
        });



        requestAnimationFrame(() => {
            updateFilterRows();
            moveClearFiltersButton();
        });

        window.addEventListener('resize', () => {
            updateFilterRows();
        });

        categoryProducts.parentNode.insertBefore(
            toolbar,
            categoryProducts
        );

        originalWrapper.classList.add('gmd-original-sidebar');

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.gmd-filter-toolbar')) {
                closeAllFilters();
            }
        }
        );

        const catalogPage = document.querySelector('.catalog-page');

        if (catalogPage) {

            let rebuildTimer;

            const rebuildT49Toolbar = () => {

                clearTimeout(rebuildTimer);

                rebuildTimer = setTimeout(() => {

                    const toolbar = document.querySelector('.gmd-filter-toolbar');

                    const filters = document.querySelector('.category-product-filters');

                    const products = document.querySelector('.category-products');

                    if (!toolbar && filters && products) {
                        initFilters();
                    }

                }, 150);
            };

            new MutationObserver(
                rebuildT49Toolbar
            ).observe(
                catalogPage,
                {
                    childList: true,
                    subtree: true
                }
            );
        }
    }

    waitForElement('.category-product-filters', initFilters);
})();