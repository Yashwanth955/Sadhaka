import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

// Import all the main screen files for navigation
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';
import 'profile_screen.dart';
import 'camera_screen.dart';
// Import the video preview screen
import 'video_preview_screen.dart';
// Import the report screen and its data
import 'report_screen.dart';
import 'report_models.dart';
import 'report_data.dart'; // Your dummy data

// --- Global constants for consistent styling ---
const primaryGreen = Color(0xFF20D36A);
const lightGreyButton = Color(0xFFF0F0F0);

// --- 1. Result Screen for RUNNING tests (800m, 1.6km) ---
class RunResultScreen extends StatelessWidget {
  final String testTitle;
  final String feedback;
  final String imageUrl; // Image placeholder
  final bool hasReviewButton;
  final XFile? recordedVideo;

  const RunResultScreen({
    super.key,
    required this.testTitle,
    required this.feedback,
    required this.imageUrl,
    this.hasReviewButton = false,
    this.recordedVideo,
  });

  // UPDATED: This method now navigates to the ReportScreen
  void _showConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Submit Test?'),
          content: const Text('Are you sure you want to submit this result?'),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Submit'),
              onPressed: () {
                print('Video submitted! Navigating to report.');
                Navigator.of(context).pop(); // Dismiss the dialog

                // Logic to select the correct report data based on the test title
                TestReport reportToShow;
                if (testTitle.contains('1.6km')) {
                  reportToShow = runReportData;
                } else {
                  // Fallback to a default report if needed
                  reportToShow = pushupReportData;
                }

                // Navigate to the new ReportScreen
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ReportScreen(reportData: reportToShow),
                  ),
                );
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(context, testTitle),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildImagePlaceholder(imageUrl),
            const SizedBox(height: 24),
            Row(
              children: [
                _buildTimeBox('00', 'Minutes'),
                const SizedBox(width: 16),
                _buildTimeBox('00', 'Seconds'),
              ],
            ),
            const SizedBox(height: 12),
            const Text('Distance: 0m', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),
            _buildFeedbackSection(feedback),
            const Spacer(),
            Column(
              children: [
                if (hasReviewButton && recordedVideo != null)
                  _buildStyledButton(
                    text: 'Review Video',
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => VideoPreviewScreen(videoFile: recordedVideo!),
                        ),
                      );
                    },
                    isFilled: false,
                  ),
                if (hasReviewButton) const SizedBox(height: 12),
                _buildStyledButton(
                  text: 'Retake',
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CameraScreen(
                          resultScreen: RunResultScreen(
                            testTitle: testTitle,
                            feedback: feedback,
                            imageUrl: imageUrl,
                            hasReviewButton: hasReviewButton,
                          ),
                        ),
                      ),
                    );
                  },
                  isFilled: false,
                ),
                const SizedBox(height: 12),
                _buildStyledButton(
                  text: 'Submit',
                  onPressed: () => _showConfirmationDialog(context),
                  isFilled: true,
                ),
              ],
            )
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(context),
    );
  }

  Widget _buildTimeBox(String time, String label) {
    return Expanded(
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 20),
            decoration: BoxDecoration(
              color: const Color(0xFFF9F9F9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              time,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}

// --- 2. Result Screen for JUMPING tests (Broad Jump, etc.) ---
class JumpResultScreen extends StatelessWidget {
  final String testTitle;
  final String feedback;
  final XFile? recordedVideo;

  const JumpResultScreen({
    super.key,
    required this.testTitle,
    required this.feedback,
    this.recordedVideo,
  });

  // UPDATED: This method now navigates to the ReportScreen
  void _showConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Submit Test?'),
          content: const Text('Are you sure you want to submit this result?'),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Submit'),
              onPressed: () {
                print('Video submitted! Navigating to report.');
                Navigator.of(context).pop();

                // Logic to select the correct report data based on the test title
                TestReport reportToShow;
                if (testTitle.contains('Push-up')) {
                  reportToShow = pushupReportData;
                } else {
                  // Add other conditions for other jump tests if you create more data
                  reportToShow = pushupReportData; // Default to a report
                }

                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ReportScreen(reportData: reportToShow),
                  ),
                );
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(context, testTitle),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildImagePlaceholder('https://i.imgur.com/G06sW7s.jpeg'),
            const SizedBox(height: 16),
            const Text('Distance: 0.00m', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 24),
            _buildFeedbackSection(feedback),
            const Spacer(),
            Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _buildStyledButton(
                        text: 'Review Video',
                        onPressed: () {
                          if (recordedVideo != null) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => VideoPreviewScreen(videoFile: recordedVideo!),
                              ),
                            );
                          }
                        },
                        isFilled: false,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildStyledButton(
                        text: 'Retake',
                        onPressed: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CameraScreen(
                                resultScreen: JumpResultScreen(
                                  testTitle: testTitle,
                                  feedback: feedback,
                                ),
                              ),
                            ),
                          );
                        },
                        isFilled: false,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                _buildStyledButton(
                  text: 'Submit',
                  onPressed: () => _showConfirmationDialog(context),
                  isFilled: true,
                ),
              ],
            )
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(context),
    );
  }
}

// --- Common Helper Widgets for Result Screens ---

AppBar _buildAppBar(BuildContext context, String title) {
  return AppBar(
    leading: IconButton(
      icon: const Icon(Icons.arrow_back, color: Colors.black),
      onPressed: () => Navigator.of(context).pop(),
    ),
    title: Text(title, style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
    actions: [
      IconButton(icon: const Icon(Icons.info_outline, color: Colors.black), onPressed: () {}),
    ],
    centerTitle: true,
    backgroundColor: Colors.white,
    elevation: 0,
  );
}

Widget _buildImagePlaceholder(String imageUrl) {
  return AspectRatio(
    aspectRatio: 16 / 9,
    child: Container(
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(16),
        image: DecorationImage(image: NetworkImage(imageUrl), fit: BoxFit.cover),
      ),
      child: const Icon(Icons.play_circle_outline, color: Colors.white70, size: 60),
    ),
  );
}

Widget _buildFeedbackSection(String feedback) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Text('Feedback', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      Text(feedback, style: TextStyle(fontSize: 16, color: Colors.grey.shade700, height: 1.5)),
    ],
  );
}

Widget _buildStyledButton({
  required String text,
  required VoidCallback onPressed,
  required bool isFilled,
}) {
  return SizedBox(
    width: double.infinity,
    child: ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: isFilled ? primaryGreen : lightGreyButton,
        foregroundColor: isFilled ? Colors.white : Colors.black,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
        elevation: 0,
      ),
      child: Text(text, style: const TextStyle(fontSize: 16)),
    ),
  );
}

void _handleNavBarTap(BuildContext context, int index) {
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

BottomNavigationBar _buildBottomNavBar(BuildContext context) {
  return BottomNavigationBar(
    currentIndex: 1, // Tests Tab
    selectedItemColor: primaryGreen,
    unselectedItemColor: Colors.grey.shade600,
    onTap: (index) => _handleNavBarTap(context, index),
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
