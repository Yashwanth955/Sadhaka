// lib/user_model.dart

import 'package:isar/isar.dart';

part 'user_model.g.dart'; // Required for the Isar generator

@collection
class UserProfile {
  // Isar's unique, auto-incrementing ID
  Id id = Isar.autoIncrement;

  // This links the local profile to the Firebase Authentication user
  @Index(unique: true)
  String? firebaseUid;

  String? name;
  String? email;
  int? age;
  String? sport;
  String? profilePhotoPath;
  double? height; // in cm
  double? weight; // in kg
  String? mobileNumber;

  // --- Coach Fields ---
  String? coachName;
  String? coachPhoneNumber;
  String? coachWhatsappNumber;
}