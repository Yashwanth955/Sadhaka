import 'package:flutter/material.dart';
// Assuming other necessary imports like home_screen.dart,
// notifications_screen.dart, progress_screen.dart, profile_screen.dart
// are already present as per previous instructions.

// Imports for the new test instruction and result screens
import 'test_instruction_screen.dart';
import 'test_result_screens.dart'; // Make sure this file exists and is correctly structured
import 'profile_screen.dart';
import 'progress_screen.dart';

class TestsScreen extends StatelessWidget {
  const TestsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Define colors for easy reuse
    const greyText = Color(0xFF6F6F6F);
    const lightBg = Color(0xFFF9F9F9);

    void handleNavBarTap(int index) {
      // We need the BuildContext to navigate, which is available in the build method.
      switch (index) {
        case 0: // Home
        // Pop this screen to reveal the Home screen underneath.
          Navigator.pop(context);
          break;
        case 1: // Tests
        // Do nothing, we are already on this screen.
          break;
        case 2: // Progress
        // Replace this screen with the Progress screen.
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const ProgressScreen()),
          );
          break;
        case 3: // Profile
        // Replace this screen with the Profile screen.
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const ProfileScreen()),
          );
          break;
      }
    }


    return Scaffold(
      backgroundColor: lightBg,
      appBar: AppBar(
        // The back button as requested
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Fitness Tests',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: lightBg,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSearchBar(),
              const SizedBox(height: 24),
              const Text('Select a Test', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),

              // --- Flexibility Test --- (No changes here)
              _buildTestCategoryTitle('Flexibility Test'),
              _buildTestCard(
                context,
                title: 'Sit and Reach Test',
                description: 'Measure flexibility of lower back and hamstrings.',
                imageUrl: 'https://i.imgur.com/eYn6p5A.png',
                nextScreen: TestInstructionScreen(
                  testTitle: 'Sit and Reach Test',
                  rules: const [
                    'Sit on the floor with legs extended straight ahead. Shoes should be off.',
                    'Place the soles of your feet flat against the testing box.',
                    'Keeping your legs straight, slowly reach forward with both hands as far as possible.',
                    'Hold the position for two seconds while the distance is recorded.',
                  ],
                  resultScreen: const JumpResultScreen(testTitle: 'Sit and Reach test', feedback: 'Your flexibility was measured successfully.'),
                ),
              ),

              // --- Strength Test --- (No changes here)
              _buildTestCategoryTitle('Strength Test'),
              _buildTestCard(
                context,
                title: 'Push-Up Test',
                description: 'Assess upper body strength and endurance.',
                imageUrl: 'https://i.imgur.com/7aD4wwy.jpeg',
                nextScreen: TestInstructionScreen(
                  testTitle: 'Push-up test',
                  rules: const [
                    'Start in a high plank position with hands shoulder-width apart and body in a straight line.',
                    'Lower your body until your chest is about a fist\'s width from the ground.',
                    'Push back up to the starting position, keeping your core engaged.',
                    'Perform as many repetitions as possible without breaking form.',
                  ],
                  resultScreen: const JumpResultScreen(testTitle: 'Push-up test', feedback: 'Your push-up count was recorded.'),
                ),
              ),

              // --- Power Test --- (UPDATED)
              _buildTestCategoryTitle('Power Test'),
              _buildTestCard(
                context,
                title: 'Standing Broad Jump',
                description: 'Evaluate explosive leg power.',
                imageUrl: 'https://i.imgur.com/gK2x3m0.jpeg',
                // UPDATED: Now wrapped in an instruction screen
                nextScreen: TestInstructionScreen(
                  testTitle: 'Standing Broad Jump',
                  rules: const [
                    'Stand behind a line with feet slightly apart.',
                    'Perform a two-foot take-off and landing, swinging your arms and bending knees to provide forward drive.',
                    'Jump as far as possible, landing on both feet without falling backwards.',
                    'The distance is measured from the take-off line to the back of your heels.',
                  ],
                  resultScreen: const JumpResultScreen(
                    testTitle: 'Standing Broad Jump',
                    feedback: 'Jump was successful. Keep your feet shoulder-width apart and land on both feet simultaneously for optimal results.',
                  ),
                ),
              ),
              // No changes to the tests below this one in this category
              _buildTestCard(
                context,
                title: 'Standing Vertical Jump',
                description: 'Evaluate vertical jump height.',
                imageUrl: 'https://i.imgur.com/9C0F1g1.jpeg',
                nextScreen: TestInstructionScreen(
                  testTitle: 'Standing Vertical Jump Test',
                  rules: const [
                    'Stand beside a wall and reach up to mark your standing reach.',
                    'From a standing position, squat down and jump as high as you can.',
                    'Touch the wall at the highest point of your jump to make a second mark.',
                    'The distance between the two marks is your vertical jump height.',
                  ],
                  resultScreen: const JumpResultScreen(testTitle: 'Standing Vertical Jump', feedback: 'Your vertical jump height was recorded successfully.'),
                ),
              ),
              _buildTestCard(
                context,
                title: 'Medicine Ball Throw',
                description: 'Measure upper body power.',
                imageUrl: 'https://i.imgur.com/4J7j5d1.jpeg',
                nextScreen: TestInstructionScreen(
                  testTitle: 'Medicine ball Throw',
                  rules: const [
                    'Stand with your back to the throwing direction, feet shoulder-width apart.',
                    'Hold the medicine ball with both hands at your chest.',
                    'Squat down and then explosively extend your body upwards and backwards.',
                    'Throw the ball over your head as far as possible behind you.',
                  ],
                  resultScreen: const JumpResultScreen(testTitle: 'Medicine ball Throw', feedback: 'Your throw distance was measured successfully.'),
                ),
              ),

              // --- Speed & Agility Tests --- (No changes here)
              _buildTestCategoryTitle('Speed Test'),
              _buildTestCard(
                context,
                title: '30mts Standing Start',
                description: 'Measure sprinting speed over 30 meters.',
                imageUrl: 'https://i.imgur.com/L4x2a15.jpeg',
                nextScreen: TestInstructionScreen(
                  testTitle: '30mts Standing start',
                  rules: const [
                    'Stand behind the starting line in a stationary position.',
                    'On the \'Go\' signal, sprint as fast as possible for 30 meters.',
                    'Your time is recorded as you cross the 30-meter finish line.',
                    'Ensure you run through the finish line at full speed.',
                  ],
                  resultScreen: const RunResultScreen(testTitle: '30mts Standing start', feedback: 'Your sprint time was excellent!', imageUrl: 'https://i.imgur.com/G06sW7s.jpeg'),
                ),
              ),
              _buildTestCategoryTitle('Agility Test'),
              _buildTestCard(
                context,
                title: '4*10mts Shuttle Run',
                description: 'Measure speed and agility.',
                imageUrl: 'https://i.imgur.com/YV4i4zH.png',
                nextScreen: TestInstructionScreen(
                  testTitle: '4*10mts Shuttle run',
                  rules: const [
                    'Place two markers 10 meters apart. Start at one marker.',
                    'On the \'Go\' signal, sprint to the opposite marker.',
                    'Pick up a block (or touch the line) and sprint back to the start.',
                    'Repeat the process. The test is complete when you cross the starting line.',
                  ],
                  resultScreen: const RunResultScreen(testTitle: '4*10mts Shuttle run', feedback: 'Your agility test was successful.', imageUrl: 'https://i.imgur.com/G06sW7s.jpeg'),
                ),
              ),

              // --- Endurance Run --- (UPDATED)
              _buildTestCategoryTitle('Endurance Run'),
              _buildTestCard(
                context,
                title: '800mts Run',
                description: 'Endurance run for U12 age group.',
                imageUrl: 'https://i.imgur.com/w8q3J9M.png',
                // UPDATED: Now wrapped in an instruction screen
                nextScreen: TestInstructionScreen(
                  testTitle: '800mts Run Test',
                  rules: const [
                    'Start at the designated starting line on a 400m track.',
                    'On the \'Go\' signal, begin running at a steady, sustainable pace.',
                    'Complete two full laps of the 400m track (or the full 800m distance).',
                    'Your total time is recorded as you cross the finish line.',
                  ],
                  resultScreen: const RunResultScreen(
                    testTitle: '800mts Run Test',
                    feedback: 'Your performance was good. Keep up the consistent pace to improve your endurance.',
                    imageUrl: 'https://i.imgur.com/Qk7b3k3.png',
                  ),
                ),
              ),
              _buildTestCard(
                context,
                title: '1.6km Run',
                description: 'Endurance run for 12+ age group.',
                imageUrl: 'https://i.imgur.com/7S8VqVj.png',
                // UPDATED: Now wrapped in an instruction screen
                nextScreen: TestInstructionScreen(
                  testTitle: '1.6km Run Test',
                  rules: const [
                    'Start at the designated starting line on a track or measured course.',
                    'On the \'Go\' signal, begin running at a pace you can maintain for the full distance.',
                    'Complete four full laps of a 400m track (or the full 1.6km distance).',
                    'Your total time to complete the distance is recorded as your score.',
                  ],
                  resultScreen: const RunResultScreen(
                    testTitle: '1.6km Run Test',
                    feedback: 'Your performance was excellent! You maintained a consistent pace throughout the run, demonstrating strong endurance. Keep up the great work!',
                    imageUrl: 'https://i.imgur.com/Qk7b3k3.png',
                    hasReviewButton: true,
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),

      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'Tests'), // Selected
          BottomNavigationBarItem(icon: Icon(Icons.show_chart_outlined), label: 'Progress'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
        currentIndex: 1, // Set to 1 for "Tests"
        selectedItemColor: const Color(0xFF20D36A), // Primary Green
        unselectedItemColor: greyText,
        onTap: handleNavBarTap,
        type: BottomNavigationBarType.fixed,
        showUnselectedLabels: true,
      ),
    );
  }

  // --- WIDGET BUILDER METHODS ---

  Widget _buildSearchBar() {
    return TextField(
      decoration: InputDecoration(
        hintText: 'Search',
        prefixIcon: const Icon(Icons.search),
        filled: true,
        fillColor: Colors.grey[200],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
      ),
    );
  }

  Widget _buildTestCategoryTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(top: 24.0, bottom: 8.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  // Modified _buildTestCard to accept `nextScreen` as a Widget
  Widget _buildTestCard(
      BuildContext context, {
        required String title,
        required String description,
        required String imageUrl,
        required Widget nextScreen, // This now takes the actual next screen widget
      }) {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      shadowColor: Colors.black12,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          children: [
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
                    description,
                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () {
                      // Navigate to the specific test instruction or result page
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => nextScreen),
                      );
                    },
                    icon: const Icon(Icons.play_circle_outline, size: 18),
                    label: const Text('Start'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.black,
                      side: BorderSide(color: Colors.grey.shade300),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(12.0),
              child: Image.network(
                imageUrl,
                width: 80,
                height: 80,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 80,
                  height: 80,
                  color: Colors.grey[300],
                  child: const Icon(Icons.image, color: Colors.grey),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}