import { Platform } from 'react-native';
import { initDb, webStore } from './DatabaseModel';
import { MOCK_USER_ID } from './UserModel';

const NOW = Date.now();
const ONE_DAY = 24 * 60 * 60 * 1000;

export const MOCK_SESSIONS = [
  // Day 0 (Today)
  {
    exerciseType: '30mSprintTest',
    repCount: 1,
    score: 4.12,
    feedback: 'Exceptional explosive start and acceleration. New Personal Best!',
    duration: 4.12,
    createdAt: new Date(NOW - 2 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'verticalJumpTest',
    repCount: 1,
    score: 65.0,
    feedback: 'Explosive hip extension with 65cm vertical leap. Top 10% Khelo India tier.',
    duration: 3.5,
    createdAt: new Date(NOW - 4 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'pushUpsTest',
    repCount: 48,
    score: 48.0,
    feedback: 'Full range of motion maintained for 48 reps in 60 seconds.',
    duration: 60.0,
    createdAt: new Date(NOW - 6 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'plankTest',
    repCount: 1,
    score: 95.0,
    feedback: 'Strong core endurance with neutral spine and zero hip sag.',
    duration: 95.0,
    createdAt: new Date(NOW - 8 * 3600 * 1000).toISOString()
  },

  // Day 1 (Yesterday)
  {
    exerciseType: 'pushUpsTest',
    repCount: 46,
    score: 46.0,
    feedback: 'Consistent cadence with full chest lockout on all reps.',
    duration: 60.0,
    createdAt: new Date(NOW - ONE_DAY - 2 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'shuttleRunTest',
    repCount: 1,
    score: 4.55,
    feedback: 'Sharp deceleration and low center of gravity on cone turns.',
    duration: 4.55,
    createdAt: new Date(NOW - ONE_DAY - 4 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'squatsTest',
    repCount: 25,
    score: 25.0,
    feedback: 'Deep parallel knee bend with strong drive on ascent.',
    duration: 30.0,
    createdAt: new Date(NOW - ONE_DAY - 6 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'standingBroadJumpTest',
    repCount: 1,
    score: 2.45,
    feedback: 'Solid two-foot takeoff and steady forward stick on landing.',
    duration: 2.5,
    createdAt: new Date(NOW - ONE_DAY - 8 * 3600 * 1000).toISOString()
  },

  // Day 2 (2 Days Ago)
  {
    exerciseType: 'squatsTest',
    repCount: 24,
    score: 24.0,
    feedback: 'Thighs reached parallel on all reps with consistent cadence.',
    duration: 30.0,
    createdAt: new Date(NOW - 2 * ONE_DAY - 2 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'standingBroadJumpTest',
    repCount: 1,
    score: 2.40,
    feedback: 'Clean arm swing and balanced stick on landing pad.',
    duration: 2.5,
    createdAt: new Date(NOW - 2 * ONE_DAY - 4 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'partialCurlUpTest',
    repCount: 30,
    score: 30.0,
    feedback: 'Smooth controlled abdominal flexions with zero neck strain.',
    duration: 30.0,
    createdAt: new Date(NOW - 2 * ONE_DAY - 6 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'sitAndReachTest',
    repCount: 1,
    score: 33.5,
    feedback: 'Good posterior chain mobility and lower back flexibility.',
    duration: 5.0,
    createdAt: new Date(NOW - 2 * ONE_DAY - 8 * 3600 * 1000).toISOString()
  },

  // Day 3 (3 Days Ago)
  {
    exerciseType: 'sitAndReachTest',
    repCount: 1,
    score: 34.0,
    feedback: 'Excellent hamstring flexibility and spine mobility.',
    duration: 5.0,
    createdAt: new Date(NOW - 3 * ONE_DAY - 2 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: '30mSprintTest',
    repCount: 1,
    score: 4.22,
    feedback: 'Consistent drive phase with good knee drive.',
    duration: 4.22,
    createdAt: new Date(NOW - 3 * ONE_DAY - 4 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'pushUpsTest',
    repCount: 45,
    score: 45.0,
    feedback: 'Full repetition depth recorded across entire set.',
    duration: 60.0,
    createdAt: new Date(NOW - 3 * ONE_DAY - 6 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'verticalJumpTest',
    repCount: 1,
    score: 63.5,
    feedback: 'Powerful countermovement jump with swift arm swing.',
    duration: 3.5,
    createdAt: new Date(NOW - 3 * ONE_DAY - 8 * 3600 * 1000).toISOString()
  },

  // Day 4 (4 Days Ago)
  {
    exerciseType: 'plankTest',
    repCount: 1,
    score: 95.0,
    feedback: 'Strong core endurance with neutral spine and zero hip sag.',
    duration: 95.0,
    createdAt: new Date(NOW - 4 * ONE_DAY - 2 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'verticalJumpTest',
    repCount: 1,
    score: 63.0,
    feedback: 'High countermovement jump with strong ankle plantarflexion.',
    duration: 3.5,
    createdAt: new Date(NOW - 4 * ONE_DAY - 4 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'shuttleRunTest',
    repCount: 1,
    score: 4.58,
    feedback: 'Quick deceleration and lateral change of direction.',
    duration: 4.58,
    createdAt: new Date(NOW - 4 * ONE_DAY - 6 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'squatsTest',
    repCount: 24,
    score: 24.0,
    feedback: 'Solid squat volume with steady tempo throughout 30s.',
    duration: 30.0,
    createdAt: new Date(NOW - 4 * ONE_DAY - 8 * 3600 * 1000).toISOString()
  },

  // Day 5 (5 Days Ago)
  {
    exerciseType: 'partialCurlUpTest',
    repCount: 28,
    score: 28.0,
    feedback: 'Smooth controlled abdominal flexions with zero neck strain.',
    duration: 30.0,
    createdAt: new Date(NOW - 5 * ONE_DAY - 2 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'pushUpsTest',
    repCount: 44,
    score: 44.0,
    feedback: 'Controlled upper body cadence through fatigue barrier.',
    duration: 60.0,
    createdAt: new Date(NOW - 5 * ONE_DAY - 4 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: '30mSprintTest',
    repCount: 1,
    score: 4.20,
    feedback: 'Strong acceleration and posture out of starting blocks.',
    duration: 4.20,
    createdAt: new Date(NOW - 5 * ONE_DAY - 6 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'standingBroadJumpTest',
    repCount: 1,
    score: 2.38,
    feedback: 'Explosive hip extension and two-foot landing.',
    duration: 2.5,
    createdAt: new Date(NOW - 5 * ONE_DAY - 8 * 3600 * 1000).toISOString()
  },

  // Day 6 (6 Days Ago)
  {
    exerciseType: 'shuttleRunTest',
    repCount: 1,
    score: 4.62,
    feedback: 'Good foot placement and center of gravity control on pivot lines.',
    duration: 4.62,
    createdAt: new Date(NOW - 6 * ONE_DAY - 2 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'squatsTest',
    repCount: 22,
    score: 22.0,
    feedback: 'Steady tempo and balance throughout test block.',
    duration: 30.0,
    createdAt: new Date(NOW - 6 * ONE_DAY - 4 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'sitAndReachTest',
    repCount: 1,
    score: 32.5,
    feedback: 'Controlled reach with knees flat on ground.',
    duration: 5.0,
    createdAt: new Date(NOW - 6 * ONE_DAY - 6 * 3600 * 1000).toISOString()
  },
  {
    exerciseType: 'plankTest',
    repCount: 1,
    score: 90.0,
    feedback: 'Consistent core tension held for full 90 seconds.',
    duration: 90.0,
    createdAt: new Date(NOW - 6 * ONE_DAY - 8 * 3600 * 1000).toISOString()
  }
];

/**
 * Saves a completed assessment session locally to SQLite.
 */
export async function saveSessionLocally(sessionData) {
  const {
    userId,
    exerciseType,
    repCount = 0,
    score = 0,
    feedback = '',
    duration = 0,
    createdAt = new Date().toISOString()
  } = sessionData;

  if (Platform.OS === 'web') {
    const newSession = {
      id: webStore.sessions.length + 1,
      firebaseId: null,
      userId,
      exerciseType,
      repCount,
      score,
      feedback,
      duration,
      createdAt,
      syncStatus: 'pending',
      syncAttempts: 0
    };
    webStore.sessions.push(newSession);
    return newSession;
  }

  const db = await initDb();
  if (!db) {
    const newSession = {
      id: webStore.sessions.length + 1,
      firebaseId: null,
      userId,
      exerciseType,
      repCount,
      score,
      feedback,
      duration,
      createdAt,
      syncStatus: 'pending',
      syncAttempts: 0
    };
    webStore.sessions.push(newSession);
    return newSession;
  }

  const result = await db.runAsync(
    `INSERT INTO sessions (firebaseId, userId, exerciseType, repCount, score, feedback, duration, createdAt, syncStatus, syncAttempts)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [null, userId, exerciseType, repCount, score, feedback, duration, createdAt, 'pending', 0]
  );

  return {
    id: result.lastInsertRowId,
    firebaseId: null,
    userId,
    exerciseType,
    repCount,
    score,
    feedback,
    duration,
    createdAt,
    syncStatus: 'pending',
    syncAttempts: 0
  };
}

/**
 * Retrieves assessment session history for a specified user ID.
 */
export async function getSessionHistory(userId) {
  if (Platform.OS === 'web') {
    return webStore.sessions
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const db = await initDb();
  if (!db) {
    return webStore.sessions
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return await db.getAllAsync(`SELECT * FROM sessions WHERE userId = ? ORDER BY createdAt DESC;`, [userId]);
}

/**
 * Retrieves pending sessions waiting to sync to Firebase.
 */
export async function getPendingSessions() {
  if (Platform.OS === 'web') {
    return webStore.sessions.filter(s => s.syncStatus === 'pending');
  }

  const db = await initDb();
  if (!db) return webStore.sessions.filter(s => s.syncStatus === 'pending');

  return await db.getAllAsync(`SELECT * FROM sessions WHERE syncStatus = 'pending' ORDER BY id ASC;`);
}

/**
 * Updates sync status of a local session record.
 */
export async function updateSessionSyncStatus(localId, firebaseId, syncStatus, syncAttempts = 0) {
  if (Platform.OS === 'web') {
    const session = webStore.sessions.find(s => s.id === localId);
    if (session) {
      if (firebaseId !== null) session.firebaseId = firebaseId;
      session.syncStatus = syncStatus;
      session.syncAttempts = syncAttempts;
    }
    return;
  }

  const db = await initDb();
  if (!db) return;

  await db.runAsync(
    `UPDATE sessions SET firebaseId = COALESCE(?, firebaseId), syncStatus = ?, syncAttempts = ? WHERE id = ?;`,
    [firebaseId, syncStatus, syncAttempts, localId]
  );
}

/**
 * Seeds default mock sessions for Aarav Sharma into SQLite or webStore.
 */
export async function seedMockSessionsIfEmpty(db) {
  if (Platform.OS === 'web') {
    if (webStore.sessions.length === 0) {
      MOCK_SESSIONS.forEach((s, idx) => {
        webStore.sessions.push({ ...s, id: idx + 1, userId: MOCK_USER_ID, syncStatus: 'synced', syncAttempts: 0 });
      });
    }
    return;
  }

  if (!db) return;

  try {
    const sessionCount = await db.getFirstAsync(`SELECT COUNT(*) as count FROM sessions WHERE userId = ?;`, [MOCK_USER_ID]);
    if (!sessionCount || sessionCount.count === 0) {
      for (const s of MOCK_SESSIONS) {
        await db.runAsync(
          `INSERT INTO sessions (firebaseId, userId, exerciseType, repCount, score, feedback, duration, createdAt, syncStatus, syncAttempts)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [null, MOCK_USER_ID, s.exerciseType, s.repCount, s.score, s.feedback, s.duration, s.createdAt, 'synced', 0]
        );
      }
    }

    // Clean up any legacy mock sessions that might have been stored with empty or null userId
    await db.runAsync(
      `UPDATE sessions SET userId = ? WHERE userId IS NULL OR userId = '' OR userId = 'null';`,
      [MOCK_USER_ID]
    );
  } catch (err) {
    console.warn('[SessionModel] seedMockSessions error:', err);
  }
}
