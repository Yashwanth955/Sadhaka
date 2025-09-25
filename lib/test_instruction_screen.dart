import 'package:flutter/material.dart';

// Import main screens for the bottom navigation bar
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';
import 'profile_screen.dart';

class TestInstructionScreen extends StatelessWidget {
  final String testTitle;
  // UPDATED: This screen now accepts the camera screen directly.
  final Widget cameraScreen;
  final List<String> rules;

  const TestInstructionScreen({
    super.key,
    required this.testTitle,
    required this.cameraScreen, // Changed from resultScreen
    required this.rules,
  });

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF20D36A);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          testTitle,
          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline, color: Colors.black),
            onPressed: () { /* TODO: Show info */ },
          ),
        ],
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Demo Video',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(16),
                  image: const DecorationImage(
                    image: NetworkImage('https://i.imgur.com/G06sW7s.jpeg'),
                    fit: BoxFit.cover,
                  ),
                ),
                child: const Icon(Icons.play_circle, color: Colors.white, size: 60),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Test Rules',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: rules.length,
                itemBuilder: (context, index) {
                  return _buildRule(index + 1, rules[index]);
                },
              ),
            ),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                // UPDATED: The button now navigates to the provided cameraScreen.
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => cameraScreen),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryGreen,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(50),
                  ),
                ),
                child: const Text('Take Test', style: TextStyle(fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(context),
    );
  }

  Widget _buildRule(int number, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('$number. ', style: const TextStyle(fontSize: 16, height: 1.5, fontWeight: FontWeight.bold)),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 16, height: 1.5))),
        ],
      ),
    );
  }
}

// Common bottom navigation bar
BottomNavigationBar _buildBottomNavBar(BuildContext context) {
  const primaryGreen = Color(0xFF20D36A);
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
    currentIndex: 1, // Tests Tab
    selectedItemColor: primaryGreen,
    unselectedItemColor: Colors.grey.shade600,
    onTap: handleNavBarTap,
    type: BottomNavigationBarType.fixed,
    showUnselectedLabels: true,
    items: const [
      BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
      BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'Tests'),
      BottomNavigationBarItem(icon: Icon(Icons.show_chart_outlined), label: 'Progress'),
      BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
    ],
  );
}