import NetInfo from '@react-native-community/netinfo';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { upsertTestDefinition, upsertSport } from './localDb';
import testDefinitionsData from '../data/testDefinitionsData.json';
import sportsData from '../data/sportsData.json';

// Execution lock to prevent parallel pull sync invocations
let isPullSyncing = false;

/**
 * Auto-seeds Firestore reference collections if cloud database is empty.
 */
async function autoSeedFirestoreIfEmpty(testDefsSnap, sportsSnap) {
  let seededTests = 0;
  let seededSports = 0;

  if (testDefsSnap.empty) {
    console.log('[referenceDataSync] Firestore testDefinitions collection is empty. Auto-seeding cloud database...');
    for (const [id, data] of Object.entries(testDefinitionsData)) {
      try {
        await setDoc(doc(db, 'testDefinitions', id), {
          ...data,
          id,
          active: data.active !== false,
          lastUpdated: serverTimestamp()
        }, { merge: true });
        seededTests++;
      } catch (err) {
        console.warn(`[referenceDataSync] Warning seeding test ${id}:`, err.message);
      }
    }
  }

  if (sportsSnap.empty) {
    console.log('[referenceDataSync] Firestore sports collection is empty. Auto-seeding cloud database...');
    for (const [id, data] of Object.entries(sportsData)) {
      try {
        await setDoc(doc(db, 'sports', id), {
          ...data,
          sportId: id,
          lastUpdated: serverTimestamp()
        }, { merge: true });
        seededSports++;
      } catch (err) {
        console.warn(`[referenceDataSync] Warning seeding sport ${id}:`, err.message);
      }
    }
  }

  if (seededTests > 0 || seededSports > 0) {
    console.log(`[referenceDataSync] Cloud auto-seed completed (${seededTests} tests, ${seededSports} sports).`);
  }
}

/**
 * PULL SYNC SERVICE (Cloud -> Device)
 * 
 * Synchronizes reference data (testDefinitions & sports) from Firestore to local SQLite.
 *  a. Checks NetInfo for connectivity. If offline, returns immediately (silently skips).
 *  b. If online, fetches all docs from Firestore `testDefinitions` collection and upserts into SQLite.
 *  c. Fetches all docs from Firestore `sports` collection and upserts into SQLite.
 *  d. Auto-seeds Firestore if cloud collections are currently empty.
 *  e. Logs how many records were synced.
 * 
 * Idempotent operation — safe to invoke repeatedly.
 */
export async function syncReferenceData() {
  // 1. Check network connectivity
  const netState = await NetInfo.fetch();
  const isOnline = Boolean(netState.isConnected && netState.isInternetReachable !== false);

  if (!isOnline) {
    console.log('[referenceDataSync] Device is offline. Silently skipping reference data sync.');
    return { status: 'skipped_offline', syncedTests: 0, syncedSports: 0 };
  }

  if (isPullSyncing) {
    console.log('[referenceDataSync] Reference data sync is already in progress. Skipping.');
    return { status: 'in_progress', syncedTests: 0, syncedSports: 0 };
  }

  isPullSyncing = true;

  try {
    console.log('[referenceDataSync] Online. Starting reference data pull from Firestore...');

    // 2. Query Firestore reference collections
    const testDefsRef = collection(db, 'testDefinitions');
    let testDefsSnap = await getDocs(testDefsRef);

    const sportsRef = collection(db, 'sports');
    let sportsSnap = await getDocs(sportsRef);

    // Auto-seed cloud database if empty
    if (testDefsSnap.empty || sportsSnap.empty) {
      await autoSeedFirestoreIfEmpty(testDefsSnap, sportsSnap);
      // Re-fetch snapshots after seeding
      testDefsSnap = await getDocs(testDefsRef);
      sportsSnap = await getDocs(sportsRef);
    }

    // 3. Upsert testDefinitions into SQLite (and heal cloud documents missing gender benchmarks)
    let syncedTests = 0;
    for (const docSnap of testDefsSnap.docs) {
      const cloudData = docSnap.data() || {};
      const localFallback = testDefinitionsData[docSnap.id] || {};
      
      // If cloud document is missing gender-specific benchmarks or has 0, auto-heal Firestore
      if (cloudData.benchmarkExcellentMale === undefined || cloudData.benchmarkExcellentMale === 0) {
        if (localFallback.benchmarkExcellentMale) {
          try {
            await setDoc(doc(db, 'testDefinitions', docSnap.id), {
              ...localFallback,
              id: docSnap.id,
              lastUpdated: serverTimestamp()
            }, { merge: true });
          } catch (healErr) {
            console.warn(`[referenceDataSync] Cloud heal warning for ${docSnap.id}:`, healErr.message);
          }
        }
      }

      const mergedData = { ...localFallback, ...cloudData };
      await upsertTestDefinition(docSnap.id, mergedData);
      syncedTests++;
    }

    // 4. Upsert sports into SQLite
    let syncedSports = 0;
    for (const docSnap of sportsSnap.docs) {
      const cloudData = docSnap.data() || {};
      const localFallback = sportsData[docSnap.id] || {};
      const mergedData = { ...localFallback, ...cloudData };
      await upsertSport(docSnap.id, mergedData);
      syncedSports++;
    }

    console.log(`[referenceDataSync] Reference data pull complete. Synced ${syncedTests} test(s) and ${syncedSports} sport(s) to SQLite.`);

    return {
      status: 'complete',
      syncedTests,
      syncedSports
    };
  } catch (error) {
    console.error('[referenceDataSync] Error syncing reference data from Firestore:', error);
    return { status: 'error', error: error.message };
  } finally {
    isPullSyncing = false;
  }
}
