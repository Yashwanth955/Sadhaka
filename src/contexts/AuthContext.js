import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Auth State Changes
  useEffect(() => {
    // If auth is not initialized (e.g. missing keys), bypass for mock UI purposes
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Firebase Auth Functions
  async function signup(email, password, fullName, role) {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized. Check your API keys."));
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Auth Profile
    await updateProfile(userCredential.user, {
      displayName: fullName
    });

    // Create Firestore document
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      fullName,
      role,
      email,
      createdAt: new Date().toISOString()
    });

    return userCredential;
  }

  function login(email, password) {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized. Check your API keys."));
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
