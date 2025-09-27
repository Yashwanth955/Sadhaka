// lib/isar_service.dart

import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'test_result.dart';
import 'user_model.dart';
import 'badge_model.dart';
import 'leaderboard_model.dart';
import 'match_model.dart';   // Make sure this is imported
import 'sponsor_model.dart'; // Make sure this is imported

class IsarService {
  // --- Singleton Setup ---
  static final IsarService _instance = IsarService._internal();
  factory IsarService() => _instance;
  IsarService._internal() {
    db = openDB();
  }
  // --- End of Singleton Setup ---

  late Future<Isar> db;

  Future<Isar> openDB() async {
    if (Isar.instanceNames.isEmpty) {
      final dir = await getApplicationDocumentsDirectory();
      return await Isar.open(
        [
          TestResultSchema,
          UserProfileSchema,
          BadgeSchema,
          LeaderboardEntrySchema,
          MatchSchema,      // Add new schema
          SponsorSchema,    // Add new schema
        ],
        directory: dir.path,
        inspector: true,
      );
    }
    return Future.value(Isar.getInstance());
  }

  // Method to create a dummy user for testing
  Future<void> createDummyUser() async {
    final isar = await db; // db is your Future<Isar>

    // Check if a user with this UID already exists
    // Note: The UserProfile model uses 'firebaseUid' field for the UID.
    final existingUser = await isar.userProfiles.filter().firebaseUidEqualTo("dummyUser123").findFirst();
    if (existingUser != null) {
      print('Dummy user with UID dummyUser123 already exists in IsarService.');
      return;
    }

    final dummyProfile = UserProfile(firebaseUid: "dummyUser123") // Using UserProfile() directly
      // ..firebaseUid = "dummyUser123" // Assuming 'firebaseUid' is the correct field name
      ..name = "Alex Rider"
      ..email = "alex.rider@example.com"
      ..mobileNumber = "9876543210"
      ..age = 28
      ..sport = "Triathlon"
      ..height = 175.0
      ..weight = 70.0
      ..profilePhotoPath = null // Or a path to a dummy asset if you have one
      ..coachName = "Ms. Jones"
      ..coachPhoneNumber = "0123456789"
      ..coachWhatsappNumber = "0123456789";

    await isar.writeTxn(() async {
      await isar.userProfiles.put(dummyProfile);
      print('Dummy user "Alex Rider" (UID: dummyUser123) created successfully by IsarService.');
    });
  }

  // --- Seeding Method ---
  Future<void> seedDatabase(/*...seeding parameters...*/) async {
    // ... (Your existing seeder logic)
  }

  // --- User Profile Methods ---
  Future<void> saveUserProfile(UserProfile newUserProfile) async {
    final isar = await db;
    await isar.writeTxn(() async {
      await isar.userProfiles.put(newUserProfile);
    });
  }

  Future<UserProfile?> getUserProfile(String uid) async {
    final isar = await db;
    // Query by the String 'firebaseUid' field on UserProfile.
    return await isar.userProfiles.where().firebaseUidEqualTo(uid).findFirst();
  }

  // Method specifically for basic_details_screen.dart
  Future<UserProfile?> getUserProfileByFirebaseUid(String firebaseUid) async {
    final isar = await db;
    return await isar.userProfiles.where().firebaseUidEqualTo(firebaseUid).findFirst();
  }

  // ADDED: The missing method for login_screen.dart
  Future<UserProfile?> getUserProfileById(String userId) async {
    final isar = await db;
    // Query by the String 'firebaseUid' field on UserProfile.
    return await isar.userProfiles.where().firebaseUidEqualTo(userId).findFirst();
  }

  Future<UserProfile?> getCurrentUserProfile() async {
    final isar = await db;
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
    return await isar.badges.filter().isEarnedEqualTo(true).findAll();
  }
  Future<List<Badge>> getUnearnedBadges() async {
    final isar = await db;
    return await isar.badges.filter().isEarnedEqualTo(false).findAll();
  }

  // --- Leaderboard Methods ---
  Future<List<LeaderboardEntry>> getLeaderboard() async {
    final isar = await db;
    // Use the accessor Isar generates (e.g., lowercase model name + 's')
    return await isar.leaderboardEntrys.where().sortByRank().findAll();
  }

  // --- NEW: Methods for Matching Service ---
  Future<List<Sponsor>> getAllSponsors() async {
    final isar = await db;
    return await isar.sponsors.where().findAll();
  }

  Future<void> saveMatches(List<Match> matches) async {
    final isar = await db;
    await isar.writeTxn(() async {
      // CORRECTED: Use the correct collection name `matches`
      await isar.matchs.putAll(matches);
    });
  }

  Future<List<Match>> getMatches() async {
    final isar = await db;
    // CORRECTED: Use the correct collection name `matches`
    return await isar.matchs.where().findAll();
  }
}
