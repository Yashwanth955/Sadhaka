import 'dart:async'; // Added for Timer
import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';
import 'pose_analyzer.dart'; // Your analyzer system
import 'pose_painter.dart'; // Your painter
import 'test_result_screens.dart'; // The correct destination

class CameraScreen extends StatefulWidget {
  final PoseAnalyzer analyzer;
  final String testName;
  final int? durationInSeconds;

  const CameraScreen({
    required this.analyzer,
    required this.testName,
    this.durationInSeconds,
    super.key,
  });

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

  // --- Camera Switch State Variables ---
  List<CameraDescription> _cameras = [];
  int _selectedCameraIdx = 0;
  bool _isSwitchingCamera = false;
  // --- End Camera Switch State Variables ---

  // --- Countdown Timer State Variables ---
  static const int _defaultCountdownDuration = 3;
  int _currentCountdown = _defaultCountdownDuration; // Initialized to default
  bool _isCountdownInProgress = false;
  Timer? _countdownTimer;
  // --- End Countdown Timer State Variables ---

  // --- Test Duration Timer State Variables ---
  Timer? _testTimer;
  int _remainingTestSeconds = 0;
  // --- End Test Duration Timer State Variables ---

  @override
  void initState() {
    super.initState();
    if (widget.durationInSeconds != null && widget.durationInSeconds! > 0) {
      _remainingTestSeconds = widget.durationInSeconds!;
    }
    // Initialize _controller with a dummy/default value or ensure it's handled if accessed before init
    // For now, _initializeCameraAndPoseDetector will handle its proper initialization.
    _initializeCameraAndPoseDetector();
  }

  Future<void> _initializeCameraAndPoseDetector({CameraDescription? initialCamera}) async {
    setState(() {
      _isCameraInitialized = false;
    });

    final options = PoseDetectorOptions(model: PoseDetectionModel.base, mode: PoseDetectionMode.stream);
    _poseDetector = PoseDetector(options: options);

    if (_cameras.isEmpty) {
      try {
        _cameras = await availableCameras();
      } catch (e) {
        print("Error fetching cameras: $e");
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Error fetching cameras: ${e.toString()}")),
          );
        }
        return;
      }
    }

    if (_cameras.isEmpty) {
      print("No cameras available!");
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("No cameras found on this device.")),
        );
        setState(() => _isCameraInitialized = false);
      }
      return;
    }

    CameraDescription selectedCamera;
    if (initialCamera != null && _cameras.contains(initialCamera)) {
      selectedCamera = initialCamera;
      _selectedCameraIdx = _cameras.indexOf(initialCamera);
    } else {
      _selectedCameraIdx = _cameras.indexWhere((c) => c.lensDirection == CameraLensDirection.back);
      if (_selectedCameraIdx == -1) {
        _selectedCameraIdx = 0;
      }
      selectedCamera = _cameras[_selectedCameraIdx];
    }

    // Check if _controller is initialized and dispose if necessary
    // Using a local variable for the old controller to avoid accessing instance _controller before it's definitely assigned in this flow
    CameraController? oldController = _controller; // Check if _controller has been assigned before
    if (oldController != null && oldController.value.isInitialized) {
      if (oldController.value.isStreamingImages) {
        await oldController.stopImageStream().catchError((e) => print("Error stopping stream for re-init: $e"));
      }
      await oldController.dispose().catchError((e) => print("Error disposing old controller for re-init: $e"));
    }

    _controller = CameraController(
      selectedCamera,
      ResolutionPreset.medium,
      enableAudio: false,
      imageFormatGroup: Platform.isAndroid ? ImageFormatGroup.nv21 : ImageFormatGroup.bgra8888,
    );

    try {
      await _controller.initialize();
      if (mounted) {
        await _controller.startImageStream(_processCameraImage);
        setState(() => _isCameraInitialized = true);
      }
    } catch (e) {
      print("Error initializing camera: $e");
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error initializing camera: ${e.toString()}")),
        );
        setState(() => _isCameraInitialized = false);
      }
    }
  }

  Future<void> _switchCamera() async {
    if (_cameras.length < 2 || _isSwitchingCamera) return;

    setState(() {
      _isSwitchingCamera = true;
      _isCameraInitialized = false;
      _detectedPose = null;
    });

    _selectedCameraIdx = (_selectedCameraIdx + 1) % _cameras.length;

    await _initializeCameraAndPoseDetector(initialCamera: _cameras[_selectedCameraIdx]);

    if (mounted) {
      setState(() {
        _isSwitchingCamera = false;
      });
    }
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _testTimer?.cancel();

    // Ensure controller is not null and is initialized before trying to use its value
    if ( _controller != null && _controller.value.isInitialized) {
      if (_controller.value.isStreamingImages) {
        _controller.stopImageStream().catchError((e) {
          print("Error stopping stream on dispose: $e");
        });
      }
      _controller.dispose().catchError((e){
        print("Error disposing controller on dispose: $e");
      });
    }
    _poseDetector.close();
    super.dispose();
  }

  Future<void> _processCameraImage(CameraImage image) async {
    if (_isDetectingPoses || !_isCameraInitialized || _isSwitchingCamera ||
        !_controller.value.isInitialized || !_controller.value.isStreamingImages) return;
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
          widget.analyzer.processPose(poses.first, imageSize);
        }
        if (mounted) {
          setState(() {
            _detectedPose = poses.first;
            _imageSize = imageSize;
            _imageRotation = imageRotation;
          });
        }
      } else {
        if (mounted) {
          setState(() {
            _detectedPose = null;
          });
        }
      }
    } catch (e) {
      print("Error processing image: $e");
    } finally {
      _isDetectingPoses = false;
    }
  }

  void _stopAndNavigate() {
    if (!mounted) return;
    _countdownTimer?.cancel();
    _testTimer?.cancel();
    setState(() {
      _isTestStarted = false;
      _isCountdownInProgress = false;
    });

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => JumpResultScreen(
          testTitle: widget.testName,
          feedback: widget.analyzer.getFeedback(),
        ),
      ),
    );
  }

  void _initiateTestSequence() {
    if (!_isCameraInitialized || !mounted || _isTestStarted || _isCountdownInProgress || _isSwitchingCamera) return;
    setState(() {
      _isCountdownInProgress = true;
      _currentCountdown = _defaultCountdownDuration;
    });

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_currentCountdown > 1) {
        if (mounted) {
          setState(() {
            _currentCountdown--;
          });
        }
      } else {
        timer.cancel();
        if (mounted) {
          setState(() {
            _isCountdownInProgress = false;
          });
          _beginPoseAnalysis();
        }
      }
    });
  }

  void _beginPoseAnalysis() {
    if (!_isCameraInitialized || !mounted || _isSwitchingCamera) return;
    setState(() {
      _isTestStarted = true;
    });
    if (widget.durationInSeconds != null && widget.durationInSeconds! > 0) {
      _startActualTestTimer();
    }
  }

  void _startActualTestTimer() {
    _testTimer?.cancel();
    _testTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_remainingTestSeconds > 0) {
        setState(() {
          _remainingTestSeconds--;
        });
      } else {
        timer.cancel();
        if (_isTestStarted) {
          _stopAndNavigate();
        }
      }
    });
  }

  String _formatDuration(int totalSeconds) {
    final duration = Duration(seconds: totalSeconds);
    final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    if (!_isCameraInitialized || _isSwitchingCamera || !_controller.value.isInitialized) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final mediaSize = MediaQuery.of(context).size;
    // Calculate the scale to fill the screen while maintaining aspect ratio
    // Ensure controller.value.aspectRatio is not zero to prevent division by zero
    final controllerAspectRatio = _controller.value.aspectRatio;
    final scale = controllerAspectRatio == 0 ? 1.0 : 1 / (controllerAspectRatio * mediaSize.aspectRatio);


    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          ClipRect(
            child: Transform.scale(
              scale: scale,
              alignment: Alignment.center,
              child: CameraPreview(_controller),
            ),
          ),
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
          if (_isCountdownInProgress)
            Center(
              child: Text(
                _currentCountdown.toString(),
                style: const TextStyle(fontSize: 96, color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          _buildUIControls(),
        ],
      ),
    );
  }

  Widget _buildUIControls() {
    bool canSwitchCamera = _cameras.length > 1 && !_isTestStarted && !_isCountdownInProgress;

    return Padding(
      padding: const EdgeInsets.all(20.0).copyWith(bottom: 40.0),
      child: Column(
        children: [
          SafeArea(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (canSwitchCamera)
                  IconButton(
                    icon: const Icon(Icons.flip_camera_ios_outlined, color: Colors.white, size: 30),
                    onPressed: _isSwitchingCamera ? null : _switchCamera,
                  )
                else
                  const SizedBox(width: 48),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (_isTestStarted && widget.durationInSeconds != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color.fromRGBO(0, 0, 0, 0.6),
                            borderRadius: BorderRadius.circular(15),
                          ),
                          child: Text(
                            _formatDuration(_remainingTestSeconds),
                            style: const TextStyle(fontSize: 22, color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                        )
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white, size: 30),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),
          if (_isTestStarted && widget.analyzer.getFeedback().isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 8.0, left: 16.0, right: 16.0),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color.fromRGBO(0, 0, 0, 0.5),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  widget.analyzer.getFeedback().first,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ),
            ),
          if (_isTestStarted)
            Container(
              margin: const EdgeInsets.only(top: 12),
              padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              decoration: BoxDecoration(color: const Color.fromRGBO(0, 0, 0, 0.5), borderRadius: BorderRadius.circular(12)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildCounter('CORRECT', widget.analyzer.repCount, Colors.green),
                  _buildCounter('INCORRECT', widget.analyzer.wrongRepCount, Colors.red),
                ],
              ),
            ),
          const Spacer(),
          if (!_isTestStarted && !_isCountdownInProgress)
            ElevatedButton.icon(
              onPressed: (_isCameraInitialized && !_isSwitchingCamera) ? _initiateTestSequence : null,
              icon: const Icon(Icons.play_arrow),
              label: const Text('Start Test'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
            )
          else if (_isTestStarted)
            ElevatedButton.icon(
              onPressed: _stopAndNavigate,
              icon: const Icon(Icons.stop_circle_outlined),
              label: const Text('Stop & Get Result'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
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
