const byId = (id) => STORE_DATA.products.find((p) => p.id === Number(id));

function homePage() {
  renderProducts('#featured-products', STORE_DATA.products.slice(0, 4));
  renderProducts('#trending-products', STORE_DATA.products.slice(2));
  const cat = document.getElementById('categories');
  if (cat) cat.innerHTML = STORE_DATA.categories.filter(c => c.id !== 'all').map((c) => `<article class="glass rounded-2xl p-5 card-hover"><h3 class="font-bold text-lg">${c.name}</h3><p class="text-muted text-sm mt-2">Curated ${c.name.toLowerCase()} collections.</p></article>`).join('');
  const t = document.getElementById('testimonials');
  if (t) t.innerHTML = STORE_DATA.testimonials.map((x) => `<blockquote class="glass rounded-2xl p-5"><p>“${x.quote}”</p><footer class="mt-4 text-sm text-muted">${x.name} · ${x.role}</footer></blockquote>`).join('');
  initSearchSuggestions();
}

function productsPage() {
  let filtered = [...STORE_DATA.products];
  const grid = document.getElementById('products-grid');
  const category = document.getElementById('filter-category');
  const sort = document.getElementById('sort-by');
  const maxPrice = document.getElementById('filter-price');
  const rating = document.getElementById('filter-rating');
  category.innerHTML = STORE_DATA.categories.map(c => `<option value=\"${c.id}\">${c.name}</option>`).join('');

  const apply = () => {
    filtered = STORE_DATA.products.filter((p) =>
      (category.value === 'all' || p.category === category.value) &&
      p.price <= Number(maxPrice.value || 1000) &&
      p.rating >= Number(rating.value || 0)
    );
    if (sort.value === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort.value === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sort.value === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    grid.innerHTML = filtered.map(productCard).join('');
  };

  [category, sort, maxPrice, rating].forEach((el) => el.addEventListener('input', apply));
  document.getElementById('view-toggle').addEventListener('click', () => grid.classList.toggle('list-view'));
  apply();
}

function productDetailPage() {
  const params = new URLSearchParams(location.search);
  const product = byId(params.get('id')) || STORE_DATA.products[0];
  document.getElementById('product-detail').innerHTML = `
    <div class="grid lg:grid-cols-2 gap-8">
      <div class="space-y-3">
        <img id="main-image" src="${product.image}" class="w-full h-[480px] object-cover rounded-2xl glass" alt="${product.title}">
        <div class="grid grid-cols-3 gap-3">${[1,2,3].map(() => `<img src="${product.image}" class="thumb h-24 w-full object-cover rounded-xl cursor-zoom-in" alt="${product.title}">`).join('')}</div>
      </div>
      <div class="space-y-4">
        <span class="badge">${product.badge}</span><h1 class="text-3xl font-black">${product.title}</h1><p class="text-muted">${product.description}</p>
        <p class="price">$${product.price}</p>
        <div><h3 class="font-semibold mb-2">Size</h3><div class="flex gap-2">${product.sizes.map((s) => `<button class="glass px-3 py-2 rounded-xl">${s}</button>`).join('')}</div></div>
        <div><h3 class="font-semibold mb-2">Color</h3><div class="flex gap-2">${product.colors.map((c) => `<button class="glass px-3 py-2 rounded-xl">${c}</button>`).join('')}</div></div>
        <button data-action="add" data-id="${product.id}" class="btn-primary px-5 py-3 rounded-xl">Add to cart</button>
      </div>
    </div>`;
  document.querySelectorAll('.thumb').forEach((thumb) => thumb.addEventListener('mouseenter', () => document.getElementById('main-image').src = thumb.src));
  renderProducts('#related-products', STORE_DATA.products.filter((p) => p.id !== product.id).slice(0, 3));
}

function cartPage() {
  const wrap = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const render = () => {
    const cart = getJSON(STORAGE_KEYS.cart);
    const rows = cart.map((item) => {
      const product = byId(item.id);
      return `<div class="glass rounded-2xl p-4 flex flex-wrap gap-4 justify-between items-center"><div><h3 class="font-semibold">${product.title}</h3><p class="text-muted text-sm">$${product.price}</p></div><div class="flex gap-2 items-center"><button data-qty="-1" data-id="${item.id}" class="glass px-3 py-1 rounded-lg">-</button><span>${item.qty}</span><button data-qty="1" data-id="${item.id}" class="glass px-3 py-1 rounded-lg">+</button></div></div>`;
    });
    wrap.innerHTML = rows.length ? rows.join('') : '<p class="text-muted">Cart is empty.</p>';
    const total = cart.reduce((sum, item) => sum + byId(item.id).price * item.qty, 0);
    totalEl.textContent = `$${total.toFixed(2)}`;
    updateCartBadge();
  };

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-qty]');
    if (!btn) return;
    const cart = getJSON(STORAGE_KEYS.cart);
    const line = cart.find((x) => x.id === Number(btn.dataset.id));
    line.qty += Number(btn.dataset.qty);
    const clean = cart.filter((x) => x.qty > 0);
    setJSON(STORAGE_KEYS.cart, clean);
    render();
  });
  render();
}

function initPage() {
  const page = document.body.dataset.page;
  if (page === 'home') homePage();
  if (page === 'products') productsPage();
  if (page === 'product') productDetailPage();
  if (page === 'cart') cartPage();
}

document.addEventListener('DOMContentLoaded', initPage);
