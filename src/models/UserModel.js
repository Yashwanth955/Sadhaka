import { Platform } from 'react-native';
import { initDb, webStore } from './DatabaseModel';

export const MOCK_USER_ID = 'user_athlete_001';

export const DEFAULT_ATHLETE_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

export const MOCK_USER_PROFILE = {
  id: MOCK_USER_ID,
  name: 'Aarav Sharma',
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@sportsai.in',
  gender: 'male',
  age: 17,
  dob: '2009-03-15',
  primarySport: 'Cricket',
  height: 172,
  weight: 64,
  readinessScore: 88,
  trainingStreak: 7,
  photoURL: DEFAULT_ATHLETE_AVATAR,
  tier: 'Elite Tier',
  aadhaarStatus: 'Pending KYC',
  lastUpdated: Date.now()
};

/**
 * Upserts a user profile into SQLite (or in-memory web store).
 */
export async function upsertUserProfile(userId, data = {}) {
  if (!userId) return;

  const db = await initDb();
  let existing = null;

  if (Platform.OS === 'web' || !db) {
    existing = webStore.users.get(userId) || null;
  } else {
    try {
      existing = await db.getFirstAsync(`SELECT * FROM users WHERE id = ?;`, [userId]);
    } catch (e) {}
  }

  const name = data.fullName || data.name || existing?.name || existing?.fullName || 'Athlete';
  const email = data.email !== undefined ? data.email : (existing?.email || '');
  const gender = data.gender || existing?.gender || 'male';
  const age = (data.age !== undefined && data.age !== null) ? Number(data.age) : (existing?.age ?? null);
  const primarySport = data.primarySport || existing?.primarySport || 'Cricket';
  const height = (data.height !== undefined && data.height !== null) ? Number(data.height) : (existing?.height ?? null);
  const weight = (data.weight !== undefined && data.weight !== null) ? Number(data.weight) : (existing?.weight ?? null);
  const readinessScore = (data.readinessScore !== undefined && data.readinessScore !== null) ? Number(data.readinessScore) : (existing?.readinessScore ?? 0);
  const trainingStreak = (data.trainingStreak !== undefined && data.trainingStreak !== null) ? Number(data.trainingStreak) : (existing?.trainingStreak ?? 0);
  const photoURL = data.photoURL !== undefined ? data.photoURL : (existing?.photoURL || null);
  const lastUpdated = Date.now();

  const userObj = {
    ...(existing || {}),
    ...data,
    id: userId,
    name,
    fullName: name,
    email,
    gender,
    age,
    primarySport,
    height,
    weight,
    readinessScore,
    trainingStreak,
    photoURL,
    lastUpdated
  };

  if (Platform.OS === 'web' || !db) {
    webStore.users.set(userId, userObj);
    return;
  }

  await db.runAsync(
    `INSERT OR REPLACE INTO users (id, name, email, gender, age, primarySport, height, weight, readinessScore, trainingStreak, photoURL, lastUpdated)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [userId, name, email, gender, age, primarySport, height, weight, readinessScore, trainingStreak, photoURL, lastUpdated]
  );
}

/**
 * Retrieves a user profile from local database.
 */
export async function getUserProfileFromDb(userId = null) {
  if (!userId) return null;
  const db = await initDb();
  const isMock = userId === MOCK_USER_ID;

  const formatProfile = (r) => {
    if (!r) return null;
    return {
      ...r,
      fullName: r.name || r.fullName || 'Athlete',
      name: r.name || r.fullName || 'Athlete',
      email: r.email || '',
      age: r.age ?? (isMock ? 17 : null),
      dob: r.dob || (isMock ? '2009-03-15' : null),
      gender: r.gender || 'male',
      height: r.height ?? (isMock ? 172 : null),
      weight: r.weight ?? (isMock ? 64 : null),
      primarySport: r.primarySport || 'Cricket',
      readinessScore: r.readinessScore ?? 0,
      trainingStreak: r.trainingStreak ?? 0,
      photoURL: r.photoURL || null
    };
  };

  if (Platform.OS === 'web' || !db) {
    if (isMock) {
      const p = webStore.users.get(MOCK_USER_ID) || MOCK_USER_PROFILE;
      return { ...MOCK_USER_PROFILE, ...p };
    }
    const p = webStore.users.get(userId);
    return formatProfile(p);
  }

  const row = await db.getFirstAsync(`SELECT * FROM users WHERE id = ?;`, [userId]);
  if (row) {
    if (isMock) {
      return { ...MOCK_USER_PROFILE, ...row };
    }
    return formatProfile(row);
  }

  if (isMock) {
    const mockRow = await db.getFirstAsync(`SELECT * FROM users WHERE id = ?;`, [MOCK_USER_ID]);
    return mockRow ? { ...MOCK_USER_PROFILE, ...mockRow } : MOCK_USER_PROFILE;
  }

  return null;
}

/**
 * Seeds default Aarav Sharma profile for mock testing if not present.
 */
export async function seedMockUserIfEmpty(db) {
  if (Platform.OS === 'web') {
    if (webStore.users.size === 0) {
      webStore.users.set(MOCK_USER_ID, { ...MOCK_USER_PROFILE });
    }
    return;
  }

  if (!db) return;

  try {
    const userCount = await db.getFirstAsync(`SELECT COUNT(*) as count FROM users WHERE id = ?;`, [MOCK_USER_ID]);
    if (!userCount || userCount.count === 0) {
      await db.runAsync(
        `INSERT INTO users (id, name, email, gender, age, primarySport, height, weight, readinessScore, trainingStreak, photoURL, lastUpdated)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          MOCK_USER_PROFILE.id,
          MOCK_USER_PROFILE.name,
          MOCK_USER_PROFILE.email,
          MOCK_USER_PROFILE.gender,
          MOCK_USER_PROFILE.age,
          MOCK_USER_PROFILE.primarySport,
          MOCK_USER_PROFILE.height,
          MOCK_USER_PROFILE.weight,
          MOCK_USER_PROFILE.readinessScore,
          MOCK_USER_PROFILE.trainingStreak,
          MOCK_USER_PROFILE.photoURL,
          Date.now()
        ]
      );
    }
  } catch (err) {
    console.warn('[UserModel] seedMockUser error:', err);
  }
}
