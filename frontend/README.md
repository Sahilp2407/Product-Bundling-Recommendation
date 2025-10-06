# Frontend Folder

This folder groups all UI and static-site assets. No files were moved yet (organizational split only), so existing imports keep working.

## Suggested contents (present in project root now)
- HTML
  - `index.html`
  - `landing.html`
  - `product.html`
  - `login.html`
  - `bundling-report.html`
- Styles
  - `styles/` (all CSS)
- JavaScript (UI)
  - `product.js` (checkout UI, address save trigger)
  - `product-bundles.js` (bundle modal, recommendations)
  - `cart.js` (cart add/remove, totals)
  - `login.js` (auth UI)
  - `header-auth.js` / `main.js` (if present)
- Assets
  - images/fonts/icons (served statically)
- React demo (optional)
  - `react-bundle/` (index.html → /src/main.jsx)

## Note
If you want a full physical move, say “move files” and I will relocate these into `frontend/` and update all script paths accordingly.
