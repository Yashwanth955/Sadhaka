// lib/user_model.dart

import 'package:hive/hive.dart';

part 'user_model.g.dart';

@HiveType(typeId: 1) // Each model needs a unique typeId
class UserProfile extends HiveObject {
  @HiveField(0)
  String? firebaseUid; // Kept for future online integration

  @HiveField(1)
  String? name;

  @HiveField(2)
  String? email;

  @HiveField(3)
  int? age;

  @HiveField(4)
  String? sport;

  // --- NEW FIELDS ---
  @HiveField(5)
  String? profilePhotoPath;

  @HiveField(6)
  double? height; // in cm

  @HiveField(7)
  double? weight; // in kg

  @HiveField(8)
  String? mobileNumber;
}