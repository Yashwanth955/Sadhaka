import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

// Import your Hive models and the AuthGate
import 'auth_gate.dart';
import 'test_result.dart';
import 'user_model.dart';
import 'badge_model.dart';
import 'leaderboard_model.dart';
import 'home_screen.dart'; // Added import for HomeScreen

Future<void> main() async {
  // Ensure Flutter is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for offline storage
  await Hive.initFlutter();
  //print("Hive database path: ${Hive.path}");

  // Register your Hive Data Models (TypeAdapters)
  // These are generated when you run `dart run build_runner build`
  Hive.registerAdapter(TestResultAdapter());
  Hive.registerAdapter(UserProfileAdapter());
  Hive.registerAdapter(BadgeAdapter());
  Hive.registerAdapter(LeaderboardEntryAdapter());

  // Open a box and print its path
  // Make sure 'userProfileBox' is the correct name and UserProfile is the correct type.
  var userProfileBox = await Hive.openBox<UserProfile>('userProfileBox');
  print('Path for userProfileBox: ${userProfileBox.path}');
  // If this box is primarily managed by HiveService, you might not need to open/close it here.
  // This is just for demonstrating how to get the path.

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sadhka',
      theme: ThemeData(
        primarySwatch: Colors.green,
        scaffoldBackgroundColor: Colors.white,
      ),
      // AuthGate can still be used if you want an offline login screen,
      // or you can change this directly to HomeScreen for a simpler offline app.
      home: const HomeScreen(), // Changed to HomeScreen for a simple offline start
    );
  }
}