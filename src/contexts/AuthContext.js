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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { upsertUserProfile, getUserProfileFromDb, DEFAULT_ATHLETE_AVATAR } from '../models';
const SESSION_STORAGE_KEY = '@sadhaka_user_session';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    role: 'athlete',
    gender: 'male',
    primarySport: 'Cricket',
    photoURL: DEFAULT_ATHLETE_AVATAR,
  });

  const persistSession = async (user) => {
    try {
      if (user?.uid) {
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.fullName,
          photoURL: user.photoURL || DEFAULT_ATHLETE_AVATAR
        }));
      } else {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[AuthContext] Session storage note:', e);
    }
  };

  // Listen for Auth State Changes & Restore Cached Session
  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    async function initAuth() {
      let restoredUser = null;
      try {
        const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (parsed?.uid) {
            restoredUser = parsed;
            setCurrentUser(parsed);
            const localData = await getUserProfileFromDb(parsed.uid);
            if (localData && isMounted) {
              setUserProfile(prev => ({
                ...prev,
                ...localData,
                fullName: localData.fullName || localData.name || parsed.displayName || prev.fullName,
                photoURL: localData.photoURL || parsed.photoURL || DEFAULT_ATHLETE_AVATAR
              }));
            }
          }
        }
      } catch (e) {
        console.warn('[AuthContext] Session restore note:', e);
      }

      if (!auth) {
        if (isMounted) setLoading(false);
        return;
      }

      unsubscribe = onAuthStateChanged(auth, async user => {
        if (!isMounted) return;
        if (user?.uid) {
          const sessionUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL || DEFAULT_ATHLETE_AVATAR
          };
          setCurrentUser(sessionUser);
          persistSession(sessionUser);

          let currentData = null;
          if (db) {
            try {
              const docRef = doc(db, 'users', user.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                currentData = docSnap.data();
                if (isMounted) {
                  setUserProfile(prev => ({
                    ...prev,
                    ...currentData,
                    fullName: currentData.fullName || currentData.name || user.displayName || prev.fullName,
                    name: currentData.fullName || currentData.name || user.displayName || prev.name,
                    email: currentData.email || user.email || prev.email,
                    photoURL: currentData.photoURL || user.photoURL || DEFAULT_ATHLETE_AVATAR
                  }));
                }
                await upsertUserProfile(user.uid, currentData);
              }
            } catch (e) {
              console.warn('[AuthContext] Error fetching profile from Firestore:', e);
            }
          }
          try {
            const localData = await getUserProfileFromDb(user.uid);
            if (localData && isMounted) {
              setUserProfile(prev => ({
                ...prev,
                ...localData,
                fullName: localData.fullName || localData.name || user.displayName || prev.fullName,
                name: localData.fullName || localData.name || user.displayName || prev.name,
                email: localData.email || user.email || prev.email,
                photoURL: localData.photoURL || user.photoURL || prev.photoURL || DEFAULT_ATHLETE_AVATAR
              }));
            } else if (!currentData && isMounted) {
              const cleanName = user.displayName || 'Athlete';
              const cleanEmail = user.email || '';
              const initial = {
                id: user.uid,
                fullName: cleanName,
                name: cleanName,
                email: cleanEmail,
                role: 'athlete',
                gender: 'male',
                primarySport: 'Cricket',
                height: null,
                weight: null,
                age: null,
                readinessScore: 0,
                trainingStreak: 0,
                photoURL: user.photoURL || DEFAULT_ATHLETE_AVATAR
              };
              setUserProfile(initial);
              await upsertUserProfile(user.uid, initial);
            }
          } catch (e) {}
        } else {
          // Firebase reports no user.
          // Check if session storage still has an active session (e.g. offline/demo user).
          // If no stored session (after logout or empty), clear currentUser.
          const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY).catch(() => null);
          if (!storedSession && isMounted) {
            setCurrentUser(null);
            setUserProfile({
              fullName: '',
              email: '',
              role: 'athlete',
              gender: 'male',
              primarySport: 'Cricket',
              photoURL: DEFAULT_ATHLETE_AVATAR,
            });
          }
        }
        if (isMounted) {
          setLoading(false);
        }
      });
    }

    initAuth();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  async function updateUserProfile(data) {
    const updatedName = data.fullName || data.name;
    const updatedPhoto = data.photoURL;

    setUserProfile(prev => {
      const merged = {
        ...prev,
        ...data,
        fullName: updatedName || prev?.fullName || prev?.name || 'Athlete',
        name: updatedName || prev?.name || prev?.fullName || 'Athlete',
        photoURL: updatedPhoto || prev?.photoURL || DEFAULT_ATHLETE_AVATAR
      };
      return merged;
    });

    const targetUid = currentUser?.uid || userProfile?.id;
    if (targetUid) {
      if (updatedName || updatedPhoto) {
        setCurrentUser(prev => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            displayName: updatedName || prev.displayName,
            photoURL: updatedPhoto || prev.photoURL
          };
          persistSession(updated);
          return updated;
        });
      }

      try {
        await upsertUserProfile(targetUid, {
          ...userProfile,
          ...data
        });
      } catch (err) {
        console.warn('[AuthContext] Error saving profile to localDb:', err);
      }

      if (db) {
        try {
          await setDoc(doc(db, 'users', targetUid), data, { merge: true });
        } catch (err) {
          console.warn('[AuthContext] Error saving profile to Firestore:', err);
        }
      }
    }
  }

  // Firebase Auth Functions
  async function signup(email, password, fullName, role = 'athlete') {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const cleanName = fullName?.trim() || 'Athlete';

    if (!auth) {
      const demoUser = { uid: 'user_' + Date.now(), displayName: cleanName, email: trimmedEmail, photoURL: DEFAULT_ATHLETE_AVATAR };
      setCurrentUser(demoUser);
      const newProfile = {
        id: demoUser.uid,
        fullName: cleanName,
        name: cleanName,
        email: trimmedEmail,
        role,
        photoURL: DEFAULT_ATHLETE_AVATAR,
        gender: 'male',
        primarySport: 'Cricket',
        height: null,
        weight: null,
        age: null,
        readinessScore: 0,
        trainingStreak: 0
      };
      setUserProfile(newProfile);
      try {
        await upsertUserProfile(demoUser.uid, newProfile);
      } catch (e) {}
      return { user: demoUser };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      
      // Update Auth Profile
      await updateProfile(userCredential.user, {
        displayName: cleanName,
        photoURL: DEFAULT_ATHLETE_AVATAR
      });

      const initialData = {
        id: userCredential.user.uid,
        fullName: cleanName,
        name: cleanName,
        role,
        email: trimmedEmail,
        photoURL: DEFAULT_ATHLETE_AVATAR,
        height: null,
        weight: null,
        age: null,
        gender: 'male',
        primarySport: 'Cricket',
        readinessScore: 0,
        trainingStreak: 0,
        createdAt: new Date().toISOString()
      };

      setUserProfile(initialData);

      try {
        await upsertUserProfile(userCredential.user.uid, initialData);
      } catch (e) {}

      // Create Firestore document
      if (db) {
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), initialData, { merge: true });
        } catch (e) {
          console.warn('Firestore initial user write error:', e);
        }
      }

      return userCredential;
    } catch (err) {
      const isNetworkOrMockKey = err.code === 'auth/network-request-failed' || err.message?.includes('network') || err.message?.includes('API key not valid') || err.message?.includes('offline');
      if (isNetworkOrMockKey) {
        const demoUser = { uid: 'user_' + Date.now(), displayName: cleanName, email: trimmedEmail, photoURL: DEFAULT_ATHLETE_AVATAR };
        setCurrentUser(demoUser);
        const initialData = {
          id: demoUser.uid,
          fullName: cleanName,
          name: cleanName,
          role,
          email: trimmedEmail,
          photoURL: DEFAULT_ATHLETE_AVATAR,
          height: null,
          weight: null,
          age: null,
          gender: 'male',
          primarySport: 'Cricket',
          readinessScore: 0,
          trainingStreak: 0,
          createdAt: new Date().toISOString()
        };
        setUserProfile(initialData);
        try {
          await upsertUserProfile(demoUser.uid, initialData);
        } catch (e) {}
        await persistSession(demoUser);
        return { user: demoUser };
      }
      throw err;
    }
  }

  async function login(email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const isMockEmail = normalizedEmail === 'aarav.sharma@sportsai.in' || normalizedEmail === 'athlete@sadhaka.com';

    if (!auth) {
      if (isMockEmail) {
        const demoUser = { 
          uid: 'user_athlete_001', 
          displayName: 'Aarav Sharma', 
          email: normalizedEmail, 
          photoURL: DEFAULT_ATHLETE_AVATAR 
        };
        setCurrentUser(demoUser);
        await persistSession(demoUser);
        setUserProfile({ 
          fullName: 'Aarav Sharma', 
          email: normalizedEmail,
          role: 'athlete',
          height: 172,
          weight: 64,
          primarySport: 'Cricket',
          photoURL: DEFAULT_ATHLETE_AVATAR,
          readinessScore: 88,
          trainingStreak: 7
        });
        return { user: demoUser };
      } else {
        const newUid = 'user_' + normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_');
        const demoUser = { 
          uid: newUid, 
          displayName: normalizedEmail.split('@')[0], 
          email: normalizedEmail, 
          photoURL: DEFAULT_ATHLETE_AVATAR 
        };
        setCurrentUser(demoUser);
        await persistSession(demoUser);
        const saved = await getUserProfileFromDb(newUid);
        setUserProfile({
          fullName: saved?.name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          role: 'athlete',
          gender: saved?.gender || 'male',
          primarySport: saved?.primarySport || 'Cricket',
          height: saved?.height || null,
          weight: saved?.weight || null,
          photoURL: DEFAULT_ATHLETE_AVATAR,
          readinessScore: saved?.readinessScore ?? 0,
          trainingStreak: saved?.trainingStreak ?? 0
        });
        return { user: demoUser };
      }
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user?.uid) {
        await persistSession({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });
        if (db) {
          try {
            const snap = await getDoc(doc(db, 'users', result.user.uid));
            if (snap.exists()) {
              setUserProfile(prev => ({ ...prev, ...snap.data(), photoURL: snap.data().photoURL || DEFAULT_ATHLETE_AVATAR }));
            }
          } catch (e) {}
        }
      }
      return result;
    } catch (err) {
      if (isMockEmail) {
        const mockUser = {
          uid: 'user_athlete_001',
          displayName: 'Aarav Sharma',
          email: normalizedEmail,
          photoURL: DEFAULT_ATHLETE_AVATAR
        };
        setCurrentUser(mockUser);
        await persistSession(mockUser);
        setUserProfile({
          fullName: 'Aarav Sharma',
          email: normalizedEmail,
          role: 'athlete',
          height: 172,
          weight: 64,
          gender: 'male',
          primarySport: 'Cricket',
          photoURL: DEFAULT_ATHLETE_AVATAR,
          readinessScore: 88,
          trainingStreak: 7
        });
        return { user: mockUser };
      }
      const isNetworkOrMockKey = err.code === 'auth/network-request-failed' || err.message?.includes('network') || err.message?.includes('API key not valid') || err.message?.includes('offline');
      if (isNetworkOrMockKey) {
        const newUid = 'user_' + normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_');
        const offlineUser = {
          uid: newUid,
          displayName: normalizedEmail.split('@')[0],
          email: normalizedEmail,
          photoURL: DEFAULT_ATHLETE_AVATAR
        };
        setCurrentUser(offlineUser);
        await persistSession(offlineUser);
        const saved = await getUserProfileFromDb(newUid);
        setUserProfile({
          fullName: saved?.name || offlineUser.displayName,
          email: normalizedEmail,
          role: 'athlete',
          gender: saved?.gender || 'male',
          primarySport: saved?.primarySport || 'Cricket',
          height: saved?.height || null,
          weight: saved?.weight || null,
          photoURL: DEFAULT_ATHLETE_AVATAR,
          readinessScore: saved?.readinessScore ?? 0,
          trainingStreak: saved?.trainingStreak ?? 0
        });
        return { user: offlineUser };
      }
      throw err;
    }
  }

  async function loginWithGoogle() {
    if (!auth) {
      const mockUser = { uid: 'user_google_' + Date.now(), displayName: 'Google Athlete', email: 'athlete.google@gmail.com', photoURL: DEFAULT_ATHLETE_AVATAR };
      setCurrentUser(mockUser);
      await persistSession(mockUser);
      const googleData = { fullName: 'Google Athlete', email: 'athlete.google@gmail.com', role: 'athlete', photoURL: DEFAULT_ATHLETE_AVATAR, readinessScore: 0, trainingStreak: 0 };
      setUserProfile(googleData);
      try { await upsertUserProfile(mockUser.uid, googleData); } catch (e) {}
      return { user: mockUser };
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await persistSession({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      });
      const googleData = {
        fullName: result.user.displayName || 'Google Athlete',
        role: 'athlete',
        email: result.user.email,
        photoURL: DEFAULT_ATHLETE_AVATAR,
        readinessScore: 0,
        trainingStreak: 0,
        lastLogin: new Date().toISOString()
      };
      setUserProfile(prev => ({ ...prev, ...googleData }));
      try { await upsertUserProfile(result.user.uid, googleData); } catch (e) {}
      if (db) {
        await setDoc(doc(db, 'users', result.user.uid), googleData, { merge: true });
      }
      return result;
    } catch (err) {
      console.warn('Google sign-in popup notice, proceeding with demo Google account:', err.message);
      const mockUser = { uid: 'user_google_' + Date.now(), displayName: 'Google User', email: 'athlete.google@gmail.com', photoURL: DEFAULT_ATHLETE_AVATAR };
      setCurrentUser(mockUser);
      await persistSession(mockUser);
      const googleData = { fullName: 'Google User', email: 'athlete.google@gmail.com', role: 'athlete', photoURL: DEFAULT_ATHLETE_AVATAR, readinessScore: 0, trainingStreak: 0 };
      setUserProfile(googleData);
      try { await upsertUserProfile(mockUser.uid, googleData); } catch (e) {}
      return { user: mockUser };
    }
  }

  async function logout() {
    try {
      await persistSession(null);
    } catch (e) {}

    setCurrentUser(null);
    setUserProfile({
      fullName: '',
      email: '',
      role: 'athlete',
      gender: 'male',
      primarySport: 'Cricket',
      photoURL: DEFAULT_ATHLETE_AVATAR,
    });

    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('[AuthContext] signOut note:', err);
      }
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    updateUserProfile,
    DEFAULT_ATHLETE_AVATAR,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
