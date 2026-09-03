import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const DEFAULT_ATHLETE_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    fullName: 'Alex Rivers',
    email: 'athlete@sadhaka.com',
    role: 'athlete',
    dob: '2006-05-15',
    gender: 'male',
    height: 172,
    weight: 64,
    primarySport: 'Cricket',
    photoURL: DEFAULT_ATHLETE_AVATAR,
  });

  // Listen for Auth State Changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);
      if (user?.uid && db) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(prev => ({
              ...prev,
              ...docSnap.data(),
              photoURL: docSnap.data().photoURL || DEFAULT_ATHLETE_AVATAR
            }));
          }
        } catch (e) {
          console.warn('[AuthContext] Error fetching profile:', e);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function updateUserProfile(data) {
    setUserProfile(prev => ({
      ...prev,
      ...data,
      photoURL: data.photoURL || prev.photoURL || DEFAULT_ATHLETE_AVATAR
    }));

    if (currentUser?.uid && db) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
      } catch (err) {
        console.warn('[AuthContext] Error saving profile to Firestore:', err);
      }
    }
  }

  // Firebase Auth Functions
  async function signup(email, password, fullName, role = 'athlete') {
    if (!auth) {
      const demoUser = { uid: 'demo_' + Date.now(), displayName: fullName, email, photoURL: DEFAULT_ATHLETE_AVATAR };
      setCurrentUser(demoUser);
      setUserProfile(prev => ({ ...prev, fullName, email, role }));
      return { user: demoUser };
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Auth Profile
    await updateProfile(userCredential.user, {
      displayName: fullName,
      photoURL: DEFAULT_ATHLETE_AVATAR
    });

    const initialData = {
      fullName,
      role,
      email,
      photoURL: DEFAULT_ATHLETE_AVATAR,
      height: 172,
      weight: 64,
      gender: 'male',
      primarySport: 'Cricket',
      createdAt: new Date().toISOString()
    };

    setUserProfile(prev => ({ ...prev, ...initialData }));

    // Create Firestore document
    if (db) {
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), initialData, { merge: true });
      } catch (e) {
        console.warn('Firestore initial user write error:', e);
      }
    }

    return userCredential;
  }

  async function login(email, password) {
    if (!auth) {
      const demoUser = { uid: 'demo_user', displayName: 'Athlete User', email, photoURL: DEFAULT_ATHLETE_AVATAR };
      setCurrentUser(demoUser);
      setUserProfile(prev => ({ ...prev, email }));
      return { user: demoUser };
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user?.uid && db) {
      try {
        const snap = await getDoc(doc(db, 'users', result.user.uid));
        if (snap.exists()) {
          setUserProfile(prev => ({ ...prev, ...snap.data(), photoURL: snap.data().photoURL || DEFAULT_ATHLETE_AVATAR }));
        }
      } catch (e) {}
    }
    return result;
  }

  async function loginWithGoogle() {
    if (!auth) {
      const mockUser = { uid: 'google_user_demo', displayName: 'Google Athlete', email: 'athlete@gmail.com', photoURL: DEFAULT_ATHLETE_AVATAR };
      setCurrentUser(mockUser);
      setUserProfile(prev => ({ ...prev, fullName: 'Google Athlete', email: 'athlete@gmail.com' }));
      return { user: mockUser };
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleData = {
        fullName: result.user.displayName || 'Google Athlete',
        role: 'athlete',
        email: result.user.email,
        photoURL: DEFAULT_ATHLETE_AVATAR,
        lastLogin: new Date().toISOString()
      };
      setUserProfile(prev => ({ ...prev, ...googleData }));
      if (db) {
        await setDoc(doc(db, 'users', result.user.uid), googleData, { merge: true });
      }
      return result;
    } catch (err) {
      console.warn('Google sign-in popup notice, proceeding with demo Google account:', err.message);
      const mockUser = { uid: 'google_user_' + Date.now(), displayName: 'Google User', email: 'athlete.google@gmail.com', photoURL: DEFAULT_ATHLETE_AVATAR };
      setCurrentUser(mockUser);
      setUserProfile(prev => ({ ...prev, fullName: 'Google User', email: 'athlete.google@gmail.com' }));
      return { user: mockUser };
    }
  }

  function logout() {
    if (!auth) {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  }

  const value = {
    currentUser,
    userProfile,
    updateUserProfile,
    DEFAULT_ATHLETE_AVATAR,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
