# True Frequency — new storefront

A fresh storefront featuring the full product catalog from buytfp.com
(130 products, 13 categories), designed as a precision instrument: paper/ink
palette with a single signal-orange accent, Archivo Expanded display type with
IBM Plex Mono spec annotations, hairline-ruled catalog grids with index
numbers, product photos multiply-blended into the page, a scroll-reactive
oscilloscope, and cursor-tracking previews on the category index.

React 18 + Vite + React Router. No CSS framework — the design system lives in
`src/styles/global.css`.

## Commands

```bash
npm run dev       # dev server on http://localhost:5180
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Layout

- `src/data/products.js` — the catalog, ported from buy-tfp (edit products here)
- `src/data/catalog.js` — categories, helpers, per-variant price overrides
- `src/config/brand.js` — site name / tagline / support email (one place to rebrand)
- `src/config/square.js` — Square credential stub (see below)
- `src/pages/` — Home, Shop (filter/search/sort), ProductDetail, Checkout, NotFound
- `src/context/CartContext.jsx` — cart state, persisted to localStorage
- `public/products/` — product images (webp), copied from buy-tfp

## Still to come (intentionally stubbed)

- **Square payments** — `src/config/square.js` reads `VITE_SQUARE_APP_ID` and
  `VITE_SQUARE_LOCATION_ID` from the environment. Until they're set, the
  checkout page shows a "payments almost ready" notice. When credentials
  arrive, wire the Square Web Payments SDK into `src/pages/Checkout.jsx`.
- **Automated emails** — not started; planned separately.

## Deploy note

This is a single-page app: the host must rewrite all paths to `/index.html`
(e.g. Firebase Hosting `rewrites`, Netlify `_redirects`, or Vercel default).
