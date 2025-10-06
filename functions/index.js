// functions/index.js
// Techno-Gen: Product Bundling Recommendation Engine
// Node 18 ESM (firebase-functions v4)

import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();
const db = getFirestore();

const COOC = 'cooccurrence'; // pair counts
const COUNTS = 'product_counts'; // per product count
const RULES = 'rules'; // precomputed topK per product
const META_DOC = 'meta/stats'; // { totalOrders }

function pairId(a, b) {
  const [x, y] = [String(a), String(b)].sort();
  return `${x}|${y}`;
}

// 1) Increment co-occurrence counts on order creation
export const onOrderCreated = onDocumentCreated('orders/{orderId}', async (event) => {
  const data = event.data?.data();
  if (!data || !Array.isArray(data.items) || data.items.length === 0) return;
  const items = Array.from(new Set(data.items.map(String))); // unique items as strings
  const batch = db.batch();

  // increment product counts
  items.forEach((pid) => {
    const ref = db.collection(COUNTS).doc(pid);
    batch.set(ref, { count: FieldValue.increment(1) }, { merge: true });
  });

  // increment total orders
  batch.set(db.doc(META_DOC), { totalOrders: FieldValue.increment(1) }, { merge: true });

  // increment pair co-occurrence for all unordered pairs
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i], b = items[j];
      const id = pairId(a, b);
      const ref = db.collection(COOC).doc(id);
      batch.set(ref, { a, b, count: FieldValue.increment(1) }, { merge: true });
    }
  }

  await batch.commit();
});

// 2) Nightly rule builder: compute topK associated products
export const rebuildRules = onSchedule('every 24 hours', async () => {
  const metaSnap = await db.doc(META_DOC).get();
  const totalOrders = metaSnap.exists ? metaSnap.data().totalOrders || 1 : 1;

  // load product counts into memory
  const counts = {};
  const countsSnap = await db.collection(COUNTS).get();
  countsSnap.forEach((doc) => { counts[doc.id] = doc.data().count || 1; });

  // For each product, gather neighbor pairs from COOC by querying both sides
  const productIds = Object.keys(counts);
  for (const p of productIds) {
    const neighbors = new Map();

    const q1 = await db.collection(COOC).where('a', '==', p).get();
    q1.forEach((d) => {
      const { b, count } = d.data();
      neighbors.set(b, (neighbors.get(b) || 0) + (count || 0));
    });

    const q2 = await db.collection(COOC).where('b', '==', p).get();
    q2.forEach((d) => {
      const { a, count } = d.data();
      neighbors.set(a, (neighbors.get(a) || 0) + (count || 0));
    });

    const cntP = counts[p] || 1;
    const scored = [];
    for (const [q, cooc] of neighbors.entries()) {
      const cntQ = counts[q] || 1;
      const supportQ = cntQ / totalOrders;
      const confidence = cooc / cntP; // P(q|p)
      const lift = confidence / supportQ; // association strength
      const score = confidence * lift; // combined metric
      scored.push({ otherId: q, cooc, confidence, lift, score });
    }

    scored.sort((a, b) => b.score - a.score);
    const topK = scored.slice(0, 6).map(({ otherId, score }) => ({ otherId, score }));
    await db.collection(RULES).doc(p).set({ topK, updatedAt: Date.now() }, { merge: true });
  }
});

// 3) Callable: get recommendations for a product, with fallback if rules missing
export const getRecommendations = onCall(async (req) => {
  const { productId, limit = 4 } = req.data || {};
  if (!productId) {
    return { ok: false, error: 'missing-productId' };
  }
  // Try precomputed rules
  const ruleSnap = await db.collection(RULES).doc(String(productId)).get();
  if (ruleSnap.exists) {
    const topK = (ruleSnap.data().topK || []).slice(0, limit);
    return { ok: true, items: topK };
  }
  // Fallback: compute from cooccurrence quickly
  const neighbors = new Map();
  const q1 = await db.collection(COOC).where('a', '==', String(productId)).get();
  q1.forEach((d) => { const { b, count } = d.data(); neighbors.set(b, (neighbors.get(b) || 0) + (count || 0)); });
  const q2 = await db.collection(COOC).where('b', '==', String(productId)).get();
  q2.forEach((d) => { const { a, count } = d.data(); neighbors.set(a, (neighbors.get(a) || 0) + (count || 0)); });
  const items = [...neighbors.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([otherId, cooc]) => ({ otherId, score: cooc }));
  return { ok: true, items };
});
