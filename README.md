# NOVA.STORE — Futuristic eCommerce Theme (Shopify-ready)

A complete, modern, premium eCommerce frontend inspired by Hookaba-level aesthetics, built with HTML5 + Tailwind + Vanilla JavaScript + GSAP.

## Features

- Dark / light mode with local persistence
- Animated sticky glassmorphism header
- Hero with premium CTA and motion entry
- Featured + trending product sections
- Product listing with filter/sort/grid-list toggle
- Product detail with gallery, variants UI, related products
- Cart with localStorage persistence, quantity controls, total calculation
- Checkout page UI (frontend only)
- About + Contact pages
- Wishlist and search suggestions
- Lazy-loaded images and SEO meta tags
- Preloader + micro-interactions + smooth transitions

## Structure

- `index.html`
- `pages/` (products, product detail, cart, checkout, about, contact)
- `assets/css/styles.css`
- `assets/js/data.js`
- `assets/js/app.js`
- `assets/js/pages.js`
- `layout/`, `sections/`, `templates/`, `config/` for Shopify Liquid migration

## Run locally

Use any static server, for example:

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080/index.html`

## Shopify conversion guide

1. Copy `assets/css/styles.css`, `assets/js/*.js` into Shopify theme `assets`.
2. Start from `layout/theme.liquid` in this repo and merge with existing theme layout.
3. Map each static section to Liquid sections:
   - Hero → `sections/home-hero.liquid`
   - Featured products → `sections/home-featured-products.liquid`
   - Testimonials → `sections/home-testimonials.liquid`
4. Replace JS mock product data (`assets/js/data.js`) with Liquid-rendered JSON from collections/products.
5. Replace local cart/wishlist actions with Shopify AJAX API (`/cart/add.js`, `/cart.js`) and customer accounts.
6. Wire search to Shopify predictive search endpoint.
7. Move checkout CTA to `{{ routes.cart_url }}` and native checkout URL.

## Notes

- Liquid placeholder comments are embedded where Shopify dynamic data can be inserted.
- Checkout is UI-only by design in this starter.
