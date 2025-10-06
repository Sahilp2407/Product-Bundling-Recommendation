import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, serverTimestamp, collection, addDoc, doc, setDoc } from 'firebase/firestore';

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ensure we have a user (anonymous when not signed in)
async function ensureUser() {
  return new Promise(async (resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) { unsub(); resolve(user); }
      else { await signInAnonymously(auth); }
    });
  });
}

export { app, auth, db, serverTimestamp, collection, addDoc, doc, setDoc, ensureUser };
