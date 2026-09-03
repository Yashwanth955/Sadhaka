import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function AssessmentResultsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sadhaka</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Video Replay Card */}
        <View style={styles.card}>
          <View style={styles.cardLeftBorder} />
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Session Replay</Text>
            <View style={styles.tagPrimary}>
              <MaterialIcons name="directions-run" size={16} color={colors.primary} />
              <Text style={styles.tagPrimaryText}>100m Sprint</Text>
            </View>
          </View>
          
          <View style={styles.videoContainer}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80' }}
              style={styles.videoImage}
            >
              <View style={styles.playButtonBig}>
                <MaterialIcons name="play-arrow" size={32} color={colors.onPrimary} />
              </View>
              <View style={styles.timelineBar}>
                <MaterialIcons name="pause" size={20} color={colors.primary} />
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill}>
                    <View style={styles.progressThumb} />
                  </View>
                </View>
                <Text style={styles.timelineText}>0:03 / 0:11</Text>
              </View>
            </ImageBackground>
          </View>
        </View>

        {/* Score & Tier Card */}
        <View style={styles.scoreCard}>
          <View style={styles.cardLeftBorder} />
          
          <View style={styles.scoreTopSection}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>84</Text>
            </View>
            
            <View style={styles.tierInfo}>
              <Text style={styles.tierLabel}>OVERALL SCORE</Text>
              <View style={styles.tierBadge}>
                <MaterialIcons name="verified" size={18} color={colors.onPrimary} />
                <Text style={styles.tierBadgeText}>Elite Tier</Text>
              </View>
              <Text style={styles.tierDescription}>Top 5% performance for your age group.</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialIcons name="speed" size={24} color={colors.tertiaryContainer} style={styles.statIcon} />
              <Text style={styles.statValue}>32.4</Text>
              <Text style={styles.statLabel}>Top Speed (km/h)</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="timer" size={24} color={colors.tertiaryContainer} style={styles.statIcon} />
              <Text style={styles.statValue}>10.8</Text>
              <Text style={styles.statLabel}>Final Time (s)</Text>
            </View>
          </View>
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Metric 1 */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={styles.metricIconBox}>
                <MaterialIcons name="straighten" size={24} color={colors.primary} />
              </View>
              <View style={styles.metricStatusOptimal}>
                <Text style={styles.metricStatusOptimalText}>Optimal</Text>
              </View>
            </View>
            <Text style={styles.metricLabel}>AVG STRIDE LENGTH</Text>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricValueBig}>2.1</Text>
              <Text style={styles.metricUnit}>meters</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '85%', backgroundColor: colors.primary }]} />
            </View>
          </View>
          
          {/* Metric 2 */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={styles.metricIconBox}>
                <MaterialIcons name="bolt" size={24} color={colors.primary} />
              </View>
              <View style={styles.metricStatusPoor}>
                <Text style={styles.metricStatusPoorText}>Needs Work</Text>
              </View>
            </View>
            <Text style={styles.metricLabel}>REACTION TIME</Text>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricValueBig}>0.16</Text>
              <Text style={styles.metricUnit}>seconds</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '40%', backgroundColor: colors.error }]} />
            </View>
          </View>
        </View>

        {/* AI Insights Section */}
        <View style={styles.card}>
          <View style={styles.cardLeftBorder} />
          <View style={[styles.cardHeader, styles.insightsHeader]}>
            <MaterialIcons name="smart-toy" size={28} color={colors.primary} />
            <Text style={styles.cardTitle}>Coach's Insights</Text>
          </View>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightIconBox, { backgroundColor: colors.surfaceContainer }]}>
              <MaterialIcons name="check-circle" size={16} color={colors.primary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Excellent Start Posture</Text>
              <Text style={styles.insightText}>Torso angle at start was optimal, allowing for maximum initial acceleration thrust.</Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightIconBox, { backgroundColor: colors.surfaceContainer }]}>
              <MaterialIcons name="arrow-upward" size={16} color={colors.tertiaryContainer} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Drive Phase Adjustment</Text>
              <Text style={styles.insightText}>Increase knee drive in mid-phase to maintain stride frequency before hitting top speed.</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => navigation.navigate('Main')}
          >
            <MaterialIcons name="bookmark" size={20} color={colors.onPrimary} />
            <Text style={styles.saveButtonText}>Save to Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.compareButton}
            onPress={() => navigation.navigate('OverallProgress')}
          >
            <MaterialIcons name="stacked-bar-chart" size={20} color={colors.primary} />
            <Text style={styles.compareButtonText}>Compare Benchmark</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginLeft: -8,
  },
  headerTitle: {
    ...typography.brandTitle,
    color: colors.primary,
  },
  spacer: {
    width: 40,
  },
  container: {
    padding: spacing.marginMobile,
    paddingBottom: 40,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.sm, // fallback for gap
  },
  cardLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 197, 217, 0.3)',
    paddingLeft: 20,
  },
  cardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  tagPrimary: {
    backgroundColor: '#E6EEFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagPrimaryText: {
    ...typography.labelBold,
    color: colors.primary,
    marginLeft: 4,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.inverseSurface,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonBig: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 65, 200, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 249, 255, 0.8)',
    padding: 8,
    borderRadius: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.outlineVariant,
    borderRadius: 2,
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    width: '33%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: -6,
  },
  timelineText: {
    ...typography.labelSm,
    color: colors.onSurface,
  },
  scoreCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  scoreTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  scoreNumber: {
    ...typography.displayLg,
    color: colors.primary,
  },
  tierInfo: {
    flex: 1,
  },
  tierLabel: {
    ...typography.labelBold,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary, // should be gradient but simple for now
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tierBadgeText: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onPrimary,
    marginLeft: 8,
  },
  tierDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.2)',
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    ...typography.headlineMd,
    fontSize: 20,
    color: colors.onSurface,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.3)',
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  metricIconBox: {
    backgroundColor: colors.surfaceContainer,
    padding: 8,
    borderRadius: 8,
  },
  metricStatusOptimal: {
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  metricStatusOptimalText: {
    ...typography.labelBold,
    fontSize: 12,
    color: colors.primary,
  },
  metricStatusPoor: {
    backgroundColor: colors.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  metricStatusPoorText: {
    ...typography.labelBold,
    fontSize: 12,
    color: colors.onErrorContainer,
  },
  metricLabel: {
    ...typography.labelBold,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValueBig: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginRight: 8,
  },
  metricUnit: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  barTrack: {
    height: 6,
    backgroundColor: 'rgba(195, 197, 217, 0.3)',
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightsHeader: {
    backgroundColor: 'rgba(239, 244, 255, 0.5)',
    justifyContent: 'flex-start',
    gap: 8,
  },
  insightItem: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195, 197, 217, 0.2)',
  },
  insightIconBox: {
    padding: 4,
    borderRadius: 12,
    marginRight: 16,
    marginTop: 4,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    ...typography.labelBold,
    color: colors.onSurface,
    marginBottom: 4,
  },
  insightText: {
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    ...typography.labelBold,
    color: colors.onPrimary,
    marginLeft: 8,
  },
  compareButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  compareButtonText: {
    ...typography.labelBold,
    color: colors.primary,
    marginLeft: 8,
  },
});
