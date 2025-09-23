import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

// Ensure all your screen files are imported
import 'tests_screen.dart';
import 'notifications_screen.dart';
import 'progress_screen.dart';
import 'profile_screen.dart';
import 'streaks_screen.dart';

// NEW: Import the new placeholder screens
import 'leaderboard_screen.dart';
import 'badges_screen.dart';
import 'resources_screen.dart';

// NEW: A simple model for our daily challenges
class DailyChallenge {
  final String title;
  final String description;
  DailyChallenge({required this.title, required this.description});
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  // --- NEW STATE VARIABLES ---
  late DailyChallenge _selectedChallenge;
  String _selectedTimeFrame = 'Daily'; // For the dropdown
  List<FlSpot> _chartData = []; // To hold the current chart data
  final Map<String, List<FlSpot>> _sampleChartData = {
    'Daily': [
      const FlSpot(0, 80), const FlSpot(1, 85), const FlSpot(2, 82),
      const FlSpot(3, 88), const FlSpot(4, 90), const FlSpot(5, 87),
      const FlSpot(6, 92),
    ],
    'Weekly': [
      const FlSpot(0, 75), const FlSpot(1, 80), const FlSpot(2, 85),
      const FlSpot(3, 90),
    ],
    'Monthly': [
      const FlSpot(0, 60), const FlSpot(1, 65), const FlSpot(2, 70),
      const FlSpot(3, 72), const FlSpot(4, 78), const FlSpot(5, 85),
    ],
  };

  @override
  void initState() {
    super.initState();
    _selectRandomChallenge();
    _updateChartData();
  }

  // NEW: Method to pick a random challenge
  void _selectRandomChallenge() {
    final challenges = [
      DailyChallenge(title: 'Push-ups', description: 'Daily Challenge:\nPush-ups'),
      DailyChallenge(title: 'Plank', description: 'Daily Challenge:\nPlank for 60s'),
    ];
    _selectedChallenge = challenges[Random().nextInt(challenges.length)];
  }

  // NEW: Method to update the chart data based on the dropdown
  void _updateChartData() {
    setState(() {
      _chartData = _sampleChartData[_selectedTimeFrame]!;
    });
  }

  void _onItemTapped(int index) {
    switch (index) {
      case 0:
        break;
      case 1:
        Navigator.push(context, MaterialPageRoute(builder: (context) => const TestsScreen()));
        break;
      case 2:
        Navigator.push(context, MaterialPageRoute(builder: (context) => const ProgressScreen()));
        break;
      case 3:
        Navigator.push(context, MaterialPageRoute(builder: (context) => const ProfileScreen()));
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF20D36A);
    const darkCardBg = Color(0xFF0E1F3C);
    const lightBg = Color(0xFFF9F9F9);
    const greyText = Color(0xFF6F6F6F);

    return Scaffold(
      backgroundColor: lightBg,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildTopBar(),
                const SizedBox(height: 24),

                // UPDATED: Greeting section no longer has the profile snippet
                _buildGreetingSection(),
                const SizedBox(height: 24),

                _buildConsistencyBanner(primaryGreen, darkCardBg),
                const SizedBox(height: 20),

                _buildStartTestButton(primaryGreen),
                const SizedBox(height: 30),

                // UPDATED: "My Progress" section is now "Best Score" with a dropdown
                _buildBestScoreSection(primaryGreen, greyText),
                const SizedBox(height: 30),

                // UPDATED: Leaderboard is now tappable
                _buildLeaderboardSection(greyText),
                const SizedBox(height: 30),

                // UPDATED: Badges section is now tappable
                _buildBadgesSection(darkCardBg, greyText),
                const SizedBox(height: 30),

                // UPDATED: Resources section is now tappable
                _buildResourcesSection(greyText),
                const SizedBox(height: 30),

                // UPDATED: Daily Challenge card now shows a random test
                _buildDailyChallengeCard(primaryGreen, _selectedChallenge),
                const SizedBox(height: 20),

                _buildAiInsightsCard(),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(primaryGreen, greyText),
    );
  }

  // --- WIDGET BUILDER METHODS ---

  Widget _buildTopBar() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Saadhaka',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        IconButton(
          icon: const Icon(Icons.notifications_none_outlined, size: 28),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const NotificationsScreen()),
            );
          },
        ),
      ],
    );
  }

  // UPDATED: Removed the profile picture and details row
  Widget _buildGreetingSection() {
    return const Text(
      'Hi Aarav 👋, ready to test\nyour fitness today?',
      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
    );
  }

  // In home_screen.dart

  Widget _buildConsistencyBanner(Color primaryGreen, Color darkCardBg) {
    return Card(
      color: darkCardBg,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: NetworkImage('https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071'),
            fit: BoxFit.cover,
            opacity: 0.2,
          ),
        ),
        child: Row(
          children: [
            const Expanded(
              child: Text(
                '🎉 You\'ve been\nconsistent for 3 days!',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const StreaksScreen()),
                );
              },
              // CORRECTED: Changed stylefrom to styleFrom
              style: TextButton.styleFrom(
                backgroundColor: primaryGreen,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('View past'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStartTestButton(Color primaryGreen) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const TestsScreen()),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryGreen,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
        ),
        child: const Text(
          'Start Fitness Test',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  // UPDATED: This whole widget is new for the Best Score section
  Widget _buildBestScoreSection(Color primaryGreen, Color greyText) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Best Score',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            // The new Dropdown menu
            DropdownButton<String>(
              value: _selectedTimeFrame,
              icon: const Icon(Icons.arrow_drop_down),
              elevation: 2,
              style: TextStyle(color: greyText, fontWeight: FontWeight.bold),
              underline: Container(), // Hides the default underline
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    _selectedTimeFrame = newValue;
                    _updateChartData(); // Update chart when dropdown changes
                  });
                }
              },
              items: <String>['Daily', 'Weekly', 'Monthly']
                  .map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
          ],
        ),
        const SizedBox(height: 20),
        SizedBox(
          height: 120,
          child: LineChart(
            LineChartData(
              gridData: const FlGridData(show: false),
              titlesData: const FlTitlesData(
                  leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: false))), // Hiding labels for simplicity
              borderData: FlBorderData(show: false),
              lineBarsData: [
                LineChartBarData(
                  spots: _chartData, // Use the state variable for chart data
                  isCurved: true,
                  color: primaryGreen,
                  barWidth: 4,
                  isStrokeCapRound: true,
                  dotData: const FlDotData(show: false),
                  belowBarData: BarAreaData(
                    show: true,
                    gradient: LinearGradient(
                      colors: [primaryGreen.withOpacity(0.3), primaryGreen.withOpacity(0.0)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const Icon(Icons.arrow_forward_ios, size: 16),
      ],
    );
  }

  // UPDATED: Now navigates to LeaderboardScreen
  Widget _buildLeaderboardSection(Color greyText) {
    return Column(
      children: [
        InkWell(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => const LeaderboardScreen()));
          },
          child: _buildSectionHeader('Leaderboard'),
        ),
        const SizedBox(height: 16),
        _buildInfoTile(Icons.public, '12th', 'Regional Rank', greyText),
        const Divider(height: 24, thickness: 1),
        _buildInfoTile(Icons.group, '5th', 'Age Group Rank', greyText),
      ],
    );
  }

  // UPDATED: Now navigates to BadgesScreen
  Widget _buildBadgesSection(Color darkCardBg, Color greyText) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InkWell(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => const BadgesScreen()));
          },
          child: _buildSectionHeader('Badges / Achievements'),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 120,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              _buildBadgeItem(const Color(0xFFE3F2FD), Icons.autorenew, 'Consistency', 'Today: 30mins'),
              const SizedBox(width: 16),
              _buildBadgeItem(darkCardBg, Icons.flash_on, 'Speed', 'First run: 12km', isDark: true),
              const SizedBox(width: 16),
              _buildBadgeItem(const Color(0xFFE8F5E9), Icons.fitness_center, 'Endurance', '5km run'),
            ],
          ),
        )
      ],
    );
  }

  // UPDATED: Now navigates to ResourcesScreen
  Widget _buildResourcesSection(Color greyText) {
    return Column(
      children: [
        InkWell(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => const ResourcesScreen()));
          },
          child: _buildSectionHeader('Resources'),
        ),
        const SizedBox(height: 16),
        _buildInfoTile(Icons.description_outlined, 'Warm-up Guides', null, greyText),
        const Divider(height: 24, thickness: 1),
        _buildInfoTile(Icons.shield_outlined, 'Safety Tips', null, greyText),
      ],
    );
  }

  // UPDATED: Accepts a challenge object to display
  Widget _buildDailyChallengeCard(Color primaryGreen, DailyChallenge challenge) {
    return Card(
        clipBehavior: Clip.antiAlias,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          height: 150,
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: NetworkImage('https://images.unsplash.com/photo-1548933122-5fed123a7e53?q=80&w=2070'),
              fit: BoxFit.cover,
            ),
          ),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.black.withOpacity(0.4)),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: Text(
                    challenge.description,
                    style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                ElevatedButton(
                  onPressed: () { /* TODO: Start Challenge */ },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryGreen,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Start'),
                ),
              ],
            ),
          ),
        ));
  }

  Widget _buildAiInsightsCard() {
    return Card(
        clipBehavior: Clip.antiAlias,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          height: 150,
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: NetworkImage('https://images.unsplash.com/photo-1612871689353-cccf581d8ec4?q=80&w=2070'),
              fit: BoxFit.cover,
            ),
          ),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.black.withOpacity(0.4)),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Expanded(
                  child: Text('AI Insights:\nPersonalized Training', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                ),
                ElevatedButton(
                  onPressed: () { /* TODO: View Insights */ },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                  ),
                  child: const Text('View'),
                ),
              ],
            ),
          ),
        ));
  }

  Widget _buildInfoTile(IconData icon, String title, String? subtitle, Color greyText) {
    return Row(
      children: [
        Icon(icon, color: greyText, size: 28),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            if (subtitle != null)
              Text(subtitle, style: TextStyle(color: greyText, fontSize: 14)),
          ],
        )
      ],
    );
  }

  Widget _buildBadgeItem(Color bgColor, IconData icon, String title, String subtitle, {bool isDark = false}) {
    return Column(
      children: [
        CircleAvatar(
          radius: 40,
          backgroundColor: bgColor,
          child: Icon(icon, size: 40, color: isDark ? Colors.white : Colors.black87),
        ),
        const SizedBox(height: 8),
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(subtitle, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
      ],
    );
  }

  Widget _buildBottomNavigationBar(Color primaryGreen, Color greyText) {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment_outlined),
          activeIcon: Icon(Icons.assignment),
          label: 'Tests',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.show_chart_outlined),
          activeIcon: Icon(Icons.show_chart),
          label: 'Progress',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          activeIcon: Icon(Icons.person),
          label: 'Profile',
        ),
      ],
      currentIndex: _selectedIndex,
      selectedItemColor: primaryGreen,
      unselectedItemColor: greyText,
      onTap: _onItemTapped,
      type: BottomNavigationBarType.fixed,
      showUnselectedLabels: true,
      elevation: 5,
    );
  }
}