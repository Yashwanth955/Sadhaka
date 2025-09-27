// lib/login_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart'; // Added for Provider
import 'auth_service.dart';
import 'signup_screen.dart';
import 'forgot_password_screen.dart';
import 'basic_details_screen.dart';
import 'isar_service.dart';
import 'package:sadhak/l10n/app_localizations.dart'; // Added for localization

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  // final _authService = AuthService(); // Removed: AuthService will be fetched from Provider
  final _isarService = IsarService();
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    // Get AuthService from Provider
    final authService = Provider.of<AuthService>(context, listen: false);

    setState(() {
      _isLoading = true;
    });

    // Use the authService instance from Provider
    final user = await authService.signInWithEmailAndPassword(
      _emailController.text,
      _passwordController.text,
    );

    // Important: Check if the widget is still mounted before calling setState
    if (!mounted) return;

    setState(() {
      _isLoading = false;
    });

    if (user == null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context)!.loginFailedError)),
      );
    }
    // AuthGate will handle successful navigation if login is successful
    // because it listens to the same authService instance.
  }

  void _googleSignIn() async {
    // Get AuthService from Provider
    final authService = Provider.of<AuthService>(context, listen: false);

    setState(() {
      _isLoading = true;
    });

    // Use the authService instance from Provider
    final user = await authService.signInWithGoogle();

    // Important: Check if the widget is still mounted before calling setState
    if (!mounted) return;
    
    setState(() {
      _isLoading = false;
    });

    if (user != null) {
      // Check if user profile exists after Google Sign-In
      // This logic might need refinement based on whether Google Sign-In automatically
      // creates a user profile in your Firebase backend or if you need to create
      // one in Isar based on the Firebase user.
      final userProfile = await _isarService.getUserProfileById(user.uid); // Assuming getUserProfileById exists
      
      if (!mounted) return;

      if (userProfile == null) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const BasicDetailsScreen()),
        );
      }
      // If profile exists, AuthGate should handle navigation.
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
              Text(AppLocalizations.of(context)!.loginScreenAppName, textAlign: TextAlign.center, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              Text(AppLocalizations.of(context)!.loginWelcomeBack, textAlign: TextAlign.center, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
              const SizedBox(height: 32),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(hintText: AppLocalizations.of(context)!.loginEmailHint, filled: true, fillColor: Colors.grey[200], border: textFieldBorder),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(hintText: AppLocalizations.of(context)!.loginPasswordHint, filled: true, fillColor: Colors.grey[200], border: textFieldBorder),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const ForgotPasswordScreen())),
                  child: Text(AppLocalizations.of(context)!.loginForgotPassword, style: const TextStyle(color: Colors.black54)),
                ),
              ),
              ElevatedButton(
                onPressed: _isLoading ? null : _login,
                style: ElevatedButton.styleFrom(backgroundColor: primaryColor, foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: _isLoading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 3, color: Colors.black)) : Text(AppLocalizations.of(context)!.loginButton, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 24),
              Text(AppLocalizations.of(context)!.loginOrContinueWith, textAlign: TextAlign.center, style: const TextStyle(color: Colors.black54)),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: _isLoading ? null : _googleSignIn,
                style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), side: BorderSide(color: Colors.grey.shade300)),
                child: Text(AppLocalizations.of(context)!.loginContinueWithGoogle, style: const TextStyle(color: Colors.black, fontSize: 16)),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {}, // Apple Sign-in not implemented
                style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), side: BorderSide(color: Colors.grey.shade300)),
                child: Text(AppLocalizations.of(context)!.loginContinueWithApple, style: const TextStyle(color: Colors.black, fontSize: 16)),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(AppLocalizations.of(context)!.loginDontHaveAccount, style: const TextStyle(color: Colors.black54)),
                  TextButton(
                    onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const SignupScreen())),
                    child: Text(AppLocalizations.of(context)!.loginSignUpButton, style: const TextStyle(color: primaryColor, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const Spacer(),
              Text(AppLocalizations.of(context)!.loginMotivationalQuote, textAlign: TextAlign.center, style: const TextStyle(color: Colors.black54, fontStyle: FontStyle.italic)),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
