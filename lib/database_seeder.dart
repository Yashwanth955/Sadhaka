// lib/database_seeder.dart

import 'package:isar/isar.dart';
import 'isar_service.dart';
import 'user_model.dart';
import 'test_result.dart';
import 'badge_model.dart';
import 'leaderboard_model.dart';

class DatabaseSeeder {
  static Future<void> seed() async {
    final isarService = IsarService();
    final isar = await isarService.db; // Get the Isar instance asynchronously

    // Check if the database is empty before seeding
    final userProfilesCount = await isar.userProfiles.count();
    if (userProfilesCount == 0) {
      print("Seeding database with prototype data...");

      // 1. Create Sample User Profile
      final user = UserProfile()
        ..name = "Arjun Sharma"
        ..email = "arjun.sharma@example.com"
        ..age = 25
        ..sport = "Badminton"
        ..height = 175
        ..weight = 70
        ..mobileNumber = "9876543210"
        ..profilePhotoPath = null
        ..coachName = "Ravi Kumar"
        ..coachPhoneNumber = "+919988776655"
        ..coachWhatsappNumber = "+919988776655";// No initial photo path

      // 2. Create Sample Test Results with varied dates
      final now = DateTime.now();
      final results = [
        TestResult()
          ..testTitle = "1.6km Run Test"
          ..resultValue = "5:45 min"
          ..date = now.subtract(const Duration(days: 2)),
        TestResult()
          ..testTitle = "Push-up Test"
          ..resultValue = "25 reps"
          ..date = now.subtract(const Duration(days: 2)),
        TestResult()
          ..testTitle = "Standing Broad Jump"
          ..resultValue = "2.1m"
          ..date = now.subtract(const Duration(days: 5)),
        TestResult()
          ..testTitle = "Push-up Test"
          ..resultValue = "22 reps"
          ..date = now.subtract(const Duration(days: 10)),
        TestResult()
          ..testTitle = "4*10mts Shuttle Run"
          ..resultValue = "12.5s"
          ..date = now.subtract(const Duration(days: 15)),
        TestResult()
          ..testTitle = "Sit and Reach Test"
          ..resultValue = "15 cm"
          ..date = now.subtract(const Duration(days: 20)),
      ];

      // 3. Create Sample Badges
      final badges = [
        Badge()..name = 'Core Strength Pro 💪'..description = 'Completed 5 core strength tests'..imageUrl = 'https://i.imgur.com/bT6R022.png'..isEarned = true,
        Badge()..name = 'Stamina Star 🔥'..description = 'Achieved top 10% in stamina tests'..imageUrl = 'https://i.imgur.com/k2p8J5F.png'..isEarned = true,
        Badge()..name = 'Flexibility Master 🤸'..description = 'Demonstrated exceptional flexibility'..imageUrl = 'https://i.imgur.com/8m52eSO.png'..isEarned = true,
        Badge()..name = 'Speed Demon 🏃'..description = 'Achieve top speed in sprint tests'..imageUrl = 'https://i.imgur.com/bT6R022.png'..isEarned = false,
        Badge()..name = 'Endurance Champ 🏆'..description = 'Complete all endurance challenges'..imageUrl = 'https://i.imgur.com/k2p8J5F.png'..isEarned = false,
        Badge()..name = 'Powerhouse 💪'..description = 'Demonstrate exceptional power'..imageUrl = 'https://i.imgur.com/8m52eSO.png'..isEarned = false,
      ];

      // 4. Create Sample Leaderboard
      final leaderboard = [
        LeaderboardEntry()..rank = 1..name = 'Arjun Sharma'..score = 95..imageUrl = 'https://i.pravatar.cc/150?img=1'..region = 'India',
        LeaderboardEntry()..rank = 2..name = 'Priya Patel'..score = 92..imageUrl = 'https://i.pravatar.cc/150?img=2'..region = 'India',
        LeaderboardEntry()..rank = 3..name = 'Rohan Verma'..score = 90..imageUrl = 'https://i.pravatar.cc/150?img=3'..region = 'India',
        LeaderboardEntry()..rank = 4..name = 'Anika Singh'..score = 88..imageUrl = 'https://i.pravatar.cc/150?img=4'..region = 'India',
        LeaderboardEntry()..rank = 5..name = 'Vikram Kapoor'..score = 85..imageUrl = 'https://i.pravatar.cc/150?img=5'..region = 'India',
      ];

      await isar.writeTxn(() async {
        await isar.userProfiles.put(user);
        await isar.testResults.putAll(results);
        await isar.badges.putAll(badges);
        await isar.leaderboardEntrys.putAll(leaderboard);
      });

      print("Database seeded!");
    } else {
      print("Database already contains data. Seeding skipped.");
    }
  }
}
