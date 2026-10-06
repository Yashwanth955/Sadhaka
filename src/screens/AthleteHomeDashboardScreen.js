import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getUserProgressMetrics, MOCK_USER_ID } from '../models';

export default function AthleteHomeDashboardScreen({ navigation }) {
  const { currentUser, userProfile, DEFAULT_ATHLETE_AVATAR } = useAuth();
  const [userData, setUserData] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser?.uid) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.warn("Error fetching user data:", error);
        }
      }

      try {
        const dbMetrics = await getUserProgressMetrics(currentUser?.uid);
        setMetrics(dbMetrics);
      } catch (err) {
        console.warn("Error fetching metrics from local DB:", err);
      }
    }
    fetchUserData();
  }, [currentUser]);

  const isMockUser = currentUser?.uid === MOCK_USER_ID;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="menu" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sadhaka</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: userProfile?.photoURL || currentUser?.photoURL || DEFAULT_ATHLETE_AVATAR }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Good morning, {currentUser?.displayName?.split(' ')[0] || userProfile?.fullName?.split(' ')[0] || 'Athlete'} 👋</Text>
          <Text style={styles.greetingSubtitle}>Ready to discover your sporting potential?</Text>
        </View>

        {/* Performance Score Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>OVERALL READINESS SCORE</Text>
          <Text style={styles.heroScore}>
            {!metrics?.hasSessions ? '--' : (metrics?.readinessScore ?? '--')}
          </Text>
          <View style={styles.trendPill}>
            <MaterialIcons name={!metrics?.hasSessions ? "info-outline" : "trending-up"} size={18} color={colors.onPrimary} />
            <Text style={styles.trendText}>
              {!metrics?.hasSessions ? "No assessments yet" : "+4 from last session"}
            </Text>
          </View>
        </View>

        {/* Start Assessment CTA */}
        <View style={styles.ctaSection}>
          <PrimaryButton
            title="Start Assessment"
            style={styles.assessmentButton}
            textStyle={styles.assessmentButtonText}
            onPress={() => navigation.navigate('ChooseSport')}
          />
        </View>

        {/* Today's Status */}
        <TouchableOpacity 
          style={styles.statusCard}
          onPress={() => navigation.navigate('AssessmentHistory')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MaterialIcons name="today" size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Today's Status</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={styles.detailsLink}>Tap for details</Text>
              <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusRowLeft}>
              <MaterialIcons name="local-fire-department" size={20} color={colors.outline} />
              <Text style={styles.statusLabel}>Training streak</Text>
            </View>
            <Text style={styles.statusValue}>{metrics?.hasSessions ? (metrics?.trainingStreak ?? 0) : 0} days</Text>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusRowLeft}>
              <MaterialIcons name="check-circle-outline" size={20} color={colors.outline} />
              <Text style={styles.statusLabel}>Goals completed</Text>
            </View>
            <Text style={styles.statusValue}>{metrics?.hasSessions ? (metrics?.activeDaysThisWeek || '5/7') : '0/7'}</Text>
          </View>

          <View style={[styles.statusRow, styles.statusRowLast]}>
            <View style={styles.statusRowLeft}>
              <MaterialIcons name="assessment" size={20} color={colors.outline} />
              <Text style={styles.statusLabel}>Assessment status</Text>
            </View>
            <TouchableOpacity 
              style={styles.readyBadge}
              onPress={() => navigation.navigate('AILiveAssessment')}
            >
              <Text style={styles.readyBadgeText}>Live Pose AI ›</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Recommended Sports */}
        <TouchableOpacity 
          style={styles.recommendedCard}
          onPress={() => navigation.navigate('SportsRecommendation')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MaterialIcons name="emoji-events" size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Recommended Sports</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={styles.detailsLink}>View AI Details</Text>
              <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
            </View>
          </View>

          {(isMockUser && metrics?.hasSessions) ? (
            <>
              <View style={styles.sportItem}>
                <View style={styles.sportItemLeft}>
                  <Text style={styles.medalEmoji}>🥇</Text>
                  <Text style={styles.sportName}>{userData?.primarySport || userProfile?.primarySport || metrics?.profile?.primarySport || 'Cricket'}</Text>
                </View>
                <Text style={styles.sportScore}>92%</Text>
              </View>
              <View style={styles.sportItem}>
                <View style={styles.sportItemLeft}>
                  <Text style={styles.medalEmoji}>🥈</Text>
                  <Text style={styles.sportName}>Kabaddi</Text>
                </View>
                <Text style={styles.sportScore}>87%</Text>
              </View>
              <View style={styles.sportItem}>
                <View style={styles.sportItemLeft}>
                  <Text style={styles.medalEmoji}>🥉</Text>
                  <Text style={styles.sportName}>Hockey</Text>
                </View>
                <Text style={styles.sportScore}>82%</Text>
              </View>
            </>
          ) : (
            <View style={styles.emptySportsContainer}>
              <View style={styles.emptySportsRow}>
                <MaterialIcons name="sports" size={20} color={colors.primary} />
                <Text style={styles.emptySportsFocus}>Primary Focus: <Text style={styles.emptySportsSport}>{userProfile?.primarySport || userData?.primarySport || 'Cricket'}</Text></Text>
              </View>
              <Text style={styles.emptySportsText}>
                Complete fitness assessments to calculate your AI talent identification and sports suitability scores.
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Progress Chart */}
        <TouchableOpacity 
          style={styles.progressCard}
          onPress={() => navigation.navigate('OverallProgress')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MaterialIcons name="insights" size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Weekly Progress</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {(metrics?.weeklyBars || (metrics?.hasSessions ? [40, 45, 55, 50, 70, 85, 95] : [0, 0, 0, 0, 0, 0, 0])).map((val, idx) => (
              <View key={idx} style={styles.chartBarWrapper}>
                <View style={[styles.chartBar, { height: `${Math.max(val, 4)}%`, opacity: val > 0 ? (0.2 + (val / 100)) : 0.08 }]} />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            {(metrics?.days || ['M', 'T', 'W', 'T', 'F', 'S', 'S']).map((day, idx) => (
              <Text key={idx} style={styles.chartDayText}>{typeof day === 'string' ? day[0] : day}</Text>
            ))}
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Persistent Bottom Navigation */}
      <BottomNavBar activeTab="Main" navigation={navigation} />
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
  container: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
    paddingBottom: 100, // For bottom nav
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
  },
  iconButton: {
    padding: spacing.base,
  },
  headerTitle: {
    ...typography.brandTitle,
    color: colors.primary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  greetingSection: {
    marginBottom: spacing.md,
  },
  greetingTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  greetingSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroLabel: {
    ...typography.labelBold,
    color: colors.primaryFixed,
    marginBottom: spacing.xs,
  },
  heroScore: {
    ...typography.displayLg,
    color: colors.onPrimary,
    fontSize: 80,
    lineHeight: 88,
    marginBottom: spacing.xs,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  trendText: {
    ...typography.labelBold,
    color: colors.onPrimary,
  },
  ctaSection: {
    marginBottom: spacing.md,
  },
  assessmentButton: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
  },
  assessmentButtonText: {
    color: colors.onPrimaryContainer,
  },
  statusCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardTitle: {
    ...typography.headlineMd,
    fontSize: 20,
    color: colors.onSurface,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsLink: {
    ...typography.labelSm,
    color: colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
    paddingBottom: 12,
    marginBottom: 12,
  },
  statusRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  statusRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusLabel: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  statusValue: {
    ...typography.labelBold,
    color: colors.onSurface,
    fontSize: 16,
  },
  readyBadge: {
    backgroundColor: colors.tertiaryFixed + '80',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  readyBadgeText: {
    ...typography.labelBold,
    color: colors.tertiaryContainer,
  },
  recommendedCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  sportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    marginBottom: spacing.xs,
  },
  sportItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  medalEmoji: {
    fontSize: 24,
  },
  sportName: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
  },
  sportScore: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.primary,
  },
  emptySportsContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  emptySportsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  emptySportsFocus: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  emptySportsSport: {
    color: colors.primary,
    fontWeight: '700',
  },
  emptySportsText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  progressCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  chartContainer: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: 8,
  },
  chartBarWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    width: '100%',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  chartDayText: {
    ...typography.labelBold,
    color: colors.outline,
    textAlign: 'center',
    flex: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant + '40',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  navItemText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  navItemTextActive: {
    ...typography.labelSm,
    color: colors.onPrimaryContainer,
    marginTop: 4,
  },
});
