(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-07',
        debug: 0,
        testName: 'T7 | Formulier op Secundair CTA-blok',
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function isFormValid() {
        const wrapper = document.querySelector('.gmd-new-fields-wrapper');
        if (!wrapper) return false;

        const fields = ['postcode', 'huisnummer'];

        return fields.every(name => {
            const field = wrapper.querySelector(`input[name="${name}"]`);
            const error = field?.closest('.form-floating')?.parentElement?.querySelector('.invalid-feedback');

            return field && error && field.value && !error.classList.contains('d-block');
        });
    }

    let isValidationBound = false;
    let isFormLoaded = false;
    function bindFieldValidation() {
        waitForElement('form', () => {
            if (isValidationBound) return;
            isValidationBound = true;

            const modal = document.querySelector('form > .planning__postcode');
            const wrapper = document.querySelector('.gmd-new-fields-wrapper');

            if (!modal || !wrapper) return;

            const fields = ['postcode', 'huisnummer', 'toevoeging'];

            fields.forEach(name => {
                const source = wrapper.querySelector(`input[name="${name}"]`);
                const target = modal.querySelector(`input[name="${name}"]`);
                // if (!source || !target) return;

                source.addEventListener('input', () => {
                    if (!modal.querySelector(`input[name="${name}"]`)) {
                        const editBtn = document.querySelector('.planning__edit');
                        editBtn.click();
                        isValidationBound = false;
                        isFormLoaded = false;
                    }
                    waitForElement('form > .planning__postcode input', () => {
                        if (modal.querySelector(`input[name="${name}"]`).value !== source.value) {
                            modal.querySelector(`input[name="${name}"]`).value = source.value;
                            modal.querySelector(`input[name="${name}"]`).dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        clearError(source);
                    })
                });

                source.addEventListener('blur', () => {
                    const btn = document.querySelector('form > .planning__postcode .planning__search');
                    if (btn) {
                        modal.querySelector(`input[name="${name}"]`).dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                    setTimeout(() => {
                        syncError(target, source);
                        if (isFormValid() && btn) {
                            if (btn) btn.dispatchEvent(new Event('click', { bubbles: true }));
                        }
                    }, 100);
                });
            });
        })
    }

    function syncError(from, to) {
        const fromError = from.closest('.form-floating')?.parentElement?.querySelector('.invalid-feedback');
        const toError = to.closest('.form-floating')?.parentElement?.querySelector('.invalid-feedback');
        if (!fromError || !toError) return;

        if (fromError.classList.contains('d-block')) {
            to.classList.add('is-invalid');
            toError.innerHTML = fromError.innerHTML;
            toError.classList.add('d-block');
        } else {
            to.classList.remove('is-invalid');
            toError.classList.remove('d-block');
        }
    }

    function clearError(input) {
        const error = input.closest('.form-floating')?.parentElement?.querySelector('.invalid-feedback');

        if (error) {
            input.classList.remove('is-invalid');
            error.classList.remove('d-block');
        }
    }

    function checklocation() {
        const btn = document.querySelector('form > .planning__postcode .planning__search');
        if (btn) {
            document.querySelector('.dummy').classList.add('d-block')
            bindFieldValidation();
        } else {
            document.querySelector('.dummy').classList.remove('d-block')
            loadVersionForm();
        }
    }

    function loadVersionForm() {
        if (isFormLoaded) return;
        isFormLoaded = true;
        waitForElement('.planning-modal__inner', () => {
            waitForElement('form > .planning__section .days__item--pick', () => {

                const datePickerGrid = document.querySelector('form > .planning__section .datepicker')
                if (!datePickerGrid) {
                    const datePicker = document.querySelector('form > .planning__section .days__item--pick');
                    if (datePicker) datePicker.click();
                }
            })
            waitForElement('form > div > .datepicker .datepicker__header .button--outline svg', () => {
                const monthChangeBtn = document.querySelectorAll('form > div > .datepicker .datepicker__header .button--outline')
                if (!document.querySelector('form > div > .datepicker .datepicker__header .button--outline .gmd-new-svg')) {
                    monthChangeBtn[0].innerHTML = `
                            <svg class="gmd-new-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M9.44445 6.11108H5.2278L7.06112 4.28333C7.16573 4.17872 7.22451 4.03683 7.22451 3.88888C7.22451 3.74094 7.16573 3.59905 7.06112 3.49444C6.95651 3.38983 6.81462 3.33105 6.66667 3.33105C6.51873 3.33105 6.37684 3.38983 6.27223 3.49444L3.49446 6.27219C3.44388 6.32503 3.40423 6.38736 3.3778 6.45553C3.32223 6.5908 3.32223 6.74253 3.3778 6.87775C3.40423 6.94597 3.44388 7.00825 3.49446 7.06108L6.27223 9.83886C6.3239 9.89097 6.38534 9.9323 6.45301 9.96047C6.52073 9.98869 6.59334 10.0032 6.66667 10.0032C6.74001 10.0032 6.81262 9.98869 6.88034 9.96047C6.94806 9.9323 7.00951 9.89097 7.06112 9.83886C7.11317 9.78725 7.15451 9.7258 7.18273 9.65808C7.21095 9.59042 7.22545 9.51781 7.22545 9.44442C7.22545 9.37108 7.21095 9.29847 7.18273 9.2308C7.15451 9.16308 7.11317 9.10164 7.06112 9.04997L5.2278 7.22219H9.44445C9.59178 7.22219 9.73312 7.16369 9.83728 7.05947C9.94151 6.9553 10 6.81403 10 6.66664C10 6.5193 9.94151 6.37803 9.83728 6.2738C9.73312 6.16964 9.59178 6.11108 9.44445 6.11108Z" fill="white"/>
                            </svg>`;
                    monthChangeBtn[1].innerHTML = `
                            <svg class="gmd-new-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M9.95547 6.45553C9.92903 6.38736 9.88936 6.32503 9.83881 6.27219L7.06103 3.49444C7.00925 3.44264 6.94775 3.40155 6.88003 3.37352C6.81236 3.34548 6.73986 3.33105 6.66659 3.33105C6.51864 3.33105 6.37675 3.38983 6.27214 3.49444C6.22036 3.54624 6.17925 3.60773 6.1512 3.67541C6.1232 3.74309 6.10875 3.81563 6.10875 3.88888C6.10875 4.03683 6.16753 4.17872 6.27214 4.28333L8.10547 6.11108H3.88881C3.74146 6.11108 3.60016 6.16964 3.49597 6.2738C3.39179 6.37803 3.33325 6.5193 3.33325 6.66664C3.33325 6.81403 3.39179 6.9553 3.49597 7.05947C3.60016 7.16369 3.74146 7.22219 3.88881 7.22219H8.10547L6.27214 9.04997C6.22009 9.10164 6.17875 9.16308 6.15053 9.2308C6.12231 9.29847 6.10781 9.37108 6.10781 9.44442C6.10781 9.51781 6.12231 9.59042 6.15053 9.65808C6.17875 9.7258 6.22009 9.78725 6.27214 9.83886C6.32381 9.89097 6.38525 9.9323 6.45292 9.96047C6.52064 9.98869 6.59325 10.0032 6.66659 10.0032C6.73992 10.0032 6.81253 9.98869 6.88025 9.96047C6.94792 9.9323 7.00936 9.89097 7.06103 9.83886L9.83881 7.06108C9.88936 7.00825 9.92903 6.94597 9.95547 6.87775C10.011 6.74253 10.011 6.5908 9.95547 6.45553Z" fill="white"/>
                            </svg>`;
                }
            })

            waitForElement('form > .planning__section .planning__betaling-optie', () => {
                document.querySelector('form > .planning__section .planning__betaling-optie:not(:has(.planning__betaling-korting))')?.click();
            });

            waitForElement('form > .planning__section .planning__submit', () => {
                document.querySelector('form > .planning__section .planning__submit').addEventListener('click', () => {
                    waitForElement('.thankyou__buttons', () => {
                        document.querySelector('.thankyou__buttons button').addEventListener('click', () => {
                            loadTest();
                        })
                    })
                })
            })
        });
    }

    function loadTest() {
        waitForElement(".hero-new__cta-wrapper .form__button", ([]) => {
            isValidationBound = false;
            isFormLoaded = false;
            document.querySelector('body').classList.add(testInfo.className);

            setTimeout(() => {
                window.dispatchEvent(
                    new CustomEvent('open-planning-modal', {
                        detail: { postcode: '', huisnummer: '', toevoeging: '' }
                    })
                );
            }, 200)


            waitForElement('.planning-modal .planning-modal__inner form', () => {
                const modal = document.querySelector('.planning-modal');
                const fieldWrapper = modal.querySelector('.planning__postcode');
                const cloneField = fieldWrapper.cloneNode(true);

                if (!document.querySelector('.gmd-new-fields-wrapper')) {
                    fieldWrapper.insertAdjacentHTML('afterend', `<div class="gmd-new-fields-wrapper"></div>`)
                    document.querySelector('.gmd-new-fields-wrapper').insertAdjacentElement('afterbegin', cloneField);
                    document.querySelector('.planning > form').insertAdjacentHTML('beforeend', `<div class="dummy d-block">
                        <form novalidate="">
                            <div class="planning__postcode">
                                <div class="form-flex planning__postcode-nummer">
                                    <div class="form-flex__40-50">
                                        <div class="form-floating"><input name="postcode" class="form-control" placeholder=" " disabled><label
                                                for="postcode">Postcode</label></div>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                    <div class="form-flex__30-25">
                                        <div class="form-floating"><input name="huisnummer" type="number" class="form-control" placeholder=" "
                                                min="1" max="99999" disabled><label for="huisnummer">Huisnr.</label></div>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                    <div class="form-flex__30-25">
                                        <div class="form-floating"><input name="toevoeging" class="form-control" placeholder=" " disabled><label
                                                for="toevoeging">Toev.</label></div>
                                    </div>
                                </div><button class="planning__search button button--brand"><span>Zoek adres</span></button><!---->
                            </div>
                            <div class="planning__section">
                                <h3 class="planning__subtitle">Kies een dag</h3>
                                <div class="days" data-gtm-vis-recent-on-screen39676372_30="9469" data-gtm-vis-first-on-screen39676372_30="9469"
                                    data-gtm-vis-total-visible-time39676372_30="100" data-gtm-vis-has-fired39676372_30="1"><button type="button"
                                        class="days__item">
                                        <div class="tag tag--small tag--warning">Bijna vol</div>
                                        <div class="days__day">dinsdag</div>
                                        <div class="days__date">7 april</div>
                                    </button><button type="button" class="days__item">
                                        <div class="tag tag--small tag--warning">Bijna vol</div>
                                        <div class="days__day">donderdag</div>
                                        <div class="days__date">9 april</div>
                                    </button><button type="button" class="days__item">
                                        <div class="tag tag--small tag--success tag--outline">Beschikbaar</div>
                                        <div class="days__day">maandag</div>
                                        <div class="days__date">13 april</div>
                                    </button><button type="button" class="days__item">
                                        <div class="tag tag--small tag--success tag--outline">Beschikbaar</div>
                                        <div class="days__day">dinsdag</div>
                                        <div class="days__date">14 april</div>
                                    </button><button type="button" class="days__item">
                                        <div class="tag tag--small tag--success tag--outline">Beschikbaar</div>
                                        <div class="days__day">donderdag</div>
                                        <div class="days__date">16 april</div>
                                    </button><button type="button" class="days__item">
                                        <div class="tag tag--small tag--success tag--outline">Beschikbaar</div>
                                        <div class="days__day">vrijdag</div>
                                        <div class="days__date">17 april</div>
                                    </button><button type="button" class="days__item">
                                        <div class="tag tag--small tag--success tag--outline">Beschikbaar</div>
                                        <div class="days__day">maandag</div>
                                        <div class="days__date">20 april</div>
                                    </button><button type="button" class="days__item days__item--pick">
                                        <div data-v-fff94d59=""><svg width="24" height="24" viewBox="0 0 24 24" fill="black"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M19 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V12H20V19ZM20 10H4V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V10Z">
                                                </path>
                                            </svg>
                                        </div>
                                        <div class="days__day">Bekijk agenda</div>
                                        <div class="days__date">Kies jouw datum</div>
                                    </button></div>
                            </div>
                            <div>
                                <div class="datepicker">
                                    <div class="datepicker__header">
                                        <h3 class="datepicker__title">April 2026</h3><button type="button"
                                            class="button button--icon button--small button--outline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M9.44445 6.11108H5.2278L7.06112 4.28333C7.16573 4.17872 7.22451 4.03683 7.22451 3.88888C7.22451 3.74094 7.16573 3.59905 7.06112 3.49444C6.95651 3.38983 6.81462 3.33105 6.66667 3.33105C6.51873 3.33105 6.37684 3.38983 6.27223 3.49444L3.49446 6.27219C3.44388 6.32503 3.40423 6.38736 3.3778 6.45553C3.32223 6.5908 3.32223 6.74253 3.3778 6.87775C3.40423 6.94597 3.44388 7.00825 3.49446 7.06108L6.27223 9.83886C6.3239 9.89097 6.38534 9.9323 6.45301 9.96047C6.52073 9.98869 6.59334 10.0032 6.66667 10.0032C6.74001 10.0032 6.81262 9.98869 6.88034 9.96047C6.94806 9.9323 7.00951 9.89097 7.06112 9.83886C7.11317 9.78725 7.15451 9.7258 7.18273 9.65808C7.21095 9.59042 7.22545 9.51781 7.22545 9.44442C7.22545 9.37108 7.21095 9.29847 7.18273 9.2308C7.15451 9.16308 7.11317 9.10164 7.06112 9.04997L5.2278 7.22219H9.44445C9.59178 7.22219 9.73312 7.16369 9.83728 7.05947C9.94151 6.9553 10 6.81403 10 6.66664C10 6.5193 9.94151 6.37803 9.83728 6.2738C9.73312 6.16964 9.59178 6.11108 9.44445 6.11108Z" fill="white"/>
                                            </svg></button><button type="button" class="button button--icon button--small button--outline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M9.95547 6.45553C9.92903 6.38736 9.88936 6.32503 9.83881 6.27219L7.06103 3.49444C7.00925 3.44264 6.94775 3.40155 6.88003 3.37352C6.81236 3.34548 6.73986 3.33105 6.66659 3.33105C6.51864 3.33105 6.37675 3.38983 6.27214 3.49444C6.22036 3.54624 6.17925 3.60773 6.1512 3.67541C6.1232 3.74309 6.10875 3.81563 6.10875 3.88888C6.10875 4.03683 6.16753 4.17872 6.27214 4.28333L8.10547 6.11108H3.88881C3.74146 6.11108 3.60016 6.16964 3.49597 6.2738C3.39179 6.37803 3.33325 6.5193 3.33325 6.66664C3.33325 6.81403 3.39179 6.9553 3.49597 7.05947C3.60016 7.16369 3.74146 7.22219 3.88881 7.22219H8.10547L6.27214 9.04997C6.22009 9.10164 6.17875 9.16308 6.15053 9.2308C6.12231 9.29847 6.10781 9.37108 6.10781 9.44442C6.10781 9.51781 6.12231 9.59042 6.15053 9.65808C6.17875 9.7258 6.22009 9.78725 6.27214 9.83886C6.32381 9.89097 6.38525 9.9323 6.45292 9.96047C6.52064 9.98869 6.59325 10.0032 6.66659 10.0032C6.73992 10.0032 6.81253 9.98869 6.88025 9.96047C6.94792 9.9323 7.00936 9.89097 7.06103 9.83886L9.83881 7.06108C9.88936 7.00825 9.92903 6.94597 9.95547 6.87775C10.011 6.74253 10.011 6.5908 9.95547 6.45553Z" fill="white"/>
                                            </svg></button>
                                    </div>
                                    <div class="datepicker__weekdays">
                                        <div>Ma</div>
                                        <div>Di</div>
                                        <div>Wo</div>
                                        <div>Do</div>
                                        <div>Vr</div>
                                        <div>Za</div>
                                        <div>Zo</div>
                                    </div>
                                    <div class="datepicker__grid">
                                        <div class="datepicker__day available selected placeholder"></div>
                                        <div class="datepicker__day available selected placeholder"></div>
                                        <div class="datepicker__day available">1</div>
                                        <div class="datepicker__day available">2</div>
                                        <div class="datepicker__day available">3</div>
                                        <div class="datepicker__day available">4</div>
                                        <div class="datepicker__day available">5</div>
                                        <div class="datepicker__day available">6</div>
                                        <div class="datepicker__day available">7</div>
                                        <div class="datepicker__day available">8</div>
                                        <div class="datepicker__day available">9</div>
                                        <div class="datepicker__day available">10</div>
                                        <div class="datepicker__day available">11</div>
                                        <div class="datepicker__day available">12</div>
                                        <div class="datepicker__day available">13</div>
                                        <div class="datepicker__day available">14</div>
                                        <div class="datepicker__day available">15</div>
                                        <div class="datepicker__day available">16</div>
                                        <div class="datepicker__day available">17</div>
                                        <div class="datepicker__day available">18</div>
                                        <div class="datepicker__day available">19</div>
                                        <div class="datepicker__day available">20</div>
                                        <div class="datepicker__day available">21</div>
                                        <div class="datepicker__day available">22</div>
                                        <div class="datepicker__day available">23</div>
                                        <div class="datepicker__day available">24</div>
                                        <div class="datepicker__day available">25</div>
                                        <div class="datepicker__day available">26</div>
                                        <div class="datepicker__day available">27</div>
                                        <div class="datepicker__day available">28</div>
                                        <div class="datepicker__day available">29</div>
                                        <div class="datepicker__day available">30</div>
                                    </div>
                                </div>
                            </div>
                            <div class="planning__section">
                                <h3 class="planning__subtitle">Welke tijd?</h3>
                                <div class="timeslots"><button type="button" class="timeslots__item">09:00</button><button type="button"
                                        class="timeslots__item">10:30</button><button type="button"
                                        class="timeslots__item">12:00</button><button type="button"
                                        class="timeslots__item">13:30</button><button type="button"
                                        class="timeslots__item">15:00</button><button type="button"
                                        class="timeslots__item">16:30</button><button type="button"
                                        class="timeslots__item">18:00</button><button type="button" class="timeslots__item">19:30</button></div>
                            </div><!----><!---->
                            <div class="planning__section">
                                <div class="planning__spoed">
                                    <div class="planning__spoed-toggle form-check form-switch"><input class="form-check-input" type="checkbox"
                                            role="switch" id="spoed" disabled><label class="form-check-label" for="spoed"><span
                                                class="planning__spoed-title"><strong>Je rijbewijs in 30 dagen?</strong><button type="button"
                                                    class="planning__spoed-tooltip info-button">
                                                    <div data-v-fff94d59=""><svg width="24" height="24" viewBox="0 0 24 24" fill="black"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M11.29 15.29C11.247 15.3375 11.2069 15.3876 11.17 15.44C11.1322 15.4957 11.1019 15.5563 11.08 15.62C11.0512 15.6767 11.031 15.7374 11.02 15.8C11.0151 15.8666 11.0151 15.9334 11.02 16C11.0166 16.1312 11.044 16.2613 11.1 16.38C11.1449 16.5041 11.2166 16.6168 11.3099 16.7101C11.4032 16.8034 11.5159 16.8751 11.64 16.92C11.7597 16.9729 11.8891 17.0002 12.02 17.0002C12.1509 17.0002 12.2803 16.9729 12.4 16.92C12.5241 16.8751 12.6368 16.8034 12.7301 16.7101C12.8234 16.6168 12.8951 16.5041 12.94 16.38C12.9844 16.2584 13.0048 16.1294 13 16C13.0008 15.8684 12.9755 15.7379 12.9258 15.6161C12.876 15.4943 12.8027 15.3834 12.71 15.29C12.617 15.1963 12.5064 15.1219 12.3846 15.0711C12.2627 15.0203 12.132 14.9942 12 14.9942C11.868 14.9942 11.7373 15.0203 11.6154 15.0711C11.4936 15.1219 11.383 15.1963 11.29 15.29ZM12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20V20ZM12 7C11.4731 6.99966 10.9553 7.13812 10.4989 7.40144C10.0425 7.66476 9.66347 8.04366 9.4 8.5C9.32765 8.61382 9.27907 8.7411 9.25718 8.87418C9.23529 9.00726 9.24055 9.14339 9.27263 9.27439C9.30472 9.40538 9.36297 9.52854 9.44389 9.63643C9.5248 9.74433 9.62671 9.83475 9.74348 9.90224C9.86024 9.96974 9.98945 10.0129 10.1233 10.0292C10.2572 10.0454 10.393 10.0345 10.5225 9.99688C10.6521 9.9593 10.7727 9.89591 10.8771 9.81052C10.9814 9.72513 11.0675 9.61951 11.13 9.5C11.2181 9.3474 11.345 9.22078 11.4978 9.13298C11.6505 9.04518 11.8238 8.9993 12 9C12.2652 9 12.5196 9.10536 12.7071 9.29289C12.8946 9.48043 13 9.73478 13 10C13 10.2652 12.8946 10.5196 12.7071 10.7071C12.5196 10.8946 12.2652 11 12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12V13C11 13.2652 11.1054 13.5196 11.2929 13.7071C11.4804 13.8946 11.7348 14 12 14C12.2652 14 12.5196 13.8946 12.7071 13.7071C12.8946 13.5196 13 13.2652 13 13V12.82C13.6614 12.58 14.2174 12.1152 14.5708 11.5069C14.9242 10.8985 15.0525 10.1853 14.9334 9.49189C14.8143 8.79849 14.4552 8.16902 13.919 7.71352C13.3828 7.25801 12.7035 7.00546 12 7V7Z">
                                                            </path>
                                                        </svg>
                                                    </div><!---->
                                                </button></span><span>Kies voor een spoedcursus, om zo snel mogelijk je rijbewijs te
                                                halen!</span></label></div>
                                </div>
                                <h3 class="planning__subtitle">Jouw gegevens</h3>
                                <div class="form-flex">
                                    <div class="form-flex__100-50">
                                        <div class="form-floating"><input name="voornaam" type="text" class="form-control"
                                                placeholder=" " disabled><label for="voornaam">Voornaam</label></div>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                    <div class="form-flex__100-50">
                                        <div class="form-floating"><input name="achternaam" type="text" class="form-control"
                                                placeholder=" " disabled><label for="achternaam">Achternaam</label></div>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                    <div class="form-flex__100-50">
                                        <div class="form-floating"><input name="email" type="email" class="form-control" placeholder=" " disabled><label
                                                for="email">E-mailadres</label></div>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                    <div class="form-flex__100-50">
                                        <div class="form-floating"><input name="telefoonnummer" type="tel" class="form-control"
                                                placeholder=" " disabled><label for="telefoonnummer">Telefoonnummer</label></div>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                                <h3 class="planning__label">Hoe wil je je plek reserveren?</h3>
                                <p class="planning__betaling-info" style="margin-bottom: 0.75rem;"> Je proefles kost €50,- Ga je
                                    na je proefles verder met rijlessen? Dan krijg je dit bedrag volledig terug als korting op jouw lespakket.
                                    Je proefles is dus eigenlijk gratis! </p>
                                <div class="planning__betaling"><button type="button" class="planning__betaling-optie"><strong
                                            class="planning__betaling-label">Online betalen <span
                                                class="planning__betaling-prijs">€45,-</span></strong><span
                                            class="tag tag--small planning__betaling-korting">€5 korting!</span></button><button type="button"
                                        class="planning__betaling-optie planning__betaling-optie--active"><strong class="planning__betaling-label">Betaal in de auto <span
                                                class="planning__betaling-prijs">€50,-</span></strong></button></div><!---->
                                <ul class="planning__usps">
                                    <li>Start nu, betaal achteraf</li>
                                    <li>Proefles is vrijblijvend</li>
                                </ul>
                                <div class="planning__payment-logos"><img src="/svg/payment/ideal.svg" alt="iDEAL"
                                        class="planning__payment-logo planning__payment-logo--ideal"><img src="/svg/payment/klarna.svg"
                                        alt="Klarna" class="planning__payment-logo planning__payment-logo--klarna"></div><!----><button
                                    type="submit" class="planning__submit button button--brand" disabled=""><span>Proefles plannen</span></button><!---->
                            </div>
                        </form>
                        </div>`);

                }

                waitForElement('.planning-modal__inner', (innerForm) => {
                    document.querySelector('.planning > .planning__subtitle').innerHTML = 'Plan direct jouw proefles';

                    const externalForm = modal;

                    // 6️⃣ Move modal
                    const target = document.querySelector('.hero-new__cta');
                    if (target && externalForm) {
                        target.insertAdjacentElement('beforeend', externalForm);
                    }

                    const form = document.querySelector('.planning form > .planning__postcode');
                    if (form) {
                        const observer = new MutationObserver(() => {
                            checklocation();
                        })
                        observer.observe(form, {
                            childList: true,
                            subtree: true,
                        })
                    }
                    bindFieldValidation();
                });

            });
        })
    }

    loadTest();


})();
