// lib/report_data.dart

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'report_models.dart';

// Sample data for the Push-ups Test Report
final pushupReportData = TestReport(
  testTitle: 'Push-ups Test',
  imageUrl: 'https://i.imgur.com/J8z2J3G.png', // Placeholder illustration
  headlineResult: 'Excellent',
  resultSummary: 'You completed 25 push-ups with perfect form. Your posture was validated by our AI, ensuring each repetition was effective and safe.',
  breakdownMetrics: [
    ReportMetric(label: 'Total Repetitions', value: '25'),
    ReportMetric(label: 'Posture Validation', value: 'Perfect'),
    ReportMetric(label: 'Range of Motion', value: 'Full'),
  ],
  comparisonMetrics: [
    ReportMetric(label: 'Compared to your age group', value: 'Top 10%'),
  ],
  coachTips: [
    CoachTip(icon: Icons.fitness_center, title: 'Controlled Movements', description: 'To maintain your excellent form and increase repetitions, focus on controlled movements and consistent practice.'),
    CoachTip(icon: Icons.diamond_outlined, title: 'Variations', description: 'Consider incorporating variations like diamond push-ups for targeted muscle engagement.'),
  ],
  progressTitle: 'Push-ups',
  progressValue: '25',
  progressPeriod: 'Last 7 Days',
  progressTrend: '',
  progressChartData: [ // Dummy data for 7 days
    const FlSpot(0, 22), const FlSpot(1, 24), const FlSpot(2, 23),
    const FlSpot(3, 25), const FlSpot(4, 24), const FlSpot(5, 25),
    const FlSpot(6, 25),
  ],
);

// Sample data for the 1.6km Run Test Report
final runReportData = TestReport(
  testTitle: '1.6km Run Test',
  imageUrl: 'https://i.imgur.com/eYn6p5A.png', // Placeholder
  headlineResult: '1.6km Run',
  resultSummary: 'Time: 5:45 min\nDistance: 1.6 km',
  breakdownMetrics: [
    ReportMetric(label: 'Average Pace', value: '3:35 min/km'),
    ReportMetric(label: 'Cadence', value: '170 steps/min'),
    ReportMetric(label: 'Stride Length', value: '1.2 m'),
    ReportMetric(label: 'Heart Rate', value: '165 bpm'),
  ],
  comparisonMetrics: [
    ReportMetric(label: 'Your performance is above average for your age group (12+).', value: ''),
  ],
  coachTips: [
    CoachTip(icon: Icons.timer_outlined, title: 'Pacing Strategy', description: 'Focus on maintaining a consistent pace throughout the run.'),
    CoachTip(icon: Icons.show_chart, title: 'Interval Training', description: 'Incorporate interval training to improve your speed and endurance.'),
    CoachTip(icon: Icons.edit_outlined, title: 'Stride Efficiency', description: 'Work on increasing your stride length for more efficient running.'),
  ],
  progressTitle: '1.6km Run Time',
  progressValue: '5:45 min',
  progressPeriod: 'Last 30 Days',
  progressTrend: '-5%',
  progressChartData: [ // Dummy data for 4 weeks
    const FlSpot(0, 360), const FlSpot(1, 355), const FlSpot(2, 350), const FlSpot(3, 345),
  ],
);

// Add more sample data objects for other tests here...