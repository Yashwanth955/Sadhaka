// lib/badge_model.dart
import 'package:isar/isar.dart';

part 'badge_model.g.dart';

@collection
class Badge {
  Id id = Isar.autoIncrement;

  late String name;
  late String description;
  late String imageUrl;
  late bool isEarned;

  // Optional: A constructor for convenience
  // Badge({
  //   required this.name,
  //   required this.description,
  //   required this.imageUrl,
  //   this.isEarned = false,
  // });
}
