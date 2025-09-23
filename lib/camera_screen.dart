import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'test_result_screens.dart';

class CameraScreen extends StatefulWidget {
  // Add a new required parameter to accept the destination screen.
  final Widget resultScreen;

  const CameraScreen({
    super.key,
    required this.resultScreen,
  });

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  late List<CameraDescription> _cameras;
  late CameraController _controller;
  bool _isCameraInitialized = false;
  bool _isRecording = false;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    _cameras = await availableCameras();
    _controller = CameraController(_cameras[0], ResolutionPreset.high);

    try {
      await _controller.initialize();
      if (mounted) {
        setState(() {
          _isCameraInitialized = true;
        });
      }
    } catch (e) {
      print("Error initializing camera: $e");
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onStartRecording() async {
    // Start recording the video.
    try {
      await _controller.startVideoRecording();
      setState(() {
        _isRecording = true;
      });
      print("Recording started!");
    } catch (e) {
      print("Error starting video recording: $e");
    }
  }

  void _onStopRecording() async {
    // Stop recording and get the file.
    try {
      final XFile videoFile = await _controller.stopVideoRecording();
      setState(() {
        _isRecording = false;
      });
      print("Recording stopped! Video saved to: ${videoFile.path}");

      // Navigate to the result screen, now with the recorded video file.
      if (mounted) {
        // We need to know what kind of result screen to build.
        // This is a simple way to check, assuming titles are unique.
        // A more robust app might use an enum or ID.
        if (widget.resultScreen is RunResultScreen) {
          final result = widget.resultScreen as RunResultScreen;
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => RunResultScreen(
                testTitle: result.testTitle,
                feedback: result.feedback,
                imageUrl: result.imageUrl,
                hasReviewButton: result.hasReviewButton,
                recordedVideo: videoFile, // Pass the recorded video
              ),
            ),
          );
        } else if (widget.resultScreen is JumpResultScreen) {
          final result = widget.resultScreen as JumpResultScreen;
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => JumpResultScreen(
                testTitle: result.testTitle,
                feedback: result.feedback,
                recordedVideo: videoFile, // Pass the recorded video
              ),
            ),
          );
        }
      }
    } catch (e) {
      print("Error stopping video recording: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_isCameraInitialized) {
      return const Scaffold(
        backgroundColor: Colors.black,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          Center(
            child: CameraPreview(_controller),
          ),
          _buildControls(),
        ],
      ),
    );
  }

  Widget _buildControls() {
    return Padding(
      padding: const EdgeInsets.all(20.0).copyWith(bottom: 40.0),
      child: Column(
        children: [
          SafeArea(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white, size: 30),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              if (!_isRecording)
                ElevatedButton.icon(
                  onPressed: _onStartRecording,
                  icon: const Icon(Icons.videocam),
                  label: const Text('Start Recording'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                ),
              if (_isRecording)
                ElevatedButton.icon(
                  onPressed: _onStopRecording,
                  icon: const Icon(Icons.stop_circle_outlined),
                  label: const Text('Stop to Analyze'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}