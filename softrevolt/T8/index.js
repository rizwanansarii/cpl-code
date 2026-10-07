(() => {
    'use strict';

    const testInfo = {
        className: 'gmd-08',
        debug: 0,
        testName: 'T8 | Traditionele maatvoering',
        testVersion: 'v1'
    };

    const productPath =
        window.location.pathname.match(/\/products\/[^/]+/)?.[0] || '';

    const TARGET_PRODUCTS = [
        '/products/cleo-bralette',
        '/products/anna-bralette',
        '/products/lara-black'
    ];

    if (!TARGET_PRODUCTS.includes(productPath)) {
        return;
    }

    const SIZE_MAP = {
        B: {
            70: 1,
            75: 3,
            80: 5,
            85: 7,
            '90/95': 9,
            '100/105': 11
        },

        C: {
            70: 1,
            75: 3,
            80: 5,
            85: 7,
            '90/95': 9,
            '100/105': 11
        },

        D: {
            70: 1,
            75: 3,
            80: 5,
            85: 7,
            '90/95': 9,
            '100/105': 11
        },

        E: {
            70: 2,
            75: 4,
            80: 6,
            85: 8,
            '90/95': 10,
            '100/105': 12
        },

        F: {
            70: 2,
            75: 4,
            80: 6,
            85: 8,
            '90/95': 10,
            '100/105': 12
        },

        G: {
            70: 2,
            75: 4,
            80: 6,
            85: 8,
            '90/95': 10,
            '100/105': 12
        }
    };

    function waitForElement(selector, callback, minElements = 1, timer = 10000, frequency = 25) {
        const elements = document.querySelectorAll(selector);
        if (timer <= 0) return;
        if (elements.length >= minElements) {
            callback(elements);
            return;
        }
        setTimeout(() => {
            waitForElement(selector, callback, minElements, timer - frequency, frequency);
        }, frequency);
    }

    function createSelector(label, options, className) {
        const wrapper = document.createElement('div');
        wrapper.className = `gmd-converter-select ${className}`;
        const select = document.createElement('select');
        select.className = 'gmd-select';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = label;
        placeholder.selected = true;
        placeholder.disabled = true;
        select.appendChild(placeholder);

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;

            select.appendChild(optionElement);
        });

        wrapper.appendChild(select);

        return {
            wrapper,
            select
        };
    }

    function initSizeConverter() {
        if (document.querySelector('.gmd-size-converter')) {
            return;
        }

        const variantField = document.querySelector('.product-form__input.product-form__input--pill');

        if (!variantField) {
            return;
        }

        const container = document.createElement('div');

        container.className = 'gmd-size-converter';

        const header = document.createElement('div');

        header.className = 'gmd-converter-header';

        header.innerHTML = `
            <span>
                Omrekenen vanaf je huidige BH-maat:
            </span>

            <span class="gmd-chevron">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <g clip-path="url(#clip0_4408_3678)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.35463 0.645917C9.30819 0.599354 9.25301 0.562411 9.19226 0.537205C9.13152 0.511998 9.0664 0.499023 9.00063 0.499023C8.93486 0.499023 8.86974 0.511998 8.809 0.537205C8.74825 0.562411 8.69308 0.599354 8.64663 0.645917L5.00063 4.29292L1.35463 0.645917C1.26074 0.552031 1.13341 0.499286 1.00063 0.499286C0.867856 0.499286 0.740518 0.552031 0.646632 0.645917C0.552745 0.739804 0.5 0.867141 0.5 0.999917C0.5 1.13269 0.552745 1.26003 0.646632 1.35392L4.64663 5.35392C4.69308 5.40048 4.74825 5.43742 4.809 5.46263C4.86974 5.48784 4.93486 5.50081 5.00063 5.50081C5.0664 5.50081 5.13152 5.48784 5.19227 5.46263C5.25301 5.43742 5.30819 5.40048 5.35463 5.35392L9.35463 1.35392C9.40119 1.30747 9.43814 1.2523 9.46334 1.19155C9.48855 1.13081 9.50152 1.06568 9.50152 0.999917C9.50152 0.93415 9.48855 0.869029 9.46334 0.808284C9.43814 0.747538 9.40119 0.692363 9.35463 0.645917Z" fill="#171717"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_4408_3678">
                        <rect width="10" height="6" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </span>
        `;

        const selectRow = document.createElement('div');

        selectRow.className = 'gmd-converter-row';

        const bandSelector =
            createSelector(
                'Omvang',
                [
                    {
                        value: '70',
                        label: '70'
                    },
                    {
                        value: '75',
                        label: '75'
                    },
                    {
                        value: '80',
                        label: '80'
                    },
                    {
                        value: '85',
                        label: '85'
                    },
                    {
                        value: '90/95',
                        label: '90/95'
                    },
                    {
                        value: '100/105',
                        label: '100/105'
                    }
                ],
                'gmd-band'
            );

        const cupSelector =
            createSelector(
                'Cup',
                [
                    {
                        value: 'B',
                        label: 'B'
                    },
                    {
                        value: 'C',
                        label: 'C'
                    },
                    {
                        value: 'D',
                        label: 'D'
                    },
                    {
                        value: 'E',
                        label: 'E'
                    },
                    {
                        value: 'F',
                        label: 'F'
                    },
                    {
                        value: 'G',
                        label: 'G'
                    }
                ],
                'gmd-cup'
            );

        const arrow = document.createElement('div');

        arrow.className = 'gmd-converter-arrow';

        arrow.innerHTML = `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
            >
                <path
                    d="M5.10211 0.803755L5.69669 0.193726C5.94844 -0.0645752 6.35554 -0.0645752 6.60462 0.193726L11.8112 5.53286C12.0629 5.79116 12.0629 6.20884 11.8112 6.46439L6.60462 11.8063C6.35286 12.0646 5.94577 12.0646 5.69669 11.8063L5.10211 11.1962C4.84767 10.9352 4.85303 10.5093 5.11282 10.2537L8.34014 7.09915H0.642785C0.286575 7.09915 0 6.80513 0 6.43966V5.56034C0 5.19487 0.286575 4.90085 0.642785 4.90085H8.34014L5.11282 1.74628C4.85035 1.49073 4.845 1.0648 5.10211 0.803755Z"
                    fill="black"
                />
            </svg>
        `;

        const result = document.createElement('div');

        result.className = 'gmd-converter-result';

        result.textContent = '-';

        selectRow.appendChild(bandSelector.wrapper);

        selectRow.appendChild(cupSelector.wrapper);

        selectRow.appendChild(arrow);

        selectRow.appendChild(result);

        const bottomText = document.createElement('div');

        bottomText.className = 'gmd-converter-text';

        bottomText.innerHTML = `
            <div class="gmd-question">
                Twijfel je nog over je huidige maat?
            </div>

            <div class="gmd-fitfinder">
                95% van de vrouwen vindt hun maat met onze
                <span class="gmd-fitfinder-link">Fit Finder</span>.
            </div>
        `;

        container.appendChild(header);
        container.appendChild(selectRow);
        container.appendChild(bottomText);

        variantField.insertAdjacentElement('afterend', container);

        function updateDisplayedSize() {

            const band = bandSelector.select.value;

            const cup = cupSelector.select.value;

            if (!band || !cup) {
                result.textContent = '-';
                return;
            }

            const size = SIZE_MAP[cup]?.[band];

            if (!size) {
                result.textContent = '-';
                return;
            }

            result.textContent = size;
        }

        bandSelector.select.addEventListener('change', updateDisplayedSize);

        cupSelector.select.addEventListener('change', updateDisplayedSize);

        const fitFinderLink = container.querySelector('.gmd-fitfinder-link');

        if (fitFinderLink) {
            fitFinderLink.addEventListener('click', event => {
                event.preventDefault();
                document.querySelector('.fit-finder-link a').click();
            });
        }
    }

    function init() {
        document.body.classList.add(testInfo.className);

        waitForElement('.product-form__input.product-form__input--pill', () => {
            initSizeConverter();
        });
    }

    init();

})();