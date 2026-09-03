/**
 * One-time Firestore Seed Script (scripts/importTestData.js)
 * 
 * Seeds local test definitions (testDefinitionsData.json) and sports catalog (sportsData.json)
 * into Firebase Firestore collections `testDefinitions` and `sports`.
 * 
 * Usage:
 *  1. Ensure serviceAccountKey.json is placed in your project root or configure GOOGLE_APPLICATION_CREDENTIALS.
 *  2. Run: node scripts/importTestData.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Attempt to load local service account key if available
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✔ Initialized Firebase Admin using serviceAccountKey.json');
    } else {
      // Fallback to default application credentials
      admin.initializeApp();
      console.log('✔ Initialized Firebase Admin using Default Application Credentials');
    }
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', err.message);
    process.exit(1);
  }
}

const db = admin.firestore();

async function importTestData() {
  console.log('\n🚀 Starting Firestore Reference Data Seed Process...\n');

  // Paths to JSON content data
  const testDefsPath = path.join(__dirname, '..', 'src', 'data', 'testDefinitionsData.json');
  const sportsPath = path.join(__dirname, '..', 'src', 'data', 'sportsData.json');

  if (!fs.existsSync(testDefsPath) || !fs.existsSync(sportsPath)) {
    console.error('❌ Could not find testDefinitionsData.json or sportsData.json in src/data/');
    process.exit(1);
  }

  const testDefinitionsData = JSON.parse(fs.readFileSync(testDefsPath, 'utf8'));
  const sportsData = JSON.parse(fs.readFileSync(sportsPath, 'utf8'));

  const batch = db.batch();
  const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

  // 1. Seed testDefinitions collection
  let testCount = 0;
  for (const [id, data] of Object.entries(testDefinitionsData)) {
    const docRef = db.collection('testDefinitions').doc(id);
    batch.set(docRef, {
      ...data,
      id,
      active: data.active !== false,
      lastUpdated: serverTimestamp
    }, { merge: true });
    testCount++;
    console.log(`  ➕ Staged testDefinition [${id}]`);
  }

  // 2. Seed sports collection
  let sportsCount = 0;
  for (const [id, data] of Object.entries(sportsData)) {
    const docRef = db.collection('sports').doc(id);
    batch.set(docRef, {
      ...data,
      sportId: id,
      lastUpdated: serverTimestamp
    }, { merge: true });
    sportsCount++;
    console.log(`  ➕ Staged sport [${id}]`);
  }

  // Commit batch write
  console.log('\n⌛ Committing batch write to Firestore...');
  await batch.commit();

  console.log(`\n==================================================`);
  console.log(`✅ SUCCESS: Firestore Seed Completed!`);
  console.log(`   - Seeded ${testCount} documents into 'testDefinitions'`);
  console.log(`   - Seeded ${sportsCount} documents into 'sports'`);
  console.log(`==================================================\n`);
}

importTestData().catch(err => {
  console.error('❌ Error seeding Firestore reference data:', err);
  process.exit(1);
});
