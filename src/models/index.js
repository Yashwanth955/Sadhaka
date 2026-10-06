/**
 * MVC Model Layer - Central Barrel Export
 * Encapsulates all data entities, database queries, SQLite persistence, and business calculations.
 */

export * from './DatabaseModel';
export * from './UserModel';
export * from './TestDefinitionModel';
export * from './SportModel';
export * from './SessionModel';
export * from './ProgressModel';

import { initDb, getDb } from './DatabaseModel';
import { getUserProfileFromDb, MOCK_USER_ID } from './UserModel';
import { getTestsFromLocalDb } from './TestDefinitionModel';
import { getSportsFromLocalDb } from './SportModel';
import { getPendingSessions } from './SessionModel';
import { getUserProgressMetrics } from './ProgressModel';
import { Platform } from 'react-native';

/**
 * Diagnostic utility to inspect local SQLite tables and dataset status.
 */
export async function inspectLocalDb() {
  await initDb();
  const tests = await getTestsFromLocalDb();
  const sports = await getSportsFromLocalDb();
  const pendingSessions = await getPendingSessions();
  const mockUser = await getUserProfileFromDb(MOCK_USER_ID);
  const metrics = await getUserProgressMetrics(MOCK_USER_ID);

  let totalUsers = 1;
  let totalSessions = metrics.totalTests || 0;

  if (Platform.OS !== 'web') {
    const db = await initDb();
    if (db) {
      try {
        const uCount = await db.getFirstAsync(`SELECT COUNT(*) as count FROM users;`);
        totalUsers = uCount?.count || 0;
        const sCount = await db.getFirstAsync(`SELECT COUNT(*) as count FROM sessions;`);
        totalSessions = sCount?.count || 0;
      } catch (e) {}
    }
  }

  console.log('\n==================================================');
  console.log('🔍 LOCAL SQLITE DATABASE INSPECTION REPORT (MVC MODEL)');
  console.log('==================================================');
  console.log(`📋 Total Active Test Definitions: ${tests.length}`);
  console.log(`🏆 Total Sports Catalogs: ${sports.length}`);
  console.log(`👤 Total Users: ${totalUsers}`);
  console.log(`   ├─ User Name: ${mockUser?.name || 'Aarav Sharma'}`);
  console.log(`   ├─ Sport: ${mockUser?.primarySport || 'Cricket'} | Age: ${mockUser?.age || 17} | Gender: ${mockUser?.gender || 'male'}`);
  console.log(`   ├─ Height: ${mockUser?.height || 172} cm | Weight: ${mockUser?.weight || 64} kg`);
  console.log(`   └─ Readiness Score: ${mockUser?.readinessScore || 88}/100 | Streak: ${mockUser?.trainingStreak || 7} days`);
  console.log(`🏃 Total Assessment Sessions: ${totalSessions}`);
  console.log(`📤 Pending Sessions to Sync: ${pendingSessions.length}`);
  console.log('==================================================\n');

  return { tests, sports, pendingSessions, mockUser, metrics, totalUsers, totalSessions };
}
