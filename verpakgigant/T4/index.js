(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-04',
        debug: 0,
        testName: 'T4 | Redesign subcategoriecards',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".section > .section-content .row .col .box-text .plain", async () => {

        const BASE_URL = "https://cdn.jsdelivr.net/gh/admin-gmd/gmdassets/VPG/categories-data-lists.json";

        // Get slug from URL
        const path = window.location.pathname.replace("/c/", "").replace(/\/$/, "");

        function normalize(str) {
            return str?.toLowerCase().trim();
        }

        try {
            const res = await fetch(BASE_URL);
            const data = await res.json();

            if (!data[path]) {
                console.warn("No matching category:", path);
                return;
            }

            if (!document.querySelector('.gmd-category-grid')) {
                document.querySelector('body').classList.add(testInfo.className);
                document.querySelectorAll('.section > .section-content .row .col .box-text .plain img').forEach((el) => {
                    const existingCard = el.closest('.section-content');
                    existingCard.classList.add('card-parent');
                })

                const items = data[path];

                let html = '';
                html += `
                    <div class="gmd-category-grid">
                    ${items.map(item => {
                    return `
                            <div class="gmd-card">
                                <a href="${item.url}" class="gmd-item-link"></a>
                                <div class="gmd-card-inner">
                                    <div class="gmd-image">
                                        <div class="image-wrapper">
                                            <img src="${item.image?.src || ''}" alt="${item.image?.alt || item.keyword}">
                                        </div>
                                        ${item.variant_count ? `<span class="gmd-badge">${item.variant_count || ''}</span>` : ''}
                                    </div>
                        
                                    <div class="gmd-content">
                                        <h3>${item.keyword}</h3>
                                        <p>${item.description || ''} - ${item.context}</p>
                                        <span class="gmd-price">${item.price_per_item || ''}</span>
                                    </div>
                        
                                    <div class="gmd-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                            <path d="M1.15315 2.99285e-07C1.26526 2.94385e-07 1.36937 0.0409358 1.46547 0.122808L7.85586 6.6807C7.95195 6.76257 8 6.86901 8 7C8 7.11462 7.95195 7.22105 7.85586 7.3193L1.46547 13.8526C1.36937 13.9509 1.26527 14 1.15315 14C1.02503 14 0.912913 13.9509 0.816817 13.8526L0.144144 13.1649C0.0480485 13.0667 4.31388e-07 12.9602 4.26377e-07 12.8456C4.20651e-07 12.7146 0.0480484 12.6 0.144144 12.5018L5.52553 7L0.144144 1.47368C0.0480479 1.39181 -7.89365e-08 1.28538 -8.46624e-08 1.15439C-8.96726e-08 1.03977 0.0480479 0.933334 0.144144 0.835088L0.816817 0.122808C0.912913 0.0409358 1.02502 3.04886e-07 1.15315 2.99285e-07Z" fill="white"/>
                                        </svg>
                                    </div>
                        
                                </div>
                            </div>
                        `;
                }).join("")}
                    </div>
                `;
                document.querySelector('.card-parent').insertAdjacentHTML('beforeend', html);

            }
        } catch (err) {
            console.error("Error loading JSON:", err);
        }
    });
})();