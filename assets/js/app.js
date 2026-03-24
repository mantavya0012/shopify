const STORAGE_KEYS = {
  cart: 'nova_cart',
  wishlist: 'nova_wishlist',
  theme: 'velvora_theme',
  user: 'velvora_user'
};

const ROOT = window.location.pathname.includes('/pages/') ? '..' : '.';
const getJSON = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const $ = (s) => document.querySelector(s);

function headerTemplate() {
  const user = getJSON(STORAGE_KEYS.user, null);
  return `<header class="sticky-header glass">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
      <a href="${ROOT}/index.html" class="flex items-center gap-2">
        <img src="${ROOT}/assets/images/velvora-logo.svg" alt="Velvora" class="h-9 w-auto" />
      </a>
      <nav class="hidden md:flex gap-6 text-sm font-medium">
        <a class="nav-link" href="${ROOT}/index.html">Home</a>
        <a class="nav-link" href="${ROOT}/pages/products.html">Shop</a>
        <a class="nav-link" href="${ROOT}/pages/about.html">About</a>
        <a class="nav-link" href="${ROOT}/pages/contact.html">Contact</a>
      </nav>
      <div class="flex items-center gap-2 text-sm">
        <button id="theme-toggle" class="px-3 py-2 rounded-xl btn-secondary">🌓</button>
        <button id="auth-open" class="px-3 py-2 rounded-xl btn-secondary">${user?.name ? user.name.split(' ')[0] : 'Login'}</button>
        <a href="${ROOT}/pages/cart.html" class="px-3 py-2 rounded-xl btn-secondary">Cart <span id="cart-count" class="badge">0</span></a>
      </div>
    </div>
  </header>`;
}

function footerTemplate() {
  return `<footer class="mt-20 border-t border-slate-300/20 py-10 text-sm text-muted"><div class="max-w-7xl mx-auto px-4 grid gap-6 md:grid-cols-3"><div><img src="${ROOT}/assets/images/velvora-logo.svg" alt="Velvora" class="h-8 w-auto"><p class="mt-2">Premium futuristic shopping experiences.</p></div><div><h4 class="font-semibold text-current">Explore</h4><ul class="mt-2 space-y-1"><li><a href="${ROOT}/pages/products.html">Products</a></li><li><a href="${ROOT}/pages/checkout.html">Checkout</a></li></ul></div><div><h4 class="font-semibold text-current">Trust</h4><p class="mt-2">Secure payments and location-aware shipping options.</p></div></div></footer>`;
}

function authModalTemplate() {
  return `<div id="auth-modal" class="auth-modal">
    <div class="glass rounded-2xl p-6 w-full max-w-md surface-strong">
      <div class="flex justify-between items-center mb-4"><h3 class="text-xl font-bold">Welcome to Velvora</h3><button id="auth-close" class="btn-secondary px-3 py-1 rounded-lg">✕</button></div>
      <div class="space-y-4">
        <button id="google-login" class="w-full btn-primary px-4 py-3 rounded-xl">Continue with Google</button>
        <div class="text-center text-xs text-muted">or login with mobile number</div>
        <input id="mobile-number" class="input" placeholder="+1 555 123 4567" />
        <div class="flex gap-2"><button id="send-otp" class="btn-secondary px-4 py-2 rounded-xl w-1/2">Send OTP</button><input id="otp-input" class="input w-1/2" placeholder="OTP" /></div>
        <button id="verify-otp" class="w-full btn-primary px-4 py-2 rounded-xl">Verify & Login</button>
      </div>
    </div>
  </div>`;
}

function mountLayout() {
  const h = $('#site-header');
  const f = $('#site-footer');
  if (h) h.innerHTML = headerTemplate();
  if (f) f.innerHTML = footerTemplate();
  if (!$('#auth-modal')) document.body.insertAdjacentHTML('beforeend', authModalTemplate());
}

function initTheme() {
  if (localStorage.getItem(STORAGE_KEYS.theme) === 'light') document.documentElement.classList.add('light');
  document.addEventListener('click', (e) => {
    if (e.target.id === 'theme-toggle') {
      document.documentElement.classList.toggle('light');
      localStorage.setItem(STORAGE_KEYS.theme, document.documentElement.classList.contains('light') ? 'light' : 'dark');
    }
  });
}

function updateCartBadge() {
  const count = getJSON(STORAGE_KEYS.cart).reduce((a, i) => a + i.qty, 0);
  const el = $('#cart-count');
  if (el) el.textContent = count;
}

function productCard(product) {
  const wished = getJSON(STORAGE_KEYS.wishlist).includes(product.id);
  return `<article class="product-card glass card-hover rounded-2xl overflow-hidden border border-slate-200/10"><img loading="lazy" src="${product.image}" alt="${product.title}" class="h-56 w-full object-cover"><div class="p-4 space-y-3"><div class="flex justify-between items-center"><span class="badge">${product.badge}</span><button data-action="wishlist" data-id="${product.id}" class="text-xl">${wished ? '❤️' : '🤍'}</button></div><h3 class="font-semibold">${product.title}</h3><p class="text-sm text-muted">${product.description}</p><div class="flex items-center justify-between"><span class="price">$${product.price}</span><button data-action="add" data-id="${product.id}" class="btn-primary px-3 py-2 rounded-xl text-sm">Add to cart</button></div></div></article>`;
}

function wireStoreActions(root = document) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === 'add') {
      const cart = getJSON(STORAGE_KEYS.cart);
      const ex = cart.find((i) => i.id === id);
      if (ex) ex.qty += 1; else cart.push({ id, qty: 1 });
      setJSON(STORAGE_KEYS.cart, cart);
      updateCartBadge();
      btn.textContent = 'Added ✓';
      setTimeout(() => (btn.textContent = 'Add to cart'), 900);
    }
    if (btn.dataset.action === 'wishlist') {
      const list = getJSON(STORAGE_KEYS.wishlist);
      const idx = list.indexOf(id);
      idx >= 0 ? list.splice(idx, 1) : list.push(id);
      setJSON(STORAGE_KEYS.wishlist, list);
      btn.textContent = idx >= 0 ? '🤍' : '❤️';
    }
  });
}

function initAuth() {
  let pendingOtp = null;
  document.addEventListener('click', (e) => {
    if (e.target.id === 'auth-open') $('#auth-modal')?.classList.add('open');
    if (e.target.id === 'auth-close' || e.target.id === 'auth-modal') $('#auth-modal')?.classList.remove('open');
    if (e.target.id === 'google-login') {
      const name = prompt('Google OAuth demo: Enter your name');
      if (name) {
        setJSON(STORAGE_KEYS.user, { name, provider: 'google' });
        location.reload();
      }
    }
    if (e.target.id === 'send-otp') {
      pendingOtp = String(Math.floor(100000 + Math.random() * 900000));
      alert(`Demo OTP: ${pendingOtp}`);
    }
    if (e.target.id === 'verify-otp') {
      const mobile = $('#mobile-number')?.value.trim();
      const otp = $('#otp-input')?.value.trim();
      if (mobile && otp && otp === pendingOtp) {
        setJSON(STORAGE_KEYS.user, { name: mobile, provider: 'mobile' });
        location.reload();
      } else alert('Invalid OTP. Try again.');
    }
  });
}

function renderProducts(selector, products) {
  const host = $(selector);
  if (host) host.innerHTML = products.map(productCard).join('');
}

function initSearchSuggestions(inputSel = '#search', listSel = '#search-suggestions') {
  const input = $(inputSel), list = $(listSel);
  if (!input || !list) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) return (list.innerHTML = '');
    const matches = STORE_DATA.products.filter((p) => p.title.toLowerCase().includes(q)).slice(0, 5);
    list.innerHTML = matches.map((m) => `<a class="block p-2 hover:bg-indigo-500/10 rounded-lg" href="${ROOT}/pages/product.html?id=${m.id}">${m.title}</a>`).join('');
  });
}

function initPreloader() { window.addEventListener('load', () => { const pre = $('#preloader'); if (pre) setTimeout(() => pre.classList.add('hidden'), 350); }); }
function animateEntry() { if (window.gsap) gsap.from('[data-animate]', { y: 26, opacity: 0, stagger: 0.07, duration: 0.6, ease: 'power2.out' }); }

function bootstrap() {
  mountLayout();
  initTheme();
  initAuth();
  updateCartBadge();
  wireStoreActions();
  initPreloader();
  animateEntry();
}

document.addEventListener('DOMContentLoaded', bootstrap);
