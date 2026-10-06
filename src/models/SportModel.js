import { Platform } from 'react-native';
import sportsData from '../data/sportsData.json';
import { getTestsForSport, sportsImageMap } from '../data/sportsData';
import { initDb, webStore, toMillis } from './DatabaseModel';

export { getTestsForSport, sportsImageMap };

/**
 * Retrieves all sports definitions from SQLite or in-memory map.
 */
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

/**
 * Retrieves a single sport by its unique identifier.
 */
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

/**
 * Upserts a sport definition into SQLite or webStore.
 */
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

/**
 * Upserts multiple sports definitions.
 */
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
