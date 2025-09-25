import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';
import 'pose_analyzer.dart'; // Your analyzer system
import 'pose_painter.dart';   // Your painter
import 'test_result_screens.dart'; // The correct destination

class CameraScreen extends StatefulWidget {
  final PoseAnalyzer analyzer;
  final String testName;

  const CameraScreen({required this.analyzer, required this.testName, super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  late CameraController _controller;
  bool _isCameraInitialized = false;
  late PoseDetector _poseDetector;
  bool _isDetectingPoses = false;
  Pose? _detectedPose;
  Size _imageSize = Size.zero;
  InputImageRotation _imageRotation = InputImageRotation.rotation0deg;
  bool _isTestStarted = false;

  @override
  void initState() {
    super.initState();
    _initializeCameraAndPoseDetector();
  }

  Future<void> _initializeCameraAndPoseDetector() async {
    final options = PoseDetectorOptions(model: PoseDetectionModel.base, mode: PoseDetectionMode.stream);
    _poseDetector = PoseDetector(options: options);

    final cameras = await availableCameras();
    final selectedCamera = cameras.firstWhere(
          (camera) => camera.lensDirection == CameraLensDirection.back,
      orElse: () => cameras.first,
    );

    _controller = CameraController(
      selectedCamera,
      ResolutionPreset.medium,
      enableAudio: false,
      imageFormatGroup: Platform.isAndroid ? ImageFormatGroup.nv21 : ImageFormatGroup.bgra8888,
    );

    try {
      await _controller.initialize();
      if (mounted) {
        setState(() => _isCameraInitialized = true);
        await _controller.startImageStream(_processCameraImage);
      }
    } catch (e) {
      print("Error initializing camera: $e");
    }
  }

  @override
  void dispose() {
    if (mounted) {
      _controller.stopImageStream().catchError((e) => print("Error stopping stream on dispose: $e"));
    }
    _poseDetector.close();
    _controller.dispose();
    super.dispose();
  }

  Future<void> _processCameraImage(CameraImage image) async {
    if (_isDetectingPoses) return;
    _isDetectingPoses = true;

    try {
      final WriteBuffer allBytes = WriteBuffer();
      for (final Plane plane in image.planes) {
        allBytes.putUint8List(plane.bytes);
      }
      final bytes = allBytes.done().buffer.asUint8List();
      final imageRotation = InputImageRotationValue.fromRawValue(_controller.description.sensorOrientation) ?? InputImageRotation.rotation0deg;
      final imageSize = Size(image.width.toDouble(), image.height.toDouble());
      final inputImageFormat = InputImageFormatValue.fromRawValue(image.format.raw) ?? InputImageFormat.nv21;

      final inputImage = InputImage.fromBytes(
        bytes: bytes,
        metadata: InputImageMetadata(
          size: imageSize,
          rotation: imageRotation,
          format: inputImageFormat,
          bytesPerRow: image.planes[0].bytesPerRow,
        ),
      );

      final List<Pose> poses = await _poseDetector.processImage(inputImage);
      if (poses.isNotEmpty) {
        if (_isTestStarted) {
          widget.analyzer.processPose(poses.first);
        }
        if (mounted) {
          setState(() {
            _detectedPose = poses.first;
            _imageSize = imageSize;
            _imageRotation = imageRotation;
          });
        }
      }
    } catch (e) {
      print("Error processing image: $e");
    } finally {
      _isDetectingPoses = false;
    }
  }

  // UPDATED: This method no longer handles video recording
  void _stopAndNavigate() {
    if (!mounted) return;

    // Stop the analysis
    setState(() {
      _isTestStarted = false;
    });

    String feedback = "You completed ${widget.analyzer.repCount} correct reps and ${widget.analyzer.wrongRepCount} with incorrect form.";

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => JumpResultScreen(
          testTitle: widget.testName,
          feedback: feedback,
          recordedVideo: null, // No video was recorded
        ),
      ),
    );
  }

  // UPDATED: This method now only starts the analysis, not video recording
  void _startTest() {
    if (!_isCameraInitialized || !mounted) return;
    setState(() {
      _isTestStarted = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_isCameraInitialized) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          Center(child: CameraPreview(_controller)),
          if (_detectedPose != null)
            CustomPaint(
              painter: PosePainter(
                [_detectedPose!],
                _imageSize,
                _imageRotation,
                formIsCorrect: _isTestStarted ? widget.analyzer.formIsCorrect : true,
                cameraLensDirection: _controller.description.lensDirection,
              ),
            ),
          _buildUIControls(),
        ],
      ),
    );
  }

  Widget _buildUIControls() {
    return Padding(
      padding: const EdgeInsets.all(20.0).copyWith(bottom: 40.0),
      child: Column(
        children: [
          SafeArea(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (_isTestStarted)
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        widget.analyzer.feedback,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white, size: 30),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),
          if (_isTestStarted)
            Container(
              margin: const EdgeInsets.only(top: 12),
              padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              decoration: BoxDecoration(color: Colors.black.withOpacity(0.5), borderRadius: BorderRadius.circular(12)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildCounter('CORRECT', widget.analyzer.repCount, Colors.green),
                  _buildCounter('INCORRECT', widget.analyzer.wrongRepCount, Colors.red),
                ],
              ),
            ),
          const Spacer(),
          if (!_isTestStarted)
            ElevatedButton.icon(
              onPressed: _startTest,
              icon: const Icon(Icons.play_arrow),
              label: const Text('Start Test'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
            ),
          if (_isTestStarted)
            ElevatedButton.icon(
              onPressed: _stopAndNavigate,
              icon: const Icon(Icons.stop_circle_outlined),
              label: const Text('Stop & Get Result'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30))),
            ),
        ],
      ),
    );
  }

  Widget _buildCounter(String label, int count, Color color) {
    return Column(
      children: [
        Text(label, style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold)),
        Text(count.toString(), style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
      ],
    );
  }
}