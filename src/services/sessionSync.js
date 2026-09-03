import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getPendingSessions, updateSessionSyncStatus } from './localDb';

// Lock flag to prevent concurrent push sync runs
let isPushSyncing = false;

/**
 * PART 2: PUSH SYNC — Sessions (Device → Cloud)
 * 
 * Synchronizes user-generated assessment sessions from local SQLite to Firestore.
 *  a. Queries SQLite for rows where syncStatus = 'pending'.
 *  b. Pushes each row to Firestore under `users/{userId}/sessions/{firestoreAutoId}`.
 *  c. On success: updates local row syncStatus = 'synced' and saves firebaseId.
 *  d. On failure: increments syncAttempts. Leaves as 'pending' for retry, or marks 'failed' after 3 failed attempts.
 */
export async function syncPendingSessions() {
  if (isPushSyncing) {
    console.log('[sessionSync] Push sync already in progress. Skipping redundant invocation.');
    return { status: 'in_progress', syncedCount: 0, failedCount: 0 };
  }

  isPushSyncing = true;

  try {
    const pendingSessions = await getPendingSessions();

    if (!pendingSessions || pendingSessions.length === 0) {
      console.log('[sessionSync] No pending sessions to sync.');
      return { status: 'idle', syncedCount: 0, failedCount: 0 };
    }

    console.log(`[sessionSync] Found ${pendingSessions.length} pending session(s) to push to cloud.`);

    let syncedCount = 0;
    let failedCount = 0;

    for (const session of pendingSessions) {
      try {
        if (!session.userId) {
          console.warn(`[sessionSync] Session ${session.id} missing userId. Marking failed.`);
          await updateSessionSyncStatus(session.id, null, 'failed', (session.syncAttempts || 0) + 1);
          failedCount++;
          continue;
        }

        // Target Firestore path: users/{userId}/sessions/{firestoreAutoId}
        const userSessionsRef = collection(db, 'users', session.userId, 'sessions');

        const sessionPayload = {
          exerciseType: session.exerciseType,
          repCount: session.repCount,
          score: session.score,
          feedback: session.feedback || '',
          duration: session.duration,
          createdAt: session.createdAt,
          localId: session.id,
          syncedAt: serverTimestamp()
        };

        const docRef = await addDoc(userSessionsRef, sessionPayload);

        // Update local database record to 'synced' with the Firestore generated ID
        await updateSessionSyncStatus(session.id, docRef.id, 'synced', session.syncAttempts || 0);
        syncedCount++;
        console.log(`[sessionSync] Session ${session.id} successfully synced with Firestore ID: ${docRef.id}`);
      } catch (error) {
        console.error(`[sessionSync] Failed to push session ${session.id} to Firestore:`, error);
        
        const currentAttempts = (session.syncAttempts || 0) + 1;
        const newStatus = currentAttempts >= 3 ? 'failed' : 'pending';

        await updateSessionSyncStatus(session.id, null, newStatus, currentAttempts);
        failedCount++;

        if (newStatus === 'failed') {
          console.warn(`[sessionSync] Session ${session.id} reached maximum retries (3) and is marked 'failed'.`);
        }
      }
    }

    return {
      status: 'complete',
      syncedCount,
      failedCount,
      totalProcessed: pendingSessions.length
    };
  } catch (error) {
    console.error('[sessionSync] Critical error in syncPendingSessions:', error);
    throw error;
  } finally {
    isPushSyncing = false;
  }
}
