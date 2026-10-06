import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../contexts/AuthContext';
import { getSessionHistory, getTestsFromLocalDb, MOCK_USER_ID } from '../models';

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

export default function AssessmentHistoryScreen({ navigation }) {
  const { currentUser } = useAuth();
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate dynamic last 7 days (today and preceding 6 days)
  const scrubberDates = React.useMemo(() => {
    const now = new Date();
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      list.push({
        id: d.toISOString().split('T')[0],
        day: dayNames[d.getDay()],
        date: String(d.getDate()).padStart(2, '0'),
        isToday: i === 0
      });
    }
    return list;
  }, []);

  const [selectedDateId, setSelectedDateId] = useState(scrubberDates[scrubberDates.length - 1]?.id);

  useEffect(() => {
    async function loadHistory() {
      try {
        const isMock = currentUser?.uid === MOCK_USER_ID;
        const uid = currentUser?.uid;
        let history = [];
        if (isMock) {
          history = await getSessionHistory(MOCK_USER_ID);
        } else if (uid) {
          history = await getSessionHistory(uid);
        }
        const tests = await getTestsFromLocalDb();
        const testMap = {};
        tests.forEach(t => { testMap[t.id] = t; });

        const formatted = (history || []).map((s, idx) => {
          const def = testMap[s.exerciseType] || {};
          const unit = def.benchmarkUnit || '';
          const date = new Date(s.createdAt);
          const dateId = date.toISOString().split('T')[0];
          const timeText = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            id: s.id ? String(s.id) : String(idx),
            dateId,
            category: (def.category || 'FITNESS').toUpperCase(),
            time: timeText || 'Today',
            title: def.name || s.exerciseType,
            description: s.feedback || def.shortDescription || 'Completed assessment trial with posture validation.',
            score: `${s.score}${unit ? ' ' + unit : ''}`.trim(),
            trend: idx === 0 ? 'up' : 'flat',
            trendText: idx === 0 ? 'Personal Best' : 'Verified Valid',
            trendColor: idx === 0 ? colors.primary : colors.success,
          };
        });
        setAllSessions(formatted);
      } catch (err) {
        console.warn('Error loading history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [currentUser?.uid]);

  const filteredSessions = allSessions.filter(s => s.dateId === selectedDateId);
  const selectedDateItem = scrubberDates.find(d => d.id === selectedDateId) || scrubberDates[scrubberDates.length - 1];
  const isToday = selectedDateItem?.isToday;

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
          {scrubberDates.map((item) => {
            const isSelected = item.id === selectedDateId;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.dateBox, isSelected && styles.dateBoxActive]}
                onPress={() => setSelectedDateId(item.id)}
              >
                <Text style={[styles.dateDay, isSelected && { color: colors.onPrimaryContainer, fontWeight: '700' }]}>{item.day}</Text>
                <Text style={[styles.dateNum, isSelected && { color: colors.onPrimaryContainer, fontWeight: '800' }]}>{item.date}</Text>
                {isSelected && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL TESTS</Text>
            <Text style={styles.statValue}>{filteredSessions.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>INTENSITY</Text>
            <Text style={styles.statValue}>{filteredSessions.length >= 2 ? 'HIGH' : (filteredSessions.length === 1 ? 'MODERATE' : 'REST')}</Text>
          </View>
        </View>

        {/* Activity List */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>
            {isToday ? "Today's Log" : `${selectedDateItem?.day} (${selectedDateItem?.date}) Log`}
          </Text>
          <TouchableOpacity style={styles.pdfBtn}>
            <MaterialIcons name="picture-as-pdf" size={16} color={colors.onPrimaryContainer} />
            <Text style={styles.pdfBtnText}>Generate PDF</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {filteredSessions.length > 0 ? (
            filteredSessions.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.activityCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AssessmentResults', { session: item })}
              >
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
                    onPress={() => navigation.navigate('AssessmentResults', { session: item })}
                  >
                    <Text style={styles.insightsBtnText}>VIEW RESULTS</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.activityCard, { alignItems: 'center', paddingVertical: 24 }]}>
              <MaterialIcons name={allSessions.length === 0 ? "fitness-center" : "event-busy"} size={36} color={colors.outline} />
              <Text style={[styles.cardTitle, { marginTop: 8, color: colors.onSurfaceVariant }]}>
                {allSessions.length === 0 ? "No Assessments Yet" : "Rest / Recovery Day"}
              </Text>
              <Text style={[styles.cardDesc, { textAlign: 'center', marginTop: 4 }]}>
                {allSessions.length === 0 
                  ? "No assessment sessions recorded yet. Start a new assessment to see your progress." 
                  : "No tests recorded on this date. Tap another date or perform a new assessment."}
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
