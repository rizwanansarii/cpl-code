(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-24',
        debug: 0,
        testName: `T24 | Verduidelijken mobile progress bar`,
        testVersion: 'v1'
    };

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement('#wijcbf_step_indicator', ([indicator]) => {
        if (window.innerWidth < 768) {
            const steps = Array.from(indicator.querySelectorAll(':scope > .step'));
            if (!steps.length) {
                return;
            }

            const activeIndex = steps.findIndex((s) => s.classList.contains('current'));
            if (activeIndex === -1) {
                return;
            }

            document.body.classList.add(testInfo.className);

            // Build new circle-based mobile bar

            if (!document.querySelector('.gmd-mobile-steps')) {

                const bar = document.createElement('div');
                bar.className = 'gmd-mobile-steps';

                const fillPercent = (activeIndex / (steps.length - 1)) * 100;

                bar.innerHTML = `
                    <div class="gmd-line-track">
                        <div class="gmd-line-fill" style="width:${fillPercent}%;"></div>
                    </div>
    
                    <div class="gmd-steps"></div>
                `;

                const stepsWrap = bar.querySelector('.gmd-steps');

                steps.forEach((stepEl, index) => {

                    const numberText =
                        stepEl.querySelector('.mobile .number')?.textContent.match(/\d+/)?.[0] ||
                        String(index + 1);

                    const labelText =
                        stepEl.querySelector('.mobile .text')?.textContent.trim() || '';

                    let state = 'future';

                    if (index === activeIndex) {
                        state = 'active';
                    } else if (stepEl.classList.contains('selected')) {
                        state = 'done';
                    }

                    const step = document.createElement('div');
                    step.className = 'gmd-step';

                    const circle = document.createElement('div');
                    circle.className = `gmd-circle ${state}`;

                    circle.innerHTML =
                        state === 'done'
                            ? `
                            <span class="gmd-check">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.11876 17.8398C9.01839 17.8398 8.81765 17.8398 8.71728 17.7393L3.99988 13.022L4.70247 12.3194L9.11876 16.7357L18.7543 6.99976L19.4569 7.70235L9.41988 17.7393C9.3195 17.8398 9.21913 17.8398 9.11876 17.8398Z" fill="white"/>
                                </svg>
                            </span>`
                            : `<span class="gmd-num">${numberText}</span>`;

                    const label = document.createElement('div');
                    label.className = 'gmd-step-title';
                    label.textContent = labelText;

                    step.append(circle, label);

                    stepsWrap.append(step);

                });

                // Insert new bar, hide original mobile stepper content (desktop untouched)
                indicator.insertAdjacentElement('afterend', bar);
                function updateProgress() {

                    const steps = [...indicator.querySelectorAll(':scope > .step')];

                    const activeIndex = steps.findIndex(step =>
                        step.classList.contains('current')
                    );

                    const stepItems = bar.querySelectorAll('.gmd-step');

                    stepItems.forEach((step, index) => {

                        const circle = step.querySelector('.gmd-circle');

                        circle.className = 'gmd-circle';

                        if (index < activeIndex) {

                            circle.classList.add('done');

                            circle.innerHTML = `
                                <span class="gmd-check">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M9.11876 17.8398C9.01839 17.8398 8.81765 17.8398 8.71728 17.7393L3.99988 13.022L4.70247 12.3194L9.11876 16.7357L18.7543 6.99976L19.4569 7.70235L9.41988 17.7393C9.3195 17.8398 9.21913 17.8398 9.11876 17.8398Z" fill="white" stroke="white" stroke-width="1.16765"/>
                                    </svg>
                                </span>
                            `;

                        } else if (index === activeIndex) {

                            circle.classList.add('active');
                            circle.innerHTML = `<span class="gmd-num">${index + 1}</span>`;

                        } else {

                            circle.innerHTML = `<span class="gmd-num">${index + 1}</span>`;

                        }

                    });

                    const fillPercent = ((activeIndex + 0.5) / steps.length) * 100;

                    bar.querySelector('.gmd-line-fill').style.width = fillPercent + '%';

                }
                updateProgress();
                const observer = new MutationObserver(() => {
                    updateProgress();
                });

                observer.observe(indicator, {
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
            }
        }
    });
})();