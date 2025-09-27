import 'dart:io';
import 'package:flutter/material.dart';
// import 'package:firebase_auth/firebase_auth.dart'; // Unused import removed
import 'package:url_launcher/url_launcher.dart';

// Import services and models
import 'isar_service.dart';
import 'user_model.dart';
import 'auth_service.dart';

// Import main screens for navigation
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  // Helper method to launch URLs for contact buttons
  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      // You could show a snackbar here if launching fails
      print('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    const lightBg = Color(0xFFF9F9F9);

    final isarService = IsarService();
    final authService = AuthService();
    // final uid = FirebaseAuth.instance.currentUser?.uid; // uid is not used if getUserProfile takes no args

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
        future: isarService.getCurrentUserProfile(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data == null) {
            return const Center(child: Text('Could not load user profile.'));
          }

          final userProfile = snapshot.data!;

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 60,
                  backgroundImage: userProfile.profilePhotoPath != null
                      ? FileImage(File(userProfile.profilePhotoPath!)) as ImageProvider
                      : const AssetImage('assests/images/placeholder.png'),
                ),
                const SizedBox(height: 16),
                Text(
                  userProfile.name ?? 'User Name',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Age: ${userProfile.age ?? 'N/A'}, Sport: ${userProfile.sport ?? 'N/A'}',
                  style: const TextStyle(fontSize: 16, color: Color(0xFF20D36A)), // Re-added primaryGreen color directly
                ),
                const SizedBox(height: 32),

                // --- Coach Details Section ---
                if (userProfile.coachName != null)
                  _buildCoachSection(
                    name: userProfile.coachName!,
                    phone: userProfile.coachPhoneNumber,
                    whatsapp: userProfile.coachWhatsappNumber,
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
                    _buildDetailItem('Mobile', userProfile.mobileNumber ?? '9955854217'),
                    _buildDetailItem('Sport', userProfile.sport ?? 'Running'),
                  ],
                ),
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildDetailItem('Height', '${userProfile.height?.toStringAsFixed(1) ?? 'N/A'} cm'),
                    _buildDetailItem('Weight', '${userProfile.weight?.toStringAsFixed(1) ?? 'N/A'} kg'),
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
                    authService.signOut();
                  },
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: _buildBottomNavBar(context),
    );
  }

  Widget _buildCoachSection({required String name, String? phone, String? whatsapp}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Coach', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Card(
          elevation: 2,
          shadowColor: Colors.black12,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 30,
                  backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=10'),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Assigned Coach', style: TextStyle(color: Colors.grey)),
                      Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    ],
                  ),
                ),
                if (phone != null)
                  IconButton(
                    icon: const Icon(Icons.call, color: Colors.green),
                    onPressed: () => _launchURL('tel:$phone'),
                  ),
                if (whatsapp != null)
                  IconButton(
                    icon: const Icon(Icons.message, color: Colors.green),
                    onPressed: () => _launchURL('https://wa.me/$whatsapp'),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDetailItem(String label, String value) {
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

  Widget _buildProfileOption({
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

BottomNavigationBar _buildBottomNavBar(BuildContext context) {
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
        break;
    }
  }

  return BottomNavigationBar(
    currentIndex: 3,
    onTap: handleNavBarTap,
    selectedItemColor: const Color(0xFF20D36A),
    unselectedItemColor: Colors.grey.shade600,
    type: BottomNavigationBarType.fixed,
    showUnselectedLabels: true,
    items: const [
      BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
      BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: 'Tests'),
      BottomNavigationBarItem(icon: Icon(Icons.show_chart_outlined), label: 'Progress'),
      BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
    ],
  );
}
