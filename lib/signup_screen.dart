// lib/signup_screen.dart

import 'package:flutter/material.dart';
import 'auth_service.dart';
import 'basic_details_screen.dart';
import 'hive_service.dart'; // Import HiveService

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();
  final _hiveService = HiveService(); // Changed from _isarService
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _signUp() async {
    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Passwords do not match!")),
      );
      return;
    }

    setState(() { _isLoading = true; });

    final user = await _authService.signUpWithEmailAndPassword(
      _emailController.text,
      _passwordController.text,
    );

    setState(() { _isLoading = false; });

    if (user != null && mounted) {
      // If signup is successful, navigate to the details screen
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const BasicDetailsScreen()),
      );
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Could not create account. The email may already be in use.")),
      );
    }
  }

  void _googleSignIn() async {
    setState(() { _isLoading = true; });

    final user = await _authService.signInWithGoogle();

    setState(() { _isLoading = false; });

    if (user != null) {
      // Check if this is a new user by looking in our local Hive database
      final existingProfile = await _hiveService.getUserProfile(); // MODIFIED LINE: Removed user.uid
      if (existingProfile == null && mounted) {
        // If no profile exists, it's a new user. Go to BasicDetailsScreen.
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const BasicDetailsScreen()),
        );
      }
      // If a profile already exists, the AuthGate will handle navigation to HomeScreen
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
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 16),
            const Text('Create Account', textAlign: TextAlign.center, style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
            const SizedBox(height: 32),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(hintText: 'Email', filled: true, fillColor: Colors.grey[200], border: textFieldBorder),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(hintText: 'Password', filled: true, fillColor: Colors.grey[200], border: textFieldBorder),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _confirmPasswordController,
              obscureText: true,
              decoration: InputDecoration(hintText: 'Confirm Password', filled: true, fillColor: Colors.grey[200], border: textFieldBorder),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _signUp,
              style: ElevatedButton.styleFrom(backgroundColor: primaryColor, foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
              child: _isLoading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 3, color: Colors.black)) : const Text('Sign Up', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
                const Text("Already have an account?", style: TextStyle(color: Colors.black54)),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text('Login', style: TextStyle(color: primaryColor, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
