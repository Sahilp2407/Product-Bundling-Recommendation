import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../firebase';

const AuthCtx = createContext(null);

export function AuthProvider({ children }){
  const auth = getAuth(app);
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u=>{ setUser(u); setLoading(false); });
    return unsub;
  },[auth]);

  const value = {
    user,
    loading,
    async login(email, password){ await signInWithEmailAndPassword(auth, email, password); },
    async signup(email, password){ await createUserWithEmailAndPassword(auth, email, password); },
    async logout(){ await signOut(auth); }
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(){ return useContext(AuthCtx); }
