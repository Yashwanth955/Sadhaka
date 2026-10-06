/**
 * MVC Controller: ProgressController
 * Aggregates athlete progress metrics, charts, streaks, and personal records.
 */

import { getUserProgressMetrics } from '../models/ProgressModel';
import { getSessionHistory } from '../models/SessionModel';
import { getTestsFromLocalDb } from '../models/TestDefinitionModel';

export const ProgressController = {
  /**
   * Retrieves comprehensive progress metrics for dashboard and insight screens.
   *
   * @param {string} userId - User ID
   * @param {string} timeFilter - 'Day' | 'Week' | 'Month'
   * @returns {Promise<object>} Metrics, charts, streaks, and sessions
   */
  async getMetrics(userId, timeFilter = 'Week') {
    return await getUserProgressMetrics(userId, timeFilter);
  },

  /**
   * Computes athlete readiness tier label from a 0-100 score.
   */
  getReadinessTier(score) {
    if (score >= 85) return { label: 'Optimal', color: '#10B981', note: 'Prime condition for peak performance testing.' };
    if (score >= 70) return { label: 'Good', color: '#3B82F6', note: 'Ready for standard assessment trials.' };
    if (score >= 50) return { label: 'Moderate', color: '#F59E0B', note: 'Adequate recovery, pacing advised.' };
    return { label: 'Low', color: '#EF4444', note: 'Rest and recovery recommended before maximum exertion.' };
  },

  /**
   * Retrieves personal best scores categorized by exercise type.
   */
  async getPersonalBests(userId) {
    const metrics = await getUserProgressMetrics(userId, 'Week');
    return metrics.personalBests || [];
  },

  /**
   * Formats a session timestamp into friendly date and time strings.
   */
  formatSessionDate(isoString) {
    if (!isoString) return { date: '', time: '' };
    const dateObj = new Date(isoString);
    return {
      date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};
