(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-08',
        debug: 0,
        testName: 'T8 | PLP productcards consistenter en met duidelijke primaire actie',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const translations = {
        en: {
            popularFilters: "Popular filters"
        },
        nl: {
            popularFilters: "Populaire filters"
        },
        it: {
            popularFilters: "Filtri popolari"
        },
        de: {
            popularFilters: "Beliebte Filter"
        },
        es: {
            popularFilters: "Filtros populares"
        },
        fr: {
            popularFilters: "Filtres populaires"
        }
    };

    const locale = Shopify.locale || "en";

    const text = translations[locale]?.popularFilters || translations.en.popularFilters;

    function normalizeFilter(text) {

        return text
            .toLowerCase()
            .replace(/\(\d+\)/g, '')
            .replace(/[⚡🚀🔥💥]/g, '')
            .replace(/new colours?/g, 'new color')
            .replace(/new colors?/g, 'new color')
            .replace(/speciale editie/g, 'special edition')
            .replace(/\s+/g, ' ')
            .trim();

    }

    function getCollectionFilters() {
        const container = document.querySelector('#accordion-filter-p-m-custom-badges_value .checkbox-list');
        if (!container) return [];

        const map = new Map();
        container.querySelectorAll('.checkbox-container').forEach(item => {
            const input = item.querySelector('input');
            const label = item.querySelector('label');

            if (!input || !label) return;

            const countMatch = label.textContent.match(/\((\d+)\)/);

            const count = countMatch ? Number(countMatch[1]) : 0;

            const text = label.textContent
                .replace(/\(\d+\)/g, '')
                .replace(/[⚡🚀🔥💥]/g, '')
                .trim();

            const key = normalizeFilter(text);

            if (!map.has(key)) {
                map.set(key, {
                    key,
                    label: text,
                    count,
                    inputs: [input]
                });

            } else {
                const filter = map.get(key);
                filter.inputs.push(input);
                filter.count += count;

            }
        });

        return [...map.values()];
    }

    function renderQuickFilters() {
        const filters = getCollectionFilters();
        if (!filters.length) return;

        document.querySelector('.gmd-quick-filters')?.remove();

        const html = `
            <div class="gmd-quick-filters">
                <div class="gmd-quick-filters__content">
                    <div class="gmd-quick-filters__title">
                        ${text}
                    </div>
                    <div class="gmd-quick-filters__chips"></div>
                </div>
                <button class="gmd-quick-filters__toggle" type="button">
                    <svg class="gmd-open" xmlns="http://www.w3.org/2000/svg" width="31" height="20" viewBox="0 0 31 20" fill="none">
                        <path d="M13.3536 9.64645C13.5488 9.84171 13.5488 10.1583 13.3536 10.3536L10.1716 13.5355C9.97631 13.7308 9.65973 13.7308 9.46447 13.5355C9.2692 13.3403 9.2692 13.0237 9.46447 12.8284L12.2929 10L9.46447 7.17157C9.2692 6.97631 9.2692 6.65973 9.46447 6.46447C9.65973 6.2692 9.97631 6.2692 10.1716 6.46447L13.3536 9.64645ZM0.5 10.5H0V9.5H0.5V10V10.5ZM13 10V10.5H0.5V10V9.5H13V10Z" fill="#2E2E2E"/>
                        <path d="M17.6464 9.64645C17.4512 9.84171 17.4512 10.1583 17.6464 10.3536L20.8284 13.5355C21.0237 13.7308 21.3403 13.7308 21.5355 13.5355C21.7308 13.3403 21.7308 13.0237 21.5355 12.8284L18.7071 10L21.5355 7.17157C21.7308 6.97631 21.7308 6.65973 21.5355 6.46447C21.3403 6.2692 21.0237 6.2692 20.8284 6.46447L17.6464 9.64645ZM30.5 10.5H31V9.5H30.5V10V10.5ZM18 10V10.5H30.5V10V9.5H18V10Z" fill="#2E2E2E"/>
                        <line x1="15.375" y1="2.18557e-08" x2="15.375" y2="20" stroke="#2E2E2E"/>
                    </svg>
                    <svg class="gmd-close" xmlns="http://www.w3.org/2000/svg" width="31" height="20" viewBox="0 0 31 20" fill="none">
                        <path d="M5.89645 9.64645C5.70118 9.84171 5.70118 10.1583 5.89645 10.3536L9.07843 13.5355C9.27369 13.7308 9.59027 13.7308 9.78553 13.5355C9.9808 13.3403 9.9808 13.0237 9.78553 12.8284L6.95711 10L9.78553 7.17157C9.9808 6.97631 9.9808 6.65973 9.78553 6.46447C9.59027 6.2692 9.27369 6.2692 9.07843 6.46447L5.89645 9.64645ZM18.75 10.5H19.25V9.5H18.75V10V10.5ZM6.25 10V10.5H18.75V10V9.5H6.25V10Z" fill="#2E2E2E"/>
                        <path d="M26.6036 9.64645C26.7988 9.84171 26.7988 10.1583 26.6036 10.3536L23.4216 13.5355C23.2263 13.7308 22.9097 13.7308 22.7145 13.5355C22.5192 13.3403 22.5192 13.0237 22.7145 12.8284L25.5429 10L22.7145 7.17157C22.5192 6.97631 22.5192 6.65973 22.7145 6.46447C22.9097 6.2692 23.2263 6.2692 23.4216 6.46447L26.6036 9.64645ZM13.75 10.5H13.25V9.5H13.75V10V10.5ZM26.25 10V10.5H13.75V10V9.5H26.25V10Z" fill="#2E2E2E"/>
                        <line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="20" stroke="#2E2E2E"/>
                        <line x1="30.5" y1="2.18557e-08" x2="30.5" y2="20" stroke="#2E2E2E"/>
                    </svg>
                    <svg class="gmd-mobile-arrow" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M6.68842 14.8101C6.98131 15.103 7.45619 15.103 7.74908 14.8101L12.4688 10.0905L17.1884 14.8101C17.4813 15.103 17.9562 15.103 18.2491 14.8101C18.542 14.5172 18.542 14.0423 18.2491 13.7495L12.9991 8.49948C12.7062 8.20658 12.2313 8.20658 11.9384 8.49948L6.68842 13.7495C6.39553 14.0423 6.39553 14.5172 6.68842 14.8101Z" fill="#2E2E2E"/>
                    </svg>
                </button>
                <div class="gmd-quick-filters__body"></div>
            </div>
        `;

        document.querySelector('body').insertAdjacentHTML('beforeend', html);

        const body = document.querySelector(".gmd-quick-filters__body");
        const chips = document.querySelector(".gmd-quick-filters__chips");

        filters.forEach(filter => {
            const count = filter.count;

            // Desktop chip
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "gmd-filter-chip";
            chip.dataset.key = filter.key;

            chip.innerHTML = `
                <input type="checkbox" class="gmd-filter-checkbox" ${filter.inputs.some(input => input.checked) ? "checked" : ""} tabindex="-1">
                <span class="gmd-filter-label">${filter.label} <span class="count">(${count})</span></span>
            `;

            if (filter.inputs.some(input => input.checked)) {
                chip.classList.add("is-active");
            }

            // Mobile row
            const row = document.createElement("button");
            row.type = "button";
            row.className = "gmd-filter-row";
            row.dataset.key = filter.key;

            row.innerHTML = `
                <input type="checkbox" class="gmd-filter-checkbox" ${filter.inputs.some(input => input.checked) ? "checked" : ""} tabindex="-1">
                <span class="gmd-filter-label">${filter.label} <span class="count">(${count})</span></span>
            `;

            if (filter.inputs.some(input => input.checked)) {
                row.classList.add("is-active");
            }

            const clickHandler = () => {
                const currentFilter = getCollectionFilters().find(
                    f => f.key === filter.key
                );

                if (!currentFilter) return;

                const shouldCheck = !currentFilter.inputs.every(input => input.checked);

                currentFilter.inputs.forEach(input => {
                    input.checked = shouldCheck;
                });

                const form = document.querySelector("#facet-form");

                form.dispatchEvent(
                    new CustomEvent("facet:update", {
                        bubbles: true,
                        detail: {
                            url: form._buildUrl()
                        }
                    })
                );
            };

            chip.addEventListener("click", clickHandler);
            row.addEventListener("click", clickHandler);

            chips.appendChild(chip);
            body.appendChild(row);

        });

    }

    function syncQuickFilters() {
        const filters = getCollectionFilters();
        document.querySelectorAll(".gmd-filter-chip,.gmd-filter-row").forEach(item => {
            const filter = filters.find(
                f => f.key === item.dataset.key
            );
            const active = filter
                ? filter.inputs.some(input => input.checked)
                : false;

            item.classList.toggle("is-active", active);
            const checkbox = item.querySelector(".gmd-filter-checkbox");
            if (checkbox) {
                checkbox.checked = active;
            }
        });
    }

    waitForElement(".collection .product-list", () => {
        document.body.classList.add(testInfo.className);
        renderQuickFilters();
        document.addEventListener("click", e => {
            const toggle = e.target.closest(".gmd-quick-filters__toggle");
            if (!toggle) return;
            document.querySelector(".gmd-quick-filters")?.classList.toggle("is-open");
        });

        document.addEventListener("change", e => {
            if (e.target.matches('#accordion-filter-p-m-custom-badges_value input[type="checkbox"]')) {
                syncQuickFilters();
            }
        });
        document.addEventListener("facet:update", () => {
            setTimeout(() => {
                syncQuickFilters();
            }, 100);
        });
    });
})();