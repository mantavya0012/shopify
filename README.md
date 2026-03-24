# VELVORA — Futuristic eCommerce Theme (Shopify-ready)

A complete, premium eCommerce frontend inspired by advanced Hookaba-style aesthetics, built with HTML5 + Tailwind + Vanilla JavaScript + GSAP.

## Core Features

- Deep futuristic dark UI with optional light mode toggle
- Velvora branded logo and premium glassmorphism surfaces
- Animated sticky navbar, preloader, smooth motion transitions
- Home page with hero, featured products, trending grid, categories, testimonials, newsletter
- Product listing with filters, sorting, and grid/list toggle
- Product detail with image gallery interactions, variants UI, related products
- Cart with localStorage persistence, quantity updates, and total price calculation
- Checkout UI with multiple payment methods (Card/UPI/PayPal/COD)
- Login UX: Google-style login demo + mobile number OTP demo
- Map/location detection integration using Leaflet + browser geolocation
- Wishlist, search suggestions, lazy-loaded product images
- SEO-ready metadata and responsive/mobile-first layout

## Structure

- `index.html`
- `pages/` (products, product detail, cart, checkout, about, contact)
- `assets/css/styles.css`
- `assets/js/data.js`
- `assets/js/app.js`
- `assets/js/pages.js`
- `assets/images/velvora-logo.svg`
- `layout/`, `sections/`, `templates/`, `config/` for Shopify Liquid migration

## Run locally

```bash
python3 -m http.server 8080
```

Open:

- `http://localhost:8080/index.html`

## Shopify conversion guide

1. Copy `assets/css/styles.css`, `assets/js/*.js`, and `assets/images/velvora-logo.svg` into Shopify `assets`.
2. Merge `layout/theme.liquid` with your active Shopify layout.
3. Convert static sections into dynamic Liquid sections and schema:
   - Hero -> `sections/home-hero.liquid`
   - Featured products -> `sections/home-featured-products.liquid`
   - Testimonials -> `sections/home-testimonials.liquid`
4. Replace mock data (`assets/js/data.js`) with Liquid-rendered product/collection JSON.
5. Replace localStorage cart with Shopify AJAX Cart APIs (`/cart/add.js`, `/cart.js`).
6. Replace mock auth with Shopify customer accounts or external OAuth/OTP provider.
7. Connect payment and location choices to your backend and shipping-rate logic.

## Notes

- Login, OTP, and payments in this project are UI/demo flows (frontend only).
- Geolocation requires browser permission to detect live coordinates.
