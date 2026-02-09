(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-popup',
        debug: 0,
        testName: 'T8 | Add Popup',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement(".catalog-product-view", ([producPage]) => {
        document.querySelector('body').classList.add(testInfo.className);

        function showPopup() {
            const productFieldsDesk = document.querySelectorAll(".product-main-info .form-select")
            const productFieldsMob = document.querySelectorAll(".product-options-mobile")
            const personInfoField = document.querySelectorAll(".product-options-wrapper .form-input")
            const productImage = document.querySelector(".product-media img[itemprop]").src;
            const productHeading = document.querySelector(".product-info-main .page-title").innerText;
            let productSize;
            let socksAddOn;
            let name;
            let raceNumber;
            console.log(productFieldsDesk, 'productFieldsDesk')
            if (productFieldsDesk.length) {
                productSize = document.querySelector(".product-main-info .form-select").selectedOptions[0].innerText
                socksAddOn = productFieldsDesk.length > 1 ? document.querySelectorAll(".product-main-info .form-select")[1].selectedOptions[0].innerText : null;
            }
            console.log(productFieldsMob, 'productFieldsMob')
            if (productFieldsMob.length) {
                const selectedSize = document.querySelectorAll(".product-options-mobile")[0].querySelector('.field input:checked');
                if (selectedSize) productSize = selectedSize.closest('.field').closest('.field').querySelector('label').innerText;
                if (productFieldsMob.length > 1) {
                    const selectedSocks = document.querySelectorAll(".product-options-mobile")[2].querySelector('.field input:checked')
                    socksAddOn = '';
                    if (selectedSocks) socksAddOn = selectedSocks.closest('.field').closest('.field').querySelector('label').innerText;
                }
            }
            if (personInfoField.length) {
                console.log('------')
                name = personInfoField[0].value;
                raceNumber = personInfoField[1].value;
            }
            const productPrice = document.querySelector(".product-main-info .final-price .price").innerText;

            if (!document.querySelector('.custom-popup-main')) {
                document.querySelector('body').classList.add('overflow-hidden')
                document.querySelector('body').insertAdjacentHTML('beforeend', `
                    <div class="custom-popup-main show-popup">
                        <div class="custom-popup-inner">
                            <div class="custom-popup-wrapper">
                                <div class="wrapper-container">
                                    <div class="heading-wrapper">
                                        <h5>Toegevoegd aan je winkelwagen</h5>
                                        <div class="close-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M7.07139 19.5L5.67139 18.1L11.2714 12.5L5.67139 6.9L7.07139 5.5L12.6714 11.1L18.2714 5.5L19.6714 6.9L14.0714 12.5L19.6714 18.1L18.2714 19.5L12.6714 13.9L7.07139 19.5Z" fill="#4B5563"/></svg>
                                        </div>
                                    </div>
                                    <div class="content-wrapper">
                                        <div class="product-image-wrapper">
                                            <img src="${productImage}" alt="Product Image">
                                        </div>
                                        <div class="product-info-wrapper">
                                            <h4 class="product-title">${productHeading}</h4>
                                            <div class="product-size-wrapper">
                                                <div class="size-wrapper"><span class="title">Maat</span><span class="value">${productSize}</span></div>
                                                ${socksAddOn || productFieldsMob.length > 1 ? `<div class="socks-wrapper"><span class="title">Sokken</span><span class="value">${productFieldsMob.length > 1 || document.querySelectorAll(".product-main-info .form-select")[1]?.value ? socksAddOn : ""}</span></div>` : ''}
                                                ${personInfoField.length ? `<div class="name-wrapper"><span class="title">Naam</span><span class="value"> ${name}</span></div>` : ''}
                                                ${personInfoField.length ? `<div class="number-wrapper"><span class="title">Rugnummer</span><span class="value"> ${raceNumber}</span></div>` : ''}
                                            </div>
                                            <div class="price-wrapper">
                                                <span>${productPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="action-wrapper">
                                        <div class="continue-shopping">
                                            <span>Verder winkelen</span>
                                        </div>
                                        <div class="shopping-cart">
                                            <a href="https://www.voetbalshirtskoning.nl/checkout/cart">Naar winkelwagen</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `);

                document.querySelector('.close-btn').addEventListener('click', () => {
                    document.querySelector('body').classList.remove('overflow-hidden')
                    document.querySelector('.custom-popup-main').classList.remove('show-popup');
                })
                document.querySelector('.continue-shopping').addEventListener('click', () => {
                    document.querySelector('body').classList.remove('overflow-hidden')
                    document.querySelector('.custom-popup-main').classList.remove('show-popup');
                })
            } else {
                document.querySelector('.custom-popup-main .product-size-wrapper .size-wrapper .value').innerHTML = productSize
                if (document.querySelector('.custom-popup-main .product-size-wrapper .socks-wrapper')) {
                    document.querySelector('.custom-popup-main .product-size-wrapper .socks-wrapper .value').innerHTML = socksAddOn
                }
                if (document.querySelector('.custom-popup-main .product-size-wrapper .name-wrapper') && document.querySelector('.custom-popup-main .product-size-wrapper .number-wrapper')) {
                    document.querySelector('.custom-popup-main .product-size-wrapper .name-wrapper .value').innerHTML = name
                    document.querySelector('.custom-popup-main .product-size-wrapper .number-wrapper .value').innerHTML = raceNumber
                }
                document.querySelector('.custom-popup-main .price-wrapper span').innerHTML = productPrice
                document.querySelector('body').classList.add('overflow-hidden')
                document.querySelector('.custom-popup-main').classList.add('show-popup');
            }
        }

        function addToCart() {
            const api = document.querySelector("#product_addtocart_form").getAttribute("action");
            const formKey = document.querySelector("#product_addtocart_form input[name='form_key']").getAttribute("value");
            const prodId = document.querySelector("#product_addtocart_form input[name='product']").getAttribute("value");
            const formData = new FormData();
            formData.append("product", prodId);
            formData.append("selected_configurable_option", "");
            formData.append("related_product", "");
            formData.append("item", prodId);
            formData.append("form_key", formKey);
            if (document.querySelector("#product_addtocart_form .form-select.super-attribute-select")) {
                formData.append(document.querySelector("#product_addtocart_form .form-select.super-attribute-select").getAttribute("name"), document.querySelector("#product_addtocart_form .form-select.super-attribute-select").value)
            } else if (document.querySelectorAll(".product-main-info .form-select").length) {
                document.querySelectorAll(".product-main-info .form-select").forEach((e) => {
                    formData.append(e.getAttribute("name"), e.value)
                });
            } else if (document.querySelectorAll(".product-options-mobile .field").length) {
                document.querySelectorAll(".product-options-mobile .field input:checked").forEach((e) => {
                    formData.append(e.getAttribute("name"), e.value)
                });
            }
            if (document.querySelectorAll(".product-options-wrapper .form-input").length) {
                document.querySelectorAll(".product-options-wrapper .form-input").forEach((e) => {
                    formData.append(e.getAttribute("name"), e.value)
                });
            }
            formData.append("qty", 1);
            setTimeout(() => {
                try {
                    const response = fetch(api, {
                        method: 'POST',
                        headers: { 'X-Requested-With': 'XMLHttpRequest' },
                        body: formData,
                    }).then((response) => {
                        console.log("response", response)
                        showPopup();
                    })
                        // .then(data => {

                        //     console.log("data", data)
                        // })
                        .catch(error => console.error(error));
                    // If the request is successful, reload the cart data.
                    // if (response.ok) {
                    //     require('Magento_Customer/js/customer-data').reload(['cart']);
                    // }
                } catch (error) {
                    console.error('Error:', error);
                }
            }, 700);
        }
        document.querySelector('.product-addtocart-button').addEventListener('click', (e) => {
            const productFieldsDesk = document.querySelectorAll(".product-main-info .form-select")
            const productFieldsMob = document.querySelectorAll(".product-options-mobile")
            let hasEmptyRequiredField = true;
            if (productFieldsDesk.length) hasEmptyRequiredField = Array.from(document.querySelectorAll(".product-main-info .form-select")).some(field => field.required && !field.value);
            if (productFieldsMob.length) hasEmptyRequiredField = document.querySelectorAll(".product-options-mobile")[0].querySelector('.field input:checked') ? false : true;
            console.log(productFieldsDesk, productFieldsMob)
            console.log(hasEmptyRequiredField, 'hasEmptyRequiredField');
            if (!hasEmptyRequiredField) {
                e.preventDefault();
                addToCart();
            }
        })

    });
})();