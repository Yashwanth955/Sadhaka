import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  Delegate,
  RunningMode,
  usePoseDetection,
} from 'react-native-mediapipe-posedetection';

import SkeletonOverlay from '../components/SkeletonOverlay';
import {
  extractFirstPersonLandmarks,
  formatPoseFrame,
} from '../pose/formatPoseFrame';
import {
  DEFAULT_MIN_KEYPOINT_CONFIDENCE,
  DEFAULT_TARGET_FPS,
  POSE_MODEL_FILE,
} from '../pose/poseConstants';
import colors from '../theme/colors';
import typography from '../theme/typography';

/**
 * Live pose camera with MediaPipe Pose Landmarker.
 *
 * Callbacks (pass as props, or via route.params — see note below):
 *   onPoseDetected(poseFrame)  — throttled, feature-pipeline ready
 *   onNoPersonDetected()       — when no body / empty landmarks
 *
 * route.params may include: cameraPosition, minConfidence, targetFps, testName
 *
 * NOTE: Function params through React Navigation are non-serializable.
 * Prefer props when embedding this screen, or pass callbacks via route.params
 * with serialization checks disabled for this screen.
 */
export default function CameraScreen({ navigation, route, ...propCallbacks }) {
  const insets = useSafeAreaInsets();
  const params = route?.params ?? {};

  const onPoseDetected =
    propCallbacks.onPoseDetected ?? params.onPoseDetected ?? null;
  const onNoPersonDetected =
    propCallbacks.onNoPersonDetected ?? params.onNoPersonDetected ?? null;

  const [cameraPosition, setCameraPosition] = useState(params.cameraPosition ?? 'front');
  const minConfidence =
    params.minConfidence ?? DEFAULT_MIN_KEYPOINT_CONFIDENCE;
  const targetFps = params.targetFps ?? DEFAULT_TARGET_FPS;

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(cameraPosition);

  const [poseFrame, setPoseFrame] = useState(null);
  const [personDetected, setPersonDetected] = useState(false);
  const [detectionError, setDetectionError] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const [elapsedMs, setElapsedMs] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const startTime = Date.now() - elapsedMs;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, elapsedMs]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const onPoseRef = useRef(onPoseDetected);
  const onNoneRef = useRef(onNoPersonDetected);
  useEffect(() => {
    onPoseRef.current = onPoseDetected;
  }, [onPoseDetected]);
  useEffect(() => {
    onNoneRef.current = onNoPersonDetected;
  }, [onNoPersonDetected]);

  // Avoid flooding consumers if parent re-renders every frame
  const lastNoneEmitRef = useRef(0);
  const lastDetectionRef = useRef(0);

  // Auto-clear overlay if no results received for 300ms
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      if (personDetected && Date.now() - lastDetectionRef.current > 300) {
        setPoseFrame(null);
        setPersonDetected(false);
        onNoneRef.current?.();
      }
    }, 150);
    return () => clearInterval(interval);
  }, [isActive, personDetected]);

  const handleResults = useCallback(
    (result, viewCoordinator) => {
      const raw = extractFirstPersonLandmarks(result);
      if (!raw) {
        setPoseFrame(null);
        setPersonDetected(false);
        const now = Date.now();
        if (now - lastNoneEmitRef.current > 250) {
          lastNoneEmitRef.current = now;
          onNoneRef.current?.();
        }
        return;
      }

      const frameDims = viewCoordinator?.getFrameDims?.(result) ?? {
        width: result.inputImageWidth || 1,
        height: result.inputImageHeight || 1,
      };

      const frame = formatPoseFrame(raw, {
        viewCoordinator,
        frameDims,
        minConfidence,
        inferenceTime: result.inferenceTime,
      });

      if (!frame || !frame.personDetected) {
        setPoseFrame(null);
        setPersonDetected(false);
        onNoneRef.current?.();
        return;
      }

      setPoseFrame(frame);
      setPersonDetected(true);
      lastDetectionRef.current = Date.now();
      onPoseRef.current?.(frame);
    },
    [minConfidence]
  );

  const handleError = useCallback((error) => {
    setDetectionError(error?.message || 'Pose detection failed');
  }, []);

  const poseDetection = usePoseDetection(
    {
      onResults: handleResults,
      onError: handleError,
    },
    RunningMode.LIVE_STREAM,
    POSE_MODEL_FILE,
    {
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      shouldOutputSegmentationMasks: false,
      delegate: Delegate.GPU,
      mirrorMode: cameraPosition === 'front' ? 'mirror-front-only' : 'none',
      fpsMode: 'none',
    }
  );

  useEffect(() => {
    if (device) {
      poseDetection.cameraDeviceChangeHandler(device);
    }
  }, [device, poseDetection]);

  useEffect(() => {
    poseDetection.resizeModeChangeHandler('cover');
  }, [poseDetection]);

  // Safely access camera view dimensions with fallbacks
  const overlaySize = useMemo(() => {
    if (!poseDetection?.cameraViewDimensions) {
      // Return reasonable fallbacks while waiting for camera initialization
      return { width: 0, height: 0 };
    }
    return poseDetection.cameraViewDimensions;
  }, [poseDetection]);

  const statusLabel = useMemo(() => {
    if (detectionError) return detectionError;
    if (!personDetected) return 'No person detected — step into frame';
    const low = poseFrame?.keypoints?.filter((k) => k.isLowConfidence).length ?? 0;
    if (low > 10) return 'Tracking weak — improve lighting / full body in view';
    return `Tracking · ${poseFrame?.visibleCount ?? 0}/33 joints · ${Math.round(
      (poseFrame?.averageConfidence ?? 0) * 100
    )}%`;
  }, [detectionError, personDetected, poseFrame]);

  if (!hasPermission) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <MaterialIcons name="videocam-off" size={48} color={colors.darkTextSecondary} />
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionBody}>
          Sports AI uses the camera for on-device pose detection during assessments.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryBtnText}>Allow camera</Text>
        </TouchableOpacity>
        {navigation ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkBtn}>
            <Text style={styles.linkText}>Go back</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.hudCyan} />
        <Text style={styles.permissionBody}>Starting camera…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        pixelFormat="rgb"
        resizeMode="cover"
        frameProcessor={poseDetection.frameProcessor}
        onLayout={poseDetection.cameraViewLayoutChangeHandler}
        onOutputOrientationChanged={poseDetection.cameraOrientationChangedHandler}
        photo={false}
        audio={false}
      />

      {personDetected ? (
        <SkeletonOverlay
          keypoints={poseFrame?.keypoints}
          width={overlaySize.width}
          height={overlaySize.height}
          minConfidence={minConfidence}
          showLowConfidence
        />
      ) : null}

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        {navigation ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Close camera"
          >
            <MaterialIcons name="close" size={24} color={colors.darkTextPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}

        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {params.testName || 'Live Pose'} • {formatTime(elapsedMs)}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {statusLabel}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setCameraPosition((p) => (p === 'front' ? 'back' : 'front'))}
          accessibilityLabel="Switch camera"
        >
          <MaterialIcons name="flip-camera-ios" size={24} color={colors.darkTextPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setIsActive((v) => !v)}
          accessibilityLabel={isActive ? 'Pause' : 'Resume'}
        >
          <MaterialIcons
            name={isActive ? 'pause' : 'play-arrow'}
            size={24}
            color={colors.darkTextPrimary}
          />
        </TouchableOpacity>
      </View>

      {!personDetected && !detectionError ? (
        <View style={[styles.banner, { bottom: insets.bottom + 24 }]}>
          <MaterialIcons name="accessibility-new" size={22} color={colors.amber} />
          <Text style={styles.bannerText}>
            Stand so your full body is visible. Low-confidence joints are dimmed.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.darkCanvas,
  },
  center: {
    flex: 1,
    backgroundColor: colors.darkCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  permissionTitle: {
    ...typography.headlineMd,
    color: colors.darkTextPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
  permissionBody: {
    ...typography.bodyMd,
    color: colors.darkTextSecondary,
    textAlign: 'center',
  },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: {
    ...typography.labelBold,
    color: colors.onPrimary,
  },
  linkBtn: { marginTop: 12, padding: 8 },
  linkText: { ...typography.bodyMd, color: colors.hudCyan },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.darkSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    backgroundColor: colors.darkSurface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  title: {
    ...typography.labelBold,
    color: colors.darkTextPrimary,
  },
  subtitle: {
    ...typography.labelSm,
    color: colors.darkTextSecondary,
    marginTop: 2,
  },
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.darkSurfaceElevated,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  bannerText: {
    ...typography.labelSm,
    color: colors.darkTextPrimary,
    flex: 1,
  },
});
