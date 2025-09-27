// lib/pose_analyzer.dart
import 'dart:ui'; // Added this import

import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';

// Abstract base class for all pose analyzers
abstract class PoseAnalyzer {
  int get repCount;
  List<String> getFeedback(); // Renamed from detailedFeedback, changed signature
  bool get formIsCorrect; // Added
  int get wrongRepCount; // Added

  void processPose(Pose pose, Size imageSize);
  void reset();
}

// A default analyzer for tests that don't use AI
class NoAIAnalyzer extends PoseAnalyzer {
  @override
  int get repCount => 0;

  @override
  List<String> getFeedback() => ["This test is manually recorded."]; // Renamed

  @override
  bool get formIsCorrect => true; // Added placeholder

  @override
  int get wrongRepCount => 0; // Added placeholder

  @override
  void processPose(Pose pose, Size imageSize) {
    // No-op
  }

  @override
  void reset() {
    // No-op
  }
}

// --- Flexibility Test ---
class SitAndReachAnalyzer extends PoseAnalyzer {
  @override
  int get repCount => 0; // Not rep-based

  @override
  List<String> getFeedback() => ["Ensure legs are straight.", "Reach forward smoothly."]; // Renamed

  @override
  bool get formIsCorrect => true; // Added placeholder

  @override
  int get wrongRepCount => 0; // Added placeholder

  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for sit-and-reach logic
  }
   @override
  void reset() {}
}

// --- Strength Test ---
class PushUpAnalyzer extends PoseAnalyzer {
  int _reps = 0;
  int _hipDropCount = 0;
  int _elbowFlareCount = 0;

  @override
  int get repCount => _reps;

  @override
  List<String> getFeedback() { // Renamed
     List<String> feedbackPoints = [];
    if (_elbowFlareCount > 2) {
      feedbackPoints.add("Elbows flared out on $_elbowFlareCount reps.");
    }
    if (_hipDropCount > 1) {
      feedbackPoints.add("Hips dropped, breaking core alignment.");
    }
    if (feedbackPoints.isEmpty) {
      feedbackPoints.add("Great form overall!");
    }
    return feedbackPoints;
  }

  @override
  bool get formIsCorrect => _hipDropCount == 0 && _elbowFlareCount == 0; // Example, adjust as needed

  @override
  int get wrongRepCount => _hipDropCount + _elbowFlareCount; // Example, adjust as needed


  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for push-up detection logic
    // e.g., if (isDownPhase && isUpPhase) { _reps++; }
    // if (hipsDropped) _hipDropCount++;
    // if (elbowsFlared) _elbowFlareCount++;
  }
   @override
  void reset() {
    _reps = 0;
    _hipDropCount = 0;
    _elbowFlareCount = 0;
  }
}

// --- Strength Test ---
class SitUpAnalyzer extends PoseAnalyzer {
  int _reps = 0;
  int _formErrorCount = 0; // Example for tracking form errors

  @override
  int get repCount => _reps;

  @override
  List<String> getFeedback() {
    List<String> feedbackPoints = [];
    if (_formErrorCount > 2) {
      feedbackPoints.add("Ensure your feet stay on the ground.");
      feedbackPoints.add("Control the movement, don\'t use momentum.");
    }
    if (feedbackPoints.isEmpty) {
      feedbackPoints.add("Good sit-up form!");
    }
    return feedbackPoints;
  }

  @override
  bool get formIsCorrect => _formErrorCount == 0; // Example

  @override
  int get wrongRepCount => _formErrorCount; // Example

  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for sit-up detection logic
    // e.g., if (isUpPosition && isDownPosition) { _reps++; }
    // if (feetLifted) _formErrorCount++;
  }

  @override
  void reset() {
    _reps = 0;
    _formErrorCount = 0;
  }
}

// --- Strength Test ---
class SquatAnalyzer extends PoseAnalyzer {
  int _reps = 0;
  int _formErrorCount = 0; // Example for tracking form errors like knee valgus or depth

  @override
  int get repCount => _reps;

  @override
  List<String> getFeedback() {
    List<String> feedbackPoints = [];
    if (_formErrorCount > 1) {
      feedbackPoints.add("Ensure your knees track over your toes.");
      feedbackPoints.add("Try to squat deeper, breaking parallel if possible.");
    }
    if (feedbackPoints.isEmpty) {
      feedbackPoints.add("Good squat form!");
    }
    return feedbackPoints;
  }

  @override
  bool get formIsCorrect => _formErrorCount == 0; // Example

  @override
  int get wrongRepCount => _formErrorCount; // Example

  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for squat detection logic
    // e.g., analyze hip, knee, and ankle angles
    // if (isDownPosition && isUpPosition) { _reps++; }
    // if (kneesCaveIn) _formErrorCount++;
  }

  @override
  void reset() {
    _reps = 0;
    _formErrorCount = 0;
  }
}


// --- Power Tests ---
class StandingBroadJumpAnalyzer extends PoseAnalyzer {
  @override
  int get repCount => 0; // Measures distance, not reps

  @override
  List<String> getFeedback() => ["Use a powerful arm swing.", "Land with both feet simultaneously."]; // Renamed

  @override
  bool get formIsCorrect => true; // Added placeholder

  @override
  int get wrongRepCount => 0; // Added placeholder


  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for jump detection and distance estimation
  }
   @override
  void reset() {}
}

class StandingVerticalJumpAnalyzer extends PoseAnalyzer {
  @override
  int get repCount => 0; // Measures height, not reps

  @override
  List<String> getFeedback() => ["Explode upwards from a deep squat.", "Reach as high as possible at the peak."]; // Renamed

  @override
  bool get formIsCorrect => true; // Added placeholder

  @override
  int get wrongRepCount => 0; // Added placeholder


  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for jump height analysis
  }
   @override
  void reset() {}
}

class MedicineBallThrowAnalyzer extends PoseAnalyzer {
  @override
  int get repCount => 0; // Measures distance, not reps

  @override
  List<String> getFeedback() => ["Generate power from your legs and core.", "Throw explosively over your head."]; // Renamed

  @override
  bool get formIsCorrect => true; // Added placeholder

  @override
  int get wrongRepCount => 0; // Added placeholder

  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for throw analysis
  }
   @override
  void reset() {}
}

// --- Speed Test ---
class SprintAnalyzer extends PoseAnalyzer {
  @override
  int get repCount => 0; // Measures time, not reps

  @override
  List<String> getFeedback() => ["Maintain a forward lean.", "Drive your arms and legs powerfully."]; // Renamed

  @override
  bool get formIsCorrect => true; // Added placeholder

  @override
  int get wrongRepCount => 0; // Added placeholder


  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for sprint analysis
  }
   @override
  void reset() {}
}

// --- Agility Test ---
class ShuttleRunAnalyzer extends PoseAnalyzer {
  @override
  int get repCount => 0; // Measures time, not reps

  @override
  List<String> getFeedback() => ["Stay low during turns.", "Change direction quickly and efficiently."]; // Renamed

  @override
  bool get formIsCorrect => true; // Added placeholder

  @override
  int get wrongRepCount => 0; // Added placeholder


  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for shuttle run analysis
  }
   @override
  void reset() {}
}

// --- Endurance Run ---
class EnduranceRunAnalyzer extends PoseAnalyzer {
  @override
  int get repCount => 0; // Measures time, not reps

  @override
  List<String> getFeedback() => ["Maintain a steady, consistent pace.", "Use controlled breathing."]; // Renamed

  @override
  bool get formIsCorrect => true; // Added placeholder

  @override
  int get wrongRepCount => 0; // Added placeholder


  @override
  void processPose(Pose pose, Size imageSize) {
    // Placeholder for endurance run analysis
  }
   @override
  void reset() {}
}
