import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function AILiveAssessmentScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleRecordToggle = () => {
    if (isRecording) {
      clearInterval(timerRef.current);
      setIsRecording(false);
      setTimer(0);
      navigation.navigate('AssessmentResults');
    } else {
      setIsRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permission) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white' }}>Loading Camera Permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', marginBottom: 16 }}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.requestButton} onPress={requestPermission}>
          <Text style={styles.requestButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Viewfinder Camera */}
        <CameraView
          style={styles.camera}
          facing="back"
        >
          {/* Overlay Darken */}
          <View style={styles.overlay} />
        </CameraView>

        {/* Top Overlay Elements */}
        <View style={styles.topOverlay}>
          <View style={styles.statusIndicator}>
            <MaterialIcons name="check-circle" size={16} color={colors.tertiaryContainer} />
            <Text style={styles.statusText}>Athlete in Frame</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="close" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Status Readouts */}
        <View style={styles.readoutLeft}>
          <View style={styles.readoutBadge}>
            <View style={styles.dot} />
            <Text style={styles.readoutText}>TRACKING ACTIVE</Text>
          </View>
          <View style={styles.readoutBadge}>
            <Text style={styles.readoutText}>Light Level: Optimal</Text>
          </View>
        </View>
        <View style={styles.readoutRight}>
          <View style={styles.readoutBadge}>
            <Text style={styles.readoutText}>Dist: 5.2m</Text>
          </View>
        </View>

        {/* Center Timer / Countdown */}
        <View style={styles.countdownContainer}>
          {isRecording ? (
            <View style={styles.timerBadge}>
              <View style={[styles.dot, styles.recordingDot]} />
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>
          ) : (
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownText}>3</Text>
            </View>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="grid-on" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.recordButton}
              onPress={handleRecordToggle}
            >
              <View style={[styles.recordInner, isRecording && styles.recordInnerActive]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="tune" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.surface,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.marginMobile,
    right: spacing.marginMobile,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  statusIndicator: {
    backgroundColor: 'rgba(248,249,255,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(195,197,217,0.3)',
  },
  statusText: {
    ...typography.labelBold,
    color: colors.onSurface,
    marginLeft: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(248,249,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readoutLeft: {
    position: 'absolute',
    top: 96,
    left: spacing.marginMobile,
    zIndex: 10,
    gap: 4,
  },
  readoutRight: {
    position: 'absolute',
    top: 96,
    right: spacing.marginMobile,
    zIndex: 10,
  },
  readoutBadge: {
    backgroundColor: 'rgba(248,249,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195,197,217,0.2)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 4,
  },
  readoutText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  countdownContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  countdownCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(248,249,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  countdownText: {
    ...typography.displayLg,
    color: colors.primary,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 64,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.marginMobile,
    zIndex: 30,
    // Add gradient via background color on native, but simple transparent background will do here
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229,238,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(195,197,217,0.5)',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(248,249,255,0.5)',
    borderWidth: 4,
    borderColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordInner: {
    width: 32,
    height: 32,
    backgroundColor: colors.error,
    borderRadius: 4,
  },
  recordInnerActive: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
  },
  timerBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    backgroundColor: colors.error,
  },
  timerText: {
    ...typography.headlineMd,
    color: '#FFF',
  },
  requestButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  requestButtonText: {
    ...typography.labelBold,
    color: '#FFF',
  },
});
