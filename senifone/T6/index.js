(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-06',
        debug: 0,
        testName: "T6 | Redesign PDP",
        testVersion: 'v1'
    };
    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function formatPrice(price) {
        // Format the price using Intl.NumberFormat
        return new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    }

    function parsePrice(el) {
        if (!el) return 0;
        return parseFloat(
            el.innerText.trim()
                .replace(/[^0-9,\.]/g, '')  // remove € and spaces
                .replace(',', '.')           // Dutch comma → dot
        );
    }

    let lang = document.querySelector("html").getAttribute("lang");

    const content = {
        nl: {
            recommendedLabel: `MEEST GEKOZEN`,
            adviceLabel: `Adviesprijs`,
            payIconLabel: `Veilig betalen met`,
            discountLabel: `Je bespaart`,
            btnColloapseLabel: `Bekijk meer`,
            btnExpandLabel: `Bekijk minder`,
            firstVariant: [`Geschikt voor basisgebruik:`, `bellen en af en toe een appje.`],
            secondVariant: [`Optimaal gebruik:`, `Ruimte voor al uw WhatsApp-berichten, foto's van de kleinkinderen, filmpjes en spelletjes. Sneller, soepeler en raakt niet snel vol.`]
        },
        de: {
            recommendedLabel: `MEIST AUSGEWÄHLT`,
            adviceLabel: `UVP`,
            payIconLabel: `Bezahlen Sie sicher mit`,
            discountLabel: `Du sparst`,
            btnColloapseLabel: `Mehr anzeigen`,
            btnExpandLabel: `Weniger anzeigen`,
            firstVariant: [`Geeignet für die grundlegende Nutzung:`, `telefonieren und gelegentlich eine App.`],
            secondVariant: [`Optimale Nutzung:`, `Platz für all Ihre WhatsApp-Nachrichten, Fotos der Enkelkinder, Filme und Spiele. Schneller, flüssiger und nicht so schnell voll.`]
        }
    };

    waitForElement('#shopify-section-announcement-bar', () => {
        document.body.classList.add(testInfo.className);

        if (!document.querySelector('.gmd-list')) {
            document.querySelector('.main-product-info .description').insertAdjacentHTML('afterend', `<ul class="gmd-list"></ul>`)
            const ul = document.querySelector('.gmd-list')
            document.querySelectorAll('.description p').forEach(p => {

                if (!p.innerHTML.includes('<br')) return;
                const items = p.innerHTML
                    .split(/<br\s*\/?>/i)
                    .map(item => item.trim())
                    .filter(Boolean);

                items.forEach(item => {
                    const cleaned = item.replace(/<strong[^>]*>.*?<\/strong>/gi, '').trim();

                    if (!cleaned || cleaned === '<br>' || !cleaned.replace(/<[^>]+>/g, '').trim()) return;

                    const li = document.createElement('li');
                    li.innerHTML = cleaned.replace(/^[\p{Emoji}\s]+/u, '').trim();
                    ul.appendChild(li);
                });
            });
        }

        if (!document.querySelector('.gmd-buy-now-wrapper')) {
            const price = document.querySelector('.main-product-info .price-container_new');
            const buyNowBtn = document.querySelector('.main-product-info .above-fold-button');

            document.querySelector('.main-product-info').insertAdjacentHTML('afterend', `<div class="gmd-buy-now-wrapper"></div>`);
            document.querySelector('.gmd-buy-now-wrapper').insertAdjacentElement('beforeend', price)
            document.querySelector('.gmd-buy-now-wrapper').insertAdjacentElement('beforeend', buyNowBtn)

            function savingAmount() {
                if (!document.querySelector('.gmd-savings')) {
                    const newPrice = document.querySelector('.gmd-buy-now-wrapper .price-container_new');
                    const currentPrice = newPrice.querySelector('.current-price');
                    const comparePrice = newPrice.querySelector('.was-price');

                    const current = parsePrice(currentPrice);
                    const compare = parsePrice(comparePrice);
                    const savings = compare - current;

                    price.querySelector('.price-area').insertAdjacentHTML('afterend', `
                        <div class="gmd-savings total-savings-pill">
                            <span class="total-savings-label">${content[lang].discountLabel}</span>
                            <span class="total-savings-amount theme-money">€${formatPrice(savings)}</span>
                        </div>`
                    );
                }
            }
            savingAmount();
            const target = document.querySelector('.variant-visibility-area')
            const observer = new MutationObserver(() => {
                savingAmount();
            })
            observer.observe(target, {
                childList: true,
                subtree: true
            })
        }

        if (!document.querySelector('.gmd-recommended-badge')) {
            const recommendedLabel = document.querySelector('.option-selector__btns .opt-label:last-child');
            document.querySelector('.option-selector__btns .opt-label:nth-of-type(1) .opt-label__description-text').insertAdjacentHTML('afterend', `<span class="gmd-description"><div class="gmd-bold-text">${content[lang].firstVariant[0]}</div>${content[lang].firstVariant[1]}</span>`)

            document.querySelector('.option-selector__btns .opt-label:nth-of-type(2)').insertAdjacentHTML('afterbegin', `<div class="gmd-recommended-badge">${content[lang].recommendedLabel}</div>`)
            document.querySelector('.option-selector__btns .opt-label:nth-of-type(2) .opt-label__description-text').insertAdjacentHTML('afterend', `<span class="gmd-description"><div class="gmd-bold-text">${content[lang].secondVariant[0]}</div>${content[lang].secondVariant[1]}</span>`)
        }

        waitForElement('.add-to-cart-holder .cart-secure-checkout', () => {
            if (document.querySelector('.add-to-cart-holder .cart-secure-checkout').nextElementSibling != document.querySelector('.add-to-cart-holder .usps')) {
                document.querySelector('.add-to-cart-holder .cart-secure-checkout').insertAdjacentElement('afterend', document.querySelector('.add-to-cart-holder .usps'))
                function calculateWasPrice() {
                    const newPrice = document.querySelector('.add-to-cart-holder');
                    const currentPrice = newPrice.querySelector('#total-amount');
                    const discountAmount = newPrice.querySelector('#total-savings-amount');

                    function parsePrice(el) {
                        if (!el) return 0;
                        return parseFloat(
                            el.innerText.trim()
                                .replace(/[^0-9,\.]/g, '')  // remove € and spaces
                                .replace(',', '.')           // Dutch comma → dot
                        );
                    }

                    const current = parsePrice(currentPrice);
                    const discount = parsePrice(discountAmount);
                    const wasPrice = discount + current;

                    if (!document.querySelector('.add-to-cart-holder .gmd-was-price-wrapper')) {
                        document.querySelector('.add-to-cart-holder .add-to-cart-summary').insertAdjacentHTML('beforebegin',
                            `<div class="gmd-was-price-wrapper">
                                <div class="gmd-advice-wrapper">
                                    <span class="gmd-advice">${content[lang].adviceLabel}</span>
                                    <span class="gmd-was-price">€${formatPrice(wasPrice)}</span>
                                    <div class="gmd-total-amount">${currentPrice.innerHTML}</div>
                                </div>
                                <div class="gmd-discount-wrapper">${content[lang].discountLabel} <span class="gmd-discount-amount">${discountAmount.innerHTML}<div>
                            </div>`
                        );
                        document.querySelector('.add-to-cart-holder .cart-secure-checkout h3').innerHTML = `${content[lang].payIconLabel}:`
                    } else {
                        document.querySelector('.add-to-cart-holder .gmd-was-price').innerHTML = `€` + formatPrice(wasPrice)
                        document.querySelector('.gmd-total-amount').innerHTML = currentPrice.innerHTML
                        document.querySelector('.gmd-discount-wrapper .gmd-discount-amount').innerHTML = discountAmount.innerHTML
                    }
                }
                calculateWasPrice();
                const observer = new MutationObserver(() => {
                    calculateWasPrice();
                })
                observer.observe(document.querySelector('.add-to-cart-summary'), {
                    childList: true,
                    subtree: true
                })
            }
        })


        if (!document.querySelector('.gmd-image')) {
            const section = document.querySelector('.image-text-container').closest('.shopify-section');
            section.classList.add('gmd-section-parent')
            const showcase = document.querySelector('.showcase-block');
            showcase.classList.add('gmd-section-parent')
            section.querySelector('img').insertAdjacentHTML('afterend', `
                <picture>
                        <source media="(min-width:768px)" srcset="https://images.varify.io/f3e9b66b032f11dc7de6f267187a834ce7652966722a7eef2507231b99ba37f3/een_telefoon_die_wel_te_begrijpen_is.png">
                        <img class="gmd-image" src="https://images.varify.io/790c7d689ef2b55c8eefa2808ccf7c0bfa8be286512fff09d5ababfefab29538/een_telefoon_die_wel_te_begrijpen_is_mob.png" alt="hero-image" />
                    </picture>
                `)
            showcase.querySelector('.showcase-image img').insertAdjacentHTML('afterend', `<img src="https://images.varify.io/5a41e94d38ce167371ab90e7a0927a767db367ce3e358f3cdc801ce90e66b775/duidelijk_comfortabel_en_ontspannen_kijken.png" class="gmd-image" />`)
            const sections = document.querySelectorAll('.image-text-container');
            sections.forEach((section) => {
                const sectionParent = section.closest('.shopify-section')
                if (!sectionParent.querySelector('.gmd-image')) {
                    if (sectionParent.querySelector('.image-right')) {
                        sectionParent.querySelector('.image-text-container').classList.remove('image-right')
                        sectionParent.querySelector('.image-text-container').classList.add('image-left')
                    } else if (sectionParent.querySelector('.image-left')) {
                        sectionParent.querySelector('.image-text-container').classList.remove('image-left')
                        sectionParent.querySelector('.image-text-container').classList.add('image-right')
                    }
                }
            })
        }

        if (!document.querySelector('.gmd-specs-toggle-btn')) {
            const rows = document.querySelectorAll('.senifone-specs__rows .senifone-specs__row');
            let visible = 0;
            let expanded = false;

            document.querySelector('.senifone-specs__rows').insertAdjacentHTML(
                'afterend',
                `<button class="gmd-specs-toggle-btn">${content[lang].btnColloapseLabel}</button>`
            );

            const btn = document.querySelector('.gmd-specs-toggle-btn');

            btn.addEventListener('click', () => {
                expanded = !expanded;

                rows.forEach((row, i) => {
                    if (i >= visible) {
                        row.style.display = expanded ? '' : 'none';
                    }
                });

                btn.textContent = expanded ? content[lang].btnExpandLabel : content[lang].btnColloapseLabel;
            });

            function viewDisplay() {
                visible = window.innerWidth > 768 ? 8 : 5;

                if (!expanded) {
                    rows.forEach((row, i) => {
                        row.style.display = i >= visible ? 'none' : '';
                    });
                }
            }

            window.addEventListener('resize', viewDisplay);
            viewDisplay();
        }
    });

})();
