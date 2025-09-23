import 'package:flutter/material.dart';

// Import main screens for the bottom navigation bar
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';
import 'profile_screen.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  // State for the tabs
  int _selectedTabIndex = 0;

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF20D36A);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Leaderboard', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        backgroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Filter Buttons
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildFilterButton('Test Type'),
                _buildFilterButton('Age Group'),
                _buildFilterButton('Region'),
              ],
            ),
          ),
          // Tabs
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                _buildTab(context, 'Overall', 0),
                _buildTab(context, 'Friends', 1),
              ],
            ),
          ),
          // User List
          Expanded(
            child: ListView.builder(
              itemCount: 10, // Displaying top 10 users
              itemBuilder: (context, index) {
                // Dummy data
                final users = [
                  'Arjun Sharma', 'Priya Patel', 'Rohan Verma', 'Anika Singh',
                  'Vikram Kapoor', 'Neha Gupta', 'Aditya Mishra', 'Shreya Rao',
                  'Ishaan Kumar', 'Divya Sharma'
                ];
                final scores = [95, 92, 90, 88, 85, 82, 80, 78, 75, 72];
                return _buildUserTile(
                  rank: index + 1,
                  name: users[index],
                  score: scores[index],
                  imageUrl: 'https://i.pravatar.cc/150?img=${index + 1}',
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNavBar(context, 1), // Assuming this is part of the 'Tests' flow
    );
  }

  Widget _buildFilterButton(String text) {
    return OutlinedButton(
      onPressed: () {},
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.black,
        side: BorderSide(color: Colors.grey.shade300),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      child: Row(
        children: [
          Text(text),
          const SizedBox(width: 4),
          const Icon(Icons.arrow_drop_down, size: 20),
        ],
      ),
    );
  }

  Widget _buildTab(BuildContext context, String text, int index) {
    bool isSelected = _selectedTabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedTabIndex = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected ? const Color(0xFF20D36A) : Colors.grey.shade300,
                width: 3,
              ),
            ),
          ),
          child: Text(
            text,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? Colors.black : Colors.grey.shade600,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUserTile({required int rank, required String name, required int score, required String imageUrl}) {
    return ListTile(
      leading: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('$rank.', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(width: 12),
          CircleAvatar(backgroundImage: NetworkImage(imageUrl)),
        ],
      ),
      title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text('Score: $score'),
      trailing: const Text('India'),
    );
  }
}
// A common bottom navigation bar for all secondary screens
BottomNavigationBar _buildBottomNavBar(BuildContext context, int currentIndex) {
  void handleNavBarTap(int index) {
    switch (index) {
      case 0:
        Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => const HomeScreen()), (route) => false);
        break;
      case 1:
        Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => const TestsScreen()), (route) => false);
        break;
      case 2:
        Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => const ProgressScreen()), (route) => false);
        break;
      case 3:
        Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => const ProfileScreen()), (route) => false);
        break;
    }
  }

  return BottomNavigationBar(
    currentIndex: currentIndex,
    onTap: handleNavBarTap,
    selectedItemColor: const Color(0xFF20D36A),
    unselectedItemColor: Colors.grey.shade600,
    type: BottomNavigationBarType.fixed,
    showUnselectedLabels: true,
    items: const [
      BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
      BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: 'Tests'),
      BottomNavigationBarItem(icon: Icon(Icons.show_chart_outlined), label: 'Progress'),
      BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
    ],
  );
}