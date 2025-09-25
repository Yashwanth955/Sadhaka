// lib/auth_gate.dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'home_screen.dart';
import 'login_screen.dart';
import 'isar_service.dart'; // Import IsarService
import 'user_model.dart';   // Import UserProfile

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  final IsarService _isarService = IsarService();
  bool _isUserDataInitialized = false;

  Future<void> _initializeUserData(User firebaseUser) async {
    // Check if user profile already exists to prevent re-seeding unnecessarily
    if (_isUserDataInitialized) return;

    // Create a default UserProfile for the logged-in user
    // Some fields might be null or default if not available directly from Firebase auth
    UserProfile newUserProfile = UserProfile()
      ..firebaseUid = firebaseUser.uid
      ..email = firebaseUser.email ?? 'N/A'
      ..name = firebaseUser.displayName ?? 'New User' // Or a default name
      ..age = 0 // Default age, user can update later
      ..sport = 'Fitness' // Default sport
      ..profilePhotoPath = firebaseUser.photoURL ?? '' // Or a default placeholder
      ..height = 0.0 // Default height
      ..weight = 0.0 // Default weight
      ..mobileNumber = firebaseUser.phoneNumber ?? ''; // Default mobile

    // Save the user profile using IsarService
    // Assuming IsarService has a method to save or update the user profile.
    // This method should ideally handle checking for existing users to prevent duplicates
    // or to update existing records.
    await _isarService.saveUserProfile(newUserProfile); // MODIFIED LINE

    // Set a flag to indicate that user data initialization has been attempted.
    if (mounted) {
      setState(() {
        _isUserDataInitialized = true;
      });
    }
    print("AUTH_GATE: User data initialization attempted for UID: ${firebaseUser.uid}");
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }

        if (snapshot.hasData && snapshot.data != null) {
          // User is logged in, ensure their data is initialized in Isar
          final firebaseUser = snapshot.data!;
          // Call initialization asynchronously
          _initializeUserData(firebaseUser);
          return const HomeScreen();
        } else {
          // User is not logged in, reset the flag
          if (_isUserDataInitialized) {
             WidgetsBinding.instance.addPostFrameCallback((_) {
               if (mounted) {
                 setState(() {
                  _isUserDataInitialized = false;
                });
               }
             });
          }
          return const LoginScreen();
        }
      },
    );
  }
}
