// lib/user_model.dart

import 'package:isar/isar.dart';

part 'user_model.g.dart'; // Required for the Isar generator

@collection
@Name("UserProfile") // Explicitly naming for clarity with Isar
class UserProfile {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true, caseSensitive: false)
  String firebaseUid;

  String? name;
  String? email;
  String? mobileNumber;
  int? age;
  String? sport;
  double? height; // in cm
  double? weight; // in kg
  String? profilePhotoPath;

  // --- Coach Fields ---
  String? coachName;
  String? coachPhoneNumber;
  String? coachWhatsappNumber;
  bool isCoachUser;

  // --- Common Fields ---
  List<String> assignedAthleteIds; // Non-nullable field
  DateTime? createdAt;
  String? location;

  UserProfile({
    required this.firebaseUid,
    this.name,
    this.email,
    this.mobileNumber,
    this.age,
    this.sport,
    this.height,
    this.weight,
    this.profilePhotoPath,
    this.coachName,
    this.coachPhoneNumber,
    this.coachWhatsappNumber,
    this.isCoachUser = false,
    // THE CRITICAL LINE:
    // This should be what line 49 (or around there) looks like.
    // It directly initializes the non-nullable 'assignedAthleteIds' field
    // and defaults to an empty list.
    this.assignedAthleteIds = const [],
    this.createdAt,
    this.location,
  }) {
    // Constructor body can be empty if all fields are initialized via parameters
  }

  UserProfile copyWith({
    Id? id,
    String? firebaseUid,
    String? name,
    String? email,
    String? mobileNumber,
    int? age,
    String? sport,
    double? height,
    double? weight,
    String? profilePhotoPath,
    String? coachName,
    String? coachPhoneNumber,
    String? coachWhatsappNumber,
    bool? isCoachUser,
    List<String>? assignedAthleteIds, // copyWith can accept nullable for flexibility
    DateTime? createdAt,
    String? location,
  }) {
    return UserProfile(
      firebaseUid: firebaseUid ?? this.firebaseUid,
      name: name ?? this.name,
      email: email ?? this.email,
      mobileNumber: mobileNumber ?? this.mobileNumber,
      age: age ?? this.age,
      sport: sport ?? this.sport,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      profilePhotoPath: profilePhotoPath ?? this.profilePhotoPath,
      coachName: coachName ?? this.coachName,
      coachPhoneNumber: coachPhoneNumber ?? this.coachPhoneNumber,
      coachWhatsappNumber: coachWhatsappNumber ?? this.coachWhatsappNumber,
      isCoachUser: isCoachUser ?? this.isCoachUser,
      assignedAthleteIds: assignedAthleteIds ?? this.assignedAthleteIds,
      createdAt: createdAt ?? this.createdAt,
      location: location ?? this.location,
    )..id = id ?? this.id;
  }
}
