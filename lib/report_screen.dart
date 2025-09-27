import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'report_models.dart';
import 'pdf_generator.dart'; // Make sure this is imported

// Imports for navigation and database services
import 'home_screen.dart';
import 'tests_screen.dart';
import 'progress_screen.dart';
import 'profile_screen.dart';
import 'isar_service.dart';
import 'test_result.dart';
import 'matching_service.dart';

const primaryGreen = Color(0xFF20D36A);
const lightGreyButton = Color(0xFFF0F0F0);

class ReportScreen extends StatelessWidget {
  final TestReport reportData;

  const ReportScreen({super.key, required this.reportData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          reportData.testTitle,
          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildResultsHeader(
              imageUrl: reportData.imageUrl,
              headline: reportData.headlineResult,
              summary: reportData.resultSummary,
            ),
            const SizedBox(height: 24),
            _buildSection(title: 'Breakdown', metrics: reportData.breakdownMetrics),
            const SizedBox(height: 24),
            _buildSection(title: 'Comparison', metrics: reportData.comparisonMetrics),
            const SizedBox(height: 24),
            _buildCoachModeSection(tips: reportData.coachTips),
            const SizedBox(height: 24),
            _buildProgressSection(
              title: reportData.progressTitle,
              value: reportData.progressValue,
              period: reportData.progressPeriod,
              trend: reportData.progressTrend,
              chartData: reportData.progressChartData,
            ),
            const SizedBox(height: 32),
            _buildActionButtons(context, reportData),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 1, // Tests Tab
        selectedItemColor: primaryGreen,
        unselectedItemColor: Colors.grey.shade600,
        onTap: (index) {
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

  // --- WIDGET BUILDER METHODS ---

  Widget _buildResultsHeader({required String imageUrl, required String headline, required String summary}) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFF9F9F9),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Image.network(imageUrl, height: 150),
        ),
        const SizedBox(height: 16),
        Text(headline, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(summary, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade700, fontSize: 16)),
      ],
    );
  }

  Widget _buildSection({required String title, required List<ReportMetric> metrics}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Divider(),
        ...metrics.map((metric) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(metric.label, style: TextStyle(color: Colors.grey.shade700, fontSize: 16)),
              Text(metric.value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ],
          ),
        )),
      ],
    );
  }

  Widget _buildCoachModeSection({required List<CoachTip> tips}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Coach Mode: Tips to Improve', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ...tips.map((tip) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(tip.icon, color: primaryGreen),
              const SizedBox(width: 12),
              Expanded(child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(tip.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(tip.description, style: TextStyle(color: Colors.grey.shade700)),
                ],
              ))
            ],
          ),
        ))
      ],
    );
  }

  Widget _buildProgressSection({
    required String title, required String value, required String period, required String trend, required List<FlSpot> chartData}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Progress', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _buildSegment('Day', isSelected: true)),
            Expanded(child: _buildSegment('Week', isSelected: false)),
          ],
        ),
        const SizedBox(height: 16),
        Text(title, style: const TextStyle(color: Colors.grey, fontSize: 16)),
        Row(
          children: [
            Text(value, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(width: 8),
            Text('$period $trend', style: const TextStyle(color: Colors.grey)),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(height: 150, child: LineChart(_buildChartData(chartData))),
      ],
    );
  }

  Widget _buildSegment(String text, {required bool isSelected}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
          color: isSelected ? Colors.grey.shade200 : Colors.transparent,
          borderRadius: BorderRadius.circular(8)
      ),
      child: Text(text, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold)),
    );
  }

  LineChartData _buildChartData(List<FlSpot> spots) {
    return LineChartData(
      gridData: const FlGridData(show: false),
      titlesData: const FlTitlesData(show: false),
      borderData: FlBorderData(show: false),
      lineBarsData: [
        LineChartBarData(
          spots: spots,
          isCurved: true,
          color: primaryGreen,
          barWidth: 4,
          isStrokeCapRound: true,
          dotData: const FlDotData(show: false),
          belowBarData: BarAreaData(show: false),
        ),
      ],
    );
  }

  // UPDATED: This widget now correctly saves the dynamic results and triggers matching
  Widget _buildActionButtons(BuildContext context, TestReport reportData) {
    final isarService = IsarService();

    return Column(
      children: [
        Row(
          children: [
            Expanded(child: ElevatedButton(onPressed: (){
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => const TestsScreen()),
                    (route) => false,
              );
            }, style: ElevatedButton.styleFrom(backgroundColor: primaryGreen, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 12)), child: const Text('Retake Test'))),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton(
                onPressed: () async { // Make the function async
                  // Create a TestResult object with the actual analyzed data
                  final newResult = TestResult()
                    ..testTitle = reportData.testTitle
                    ..resultValue = reportData.headlineResult // Use the main result (e.g., "25 Reps")
                    ..date = DateTime.now();

                  await isarService.saveTestResult(newResult);

                  // NEW: Run the matching service after saving a result
                  await MatchingService().findAndSaveMatches();

                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          backgroundColor: Colors.green,
                          content: Text('Result saved and checked for matches!')
                      ),
                    );
                  }
                },
                style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                child: const Text('Save Result'),
              ),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(child: TextButton.icon(
                onPressed: () => PdfGenerator.generateAndShareReport(reportData),
                icon: const Icon(Icons.share_outlined),
                label: const Text('Share'))
            ),
            Expanded(child: TextButton.icon(
                onPressed: () => PdfGenerator.generateAndShareReport(reportData),
                icon: const Icon(Icons.download_outlined),
                label: const Text('Download Report'))
            ),
          ],
        ),
      ],
    );
  }
}