// lib/pose_analyzer.dart

import 'dart:math';
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';

// An abstract class that defines the structure for all our exercise analyzers
abstract class PoseAnalyzer {
  int get repCount => 0; // Primary count (e.g., perfect reps, distance placeholder)
  int get wrongRepCount => 0; // Secondary count (e.g., wrong form reps, time placeholder)
  bool get formIsCorrect => true; // Is the current form correct?
  String get stage => ""; // The current stage of the exercise (e.g., "up" or "down")
  String get feedback => "Analyzing..."; // Live text feedback

  // This method will be implemented by each specific exercise analyzer
  void processPose(Pose pose);
}

// Helper function to calculate joint angle
double calculateAngle(PoseLandmark first, PoseLandmark middle, PoseLandmark last) {
  final radians = atan2(last.y - middle.y, last.x - middle.x) -
      atan2(first.y - middle.y, first.x - middle.x);
  double angle = (radians * 180.0 / pi).abs();

  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}

// --- Placeholder for tests without direct real-time pose-based counting ---
// These analyzers will allow the CameraScreen flow, but indicate no AI counting
class NoAIAnalyzer extends PoseAnalyzer {
  @override
  String get feedback => "No real-time AI counting for this test yet.";
  @override
  void processPose(Pose pose) {
    // No specific pose processing for counting reps
  }
}

// --- Specific Analyzer for Push-ups ---
class PushUpAnalyzer extends PoseAnalyzer {
  @override
  int repCount = 0;
  @override
  int wrongRepCount = 0;
  @override
  String stage = 'up';
  @override
  bool formIsCorrect = false;
  @override
  String feedback = "Start your Push-ups!";

  @override
  void processPose(Pose pose) {
    final landmarks = pose.landmarks;
    formIsCorrect = false;

    try {
      final leftShoulder = landmarks[PoseLandmarkType.leftShoulder]!;
      final leftElbow = landmarks[PoseLandmarkType.leftElbow]!;
      final leftWrist = landmarks[PoseLandmarkType.leftWrist]!;
      final leftHip = landmarks[PoseLandmarkType.leftHip]!;
      final leftAnkle = landmarks[PoseLandmarkType.leftAnkle]!;

      final elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      final bodyAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);

      // Simple body straightness check
      bool bodyIsStraight = bodyAngle > 160; // Hip-shoulder-ankle angle close to 180

      if (elbowAngle < 90) { // Arm bent = going down
        stage = "down";
        if (bodyIsStraight) {
          formIsCorrect = true;
          feedback = "Go down, keep body straight.";
        } else {
          feedback = "Keep your body straight!";
        }
      }

      if (elbowAngle > 160 && stage == "down") { // Arm straight = coming up
        stage = "up";
        if (bodyIsStraight) {
          repCount++;
          formIsCorrect = true;
          feedback = "Rep ${repCount} - Good Form!";
        } else {
          wrongRepCount++;
          feedback = "Rep ${repCount + wrongRepCount} - Form Error: Keep body straight!";
        }
      } else if (elbowAngle > 160 && stage == "up") {
        feedback = "Push up, ready for next rep!";
        formIsCorrect = true; // Still good form if staying up straight
      }

    } catch (e) {
      feedback = "Adjust camera. Ensure full body is visible.";
    }
  }
}

// --- Specific Analyzer for Sit-ups ---
class SitUpAnalyzer extends PoseAnalyzer {
  @override
  int repCount = 0;
  @override
  int wrongRepCount = 0;
  @override
  String stage = 'down';
  @override
  bool formIsCorrect = false;
  @override
  String feedback = "Start your Sit-ups!";

  @override
  void processPose(Pose pose) {
    final landmarks = pose.landmarks;

    try {
      final leftShoulder = landmarks[PoseLandmarkType.leftShoulder]!;
      final leftHip = landmarks[PoseLandmarkType.leftHip]!;
      final leftKnee = landmarks[PoseLandmarkType.leftKnee]!;

      final hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee); // Angle of torso to thigh

      // Criteria for good form (simplified for demo)
      bool goodUpperBodyMovement = hipAngle < 100; // Torso closer to thighs for "up"
      bool goodLowerBodyStability = calculateAngle(landmarks[PoseLandmarkType.leftKnee]!, leftHip, landmarks[PoseLandmarkType.leftAnkle]!) > 140; // Maintain knee bend

      if (hipAngle > 150) { // Torso is down
        stage = "down";
        formIsCorrect = true;
        feedback = "Lie down completely.";
      }

      if (hipAngle < 100 && stage == "down") { // Torso is up and coming from down stage
        stage = "up";
        if (goodUpperBodyMovement && goodLowerBodyStability) {
          repCount++;
          formIsCorrect = true;
          feedback = "Rep ${repCount} - Good Sit-up!";
        } else {
          wrongRepCount++;
          feedback = "Form Error: Go higher or keep legs stable!";
        }
      } else if (hipAngle < 100 && stage == "up") {
        feedback = "Hold or go down slowly."; // If still up
        formIsCorrect = true;
      }

    } catch (e) {
      feedback = "Adjust camera. Ensure full body is visible.";
    }
  }
}

// --- Specific Analyzer for Squats ---
class SquatAnalyzer extends PoseAnalyzer {
  @override
  int repCount = 0;
  @override
  int wrongRepCount = 0;
  @override
  String stage = 'up';
  @override
  bool formIsCorrect = false;
  @override
  String feedback = "Start your Squats!";

  @override
  void processPose(Pose pose) {
    final landmarks = pose.landmarks;

    try {
      final leftHip = landmarks[PoseLandmarkType.leftHip]!;
      final leftKnee = landmarks[PoseLandmarkType.leftKnee]!;
      final leftAnkle = landmarks[PoseLandmarkType.leftAnkle]!;

      final kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle); // Angle of thigh to shin
      final hipKneeAlignment = landmarks[PoseLandmarkType.leftHip]!.y < landmarks[PoseLandmarkType.leftKnee]!.y; // Hip below knee for deep squat

      if (kneeAngle > 160) { // Standing up
        stage = "up";
        formIsCorrect = true;
        feedback = "Stand up straight, prepare to squat.";
      }

      if (kneeAngle < 100 && stage == "up") { // Squatting down
        stage = "down";
        if (hipKneeAlignment) { // Hip below knee check
          repCount++;
          formIsCorrect = true;
          feedback = "Rep ${repCount} - Deep Squat!";
        } else {
          wrongRepCount++;
          feedback = "Form Error: Squat deeper!";
        }
      } else if (kneeAngle < 100 && stage == "down") {
        feedback = "Hold the squat or rise up.";
        formIsCorrect = true;
      }

    } catch (e) {
      feedback = "Adjust camera. Ensure full body is visible.";
    }
  }
}

// --- Specific Analyzer for Standing Broad Jump (Focus on take-off/landing detection) ---
class StandingBroadJumpAnalyzer extends PoseAnalyzer {
  @override
  int repCount = 0; // Can represent 'jumps detected'
  @override
  String stage = 'standing'; // standing -> jumping -> landing -> standing
  @override
  String feedback = "Stand still, prepare to jump!";

  // This is a simplified detection. Actual distance requires more advanced image processing.
  // This will detect the *event* of a jump.
  @override
  void processPose(Pose pose) {
    final landmarks = pose.landmarks;
    try {
      final leftKnee = landmarks[PoseLandmarkType.leftKnee]!;
      final leftAnkle = landmarks[PoseLandmarkType.leftAnkle]!;
      final leftHip = landmarks[PoseLandmarkType.leftHip]!;

      // Check for squat down before jump
      final kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

      // Simple Z-axis movement for jump detection (requires depth, or heuristic for vertical motion)
      // For a basic demo, we'll look for quick knee angle change
      if (stage == 'standing' && kneeAngle < 120) { // Squatting
        stage = 'pre-jump';
        feedback = "Squatting down...";
      } else if (stage == 'pre-jump' && kneeAngle > 160) { // Suddenly extending
        stage = 'jumping';
        feedback = "Jumping!";
      } else if (stage == 'jumping' && landmarks[PoseLandmarkType.leftFootIndex]!.y > (landmarks[PoseLandmarkType.leftHip]!.y - 100) ) { // Feet back on ground (heuristic)
        stage = 'landing';
        feedback = "Landing!";
      } else if (stage == 'landing' && kneeAngle > 160) { // Standing up after landing
        stage = 'standing';
        repCount++;
        feedback = "Jump ${repCount} completed!";
      }

    } catch (e) {
      feedback = "Adjust camera. Ensure full body is visible.";
    }
  }
}


// --- Specific Analyzer for Standing Vertical Jump (Focus on jump height estimation) ---
class StandingVerticalJumpAnalyzer extends PoseAnalyzer {
  @override
  int repCount = 0; // Represents successful jumps
  @override
  String stage = 'standing'; // standing -> jumping -> airborne -> landing
  @override
  String feedback = "Stand tall, prepare to jump!";

  double _maxJumpHeight = 0; // Placeholder for estimated height
  double _standingReachY = 0; // Y-coordinate of highest point when standing
  double _peakJumpY = 0; // Y-coordinate of highest point during jump

  @override
  void processPose(Pose pose) {
    final landmarks = pose.landmarks;
    try {
      final leftHip = landmarks[PoseLandmarkType.leftHip]!;
      final leftAnkle = landmarks[PoseLandmarkType.leftAnkle]!;
      final leftWrist = landmarks[PoseLandmarkType.leftWrist]!;

      // Use wrist for reach estimation
      final currentReachY = leftWrist.y; // Lower Y is higher on screen

      // Set standing reach initially
      if (_standingReachY == 0) {
        _standingReachY = currentReachY;
      }

      if (stage == 'standing' && leftHip.y > (landmarks[PoseLandmarkType.leftKnee]!.y + 50)) { // Detect initial squat/crouch
        stage = 'pre-jump';
        feedback = "Crouching...";
      } else if (stage == 'pre-jump' && leftAnkle.y < landmarks[PoseLandmarkType.leftHip]!.y) { // Detect body moving upwards
        stage = 'airborne';
        _peakJumpY = currentReachY; // Reset peak for this jump
        feedback = "Jumping!";
      } else if (stage == 'airborne') {
        // Track the highest point reached during the jump (lowest Y value)
        if (currentReachY < _peakJumpY) {
          _peakJumpY = currentReachY;
        }
        // If feet are back on the ground, assume landing
        if (leftAnkle.y > landmarks[PoseLandmarkType.leftHip]!.y - 20) { // Heuristic: Ankle below hip (roughly on ground)
          stage = 'landing';
          feedback = "Landing...";
        }
      } else if (stage == 'landing') {
        // Calculate estimated jump height (this needs proper pixel to cm/inch conversion)
        // For now, just a proportional difference
        double jumpHeightPixels = _standingReachY - _peakJumpY;
        // You'd convert pixels to a real unit here, e.g., jumpHeightPixels * (real_height_of_person / total_body_pixels)
        if (jumpHeightPixels > _maxJumpHeight) {
          _maxJumpHeight = jumpHeightPixels; // Track the best jump
        }
        repCount++;
        feedback = "Jump ${repCount} detected. Max height: ${_maxJumpHeight.toStringAsFixed(1)}px"; // Display in pixels for now
        stage = 'standing'; // Ready for next jump
      }

    } catch (e) {
      feedback = "Adjust camera. Ensure full body is visible.";
    }
  }

  // Add a way to get the final estimated height
  double get estimatedJumpHeight => _maxJumpHeight;
}

// --- Specific Analyzer for Medicine Ball Throw (Placeholder) ---
// AI analysis for this would require detecting the ball and its trajectory,
// which is beyond simple pose detection. This is a placeholder.
class MedicineBallThrowAnalyzer extends PoseAnalyzer {
  @override
  String feedback = "Prepare to throw!";
  @override
  void processPose(Pose pose) {
    // Pose detection can track thrower's form, but not ball distance.
    // This could be extended to check arm extension, hip rotation etc.
    feedback = "Tracking form. Distance needs external measurement.";
  }
}

// --- Specific Analyzer for 30mts Standing Start (Placeholder) ---
// Speed tests are challenging with just pose detection. Requires object tracking
// for start/finish lines or accelerometer data.
class SprintAnalyzer extends PoseAnalyzer {
  @override
  String feedback = "Ready to sprint!";
  @override
  void processPose(Pose pose) {
    feedback = "Detecting start. Timer needed.";
  }
}

// --- Specific Analyzer for 4*10mts Shuttle Run (Placeholder) ---
// Similar to sprint, requires detecting touch points at markers and timing.
class ShuttleRunAnalyzer extends PoseAnalyzer {
  @override
  String feedback = "Prepare for shuttle run!";
  @override
  void processPose(Pose pose) {
    feedback = "Detecting movement. Requires touch detection at markers.";
  }
}

// --- Specific Analyzer for 800mts / 1.6km Run (Placeholder) ---
// Endurance runs need GPS or advanced tracking. Pose detection can monitor running form.
class EnduranceRunAnalyzer extends PoseAnalyzer {
  @override
  String feedback = "Start running!";
  @override
  void processPose(Pose pose) {
    feedback = "Monitoring running form...";
  }
}

// --- Specific Analyzer for Sit and Reach (Placeholder) ---
// This test is about reaching distance. Pose detection can track arm extension
// but measuring "reach" accurately often needs a reference object or depth.
class SitAndReachAnalyzer extends PoseAnalyzer {
  @override
  String feedback = "Reach forward as far as you can!";
  @override
  void processPose(Pose pose) {
    // You could detect body parts:
    // final leftWrist = pose.landmarks[PoseLandmarkType.leftWrist]!;
    // final rightWrist = pose.landmarks[PoseLandmarkType.rightWrist]!;
    // You'd need a way to calibrate the screen to real-world distance.
    feedback = "Analyzing reach. Need reference for accurate distance.";
  }
}