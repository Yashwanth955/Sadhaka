import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

// Import all necessary files
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';
import 'profile_screen.dart';
import 'camera_screen.dart';
import 'pose_analyzer.dart'; // Crucial for the Retake logic
import 'video_preview_screen.dart';
import 'report_screen.dart';
import 'report_models.dart';
import 'report_data.dart';

// --- Global constants for consistent styling ---
const primaryGreen = Color(0xFF20D36A);
const lightGreyButton = Color(0xFFF0F0F0);

// --- 1. Result Screen for RUNNING tests (Now a general placeholder) ---
class RunResultScreen extends StatelessWidget {
  final String testTitle;
  final String feedback;
  final String imageUrl;
  final bool hasReviewButton;
  final XFile? recordedVideo; // This will usually be null with live analysis

  const RunResultScreen({
    super.key,
    required this.testTitle,
    required this.feedback,
    required this.imageUrl,
    this.hasReviewButton = false,
    this.recordedVideo,
  });

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

                TestReport reportToShow;
                if (testTitle.contains('1.6km')) {
                  reportToShow = runReportData;
                } else {
                  reportToShow = pushupReportData;
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
    // UPDATED: Review button is only enabled if a video file actually exists
    final bool canReview = hasReviewButton && recordedVideo != null;

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
                if (hasReviewButton)
                  _buildStyledButton(
                    text: 'Review Video',
                    // Button is disabled if there's no video
                    onPressed: canReview
                        ? () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => VideoPreviewScreen(videoFile: recordedVideo!),
                        ),
                      );
                    }
                        : null,
                    isFilled: false,
                  ),
                if (hasReviewButton) const SizedBox(height: 12),
                _buildStyledButton(
                  text: 'Retake',
                  onPressed: () {
                    // CORRECTED: This now correctly selects an analyzer for the retake
                    final analyzer = _getAnalyzerForTest(testTitle);
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CameraScreen(
                          analyzer: analyzer,
                          testName: testTitle,
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

// --- 2. Result Screen for JUMPING/REP tests ---
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

                TestReport reportToShow;
                if (testTitle.toLowerCase().contains('push-up')) {
                  reportToShow = pushupReportData;
                } else {
                  reportToShow = runReportData; // Default to another report
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
    final bool canReview = recordedVideo != null;

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
                        onPressed: canReview
                            ? () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => VideoPreviewScreen(videoFile: recordedVideo!),
                            ),
                          );
                        }
                            : null, // Button is disabled if canReview is false
                        isFilled: false,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildStyledButton(
                        text: 'Retake',
                        onPressed: () {
                          // CORRECTED: This now correctly selects an analyzer for the retake
                          final analyzer = _getAnalyzerForTest(testTitle);
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CameraScreen(
                                analyzer: analyzer,
                                testName: testTitle,
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

// --- NEW HELPER FUNCTION ---
PoseAnalyzer _getAnalyzerForTest(String testTitle) {
  String lowerCaseTestTitle = testTitle.toLowerCase();
  if (lowerCaseTestTitle.contains('push-up')) {
    return PushUpAnalyzer();
  } else if (lowerCaseTestTitle.contains('sit-up')) {
    return SitUpAnalyzer();
  } else if (lowerCaseTestTitle.contains('squat')) {
    return SquatAnalyzer();
  }
  // Add more conditions for other tests here

  return NoAIAnalyzer(); // Return a default placeholder analyzer
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
  required VoidCallback? onPressed, // Changed to allow null
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
        disabledBackgroundColor: Colors.grey.shade300, // Style for disabled button
      ),
      child: Text(text, style: const TextStyle(fontSize: 16)),
    ),
  );
}

BottomNavigationBar _buildBottomNavBar(BuildContext context) {
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
    onTap: (index) => handleNavBarTap(index),
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