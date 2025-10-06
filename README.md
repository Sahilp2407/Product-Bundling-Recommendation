# Techno‑Gen E‑Commerce Site

A modern single‑page shopping experience inspired by boAt, built with modular vanilla JS, HTML, and CSS. It features a home page with “Big Deals”, a product detail page with an enhanced checkout + bundle modal, Firebase integration, and a clean componentized structure.

## Overview
- **Home**: `index.html` with banner carousel, deals, filters, and “Latest Phones”. Logic in `main.js`.
- **Product detail**: `product.html` with gallery, color variants, bundle modal, and a multi‑step checkout. Logic in `product.js` and `product-bundles.js`.
- **Cart utilities**: Local cart stored in `localStorage`, in `cart.js`.
- **Auth & backend**: Firebase Web SDK v10.13.0 (Auth, Firestore, Functions) configured in `firebase.js`.

## Tech Stack
- **Frontend**: Vanilla JS (ES Modules), HTML5, CSS3.
- **Icons**: Font Awesome.
- **Data**: Local JS arrays/objects + Firestore (optional) via Firebase SDK.
- **Auth**: Firebase Auth (email/password, Google, phone — wired, UI flow minimal/demo).
- **Storage**: `localStorage` for cart and UI state.

## Project Structure
```
boat/
├─ index.html                  # Home page
├─ index.css                   # Global/home styles
├─ main.js                     # Home logic (carousel, products, filters)
├─ product.html                # Product detail page
├─ styles/product.css          # Product page styles
├─ product.js                  # Product page logic (gallery, checkout)
├─ product-bundles.js          # Bundle modal UI + recommendations
├─ cart.js                     # Cart helpers (localStorage)
├─ firebase.js                 # Firebase SDK 10.13.0 initialization
├─ header-auth.js              # Auth header helpers (if present)
└─ react-bundle/ ...           # Separate example app (not required for core flow)
```

## Firebase Setup (SDK v10.13.0)
Firebase modules are imported from the CDN using the same version across modules:

- `firebase-app`: `https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js`
- `firebase-auth`: `https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js`
- `firebase-firestore`: `https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js`
- `firebase-functions`: `https://www.gstatic.com/firebasejs/10.13.0/firebase-functions.js`

See `firebase.js` for:
- `initializeApp(firebaseConfig)`
- Exports: `auth`, `db` (Firestore), `functions`, and helpers like `httpsCallable`, `serverTimestamp`.
- Optional `onAuthStateChanged` to monitor login state.

If you need to update Firebase, bump the version in all CDN URLs consistently.

## How to Run Locally
1. Use a simple static server (e.g., VS Code Live Server or `npx serve`).
2. Open `index.html` for the home page or `product.html` directly for the product flow.
3. Ensure mixed content is avoided (prefer HTTPS images/CDN URLs).

## Key Features
- **Banner Carousel** (`main.js`):
  - Arrow/dot controls and auto‑slide with modular index wrap (modulo arithmetic).
- **Big Deals + Filters** (`index.html`, `main.js`):
  - Category tabs filter cards via data attributes.
  - Additional sidebar filters and sort options apply to full product list.
- **Latest Phones Row** (`index.html`, `main.js`):
  - Renders exactly three phones: iPhone 15, Samsung Galaxy S23, OnePlus 12.
  - Clean card design: image, rating, name, price, discount; feature chips removed as requested.
- **Search** (`main.js`):
  - Live search on name/category across the product grid (phones excluded from the general grid so they remain in Latest Phones).
- **Product Page** (`product.html`, `product.js`):
  - Image gallery with thumbnails and next/prev.
  - Color variants switcher.
  - Multi‑step checkout overlay with validation and dynamic payment CTA text.
  - Inline extras summary when accessories are added via the bundle modal.
- **Bundle Modal (Complete your bundle)** (`product-bundles.js`):
  - Polished UI: animated, responsive grid, selected state, dynamic CTA text and disabled state.
  - Overlay click + Esc close, focus management for accessibility.
- **Cart** (`cart.js`):
  - `addItemToCart`, `addManyToCart`, `removeItemsFromCart`, badge updates, and computed totals.

## Data Structures & Algorithms (DSA)
- **Graph + BFS (Recommendations)**
  - File: `product-bundles.js`
  - Structure: `GRAPH` = `Map<string, Set<string>>` representing products/accessories as nodes; `link(a,b)` creates undirected edges.
  - Algorithm: `bfsAccessories(startId, maxDepth=1)` traverses neighbors to collect relevant accessories within one hop.
  - Complexity: O(V+E) for traversal; suitable for small catalogs; easily extendable by increasing depth.

- **Fallback Heuristic (Filtering by Tags/Categories)**
  - File: `product-bundles.js` `buildFallbackItems()` filters by tags (`universal`, `earbuds`) and category when no curated/graph recommendations exist.
  - Uses Array filtering and slicing; deterministic and simple.

- **Maps/Sets for Fast Lookup**
  - File: `product-bundles.js`
  - `Map` and `Set` used to avoid duplicates and achieve O(1) expected membership checks.

- **Sorting**
  - File: `main.js` `filterProducts()`
  - Multiple comparators (`price-low-high`, `price-high-low`, `rating`, `reviews`, `newest`) using stable Array `.sort()` with O(n log n) complexity.

- **Filtering (Predicate‑based)**
  - Files: `main.js`, `product-bundles.js`
  - Category, price range, features, and rating filters combine predicates and short‑circuiting to derive views. Complexity O(n) per filter pass.

- **Slugification**
  - Files: `product.js`, `product-bundles.js`
  - Converts product names to URL‑safe slugs via regex replace; deterministic mapping for routing/query‑string.

- **Modulo Indexing (Carousel/Gallery)**
  - Files: `main.js`, `product.js`
  - Wrap‑around navigation uses `(index ± 1 + n) % n` to avoid bounds checks and enable infinite cycling.

- **Local Persistence**
  - File: `cart.js`
  - Cart stored in `localStorage` (simple JSON). Totals computed via reduce (O(n)).

## Notable UX/Accessibility
- Focus trapping and restoration in the bundle modal; convenient keyboard close (Esc) and overlay click.
- CTA buttons reflect state (disabled when no selection).
- Clear visual states with hover elevation and selection outline.

## Extending the System
- Replace local product arrays with Firestore collections and server‑side functions.
- Expand the recommendation `GRAPH` dynamically from analytics.
- Add debounced search and pagination for very large catalogs.
- Integrate payment SDKs in checkout stepper.

## Security Notes
- Do not commit private API keys or service account files.
- For production, host Firebase config securely and enable appropriate auth providers in the Firebase Console.

## Acknowledgements
- Image assets and design inspiration from boAt Lifestyle.
- Icons by Font Awesome.

---
If you need this README exported as a PDF with diagrams or want an architectural mermaid diagram added, let me know and I’ll append it.
