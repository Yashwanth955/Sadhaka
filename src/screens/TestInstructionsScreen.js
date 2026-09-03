import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';
import testDefinitionsData from '../data/testDefinitionsData.json';
import { getTestById } from '../services/localDb';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const titleToKeyMap = {
  '50m sprint': 'fiftyMeterSprint',
  '50m sprint (standing start)': 'fiftyMeterSprint',
  '30m sprint': 'thirtyMeterSprint',
  '30 m sprint': 'thirtyMeterSprint',
  '5-10-5 shuttle run': 'fiveTenFiveShuttleRun',
  'shuttle run': 'fiveTenFiveShuttleRun',
  'vertical jump': 'verticalJump',
  'standing long jump': 'standingLongJump',
  'push-ups': 'pushUps',
  'push ups': 'pushUps',
  'squats': 'squats',
  'reaction test': 'reactionTest',
  'plate tapping / reaction test': 'reactionTest',
  'single-leg balance': 'singleLegBalance',
  'flamingo balance test': 'singleLegBalance',
  'shoulder mobility': 'shoulderMobility',
  'lateral movement': 'lateralMovement',
  'beep test': 'beepTest',
  'plank': 'plank',
  'flexibility test': 'flexibilityTest',
  'sit and reach test': 'flexibilityTest',
  'partial curl-up test': 'partialCurlUp',
  'partial curl-up': 'partialCurlUp',
  'bmi test': 'bmiTest',
  'bmi test (body composition)': 'bmiTest',
  '600m run/walk': 'sixHundredMeterRun',
  '600m run': 'sixHundredMeterRun',
};

function resolveTestDefinition(params = {}) {
  const { testId, testName } = params;

  if (testId && testDefinitionsData[testId]) {
    return testDefinitionsData[testId];
  }

  const lookupKey = titleToKeyMap[(testName || testId || '').toLowerCase()];
  if (lookupKey && testDefinitionsData[lookupKey]) {
    return testDefinitionsData[lookupKey];
  }

  const matched = Object.values(testDefinitionsData).find(
    t => t.name.toLowerCase() === (testName || '').toLowerCase()
  );
  if (matched) return matched;

  return testDefinitionsData.fiftyMeterSprint || testDefinitionsData.thirtyMeterSprint;
}

export default function TestInstructionsScreen({ route, navigation }) {
  const { currentUser, userProfile } = useAuth() || {};
  const initialGender = (
    userProfile?.gender || 
    currentUser?.gender || 
    route?.params?.gender || 
    'male'
  ).toLowerCase() === 'female' ? 'female' : 'male';

  const [athleteGender, setAthleteGender] = useState(initialGender);
  const initialTest = resolveTestDefinition(route?.params);
  const [testData, setTestData] = useState(initialTest);

  useEffect(() => {
    async function loadAthleteGender() {
      if (userProfile?.gender) {
        setAthleteGender(userProfile.gender.toLowerCase() === 'female' ? 'female' : 'male');
        return;
      }
      if (currentUser?.uid && db) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data().gender) {
            setAthleteGender(snap.data().gender.toLowerCase() === 'female' ? 'female' : 'male');
          }
        } catch (e) {}
      }
    }
    loadAthleteGender();
  }, [currentUser, userProfile]);

  useEffect(() => {
    async function loadTestFromDb() {
      const incomingId = route?.params?.testId;
      if (incomingId) {
        try {
          const dbTest = await getTestById(incomingId);
          if (dbTest) {
            setTestData(dbTest);
          }
        } catch (e) {
          console.warn('[TestInstructionsScreen] Error loading test from SQLite:', e);
        }
      }
    }
    loadTestFromDb();
  }, [route?.params?.testId]);

  const instructionSteps = (testData.instructions || '')
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^\d+\.\s*/, ''));

  const getStatusBadgeConfig = (status) => {
    switch (status) {
      case 'full_ai':
        return {
          label: 'FULL AI TRACKED',
          bgColor: '#E8F5E9',
          textColor: '#2E7D32',
          borderColor: '#A5D6A7',
          icon: 'auto-awesome'
        };
      case 'basic_manual':
        return {
          label: 'BASIC MANUAL / TIMER',
          bgColor: '#E3F2FD',
          textColor: '#1565C0',
          borderColor: '#90CAF9',
          icon: 'touch-app'
        };
      case 'coming_soon':
        return {
          label: 'COMING SOON',
          bgColor: '#FFF3E0',
          textColor: '#E65100',
          borderColor: '#FFCC80',
          icon: 'hourglass-empty'
        };
      default:
        return {
          label: 'FULL AI TRACKED',
          bgColor: '#E8F5E9',
          textColor: '#2E7D32',
          borderColor: '#A5D6A7',
          icon: 'auto-awesome'
        };
    }
  };

  const statusConfig = getStatusBadgeConfig(testData.implementationStatus);
  const isComingSoon = testData.implementationStatus === 'coming_soon';

  const formatGenderBenchmark = (t, gender) => {
    if (!t) return null;
    const fallback = testDefinitionsData[t.id] || {};
    const unit = t.benchmarkUnit || fallback.benchmarkUnit || '';
    const isLower = (t.benchmarkDirection || fallback.benchmarkDirection) === 'lower_is_better';
    const isFalls = (t.detectionMethod || fallback.detectionMethod) === 'fall_count_fixed';
    const isFemale = gender === 'female';

    let exVal = isFemale 
      ? (t.benchmarkExcellentFemale ?? t.benchmarkExcellent)
      : (t.benchmarkExcellentMale ?? t.benchmarkExcellent);

    let gdVal = isFemale
      ? (t.benchmarkGoodFemale ?? t.benchmarkGood)
      : (t.benchmarkGoodMale ?? t.benchmarkGood);

    let avgVal = isFemale
      ? (t.benchmarkAverageFemale ?? t.benchmarkAverage)
      : (t.benchmarkAverageMale ?? t.benchmarkAverage);

    if ((exVal === undefined || exVal === null || (exVal === 0 && !isFalls)) && fallback) {
      exVal = isFemale ? fallback.benchmarkExcellentFemale : fallback.benchmarkExcellentMale;
      gdVal = isFemale ? fallback.benchmarkGoodFemale : fallback.benchmarkGoodMale;
      avgVal = isFemale ? fallback.benchmarkAverageFemale : fallback.benchmarkAverageMale;
    }

    if (exVal === undefined || exVal === null) return null;

    const prefixEx = isLower || isFalls ? '<=' : '>=';
    const prefixAvg = isLower || isFalls ? '>' : '<';

    return {
      excellent: `${prefixEx} ${exVal} ${unit}`.trim(),
      good: `${gdVal} ${unit}`.trim(),
      average: `${prefixAvg} ${avgVal} ${unit}`.trim(),
    };
  };

  const benchmarkObj = formatGenderBenchmark(testData, athleteGender);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Sadhaka</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Video Demo & Category Banner */}
        <TouchableOpacity style={styles.videoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' }}
            style={styles.videoThumbnail}
          />
          <View style={styles.videoOverlay}>
            <View style={styles.playButton}>
              <MaterialIcons name="play-arrow" size={36} color={colors.primary} />
            </View>
          </View>
          <View style={styles.demoBadge}>
            <MaterialIcons name="visibility" size={16} color={colors.primary} />
            <Text style={styles.demoBadgeText}>Demo Video</Text>
          </View>
        </TouchableOpacity>

        {/* Status & Mode Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusConfig.bgColor, borderColor: statusConfig.borderColor }]}>
          <View style={styles.statusBannerLeft}>
            <MaterialIcons name={statusConfig.icon} size={20} color={statusConfig.textColor} />
            <Text style={[styles.statusBannerLabel, { color: statusConfig.textColor }]}>{statusConfig.label}</Text>
          </View>
          <Text style={[styles.statusBannerNote, { color: statusConfig.textColor }]}>{testData.statusNote}</Text>
        </View>

        {/* Overview & Category Badge Card */}
        <View style={styles.card}>
          <View style={styles.cardLeftBorder} />
          <View style={styles.categoryRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{testData.category?.toUpperCase()}</Text>
            </View>
            <View style={styles.detectionPill}>
              <MaterialIcons name="settings-suggest" size={14} color={colors.primary} />
              <Text style={styles.detectionPillText}>{testData.detectionMethod}</Text>
            </View>
            {testData.fixedDuration && (
              <View style={[styles.detectionPill, { backgroundColor: colors.primaryContainer }]}>
                <MaterialIcons name="timer" size={14} color={colors.onPrimaryContainer} />
                <Text style={[styles.detectionPillText, { color: colors.onPrimaryContainer }]}>{testData.fixedDuration}s Window</Text>
              </View>
            )}
          </View>

          <Text style={styles.testNameHeading}>{testData.name}</Text>
          <Text style={styles.shortDescriptionText}>{testData.shortDescription}</Text>
          {testData.sourceReference && (
            <Text style={styles.sourceText}>Source: {testData.sourceReference}</Text>
          )}
        </View>

        {/* Why It Matters Card */}
        {testData.whyItMatters && (
          <View style={styles.card}>
            <View style={[styles.cardLeftBorder, { backgroundColor: '#FF9800' }]} />
            <View style={styles.cardHeader}>
              <MaterialIcons name="psychology" size={24} color="#FF9800" />
              <Text style={styles.cardTitle}>Why It Matters</Text>
            </View>
            <Text style={styles.bodyText}>{testData.whyItMatters}</Text>
          </View>
        )}

        {/* Step-by-Step Instructions */}
        <View style={styles.card}>
          <View style={styles.cardLeftBorder} />
          <View style={styles.cardHeader}>
            <MaterialIcons name="format-list-numbered" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Step-by-Step Setup & Instructions</Text>
          </View>
          
          <View style={styles.stepsContainer}>
            <View style={styles.stepsLine} />
            {instructionSteps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Target Benchmarks Card */}
        {benchmarkObj && (
          <View style={styles.card}>
            <View style={[styles.cardLeftBorder, { backgroundColor: colors.amber }]} />
            <View style={styles.benchmarkHeaderRow}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="emoji-events" size={24} color={colors.amber} />
                <Text style={styles.cardTitle}>Target Benchmarks</Text>
              </View>

              {/* Profile Gender Badge */}
              <View style={styles.profileGenderBadge}>
                <MaterialIcons 
                  name={athleteGender === 'female' ? 'female' : 'male'} 
                  size={16} 
                  color={colors.primary} 
                />
                <Text style={styles.profileGenderBadgeText}>
                  {athleteGender === 'female' ? 'Girls Benchmark' : 'Boys Benchmark'}
                </Text>
              </View>
            </View>

            <View style={styles.benchmarkContainer}>
              <View style={[styles.benchmarkRow, { backgroundColor: colors.success + '18' }]}>
                <View style={styles.benchmarkLabelGroup}>
                  <MaterialIcons name="star" size={18} color={colors.success} />
                  <Text style={[styles.benchmarkLabel, { color: colors.success }]}>EXCELLENT</Text>
                </View>
                <Text style={[styles.benchmarkValue, { color: colors.success }]}>{benchmarkObj.excellent}</Text>
              </View>

              <View style={[styles.benchmarkRow, { backgroundColor: colors.primary + '18' }]}>
                <View style={styles.benchmarkLabelGroup}>
                  <MaterialIcons name="thumb-up" size={18} color={colors.primary} />
                  <Text style={[styles.benchmarkLabel, { color: colors.primary }]}>GOOD</Text>
                </View>
                <Text style={[styles.benchmarkValue, { color: colors.primary }]}>{benchmarkObj.good}</Text>
              </View>

              <View style={[styles.benchmarkRow, { backgroundColor: colors.amber + '18' }]}>
                <View style={styles.benchmarkLabelGroup}>
                  <MaterialIcons name="remove" size={18} color={colors.amber} />
                  <Text style={[styles.benchmarkLabel, { color: colors.amber }]}>AVERAGE</Text>
                </View>
                <Text style={[styles.benchmarkValue, { color: colors.amber }]}>{benchmarkObj.average}</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Bottom Action Area */}
      <View style={styles.bottomActionArea}>
        <TouchableOpacity 
          style={[styles.readyButton, isComingSoon && styles.disabledButton]}
          disabled={isComingSoon}
          onPress={() => navigation.navigate('AILiveAssessment', { 
            testId: testData.id, 
            testName: testData.name,
            detectionMethod: testData.detectionMethod,
            implementationStatus: testData.implementationStatus,
            gender: athleteGender
          })}
        >
          <Text style={[styles.readyButtonText, isComingSoon && styles.disabledButtonText]}>
            {isComingSoon ? 'Coming Soon' : "I'm Ready, Start Test"}
          </Text>
          {!isComingSoon && <MaterialIcons name="arrow-forward" size={24} color={colors.onPrimary} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    height: 64,
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  headerTitle: {
    ...typography.brandTitle,
    color: colors.primary,
    position: 'absolute',
    left: 48,
    right: 48,
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  container: {
    padding: spacing.marginMobile,
    paddingBottom: 120,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHighest,
    marginBottom: spacing.md,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  demoBadgeText: {
    ...typography.labelBold,
    color: colors.onSurface,
    marginLeft: 8,
  },
  statusBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
    gap: 4,
  },
  statusBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBannerLabel: {
    ...typography.labelBold,
    fontSize: 12,
    letterSpacing: 1,
  },
  statusBannerNote: {
    ...typography.bodyMd,
    fontSize: 13,
    marginLeft: 28,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  cardLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryPillText: {
    ...typography.labelBold,
    color: colors.onPrimaryContainer,
    fontSize: 11,
    letterSpacing: 1,
  },
  detectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  detectionPillText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontSize: 11,
  },
  testNameHeading: {
    ...typography.headlineLgMobile,
    fontSize: 22,
    color: colors.onSurface,
    marginBottom: 6,
  },
  shortDescriptionText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  sourceText: {
    ...typography.labelSm,
    color: colors.primary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benchmarkHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginLeft: 8,
  },
  profileGenderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  profileGenderBadgeText: {
    ...typography.labelBold,
    fontSize: 12,
    color: colors.primary,
  },
  bodyText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  stepsContainer: {
    position: 'relative',
  },
  stepsLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    bottom: 16,
    width: 2,
    backgroundColor: colors.border,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepNumberText: {
    ...typography.labelBold,
    fontSize: 12,
    color: colors.onPrimaryContainer,
  },
  stepText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginLeft: 16,
    flex: 1,
    marginTop: 2,
    lineHeight: 20,
  },
  benchmarkContainer: {
    gap: 8,
    marginTop: 4,
  },
  benchmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  benchmarkLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benchmarkLabel: {
    ...typography.labelBold,
    fontSize: 12,
    letterSpacing: 1,
  },
  benchmarkValue: {
    ...typography.headlineMd,
    fontSize: 15,
    fontWeight: '700',
  },
  bottomActionArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
  },
  readyButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  readyButtonText: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onPrimary,
    marginRight: 12,
  },
  disabledButtonText: {
    color: '#666666',
    marginRight: 0,
  },
});
