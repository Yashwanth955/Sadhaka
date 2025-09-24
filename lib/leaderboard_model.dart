// lib/leaderboard_model.dart
import 'package:hive/hive.dart';

part 'leaderboard_model.g.dart'; // This might need to be updated for Hive's generated files

@HiveType(typeId: 3) // Ensure typeId is unique
class LeaderboardEntry {
  @HiveField(0)
  late int id;

  @HiveField(1)
  late int rank;

  @HiveField(2)
  late String name;

  @HiveField(3)
  late int score;

  @HiveField(4)
  late String imageUrl;

  @HiveField(5)
  late String region;
}
