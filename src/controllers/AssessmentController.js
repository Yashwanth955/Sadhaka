/**
 * MVC Controller: AssessmentController
 * Orchestrates fitness test catalog, benchmark evaluation, trial session recording,
 * and offline-first synchronization with remote cloud storage.
 */

import { 
  getTestsFromLocalDb, 
  getTestById, 
  calculateBenchmarkTier, 
  formatGenderBenchmark 
} from '../models/TestDefinitionModel';
import { 
  saveSessionLocally, 
  getSessionHistory, 
  getPendingSessions, 
  updateSessionSyncStatus 
} from '../models/SessionModel';
import { db as firestoreDb } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const AssessmentController = {
  /**
   * Retrieves all active test definitions, optionally filtered by category.
   */
  async getTests(categoryFilter = null) {
    const tests = await getTestsFromLocalDb();
    if (!categoryFilter || categoryFilter === 'All') {
      return tests;
    }
    return tests.filter(t => t.category?.toLowerCase() === categoryFilter.toLowerCase());
  },

  /**
   * Retrieves full test details including benchmarks and instructions.
   */
  async getTestDetails(testId) {
    if (!testId) return null;
    return await getTestById(testId);
  },

  /**
   * Evaluates performance score against Khelo India benchmarks.
   */
  evaluatePerformance(testData, score, gender = 'male') {
    return calculateBenchmarkTier(score, testData, gender);
  },

  /**
   * Returns formatted benchmark strings for UI display cards.
   */
  getDisplayBenchmarks(testData, gender = 'male') {
    return formatGenderBenchmark(testData, gender);
  },

  /**
   * Records a completed test session to local SQLite database.
   */
  async recordSession({ userId, exerciseType, repCount = 0, score = 0, feedback = '', duration = 0 }) {
    if (!userId || !exerciseType) {
      throw new Error('User ID and exercise type are required to record a session.');
    }

    const sessionRecord = await saveSessionLocally({
      userId,
      exerciseType,
      repCount,
      score,
      feedback,
      duration
    });

    // Attempt non-blocking background sync if connected
    this.syncPendingSessions(userId).catch(err => {
      console.log('[AssessmentController] Background sync queued for next online window.');
    });

    return sessionRecord;
  },

  /**
   * Retrieves past assessment sessions for a specific user.
   */
  async getUserSessionHistory(userId) {
    if (!userId) return [];
    return await getSessionHistory(userId);
  },

  /**
   * Syncs pending offline sessions to Firebase Firestore when connectivity is available.
   */
  async syncPendingSessions(userId) {
    if (!firestoreDb) return { synced: 0, failed: 0 };

    const pending = await getPendingSessions();
    const userPending = userId ? pending.filter(s => s.userId === userId) : pending;
    
    let synced = 0;
    let failed = 0;

    for (const session of userPending) {
      try {
        const docRef = await addDoc(collection(firestoreDb, 'sessions'), {
          userId: session.userId,
          exerciseType: session.exerciseType,
          repCount: session.repCount,
          score: session.score,
          feedback: session.feedback,
          duration: session.duration,
          createdAt: session.createdAt,
          syncedAt: serverTimestamp()
        });

        await updateSessionSyncStatus(session.id, docRef.id, 'synced', session.syncAttempts || 0);
        synced++;
      } catch (err) {
        failed++;
        await updateSessionSyncStatus(session.id, null, 'failed', (session.syncAttempts || 0) + 1);
      }
    }

    return { synced, failed };
  }
};
