// lib/auth_gate.dart

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'home_screen.dart';
import 'login_screen.dart';

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        // This is a good place to add print statements for debugging if needed
        // print("AUTH_GATE: Snapshot has data: ${snapshot.hasData}");

        // While the stream is connecting for the first time, show a loading screen.
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }

        // If the snapshot has no data, it means the user is not logged in.
        if (!snapshot.hasData) {
          return const LoginScreen();
        }

        // If the user is logged in, show the home screen.
        return const HomeScreen();
      },
    );
  }
}