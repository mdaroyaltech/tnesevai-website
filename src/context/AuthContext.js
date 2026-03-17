// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  const login  = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
  const logout = ()          => signOut(auth);

  return (
    <Ctx.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </Ctx.Provider>
  );
};
