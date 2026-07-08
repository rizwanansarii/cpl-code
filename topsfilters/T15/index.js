(() => {
    'use strict';
    const testInfo = {
        className: 'gmd-15',
        debug: 0,
        testName: `T15 | Klasse filter (+ beschrijving) en type als bullets benoemen`,
        testVersion: 'v1'
    };

    // Right-hand table: filterclass -> bullet 2
    const FILTERCLASS_MAP = {
        'G2': 'Verwijdert grove stoffen',
        'G2+F7': 'Verwijdert grove en fijnstoffen',
        'G3': 'Verwijdert grove stoffen',
        'G3+G4': 'Verwijdert grove stoffen',
        'G3+M6': 'Verwijdert grove en middelgrove stoffen',
        'G3+F7': 'Verwijdert grove en fijnstoffen',
        'G4': 'Verwijdert grove stoffen',
        'G4+M5': 'Verwijdert grove en middelgrove stoffen',
        'G4+M6': 'Verwijdert grove en middelgrove stoffen',
        'G4+F7': 'Verwijdert grove en fijnstoffen',
        'G4+F9': 'Verwijdert grove en fijnstoffen',
        'M5': 'Verwijdert middelgrove stoffen',
        'M5+F7': 'Verwijdert middelgrove en fijnstoffen',
        'M6': 'Verwijdert middelgrove stoffen',
        'F7': 'Verwijdert fijnstoffen',
        'F9': 'Verwijdert fijnstoffen',
        'H13': 'Verwijdert fijnstoffen en virussen'
    };

    // Left-hand table: brand -> bullet 3 (non-Tops brands)
    const BRAND_MAP = {
        'Interduct': 'Originele Interduct',
        'DEC': 'Originele DEC',
        'Zehnder': 'Originele Zehnder',
        'DUCO': 'Originele DUCO',
        'Itho-Daalderop': 'Originele Itho-Daalderop',
        'Buva': 'Originele BUVA',
        'J.E. StorkAir': 'Originele J.E. StorkAir',
        'Bergschenhoek': 'Originele Bergschenhoek',
        'Vasco': 'Originele Vasco',
        'Paul': 'Originele Paul',
        'Brink': 'Originele Brink',
        'Mitsubishi Electric': 'Originele Mitsubishi Electric',
        'Orcon': 'Originele Orcon',
        'Soler & Palau': 'Originele Soler & Palau',
        'Renson': 'Originele Renson',
        'Vent-Axia': 'Originele Vent-Axia',
        'ClimaRad': 'Originele ClimaRad'
    };
    const TOPS_BULLET = 'Tops merk, scherpere prijs';

    function extractFilterclass(tile) {
        const codeEl = tile.querySelector('.product-item-code');
        const codeText = codeEl ? codeEl.textContent : '';
        let match = codeText.match(/Filterklasse\s+([A-Za-z0-9+]+)/i);
        if (match) return match[1].toUpperCase();

        // Fallback: try the visible title ("... Klasse F7")
        const titleEl = tile.querySelector('.product-item-link');
        const titleText = titleEl ? titleEl.textContent : '';
        match = titleText.match(/Klasse\s+([A-Za-z0-9+]+)/i);
        return match ? match[1].toUpperCase() : null;
    }

    function extractBrandBullet(tile) {
        const badge = tile.querySelector('div.bg-blue-prussian');
        if (badge && badge.textContent.trim() === 'Tops filters merk') {
            return TOPS_BULLET;
        }

        const titleEl = tile.querySelector('.product-item-link');
        const codeEl = tile.querySelector('.product-item-code');
        const haystack = ((titleEl ? titleEl.textContent : '') + ' ' + (codeEl ? codeEl.textContent : ''));

        for (const brand in BRAND_MAP) {
            if (haystack.indexOf(brand) !== -1) {
                return BRAND_MAP[brand];
            }
        }
        return null;
    }

    function buildBulletList(bullets) {
        const ul = document.createElement('ul');
        ul.className = 'gmd-bullets';
        bullets.forEach((text) => {
            const li = document.createElement('li');
            li.className = 'flex items-start';
            li.innerHTML = '<span class="gmd-dot" aria-hidden="true">&middot;</span><span>' + text + '</span>';
            ul.appendChild(li);
        });
        return ul;
    }

    function injectBullets(tile) {
        if (tile.hasAttribute('data-bullets-injected')) return;

        const filterclass = extractFilterclass(tile);
        const brandBullet = extractBrandBullet(tile);

        const bullet1 = filterclass ? `${filterclass} filter` : null;
        const bullet2 = filterclass ? FILTERCLASS_MAP[filterclass] : null;
        const bullets = [bullet1, bullet2, brandBullet].filter(Boolean);

        if (!bullets.length) {
            return;
        }

        // Insert after every stock/availability paragraph in this tile
        // (there are separate mobile & desktop instances)
        const stockParagraphs = tile.querySelectorAll('p.stock');
        stockParagraphs.forEach((p) => {
            const wrapper = p.closest('.text-left') || p.parentElement;
            wrapper.insertAdjacentElement('afterend', buildBulletList(bullets));
        });

        tile.setAttribute('data-bullets-injected', 'true');
    }

    function processAllTiles(root = document) {
        root.querySelectorAll('.product-item').forEach(injectBullets);
    }

    function waitForElement(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== 'undefined') ?
            callback(elements) : setTimeout(() => waitForElement(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    waitForElement('.product-item', () => {
        document.body.classList.add(testInfo.className)
        processAllTiles();

        // Catch tiles added/re-rendered later (sort, filter, pagination, infinite scroll)
        const grid = document.querySelector('.products-grid, .product-items') || document.body;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                m.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return;
                    if (node.matches && node.matches('.product-item')) {
                        injectBullets(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('.product-item').forEach(injectBullets);
                    }
                });
            });
        });
        observer.observe(grid, { childList: true, subtree: true });
    });
})();