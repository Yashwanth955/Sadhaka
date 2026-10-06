import { Platform } from 'react-native';
import { initDb } from './DatabaseModel';
import { MOCK_USER_ID, MOCK_USER_PROFILE, getUserProfileFromDb, seedMockUserIfEmpty } from './UserModel';
import { getSessionHistory, MOCK_SESSIONS, seedMockSessionsIfEmpty } from './SessionModel';
import { getTestsFromLocalDb } from './TestDefinitionModel';
import testDefinitionsData from '../data/testDefinitionsData.json';

/**
 * Seeds both mock user and mock sessions if the database tables are empty.
 */
export async function seedMockDataIfEmpty(db) {
  await seedMockUserIfEmpty(db);
  await seedMockSessionsIfEmpty(db);
}

/**
 * Computes comprehensive progress metrics, weekly charts, readiness index,
 * streak, and personal bests for a user and timeFilter ('Day' | 'Week' | 'Month').
 *
 * @param {string|null} userId - The user's ID
 * @param {string} timeFilter - 'Day' | 'Week' | 'Month'
 * @returns {Promise<object>} Comprehensive progress metrics
 */
export async function getUserProgressMetrics(userId = null, timeFilter = 'Week') {
  if (!userId) {
    return {
      profile: null,
      hasSessions: false,
      totalTests: 0,
      activeDaysThisWeek: '0 / 7',
      activeLabel: 'Active Days (This Week)',
      activeValue: '0 / 7',
      trainingStreak: 0,
      readinessScore: 0,
      weeklyBars: [0, 0, 0, 0, 0, 0, 0],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      trendBadge: '0%',
      chartTitle: 'Overall Score',
      chartLabel: 'PERFORMANCE TREND',
      recentTests: [],
      allSessions: [],
      personalBests: []
    };
  }

  const db = await initDb();
  const isMock = userId === MOCK_USER_ID;

  if (db && isMock) {
    await seedMockDataIfEmpty(db);
  }

  // Retrieve user profile from DB (or fallback)
  const profile = await getUserProfileFromDb(userId);

  // Retrieve all sessions for this user
  let sessions = await getSessionHistory(userId);
  if (isMock && (!sessions || sessions.length === 0)) {
    sessions = await getSessionHistory(MOCK_USER_ID);
    if (!sessions || sessions.length === 0) {
      sessions = MOCK_SESSIONS;
    }
  } else if (!sessions) {
    sessions = [];
  }

  const hasSessions = Boolean(sessions && sessions.length > 0);
  const streak = profile?.trainingStreak ?? 0;
  const readinessScore = profile?.readinessScore ?? 0;

  // Test definitions lookup
  const allTests = await getTestsFromLocalDb();
  const testMap = {};
  allTests.forEach(t => { testMap[t.id] = t; });

  // Format all sessions with test definition data
  const formattedAll = sessions.map((s, idx) => {
    const def = testMap[s.exerciseType] || testDefinitionsData[s.exerciseType] || {};
    const unit = def.benchmarkUnit || '';
    const dateObj = new Date(s.createdAt);
    const dateText = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeText = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let icon = 'fitness-center';
    if (def.category === 'Speed') icon = 'timer';
    else if (def.category === 'Power') icon = 'height';
    else if (def.category === 'Agility') icon = 'directions-run';
    else if (def.category === 'Strength') icon = 'fitness-center';

    return {
      id: s.id || String(idx + 1),
      exerciseType: s.exerciseType,
      title: def.name || s.exerciseType,
      category: def.category || 'Fitness',
      score: s.score,
      scoreText: `${s.score}${unit ? ' ' + unit : ''}`.trim(),
      badge: idx === 0 ? 'Personal Best' : (s.score >= 50 ? 'Top 15%' : 'Completed'),
      dateText: `${def.category || 'Fitness'} • ${dateText}`,
      timeText,
      feedback: s.feedback || '',
      icon: icon,
      createdAt: s.createdAt,
      dateString: dateObj.toDateString()
    };
  });

  // Dynamic values depending on timeFilter ('Day' | 'Week' | 'Month')
  let weeklyBars = (isMock && hasSessions) ? [45, 60, 50, 75, 85, 95, 80] : [0, 0, 0, 0, 0, 0, 0];
  let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let totalTests = isMock ? sessions.length : (hasSessions ? sessions.length : 0);
  let activeLabel = 'Active Days (This Week)';
  let activeValue = (isMock && hasSessions) ? '6 / 7' : (hasSessions ? `${Math.min(sessions.length, 7)} / 7` : '0 / 7');
  let trendBadge = (isMock && hasSessions) ? '+12%' : '0%';
  let chartTitle = 'Overall Score';
  let chartLabel = 'PERFORMANCE TREND';
  let recentTests = isMock ? formattedAll.slice(0, 5) : (hasSessions ? formattedAll.slice(0, 5) : []);

  if (timeFilter === 'Day') {
    weeklyBars = (isMock && hasSessions) ? [50, 85, 65, 92, 75] : [0, 0, 0, 0, 0];
    days = ['7AM', '10AM', '1PM', '4PM', '7PM'];
    activeLabel = 'Active Hours (Today)';
    activeValue = (isMock && hasSessions) ? '5 hrs' : (hasSessions ? `${Math.min(sessions.length, 5)} hrs` : '0 hrs');
    trendBadge = (isMock && hasSessions) ? '+4%' : '0%';
    chartTitle = 'Readiness Index';
    chartLabel = "TODAY'S INTENSITY";
    recentTests = isMock ? formattedAll.slice(0, 3) : (hasSessions ? formattedAll.slice(0, 3) : []);
  } else if (timeFilter === 'Month') {
    weeklyBars = (isMock && hasSessions) ? [62, 74, 82, 91] : [0, 0, 0, 0];
    days = ['W1', 'W2', 'W3', 'W4'];
    activeLabel = 'Active Weeks (This Month)';
    activeValue = (isMock && hasSessions) ? '4 / 4' : (hasSessions ? `${Math.min(Math.ceil(sessions.length / 2), 4)} / 4` : '0 / 4');
    trendBadge = (isMock && hasSessions) ? '+18%' : '0%';
    chartTitle = 'Monthly Progression';
    chartLabel = 'MONTHLY METRICS';
    recentTests = isMock ? formattedAll.slice(0, 5) : (hasSessions ? formattedAll.slice(0, 5) : []);
  }

  let personalBests = [];
  if (isMock) {
    personalBests = [
      { id: '1', name: '30m Sprint', score: '4.12s', category: 'Speed', icon: 'timer' },
      { id: '2', name: 'Vertical Jump', score: '65 cm', category: 'Power', icon: 'height' },
      { id: '3', name: 'Push-Ups (60s)', score: '48 reps', category: 'Strength', icon: 'fitness-center' },
      { id: '4', name: 'Standing Broad Jump', score: '2.45 m', category: 'Power', icon: 'directions-run' },
    ];
  } else if (hasSessions) {
    const bestByExercise = {};
    sessions.forEach(s => {
      const def = testMap[s.exerciseType] || {};
      const currentBest = bestByExercise[s.exerciseType];
      if (!currentBest || s.score > currentBest.score) {
        bestByExercise[s.exerciseType] = {
          id: String(s.id),
          name: def.name || s.exerciseType,
          score: `${s.score} ${def.benchmarkUnit || ''}`.trim(),
          category: def.category || 'Fitness',
          icon: def.category === 'Speed' ? 'timer' : (def.category === 'Power' ? 'height' : 'fitness-center')
        };
      }
    });
    personalBests = Object.values(bestByExercise);
  }

  return {
    profile: profile || (isMock ? MOCK_USER_PROFILE : null),
    hasSessions,
    totalTests,
    activeDaysThisWeek: activeValue,
    activeLabel,
    activeValue,
    trainingStreak: streak,
    readinessScore,
    weeklyBars,
    days,
    trendBadge,
    chartTitle,
    chartLabel,
    recentTests,
    allSessions: formattedAll,
    personalBests
  };
}
