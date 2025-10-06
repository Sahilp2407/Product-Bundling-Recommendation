// data-firestore.js (ES module)
// Stores user profile, addresses, and orders in Firestore.
// Requires firebase.js to be loaded (module) and provides: app, auth, db, serverTimestamp

import { app, auth, db, serverTimestamp, onAuthStateChanged } from './firebase.js';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

async function ensureUser(user) {
  if (!user) return null;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      displayName: user.displayName || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  return userRef;
}

async function addAddress(address) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const userRef = await ensureUser(user);
  const col = collection(userRef, 'addresses');
  return await addDoc(col, { ...address, createdAt: serverTimestamp() });
}

async function listAddresses() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const userRef = doc(db, 'users', user.uid);
  const col = collection(userRef, 'addresses');
  const q = query(col, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function addOrder(order) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const userRef = await ensureUser(user);
  const ordersCol = collection(userRef, 'orders');
  const docRef = await addDoc(ordersCol, { ...order, createdAt: serverTimestamp(), status: order.status || 'pending' });
  // Optional: also write a top-level copy for admin listings
  try {
    await setDoc(doc(db, 'orders', docRef.id), { uid: user.uid, ...order, createdAt: serverTimestamp(), status: order.status || 'pending' });
  } catch {}
  return docRef;
}

async function listOrders() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const userRef = doc(db, 'users', user.uid);
  const col = collection(userRef, 'orders');
  const q = query(col, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Make available globally for non-module scripts to call
window.DATA = { ensureUser, addAddress, listAddresses, addOrder, listOrders };

// Auto-create user doc on login
onAuthStateChanged(auth, (u) => { if (u) ensureUser(u); });
