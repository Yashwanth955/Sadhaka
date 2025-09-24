import 'package:hive/hive.dart';

part 'test_dummy_model.g.dart'; // For the generated adapter

@HiveType(typeId: 99) // Use a high, unique typeId
class TestDummyModel {
  @HiveField(0)
  String? name;

  TestDummyModel({this.name});
}
