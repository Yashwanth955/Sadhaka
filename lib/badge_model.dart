// lib/badge_model.dart
import 'package:hive/hive.dart';

part 'badge_model.g.dart'; // This might need to be updated for Hive's generated files

@HiveType(typeId: 0) // Ensure typeId is unique across all Hive models
class Badge {
  @HiveField(0)
  late int id; // You'll need to manage id generation or use Hive's auto-incrementing keys

  @HiveField(1)
  late String name;

  @HiveField(2)
  late String description;

  @HiveField(3)
  late String imageUrl;

  @HiveField(4)
  late bool isEarned;
}
