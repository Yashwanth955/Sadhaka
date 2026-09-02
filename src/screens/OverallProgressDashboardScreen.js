import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function OverallProgressDashboardScreen({ navigation }) {
  const bars = [40, 35, 50, 45, 60, 85, 70];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
        <View style={styles.profilePicContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO1k7Qz65ILRJomssuQwaTHvIX4HPWW37T3mrtWUWSdbfXhu8R2K3DANOMM55nSrZjQwjZ2Ucgzie9aq5W135wzW5QC0CtmaGX0aQXXUVxITCXlnZhHwEnbE9ws_gseHhiVaTWKQX98NPFOi0Gf40sQdkrsejvxOHYsYD5_R9wnvqBwQoQ9sd0r6zfjahQoIa5Cs4EgLZrdpdeICJj3ijJVDmzOF2k1V654P22OdN3KldhYINWprDS' }}
            style={styles.profilePic}
          />
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title & Time Filter */}
        <View style={styles.titleRow}>
          <Text style={styles.mainTitle}>Overall Progress</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Day</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
              <Text style={styles.filterTextActive}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Month</Text></TouchableOpacity>
          </View>
        </View>

        {/* Sports Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll} contentContainerStyle={styles.sportsScrollContent}>
          <TouchableOpacity style={[styles.sportPill, styles.sportPillActive]}>
            <MaterialIcons name="directions-run" size={20} color={colors.onPrimaryContainer} />
            <Text style={styles.sportPillTextActive}>Athletics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sportPill}>
            <MaterialIcons name="sports-soccer" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.sportPillText}>Football</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sportPill}>
            <MaterialIcons name="sports-cricket" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.sportPillText}>Cricket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sportPill}>
            <MaterialIcons name="fitness-center" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.sportPillText}>Strength</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Main Chart Section */}
        <View style={styles.chartCard}>
          <View style={styles.cardLeftBorder} />
          
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartLabel}>PERFORMANCE TREND</Text>
              <Text style={styles.chartTitle}>Overall Score</Text>
            </View>
            <View style={styles.trendBadge}>
              <MaterialIcons name="trending-up" size={16} color={colors.primary} />
              <Text style={styles.trendBadgeText}>+12%</Text>
            </View>
          </View>

          {/* Simple Bar Chart Mock */}
          <View style={styles.chartArea}>
            <View style={styles.chartBars}>
              {bars.map((height, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.bar, 
                    { height: `${height}%` },
                    index === 5 && styles.barActive
                  ]} 
                />
              ))}
            </View>
            <View style={styles.chartXAxis}>
              {days.map((day, index) => (
                <Text key={index} style={[styles.axisLabel, index === 5 && styles.axisLabelActive]}>{day}</Text>
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
              <Text style={styles.summaryValue}>24</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBox, { backgroundColor: colors.secondaryContainer }]}>
              <MaterialIcons name="event-available" size={24} color={colors.onSecondaryContainer} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Active Days (This Week)</Text>
              <Text style={styles.summaryValue}>5 <Text style={styles.summaryValueSub}>/ 7</Text></Text>
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
          {/* Item 1 */}
          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentItemLeft}>
              <View style={styles.recentIconBox}>
                <MaterialIcons name="timer" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.recentItemTitle}>100m Sprint</Text>
                <Text style={styles.recentItemSub}>Athletics • Oct 24, 2023</Text>
              </View>
            </View>
            <View style={styles.recentItemRight}>
              <View style={styles.recentScoreRow}>
                <Text style={styles.recentScoreText}>11.2s</Text>
                <MaterialIcons name="arrow-downward" size={16} color={colors.primary} />
              </View>
              <Text style={styles.recentScoreLabel}>Personal Best</Text>
            </View>
          </TouchableOpacity>

          {/* Item 2 */}
          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentItemLeft}>
              <View style={styles.recentIconBox}>
                <MaterialIcons name="height" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.recentItemTitle}>Vertical Jump</Text>
                <Text style={styles.recentItemSub}>Strength • Oct 22, 2023</Text>
              </View>
            </View>
            <View style={styles.recentItemRight}>
              <View style={styles.recentScoreRow}>
                <Text style={[styles.recentScoreText, { color: colors.onSurface }]}>65 cm</Text>
              </View>
              <Text style={[styles.recentScoreLabel, { color: colors.onSurfaceVariant }]}>Top 15%</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Main')}
        >
          <MaterialIcons name="dashboard" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('ChooseSport')}
        >
          <MaterialIcons name="fitness-center" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navText}>Assess</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="psychology" size={24} color={colors.onPrimaryContainer} />
          <Text style={styles.navTextActive}>Insights</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <MaterialIcons name="person" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navText}>Profile</Text>
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
    ...typography.headlineMd,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
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
    borderTopColor: 'rgba(195, 197, 217, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
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
