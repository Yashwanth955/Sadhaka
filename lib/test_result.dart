// lib/test_result.dart

import 'package:isar/isar.dart'; // Should be Isar import

part 'test_result.g.dart'; // For Isar code generation

@collection // Should be @collection for Isar
class TestResult {
  Id id = Isar.autoIncrement; // Isar Id

  late String testTitle; // No HiveField annotation

  late String resultValue; // No HiveField annotation

  late DateTime date; // No HiveField annotation

  String? videoPath; // No HiveField annotation
}