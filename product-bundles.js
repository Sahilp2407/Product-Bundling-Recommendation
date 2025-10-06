// product-bundles.js
// Fetch and render Frequently Bought Together (FBT) and log simple orders

import { db, functions, httpsCallable, serverTimestamp } from './firebase.js';
import { addManyToCart, removeItemsFromCart, getCart } from './cart.js';
import { collection, addDoc, getDocs, getDoc, doc, query, where, documentId } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Client-only demo fallback associations and lightweight catalog
const LOCAL_CATALOG = {
  // Core products
  'airdopes-181-pro': { name: 'Airdopes 181 Pro', price: 1099, image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/AD_181_pro_1.png', category: 'earbuds', tags: ['earbuds'] },
  'wave-call-2': { name: 'Wave Call 2', price: 1699, image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Wave-Call-2.png', category: 'watch', tags: ['watch'] },
  'stone-1500f': { name: 'Stone 1500F', price: 3499, image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Stone-1500F.png', category: 'speaker', tags: ['speaker'] },
  'rockerz-450-pro': { name: 'Rockerz 450 Pro', price: 1499, image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/rockerz-450-pro.png', category: 'headphone', tags: ['headphone'] },
  // Phones category (new)
  'iphone-15': { name: 'iPhone 15', price: 69999, image: 'https://images.unsplash.com/photo-1695048132329-iphone15?auto=format&fit=crop&w=800&q=60', category: 'phone', tags: ['phone'] },
  'galaxy-s23': { name: 'Samsung Galaxy S23', price: 64999, image: 'https://images.unsplash.com/photo-1682687220063-galaxy?auto=format&fit=crop&w=800&q=60', category: 'phone', tags: ['phone'] },
  'oneplus-12': { name: 'OnePlus 12', price: 59999, image: 'https://images.unsplash.com/photo-1600697395543-oneplus?auto=format&fit=crop&w=800&q=60', category: 'phone', tags: ['phone'] },
  // Accessories relevant to earbuds
  // Use provided image URLs
  'earbuds-silicone-case': { name: 'Earbuds Silicone Case', price: 299, image: 'https://m.media-amazon.com/images/I/616oBJtqdLL._AC_SS450_.jpg', category: 'accessory', tags: ['earbuds','accessory'] },
  'type-c-fast-charger-20w': { name: '20W Type‑C Fast Charger', price: 799, image: 'https://images.mobilefun.co.uk/graphics/450pixelp/70589.jpg', category: 'accessory', tags: ['charger','universal','accessory'] },
  'power-bank-10000': { name: '10,000mAh Power Bank', price: 1299, image: 'https://i5.walmartimages.com/asr/e5bf08af-d04d-4bf5-aadc-b13965203069.aee142cb2ae5f9845fa153d848ca4a4f.jpeg?odnHeight=580&odnWidth=580&odnBg=FFFFFF', category: 'accessory', tags: ['power','universal','accessory'] },
  'ear-tips-pack': { name: 'Memory Foam Ear Tips (Pack)', price: 199, image: 'https://i5.walmartimages.com/asr/e5bf08af-d04d-4bf5-aadc-b13965203069.aee142cb2ae5f9845fa153d848ca4a4f.jpeg?odnHeight=580&odnWidth=580&odnBg=FFFFFF', category: 'accessory', tags: ['earbuds','accessory'] },
  // Phone accessories (new)
  'phone-cover': { name: 'Phone Cover', price: 299, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60', category: 'accessory', tags: ['phone','accessory'] },
  'screen-guard': { name: 'Screen Guard', price: 199, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=60', category: 'accessory', tags: ['phone','accessory'] },
  'true-wireless-earbuds': { name: 'Wireless Earbuds', price: 1499, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=60', category: 'accessory', tags: ['universal','accessory'] }
};

const LOCAL_ASSOC = {
  // If we know a hand-picked pairing, we can list it here.
  // Otherwise, fallback builder uses category/tag logic below.
  'airdopes-181-pro': ['earbuds-silicone-case', 'ear-tips-pack', 'type-c-fast-charger-20w'],
  'wave-call-2': ['type-c-fast-charger-20w', 'power-bank-10000'],
  'stone-1500f': ['power-bank-10000', 'type-c-fast-charger-20w'],
  'rockerz-450-pro': ['type-c-fast-charger-20w', 'power-bank-10000']
};

// Graph-based recommendations
// Represent the catalog as nodes and define edges between products and accessories.
const GRAPH = new Map(Object.keys(LOCAL_CATALOG).map(id => [id, new Set()]));
function link(a, b) { GRAPH.get(a)?.add(b); GRAPH.get(b)?.add(a); }

// Edges for earbuds
link('airdopes-181-pro','earbuds-silicone-case');
link('airdopes-181-pro','ear-tips-pack');
link('airdopes-181-pro','type-c-fast-charger-20w');
// Edges for phones
for (const pid of ['iphone-15','galaxy-s23','oneplus-12']) {
  link(pid, 'phone-cover');
  link(pid, 'screen-guard');
  link(pid, 'power-bank-10000');
  link(pid, 'true-wireless-earbuds');
}
// Example watch edges (future expansion)
link('wave-call-2','type-c-fast-charger-20w');

function bfsAccessories(startId, maxDepth = 1) {
  const visited = new Set();
  const queue = [{ id: startId, depth: 0 }];
  const results = new Set();
  while (queue.length) {
    const { id, depth } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    if (id !== startId) {
      const meta = LOCAL_CATALOG[id];
      if (meta?.category === 'accessory') results.add(id);
    }
    if (depth < maxDepth) {
      for (const nei of (GRAPH.get(id) || [])) queue.push({ id: nei, depth: depth + 1 });
    }
  }
  return Array.from(results);
}

function buildFallbackItems(productId) {
  // Prefer curated associations if present
  const curated = LOCAL_ASSOC[productId];
  if (curated) return curated.map(id => ({ otherId: id, score: 1 }));
  // Otherwise choose accessories relevant to main category
  const main = LOCAL_CATALOG[productId];
  const mainCat = main?.category;
  const relevant = Object.keys(LOCAL_CATALOG).filter(id => {
    if (id === productId) return false;
    const meta = LOCAL_CATALOG[id];
    if (!meta) return false;
    // If main is earbuds, pick items tagged with 'earbuds' or universal accessories
    if (mainCat === 'earbuds') return meta.tags?.includes('earbuds') || meta.tags?.includes('universal');
    // Otherwise pick universal accessories
    return meta.category === 'accessory' && meta.tags?.includes('universal');
  });
  return (relevant.slice(0, 4)).map(id => ({ otherId: id, score: 1 }));
}

// Load product docs from Firestore catalog
async function loadCatalogFor(ids) {
  try {
    const unique = Array.from(new Set(ids)).slice(0, 10);
    if (!unique.length) return {};
    const qRef = query(collection(db, 'catalog'), where(documentId(), 'in', unique));
    const snap = await getDocs(qRef);
    const map = {};
    snap.forEach(docSnap => { map[docSnap.id] = docSnap.data(); });
    return map;
  } catch (e) {
    console.warn('[Bundles] loadCatalogFor failed, using local catalog:', e.message || e);
    return {};
  }
}

function slugFromTitle(title) {
  return (title || '').toLowerCase().replace(/\s+/g, '-');
}

// Inject modern styles for bundle modal/cards
function injectBundleStyles() {
  if (document.getElementById('bundle-styles')) return;
  const css = `
  :root{--accent:#ff2a2a;--card-border:#e9e9ea;--card-bg:#fff;--muted:#6b7280}
  #bundleModal.bundle-modal-overlay{backdrop-filter: blur(10px);animation:bm-fade .22s ease}
  .bundle-modal{border-radius:18px;box-shadow:0 28px 90px rgba(0,0,0,.28);transform:translateY(8px) scale(.98);animation:bm-pop .24s cubic-bezier(.2,.7,.2,1) forwards}
  .bundle-modal h3{font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";letter-spacing:.2px;font-weight:800}
  #bundleGrid{gap:16px;grid-template-columns:repeat(3,minmax(200px,1fr))}
  @media (max-width:740px){#bundleGrid{grid-template-columns:repeat(2,minmax(150px,1fr))}}
  .bundle-card{transition:transform .22s ease, box-shadow .22s ease}
  .bundle-card:hover{transform:translateY(-3px)}
  .bundle-card label{display:block;border:1px solid var(--card-border);border-radius:16px;overflow:hidden;background:var(--card-bg)}
  .bundle-card .imgbox{position:relative;background:linear-gradient(180deg,#f8f9fb,#f3f4f6);overflow:hidden}
  .bundle-card img{display:block;width:100%;height:180px;object-fit:cover;transition:transform .28s ease}
  .bundle-card:hover img{transform:scale(1.05)}
  .bundle-card .title{font-weight:700;line-height:1.3;padding:12px 14px;min-height:44px}
  .bundle-card:has(.bundle-pick:checked) label{box-shadow:0 0 0 2px var(--accent) inset, 0 10px 22px rgba(0,0,0,.1)}
  .bundle-card:has(.bundle-pick:checked) .title{color:#111}
  .bundle-pick{position:absolute;top:10px;left:10px;transform:scale(1.15);z-index:2;accent-color:var(--accent);filter:drop-shadow(0 1px 2px rgba(0,0,0,.15))}
  .bundle-pick:active{transform:scale(1.1)}
  .bundle-summary{display:flex;flex-direction:column;gap:6px;margin-top:10px;font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial}
  .bundle-summary .chips{display:flex;flex-wrap:wrap;gap:6px}
  .chip{background:#f3f4f6;border:1px solid #e5e7eb;color:#111;border-radius:999px;padding:6px 10px;font-weight:700;font-size:12px}
  .muted{color:var(--muted)}
  .bundle-actions{display:flex;gap:10px}
  .btn-skip{padding:10px 12px;border:1px solid #e1e1e3;border-radius:10px;background:#fff;cursor:pointer;transition:transform .15s ease, background .15s ease}
  .btn-skip:hover{background:#f7f7f8}
  .btn-confirm{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(180deg,#111,#000);color:#fff;font-weight:800;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.18);transition:transform .15s ease, box-shadow .2s ease}
  .btn-confirm:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.22)}
  .btn-confirm:disabled{opacity:.6;cursor:not-allowed;box-shadow:none}
  @keyframes bm-pop{to{transform:translateY(0) scale(1)}}
  @keyframes bm-fade{from{opacity:0}to{opacity:1}}
  `;
  const style = document.createElement('style');
  style.id = 'bundle-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

async function fetchBundlesForProduct(productId) {
  // 1) Try Firestore-backed data
  const fromDb = await fetchBundlesFromFirestore(productId);
  if (fromDb.length) return fromDb;
  // 2) Fall back to local Graph BFS for O(V+E) recommendations
  const recIds = bfsAccessories(productId, 1);
  if (recIds.length) return recIds.map(id => ({ otherId: id, score: 1 }));
  // 3) Heuristic fallback if graph has no edges
  return buildFallbackItems(productId);
}

// Fetch bundles from Firestore if present
// Supports two schemas for flexibility:
// A) Document: bundles/{productId} => { items: [otherId, ...] }
// B) Collection: associations where baseId == productId => { otherId, score? }
async function fetchBundlesFromFirestore(productId) {
  try {
    // Schema A: bundles/{productId}
    const bRef = doc(db, 'bundles', productId);
    const bSnap = await getDoc(bRef);
    if (bSnap.exists()) {
      const data = bSnap.data() || {};
      const items = Array.isArray(data.items) ? data.items : [];
      const cleaned = items.filter(Boolean).slice(0, 10).map(id => ({ otherId: id, score: 1 }));
      if (cleaned.length) return cleaned;
    }
    // Schema B: associations where baseId == productId
    const qRef = query(collection(db, 'associations'), where('baseId', '==', productId));
    const snap = await getDocs(qRef);
    const list = [];
    snap.forEach(d => {
      const row = d.data() || {};
      if (row.otherId) list.push({ otherId: row.otherId, score: Number(row.score) || 1 });
    });
    return list.slice(0, 10);
  } catch (e) {
    console.warn('[Bundles] Firestore fetch failed; using local fallback:', e?.message || e);
    return [];
  }
}

function buildCardDOM(item, catalogMap) {
  const id = item.otherId;
  const meta = (catalogMap && catalogMap[id]) || LOCAL_CATALOG[id];
  const name = meta?.name || id;
  const price = meta?.price;
  const img = meta?.image || `https://via.placeholder.com/400x260?text=${encodeURIComponent(name)}`;
  const card = document.createElement('div');
  card.className = 'bundle-card';
  card.innerHTML = `
    <label>
      <div class="imgbox">
        <input type="checkbox" class="bundle-pick" data-id="${id}">
        <img src="${img}" alt="${name}">
      </div>
      <div class="title">${name}</div>
    </label>
  `;
  return card;
}

async function renderFBT(productId) {
  // Prefer inline block near the product info if present
  const section = document.getElementById('fbtInlineSection') || document.getElementById('fbtSection');
  const grid = document.getElementById('fbtInlineGrid') || document.getElementById('fbtGrid');
  const summary = document.getElementById('fbtInlineSummary') || document.getElementById('fbtSummary');
  const addBtn = document.getElementById('addInlineBundleBtn') || document.getElementById('addBundleBtn');
  if (!section || !grid || !summary || !addBtn) return;
  const items = await fetchBundlesForProduct(productId);
  const finalItems = items.length ? items : buildFallbackItems(productId);
  if (!finalItems.length) { section.style.display = 'none'; return; }
  grid.innerHTML = '';
  const picked = finalItems.slice(0, 3);
  // Try to load product details from Firestore
  const catalogMap = await loadCatalogFor(picked.map(p => p.otherId));
  picked.forEach(it => grid.appendChild(buildCardDOM(it, catalogMap)));
  // Simple placeholder pricing summary (since no catalog join yet)
  const total = picked.reduce((sum, it) => {
    const cm = catalogMap[it.otherId];
    const local = LOCAL_CATALOG[it.otherId];
    const price = (cm && cm.price) || (local && local.price) || 0;
    return sum + price;
  }, 0);
  summary.textContent = total > 0 ? `Bundle total (recommended): ₹${total.toLocaleString()}` : `Bundle includes ${picked.length} recommended items.`;
  addBtn.onclick = () => {
    console.log('[FBT] Add bundle clicked:', picked.map(p => p.otherId));
    // TODO: integrate with cart system
  };
  return { picked, catalogMap, total };
}

async function logSimpleOrderFromPage() {
  // Extract a basic order from current page (product + quantity) and accessories from cart
  const titleEl = document.querySelector('.product-info h1');
  const qtyEl = document.querySelector('.quantity');
  const name = titleEl?.textContent?.trim() || 'unknown-product';
  const slug = slugFromTitle(name);
  const qty = parseInt(qtyEl?.textContent || '1', 10) || 1;

  const cart = getCart();
  const accessories = (cart.items || [])
    .filter(i => i.id !== slug)
    .map(i => ({ productId: i.id, qty: i.qty || 1, price: i.price || 0 }));

  const basePrice = (LOCAL_CATALOG[slug] && LOCAL_CATALOG[slug].price) || null;
  const order = {
    items: [{ productId: slug, qty, price: basePrice }],
    accessories,
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, 'orders'), order);
}

function wireOrderLogging() {
  const placeOrderBtn = document.querySelector('.place-order-btn');
  if (!placeOrderBtn) return;
  placeOrderBtn.addEventListener('click', async () => {
    try {
      await logSimpleOrderFromPage();
      console.log('[Orders] Logged order to Firestore');
    } catch (e) {
      console.warn('[Orders] Failed to write order:', e.message || e);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // current product id from URL (e.g., product.html?product=airdopes-181-pro)
  const pid = getQueryParam('product') || slugFromTitle(document.querySelector('.product-info h1')?.textContent || '');
  // Do not render inline FBT automatically; only show recommendations in modal on CTA clicks
  injectBundleStyles();
  wireOrderLogging();

  // Bundle Modal Behavior on Add to Cart / Buy Now
  const addToCartBtn = document.querySelector('.add-to-cart');
  const buyNowBtn = document.querySelector('.buy-now');
  const modal = document.getElementById('bundleModal');
  const grid = document.getElementById('bundleGrid');
  const summary = document.getElementById('bundleSummary');
  const closeBtn = document.getElementById('bundleClose');
  const skipBtn = document.getElementById('bundleSkip');
  const addBtn = document.getElementById('bundleAdd');

  let lastModalState = null;

  async function openBundleModal() {
    if (!pid || !modal || !grid || !summary) return;
    modal.style.display = 'flex';
    const previouslyFocused = document.activeElement;
    // Render picks inside modal
    // Reuse recommender quickly
    const items = await fetchBundlesForProduct(pid);
    const finalItems = items.length ? items : buildFallbackItems(pid);
    grid.innerHTML = '';
    const catalogMap = await loadCatalogFor(finalItems.map(p => p.otherId));
    const picked = finalItems.slice(0, 3);
    // If user provided a minion image URL globally, use it for the silicone case
    if (window.MINION_CASE_URL) {
      const caseItem = picked.find(p => p.otherId === 'earbuds-silicone-case');
      if (caseItem) {
        catalogMap['earbuds-silicone-case'] = {
          ...(catalogMap['earbuds-silicone-case'] || LOCAL_CATALOG['earbuds-silicone-case']),
          image: window.MINION_CASE_URL
        };
      }
    }
    picked.forEach(it => grid.appendChild(buildCardDOM(it, catalogMap)));

    // Update summary from currently selected checkboxes (default none)
    function updateModalSummary() {
      const selectedIds = Array.from(grid.querySelectorAll('.bundle-pick:checked')).map(c=>c.dataset.id);
      const baseMeta = LOCAL_CATALOG[pid] || {};
      const prices = selectedIds.map(id => {
        const cm = catalogMap[id];
        const local = LOCAL_CATALOG[id];
        return (cm && cm.price) || (local && local.price) || 0;
      });
      const extrasTotal = prices.reduce((s,v)=>s+v,0);
      const full = (baseMeta.price || 0) + extrasTotal;
      const chips = prices.length ? prices.map(p=>`<span class="chip">₹${Number(p).toLocaleString()}</span>`).join('<span class="muted">+</span>') : '<span class="muted">No accessory selected</span>';
      summary.innerHTML = `<div class="bundle-summary"><div class="chips">${chips}${prices.length?`<span class='muted'>=</span><span class='chip'>₹${extrasTotal.toLocaleString()}</span>`:''}</div><div class="muted">Total with earbuds: <strong>₹${full.toLocaleString()}</strong></div></div>`;
      // Update CTA button state/text
      if (addBtn) {
        addBtn.disabled = selectedIds.length === 0;
        addBtn.textContent = selectedIds.length > 0 ? `Add ${selectedIds.length} selected & continue` : 'Add selected & continue';
      }
    }
    grid.querySelectorAll('.bundle-pick').forEach(cb=>cb.addEventListener('change', updateModalSummary));
    updateModalSummary();
    lastModalState = { picked, catalogMap };
    // Focus first checkbox or close button for accessibility
    const firstPick = grid.querySelector('.bundle-pick');
    (firstPick || closeBtn || addBtn)?.focus?.();
    // Overlay click closes
    modal.addEventListener('click', (e)=>{ if (e.target === modal) closeBundleModal(); });
    // ESC closes
    function onKey(e){ if (e.key === 'Escape') { closeBundleModal(); } }
    document.addEventListener('keydown', onKey, { once: true });
    // Restore focus after close
    modal.addEventListener('close-modal', ()=> previouslyFocused?.focus?.(), { once: true });
  }

  function closeBundleModal() { if (modal) { modal.style.display = 'none'; modal.dispatchEvent(new Event('close-modal')); } }

  addToCartBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    // Open bundle modal first; do not open checkout yet
    await openBundleModal();
  });
  buyNowBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    // Open bundle modal first; do not open checkout yet
    await openBundleModal();
  });
  closeBtn?.addEventListener('click', closeBundleModal);
  skipBtn?.addEventListener('click', (e) => {
    e?.preventDefault?.();
    e?.stopImmediatePropagation?.();
    // Do nothing to cart; simply close modal
    closeBundleModal();
    // Proceed with normal checkout (earbuds only UI)
    window.dispatchEvent(new CustomEvent('checkout:open'));
  });
  addBtn?.addEventListener('click', () => {
    // Collect selected items and add to cart
    const selectedIds = Array.from(document.querySelectorAll('#bundleGrid .bundle-pick:checked')).map(chk => chk.dataset.id);
    // Remove all known accessories for this base from cart first to prevent leftovers
    const knownAccessoryIds = ['earbuds-silicone-case','ear-tips-pack','type-c-fast-charger-20w','power-bank-10000'];
    removeItemsFromCart(knownAccessoryIds);

    // Include base product only if not already present (qty shouldn't auto-increment)
    const base = LOCAL_CATALOG[pid] || { name: pid, price: 0, image: '' };
    const cartNow = getCart();
    const hasBase = !!cartNow.items.find(i => i.id === pid);
    const itemsToAdd = hasBase ? [] : [{ id: pid, name: base.name || pid, price: base.price || 0, image: base.image || '', qty: 1 }];
    // Add selected accessories if any
    itemsToAdd.push(...selectedIds.map(id => {
      const meta = (lastModalState?.catalogMap && lastModalState.catalogMap[id]) || LOCAL_CATALOG[id] || {};
      return { id, name: meta.name || id, price: meta.price || 0, image: meta.image || '', qty: 1 };
    }));
    addManyToCart(itemsToAdd);
    // Notify other scripts (e.g., product.js) to refresh totals and open checkout
    window.dispatchEvent(new CustomEvent('cart:changed'));
    window.dispatchEvent(new CustomEvent('checkout:open'));
    closeBundleModal();
  });
});
