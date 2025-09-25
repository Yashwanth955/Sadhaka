// lib/pose_painter.dart

import 'package:flutter/material.dart';
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';
import 'package:camera/camera.dart'; // Added this line

class PosePainter extends CustomPainter {
  final List<Pose> poses;
  final Size imageSize;
  final InputImageRotation imageRotation;
  final bool formIsCorrect;
  final CameraLensDirection cameraLensDirection; // To handle mirroring

  PosePainter(
      this.poses,
      this.imageSize,
      this.imageRotation, {
        required this.formIsCorrect,
        this.cameraLensDirection = CameraLensDirection.back, // Default to back
      });

  @override
  void paint(Canvas canvas, Size size) {
    // UPDATED: Thinner lines and smaller dots for a cleaner look
    final paint = Paint()
      ..color = formIsCorrect ? Colors.greenAccent : Colors.redAccent
      ..strokeWidth = 3 // Thinner lines
      ..strokeCap = StrokeCap.round;

    // final dotPaint = Paint() // Removed this unused variable
    //   ..color = formIsCorrect ? Colors.greenAccent : Colors.redAccent
    //   ..strokeWidth = 6 // Smaller dots
    //   ..strokeCap = StrokeCap.round;

    for (final pose in poses) {
      // CORRECTED: This scaling logic is more robust and handles camera mirroring
      Offset scale(double x, double y) {
        final double scaleX = size.width / imageSize.height;
        final double scaleY = size.height / imageSize.width;
        final double scale = scaleX < scaleY ? scaleX : scaleY;

        final double offsetX = (size.width - imageSize.height * scale) / 2;
        final double offsetY = (size.height - imageSize.width * scale) / 2;

        double scaledX = x * scale + offsetX;

        // Flip the X-coordinate if using the front camera
        if (cameraLensDirection == CameraLensDirection.front) {
          scaledX = size.width - scaledX;
        }

        return Offset(scaledX, y * scale + offsetY);
      }

      void drawLine(PoseLandmarkType type1, PoseLandmarkType type2) {
        final landmark1 = pose.landmarks[type1];
        final landmark2 = pose.landmarks[type2];
        if (landmark1 != null && landmark2 != null) {
          canvas.drawLine(scale(landmark1.x, landmark1.y), scale(landmark2.x, landmark2.y), paint);
        }
      }

      // Draw lines for the torso
      drawLine(PoseLandmarkType.leftShoulder, PoseLandmarkType.rightShoulder);
      drawLine(PoseLandmarkType.leftHip, PoseLandmarkType.rightHip);
      drawLine(PoseLandmarkType.leftShoulder, PoseLandmarkType.leftHip);
      drawLine(PoseLandmarkType.rightShoulder, PoseLandmarkType.rightHip);

      // Draw lines for the arms
      drawLine(PoseLandmarkType.leftShoulder, PoseLandmarkType.leftElbow);
      drawLine(PoseLandmarkType.leftElbow, PoseLandmarkType.leftWrist);
      drawLine(PoseLandmarkType.rightShoulder, PoseLandmarkType.rightElbow);
      drawLine(PoseLandmarkType.rightElbow, PoseLandmarkType.rightWrist);

      // Draw lines for the legs
      drawLine(PoseLandmarkType.leftHip, PoseLandmarkType.leftKnee);
      drawLine(PoseLandmarkType.leftKnee, PoseLandmarkType.leftAnkle);
      drawLine(PoseLandmarkType.rightHip, PoseLandmarkType.rightKnee);
      drawLine(PoseLandmarkType.rightKnee, PoseLandmarkType.rightAnkle);
    }
  }

  @override
  bool shouldRepaint(covariant PosePainter oldDelegate) {
    return oldDelegate.poses != poses ||
        oldDelegate.formIsCorrect != formIsCorrect ||
        oldDelegate.imageSize != imageSize ||
        oldDelegate.imageRotation != imageRotation;
  }
}
