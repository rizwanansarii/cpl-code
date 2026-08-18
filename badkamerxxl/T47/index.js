(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-47',
        debug: 0,
        testName: `T47 | Inlogfunctie 'bestellen met mijn account' & 'Ik wil een account aanmaken' toevoegen in checkout`,
        testVersion: 'v1'
    };

    const SELECTORS = {
        formContainer: '.onepage-checkout__form',   // wraps "Jouw gegevens", "Bezorgen", "Betalen"
        pageTitle: 'h1.page-title',                 // "Jouw gegevens" — first h1 inside formContainer
        submitButton: '#submit-order',               // "Bestelling afronden" / "Afrekenen met ..." button
        fields: {
            firstName: '#first_name',
            lastName: '#last_name',
            email: '#email',
            phone: '#phone',
            country: '#country',
            zip: '#zip',
            houseNumber: '#house_number'
        }
    };

    const log = (...args) => testInfo.debug && console.log(`[${testInfo.className}]`, ...args);

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);

        if (timer <= 0) return;

        ((!isVariable && elements.length >= minElements) ||
            (isVariable && typeof window[waitFor] !== 'undefined'))
            ? callback(elements)
            : setTimeout(() => {
                waitForElement(waitFor, callback, minElements, isVariable, timer - frequency, frequency);
            }, frequency);
    }

    /* -------------------------------------------------------------------------
       0. Redirect legacy /checkout traffic to /afrekenen
       ------------------------------------------------------------------------- */
    function redirectLegacyCheckout() {
        if (
            window.self === window.top &&
            /^\/checkout\/?$/.test(window.location.pathname)
        ) {
            window.location.replace(
                '/afrekenen' + window.location.search
            );
        }
    }

    waitForElement('.checkout-accounts-login', () => {
        redirectLegacyCheckout();
    });

    /* -------------------------------------------------------------------------
       2. Password requirement rules
       // VERIFY — match BadkamerXXL's actual account password policy.
       ------------------------------------------------------------------------- */
    const PW_RULES = [
        { label: 'Minimaal 8 tekens', test: v => v.length >= 8 },
        { label: 'Minimaal 1 hoofdletter', test: v => /[A-Z]/.test(v) },
        { label: 'Minimaal 1 cijfer', test: v => /\d/.test(v) }
    ];

    // Builds a floating-input field using the SITE's own markup pattern so it
    // picks up the existing CSS (label float, borders, focus states, etc.)
    function buildFloatingField({ type = 'text', id, name, label, required = true, extraClass = '' }) {
        const wrap = document.createElement('div');
        wrap.className = `floating-input ${extraClass}`.trim();
        wrap.innerHTML = `
            <input type="${type}" id="${id}" name="${name}" class="floating-input__field" placeholder=" " ${required ? 'required' : ''}>
            <label for="${id}" class="floating-input__label">${label}${required ? ' <span class="required">*</span>' : ''}</label>
            <small class="text-danger d-none" data-role="field-error"></small>
        `;
        return wrap;
    }

    function buildPasswordField({ id, name = 'password', label = 'Wachtwoord', showRequirements = true }) {
        const wrap = buildFloatingField({ type: 'password', id, name, label });
        wrap.classList.add('gmd-input-wrap');

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'gmd-toggle-pw';
        toggle.textContent = 'Tonen';
        toggle.setAttribute('aria-label', 'Toon wachtwoord');
        wrap.appendChild(toggle);

        const input = wrap.querySelector('input');
        toggle.addEventListener('click', () => {
            const isPw = input.type === 'password';
            input.type = isPw ? 'text' : 'password';
            toggle.textContent = isPw ? 'Verbergen' : 'Tonen';
        });

        if (showRequirements) {
            const list = document.createElement('ul');
            list.className = 'gmd-pw-requirements';
            list.innerHTML = PW_RULES.map(r => `<li data-rule="${r.label}">${r.label}</li>`).join('');
            wrap.appendChild(list);

            // Requirements are visible before typing starts (per spec) —
            // they're rendered immediately above; this just marks them met.
            input.addEventListener('input', () => {
                PW_RULES.forEach(rule => {
                    list.querySelector(`li[data-rule="${rule.label}"]`)
                        .classList.toggle('gmd-met', rule.test(input.value));
                });
            });
        }

        return wrap;
    }

    function showFieldError(fieldWrap, message) {
        const err = fieldWrap.querySelector('[data-role="field-error"]');
        err.textContent = message;
        err.classList.remove('d-none');
    }
    function clearFieldError(fieldWrap) {
        const err = fieldWrap.querySelector('[data-role="field-error"]');
        err.textContent = '';
        err.classList.add('d-none');
    }

    /* -------------------------------------------------------------------------
       3. Login slide-in
       ------------------------------------------------------------------------- */
    // function buildLoginPanel(onLoginSuccess) {
    //     const overlay = document.createElement('div');
    //     overlay.className = 'gmd-overlay';

    //     const panel = document.createElement('div');
    //     panel.className = 'gmd-panel';
    //     panel.innerHTML = `
    //         <div class="gmd-panel-header">
    //             <h2>Inloggen</h2>
    //             <button type="button" class="gmd-close" aria-label="Sluiten">&times;</button>
    //         </div>
    //         <div class="gmd-panel-body">
    //             <div class="submit-error d-none" data-role="form-error">
    //                 <i class="fas fa-exclamation-triangle"></i>
    //                 <span data-role="form-error-text"></span>
    //             </div>
    //             <div data-role="email-slot"></div>
    //             <div data-role="password-slot"></div>
    //             <a href="/wachtwoord-vergeten" class="link-a-tag d-inline-block mb-3">Wachtwoord vergeten?</a>
    //             <button type="button" class="btn btn-primary w-100" data-role="submit">Inloggen</button>
    //         </div>
    //     `;

    //     const emailField = buildFloatingField({ type: 'email', id: 'gmd47-login-email', name: 'login_email', label: 'E-mailadres' });
    //     panel.querySelector('[data-role="email-slot"]').appendChild(emailField);

    //     const pwField = buildPasswordField({ id: 'gmd47-login-password', name: 'login_password', showRequirements: false });
    //     panel.querySelector('[data-role="password-slot"]').appendChild(pwField);

    //     document.body.appendChild(overlay);
    //     document.body.appendChild(panel);

    //     function open() {
    //         overlay.classList.add('gmd-open');
    //         panel.classList.add('gmd-open');
    //         document.body.style.overflow = 'hidden';
    //         panel.querySelector('#gmd47-login-email').focus();
    //     }
    //     function close() {
    //         overlay.classList.remove('gmd-open');
    //         panel.classList.remove('gmd-open');
    //         document.body.style.overflow = '';
    //     }

    //     overlay.addEventListener('click', close);
    //     panel.querySelector('.gmd-close').addEventListener('click', close);

    //     const formError = panel.querySelector('[data-role="form-error"]');
    //     const submitBtn = panel.querySelector('[data-role="submit"]');

    //     function attemptLogin() {
    //         formError.classList.add('d-none');
    //         clearFieldError(emailField);
    //         clearFieldError(pwField);

    //         const email = emailField.querySelector('input').value.trim();
    //         const password = pwField.querySelector('input').value;

    //         let hasError = false;
    //         if (!email) { showFieldError(emailField, 'Vul je e-mailadres in.'); hasError = true; }
    //         if (!password) { showFieldError(pwField, 'Vul je wachtwoord in.'); hasError = true; }
    //         if (hasError) return;

    //         submitBtn.disabled = true;
    //         submitBtn.textContent = 'Bezig met inloggen...';

    //         loginRequest(email, password)
    //             .then(user => {
    //                 close();
    //                 // Preserve exactly where the visitor was on the page —
    //                 // don't let the view swap below scroll them to the top.
    //                 const scrollY = window.scrollY;
    //                 onLoginSuccess(user);
    //                 requestAnimationFrame(() => window.scrollTo(0, scrollY));
    //             })
    //             .catch(err => {
    //                 formError.querySelector('[data-role="form-error-text"]').textContent =
    //                     (err && err.message) || 'Inloggen is niet gelukt. Controleer je e-mailadres en wachtwoord.';
    //                 formError.classList.remove('d-none');
    //             })
    //             .finally(() => {
    //                 submitBtn.disabled = false;
    //                 submitBtn.textContent = 'Inloggen';
    //             });
    //     }

    //     submitBtn.addEventListener('click', attemptLogin);
    //     panel.addEventListener('keydown', (e) => {
    //         if (e.key === 'Enter') attemptLogin();
    //     });

    //     return { open, close };
    // }

    function buildLoginPanel(onLoginSuccess) {

        const overlay = document.createElement('div');
        overlay.className = 'gmd-overlay';

        const panel = document.createElement('div');
        panel.className = 'gmd-panel';

        panel.innerHTML = `
        <div class="gmd-panel-header">
            <button
                type="button"
                class="gmd-close"
                aria-label="Sluiten"
            >
                &times;
            </button>
        </div>

        <div class="gmd-panel-body">
            <iframe
                class="gmd-login-iframe"
                src="/checkout"
                title="Inloggen"
                frameborder="0"
            ></iframe>
        </div>
    `;

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        const iframe = panel.querySelector('.gmd-login-iframe');

        let loginCheckTimer = null;
        let isCheckingLogin = false;

        async function checkLoginStatus() {

            if (isCheckingLogin) {
                return null;
            }

            isCheckingLogin = true;

            try {

                const response = await fetch(
                    'https://klanten.badkamerxxl.nl/api/auth/get-token',
                    {
                        credentials: 'include'
                    }
                );

                if (!response.ok) {
                    return null;
                }

                const data = await response.json();

                console.log('[gmd-47] Account response:', data);

                // Only consider the user logged in when user exists
                if (data?.user) {

                    console.log('[gmd-47] User is logged in:', data.user);

                    stopLoginCheck();

                    close();

                    if (typeof onLoginSuccess === 'function') {
                        onLoginSuccess(data.user);
                    }

                    return data.user;
                }

                return null;

            } catch (error) {

                console.error(
                    '[gmd-47] Login status check failed:',
                    error
                );

                return null;

            } finally {

                isCheckingLogin = false;

            }
        }

        function stopLoginCheck() {

            if (loginCheckTimer) {
                clearInterval(loginCheckTimer);
                loginCheckTimer = null;
            }
        }

        iframe.addEventListener('load', () => {

            const doc = iframe.contentDocument;

            if (!doc) {
                return;
            }

            const target = doc.querySelector('#accountCheckoutLogin');

            if (!target) {
                console.warn(
                    '[gmd-47] #accountCheckoutLogin not found'
                );
                return;
            }

            const style = doc.createElement('style');

            style.textContent = `
            body.gmd-iframe-login > div:not(#loginModal, #mobileLoginDrawer),
            body.gmd-iframe-login > header,
            body.gmd-iframe-login > footer {
                display: none !important;
            }

            body.gmd-iframe-login #mobileLoginDrawer {
                padding: 0;
            }

            body.gmd-iframe-login .closeMobileLoginDrawer {
                display: none !important;
            }

            body.gmd-iframe-login #mobileLoginDrawer .nav-inner {
                padding: 24px !important;
                padding-top: 7px !important;
                background-color: unset;
            }

            body.gmd-iframe-login .nav-inner::-webkit-scrollbar {
                display: none;
            }

            #mobileLoginDrawer a[href="/wachtwoord-vergeten"] {
                margin-top: 16px;
                display: block;
            }

            body.gmd-iframe-login h4 {
                color: #28A745;
                font-size: 28px;
                font-weight: 600;
                line-height: 100%;
            }
        `;

            doc.head.appendChild(style);

            doc.body.classList.add('gmd-iframe-login');

            const loginModal = doc.querySelector('#loginModal');
            const mobileLoginDrawer = doc.querySelector('#mobileLoginDrawer');

            loginModal?.classList.add('open');
            mobileLoginDrawer?.classList.add('visible');

            // Keep parent hierarchy visible
            let parent = target.parentElement;

            while (parent && parent !== doc.body) {
                parent.classList.add('gmd-iframe-parent');
                parent = parent.parentElement;
            }

            const forgotPassword = doc.querySelector(
                '#mobileLoginDrawer a[href="/wachtwoord-vergeten"]'
            );

            const checkoutActions = doc.querySelector(
                '#mobileLoginDrawer .login-submit'
            );

            if (checkoutActions && forgotPassword) {
                checkoutActions.insertAdjacentElement(
                    'afterend',
                    forgotPassword
                );
            }

            const loginForm = doc.querySelectorAll(
                '#loginModal form, #mobileLoginDrawer form'
            );

            if (loginForm.length) {

                loginForm.forEach((form) => {

                    form.addEventListener('submit', () => {

                        let attempts = 0;

                        const checkLogin = setInterval(async () => {

                            attempts++;

                            try {

                                const response = await fetch(
                                    'https://klanten.badkamerxxl.nl/api/auth/get-token',
                                    {
                                        credentials: 'include'
                                    }
                                );

                                if (!response.ok) {
                                    return;
                                }

                                const data = await response.json();

                                console.log(
                                    '[gmd-47] Login status:',
                                    data
                                );

                                if (data?.user) {

                                    clearInterval(checkLogin);

                                    console.log(
                                        '[gmd-47] Login successful:',
                                        data.user
                                    );

                                    // buildLoginPanel's callback
                                    // will handle the UI update
                                    if (typeof onLoginSuccess === 'function') {
                                        onLoginSuccess(data.user);
                                    }

                                    close();
                                }

                            } catch (error) {

                                console.error(
                                    '[gmd-47] Login check failed:',
                                    error
                                );

                            }

                            // Stop after 10 seconds
                            if (attempts >= 20) {
                                clearInterval(checkLogin);
                            }

                        }, 500);

                    });

                });

            }

        });

        function open() {

            overlay.classList.add('gmd-open');
            panel.classList.add('gmd-open');

            document.body.style.overflow = 'hidden';
        }

        function close() {

            overlay.classList.remove('gmd-open');
            panel.classList.remove('gmd-open');

            document.body.style.overflow = '';
        }

        overlay.addEventListener('click', close);

        panel.querySelector('.gmd-close')
            .addEventListener('click', close);

        return {
            open,
            close,
            iframe
        };
    }

    // VERIFY — replace with the real authentication endpoint used by the
    // existing /checkout "Inloggen en doorgaan" flow.
    function loginRequest(email, password) {
        return fetch('/api/customer/login', { // VERIFY endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ email, password })
        }).then(res => {
            if (!res.ok) {
                return res.json().catch(() => ({})).then(body => {
                    throw new Error(body.message || 'Inloggen is niet gelukt. Controleer je e-mailadres en wachtwoord.');
                });
            }
            return res.json();
        });
    }

    function fillField(selector, value) {
        const el = document.querySelector(selector);
        if (!el || value === undefined || value === null) return;
        el.value = value;
        el.classList.add('has-value');
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function renderLoggedInView(user, mountPoint, accountBar, guestCopy) {
        accountBar.remove();
        guestCopy.remove();

        const row = document.createElement('div');
        row.className = 'gmd-logged-in-row';
        row.innerHTML = `
            <div>
                <div class="gmd-login-message">Inloggegevens</div>
                <span class="gmd-email">${user.email}</span>
                <a href="#" class="gmd-link ml-2" data-role="wijzig">Wijzig</a>
            </div>
        `;
        if (!document.querySelector('.gmd-logged-in-row')) {
            mountPoint.parentNode.insertBefore(row, mountPoint);
            row.querySelector('[data-role="wijzig"]').addEventListener('click', (e) => {
                e.preventDefault();
                // VERIFY — decide desired behaviour: reopen login slide-in to
                // switch accounts, or just make the email field editable inline.
            });

            fillField(SELECTORS.fields.firstName, user.first_name);
            fillField(SELECTORS.fields.lastName, user.last_name);
            fillField(SELECTORS.fields.email, user.email);
            fillField(SELECTORS.fields.phone, user.phone);
            fillField(SELECTORS.fields.country, user.country || 'NL');
            fillField(SELECTORS.fields.zip, user.zip);
            fillField(SELECTORS.fields.houseNumber, user.house_number);
        }

    }

    /* -------------------------------------------------------------------------
       5. Insert "Bestellen met mijn account" bar + guest copy above the
          "Jouw gegevens" title
       ------------------------------------------------------------------------- */
    function insertAccountBarAndGuestCopy(titleEl, loginPanel) {
        const bar = document.createElement('button');
        bar.type = 'button';
        bar.className = 'gmd-account-bar';
        bar.textContent = 'Bestellen met mijn account';
        bar.addEventListener('click', () => loginPanel.open());

        const guestCopy = document.createElement('p');
        guestCopy.className = 'gmd-guest-copy';
        guestCopy.textContent = 'Heb je geen account, of wil je bestellen als gast? Vul hieronder je gegevens in.';

        titleEl.parentNode.insertBefore(bar, titleEl);
        titleEl.parentNode.insertBefore(guestCopy, titleEl);

        return { bar, guestCopy };
    }

    /* -------------------------------------------------------------------------
       6. Account-creation checkbox, inserted above the submit button
       ------------------------------------------------------------------------- */
    function insertAccountCreationCheckbox(container) {
        const submitBtn = container.querySelector(SELECTORS.submitButton);
        if (!submitBtn) {
            log('Submit button not found — check SELECTORS.submitButton');
            return;
        }
        const submitWrap = submitBtn.closest('.text-right') || submitBtn.parentElement;

        const block = document.createElement('div');
        block.className = 'mt-4';
        block.innerHTML = `
            <label class="checkbox-label mb-2" for="gmd47_create_account">
                <input type="checkbox" class="mr-1" id="gmd47_create_account" name="create_account">
                Account aanmaken (aanbevolen)
            </label>
        `;
        const pwWrap = document.createElement('div');
        pwWrap.className = 'gmd-account-pw-wrap';
        const pwField = buildPasswordField({ id: 'gmd47-account-password', name: 'account_password', label: 'Wachtwoord', showRequirements: true });
        pwWrap.appendChild(pwField);
        block.appendChild(pwWrap);

        submitWrap.parentNode.insertBefore(block, submitWrap);

        const checkbox = block.querySelector('#gmd47_create_account');
        checkbox.addEventListener('change', () => {
            pwWrap.classList.toggle('gmd-expanded', checkbox.checked);
            if (!checkbox.checked) pwField.querySelector('input').value = '';
        });

    }

    waitForElement(SELECTORS.formContainer, (elements) => {
        document.body.classList.add(testInfo.className)
        const container = elements[0];
        const titleEl = Array.from(container.querySelectorAll(SELECTORS.pageTitle))
            .find(el => el.textContent.trim() === 'Jouw gegevens');

        if (!titleEl) {
            log('"Jouw gegevens" title not found');
            return;
        }

        let barRefs;

        const loginPanel = buildLoginPanel((user) => {

            console.log('[gmd-47] Login successful:', user);

            if (!barRefs) {
                return;
            }

            renderLoggedInView(
                user,
                titleEl,
                barRefs.bar,
                barRefs.guestCopy
            );

        });

        barRefs = insertAccountBarAndGuestCopy(titleEl, loginPanel);
        insertAccountCreationCheckbox(container);

        async function checkExistingLogin() {

            try {

                const response = await fetch(
                    'https://klanten.badkamerxxl.nl/api/auth/get-token',
                    {
                        credentials: 'include'
                    }
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                console.log('[gmd-47] Existing login:', data);

                if (!data?.user) {
                    console.log('[gmd-47] User is not logged in');
                    return;
                }

                console.log(
                    '[gmd-47] User already logged in:',
                    data.user
                );

                renderLoggedInView(
                    data.user,
                    titleEl,
                    barRefs.bar,
                    barRefs.guestCopy
                );

            } catch (error) {

                console.error(
                    '[gmd-47] Existing login check failed:',
                    error
                );

            }
        }
        checkExistingLogin();

        log('T47 initialised');
    });

})();