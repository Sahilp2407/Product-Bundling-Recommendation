// header-auth.js
// Renders user name/avatar in header if logged in and provides Sign out

import { auth, onAuthStateChanged, signOut, db } from './firebase.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

const area = document.getElementById('authArea');
if (area) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      area.innerHTML = `
        <a href="login.html" class="signin">Sign in</a>
        <a href="signup.html" class="signup">Sign up</a>
        <a href="#" class="cart-icon" title="Cart"><i class="fas fa-shopping-bag"></i></a>
      `;
      return;
    }
    let displayName = user.displayName || '';
    if (!displayName) {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) displayName = snap.data().name || '';
      } catch (_) {}
    }
    const name = displayName || (user.email ? user.email.split('@')[0] : 'Account');
    const initials = name.trim().slice(0, 1).toUpperCase();
    area.innerHTML = `
      <style>
        .user-chip { display:flex; align-items:center; gap:10px; }
        .avatar { width:28px; height:28px; border-radius:50%; background:#111; color:#fff; display:grid; place-items:center; font-weight:700; }
        .dropdown { position: relative; }
        .dropdown-menu { position:absolute; right:0; top:140%; background:#fff; border:1px solid #eee; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,.1); padding:10px; display:none; min-width:160px; }
        .dropdown.open .dropdown-menu { display:block; }
        .dropdown-menu a, .dropdown-menu button { display:block; width:100%; text-align:left; padding:8px 10px; border:none; background:none; cursor:pointer; color:#111; border-radius:8px; }
        .dropdown-menu a:hover, .dropdown-menu button:hover { background:#f5f5f5; }
      </style>
      <div class="dropdown" id="userDropdown">
        <div class="user-chip">
          <div class="avatar">${initials}</div>
          <strong>${name}</strong>
        </div>
        <div class="dropdown-menu">
          <a href="index.html">Home</a>
          <button id="signOutBtn">Sign out</button>
        </div>
      </div>
      <a href="#" class="cart-icon" title="Cart"><i class="fas fa-shopping-bag"></i></a>
    `;
    const dropdown = document.getElementById('userDropdown');
    const signOutBtn = document.getElementById('signOutBtn');
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
    signOutBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      await signOut(auth);
    });
  });
}
