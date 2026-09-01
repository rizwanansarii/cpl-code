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

    waitForElement('.cart-index', () => {
        document.querySelector('.cart-totals-row a[href="/checkout"]').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/afrekenen';
        })
    })

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

                // Only consider the user logged in when user exists
                if (data?.user) {

                    stopLoginCheck();

                    close();

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

            body.gmd-iframe-login #loginDrawerFormAlert.alert-danger {
                color: #721C24;
                font-size: 16px;
                font-weight: 400;
                line-height: 24px;
                text-align: center;
                display: flex;
                gap: 6px;
                align-items: center;
            }

            body.gmd-iframe-login #loginDrawerFormAlert::before {
                content: '';
                height: 19px;
                min-width: 19px;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="19" viewBox="0 0 19 19" fill="none"><path d="M19 0H0V19H19V0Z" fill="url(%23pattern0_4362_3)"/><defs><pattern id="pattern0_4362_3" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="%23image0_4362_3" transform="translate(-0.351351 -0.243243) scale(0.0135135)"/></pattern><image id="image0_4362_3" width="112" height="110" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABuCAYAAAD/PJegAAAMTmlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8kWnltSSQgQiICU0JsgIiWAlBBaAOlFEJWQBAglxoSgYkcXFVy7iGBFV0EUXV0BWWyoq64sit21LBZUlHWxYFfehAC67Cvfm++bO//958w/55w7994ZABgdApksF9UCIE+aL48NCWBPSE5hk54CIqABFGgAG4FQIeNGR0cAWAbbv5c31wCiai87qrT+2f9fi7ZIrBACgERDnC5SCPMg/gkAvFkok+cDQJRB3mJ6vkyF10KsK4cOQlytwplq3KzC6Wp8sd8mPpYH8UMAyDSBQJ4JgGYP5NkFwkyow4DRAmepSCKF2B9i37y8qSKI50NsC23gnAyVPif9G53Mv2mmD2kKBJlDWB1LfyEHShSyXMHM/zMd/7vk5SoH57CBlZYlD41VxQzz9jBnargK0yB+J02PjIJYBwAUl4j67VWYlaUMTVDbo7ZCBQ/mDLAgHqfIjeMP8LEiQWA4xEYQZ0hzIyMGbIoyJMEqG5g/tFySz4+HWB/iarEiKG7A5rh8auzgvNcy5DzuAP9EIO/3QaX/RZmTwFXrYzpZYv6APuZUmBWfBDEV4sACSWIkxJoQRypy4sIHbFILs3iRgzZyZawqFkuI5WJpSIBaHyvLkAfHDtjvzlMMxo4dz5LwIwfwpfys+FB1rrCHQkG//zAWrEcs5SYM6ogVEyIGYxGJA4PUseNksTQhTs3j+rL8gFj1WNxelhs9YI8HiHNDVLw5xPGKgrjBsQX5cHGq9fFiWX50vNpPvCJbEBat9gffDyIADwQCNlDCmg6mgmwgaetu6IZ36p5gIABykAnEwHGAGRyR1N8jhdc4UAj+hEgMFEPjAvp7xaAA8p+HsSpOMsSpr44gY6BPpZIDHkGcB8JBLrxX9itJhzxIBA8hI/mHRwJYhTCGXFhV/f+eH2S/MlzIRAwwysEZ2YxBS2IQMZAYSgwm2uGGuC/ujUfAqz+sLjgH9xyM46s94RGhnXCfcJXQQbg5RVIkH+bleNAB9YMH8pP+bX5wa6jphgfgPlAdKuMs3BA44q5wHi7uB2d2gyxvwG9VVtjDtP8WwTdPaMCO4kxBKSMo/hTb4SM17TXdhlRUuf42P2pf04fyzRvqGT4/75vsi2AbPtwSW4IdxM5gJ7BzWDPWANjYMawRa8WOqPDQinvYv+IGZ4vt9ycH6gxfM1+frCqTCuda5y7nT+q+fPGMfNXLyJsqmymXZGbls7nwjyFm86VCp1FsF2cXdwBU/x/15+1VTP9/BWG1fuUW/gGAz7G+vr6fv3JhxwD40QN+Eg5/5Ww58NeiAcDZw0KlvEDN4aoLAX45GPDtMwAmwALYwnhcgDvwBv4gCISBKBAPksFk6H0WXOdyMB3MBgtAMSgFK8E6UAG2gO2gGuwFB0ADaAYnwC/gPLgIroJbcPV0gmegB7wBHxEEISF0hIkYIKaIFeKAuCAcxBcJQiKQWCQZSUMyESmiRGYjC5FSZDVSgWxDapAfkcPICeQc0o7cRO4hXchL5AOKoTRUFzVGrdHRKAflouFoPDoJzUSnoYXoInQ5Wo5WoXvQevQEeh69inagz9BeDGAaGAszwxwxDsbDorAULAOTY3OxEqwMq8LqsCb4nC9jHVg39h4n4kycjTvCFRyKJ+BCfBo+F1+GV+DVeD1+Cr+M38N78C8EOsGI4EDwIvAJEwiZhOmEYkIZYSfhEOE0fJc6CW+IRCKLaEP0gO9iMjGbOIu4jLiJuI94nNhOfEDsJZFIBiQHkg8piiQg5ZOKSRtIe0jHSJdInaR3ZA2yKdmFHExOIUvJReQy8m7yUfIl8mPyR4oWxYriRYmiiCgzKSsoOyhNlAuUTspHqjbVhupDjadmUxdQy6l11NPU29RXGhoa5hqeGjEaEo35GuUa+zXOatzTeE/TodnTeLRUmpK2nLaLdpx2k/aKTqdb0/3pKfR8+nJ6Df0k/S79nSZT00mTrynSnKdZqVmveUnzOYPCsGJwGZMZhYwyxkHGBUa3FkXLWounJdCaq1WpdVjrulavNlN7jHaUdp72Mu3d2ue0n+iQdKx1gnREOot0tuuc1HnAxJgWTB5TyFzI3ME8zezUJera6PJ1s3VLdffqtun26Onoueol6s3Qq9Q7otfBwljWLD4rl7WCdYB1jfVhhPEI7gjxiKUj6kZcGvFWf6S+v75Yv0R/n/5V/Q8GbIMggxyDVQYNBncMcUN7wxjD6YabDU8bdo/UHek9UjiyZOSBkb8boUb2RrFGs4y2G7Ua9RqbGIcYy4w3GJ807jZhmfibZJusNTlq0mXKNPU1lZiuNT1m+pStx+ayc9nl7FPsHjMjs1Azpdk2szazj+Y25gnmReb7zO9YUC04FhkWay1aLHosTS3HW862rLX83YpixbHKslpvdcbqrbWNdZL1YusG6yc2+jZ8m0KbWpvbtnRbP9tptlW2V+yIdhy7HLtNdhftUXs3+yz7SvsLDqiDu4PEYZND+yjCKM9R0lFVo6470hy5jgWOtY73nFhOEU5FTg1Oz0dbjk4ZvWr0mdFfnN2cc513ON8aozMmbEzRmKYxL13sXYQulS5XxtLHBo+dN7Zx7AtXB1ex62bXG25Mt/Fui91a3D67e7jL3evcuzwsPdI8Nnpc5+hyojnLOGc9CZ4BnvM8mz3fe7l75Xsd8PrL29E7x3u395NxNuPE43aMe+Bj7iPw2ebT4cv2TfPd6tvhZ+Yn8Kvyu+9v4S/y3+n/mGvHzebu4T4PcA6QBxwKeMvz4s3hHQ/EAkMCSwLbgnSCEoIqgu4GmwdnBtcG94S4hcwKOR5KCA0PXRV6nW/MF/Jr+D1hHmFzwk6F08LjwivC70fYR8gjmsaj48PGrxl/O9IqUhrZEAWi+FFrou5E20RPi/45hhgTHVMZ8yh2TOzs2DNxzLgpcbvj3sQHxK+Iv5Vgm6BMaElkJKYm1iS+TQpMWp3UMWH0hDkTzicbJkuSG1NIKYkpO1N6JwZNXDexM9UttTj12iSbSTMmnZtsODl38pEpjCmCKQfTCGlJabvTPgmiBFWC3nR++sb0HiFPuF74TOQvWivqEvuIV4sfZ/hkrM54kumTuSazK8svqyyrW8KTVEheZIdmb8l+mxOVsyunLzcpd18eOS8t77BUR5ojPTXVZOqMqe0yB1mxrGOa17R103rk4fKdCkQxSdGYrws3+q1KW+V3ynsFvgWVBe+mJ04/OEN7hnRG60z7mUtnPi4MLvxhFj5LOKtlttnsBbPvzeHO2TYXmZs+t2WexbxF8zrnh8yvXkBdkLPgtyLnotVFrxcmLWxaZLxo/qIH34V8V1usWSwvvr7Ye/GWJfgSyZK2pWOXblj6pURU8mupc2lZ6adlwmW/fj/m+/Lv+5ZnLG9b4b5i80riSunKa6v8VlWv1l5duPrBmvFr6tey15asfb1uyrpzZa5lW9ZT1yvXd5RHlDdusNywcsOniqyKq5UBlfs2Gm1cuvHtJtGmS5v9N9dtMd5SuuXDVsnWG9tCttVXWVeVbSduL9j+aEfijjM/cH6o2Wm4s3Tn513SXR3VsdWnajxqanYb7V5Ri9Yqa7v2pO65uDdwb2OdY922fax9pfvBfuX+pz+m/XjtQPiBloOcg3U/Wf208RDzUEk9Uj+zvqchq6GjMbmx/XDY4ZYm76ZDPzv9vKvZrLnyiN6RFUepRxcd7TtWeKz3uOx494nMEw9aprTcOjnh5JVTMafaToefPvtL8C8nz3DPHDvrc7b5nNe5w79yfm04736+vtWt9dBvbr8danNvq7/gcaHxoufFpvZx7Ucv+V06cTnw8i9X+FfOX4282n4t4dqN66nXO26Ibjy5mXvzxe8Fv3+8Nf824XbJHa07ZXeN7lb9YffHvg73jiP3Au+13o+7f+uB8MGzh4qHnzoXPaI/Knts+rjmicuT5q7grotPJz7tfCZ79rG7+E/tPzc+t33+01/+f7X2TOjpfCF/0fdy2SuDV7teu75u6Y3uvfsm783HtyXvDN5Vv+e8P/Mh6cPjj9M/kT6Vf7b73PQl/Mvtvry+PplALujfCmBAdbTJAODlLgDoyQAw4bmROlF9PuwviPpM24/Af8LqM2R/gTuXOrinj+mGu5vrAOzfAYA11GekAhBNByDeE6Bjxw7VwbNc/7lTVYjwbLBV+Dk9Lx38m6I+k37j9/AWqFRdwfD2Xxihgw+kReeXAAAABGNJQ1AMDQABbgPj7wAAAIplWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAHCgAwAEAAAAAQAAAG4AAAAAQVNDSUkAAABTY3JlZW5zaG90A6Qn9gAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAdZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTEwPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjExMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PlNjcmVlbnNob3Q8L2V4aWY6VXNlckNvbW1lbnQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpx+yTFAAAAHGlET1QAAAACAAAAAAAAADcAAAAoAAAANwAAADcAAAZAW7pPQgAABgxJREFUeAHsXGlMVFcU/phBAgVhylYiglaQtqCptRVQ09QaRUklEIKlIEmxQQqoQ90arQtotGqtC+NGkSA/oLSRGAw2CBhra0RFazEuJSq2ghhkKwgqQYb23flBIDLMvP1d8m7yMsO753z3nPO9e99dzmDTVXvvP6iF2gjYqARSy53JcJVAuvmDSqBKIOURoNx8tQeqBFIeAcrNV3ugSiDlEaDcfLUHqgRSHgHKzVd7oEog5RGg3Hy1B6oEUh4Bys1Xe6BKIOURoNx8tQeqBNIXgb6XL/G8qwuOzs7Q2trS58Agi0dtD2xvasK9mhp0NLegs70NT9va8ZR8trfj+dOugRC85jwWzq6uzOUGZzdXuDCfOk8PTJ42Da5eXgNySv0yqghsrKvD7UuXcIu5mv55yDvmXhMnYMrMmQhiLm8/P954YgBQT2DD3bv449w53Ll8GR0trWLEyISp83BHYGgo3p87Fz4BAaK1wxaYWgJbHz9GWX4+bl6sYuszb/mps2chPDER7uPG8cbiC0Adgd0dHaj8sQhXzpSh39jP13/O+hqtBiELwzE/Pg5OOh1nHL6K1BDY29OD306eNF29L3r4+i2Yvp2DPT6KjjZddvb2guFaC0QFgWS4zN+6Dc2PHlnrl+RynuPHIzFji+TDquIJJEuBgp278KK7W3JS2Dbo4OSEhA3rTUsQtrpc5RVN4MXSUpTmHEN/v3zvOraB1Wg0iEhehtkREWxVOckrkkBjXx9KjmYzE5UznJxSglLIwoWISk0RfadHcQT2G43Iy9yKu9evK4EHXjYETJ+OLzIzoNFqeeGMpKw4AkuOHkXV6V9GspmqulmLPmF6YqpoNiuKwMtlZTh56LBozsoFHL1iOULDw0VpXjEE1t28idxNm2DsM4riqJygWlstkrZvh9/UqYKboQgCycmBYdWqIacEgnsqMyA59dDv3y/4CYfsBJIZZ5Y+HU0P+Z8eyMyRxea9JkxAuiFL0Jmp7AReOHXKtNaz6P0oESBrxA8jIwXzRlYCe549w66kJEmHTrLQ9vT1gYe3N1oaG9Fc3yDpRgEZStfn5sLe0VEQEmUlkBwH/XqiWBBHrAEZP9kfsatX4w1f3wHxJ/X1+HnfPjy6d3/gnthfPl4cYzqOEqId2QjsbGvDd0nL8LK3Vwg/LGK4uLthzZEjwz75ZCTYm5aGztY2izhCCIyxs8PXucfg4ubGG042Ak9kZeFqRSVvB6wFiNGvRPCCBWbFq8vLUWw4aLZe6IoZYfOxOD2dN6wsBJJ3z96UVEnfPauPHAaZBZorZBa8L225uWrB79tobLA2O9v0LuYDLguBZ4t+QkVBAR+7Weuuy/lhxGCRh2pP8pescfkohCUkYF7cZ3wg5Pk3I1nM0NF4v46X4WyV49atxXtz5phV+/P8eRTt+d5svRgV3v5+SGdeJXyK5D2wo6UF3yYu5WMzJ11PHx98ddAA2zFjXtEnib4HVurR3NDwSp3YN77JPw6dhwfnZiQnsKr0NEqYsV+OEhgSjBi9fkgSEkmSKjYYcOdKtRwmISolBbMiFnFuW3ICczZuxP2aG5wN5qvowCyg35wSBHdmId/KvPf+vnUbL5hlhFzFf9q7SN6xg3PzkhJI8lq2xsfLmg7IOVIiKZL0xIyiIpAHi0uRlMC/qqtxnMkuU8vQCCxlstneCQ4eetPKvyQlcLQe2FoZa7NifA58JSWwoqAQZ5nhQspCNq9J8u1whWS7KSFJeF5cHMISlgxnosV7khJIZnvV5RUWjRJCgPz2L5LJCgtkhqaRMqb/ffIElcxDda3yrBDNcsIIXhBmmh1zUZaUwLzMTNRevcbFTlY6ZJsqdfduTAwMtFqvkJG/8fsFq+WFFHx7xgdM9lomJ0hJCSSL5ccPHnAylI2S71sBWMEcEbEp9bW1OLRmLRsVwWTHTZpk2mTgAigpgduWLEF3RycXO1npBIWG4PPNm1npkCVORiy/fUlWDQ4SdtK5YEth4aA71n+VlMANkVFM1lmf9dZxlBzr+jo25OUNu21mDpIs5jM+jTVXLep98jv9nadKOLXxPwAAAP//T6wc9QAABhtJREFU7ZtrTBRXFMf/LE9RVwQJqURNpPJQiEUEobZGay2CX2qCEqECtTUNUkFMLeIzoilSGxEsNsaGglYJ1Ua/+KCUapAGESttUVEIJJVg0yCIiyjy2HbuNmN4buZx585AZr7Mztx7zvmf82OHO/fetem83/AvGB1fJCSgo/Uxk2ihkRF4PzERBoNBULwXXV3YuzZaUF/anVzcp2FHQYEktzYsAX69dSsePqiXJFSKkefrXpgbEoLJU6e+MvcNDoaLu/ura/6DmgBn+njj08OHeSmizkwBFh44gLuVN0QJpN35o4x98AkKGuZWTYD+b4YhbufOYZqE3GAK8Pyxb1B58aIQXYr10SLAsFWrsHpToqScmQIsKy5GyclTkoTSMtIiwPC49VgeLe3/L1OA1aWlOHskhxYLSX60CHDNlhQEr1ghKR+mABtra3F8e7okobSMtAjwk4OZ8AoIkJQiU4D9fX3Yt24dup+/kCSWhpHWADo5T8DeoiLY2tlJSo8pQKLwdFYW/ii/LkksDSOtAZy/5G3EpqVJTo05wN/Ly3Em60vJguUaag1gTNrneGPJEslpMQfYzc147IuJBXmcKn24e06Hz8KFg17k53PFcvXwGBa6r7cX1y9cQOeTJ3hw6xZaWx4N60P7hq2dreXx6eTsLNk1c4BE6be7d6P+do1k0UIMFyxbhqiUZNjZ2wvpPqgPgXkuJxe3r14ddJ/2hfeCQHy8f78st6oArLx0CefzjskSbs144hQj0vPz4eDkZK2b1bae7m5kbtiArqcmq/3kNK5O2oSwyEg5LqAKwOednTjIFUep0ejcRSFI2LNHVmGIcUFGBu5V3ZTtZyQHZPS5nfsjc548eaRmwfdUAUjU/VL8A66cPClYqJiOs/z8kPTVITEmI/bN+2wb/qqrG7FN7s2VcXF4J3qtXDfqfAOJ6t6XL5G1cSNMbe2ykxjqwGBrwObsbHh6eQ1tEnzd0tiIo6mpMPebBdsI7Wh0c0XaiROwd3QUajJqP9W+gUTRzZISnMs9Oqo4OQ1TprkhKjkZcwIDBa8JknhmsxkNNTWcrlw8fdwmR8KotlHJmxESHj5qu5gGVQGSYmUnJeGfh81iNIvq6+DkiIlGo2CbLpMJPd0vBfcX29Fj5gyk5uWJ+qOyFkNVgETYvaoqbrAgbyhtLUGttZHBFRlk0TpUB0gSOZWZidqKX2nlpFk/AW8txvp0upP5mgBIBjR527bhUWOTZosvV9h0r9lIOnSIysBloBZNACSCOlpbkbslFc86OgbqGxefJ7m4IPlI9oh7ceQmqBmAJBHyznU8fQfIVNZ4OchUHlnvm+Xrq0hKmgJIMvytrAzFh7MVSVYNp9FbUxG0fLlioTUHkGT6M7fA+dP3pxVLmpXj9z6IxbvcAraShyYBkoRrrl3D2Zwc9PWMvcepnYM91qSkIHDpUiXZWXxrFiBR11xfD7KXVInpNqUqS6bJ4nftwgxvb6VCDPKraYBEqam9HYXcmllzfcMg4Vq8mOE9B/HcWqfR1ZWZPM0DJJXo7enBj9ycqdILrHKqbllA5uY47Rwc5LgRbTsmAPJZNXHbEi/mf2d5tPL31D6TR+WqDR9itsRtgXL1jymAfLJ/VlTgcmEh2h79zd9ifnab/hoi4uMRsHgxbGxsmMfnA45JgEQ82RRVdfkKSovOKLrtgS8UfybbNVasi8GiiJWS93LyvmicxyxAPnkyj3qf20VGfvVUV12NF8+e8U3UzhMmTYIf97O0eWGh8OV2udFYiKUlbswDHFgIc38/mu7cscC8e+OGZX51YLuYz+Q3hPNCQy3QZvv7w2BrK8acWd9xBXBo1VpbWiwQTW1tltcR8j5pav//83Nu4daZW+glQ36jqxvI+5vls5ubZdLZ3dNzqDtNXo9rgJqsOGVROkDKBWXtTgfIuuKU4+kAKReUtTsdIOuKU46nA6RcUNbudICsK045ng6QckFZu9MBsq445Xg6QMoFZe1OB8i64pTj6QApF5S1Ox0g64pTjqcDpFxQ1u50gKwrTjmeDpByQVm70wGyrjjleDpAygVl7U4HyLrilOPpACkXlLW7/wDIwd+RMsg1xgAAAABJRU5ErkJggg=="/></defs></svg>');
            }

            @media (max-width: 767px) {
                body.gmd-iframe-login #loginDrawerFormAlert.alert-danger {
                    font-size: 14px;
                    line-height: 130%;
                    padding: 10px 8px;
                }   
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

                                if (data?.user) {

                                    clearInterval(checkLogin);

                                    // Close popup
                                    close();

                                    // Refresh the main page
                                    window.parent.location.reload();

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

            doc.querySelectorAll('a[href="/wachtwoord-vergeten"]').forEach((link) => {

                link.addEventListener('click', (e) => {

                    e.preventDefault();

                    window.parent.location.href = link.href;

                });

            });

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
            return;
        }

        let barRefs;

        const loginPanel = buildLoginPanel((user) => {

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

                if (!data?.user) {
                    return;
                }

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
    });

})();