// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Sadhak';

  @override
  String get cameraScreenTitle => 'Camera';

  @override
  String get startTestButton => 'Start Test';

  @override
  String get stopTestButton => 'Stop Test';

  @override
  String get testInstructionsTitle => 'Test Instructions';

  @override
  String get loginScreenAppName => 'Sadhaka';

  @override
  String get loginWelcomeBack => 'Welcome Back';

  @override
  String get loginEmailHint => 'Email or Username';

  @override
  String get loginPasswordHint => 'Password';

  @override
  String get loginForgotPassword => 'Forgot Password?';

  @override
  String get loginButton => 'Login';

  @override
  String get loginFailedError => 'Login failed. Please check your credentials.';

  @override
  String get loginOrContinueWith => 'Or continue with';

  @override
  String get loginContinueWithGoogle => 'Continue with Google';

  @override
  String get loginContinueWithApple => 'Continue with Apple';

  @override
  String get loginDontHaveAccount => 'Don\'t have an account?';

  @override
  String get loginSignUpButton => 'Sign Up';

  @override
  String get loginMotivationalQuote =>
      '\"The only bad workout is the one that didn\'t happen.\"';
}
