import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart'; // Needed for Isar.open
import 'test_result.dart'; // Assuming this and other models are updated for Isar
import 'user_model.dart';
import 'leaderboard_model.dart';
import 'badge_model.dart';

// You'll need to generate these files using build_runner
// Removed direct imports of .g.dart files

class IsarService {
  late Future<Isar> db;

  // --- Singleton Setup ---
  static final IsarService _instance = IsarService._internal();
  factory IsarService() => _instance;

  IsarService._internal() {
    db = _openIsar();
  }

  Future<Isar> _openIsar() async {
    if (Isar.instanceNames.isEmpty) {
      final dir = await getApplicationDocumentsDirectory();
      // Ensure your model schemas are included here
      return await Isar.open(
        [
          UserProfileSchema,
          TestResultSchema,
          BadgeSchema,
          LeaderboardEntrySchema,
        ],
        directory: dir.path,
        name: 'sadhakIsarDB', // Optional: name your Isar instance
        inspector: true, // <--- ADDED THIS LINE
      );
    }
    return Future.value(Isar.getInstance('sadhakIsarDB'));
  }
  // --- End of Singleton Setup ---

  // --- Seeding Method ---
  Future<void> seedDatabase({
    required UserProfile user,
    required List<TestResult> results,
    required List<Badge> badges,
    required List<LeaderboardEntry> leaderboard,
  }) async {
    final isar = await db;
    
    // Check if the database is empty by checking one of the collections
    final userCount = await isar.userProfiles.count();
    if (userCount == 0) {
      //print("Seeding database with Isar...");
      await isar.writeTxn(() async {
        // Seed User Profile
        // Isar auto-increments IDs, or you manage them.
        // For a single user profile, you might fetch by a known property or just the first one.
        // For simplicity, we just put it. If it's meant to be unique and single,
        // you'd typically clear existing or use a fixed ID if your model supports it.
        await isar.userProfiles.put(user);

        // Seed other data
        await isar.testResults.putAll(results);
        await isar.badges.putAll(badges);
        await isar.leaderboardEntrys.putAll(leaderboard);
      });
      //print("Isar Database seeded!");
    } else {
      //print("Isar Database already seeded.");
    }
  }

  // --- User Profile Methods ---
  Future<void> saveUserProfile(UserProfile userProfile) async {
    final isar = await db;
    await isar.writeTxn(() async {
      // Assuming UserProfile has an 'id' field managed by Isar or manually set.
      // If it's a single profile, you might query for an existing one first.
      await isar.userProfiles.put(userProfile);
    });
  }

  Future<UserProfile?> getUserProfile() async {
    final isar = await db;
    // Assuming there's only one user profile or you want the first one.
    // If you have a specific way to identify the user (e.g., a unique username or fixed ID),
    // you would query by that. For now, just gets the first entry.
    return await isar.userProfiles.where().findFirst();
  }

  // --- Test Result Methods ---
  Future<void> saveTestResult(TestResult newResult) async {
    final isar = await db;
    await isar.writeTxn(() async {
      await isar.testResults.put(newResult);
    });
  }

  Future<List<TestResult>> getAllTestResults() async {
    final isar = await db;
    return await isar.testResults.where().findAll();
  }

  // --- Badge Methods ---
  Future<List<Badge>> getEarnedBadges() async {
    final isar = await db;
    // Assuming Badge model has an 'isEarned' boolean field and an index on it for performance.
    return await isar.badges.filter().isEarnedEqualTo(true).findAll();
  }

  Future<List<Badge>> getUnearnedBadges() async {
    final isar = await db;
    // Assuming Badge model has an 'isEarned' boolean field and an index on it for performance.
    return await isar.badges.filter().isEarnedEqualTo(false).findAll();
  }

  // --- Leaderboard Methods ---
  Future<List<LeaderboardEntry>> getLeaderboard() async {
    final isar = await db;
    // Assuming LeaderboardEntry model has a 'rank' integer field and an index on it for sorting.
    return await isar.leaderboardEntrys.where().sortByRank().findAll();
  }

  // Optional: Method to close Isar instance if needed
  Future<void> close() async {
    final isar = await db;
    await isar.close();
  }
}
