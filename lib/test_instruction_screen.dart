import 'package:flutter/material.dart';
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';
import 'profile_screen.dart';
import 'camera_screen.dart';

// A reusable screen to show instructions for a fitness test.
class TestInstructionScreen extends StatelessWidget {
  // The title of the test to be displayed in the AppBar.
  final String testTitle;

  // The next screen to navigate to when the user taps "Take Test".
  final Widget resultScreen;

  // A list of strings, where each string is a rule for the test.
  final List<String> rules;

  // Constructor requires a title, a list of rules, and the result screen.
  const TestInstructionScreen({
    super.key,
    required this.testTitle,
    required this.resultScreen,
    required this.rules,
  });

  @override
  Widget build(BuildContext context) {
    // Define the app's primary green color for consistent branding.
    const primaryGreen = Color(0xFF20D36A);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        // A close button ('X') to go back to the previous screen.
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        // The title of the test.
        title: Text(
          testTitle,
          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        // An info icon on the right side of the AppBar.
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline, color: Colors.black),
            onPressed: () { /* TODO: Implement info dialog or screen */ },
          ),
        ],
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0, // No shadow for a flat design.
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // "Demo Video" section header.
            const Text(
              'Demo Video',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // A placeholder for the video player with a play icon.
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(16),
                  image: const DecorationImage(
                    // Using a placeholder image for the video thumbnail.
                    image: NetworkImage('https://i.imgur.com/G06sW7s.jpeg'),
                    fit: BoxFit.cover,
                  ),
                ),
                child: const Icon(Icons.play_circle, color: Colors.white, size: 60),
              ),
            ),
            const SizedBox(height: 24),

            // "Test Rules" section header.
            const Text(
              'Test Rules',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Use an Expanded ListView to display the list of rules.
            // This allows the rules section to scroll if there are many rules.
            Expanded(
              child: ListView.builder(
                itemCount: rules.length,
                itemBuilder: (context, index) {
                  return _buildRule(index + 1, rules[index]);
                },
              ),
            ),

            // The "Take Test" button at the bottom of the screen.
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Pass the resultScreen to the CameraScreen.
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CameraScreen(resultScreen: resultScreen),
                    ),
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
      // Consistent bottom navigation bar.
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 1, // Tests Tab is the context for this screen
        selectedItemColor: primaryGreen,
        unselectedItemColor: Colors.grey.shade600,
        onTap: (index) {
          // This logic provides a clean navigation stack reset
          switch (index) {
            case 0: // Home
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const HomeScreen()),
                    (route) => false, // This removes all previous routes
              );
              break;
            case 1: // Tests
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const TestsScreen()),
                    (route) => false,
              );
              break;
            case 2: // Progress
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const ProgressScreen()),
                    (route) => false,
              );
              break;
            case 3: // Profile
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const ProfileScreen()),
                    (route) => false,
              );
              break;
          }
        },
        type: BottomNavigationBarType.fixed,
        showUnselectedLabels: true,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'Tests'),
          BottomNavigationBarItem(icon: Icon(Icons.show_chart_outlined), label: 'Progress'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }

  // A helper widget to format each rule with a number.
  Widget _buildRule(int number, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$number. ',
            style: const TextStyle(fontSize: 16, height: 1.5, fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 16, height: 1.5),
            ),
          ),
        ],
      ),
    );
  }
}