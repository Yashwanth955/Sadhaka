import 'package:hive_flutter/hive_flutter.dart';
import 'test_result.dart';
import 'user_model.dart';
import 'leaderboard_model.dart';
import 'badge_model.dart';

class HiveService {
  // --- Singleton Setup ---
  static final HiveService _instance = HiveService._internal();
  factory HiveService() => _instance;
  HiveService._internal();
  // --- End of Singleton Setup ---

  // UPDATED: Defined consistent box names to prevent errors
  static const String userProfileBoxName = 'userProfile';
  static const String testResultsBoxName = 'testResults';
  static const String badgesBoxName = 'badges';
  static const String leaderboardBoxName = 'leaderboard';

  // --- Seeding Method ---
  Future<void> seedDatabase({
    required UserProfile user,
    required List<TestResult> results,
    required List<Badge> badges,
    required List<LeaderboardEntry> leaderboard,
  }) async {
    final userBox = await Hive.openBox<UserProfile>(userProfileBoxName);

    // Only seed if the database is empty
    if (userBox.isEmpty) {
      print("Seeding database with Hive...");
      final testBox = await Hive.openBox<TestResult>(testResultsBoxName);
      final badgeBox = await Hive.openBox<Badge>(badgesBoxName);
      final leaderboardBox = await Hive.openBox<LeaderboardEntry>(leaderboardBoxName);

      // Seed User Profile at a consistent key
      await userBox.put(0, user);

      // Seed other data
      await testBox.addAll(results);
      await badgeBox.addAll(badges);
      await leaderboardBox.addAll(leaderboard);

      print("Database seeded!");
    } else {
      print("Database already seeded.");
    }
  }

  // --- User Profile Methods ---
  Future<void> saveUserProfile(UserProfile userProfile) async {
    final box = await Hive.openBox<UserProfile>(userProfileBoxName);
    await box.put(0, userProfile); // Puts the single user profile at key 0
  }

  Future<UserProfile?> getUserProfile() async {
    final box = await Hive.openBox<UserProfile>(userProfileBoxName);
    // CORRECTED: Directly get the user profile from the known key 0
    return box.get(0);
  }

  // --- Test Result Methods ---
  Future<void> saveTestResult(TestResult newResult) async {
    final box = await Hive.openBox<TestResult>(testResultsBoxName);
    await box.add(newResult);
  }

  Future<List<TestResult>> getAllTestResults() async {
    final box = await Hive.openBox<TestResult>(testResultsBoxName);
    return box.values.toList();
  }

  // --- Badge Methods ---
  Future<List<Badge>> getEarnedBadges() async {
    final box = await Hive.openBox<Badge>(badgesBoxName);
    return box.values.where((badge) => badge.isEarned).toList();
  }

  Future<List<Badge>> getUnearnedBadges() async {
    final box = await Hive.openBox<Badge>(badgesBoxName);
    return box.values.where((badge) => !badge.isEarned).toList();
  }

  // --- Leaderboard Methods ---
  Future<List<LeaderboardEntry>> getLeaderboard() async {
    final box = await Hive.openBox<LeaderboardEntry>(leaderboardBoxName);
    // Sort by rank before returning
    var entries = box.values.toList();
    entries.sort((a, b) => a.rank.compareTo(b.rank));
    return entries;
  }
}