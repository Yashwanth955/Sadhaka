/**
 * MVC Controller: AuthController
 * Coordinates user authentication, credential validation, session caching,
 * and user profile synchronization between Firebase and local UserModel.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile as fbUpdateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { 
  MOCK_USER_ID, 
  MOCK_USER_PROFILE, 
  DEFAULT_ATHLETE_AVATAR,
  getUserProfileFromDb, 
  upsertUserProfile 
} from '../models/UserModel';

export const SESSION_STORAGE_KEY = '@sadhaka_user_session';

export const AuthController = {
  /**
   * Checks whether a given user ID or object corresponds to the mock athlete.
   */
  isMockUser(userOrId) {
    if (!userOrId) return false;
    const uid = typeof userOrId === 'string' ? userOrId : (userOrId.uid || userOrId.id);
    return uid === MOCK_USER_ID;
  },

  /**
   * Restores cached session from AsyncStorage on app launch.
   */
  async restoreCachedSession() {
    try {
      const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.uid) {
          const profile = await getUserProfileFromDb(parsed.uid);
          return { user: parsed, profile };
        }
      }
    } catch (e) {
      console.warn('[AuthController] Session restore failed:', e);
    }
    return { user: null, profile: null };
  },

  /**
   * Persists session data to AsyncStorage.
   */
  async persistSession(user) {
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
      console.warn('[AuthController] Session persist failed:', e);
    }
  },

  /**
   * Logs in a user with email and password.
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    if (!auth) {
      throw new Error('Authentication service is currently unavailable.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    const sessionUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || DEFAULT_ATHLETE_AVATAR
    };

    await this.persistSession(sessionUser);
    const localProfile = await getUserProfileFromDb(user.uid);

    return { user: sessionUser, profile: localProfile };
  },

  /**
   * Signs up a new user and initializes their profile record.
   */
  async signup(email, password, additionalData = {}) {
    if (!email || !password) {
      throw new Error('Please provide email and password.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (!auth) {
      throw new Error('Authentication service is currently unavailable.');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    const displayName = additionalData.fullName || additionalData.name || 'Athlete';
    if (user.uid && auth.currentUser) {
      try {
        await fbUpdateProfile(auth.currentUser, {
          displayName,
          photoURL: additionalData.photoURL || DEFAULT_ATHLETE_AVATAR
        });
      } catch (err) {
        console.warn('[AuthController] Could not update displayName:', err);
      }
    }

    const newProfile = {
      id: user.uid,
      fullName: displayName,
      name: displayName,
      email: user.email,
      gender: additionalData.gender || 'male',
      age: additionalData.age ? Number(additionalData.age) : null,
      primarySport: additionalData.primarySport || 'Cricket',
      height: additionalData.height ? Number(additionalData.height) : null,
      weight: additionalData.weight ? Number(additionalData.weight) : null,
      readinessScore: 0,
      trainingStreak: 0,
      photoURL: additionalData.photoURL || DEFAULT_ATHLETE_AVATAR
    };

    await upsertUserProfile(user.uid, newProfile);

    const sessionUser = {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: newProfile.photoURL
    };

    await this.persistSession(sessionUser);

    return { user: sessionUser, profile: newProfile };
  },

  /**
   * Logs out the user and cleans up stored session tokens.
   */
  async logout() {
    try {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('[AuthController] Sign out error:', e);
    }
  }
};
