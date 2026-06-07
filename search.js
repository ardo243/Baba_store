document.addEventListener("DOMContentLoaded", () => {
    // 1. Identify context (subpage vs home page)
    const isSubpage = window.location.pathname.includes('/card_game/');
    const basePath = isSubpage ? '../' : '';
    const pagePath = isSubpage ? '' : 'card_game/';

    // 2. Product database
    const products = [
        // Games
        { name: "Mobile Legends", type: "Game Top Up", link: "beli-ml.html", image: "ml.jpg" },
        { name: "Free Fire", type: "Game Top Up", link: "beli-ff.html", image: "ff.png" },
        { name: "PUBG Mobile", type: "Game Top Up", link: "beli-pubg.html", image: "pubg.jpg" },
        { name: "Valorant", type: "Game Top Up", link: "beli-valorant.html", image: "valorant.jpg" },
        { name: "Call of Duty", type: "Game Top Up", link: "beli-cod.html", image: "call.jpg" },
        { name: "Roblox", type: "Game Top Up", link: "beli-roblox.html", image: "roblox.png" },
        // Apps Pro
        { name: "Canva Pro", type: "App Pro Premium", link: "beli-canva.html", image: "canva.jpg" },
        { name: "Capcut Pro", type: "App Pro Premium", link: "beli-capcut.html", image: "capcut.png" },
        { name: "ChatGPT Plus Pro", type: "App Pro Premium", link: "beli-gpt.html", image: "chatgpt.jpg" },
        { name: "Netflix Premium", type: "App Pro Premium", link: "beli-netflix.html", image: "netfilx.jpg" },
        { name: "Vidio Premier", type: "App Pro Premium", link: "beli-vidio.html", image: "video.jpg" },
        { name: "WeTV VIP Premium", type: "App Pro Premium", link: "beli-wetv.html", image: "wetv.jpg" },
        { name: "Spotify Premium", type: "App Pro Premium", link: "beli-spotify.html", image: "spotify.png" }
    ];

    // 3. Setup header navigation links dynamically
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length >= 4) {
        const homeLink = navLinks[0];
        const topUpLink = navLinks[1];
        const appProLink = navLinks[2];
        const helpLink = navLinks[3];

        homeLink.href = isSubpage ? `${basePath}utama.html` : '#';
        topUpLink.href = isSubpage ? `${basePath}utama.html#top-up-game` : '#top-up-game';
        appProLink.href = isSubpage ? `${basePath}utama.html#app-pro` : '#app-pro';
        helpLink.href = isSubpage ? `${basePath}utama.html#footer` : '#footer';

        // Set active link depending on context
        navLinks.forEach(link => link.classList.remove('active'));
        if (!isSubpage) {
            // Check hash to set active
            const updateActiveLink = () => {
                navLinks.forEach(link => link.classList.remove('active'));
                if (window.location.hash === '#top-up-game') {
                    topUpLink.classList.add('active');
                } else if (window.location.hash === '#app-pro') {
                    appProLink.classList.add('active');
                } else {
                    homeLink.classList.add('active');
                }
            };
            window.addEventListener('hashchange', updateActiveLink);
            updateActiveLink();
        } else {
            const filename = window.location.pathname.split('/').pop();
            const proPages = ['beli-canva.html', 'beli-capcut.html', 'beli-gpt.html', 'beli-netflix.html', 'beli-vidio.html', 'beli-wetv.html', 'beli-spotify.html'];
            if (proPages.includes(filename)) {
                appProLink.classList.add('active');
            } else {
                topUpLink.classList.add('active');
            }
        }

        // Smooth scroll implementation on the homepage
        const setupSmoothScroll = (link, targetId) => {
            link.addEventListener('click', (e) => {
                if (!isSubpage) {
                    e.preventDefault();
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.history.pushState(null, null, `#${targetId}`);
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        };

        setupSmoothScroll(topUpLink, 'top-up-game');
        setupSmoothScroll(appProLink, 'app-pro');
        setupSmoothScroll(helpLink, 'footer');
    }

    // 4. Create and inject search results dropdown
    const searchContainer = document.querySelector('.search-bar-container');
    const searchInput = searchContainer ? searchContainer.querySelector('input') : null;

    if (searchContainer && searchInput) {
        const dropdown = document.createElement('div');
        dropdown.className = 'search-results-dropdown';
        searchContainer.appendChild(dropdown);

        // Input listener for search
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // A. Live card filtering on homepage
            if (!isSubpage) {
                const sections = document.querySelectorAll('.game-section');
                sections.forEach(section => {
                    const cards = section.querySelectorAll('.card-link');
                    let visibleCount = 0;
                    cards.forEach(card => {
                        const title = card.querySelector('h3').textContent.toLowerCase();
                        if (title.includes(query)) {
                            card.style.display = '';
                            visibleCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    if (visibleCount === 0 && query !== '') {
                        section.style.display = 'none';
                    } else {
                        section.style.display = '';
                    }
                });
            }

            // B. Populating dropdown list
            if (query === '') {
                dropdown.classList.remove('active');
                dropdown.innerHTML = '';
                return;
            }

            const matches = products.filter(p => p.name.toLowerCase().includes(query) || p.type.toLowerCase().includes(query));
            
            if (matches.length === 0) {
                dropdown.innerHTML = `<div class="search-no-results">Produk tidak ditemukan</div>`;
            } else {
                dropdown.innerHTML = matches.map(p => `
                    <a href="${basePath}${pagePath}${p.link}" class="search-result-item">
                        <img src="${basePath}images/${p.image}" alt="${p.name}" onerror="this.style.display='none';">
                        <div class="item-details">
                            <span class="item-name">${p.name}</span>
                            <span class="item-type">${p.type}</span>
                        </div>
                    </a>
                `).join('');
            }
            dropdown.classList.add('active');
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Show dropdown again when input is focused and not empty
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() !== '') {
                dropdown.classList.add('active');
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
            }
        });
    }
});
