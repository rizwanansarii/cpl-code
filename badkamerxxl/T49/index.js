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

                        const initializer = window[functionName];

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