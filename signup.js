// signup.js
// Handles Email/Password account creation and basic profile save

import { auth, db, createUserWithEmailAndPassword } from './firebase.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const confirmEl = document.getElementById('confirm');
const termsEl = document.getElementById('terms');
const statusEl = document.getElementById('status');
const signupBtn = document.getElementById('signupBtn');

function setStatus(msg, ok=false) {
  statusEl.textContent = msg;
  statusEl.className = `status ${ok ? 'ok' : 'err'}`;
}

signupBtn.addEventListener('click', async () => {
  const name = (nameEl.value || '').trim();
  const email = (emailEl.value || '').trim();
  const password = (passwordEl.value || '').trim();
  const confirm = (confirmEl.value || '').trim();

  if (!name) return setStatus('Please enter your name');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus('Enter a valid email');
  if (!password || password.length < 6) return setStatus('Password must be at least 6 characters');
  if (password !== confirm) return setStatus('Passwords do not match');
  if (!termsEl.checked) return setStatus('Please accept the Terms and Privacy Policy');

  setStatus('Creating your account...');

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    setStatus('Account created. Redirecting...', true);
    setTimeout(() => window.location.href = 'login.html', 800);
  } catch (e) {
    setStatus(e.message || 'Signup failed');
  }
});
