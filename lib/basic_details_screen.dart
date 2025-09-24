// lib/basic_details_screen.dart

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'hive_service.dart';
import 'user_model.dart';
import 'home_screen.dart'; // To navigate to home after saving

class BasicDetailsScreen extends StatefulWidget {
  // We remove the firebaseUser dependency for a pure offline app
  const BasicDetailsScreen({super.key});

  @override
  State<BasicDetailsScreen> createState() => _BasicDetailsScreenState();
}

class _BasicDetailsScreenState extends State<BasicDetailsScreen> {
  // Text editing controllers for all fields
  final _nameController = TextEditingController();
  final _ageController = TextEditingController();
  final _sportController = TextEditingController();
  final _heightController = TextEditingController();
  final _weightController = TextEditingController();
  final _mobileController = TextEditingController();

  final _hiveService = HiveService();

  // State variable to hold the selected image file
  XFile? _profileImage;

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _sportController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _mobileController.dispose();
    super.dispose();
  }

  // Method to open the image gallery
  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        _profileImage = image;
      });
    }
  }

  void _saveDetails() async {
    final newUserProfile = UserProfile()
      ..name = _nameController.text
      ..age = int.tryParse(_ageController.text)
      ..sport = _sportController.text
      ..height = double.tryParse(_heightController.text)
      ..weight = double.tryParse(_weightController.text)
      ..mobileNumber = _mobileController.text
      ..profilePhotoPath = _profileImage?.path; // Save the image path

    await _hiveService.saveUserProfile(newUserProfile);

    if (mounted) {
      // After saving, navigate to the main app (HomeScreen)
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
            (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1FFF83);
    final textFieldBorder = OutlineInputBorder(
      borderSide: BorderSide(color: Colors.grey.shade300),
      borderRadius: BorderRadius.circular(12),
    );

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Tell us about you', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // --- Profile Picture Section ---
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 60,
                    backgroundColor: Colors.grey.shade200,
                    backgroundImage: _profileImage != null
                        ? FileImage(File(_profileImage!.path))
                        : null,
                    child: _profileImage == null
                        ? const Icon(Icons.person, size: 60, color: Colors.grey)
                        : null,
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: _pickImage,
                      child: const CircleAvatar(
                        radius: 20,
                        backgroundColor: primaryColor,
                        child: Icon(Icons.edit, color: Colors.black),
                      ),
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 32),

            // --- Input Fields ---
            TextField(controller: _nameController, decoration: InputDecoration(labelText: 'Full Name', border: textFieldBorder)),
            const SizedBox(height: 20),
            TextField(controller: _ageController, decoration: InputDecoration(labelText: 'Age', border: textFieldBorder), keyboardType: TextInputType.number),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(child: TextField(controller: _heightController, decoration: InputDecoration(labelText: 'Height (cm)', border: textFieldBorder), keyboardType: TextInputType.number)),
                const SizedBox(width: 16),
                Expanded(child: TextField(controller: _weightController, decoration: InputDecoration(labelText: 'Weight (kg)', border: textFieldBorder), keyboardType: TextInputType.number)),
              ],
            ),
            const SizedBox(height: 20),
            TextField(controller: _sportController, decoration: InputDecoration(labelText: 'Primary Sport (e.g., Football)', border: textFieldBorder)),
            const SizedBox(height: 20),
            TextField(controller: _mobileController, decoration: InputDecoration(labelText: 'Mobile Number', border: textFieldBorder), keyboardType: TextInputType.phone),
            const SizedBox(height: 40),

            // --- Save Button ---
            ElevatedButton(
              onPressed: _saveDetails,
              style: ElevatedButton.styleFrom(backgroundColor: primaryColor, foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
              child: const Text('Save & Continue', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}