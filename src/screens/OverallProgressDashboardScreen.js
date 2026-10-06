import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';
import BottomNavBar from '../components/BottomNavBar';
import { getUserProgressMetrics, MOCK_USER_ID } from '../models';

export default function OverallProgressDashboardScreen({ navigation }) {
  const { currentUser, userProfile, DEFAULT_ATHLETE_AVATAR } = useAuth();
  const avatarUri = userProfile?.photoURL || currentUser?.photoURL || DEFAULT_ATHLETE_AVATAR;
  const [metrics, setMetrics] = useState(null);
  const [timeFilter, setTimeFilter] = useState('Week');
  const [selectedSport, setSelectedSport] = useState('Athletics');

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getUserProgressMetrics(currentUser?.uid, timeFilter);
        setMetrics(data);
      } catch (err) {
        console.warn('Failed to load metrics from local DB:', err);
      }
    }
    loadMetrics();
  }, [currentUser?.uid, timeFilter]);

  const isMock = currentUser?.uid === MOCK_USER_ID;
  const isNew = !isMock && (!metrics || metrics?.hasSessions === false);
  const bars = metrics?.weeklyBars || (isMock ? [40, 35, 50, 45, 60, 85, 70] : [0, 0, 0, 0, 0, 0, 0]);
  const days = metrics?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="menu" size={24} color={colors.primary} />
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
        {/* Title & Time Filter */}
        <View style={styles.titleRow}>
          <Text style={styles.mainTitle}>Overall Progress</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, timeFilter === 'Day' && styles.filterButtonActive]}
              onPress={() => setTimeFilter('Day')}
            >
              <Text style={timeFilter === 'Day' ? styles.filterTextActive : styles.filterText}>Day</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, timeFilter === 'Week' && styles.filterButtonActive]}
              onPress={() => setTimeFilter('Week')}
            >
              <Text style={timeFilter === 'Week' ? styles.filterTextActive : styles.filterText}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, timeFilter === 'Month' && styles.filterButtonActive]}
              onPress={() => setTimeFilter('Month')}
            >
              <Text style={timeFilter === 'Month' ? styles.filterTextActive : styles.filterText}>Month</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sports Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll} contentContainerStyle={styles.sportsScrollContent}>
          {['Athletics', 'Football', 'Cricket', 'Strength'].map((sport) => {
            const isActive = selectedSport === sport;
            const iconMap = {
              Athletics: 'directions-run',
              Football: 'sports-soccer',
              Cricket: 'sports-cricket',
              Strength: 'fitness-center'
            };
            return (
              <TouchableOpacity 
                key={sport} 
                style={[styles.sportPill, isActive && styles.sportPillActive]}
                onPress={() => setSelectedSport(sport)}
              >
                <MaterialIcons 
                  name={iconMap[sport] || 'fitness-center'} 
                  size={20} 
                  color={isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant} 
                />
                <Text style={isActive ? styles.sportPillTextActive : styles.sportPillText}>{sport}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Main Chart Section */}
        <View style={styles.chartCard}>
          <View style={styles.cardLeftBorder} />
          
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartLabel}>{metrics?.chartLabel || 'PERFORMANCE TREND'}</Text>
              <Text style={styles.chartTitle}>{metrics?.chartTitle || (isNew ? 'No Assessments Yet' : 'Overall Score')}</Text>
            </View>
            <View style={styles.trendBadge}>
              <MaterialIcons name={isNew ? "info-outline" : "trending-up"} size={16} color={colors.primary} />
              <Text style={styles.trendBadgeText}>{metrics?.trendBadge || (isNew ? '0%' : '+12%')}</Text>
            </View>
          </View>

          {/* Simple Bar Chart */}
          <View style={styles.chartArea}>
            <View style={styles.chartBars}>
              {bars.map((height, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.bar, 
                    { height: `${Math.max(height, 4)}%`, opacity: height > 0 ? 1 : 0.15 },
                    index === (bars.length - 2) && height > 0 && styles.barActive
                  ]} 
                />
              ))}
            </View>
            <View style={styles.chartXAxis}>
              {days.map((day, index) => (
                <Text key={index} style={[styles.axisLabel, index === (days.length - 2) && !isNew && styles.axisLabelActive]}>{day}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* View Recommendations CTA */}
        <TouchableOpacity 
          style={styles.recommendationCta}
          onPress={() => navigation.navigate('SportsRecommendation')}
        >
          <View style={styles.recommendationCtaLeft}>
            <MaterialIcons name="emoji-events" size={24} color={colors.primary} />
            <Text style={styles.recommendationCtaText}>View AI Recommendations</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Activity Summary */}
        <Text style={styles.sectionTitle}>Activity Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBox, { backgroundColor: colors.tertiaryContainer }]}>
              <MaterialIcons name="assignment-turned-in" size={24} color={colors.onTertiaryContainer} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total Tests Completed</Text>
              <Text style={styles.summaryValue}>{metrics?.totalTests ?? 0}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBox, { backgroundColor: colors.secondaryContainer }]}>
              <MaterialIcons name="event-available" size={24} color={colors.onSecondaryContainer} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>{metrics?.activeLabel || 'Active Days (This Week)'}</Text>
              <Text style={styles.summaryValue}>{metrics?.activeValue || (isMock ? '6 / 7' : '0 / 7')}</Text>
            </View>
          </View>
        </View>

        {/* Recent Tests */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Tests</Text>
          <TouchableOpacity 
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('AssessmentHistory')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.recentList}>
          {(metrics?.recentTests && metrics.recentTests.length > 0) ? (
            metrics.recentTests.map((item, idx) => (
              <TouchableOpacity 
                key={item.id || idx} 
                style={styles.recentItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('AssessmentResults', { 
                  session: { 
                    ...item, 
                    score: item.scoreText, 
                    description: item.feedback 
                  } 
                })}
              >
                <View style={styles.recentItemLeft}>
                  <View style={styles.recentIconBox}>
                    <MaterialIcons name={item.icon || 'fitness-center'} size={20} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.recentItemTitle}>{item.title}</Text>
                    <Text style={styles.recentItemSub}>{item.dateText}</Text>
                  </View>
                </View>
                <View style={styles.recentItemRight}>
                  <View style={styles.recentScoreRow}>
                    <Text style={styles.recentScoreText}>{item.scoreText}</Text>
                    {item.badge === 'Personal Best' ? (
                      <MaterialIcons name="star" size={14} color={colors.primary} />
                    ) : (
                      <MaterialIcons name="arrow-upward" size={14} color={colors.success} />
                    )}
                  </View>
                  <Text style={[styles.recentScoreLabel, item.badge === 'Personal Best' && { color: colors.primary, fontWeight: '700' }]}>
                    {item.badge}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.recentItem, { justifyContent: 'center', paddingVertical: 18 }]}>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 13, textAlign: 'center' }}>
                No assessments completed yet
              </Text>
            </View>
          )}
        </View>

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
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
    borderRadius: 20,
  },
  headerTitle: {
    ...typography.brandTitle,
    color: colors.primary,
  },
  profilePicContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surfaceVariant,
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  container: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
    paddingBottom: 100, // Space for bottom nav
  },
  titleRow: {
    flexDirection: 'column', // Stack on mobile
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  mainTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.3)',
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryContainer,
  },
  filterText: {
    ...typography.labelBold,
    color: colors.onSurfaceVariant,
  },
  filterTextActive: {
    ...typography.labelBold,
    color: colors.onPrimaryContainer,
  },
  sportsScroll: {
    marginHorizontal: -spacing.marginMobile,
    marginBottom: spacing.md,
  },
  sportsScrollContent: {
    paddingHorizontal: spacing.marginMobile,
    gap: spacing.sm,
    paddingVertical: 8,
  },
  sportPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.5)',
  },
  sportPillActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  sportPillText: {
    ...typography.labelBold,
    color: colors.onSurfaceVariant,
  },
  sportPillTextActive: {
    ...typography.labelBold,
    color: colors.onPrimaryContainer,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.3)',
    padding: spacing.md,
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chartLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  chartTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  trendBadgeText: {
    ...typography.labelBold,
    color: colors.primary,
  },
  chartArea: {
    height: 200,
    marginTop: spacing.md,
    justifyContent: 'flex-end',
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  bar: {
    width: '10%',
    backgroundColor: colors.surfaceVariant,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barActive: {
    backgroundColor: colors.primary,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 197, 217, 0.2)',
  },
  axisLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontSize: 10,
  },
  axisLabelActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  summaryGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.3)',
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  summaryValue: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  summaryValueSub: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  viewAllText: {
    ...typography.labelBold,
    color: colors.primary,
  },
  recentList: {
    gap: 8,
  },
  recentItem: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.3)',
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 85, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentItemTitle: {
    ...typography.bodyLg,
    color: colors.onSurface,
    fontWeight: '600',
  },
  recentItemSub: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  recentItemRight: {
    alignItems: 'flex-end',
  },
  recentScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentScoreText: {
    ...typography.labelBold,
    color: colors.primary,
  },
  recentScoreLabel: {
    ...typography.labelSm,
    color: colors.tertiary,
    marginTop: 2,
  },
  recommendationCta: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    padding: 16,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendationCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendationCtaText: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.primary,
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
  navItemActive: {
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  navText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  navTextActive: {
    ...typography.labelSm,
    color: colors.onPrimaryContainer,
    fontWeight: '600',
    marginTop: 4,
  },
});
