// lib/report_models.dart

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

// A single metric for the breakdown/analysis sections
class ReportMetric {
  final String label;
  final String value;

  ReportMetric({required this.label, required this.value});
}

// A tip for the "Coach Mode" section
class CoachTip {
  final IconData icon;
  final String title;
  final String description;

  CoachTip({required this.icon, required this.title, required this.description});
}

// The main data model for the entire report screen
class TestReport {
  final String testTitle;
  final String imageUrl;
  final String headlineResult;
  final String resultSummary;
  final List<ReportMetric> breakdownMetrics;
  final List<ReportMetric> comparisonMetrics;
  final List<CoachTip> coachTips;
  final String progressTitle;
  final String progressValue;
  final String progressPeriod;
  final String progressTrend;
  final List<FlSpot> progressChartData; // Using FlSpot for a line chart

  TestReport({
    required this.testTitle,
    required this.imageUrl,
    required this.headlineResult,
    required this.resultSummary,
    required this.breakdownMetrics,
    required this.comparisonMetrics,
    required this.coachTips,
    required this.progressTitle,
    required this.progressValue,
    required this.progressPeriod,
    required this.progressTrend,
    required this.progressChartData,
  });
}