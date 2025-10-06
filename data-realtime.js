// data-realtime.js (ES module)
// Save user addresses to Firebase Realtime Database

import { auth, rtdb, ref, push, set, rtdbServerTimestamp, onAuthStateChanged } from './firebase.js';

async function addAddressRTDB(address) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const addrRef = ref(rtdb, `users/${user.uid}/addresses`);
  const newRef = push(addrRef);
  await set(newRef, { ...address, createdAt: rtdbServerTimestamp() });
  return newRef.key;
}

// Make available globally for non-module callers
window.RTDB = { addAddress: addAddressRTDB };

// Ensure path exists on login (no-op write skipped to avoid extra costs)
onAuthStateChanged(auth, (u)=>{ /* no-op */ });
