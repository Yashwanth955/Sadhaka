import 'package:flutter/material.dart';

// Import main screens for the bottom navigation bar
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';
import 'profile_screen.dart';

class BadgesScreen extends StatelessWidget {
  const BadgesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Dummy data for badges
    final earnedBadges = [
      {'name': 'Core Strength Pro 💪', 'desc': 'Completed 5 core strength tests', 'img': 'https://i.imgur.com/bT6R022.png'},
      {'name': 'Stamina Star 🔥', 'desc': 'Achieved top 10% in stamina tests', 'img': 'https://i.imgur.com/k2p8J5F.png'},
      {'name': 'Flexibility Master 🤸', 'desc': 'Demonstrated exceptional flexibility', 'img': 'https://i.imgur.com/8m52eSO.png'},
      {'name': 'Balance Ace 🧘', 'desc': 'Maintained perfect balance in all tests', 'img': 'https://i.imgur.com/bT6R022.png'},
    ];
    final unearnedBadges = [
      {'name': 'Speed Demon 🏃', 'desc': 'Achieve top speed in sprint tests', 'img': 'https://i.imgur.com/bT6R022.png'},
      {'name': 'Endurance Champ 🏆', 'desc': 'Complete all endurance challenges', 'img': 'https://i.imgur.com/k2p8J5F.png'},
      {'name': 'Powerhouse 💪', 'desc': 'Demonstrate exceptional power', 'img': 'https://i.imgur.com/8m52eSO.png'},
      {'name': 'Agility Expert 🤸', 'desc': 'Master all agility drills', 'img': 'https://i.imgur.com/bT6R022.png'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Achievements', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        backgroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle('Earned'),
            _buildBadgesGrid(earnedBadges),
            const SizedBox(height: 24),
            _buildSectionTitle('Unearned'),
            _buildBadgesGrid(unearnedBadges, isEarned: false),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(context, 1),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
    );
  }

  Widget _buildBadgesGrid(List<Map<String, String>> badges, {bool isEarned = true}) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: badges.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.8,
      ),
      itemBuilder: (context, index) {
        final badge = badges[index];
        return _buildBadgeItem(
          name: badge['name']!,
          description: badge['desc']!,
          imageUrl: badge['img']!,
          isEarned: isEarned,
        );
      },
    );
  }

  Widget _buildBadgeItem({required String name, required String description, required String imageUrl, bool isEarned = true}) {
    return Opacity(
      opacity: isEarned ? 1.0 : 0.5,
      child: Column(
        children: [
          CircleAvatar(
            radius: 60,
            backgroundColor: Colors.grey.shade200,
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Image.network(imageUrl),
            ),
          ),
          const SizedBox(height: 8),
          Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16), textAlign: TextAlign.center,),
          Text(description, style: TextStyle(color: Colors.grey.shade600), textAlign: TextAlign.center,),
        ],
      ),
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