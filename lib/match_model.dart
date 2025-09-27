// lib/match_model.dart
import 'package:isar/isar.dart';

part 'match_model.g.dart';

@collection
class Match {
  Id id = Isar.autoIncrement;
  late String sponsorName;
  late String athleteName;
  late String matchReason; // e.g., "High performance in Sprinting"
  late DateTime dateMatched;
}