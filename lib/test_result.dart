// lib/test_result.dart

import 'package:hive/hive.dart';

// This line is needed to generate the file that Hive needs
part 'test_result.g.dart';

@HiveType(typeId: 2) // Each model needs a unique typeId
class TestResult {
  @HiveField(0) // Each field needs a unique, sequential index
  late String testTitle;

  @HiveField(1)
  late String resultValue;

  @HiveField(2)

  late DateTime date;

  @HiveField(3)
  String? videoPath;
}