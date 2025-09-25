// lib/leaderboard_model.dart
import 'package:isar/isar.dart'; // Changed from Hive to Isar

part 'leaderboard_model.g.dart'; // Keep this for Isar code generation

@collection // Changed from @HiveType
class LeaderboardEntry {
  Id id = Isar.autoIncrement; // Changed from 'late int id;' and HiveField(0)

  // @HiveField(1) // Removed HiveField annotation
  late int rank;

  // @HiveField(2) // Removed HiveField annotation
  late String name;

  // @HiveField(3) // Removed HiveField annotation
  late int score;

  // @HiveField(4) // Removed HiveField annotation
  late String imageUrl;

  // @HiveField(5) // Removed HiveField annotation
  late String region;

  // Constructor can be added if needed
}
