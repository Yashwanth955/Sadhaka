import 'package:isar/isar.dart';

part 'sponsor_model.g.dart';

@collection
class Sponsor {
  Id id = Isar.autoIncrement;
  late String name;
  late String focusSport; // e.g., "Football", "Athletics"
  late String type; // "Mentor" or "Sponsor"
  String? contactEmail;
}