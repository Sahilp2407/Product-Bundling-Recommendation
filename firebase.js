// firebase.js
// Firebase Web SDK initialization for the site
// Ensures anonymous authentication so we can log orders and fetch recommendations

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, EmailAuthProvider, PhoneAuthProvider, signOut, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-functions.js";
import { getDatabase, ref, push, set, serverTimestamp as rtdbServerTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTIaWDVfTusOiCEMhuBXX2gbbe97r7WVw",
  authDomain: "shopkaro-ccf43.firebaseapp.com",
  projectId: "shopkaro-ccf43",
  storageBucket: "shopkaro-ccf43.firebasestorage.app",
  messagingSenderId: "673415469327",
  appId: "1:673415469327:web:3b202dbd04d3381f00467a",
  measurementId: "G-ZELETW1C38"
};
// Connect Realtime Database explicitly to the given URL
firebaseConfig.databaseURL = "https://shopkaro-ccf43-default-rtdb.firebaseio.com";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const rtdb = getDatabase(app);

// Optional: observe auth state (no automatic anonymous sign-in)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('[Firebase] Signed in:', user.uid);
  } else {
    console.log('[Firebase] No user, attempting anonymous sign-in');
    signInAnonymously(auth).catch(err => console.warn('[Firebase] Anonymous sign-in failed:', err?.message || err));
  }
});

// Re-export for app modules
export { app, auth, db, rtdb, ref, push, set, rtdbServerTimestamp, functions, httpsCallable, serverTimestamp, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, EmailAuthProvider, PhoneAuthProvider, signOut, GoogleAuthProvider, signInWithPopup, signInAnonymously };

// Also expose minimal helpers on window for non-module scripts
window.__fb = {
  auth,
  db,
  rtdb,
  functions,
  httpsCallable,
  serverTimestamp,
  rtdbServerTimestamp,
  ref,
  push,
  set,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  EmailAuthProvider,
  PhoneAuthProvider,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
};
