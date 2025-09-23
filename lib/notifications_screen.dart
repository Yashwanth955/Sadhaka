import 'package:flutter/material.dart';
import 'tests_screen.dart';
import 'progress_screen.dart'; // Add this import
import 'profile_screen.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Define colors for easy reuse
    const greyText = Color(0xFF6F6F6F);
    const lightBg = Color(0xFFF9F9F9);
    const iconBg = Color(0xFFF0F0F0);

    // Handler for the bottom navigation bar
    void handleNavBarTap(int index) {
      switch (index) {
        case 0: // Home button
          Navigator.of(context).pop();
          break;
        case 1: // Tests button
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const TestsScreen()));
          break;
        case 2: // Progress
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const ProgressScreen()));
          break;
        case 3: // Profile
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const ProfileScreen()));
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
          'Notifications',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: lightBg,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
        children: [
          _buildSectionHeader('Today'),
          _buildNotificationItem(
            icon: Icons.rocket_launch_outlined,
            title: 'Daily Challenge',
            time: '10:30 AM',
            iconBgColor: iconBg,
          ),
          _buildNotificationItem(
            icon: Icons.notifications_outlined,
            title: 'Test Reminder',
            time: '11:00 AM',
            iconBgColor: iconBg,
          ),

          const SizedBox(height: 16),
          _buildSectionHeader('Yesterday'),
          _buildNotificationItem(
            icon: Icons.chat_bubble_outline,
            title: 'Performance Alert',
            time: '2:00 PM',
            iconBgColor: iconBg,
          ),
          _buildNotificationItem(
            icon: Icons.chat_bubble_outline,
            title: 'Coach Feedback',
            time: '4:00 PM',
            iconBgColor: iconBg,
          ),

          const SizedBox(height: 16),
          _buildSectionHeader('Last Week'),
          _buildNotificationItem(
            icon: Icons.emoji_events_outlined,
            title: 'Gamification Update',
            time: '5d',
            iconBgColor: iconBg,
          ),
          _buildNotificationItem(
            icon: Icons.info_outline,
            title: 'App Update',
            time: '6d',
            iconBgColor: iconBg,
          ),
        ],
      ),
      // Using the same bottom nav bar for consistency
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: 'Tests'),
          BottomNavigationBarItem(icon: Icon(Icons.show_chart_outlined), label: 'Progress'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
        // We set currentIndex to 0 because the Home screen is the page "under" the notification screen.
        // This keeps the bar consistent with where you came from.
        currentIndex: 0,
        selectedItemColor: const Color(0xFF20D36A), // Primary Green
        unselectedItemColor: greyText,
        onTap: handleNavBarTap, // The updated handler
        type: BottomNavigationBarType.fixed,
        showUnselectedLabels: true,
        showSelectedLabels: true,
      ),
    );
  }

  // --- WIDGET BUILDER METHODS ---

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(top: 16.0, bottom: 8.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildNotificationItem({
    required IconData icon,
    required String title,
    required String time,
    required Color iconBgColor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Icon(icon, size: 28, color: Colors.black87),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}