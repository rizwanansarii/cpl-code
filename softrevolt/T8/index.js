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

    const FIT_FINDER_URL = '/pages/fit-finder';
    const TRIGGER_SELECTOR = '.fit-finder-highlight a[href="/pages/fit-finder"], .fit-finder-link a[href="/pages/fit-finder"], header a[href="/pages/fit-finder"]';
    const stepOneImage = 'https://images.varify.io/fcff45282c29075916e2eb1cd713a27fce96df1e817f84acad6f91a8dec5745f/step_1_model_img.png';
    const FIT_FINDER_STORAGE_KEY = 'theme:fit-finder-size';

    let fetchPromise = null;
    let assetsInjected = false;
    let popupOpen = false;

    // Mirrors the theme's own DOMContentLoaded badge logic (button--fit-finder /
    // #fit-finder-size), but callable on demand so both spots refresh live the
    // instant the pop-up's quiz produces a result, instead of only on next page load.
    function updateFitFinderBadges(size) {

        const highlightBtn = document.querySelector('.button--fit-finder');
        if (highlightBtn) highlightBtn.textContent = size ? `Jouw maat: ${size}` : 'Vind je maat';

        applyFitFinderSizeLabel(size);
        selectRecommendedSize(size);
    }

    // #fit-finder-size lives inside <variant-selects>'s own markup, so set it
    // as its own step — selectRecommendedSize()'s input.click() re-fetches and
    // replaces that markup via Shopify's Section Rendering API, which wipes
    // this label straight back to "Vind je maat" a moment later. Called again
    // once that swap happens (see selectRecommendedSize) to make it stick.
    function applyFitFinderSizeLabel(size) {
        if (!size) return;
        const linkSize = document.querySelector('#fit-finder-size');
        if (!linkSize) return;
        linkSize.textContent = `Jouw aanbevolen maat: ${size}`;
        document.querySelector('.fit-finder-highlight')?.classList.add('hidden');
    }

    // Auto-selects the recommended size's variant option. Uses a real .click()
    // rather than setting .checked directly, so the theme's variant-selects
    // component still fires its own change handling (price, stock, add-to-cart url)
    function selectRecommendedSize(size) {
        if (!size) return;
        const input = document.querySelector(`variant-selects input[value="Maat ${size}"], variant-selects input[value="${size}"]`);
        if (!input || input.checked || input.disabled) return;

        // The click below makes product-info.js re-fetch this section and swap
        // it in via Shopify's HTMLUpdateUtility.viewTransition (global.js), which
        // does NOT update <variant-selects> in place: it renames the old node's
        // ids, inserts the freshly-fetched <variant-selects> as a new SIBLING,
        // then removes the old one ~500ms later. So watch the parent for that
        // sibling landing (not the old node itself) and re-apply the label then.
        const variantSelects = input.closest('variant-selects');
        const parent = variantSelects?.parentNode;
        if (parent) {
            const observer = new MutationObserver((mutations) => {
                const swapped = mutations.some((m) =>
                    Array.from(m.addedNodes).some((node) => node.nodeType === 1 && node.matches?.('variant-selects'))
                );
                if (swapped) {
                    observer.disconnect();
                    applyFitFinderSizeLabel(size);
                }
            });
            observer.observe(parent, { childList: true });
            setTimeout(() => observer.disconnect(), 5000); // safety cutoff
        }

        input.click();
    }

    // The native badge scripts only run once on DOMContentLoaded, so they miss the
    // Fit Finder quiz result written while the pop-up is open. There's no same-tab
    // 'storage' event to hook into, so intercept the write itself instead.
    //
    // The quiz reaches its result step (and writes this key) before the user has
    // closed the pop-up or confirmed the email step, so don't apply it live —
    // wait until the pop-up actually closes (closePopup() re-reads localStorage
    // and re-runs updateFitFinderBadges then, which also re-selects the variant).
    function isFitFinderStorageValue() {
        try {
            const nativeSetItem = localStorage.setItem.bind(localStorage);
            localStorage.setItem = function (key, value) {
                try {
                    nativeSetItem(key, value);
                } catch (error) {
                    // Safari in private mode does not allow setting item, we silently fail
                }
                if (key === FIT_FINDER_STORAGE_KEY && !popupOpen) {
                    updateFitFinderBadges(value);
                }
            };
        } catch (error) {
            // Safari in private mode does not allow setting item, we silently fail
        }
    }

    // Pulls the live Fit Finder section (markup + its CSS/JS deps) straight from
    // /pages/fit-finder so the pop-up always mirrors that page, incl. future edits.
    function fetchFitFinderSection() {
        if (fetchPromise) return fetchPromise;
        fetchPromise = fetch(FIT_FINDER_URL, { credentials: 'same-origin' })
            .then((res) => res.text())
            .then((html) => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const wrapper = doc.querySelector('[id*="fit_finder"]');
                const fitFinderEl = wrapper && wrapper.querySelector('.fit-finder');
                if (!wrapper || !fitFinderEl) return null;
                return {
                    links: Array.from(wrapper.querySelectorAll('link[rel="stylesheet"][href]')).map((l) => l.getAttribute('href')),
                    scripts: Array.from(wrapper.querySelectorAll('script[src]')).map((s) => ({ src: s.getAttribute('src'), type: s.type || '' })),
                    html: fitFinderEl.outerHTML
                };
            })
            .catch(() => null);
        return fetchPromise;
    }

    // Load whatever CSS/JS the fit-finder section itself declares, skipping
    // anything already present on the page (component-card.css, etc. are shared).
    function injectAssets(links, scripts) {
        if (assetsInjected) return;
        assetsInjected = true;

        links.forEach((href) => {
            const filename = href.split('/').pop().split('?')[0];
            if (document.querySelector(`link[href*="${filename}"]`)) return;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        });

        scripts.forEach(({ src, type }) => {
            const filename = src.split('/').pop().split('?')[0];
            if (document.querySelector(`script[src*="${filename}"]`)) return;
            const script = document.createElement('script');
            if (type) script.type = type;
            script.src = src;
            document.head.appendChild(script);
        });
    }

    function buildOverlay() {
        if (document.querySelector('#gmdFitFinderOverlay')) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div class="gmd-fitfinder-overlay" id="gmdFitFinderOverlay">
                <div class="gmd-fitfinder-inner">
                    <div class="gmd-fitfinder-box">
                        <div class="gmd-fitfinder-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M8 7.95996L24 23.96M8 23.96L24 7.95996" stroke="black" stroke-width="3" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="gmd-fitfinder-body" id="gmdFitFinderBody">
                            <div class="gmd-fitfinder-loading">Laden...</div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    function openPopup() {
        buildOverlay();
        document.querySelector('#gmdFitFinderOverlay')?.classList.add('is-fitfinder-open');
        document.body.style.overflow = 'hidden';
        popupOpen = true;

        fetchFitFinderSection().then((data) => {
            const body = document.querySelector('#gmdFitFinderBody');
            if (!body) return;
            if (!data) {
                body.innerHTML = `<p class="gmd-fitfinder-error">De Fit Finder kon niet worden geladen. <a href="${FIT_FINDER_URL}">Ga naar de Fit Finder</a>.</p>`;
                return;
            }
            injectAssets(data.links, data.scripts);
            body.innerHTML = data.html;
            var stepOne = document.querySelector('fit-finder [data-step="1"]'), stepOne = document.querySelector('fit-finder [data-step="1"]'), stepTwo = document.querySelector('fit-finder [data-step="2"]'), stepFour = document.querySelector('fit-finder [data-step="4"]'), stepFive = document.querySelector('fit-finder [data-step="5"]');
            if (stepOne && !stepOne.querySelector('.gmd-step-image')) {
                var imgContainer = document.createElement('div');
                imgContainer.className = 'gmd-step-image';
                var img = document.createElement('img');
                img.src = stepOneImage;
                img.alt = 'Fit Finder Step 1';
                img.style.cssText = 'max-width: 100%; height: auto; border-radius: 8px;';
                imgContainer.appendChild(img);
                stepOne.insertAdjacentElement("afterbegin", imgContainer);
            }
            if (stepOne && stepOne.querySelector("h2 + p") && !stepOne.querySelector("p.gmd-paragraph")) {
                stepOne.querySelector("h2 + p").classList.add("gmd-paragraph");
                stepOne.querySelector("h2 + p").innerHTML = `Jouw lichaam is uniek, en onze vernieuwde maatvoering is dat ook. <br>Met onze Fit Finder weet je in 3 stappen<br>welke Soft Revolt maat je hebt.`;
            }
            if (stepTwo && stepTwo.querySelector("h2 + p") && !stepTwo.querySelector("p.gmd-paragraph")) {
                stepTwo.querySelector("h2 + p").classList.add("gmd-paragraph");
                stepTwo.querySelector("h2 + p").innerHTML = `Meet je op met een meetlint, <br class="mob-only">strak onder je borsten.`;
            }
            if (stepFour && stepFour.querySelector("h2 + p") && !stepFour.querySelector("p.gmd-paragraph")) {
                stepFour.querySelector("h2 + p").classList.add("gmd-paragraph");
                stepFour.querySelector("h2 + p").innerHTML = `Draag je meerdere cupmaten? <br class="mob-only">Kies dan de grootste.`;
            }
            if (stepFive && stepFive.querySelector("fit-finder-form p.heading") && !stepFive.querySelector("p.gmd-paragraph")) {
                stepFive.querySelector("fit-finder-form p.heading").classList.add("gmd-paragraph");
                stepFive.querySelector("fit-finder-form p.heading").innerHTML = `Je Soft Revolt maat altijd bij de hand? <br class="mob-only">Vul hier je e-mailadres in.`;
            }
            watchEmailFormSubmit(body);
        });
    }

    // The theme's own <fit-finder-form> posts the email to Klaviyo and, while
    // the request is in flight, adds a "loading" class to the submit button
    // (see fit-finder.js's toggleSubmitButton) — there's no success/error class
    // to hook into otherwise. Close the pop-up once that class is removed again,
    // i.e. the submission has finished.
    function watchEmailFormSubmit(body) {
        const submitButton = body.querySelector('fit-finder-form .button--mail');
        if (!submitButton) return;

        const observer = new MutationObserver(() => {
            if (!submitButton.classList.contains('loading')) {
                observer.disconnect();
                closePopup();
            }
        });
        observer.observe(submitButton, { attributes: true, attributeFilter: ['class'] });
    }

    function closePopup() {
        if (document.querySelector('#gmdFitFinderOverlay fit-finder [data-step="5"]:not(.hidden)')) {
            updateFitFinderBadges(localStorage.getItem(FIT_FINDER_STORAGE_KEY));
        }
        document.querySelector('#gmdFitFinderOverlay')?.classList.remove('is-fitfinder-open');
        document.body.style.overflow = '';
        popupOpen = false;

        // Now that the pop-up is closed, apply whatever result the quiz produced
        // while it was open — shows the recommended-size badges and selects the
        // matching variant.
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

        /*
 * Collapsible state
 */
        let isOpen = false;

        const chevron = header.querySelector(
            '.gmd-chevron'
        );

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

        selectRow.style.display = 'none';
        bottomText.style.display = 'none';

        container.appendChild(header);
        container.appendChild(selectRow);
        container.appendChild(bottomText);

        header.addEventListener('click', () => {
            isOpen = !isOpen;

            selectRow.style.display =
                isOpen ? 'grid' : 'none';

            bottomText.style.display =
                isOpen ? 'block' : 'none';

            if (chevron) {
                chevron.style.transform =
                    isOpen
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)';
            }
        });

        const variantSelects = variantField.closest('variant-selects');

        if (variantSelects) {
            variantSelects.insertAdjacentElement('afterend', container);
        } else {
            variantField.insertAdjacentElement('afterend', container);
        }

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

        bandSelector.select.addEventListener('change', (event) => {
            event.stopPropagation();
            updateDisplayedSize();
        });

        cupSelector.select.addEventListener('change', (event) => {
            event.stopPropagation();
            updateDisplayedSize();
        });

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
            // Keep the "Jouw maat" / "Jouw aanbevolen maat" badges — and the selected
            // size itself — in sync with the Fit Finder result: on load, and once the
            // pop-up closes (see watchFitFinderStorage / closePopup)
            // isFitFinderStorageValue();
            // applyFitFinderSizeLabel(localStorage.getItem(FIT_FINDER_STORAGE_KEY));
            // updateFitFinderBadges(localStorage.getItem(FIT_FINDER_STORAGE_KEY));

            // Prefetch in the background so the pop-up opens instantly on click
            fetchFitFinderSection();

            document.addEventListener('click', (e) => {
                const trigger = e.target.closest(TRIGGER_SELECTOR);
                if (trigger) {
                    e.preventDefault();
                    openPopup();
                    return;
                }
                if (document.querySelector(".gmd-fitfinder-overlay.is-fitfinder-open")) {
                    if (e.target.closest('.gmd-fitfinder-close')) {
                        closePopup();
                        return;
                    }
                    // Close on overlay background click
                    if (e.target.id === 'gmdFitFinderOverlay' || (e.target.closest('.gmd-fitfinder-inner') && !e.target.closest('.gmd-fitfinder-box'))) {
                        closePopup();
                        return;
                    }
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closePopup();
            });
        });
    }

    init();

})();