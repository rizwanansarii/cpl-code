(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-carousel-and-ats',
        debug: 0,
        testName: 'T3 | Add carousel in hero section',
        testVersion: 'v1'
    };

    const carouselInfo = [
        {
            image: 'https://res.cloudinary.com/dcsohyepb/image/upload/v1768049766/desk-Banner_uiojlz.png',
            alt: 'skateboard',
        },
        {
            image: 'https://res.cloudinary.com/dnubjkv3c/image/upload/v1729513291/slide1_fwcwg7.png',
            alt: 'skateboard',
        },
        {
            image: 'https://res.cloudinary.com/dnubjkv3c/image/upload/v1729513290/slide2_nzj8jq.png',
            alt: 'skateboard',
        },
        {
            image: 'https://res.cloudinary.com/dnubjkv3c/image/upload/v1729513287/slide3_bul892.png',
            alt: 'skateboard',
        },
        {
            image: 'https://res.cloudinary.com/dnubjkv3c/image/upload/v1729513289/slide4_fniz35.png',
            alt: 'skateboard',
        }
    ]

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }
    function loadStyle(href) {
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            document.head.appendChild(link);
        });
    }

    waitForElement(".shopify-section", ([producPage]) => {
        if (location.pathname == '/') {
            document.querySelector('body').classList.add(testInfo.className);
            document.querySelector('.quizify').closest('section').classList.add('quiz-section');
            const heroCarousel = `
                <div class="carousel-section">
                    <div class="carousel-text-wrapper">
                        <h2>Generated test data</h2>
                        <a href="https://pf-dev-testing-tc.myshopify.com/collections" class="hero-btn">Shop Now</a>
                    </div>
                    <div class="container splide" id="splide">
                        <div class="carousel-wrapper swiper splide__track">
                            <ul class="swiper-wrapper splide__list">
                            </ul>
                        </div>
                    </div>
                </div>`
            document.querySelector('.gmd-carousel-and-ats .shopify-section .banner').insertAdjacentHTML('afterend', heroCarousel);

            let carouselSlide = '';
            carouselInfo.map((slide, index) => {
                carouselSlide = carouselSlide + `
                    <li class="carousel-card carousel-card-${index + 1} swiper-slide splide__slide" style="background-image: url(${slide.image})"></li>
                `
            })

            document.querySelector('.swiper-wrapper').innerHTML = carouselSlide;

            async function initSplide() {
                await loadStyle('https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css');
                await loadScript('https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js');

                new Splide('#splide', {
                    type: 'loop',
                    perPage: 1,
                    // autoplay: true,
                    pauseOnHover: true,
                    pagination: true,
                    arrows: false
                }).mount();
            }
            initSplide();
        }
    });

    waitForElement(".shopify-payment-button__button", ([producPage]) => {
        if (location.pathname.startsWith('/products/') && document.querySelector('.shopify-payment-button__button')) {
            document.querySelector('body').classList.add(testInfo.className);
            document.querySelector('.product__info-container .no-js-hidden .price').closest('.no-js-hidden').classList.add('price-wrapper');
            document.querySelector('.footer').classList.add('footer-section');

            const atsContent = {
                productName: document.querySelector('h1').innerHTML,
                price: document.querySelector('.price-wrapper').innerHTML
            }
            const buyNowButton = document.querySelector('.shopify-payment-button__button');
            if (buyNowButton) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (!entry.isIntersecting) {
                                document.querySelector('.sticky-ats-wrapper').classList.add('active')
                                const interval = setInterval(() => {
                                    if (document.querySelector('#launcher-wrapper')) {
                                        clearInterval(interval);
                                        document.querySelector('#launcher-wrapper').classList.add('on-product-page');
                                    }
                                }, 100);
                            } else {
                                document.querySelector('.sticky-ats-wrapper').classList.remove('active')
                                const interval = setInterval(() => {
                                    if (document.querySelector('#launcher-wrapper')) {
                                        clearInterval(interval);
                                        document.querySelector('#launcher-wrapper').classList.remove('on-product-page');
                                    }
                                }, 100);
                            }
                        });
                    },
                    {
                        threshold: 0, // triggers as soon as element enters/exits
                    }
                );

                observer.observe(buyNowButton);
            }
            document.querySelector('#MainContent').insertAdjacentHTML('afterbegin', `
                <div class="sticky-ats-wrapper">
                    <div class="text-wrapper">
                        <div class="product-info-wrapper">
                            <div class="product-name">${atsContent.productName}</div>
                            <div class="price">${atsContent.price}</div>
                        </div>
                        <div class="btn-wrapper"><button class="buy-now-btn">Buy Now</button></div>
                    </div>
                </div>`
            );

            document.querySelector('.buy-now-btn').addEventListener('click', () => {
                document.querySelector('.shopify-payment-button__button').click();
            })



        }
    });

    waitForElement(".cart-drawer", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);
        // side drawer
        const drawer = document.querySelector('.drawer');
        if (drawer) {
            updateDrawerContent();
            const observer = new MutationObserver(() => {
                updateDrawerContent();
            });

            observer.observe(drawer, { childList: true, subtree: true });
        }

        function updateDrawerContent() {

            if (document.querySelector('.totals__subtotal').innerHTML == 'Subtotal') {
                document.querySelector('.totals__subtotal').innerHTML = 'Total';
                const wrapper = document.createElement('div');
                wrapper.className = 'total-wrapper';
                document.querySelector('.totals__subtotal').parentNode.insertBefore(wrapper, document.querySelector('.totals__subtotal'));
                wrapper.appendChild(document.querySelector('.totals__subtotal'));
                document.querySelector('.totals__subtotal').insertAdjacentHTML('afterend', `<div class="shipping-tag">Free Shipping</div>`)
            }
        }
    });

})();