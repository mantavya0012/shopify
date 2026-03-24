const STORAGE_KEYS = {
  cart: 'nova_cart',
  wishlist: 'nova_wishlist',
  theme: 'nova_theme'
};

const ROOT = window.location.pathname.includes('/pages/') ? '..' : '.';
const getJSON = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const $ = (s) => document.querySelector(s);

function headerTemplate() {
  return `<header class="sticky-header glass">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
      <a href="${ROOT}/index.html" class="font-black text-xl tracking-wider">NOVA<span class="text-indigo-500">.STORE</span></a>
      <nav class="hidden md:flex gap-6 text-sm font-medium">
        <a class="nav-link" href="${ROOT}/index.html">Home</a>
        <a class="nav-link" href="${ROOT}/pages/products.html">Shop</a>
        <a class="nav-link" href="${ROOT}/pages/about.html">About</a>
        <a class="nav-link" href="${ROOT}/pages/contact.html">Contact</a>
      </nav>
      <div class="flex items-center gap-2">
        <button id="theme-toggle" class="px-3 py-2 rounded-xl glass text-sm">🌓</button>
        <a href="${ROOT}/pages/cart.html" class="px-3 py-2 rounded-xl glass text-sm">Cart <span id="cart-count" class="badge">0</span></a>
      </div>
    </div>
  </header>`;
}

function footerTemplate() {
  return `<footer class="mt-20 border-t border-slate-300/20 py-10 text-sm text-muted"><div class="max-w-7xl mx-auto px-4 grid gap-6 md:grid-cols-3"><div><h4 class="font-bold text-base text-current">NOVA.STORE</h4><p class="mt-2">Premium futuristic eCommerce experience, Liquid-ready.</p></div><div><h4 class="font-semibold text-current">Pages</h4><ul class="mt-2 space-y-1"><li><a href="${ROOT}/pages/products.html">Products</a></li><li><a href="${ROOT}/pages/checkout.html">Checkout UI</a></li></ul></div><div><h4 class="font-semibold text-current">Newsletter</h4><p class="mt-2">Be first to access launches and drops.</p></div></div></footer>`;
}

function mountLayout() { const h = $('#site-header'); const f = $('#site-footer'); if (h) h.innerHTML = headerTemplate(); if (f) f.innerHTML = footerTemplate(); }

function initTheme() {
  if (localStorage.getItem(STORAGE_KEYS.theme) === 'dark') document.documentElement.classList.add('dark');
  document.addEventListener('click', (e) => {
    if (e.target.id === 'theme-toggle') {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem(STORAGE_KEYS.theme, document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }
  });
}

function updateCartBadge() {
  const count = getJSON(STORAGE_KEYS.cart).reduce((a, i) => a + i.qty, 0);
  const el = $('#cart-count'); if (el) el.textContent = count;
}

function productCard(product) {
  const wished = getJSON(STORAGE_KEYS.wishlist).includes(product.id);
  return `<article class="product-card glass card-hover rounded-2xl overflow-hidden border border-slate-200/10"><img loading="lazy" src="${product.image}" alt="${product.title}" class="h-56 w-full object-cover"><div class="p-4 space-y-3"><div class="flex justify-between items-center"><span class="badge">${product.badge}</span><button data-action="wishlist" data-id="${product.id}" class="text-xl">${wished ? '❤️' : '🤍'}</button></div><h3 class="font-semibold">${product.title}</h3><p class="text-sm text-muted">${product.description}</p><div class="flex items-center justify-between"><span class="price">$${product.price}</span><button data-action="add" data-id="${product.id}" class="btn-primary px-3 py-2 rounded-xl text-sm">Add to cart</button></div></div></article>`;
}

function wireStoreActions(root = document) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]'); if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === 'add') {
      const cart = getJSON(STORAGE_KEYS.cart); const ex = cart.find((i) => i.id === id);
      if (ex) ex.qty += 1; else cart.push({ id, qty: 1 });
      setJSON(STORAGE_KEYS.cart, cart); updateCartBadge(); btn.textContent = 'Added ✓'; setTimeout(() => (btn.textContent = 'Add to cart'), 900);
    }
    if (btn.dataset.action === 'wishlist') {
      const list = getJSON(STORAGE_KEYS.wishlist); const idx = list.indexOf(id);
      idx >= 0 ? list.splice(idx, 1) : list.push(id); setJSON(STORAGE_KEYS.wishlist, list); btn.textContent = idx >= 0 ? '🤍' : '❤️';
    }
  });
}

function renderProducts(selector, products) { const host = $(selector); if (host) host.innerHTML = products.map(productCard).join(''); }

function initSearchSuggestions(inputSel = '#search', listSel = '#search-suggestions') {
  const input = $(inputSel), list = $(listSel); if (!input || !list) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim(); if (!q) return (list.innerHTML = '');
    const matches = STORE_DATA.products.filter((p) => p.title.toLowerCase().includes(q)).slice(0, 5);
    list.innerHTML = matches.map((m) => `<a class="block p-2 hover:bg-indigo-500/10 rounded-lg" href="${ROOT}/pages/product.html?id=${m.id}">${m.title}</a>`).join('');
  });
}

function initPreloader() { window.addEventListener('load', () => { const pre = $('#preloader'); if (pre) setTimeout(() => pre.classList.add('hidden'), 400); }); }
function animateEntry() { if (window.gsap) gsap.from('[data-animate]', { y: 24, opacity: 0, stagger: 0.07, duration: 0.65, ease: 'power2.out' }); }

function bootstrap() { mountLayout(); initTheme(); updateCartBadge(); wireStoreActions(); initPreloader(); animateEntry(); }
document.addEventListener('DOMContentLoaded', bootstrap);
