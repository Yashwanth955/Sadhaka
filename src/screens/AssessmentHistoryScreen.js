import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width } = Dimensions.get('window');

const dates = [
  { day: 'MON', date: '12', state: 'past' },
  { day: 'TUE', date: '13', state: 'past' },
  { day: 'WED', date: '14', state: 'active' },
  { day: 'THU', date: '15', state: 'future' },
  { day: 'FRI', date: '16', state: 'future' },
  { day: 'SAT', date: '17', state: 'future' },
  { day: 'SUN', date: '18', state: 'future' },
];

const activityData = [
  {
    id: '1',
    category: 'SPEED',
    time: '08:30 AM',
    title: '30m Sprint',
    description: 'Linear acceleration testing block.',
    score: '4.12s',
    trend: 'down',
    trendText: '-0.08s (PB)',
    trendColor: colors.primary,
  },
  {
    id: '2',
    category: 'AGILITY',
    time: '09:15 AM',
    title: 'Arrowhead Agility',
    description: 'Change of direction deficit mapping.',
    score: '8.45s',
    trend: 'flat',
    trendText: 'Avg Baseline',
    trendColor: colors.onSurfaceVariant,
  },
  {
    id: '3',
    category: 'POWER',
    time: '10:00 AM',
    title: 'CMJ Profile',
    description: 'Force plate analysis (Dual).',
    score: '52cm',
    trend: 'down',
    trendText: '-2cm (Fatigue)',
    trendColor: colors.error,
  }
];

export default function AssessmentHistoryScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sadhaka</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Date Scrubber */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.dateScrubberContainer}
          contentContainerStyle={styles.dateScrubberContent}
        >
          {dates.map((item, index) => {
            let containerStyle = styles.dateBox;
            let dayStyle = styles.dateDay;
            let numStyle = styles.dateNum;

            if (item.state === 'active') {
              containerStyle = [styles.dateBox, styles.dateBoxActive];
              dayStyle = [styles.dateDay, { color: colors.onPrimaryContainer }];
              numStyle = [styles.dateNum, { color: colors.onPrimaryContainer }];
            } else if (item.state === 'future') {
              containerStyle = [styles.dateBox, styles.dateBoxFuture];
              dayStyle = [styles.dateDay, { color: colors.onSurfaceVariant }];
              numStyle = [styles.dateNum, { color: colors.onSurfaceVariant }];
            }

            return (
              <TouchableOpacity key={index} style={containerStyle} disabled={item.state === 'future'}>
                <Text style={dayStyle}>{item.day}</Text>
                <Text style={numStyle}>{item.date}</Text>
                {item.state === 'active' && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL TESTS</Text>
            <Text style={styles.statValue}>4</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>INTENSITY</Text>
            <Text style={styles.statValue}>HIGH</Text>
          </View>
        </View>

        {/* Activity List */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>Today's Log</Text>
          <TouchableOpacity style={styles.pdfBtn}>
            <MaterialIcons name="picture-as-pdf" size={16} color={colors.onPrimaryContainer} />
            <Text style={styles.pdfBtnText}>Generate PDF Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {activityData.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{item.category}</Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.scoreText}>{item.score}</Text>
                  <View style={styles.trendRow}>
                    <MaterialIcons 
                      name={item.trend === 'flat' ? 'trending-flat' : item.trend === 'up' ? 'trending-up' : 'trending-down'} 
                      size={16} 
                      color={item.trendColor} 
                    />
                    <Text style={[styles.trendText, { color: item.trendColor }]}>{item.trendText}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.insightsBtn}
                  onPress={() => navigation.navigate('AssessmentResults')}
                >
                  <Text style={styles.insightsBtnText}>VIEW INSIGHTS</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
          <MaterialIcons name="dashboard" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChooseSport')}>
          <MaterialIcons name="fitness-center" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navText}>Assessments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="history" size={24} color={colors.onPrimaryContainer} />
          <Text style={styles.navTextActive}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    ...typography.brandTitle,
    color: colors.primary,
  },
  container: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.md,
    paddingBottom: 100, // space for bottom nav
  },
  dateScrubberContainer: {
    marginBottom: spacing.lg,
  },
  dateScrubberContent: {
    gap: 16,
    paddingRight: spacing.marginMobile,
  },
  dateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    minWidth: 70,
  },
  dateBoxActive: {
    backgroundColor: colors.primaryContainer,
    borderWidth: 2,
    borderColor: colors.onBackground,
    transform: [{ scale: 1.05 }],
  },
  dateBoxFuture: {
    backgroundColor: colors.surfaceContainerLowest,
    opacity: 0.6,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  dateDay: {
    ...typography.labelSm,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    marginBottom: 4,
    letterSpacing: 1,
  },
  dateNum: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.onBackground,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
  },
  statLabel: {
    ...typography.labelSm,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    marginBottom: 8,
    letterSpacing: 1,
  },
  statValue: {
    ...typography.headlineLgMobile,
    color: colors.primary,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  listHeaderTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pdfBtnText: {
    ...typography.labelSm,
    fontWeight: '700',
    color: colors.onPrimaryContainer,
  },
  cardsContainer: {
    gap: spacing.md,
  },
  activityCard: {
    backgroundColor: '#F4FFD4', // Given in design
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#e2edc4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.sm,
  },
  categoryPill: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#1a1d10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryPillText: {
    ...typography.labelSm,
    fontWeight: '700',
    color: '#1a1d10',
  },
  timeText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  cardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  cardDesc: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreText: {
    fontSize: 32,
    fontFamily: typography.headlineLgMobile.fontFamily,
    fontWeight: '700',
    color: colors.onBackground,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    ...typography.labelSm,
    fontWeight: '700',
  },
  insightsBtn: {
    backgroundColor: '#121212',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  insightsBtnText: {
    ...typography.labelSm,
    fontWeight: '700',
    color: '#FFF',
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
    borderRadius: 20,
  },
  navText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  navTextActive: {
    ...typography.labelSm,
    color: colors.onPrimaryContainer,
    marginTop: 4,
  }
});
