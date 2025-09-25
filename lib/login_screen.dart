// lib/login_screen.dart

import 'package:flutter/material.dart';
import 'auth_service.dart';
import 'signup_screen.dart';
import 'forgot_password_screen.dart';
import 'basic_details_screen.dart';
import 'isar_service.dart'; // Changed from hive_service.dart

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  final _isarService = IsarService(); // Changed from _hiveService
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    setState(() {
      _isLoading = true;
    });

    final user = await _authService.signInWithEmailAndPassword(
      _emailController.text,
      _passwordController.text,
    );

    setState(() {
      _isLoading = false;
    });

    if (user == null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login failed. Please check your credentials.')),
      );
    }
    // AuthGate will handle successful navigation
  }

  void _googleSignIn() async {
    setState(() {
      _isLoading = true;
    });

    final user = await _authService.signInWithGoogle();

    setState(() {
      _isLoading = false;
    });

    if (user != null) {
      // Check if this is a new user
      // Assuming IsarService has a method like getUserProfile() that returns UserProfile?
      // You might need to adjust this based on your actual IsarService implementation,
      // especially if it needs the user's ID to fetch the profile.
      final userProfile = await _isarService.getUserProfile(); 
      final profileExists = userProfile != null;
      if (!profileExists && mounted) {
        // If no profile exists in Isar, navigate to BasicDetailsScreen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const BasicDetailsScreen()),
        );
      }
      // If profile exists, AuthGate will handle navigation to HomeScreen
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1FFF83);
    final textFieldBorder = OutlineInputBorder(
      borderSide: BorderSide.none,
      borderRadius: BorderRadius.circular(12),
    );

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              const Text('Sadhaka', textAlign: TextAlign.center, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              const Text('Welcome Back', textAlign: TextAlign.center, style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
              const SizedBox(height: 32),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(hintText: 'Email or Username', filled: true, fillColor: Colors.grey[200], border: textFieldBorder),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(hintText: 'Password', filled: true, fillColor: Colors.grey[200], border: textFieldBorder),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const ForgotPasswordScreen())),
                  child: const Text('Forgot Password?', style: TextStyle(color: Colors.black54)),
                ),
              ),
              ElevatedButton(
                onPressed: _isLoading ? null : _login,
                style: ElevatedButton.styleFrom(backgroundColor: primaryColor, foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: _isLoading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 3, color: Colors.black)) : const Text('Login', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 24),
              const Text('Or continue with', textAlign: TextAlign.center, style: TextStyle(color: Colors.black54)),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: _isLoading ? null : _googleSignIn,
                style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), side: BorderSide(color: Colors.grey.shade300)),
                child: const Text('Continue with Google', style: TextStyle(color: Colors.black, fontSize: 16)),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {}, // Apple Sign-in not implemented
                style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), side: BorderSide(color: Colors.grey.shade300)),
                child: const Text('Continue with Apple', style: TextStyle(color: Colors.black, fontSize: 16)),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Don't have an account?", style: TextStyle(color: Colors.black54)),
                  TextButton(
                    onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const SignupScreen())),
                    child: const Text('Sign Up', style: TextStyle(color: primaryColor, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const Spacer(),
              const Text('"The only bad workout is the one that didn\'t happen."', textAlign: TextAlign.center, style: TextStyle(color: Colors.black54, fontStyle: FontStyle.italic)),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
