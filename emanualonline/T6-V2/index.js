(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-06-v2',
        debug: 0,
        testName: 'T6 | PLP, multivariant CTA test with Buy Now (vervolg T1)',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function getFormKey() {
        return (
            document.querySelector('input[name="form_key"]')?.value ||
            window.FORM_KEY ||
            document.cookie.match(/(?:^|;\s*)form_key=([^;]+)/)?.[1] ||
            ''
        );
    }

    function getProductId(card) {
        return (
            card?.getAttribute('data-id') ||
            card?.querySelector('.kuAddtocart')?.getAttribute('data-id') ||
            card?.querySelector('[data-id]')?.getAttribute('data-id') ||
            ''
        );
    }

    function getUenc(url) {
        try {
            return btoa(url);
        } catch (e) {
            return btoa(unescape(encodeURIComponent(url)));
        }
    }

    function buildEndpoint(productId, productUrl) {
        const sourceUrl = productUrl || window.location.href;
        const uenc = getUenc(sourceUrl);
        return `/checkout/cart/add/uenc/${uenc}/product/${productId}/`;
    }

    async function addToCart(productId, productUrl) {
        const formKey = getFormKey();
        const endpoint = buildEndpoint(productId, productUrl);

        const payload = new URLSearchParams();

        payload.append('product', productId);
        payload.append('item', productId);
        payload.append('qty', '1');
        payload.append('form_key', formKey);
        payload.append('isAjax', '1');

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: payload.toString(),
            credentials: 'include'
        });

        const text = await res.text();

        return text;
    }

    async function openStripeModal() {
        try {
            const res = await fetch('/mcamstripe/checkout/?page=product', {
                credentials: 'include'
            });

            const html = await res.text();

            let modal = document.querySelector('#gmd-stripe-modal');

            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'gmd-stripe-modal';

                modal.innerHTML = `
                <div class="gmd-overlay"></div>
                <div class="gmd-modal-content"></div>
            `;

                document.body.appendChild(modal);

                modal.addEventListener('click', (e) => {
                    if (e.target.classList.contains('gmd-overlay')) {
                        modal.classList.remove('active');
                    }
                });
            }

            const container = modal.querySelector('.gmd-modal-content');
            container.innerHTML = `
                <div class="fixed inset-0 bg-black/50 z-[99]">
                    <div class="fixed flex justify-center items-center text-left z-40 inset-0">
                        <div class="relative inline-block bg-white shadow-xl max-h-screen max-h-svh overflow-auto overscroll-y-contain border border-4 p-7 w-full max-w-[490px] h-full md:h-auto">
                            <button class="close-btn absolute top-0 right-0 p-1 text-xl text-gray-600 hover:text-gray-800" aria-label="Close">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                            ${html}
                        </div>
                    </div>
                </div>
            `;

            container.querySelectorAll('script').forEach(oldScript => {
                const s = document.createElement('script');
                if (oldScript.src) s.src = oldScript.src;
                else s.textContent = oldScript.textContent;
                document.head.appendChild(s);
            });

            if (window.Alpine) {
                Alpine.initTree(container);
            }

            modal.classList.add('active');
            document.body.classList.add('overflow-hidden');
            setTimeout(() => {
                document.querySelector('.gmd-buy-now.is-loading')?.classList.remove('is-loading');
                document.querySelector('.gmd-buy-now .loader')?.remove();
            }, 500);

            function closeModal() {
                modal.classList.remove('active');
                document.body.classList.remove('overflow-hidden');
            }

            document.addEventListener('click', (e) => {
                if (e.target.closest('.close-btn')) {
                    closeModal();
                }
            });

            document.addEventListener('click', (e) => {
                if (!modal.classList.contains('active')) return;

                const content = modal.querySelector('#amasty-stripe-button-modal').closest('.relative');
                if (!content.contains(e.target)) {
                    closeModal();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeModal();
                }
            });

        } catch (e) {
            console.error('Stripe modal failed', e);
        }
    }

    function openMiniCart() {
        try {
            // 1) site-specific event you saw in console
            window.dispatchEvent(new CustomEvent('event 3', {
                detail: {
                    isOpenCartAfterAddToCart: true,
                    isProductPage: false
                }
            }));
        }
        catch (e) {
            console.log('event 3 failed', e);
        }

        // 2) common Hyvä drawer toggle
        window.dispatchEvent(new CustomEvent('toggle-cart'));

        // 3) Hyvä section reload trigger
        window.dispatchEvent(new CustomEvent('reload-customer-section-data'));

        // 4) fallback direct section load + drawer content replace
        fetch('/customer/section/load/?sections=', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.text())
            .then(content => {
                if (window.hyva && typeof window.hyva.replaceDomElement === 'function') {
                    window.hyva.replaceDomElement('#cart-drawer-content', content);
                }

                // window.dispatchEvent(new CustomEvent('toggle-cart'));
            })
            .catch(err => {
                console.error('openMiniCart error:', err);
            });
    }

    const reviewCache = new Map();
    const MAX_CONCURRENT = 4;
    let activeRequests = 0;
    const queue = [];

    function processQueue() {
        if (activeRequests >= MAX_CONCURRENT || !queue.length) return;

        const task = queue.shift();
        activeRequests++;

        task().finally(() => {
            activeRequests--;
            processQueue();
        });
    }

    function addToQueue(task) {
        queue.push(task);
        processQueue();
    }

    function loadReview(link, prod) {

        if (reviewCache.has(link)) {
            prod.querySelector('.gmd-review-wrapper').innerHTML = reviewCache.get(link);
            return;
        }

        addToQueue(async () => {
            try {
                const res = await fetch(link, { credentials: 'include' });
                if (!res.ok) throw new Error(res.status);

                const html = await res.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');

                const reviewEl = doc.querySelector('#rating-container .stars-container')

                const output = reviewEl ? reviewEl.outerHTML : 'No reviews';

                reviewCache.set(link, output);
                prod.querySelector('.gmd-review-wrapper').innerHTML = output;

            } catch (err) {
                console.warn('Failed:', link);
                prod.querySelector('.gmd-review-wrapper').innerHTML = '';
            }
        });
    }

    async function init() {
        const prodList = document.querySelectorAll('.kuResults ul li')
        if (prodList.length) {
            for (const prod of prodList) {
                if (!prod.querySelector('.gmd-btn-wrapper') || !prod.querySelector('.gmd-review-wrapper')) {
                    waitForElement('.iconblock', () => {
                        const iconBlock = prod.querySelector('.iconblock');
                        prod.querySelector('.kuProdBottom').insertAdjacentElement('afterbegin', iconBlock);
                        iconBlock.addEventListener('click', (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }, true)
                    });
                    const link = prod.querySelector('.klevuProductClick')?.href;
                    if (!prod.querySelector('.gmd-review-wrapper')) {
                        prod.querySelector('.kuName').insertAdjacentHTML('afterend', `
                            <div class="gmd-review-wrapper"><div class="kuResourceLoader"></div></div>
                            `
                        )
                    }
                    if (!prod.querySelector('.gmd-btn-wrapper')) {
                        waitForElement('.kuPrice', () => {
                            prod.querySelector('.kuPrice').insertAdjacentHTML('afterend', `
                            <div class="gmd-usp-wrapper">
                                <svg class="desktop" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                    <circle cx="11" cy="11" r="10.5" fill="white" stroke="#1EC28E"/>
                                    <path d="M9.6097 15.2271L5.67719 11.3919C5.44094 11.1615 5.44094 10.7879 5.67719 10.5574L6.53277 9.72299C6.76903 9.49255 7.15212 9.49255 7.38838 9.72299L10.0375 12.3066L15.7116 6.77279C15.9479 6.54237 16.331 6.54237 16.5672 6.77279L17.4228 7.60723C17.6591 7.83765 17.6591 8.21124 17.4228 8.44168L10.4653 15.2272C10.229 15.4576 9.84595 15.4576 9.6097 15.2271Z" fill="#1EC28E"/>
                                </svg>
                                <svg class="mobile" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <circle cx="7" cy="7" r="6.5" fill="white" stroke="#1EC28E"/>
                                    <path d="M6.11526 9.69094L3.61276 7.25032C3.46241 7.10369 3.46241 6.86595 3.61276 6.71931L4.15722 6.1883C4.30756 6.04166 4.55135 6.04166 4.70169 6.1883L6.3875 7.83241L9.99831 4.3109C10.1487 4.16427 10.3924 4.16427 10.5428 4.3109L11.0872 4.84191C11.2376 4.98854 11.2376 5.22628 11.0872 5.37292L6.65974 9.69096C6.50938 9.83759 6.26561 9.83759 6.11526 9.69094Z" fill="#1EC28E"/>
                                </svg>
                                <span class="gmd-usp-text">Instant download</span>
                            </div>
                            <div class="gmd-btn-wrapper">
                                <div class="gmd-buy-now-btn">
                                    <button class="relative gmd-buy-now"><span>Buy Now</span></button>
                                </div>
                                <div class="gmd-add-to-cart-btn">
                                    <button class="relative"><span>Add to cart</span></button>
                                </div>
                                <a href="${link}" class="gmd-view-details-link">View details</a>
                            </div>
                            `)
                        })
                    }
                    loadReview(link, prod);

                }
            }
        }

        if (document.querySelector('.klevuWrap div[data-block-id="ku_landing_left_facets"] .kuFilters')) {
            document.body.classList.add('gmd-faceted-search');
        }
    }

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.gmd-add-to-cart-btn button');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const card = btn.closest('li.klevuProduct');
        if (!card) return;

        const productId = getProductId(card);
        const productUrl = card.querySelector('a')?.href;

        if (!productId) return;

        btn.classList.add('is-loading');
        btn.insertAdjacentHTML('afterbegin', `
            <div class="absolute inset-0 flex justify-center items-center loader">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" xml:space="preserve" width="32" height="32">
                    <path fill="#fff" d="M73 50c0-12.7-10.3-23-23-23S27 37.3 27 50m3.9 0c0-10.5 8.5-19.1 19.1-19.1S69.1 39.5 69.1 50">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
                    </path>
                </svg>
            </div>
        `)
        try {
            await addToCart(productId, productUrl);

            setTimeout(() => {
                openMiniCart();
            }, 300);

            btn.classList.remove('is-loading');
            btn.querySelector('.loader')?.remove();

        } catch (err) {
            console.error(err);
        }
    }, true);

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.gmd-buy-now-btn button');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const card = btn.closest('li.klevuProduct');
        if (!card) return;

        const productId = getProductId(card);
        const productUrl = card.querySelector('a')?.href;

        if (!productId) return;

        btn.classList.add('is-loading');
        btn.insertAdjacentHTML('afterbegin', `
            <div class="absolute inset-0 flex justify-center items-center loader">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" xml:space="preserve" width="32" height="32">
                    <path fill="#fff" d="M73 50c0-12.7-10.3-23-23-23S27 37.3 27 50m3.9 0c0-10.5 8.5-19.1 19.1-19.1S69.1 39.5 69.1 50">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
                    </path>
                </svg>
            </div>
        `)

        try {
            await addToCart(productId, productUrl);

            setTimeout(() => {
                openStripeModal();
            }, 400);

            // btn.classList.remove('is-loading');
            // btn.querySelector('.loader')?.remove();

        } catch (err) {
            console.error(err);
        } finally {
            // btn.classList.remove('is-loading');
        }

    }, true);

    waitForElement(".catalog-category-view .kuResults,.search-index-index .kuResults", ([]) => {
        document.querySelector('body').classList.add(testInfo.className);
        init();

        const observer = new MutationObserver(() => {
            setTimeout(() => {
                init();
            }, 500)
        });

        if (document.querySelector(".klevuLanding.klevuTarget")) {
            observer.observe(document.querySelector(".klevuLanding.klevuTarget"), {
                childList: true,
                subtree: true
            });
        }
    })
})();