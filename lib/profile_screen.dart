import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

// Import services and models
import 'hive_service.dart';
import 'user_model.dart';
import 'auth_service.dart';

// Import main screens for navigation
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF20D36A);
    const lightBg = Color(0xFFF9F9F9);

    final hiveService = HiveService(); // Changed from IsarService
    final authService = AuthService();
    final uid = FirebaseAuth.instance.currentUser?.uid;

    void handleNavBarTap(int index) {
      switch (index) {
        case 0:
          Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => const HomeScreen()), (route) => false);
          break;
        case 1:
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const TestsScreen()));
          break;
        case 2:
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const ProgressScreen()));
          break;
        case 3:
          // Current screen, do nothing
          break;
      }
    }

    return Scaffold(
      backgroundColor: lightBg,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text('Profile', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: lightBg,
        elevation: 0,
      ),
      body: FutureBuilder<UserProfile?>(
        future: hiveService.getUserProfile(), // Changed from isarService
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data == null) {
            // Also print the UID here to see what ID is failing
            print("DEBUG: Profile could not be loaded for UID: $uid");
            return const Center(child: Text('Could not load user profile.'));
          }

          final userProfile = snapshot.data!;

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 60,
                  backgroundImage: NetworkImage('https://i.imgur.com/8Km9t6T.jpeg'),
                ),
                const SizedBox(height: 16),
                Text(
                  userProfile.name ?? 'User Name',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Age: ${userProfile.age ?? 'N/A'}, Sport: ${userProfile.sport ?? 'N/A'}',
                  style: const TextStyle(fontSize: 16, color: primaryGreen),
                ),
                const SizedBox(height: 32),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text('Basic Details', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 8),
                const Divider(),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildDetailItem('Gender', 'Male'), // Assuming gender is static or handled elsewhere
                    _buildDetailItem('Sport', userProfile.sport ?? 'N/A'),
                  ],
                ),
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildDetailItem('Height', '175 cm'), // Assuming height is static or handled elsewhere
                    _buildDetailItem('Weight', '70 kg'), // Assuming weight is static or handled elsewhere
                  ],
                ),
                const SizedBox(height: 32),
                _buildProfileOption(icon: Icons.description_outlined, text: 'Relevant Documents', onTap: () {}),
                _buildProfileOption(icon: Icons.edit_outlined, text: 'Edit Profile', onTap: () {}),
                _buildProfileOption(icon: Icons.notifications_outlined, text: 'Notification Settings', onTap: () {}),
                _buildProfileOption(icon: Icons.shield_outlined, text: 'Privacy Settings', onTap: () {}),
                _buildProfileOption(icon: Icons.help_outline, text: 'Legal & Support', onTap: () {}),
                const Divider(height: 24),
                _buildProfileOption(
                  icon: Icons.logout,
                  text: 'Sign Out',
                  onTap: () {
                    print("DEBUG: Sign Out button was tapped!");
                    authService.signOut();
                  },
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: _buildBottomNavBar(context, handleNavBarTap), // Pass handleNavBarTap
    );
  }

  static Widget _buildDetailItem(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  static Widget _buildProfileOption({
    required IconData icon,
    required String text,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12.0),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(50),
              ),
              child: Icon(icon, color: Colors.grey.shade800),
            ),
            const SizedBox(width: 16),
            Expanded(child: Text(text, style: const TextStyle(fontSize: 16))),
            const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
          ],
        ),
      ),
    );
  }
}

// Common bottom navigation bar for this screen
BottomNavigationBar _buildBottomNavBar(BuildContext context, Function(int) onNavBarTap) { // Accept onNavBarTap
  return BottomNavigationBar(
    currentIndex: 3, // Profile screen is index 3
    onTap: onNavBarTap, // Use passed handler
    selectedItemColor: const Color(0xFF20D36A),
    unselectedItemColor: Colors.grey.shade600,
    type: BottomNavigationBarType.fixed,
    showUnselectedLabels: true,
    items: const [
      BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
      BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: 'Tests'),
      BottomNavigationBarItem(icon: Icon(Icons.show_chart_outlined), label: 'Progress'),
      BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'), // Changed to outlined icon for consistency
    ],
  );
}