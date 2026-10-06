import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';
import BottomNavBar from '../components/BottomNavBar';
import { getUserProgressMetrics, MOCK_USER_ID } from '../models';

export default function SportsRecommendationScreen({ navigation }) {
  const { currentUser, userProfile, DEFAULT_ATHLETE_AVATAR } = useAuth();
  const avatarUri = userProfile?.photoURL || currentUser?.photoURL || DEFAULT_ATHLETE_AVATAR;
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function fetchMetrics() {
      if (currentUser?.uid) {
        try {
          const m = await getUserProgressMetrics(currentUser.uid);
          setMetrics(m);
        } catch (e) {
          console.warn('Error fetching metrics for recommendations:', e);
        }
      }
    }
    fetchMetrics();
  }, [currentUser?.uid]);

  const isMock = currentUser?.uid === MOCK_USER_ID;
  const hasSessions = isMock || Boolean(metrics?.hasSessions);
  const primarySport = userProfile?.primarySport || 'Cricket';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sadhaka</Text>
        </View>
        <TouchableOpacity style={styles.profilePicContainer} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{hasSessions ? "Your Top Potential" : "AI Sports Potential"}</Text>
          <Text style={styles.subtitle}>
            {hasSessions 
              ? "AI Analysis based on your speed, power, and agility benchmarks." 
              : "Complete your initial fitness battery to generate sports suitability matches."}
          </Text>
        </View>

        {hasSessions ? (
          <>
            {/* Primary Recommendation Card */}
            <View style={styles.primaryCard}>
              <View style={styles.cardLeftBorder} />
              
              <View style={styles.matchBadgeRow}>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>98% Match</Text>
                </View>
                <Text style={styles.topRecText}>TOP RECOMMENDATION</Text>
              </View>
              
              <Text style={styles.sportTitle}>Sprinting (100m - 200m)</Text>
              <Text style={styles.tierText}>National Tier Potential</Text>
              
              <Text style={styles.sectionLabel}>Key Strengths Detected</Text>
              <View style={styles.tagsContainer}>
                <View style={styles.tag}><Text style={styles.tagText}>Explosive Power (Top 2%)</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>High Stride Frequency</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>Elite Reaction Time</Text></View>
              </View>
              
              <Text style={styles.sectionLabel}>Why this sport?</Text>
              <View style={styles.insightBox}>
                <Text style={styles.insightText}>
                  Your recent countermovement jump data combined with your 10m acceleration split indicates a rare fast-twitch muscle fiber dominance. You possess the biomechanical profile necessary to excel in short-distance explosive events.
                </Text>
              </View>
            </View>

            {/* Next Steps Roadmap */}
            <View style={styles.roadmapCard}>
              <Text style={styles.roadmapTitle}>Next Steps Roadmap</Text>
              
              <View style={styles.roadmapList}>
                <View style={styles.roadmapItem}>
                  <MaterialIcons name="check-circle" size={20} color={colors.onPrimary} />
                  <Text style={styles.roadmapItemText}>Join a local track club</Text>
                </View>
                <View style={styles.roadmapItem}>
                  <MaterialIcons name="check-circle" size={20} color={colors.onPrimary} />
                  <Text style={styles.roadmapItemText}>Start power-specific training protocol</Text>
                </View>
                <View style={styles.roadmapItem}>
                  <MaterialIcons name="check-circle" size={20} color={colors.onPrimary} />
                  <Text style={styles.roadmapItemText}>Complete advanced flexibility assessment</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.startRoadmapButton}
                onPress={() => navigation.navigate('Main')}
              >
                <Text style={styles.startRoadmapText}>Start Roadmap</Text>
              </TouchableOpacity>
            </View>

            {/* Secondary Recommendations */}
            <Text style={styles.secondaryTitle}>Strong Alternatives</Text>
            
            <View style={styles.secondaryGrid}>
              {/* Alt Card 1 */}
              <View style={styles.secondaryCard}>
                <View style={styles.secondaryHeader}>
                  <View>
                    <View style={styles.matchBadgeSecondary}>
                      <Text style={styles.matchBadgeSecondaryText}>89% Match</Text>
                    </View>
                    <Text style={styles.altSportTitle}>Long Jump</Text>
                    <Text style={styles.altTierText}>Collegiate Tier Potential</Text>
                  </View>
                  <MaterialIcons name="sports-gymnastics" size={32} color={colors.outline} />
                </View>
                
                <Text style={styles.sectionLabelSmall}>Strengths:</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tagSmall}><Text style={styles.tagTextSmall}>Vertical Force</Text></View>
                  <View style={styles.tagSmall}><Text style={styles.tagTextSmall}>Sprint Mechanics</Text></View>
                </View>
              </View>

              {/* Alt Card 2 */}
              <View style={styles.secondaryCard}>
                <View style={styles.secondaryHeader}>
                  <View>
                    <View style={styles.matchBadgeSecondary}>
                      <Text style={styles.matchBadgeSecondaryText}>82% Match</Text>
                    </View>
                    <Text style={styles.altSportTitle}>American Football</Text>
                    <Text style={styles.altTierText}>Varsity Tier Potential</Text>
                  </View>
                  <MaterialIcons name="sports-football" size={32} color={colors.outline} />
                </View>
                
                <Text style={styles.sectionLabelSmall}>Strengths:</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tagSmall}><Text style={styles.tagTextSmall}>Agility</Text></View>
                  <View style={styles.tagSmall}><Text style={styles.tagTextSmall}>Acceleration</Text></View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconBox}>
                <MaterialIcons name="emoji-events" size={40} color={colors.primary} />
              </View>
              <Text style={styles.emptyCardTitle}>No Assessment Data Yet</Text>
              <Text style={styles.emptyCardDesc}>
                Personalized talent identification requires at least one completed physical assessment.
              </Text>

              <View style={styles.focusCard}>
                <Text style={styles.focusLabel}>CURRENT SELECTION</Text>
                <Text style={styles.focusSport}>{primarySport}</Text>
                <Text style={styles.focusNote}>
                  Assessments in speed, agility, and power will benchmark you against national standards for {primarySport} and other Olympic sports.
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.ctaStartBtn}
                onPress={() => navigation.navigate('ChooseSport')}
              >
                <MaterialIcons name="play-arrow" size={20} color={colors.onPrimary} />
                <Text style={styles.ctaStartText}>Start Assessment Battery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Persistent Bottom Navigation */}
      <BottomNavBar activeTab="OverallProgress" navigation={navigation} />
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...typography.brandTitle,
    color: colors.primary,
  },
  profilePicContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  container: {
    padding: spacing.marginMobile,
    paddingBottom: 40,
  },
  titleSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  mainTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
  },
  primaryCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  cardLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  matchBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.sm,
  },
  matchBadge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  matchBadgeText: {
    ...typography.labelBold,
    color: colors.onPrimaryContainer,
  },
  topRecText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  sportTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  tierText: {
    ...typography.labelBold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    ...typography.labelSm,
    color: colors.onBackground,
  },
  insightBox: {
    backgroundColor: colors.surfaceBright,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm,
    borderRadius: 8,
  },
  insightText: {
    ...typography.bodyMd,
    color: colors.onBackground,
  },
  roadmapCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  roadmapTitle: {
    ...typography.headlineMd,
    color: colors.onPrimary,
    marginBottom: spacing.sm,
  },
  roadmapList: {
    gap: 16,
    marginBottom: spacing.lg,
  },
  roadmapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roadmapItemText: {
    ...typography.bodyMd,
    color: colors.onPrimary,
    flex: 1,
  },
  startRoadmapButton: {
    backgroundColor: colors.surfaceContainerLowest,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startRoadmapText: {
    ...typography.labelBold,
    color: colors.primary,
    fontSize: 16,
  },
  secondaryTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  secondaryGrid: {
    gap: spacing.md,
  },
  secondaryCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
  },
  secondaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  matchBadgeSecondary: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  matchBadgeSecondaryText: {
    ...typography.labelBold,
    color: colors.primary,
  },
  altSportTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  altTierText: {
    ...typography.labelBold,
    color: colors.tertiary,
  },
  sectionLabelSmall: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  tagSmall: {
    backgroundColor: colors.surfaceBright,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagTextSmall: {
    ...typography.labelSm,
    color: colors.onBackground,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  emptyContainer: {
    marginTop: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyCardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptyCardDesc: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  focusCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  focusLabel: {
    ...typography.labelSm,
    color: colors.outline,
    letterSpacing: 1,
    marginBottom: 4,
  },
  focusSport: {
    ...typography.headlineSm,
    color: colors.primary,
    marginBottom: 8,
  },
  focusNote: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  ctaStartBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    gap: 8,
  },
  ctaStartText: {
    ...typography.labelBold,
    color: colors.onPrimary,
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainer,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  navText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  }
});
