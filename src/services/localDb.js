import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import testDefinitionsData from '../data/testDefinitionsData.json';
import sportsData from '../data/sportsData.json';

const DB_NAME = 'sports_ai.db';

let dbInstance = null;

// In-memory web fallback store for web platform
const webStore = {
  testDefinitions: new Map(),
  sports: new Map(),
  sessions: []
};

/**
 * Safely converts various timestamp formats (Date, Firestore Timestamp, ISO string, epoch number)
 * into a millisecond epoch number for accurate timestamp comparison.
 */
export const toMillis = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.seconds === 'number') return val.seconds * 1000;
  if (typeof val === 'string') {
    const parsed = new Date(val).getTime();
    return isNaN(parsed) ? 0 : parsed;
  }
  if (val instanceof Date) return val.getTime();
  return 0;
};

/**
 * Classifies a raw user performance score into a standard athletic performance tier.
 * Supports gender-specific benchmarks (male/female), fall_count_fixed inverted scoring,
 * open_ended_reps, and BMI health category classification.
 * 
 * Tiers: "Excellent" | "Good" | "Average" | "Needs Improvement" (or BMI category)
 * 
 * @param {number} value - Raw performance score (e.g. 6.2s, 35 reps, 2.1m, 22.4 BMI)
 * @param {object} benchmarkData - Object containing test definition benchmarks & detectionMethod
 * @param {string} gender - 'male' | 'female' (defaults to 'male')
 * @returns {string} Performance tier or category label
 */
export function getPerformanceLevel(value, benchmarkData = {}, gender = 'male') {
  if (value === undefined || value === null || isNaN(value)) {
    return 'N/A';
  }

  // Handle BMI Test special category classification
  if (benchmarkData.detectionMethod === 'manual_entry' && (benchmarkData.id === 'bmiTest' || benchmarkData.category === 'Health')) {
    const bmi = Number(value);
    const isFemale = String(gender).toLowerCase() === 'female';
    if (isFemale) {
      if (bmi < 19) return 'Underweight';
      if (bmi <= 24) return 'Healthy';
      if (bmi <= 30) return 'Overweight';
      return 'Obese';
    } else {
      if (bmi < 20) return 'Underweight';
      if (bmi <= 25) return 'Healthy';
      if (bmi <= 30) return 'Overweight';
      return 'Obese';
    }
  }

  const isFemale = String(gender).toLowerCase() === 'female';
  const numVal = Number(value);

  // Select gender-specific benchmark fields if present, else fallback to unisex
  const excellent = Number(
    isFemale 
      ? (benchmarkData.benchmarkExcellentFemale ?? benchmarkData.benchmarkExcellent ?? 0)
      : (benchmarkData.benchmarkExcellentMale ?? benchmarkData.benchmarkExcellent ?? 0)
  );

  const good = Number(
    isFemale 
      ? (benchmarkData.benchmarkGoodFemale ?? benchmarkData.benchmarkGood ?? 0)
      : (benchmarkData.benchmarkGoodMale ?? benchmarkData.benchmarkGood ?? 0)
  );

  const average = Number(
    isFemale 
      ? (benchmarkData.benchmarkAverageFemale ?? benchmarkData.benchmarkAverage ?? 0)
      : (benchmarkData.benchmarkAverageMale ?? benchmarkData.benchmarkAverage ?? 0)
  );

  const direction = benchmarkData.benchmarkDirection || 
    (benchmarkData.detectionMethod === 'fall_count_fixed' ? 'lower_is_better' : 'higher_is_better');

  if (direction === 'lower_is_better' || benchmarkData.detectionMethod === 'fall_count_fixed') {
    if (numVal <= excellent) return 'Excellent';
    if (numVal <= good) return 'Good';
    if (numVal <= average) return 'Average';
    return 'Needs Improvement';
  } else {
    // higher_is_better (open_ended_reps, timed_reps, timed_best_attempt, timed_hold, timed_hold_open)
    if (numVal >= excellent) return 'Excellent';
    if (numVal >= good) return 'Good';
    if (numVal >= average) return 'Average';
    return 'Needs Improvement';
  }
}

/**
 * Initializes database connection.
 * On Native (iOS/Android): uses expo-sqlite native database.
 * On Web: uses fast in-memory store pre-populated with JSON content.
 */
export async function initDb() {
  if (Platform.OS === 'web') {
    if (webStore.testDefinitions.size === 0) {
      for (const [id, data] of Object.entries(testDefinitionsData)) {
        webStore.testDefinitions.set(id, { ...data, id, active: data.active !== false });
      }
      for (const [id, data] of Object.entries(sportsData)) {
        webStore.sports.set(id, { ...data, sportId: id, id });
      }
    }
    return null;
  }

  if (dbInstance) return dbInstance;

  try {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    await createTables(dbInstance);
    return dbInstance;
  } catch (error) {
    console.warn('[localDb] Native SQLite init error, falling back to in-memory store:', error);
    return null;
  }
}

export async function getDb() {
  return await initDb();
}

async function createTables(db) {
  const createTestDefinitionsTable = `
    CREATE TABLE IF NOT EXISTS testDefinitions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      shortDescription TEXT,
      whyItMatters TEXT,
      instructions TEXT,
      fixedDuration INTEGER,
      detectionMethod TEXT,
      implementationStatus TEXT,
      statusNote TEXT,
      earlyTerminationRule TEXT,
      sourceReference TEXT,
      benchmarkExcellentMale REAL,
      benchmarkGoodMale REAL,
      benchmarkAverageMale REAL,
      benchmarkExcellentFemale REAL,
      benchmarkGoodFemale REAL,
      benchmarkAverageFemale REAL,
      benchmarkUnit TEXT,
      benchmarkDirection TEXT,
      active INTEGER DEFAULT 1,
      lastUpdated INTEGER DEFAULT 0
    );
  `;

  const createSportsTable = `
    CREATE TABLE IF NOT EXISTS sports (
      id TEXT PRIMARY KEY,
      sportName TEXT NOT NULL,
      hasSubEvents INTEGER DEFAULT 0,
      testIds TEXT,
      subEvents TEXT,
      lastUpdated INTEGER DEFAULT 0
    );
  `;

  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firebaseId TEXT,
      userId TEXT NOT NULL,
      exerciseType TEXT NOT NULL,
      repCount INTEGER DEFAULT 0,
      score REAL DEFAULT 0,
      feedback TEXT,
      duration REAL DEFAULT 0,
      createdAt TEXT NOT NULL,
      syncStatus TEXT DEFAULT 'pending',
      syncAttempts INTEGER DEFAULT 0
    );
  `;

  await db.execAsync(createTestDefinitionsTable);
  await db.execAsync(createSportsTable);
  await db.execAsync(createSessionsTable);
}

// ═══════════════════════════════════════════════════════════════════════════
// UPSERT HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export async function upsertTestDefinition(id, data = {}) {
  const testId = id || data.id;
  const name = data.name || data.title || '';
  const category = data.category || '';
  const shortDescription = data.shortDescription || data.description || '';
  const whyItMatters = data.whyItMatters || '';
  const instructions = data.instructions || '';
  const fixedDuration = data.fixedDuration !== undefined && data.fixedDuration !== null ? Number(data.fixedDuration) : null;
  const detectionMethod = data.detectionMethod || '';
  const implementationStatus = data.implementationStatus || 'full_ai';
  const statusNote = data.statusNote || '';
  const fallback = testDefinitionsData[testId] || {};

  const bExM = (data.benchmarkExcellentMale !== undefined && data.benchmarkExcellentMale !== null && Number(data.benchmarkExcellentMale) !== 0)
    ? Number(data.benchmarkExcellentMale)
    : Number(fallback.benchmarkExcellentMale ?? data.benchmarkExcellent ?? 0);

  const bGdM = (data.benchmarkGoodMale !== undefined && data.benchmarkGoodMale !== null && Number(data.benchmarkGoodMale) !== 0)
    ? Number(data.benchmarkGoodMale)
    : Number(fallback.benchmarkGoodMale ?? data.benchmarkGood ?? 0);

  const bAvgM = (data.benchmarkAverageMale !== undefined && data.benchmarkAverageMale !== null && Number(data.benchmarkAverageMale) !== 0)
    ? Number(data.benchmarkAverageMale)
    : Number(fallback.benchmarkAverageMale ?? data.benchmarkAverage ?? 0);

  const bExF = (data.benchmarkExcellentFemale !== undefined && data.benchmarkExcellentFemale !== null && Number(data.benchmarkExcellentFemale) !== 0)
    ? Number(data.benchmarkExcellentFemale)
    : Number(fallback.benchmarkExcellentFemale ?? data.benchmarkExcellent ?? 0);

  const bGdF = (data.benchmarkGoodFemale !== undefined && data.benchmarkGoodFemale !== null && Number(data.benchmarkGoodFemale) !== 0)
    ? Number(data.benchmarkGoodFemale)
    : Number(fallback.benchmarkGoodFemale ?? data.benchmarkGood ?? 0);

  const bAvgF = (data.benchmarkAverageFemale !== undefined && data.benchmarkAverageFemale !== null && Number(data.benchmarkAverageFemale) !== 0)
    ? Number(data.benchmarkAverageFemale)
    : Number(fallback.benchmarkAverageFemale ?? data.benchmarkAverage ?? 0);

  const bUnit = data.benchmarkUnit || fallback.benchmarkUnit || 'units';
  const bDir = data.benchmarkDirection || fallback.benchmarkDirection || 'higher_is_better';
  const earlyTerminationRule = data.earlyTerminationRule || fallback.earlyTerminationRule || null;
  const sourceReference = data.sourceReference || fallback.sourceReference || 'SAI Khelo India Fitness Test Battery';

  const activeInt = data.active === false || data.active === 0 ? 0 : 1;
  const lastUpdatedMs = toMillis(data.lastUpdated);

  if (Platform.OS === 'web') {
    webStore.testDefinitions.set(testId, {
      id: testId,
      name,
      category,
      shortDescription,
      whyItMatters,
      instructions,
      fixedDuration,
      detectionMethod,
      implementationStatus,
      statusNote,
      earlyTerminationRule,
      sourceReference,
      benchmarkExcellentMale: bExM,
      benchmarkGoodMale: bGdM,
      benchmarkAverageMale: bAvgM,
      benchmarkExcellentFemale: bExF,
      benchmarkGoodFemale: bGdF,
      benchmarkAverageFemale: bAvgF,
      benchmarkUnit: bUnit,
      benchmarkDirection: bDir,
      active: Boolean(activeInt),
      lastUpdated: lastUpdatedMs
    });
    return;
  }

  const db = await initDb();
  if (!db) return;

  await db.runAsync(
    `INSERT OR REPLACE INTO testDefinitions 
     (id, name, category, shortDescription, whyItMatters, instructions, fixedDuration, detectionMethod, implementationStatus, statusNote, earlyTerminationRule, sourceReference, benchmarkExcellentMale, benchmarkGoodMale, benchmarkAverageMale, benchmarkExcellentFemale, benchmarkGoodFemale, benchmarkAverageFemale, benchmarkUnit, benchmarkDirection, active, lastUpdated)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [testId, name, category, shortDescription, whyItMatters, instructions, fixedDuration, detectionMethod, implementationStatus, statusNote, earlyTerminationRule, sourceReference, bExM, bGdM, bAvgM, bExF, bGdF, bAvgF, bUnit, bDir, activeInt, lastUpdatedMs]
  );
}

export async function upsertTestDefinitions(tests) {
  if (Array.isArray(tests)) {
    for (const test of tests) {
      await upsertTestDefinition(test.id, test);
    }
  } else if (typeof tests === 'object' && tests !== null) {
    for (const [id, data] of Object.entries(tests)) {
      await upsertTestDefinition(id, data);
    }
  }
}

export async function upsertSport(id, data = {}) {
  const sportId = id || data.sportId || data.id;
  const sportName = data.sportName || data.name || '';
  const hasSubEventsBool = Boolean(data.hasSubEvents);
  const testIdsArray = Array.isArray(data.testIds) ? data.testIds : [];
  const subEventsData = data.subEvents || null;
  const lastUpdatedMs = toMillis(data.lastUpdated);

  if (Platform.OS === 'web') {
    webStore.sports.set(sportId, {
      id: sportId,
      sportId,
      sportName,
      hasSubEvents: hasSubEventsBool,
      testIds: testIdsArray,
      subEvents: subEventsData,
      lastUpdated: lastUpdatedMs
    });
    return;
  }

  const db = await initDb();
  if (!db) return;

  const testIdsJson = JSON.stringify(testIdsArray);
  const subEventsJson = subEventsData ? JSON.stringify(subEventsData) : null;

  await db.runAsync(
    `INSERT OR REPLACE INTO sports (id, sportName, hasSubEvents, testIds, subEvents, lastUpdated)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [sportId, sportName, hasSubEventsBool ? 1 : 0, testIdsJson, subEventsJson, lastUpdatedMs]
  );
}

export async function upsertSports(sportsList) {
  if (Array.isArray(sportsList)) {
    for (const sport of sportsList) {
      await upsertSport(sport.sportId || sport.id, sport);
    }
  } else if (typeof sportsList === 'object' && sportsList !== null) {
    for (const [id, data] of Object.entries(sportsList)) {
      await upsertSport(id, data);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// READ HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export async function getTestsFromLocalDb() {
  await initDb();

  if (Platform.OS === 'web') {
    return Array.from(webStore.testDefinitions.values()).filter(t => t.active !== false);
  }

  const db = await initDb();
  if (!db) {
    return Array.from(webStore.testDefinitions.values()).filter(t => t.active !== false);
  }

  const rows = await db.getAllAsync(`SELECT * FROM testDefinitions WHERE active = 1 ORDER BY name ASC;`);
  return rows.map(row => ({ ...row, active: Boolean(row.active) }));
}

export async function getTestById(id) {
  await initDb();
  const jsonFallback = testDefinitionsData[id] || null;

  if (Platform.OS === 'web') {
    const webData = webStore.testDefinitions.get(id);
    if (!webData) return jsonFallback;
    return { ...jsonFallback, ...webData };
  }

  const db = await initDb();
  if (!db) {
    const webData = webStore.testDefinitions.get(id);
    return webData ? { ...jsonFallback, ...webData } : jsonFallback;
  }

  const row = await db.getFirstAsync(`SELECT * FROM testDefinitions WHERE id = ?;`, [id]);
  if (!row) return jsonFallback;

  const merged = { ...jsonFallback, ...row, active: Boolean(row.active) };
  if ((!merged.benchmarkExcellentMale && jsonFallback?.benchmarkExcellentMale) || merged.benchmarkExcellentMale === 0) {
    merged.benchmarkExcellentMale = jsonFallback.benchmarkExcellentMale;
    merged.benchmarkGoodMale = jsonFallback.benchmarkGoodMale;
    merged.benchmarkAverageMale = jsonFallback.benchmarkAverageMale;
    merged.benchmarkExcellentFemale = jsonFallback.benchmarkExcellentFemale;
    merged.benchmarkGoodFemale = jsonFallback.benchmarkGoodFemale;
    merged.benchmarkAverageFemale = jsonFallback.benchmarkAverageFemale;
    merged.benchmarkUnit = jsonFallback.benchmarkUnit;
    merged.benchmarkDirection = jsonFallback.benchmarkDirection;
  }
  return merged;
}

export async function getSportsFromLocalDb() {
  await initDb();

  if (Platform.OS === 'web') {
    return Array.from(webStore.sports.values());
  }

  const db = await initDb();
  if (!db) {
    return Array.from(webStore.sports.values());
  }

  const rows = await db.getAllAsync(`SELECT * FROM sports ORDER BY sportName ASC;`);

  return rows.map(row => {
    let parsedTestIds = [];
    let parsedSubEvents = null;
    try { parsedTestIds = JSON.parse(row.testIds || '[]'); } catch (e) {}
    if (row.subEvents) {
      try { parsedSubEvents = JSON.parse(row.subEvents); } catch (e) {}
    }

    const fallbackSport = sportsData[row.id] || {};

    return {
      id: row.id,
      sportId: row.id,
      sportName: row.sportName,
      hasSubEvents: Boolean(row.hasSubEvents),
      testIds: parsedTestIds,
      subEvents: parsedSubEvents,
      image: fallbackSport.image || '',
      icon: fallbackSport.icon || 'fitness-center',
      lastUpdated: row.lastUpdated
    };
  });
}

export async function getSportById(id) {
  await initDb();

  if (Platform.OS === 'web') {
    const webSport = webStore.sports.get(id);
    const fallbackSport = sportsData[id] || {};
    return webSport ? { ...fallbackSport, ...webSport } : (fallbackSport.sportId ? fallbackSport : null);
  }

  const db = await initDb();
  if (!db) {
    const webSport = webStore.sports.get(id);
    const fallbackSport = sportsData[id] || {};
    return webSport ? { ...fallbackSport, ...webSport } : (fallbackSport.sportId ? fallbackSport : null);
  }

  const row = await db.getFirstAsync(`SELECT * FROM sports WHERE id = ?;`, [id]);
  const fallbackSport = sportsData[id] || {};
  if (!row) {
    return fallbackSport.sportId ? fallbackSport : null;
  }

  let parsedTestIds = [];
  let parsedSubEvents = null;
  try { parsedTestIds = JSON.parse(row.testIds || '[]'); } catch (e) {}
  if (row.subEvents) {
    try { parsedSubEvents = JSON.parse(row.subEvents); } catch (e) {}
  }

  return {
    id: row.id,
    sportId: row.id,
    sportName: row.sportName,
    hasSubEvents: Boolean(row.hasSubEvents),
    testIds: parsedTestIds,
    subEvents: parsedSubEvents,
    image: fallbackSport.image || '',
    icon: fallbackSport.icon || 'fitness-center',
    lastUpdated: row.lastUpdated
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSIONS HELPERS
// ═══════════════════════════════════════════════════════════════════════════

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

export async function getPendingSessions() {
  if (Platform.OS === 'web') {
    return webStore.sessions.filter(s => s.syncStatus === 'pending');
  }

  const db = await initDb();
  if (!db) return webStore.sessions.filter(s => s.syncStatus === 'pending');

  return await db.getAllAsync(`SELECT * FROM sessions WHERE syncStatus = 'pending' ORDER BY id ASC;`);
}

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
 * Debug helper to inspect local SQLite database table counts and row data.
 */
export async function inspectLocalDb() {
  const tests = await getTestsFromLocalDb();
  const sports = await getSportsFromLocalDb();
  const pendingSessions = await getPendingSessions();

  console.log('\n==================================================');
  console.log('🔍 LOCAL SQLITE DATABASE INSPECTION REPORT');
  console.log('==================================================');
  console.log(`📋 Total Active Test Definitions in SQLite: ${tests.length}`);
  console.log(`🏆 Total Sports Catalogs in SQLite: ${sports.length}`);
  console.log(`📤 Total Pending User Sessions to Sync: ${pendingSessions.length}`);
  console.log('==================================================\n');

  return { tests, sports, pendingSessions };
}
