import 'package:flutter/material.dart';
import 'package:sadhak/user_model.dart'; // Assuming user_model.dart path

class AppState extends ChangeNotifier {
  UserProfile? _userProfile;

  UserProfile? get userProfile => _userProfile;

  void setUserProfile(UserProfile? profile) {
    _userProfile = profile;
    notifyListeners();
  }
}
