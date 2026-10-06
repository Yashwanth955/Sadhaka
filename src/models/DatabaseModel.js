import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import testDefinitionsData from '../data/testDefinitionsData.json';
import sportsData from '../data/sportsData.json';

export const DB_NAME = 'sports_ai.db';

let dbInstance = null;

// In-Memory fallback store for Web environments
export const webStore = {
  testDefinitions: new Map(),
  sports: new Map(),
  sessions: [],
  users: new Map()
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
 * Initializes database connection and ensures tables exist.
 * On Native (iOS/Android): uses expo-sqlite native database with DB_NAME = 'sports_ai.db'.
 * On Web: uses in-memory Map store.
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

  if (dbInstance) {
    return dbInstance;
  }

  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    dbInstance = db;
    await createTables(db);
    return dbInstance;
  } catch (error) {
    console.warn('[DatabaseModel] Native SQLite init error, falling back to in-memory store:', error);
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
      category TEXT NOT NULL,
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

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      gender TEXT DEFAULT 'male',
      age INTEGER DEFAULT NULL,
      primarySport TEXT DEFAULT 'Cricket',
      height REAL DEFAULT NULL,
      weight REAL DEFAULT NULL,
      readinessScore INTEGER DEFAULT 0,
      trainingStreak INTEGER DEFAULT 0,
      photoURL TEXT,
      lastUpdated INTEGER DEFAULT 0
    );
  `;

  await db.execAsync(createTestDefinitionsTable);
  await db.execAsync(createSportsTable);
  await db.execAsync(createSessionsTable);
  await db.execAsync(createUsersTable);
}
