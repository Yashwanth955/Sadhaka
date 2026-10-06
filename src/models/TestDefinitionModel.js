import { Platform } from 'react-native';
import testDefinitionsData from '../data/testDefinitionsData.json';
import { initDb, webStore, toMillis } from './DatabaseModel';

/**
 * Calculates SAI Khelo India Benchmark tier for a given test, score value, and gender.
 * Returns: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement'
 */
export function calculateBenchmarkTier(value, benchmarkData = {}, gender = 'male') {
  // Support both (value, benchmarkData, gender) and (benchmarkData, value, gender) signatures
  let rawVal = value;
  let benchData = benchmarkData;
  if (typeof value === 'object' && value !== null && typeof benchmarkData === 'number') {
    benchData = value;
    rawVal = benchmarkData;
  }

  if (rawVal === undefined || rawVal === null || isNaN(Number(rawVal))) {
    return 'Needs Improvement';
  }

  // Handle BMI Test special category classification
  if (benchData.detectionMethod === 'manual_entry' && (benchData.id === 'bmiTest' || benchData.category === 'Health')) {
    const bmi = Number(rawVal);
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
  const numVal = Number(rawVal);

  const excellent = Number(
    isFemale 
      ? (benchData.benchmarkExcellentFemale ?? benchData.benchmarkExcellent ?? 0)
      : (benchData.benchmarkExcellentMale ?? benchData.benchmarkExcellent ?? 0)
  );

  const good = Number(
    isFemale 
      ? (benchData.benchmarkGoodFemale ?? benchData.benchmarkGood ?? 0)
      : (benchData.benchmarkGoodMale ?? benchData.benchmarkGood ?? 0)
  );

  const average = Number(
    isFemale 
      ? (benchData.benchmarkAverageFemale ?? benchData.benchmarkAverage ?? 0)
      : (benchData.benchmarkAverageMale ?? benchData.benchmarkAverage ?? 0)
  );

  const direction = benchData.benchmarkDirection || 
    (benchData.detectionMethod === 'fall_count_fixed' ? 'lower_is_better' : 'higher_is_better');

  if (direction === 'lower_is_better' || benchData.detectionMethod === 'fall_count_fixed') {
    if (numVal <= excellent) return 'Excellent';
    if (numVal <= good) return 'Good';
    if (numVal <= average) return 'Average';
    return 'Needs Improvement';
  } else {
    if (numVal >= excellent) return 'Excellent';
    if (numVal >= good) return 'Good';
    if (numVal >= average) return 'Average';
    return 'Needs Improvement';
  }
}

/**
 * Legacy alias for calculateBenchmarkTier
 */
export const getPerformanceLevel = calculateBenchmarkTier;

/**
 * Formats benchmarks for display in UI cards based on gender.
 */
export function formatGenderBenchmark(testData, gender = 'male') {
  if (!testData) return null;
  const isFemale = String(gender).toLowerCase() === 'female';
  const isLower = testData.benchmarkDirection === 'lower_is_better';
  const isFalls = testData.detectionMethod === 'fall_count_fixed';
  const unit = testData.benchmarkUnit || '';

  const exVal = isFemale 
    ? (testData.benchmarkExcellentFemale ?? testData.benchmarkExcellent) 
    : (testData.benchmarkExcellentMale ?? testData.benchmarkExcellent);
    
  const gdVal = isFemale 
    ? (testData.benchmarkGoodFemale ?? testData.benchmarkGood) 
    : (testData.benchmarkGoodMale ?? testData.benchmarkGood);
    
  const avgVal = isFemale 
    ? (testData.benchmarkAverageFemale ?? testData.benchmarkAverage) 
    : (testData.benchmarkAverageMale ?? testData.benchmarkAverage);

  if (exVal === undefined || exVal === null) return null;

  const prefixEx = isLower || isFalls ? '<=' : '>=';
  const prefixAvg = isLower || isFalls ? '>' : '<';

  return {
    excellent: `${prefixEx} ${exVal} ${unit}`.trim(),
    good: `${gdVal} ${unit}`.trim(),
    average: `${prefixAvg} ${avgVal} ${unit}`.trim(),
  };
}

/**
 * Retrieves all active test definitions from SQLite or in-memory map.
 */
export async function getTestsFromLocalDb() {
  await initDb();

  if (Platform.OS === 'web') {
    return Array.from(webStore.testDefinitions.values()).filter(t => t.active);
  }

  const db = await initDb();
  if (!db) {
    return Array.from(webStore.testDefinitions.values()).filter(t => t.active);
  }

  const rows = await db.getAllAsync(`SELECT * FROM testDefinitions WHERE active = 1 ORDER BY category, name ASC;`);
  return rows.map(r => ({ ...r, active: Boolean(r.active) }));
}

/**
 * Retrieves a single test definition by ID.
 */
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

/**
 * Upserts a test definition into SQLite (or in-memory store on web).
 */
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
