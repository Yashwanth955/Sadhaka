import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

// Imports for navigation and database services
import 'home_screen.dart';
import 'tests_screen.dart';
import 'profile_screen.dart';
import 'isar_service.dart';
import 'test_result.dart';

class ProgressScreen extends StatefulWidget {
  const ProgressScreen({super.key});

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  int _selectedTabIndex = 0; // 0 for Reports, 1 for Progress

  @override
  Widget build(BuildContext context) {
    const lightBg = Color(0xFFF9F9F9);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Progress',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Custom Tab Bar
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: lightBg,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                _buildTabItem(text: 'Reports', index: 0),
                _buildTabItem(text: 'Progress', index: 1),
              ],
            ),
          ),
          // Tab Content
          Expanded(
            child: _selectedTabIndex == 0
                ? const ReportsTabView()
                : const ProgressTabView(),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNavBar(context),
    );
  }

  Widget _buildTabItem({required String text, required int index}) {
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
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isSelected
                ? [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 5)]
                : [],
          ),
          child: Text(
            text,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: Colors.black,
            ),
          ),
        ),
      ),
    );
  }
}

// --- TAB VIEW WIDGETS ---

class ProgressTabView extends StatelessWidget {
  const ProgressTabView({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF20D36A);
    final isarService = IsarService();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF9F9F9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Overall Progress', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                LinearProgressIndicator(
                  value: 0.7,
                  backgroundColor: Colors.grey.shade300,
                  color: primaryGreen,
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(5),
                ),
                const SizedBox(height: 8),
                const Text('Level 3', style: TextStyle(color: Colors.grey)),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // --- Recommended Sports Section ---
          _buildRecommendedSportsSection(),
          const SizedBox(height: 24),

          const Text('Achievements', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          SizedBox(
            height: 150,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildAchievementCard('https://i.imgur.com/8m52eSO.png', 'Speed Demon'),
                _buildAchievementCard('https://i.imgur.com/bT6R022.png', 'Endurance Master'),
                _buildAchievementCard('https://i.imgur.com/k2p8J5F.png', 'Flexibility Pro'),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const Text('Recent Tests', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          FutureBuilder<List<TestResult>>(
            future: isarService.getAllTestResults(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                final testResults = snapshot.data!;
                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: testResults.length,
                  itemBuilder: (context, index) {
                    final result = testResults[index];
                    return _buildRecentTestItem(
                        result.testTitle,
                        '${result.date.year}-${result.date.month}-${result.date.day}',
                        result.resultValue);
                  },
                );
              }
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(20.0),
                  child: Text('No saved test results yet.'),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendedSportsSection() {
    // Dummy data for recommended sports
    final sports = [
      {'name': 'Swimming', 'reason': 'Excellent Endurance', 'image': 'https://images.unsplash.com/photo-1569911483321-3443a3e0f49a?q=80&w=2070'},
      {'name': 'Weightlifting', 'reason': 'Great Strength', 'image': 'https://images.unsplash.com/photo-1581009137042-c552b485697a?q=80&w=2070'},
      {'name': 'Sprinting', 'reason': 'Top-tier Speed', 'image': 'https://images.unsplash.com/photo-1508924329642-33d3d37a1a45?q=80&w=2070'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Recommended Sports', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const Text('Based on your excellent fitness results', style: TextStyle(color: Colors.grey)),
        const SizedBox(height: 16),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: sports.length,
            itemBuilder: (context, index) {
              return _buildSportCard(
                name: sports[index]['name']!,
                reason: sports[index]['reason']!,
                imageUrl: sports[index]['image']!,
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSportCard({required String name, required String reason, required String imageUrl}) {
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.only(right: 16),
      child: Container(
        width: 180,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: NetworkImage(imageUrl),
            fit: BoxFit.cover,
            colorFilter: ColorFilter.mode(Colors.black.withOpacity(0.4), BlendMode.darken),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(name, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              Text(reason, style: TextStyle(color: Colors.white.withOpacity(0.8))),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () {},
                style: TextButton.styleFrom(
                  backgroundColor: Colors.white.withOpacity(0.2),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('View Details'),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAchievementCard(String imageUrl, String title) {
    return Container(
      width: 120,
      margin: const EdgeInsets.only(right: 12),
      child: Column(
        children: [
          Container(
            height: 120,
            width: 120,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E1E),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Image.network(imageUrl),
          ),
          const SizedBox(height: 8),
          Text(title, textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildRecentTestItem(String title, String date, String result) {
    const primaryGreen = Color(0xFF20D36A);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text(date, style: const TextStyle(color: primaryGreen, fontSize: 14)),
              ],
            ),
          ),
          Text(result, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class ReportsTabView extends StatelessWidget {
  const ReportsTabView({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF20D36A);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: _buildStatCard('Best Score', '95')),
              const SizedBox(width: 16),
              Expanded(child: _buildStatCard('Total Tests Taken', '12')),
            ],
          ),
          const SizedBox(height: 16),
          _buildStatCard('Avg. Improvement', '+15%', isFullWidth: true),
          const SizedBox(height: 24),
          const Text('Performance Over Time', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const Text('+10%', style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          SizedBox(height: 150, child: LineChart(mainData())),
          const SizedBox(height: 24),
          const Text('Last 3 Attempts Comparison', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const Text('+5%', style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          SizedBox(height: 150, child: BarChart(barData())),
          const SizedBox(height: 24),
          const Text('Detailed Report Card', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          _buildReportCardItem(Icons.run_circle_outlined, 'Speed: 9.5/10', 'Excellent', Colors.green),
          _buildReportCardItem(Icons.timer_outlined, 'Endurance: 7.2/10', 'Needs Improvement', Colors.orange),
          _buildReportCardItem(Icons.star_outline, 'Flexibility: 5.8/10', 'Critical', Colors.red),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(child: OutlinedButton(onPressed: () {}, child: const Text('Download Report'))),
              const SizedBox(width: 16),
              Expanded(child: ElevatedButton(onPressed: () {}, style: ElevatedButton.styleFrom(backgroundColor: primaryGreen, foregroundColor: Colors.white), child: const Text('Share with Coach'))),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, {bool isFullWidth = false}) {
    return Container(
      width: isFullWidth ? double.infinity : null,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF9F9F9),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildReportCardItem(IconData icon, String title, String subtitle, Color dotColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(children: [
        Icon(icon, color: Colors.grey.shade600),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            Text(subtitle, style: const TextStyle(color: Colors.grey)),
          ],
        ),
        const Spacer(),
        Container(width: 10, height: 10, decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle)),
      ]),
    );
  }

  LineChartData mainData() {
    return LineChartData(
      gridData: const FlGridData(show: false),
      titlesData: const FlTitlesData(show: false),
      borderData: FlBorderData(show: false),
      lineBarsData: [
        LineChartBarData(
          spots: const [
            FlSpot(0, 3), FlSpot(1, 4), FlSpot(2, 3.5), FlSpot(3, 5),
            FlSpot(4, 4), FlSpot(5, 6), FlSpot(6, 6.5), FlSpot(7, 6),
            FlSpot(8, 4), FlSpot(9, 5), FlSpot(10, 4.5), FlSpot(11, 5.5),
          ],
          isCurved: true,
          color: const Color(0xFF20D36A),
          barWidth: 4,
          isStrokeCapRound: true,
          dotData: const FlDotData(show: false),
          belowBarData: BarAreaData(
            show: true,
            gradient: LinearGradient(
              colors: [const Color(0xFF20D36A).withOpacity(0.3), const Color(0xFF20D36A).withOpacity(0.0)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ),
      ],
    );
  }

  BarChartData barData() {
    return BarChartData(
      alignment: BarChartAlignment.spaceAround,
      barTouchData: BarTouchData(enabled: false),
      titlesData: const FlTitlesData(show: false),
      borderData: FlBorderData(show: false),
      gridData: const FlGridData(show: false),
      barGroups: [
        BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 5, color: Colors.grey.shade300, width: 25, borderRadius: BorderRadius.circular(4))]),
        BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 6.5, color: Colors.grey.shade300, width: 25, borderRadius: BorderRadius.circular(4))]),
        BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: 8, color: Colors.grey.shade300, width: 25, borderRadius: BorderRadius.circular(4))]),
      ],
    );
  }
}

// Navigation Bar
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
        Navigator.push(context, MaterialPageRoute(builder: (context) => const ProfileScreen()));
        break;
    }
  }

  return BottomNavigationBar(
    currentIndex: 2,
    onTap: handleNavBarTap,
    selectedItemColor: primaryGreen,
    unselectedItemColor: Colors.grey.shade600,
    type: BottomNavigationBarType.fixed,
    showUnselectedLabels: true,
    items: const [
      BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
      BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: 'Tests'),
      BottomNavigationBarItem(icon: Icon(Icons.show_chart), label: 'Progress'),
      BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
    ],
  );
}