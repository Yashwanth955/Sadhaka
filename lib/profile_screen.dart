import 'package:flutter/material.dart';

// Assuming you have these screen files already
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';


class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF20D36A);
    const lightBg = Color(0xFFF9F9F9);

    void handleNavBarTap(int index) {
      switch (index) {
        case 0: // Home
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => const HomeScreen()),
                (route) => false,
          );
          break;
        case 1: // Tests
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const TestsScreen()));
          break;
        case 2: // Progress
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const ProgressScreen()));
          break;
        case 3: // Profile
        // Do nothing, we are on this screen
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
        title: const Text(
          'Profile',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: lightBg,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 60,
              backgroundImage: NetworkImage('https://i.imgur.com/8Km9t6T.jpeg'), // Placeholder image
            ),
            const SizedBox(height: 16),
            const Text(
              'Arjun Sharma',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            const Text(
              'Age: 25, Sport: Badminton',
              style: TextStyle(fontSize: 16, color: primaryGreen),
            ),
            const SizedBox(height: 32),
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Basic Details',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 8),
            const Divider(),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildDetailItem('Gender', 'Male'),
                _buildDetailItem('Sport', 'Badminton'),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildDetailItem('Height', '175 cm'),
                _buildDetailItem('Weight', '70 kg'),
              ],
            ),
            const SizedBox(height: 32),
            _buildProfileOption(
              icon: Icons.description_outlined,
              text: 'Relevant Documents',
              onTap: () {},
            ),
            _buildProfileOption(
              icon: Icons.edit_outlined,
              text: 'Edit Profile',
              onTap: () {},
            ),
            _buildProfileOption(
              icon: Icons.notifications_outlined,
              text: 'Notification Settings',
              onTap: () {},
            ),
            _buildProfileOption(
              icon: Icons.shield_outlined,
              text: 'Privacy Settings',
              onTap: () {},
            ),
            _buildProfileOption(
              icon: Icons.help_outline,
              text: 'Legal & Support',
              onTap: () {},
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 3,
        onTap: handleNavBarTap,
        selectedItemColor: primaryGreen,
        unselectedItemColor: Colors.grey.shade600,
        type: BottomNavigationBarType.fixed,
        showUnselectedLabels: true,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: 'Tests'),
          BottomNavigationBarItem(icon: Icon(Icons.show_chart_outlined), label: 'Progress'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
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
