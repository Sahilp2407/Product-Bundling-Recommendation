// login.js
// Handles simple mobile capture and stores a user profile in Firestore

import { auth, db } from './firebase.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

const mobileEl = document.getElementById('mobile');
const whatsappEl = document.getElementById('whatsapp');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const continueBtn = document.getElementById('continueBtn');
const statusEl = document.getElementById('status');
const tabs = document.querySelectorAll('.tab-btn');
const mobileGroups = document.querySelectorAll('.mobile-group');
const emailGroups = document.querySelectorAll('.email-group');
let mode = 'mobile';
let confirmationResult = null; // for phone auth
const googleBtn = document.getElementById('googleBtn');

function setStatus(msg, ok=false) {
  statusEl.textContent = msg;
  statusEl.className = `status ${ok ? 'ok' : 'err'}`;
}

function sanitizeMobile(value) {
  return (value || '').replace(/\D/g, '').slice(0, 10);
}

// Tabs switching
tabs.forEach(btn => btn.addEventListener('click', () => {
  tabs.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  mode = btn.dataset.mode || 'mobile';
  mobileGroups.forEach(el => el.style.display = mode === 'mobile' ? '' : 'none');
  emailGroups.forEach(el => el.style.display = mode === 'email' ? '' : 'none');
  // Reset OTP state when changing tabs
  try {
    const otpBlock = document.getElementById('otp-block');
    if (otpBlock) { otpBlock.style.display = 'none'; }
    const otpInput = document.getElementById('otp');
    if (otpInput) { otpInput.value = ''; }
    confirmationResult = null;
    const btn = document.getElementById('continueBtn');
    if (btn) btn.textContent = 'Continue';
  } catch(_) {}
  setStatus('', true);
}));

continueBtn.addEventListener('click', async () => {
  const mobile = sanitizeMobile(mobileEl.value);
  if (mode === 'mobile') {
    if (mobile.length !== 10) { setStatus('Please enter a valid 10-digit mobile number'); return; }
    setStatus('Sending OTP...');

    try {
      // Configure reCAPTCHA (invisible or rendered element)
      const { RecaptchaVerifier, signInWithPhoneNumber } = window.__fb || {};
      if (!RecaptchaVerifier || !signInWithPhoneNumber) { setStatus('Phone auth not initialized'); return; }
      // Create verifier only once
      if (!window.__recaptchaVerifier) {
        window.__recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      } else {
        // Reset expired verifier if needed
        try { window.__recaptchaVerifier.clear(); } catch(_) {}
        window.__recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }
      const phoneNumber = `+91${mobile}`; // Assuming India
      confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.__recaptchaVerifier);
      setStatus('OTP sent. Please check your phone.', true);
      // Show OTP input
      document.getElementById('otp-block').style.display = '';
      // Change button behavior to verify OTP on next click
      continueBtn.textContent = 'Verify OTP';
      mode = 'verify-otp';
    } catch (e) {
      console.error(e);
      setStatus(`Failed to send OTP: ${e.code || ''} ${e.message || ''}`.trim());
    }
  } else if (mode === 'verify-otp') {
    const otp = (document.getElementById('otp').value || '').trim();
    if (otp.length !== 6) { setStatus('Enter the 6-digit OTP'); return; }
    setStatus('Verifying OTP...');
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        mobile,
        whatsappOptIn: !!whatsappEl.checked,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setStatus('Logged in successfully.', true);
      setTimeout(() => window.location.href = 'index.html', 600);
    } catch (e) {
      console.error(e);
      setStatus(`OTP verification failed: ${e.code || ''} ${e.message || ''}`.trim());
    }
  } else {
    // Email mode
    const email = (emailEl.value || '').trim();
    const password = (passwordEl.value || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('Enter a valid email'); return; }
    if (!password || password.length < 6) { setStatus('Password must be at least 6 characters'); return; }
    setStatus('Signing in...');
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = window.__fb || {};
    if (!signInWithEmailAndPassword || !createUserWithEmailAndPassword) { setStatus('Auth not initialized'); return; }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus('Logged in successfully.', true);
      setTimeout(() => window.location.href = 'index.html', 600);
    } catch (err) {
      if (err && err.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setStatus('Account created. Logged in.', true);
          setTimeout(() => window.location.href = 'index.html', 600);
        } catch (e) {
          setStatus(e.message || 'Signup failed');
        }
      } else {
        setStatus(err.message || 'Login failed');
      }
    }
  }
});

// Google Sign-in
googleBtn?.addEventListener('click', async () => {
  try {
    setStatus('Opening Google…');
    const { GoogleAuthProvider, signInWithPopup } = window.__fb || {};
    if (!GoogleAuthProvider || !signInWithPopup) { setStatus('Google auth not initialized'); return; }
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const user = cred.user;
    // Save basic profile if not present
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || '',
        email: user.email || '',
        avatarUrl: user.photoURL || '',
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch(_) {}
    setStatus('Signed in with Google. Redirecting…', true);
    setTimeout(() => window.location.href = 'index.html', 500);
  } catch (e) {
    setStatus(e.message || 'Google sign-in failed');
  }
});
