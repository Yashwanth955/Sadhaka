// lib/pdf_generator.dart

import 'package:flutter/foundation.dart'; // For kDebugMode
import 'package:pdf/pdf.dart' as pdf_package;
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'report_models.dart';

class PdfGenerator {
  static Future<bool> generateAndShareReport(TestReport reportData) async {
    try {
      final pdf = pw.Document();

      // Use PdfGoogleFonts from the printing package
      final font = await PdfGoogleFonts.notoColorEmoji();
      final regularFont = await PdfGoogleFonts.poppinsRegular();

      // --- Build the PDF Document ---
      pdf.addPage(
        pw.Page(
          build: (pw.Context context) {
            return pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                // Header
                pw.Text('SAI Fitness - Test Report', style: pw.TextStyle(font: regularFont, fontSize: 24, fontWeight: pw.FontWeight.bold)),
                pw.Divider(thickness: 2),
                pw.SizedBox(height: 20),

                // Test Title
                pw.Text(reportData.testTitle, style: pw.TextStyle(font: regularFont, fontSize: 20, fontWeight: pw.FontWeight.bold)),
                pw.SizedBox(height: 10),

                // Headline Result
                pw.Text(reportData.headlineResult, style: pw.TextStyle(font: regularFont, fontSize: 18, color: pdf_package.PdfColors.green)),
                pw.Text(reportData.resultSummary, style: pw.TextStyle(font: regularFont, fontStyle: pw.FontStyle.italic)),
                pw.SizedBox(height: 20),

                // Breakdown Section
                pw.Text('Breakdown', style: pw.TextStyle(font: regularFont, fontSize: 16, fontWeight: pw.FontWeight.bold)),
                pw.Table.fromTextArray(
                  headerStyle: pw.TextStyle(font: regularFont, fontWeight: pw.FontWeight.bold),
                  cellStyle: pw.TextStyle(font: regularFont),
                  data: reportData.breakdownMetrics.map((m) => [m.label, m.value]).toList(),
                ),
                pw.SizedBox(height: 20),

                // Coach Mode Section
                pw.Text('Coach Mode: Tips to Improve', style: pw.TextStyle(font: regularFont, fontSize: 16, fontWeight: pw.FontWeight.bold)),
                ...reportData.coachTips.map((tip) => pw.Row(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('• ', style: pw.TextStyle(font: font, fontSize: 16)), // Use emoji font for bullet
                      pw.Expanded(
                        child: pw.Text('${tip.title}: ${tip.description}', style: pw.TextStyle(font: regularFont)),
                      )
                    ]
                )),
              ],
            );
          },
        ),
      );

      // Use the 'printing' package to generate and share the PDF
      final bool shared = await Printing.sharePdf(
        bytes: await pdf.save(),
        filename: '${reportData.testTitle.replaceAll(' ', '_')}_Report.pdf',
      );
      return shared;
    } catch (e) {
      if (kDebugMode) {
        print('Error generating or sharing PDF: $e');
      }
      return false;
    }
  }
}
