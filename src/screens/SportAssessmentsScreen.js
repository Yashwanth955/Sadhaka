import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';
import { getTestsForSport } from '../data/sportsData';

export default function SportAssessmentsScreen({ route, navigation }) {
  const { sportId, sportName } = route.params || { sportId: 'cricket', sportName: 'Cricket' };
  
  const assessments = getTestsForSport(sportId);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Scouting Mode</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <MaterialIcons name="fitness-center" size={32} color={colors.primary} />
            <Text style={styles.title}>{sportName} Assessments</Text>
          </View>
          <Text style={styles.subtitle}>
            Select an assessment below to begin AI-powered motion capture.
          </Text>
        </View>

        {/* Assessment List */}
        <View style={styles.listContainer}>
          {assessments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.tagsContainer}>
                  <View style={styles.tagPrimary}>
                    <Text style={styles.tagPrimaryText}>{item.category}</Text>
                  </View>
                  <View style={styles.tagSecondary}>
                    <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
                    <Text style={styles.tagSecondaryText}>{item.duration}</Text>
                  </View>
                </View>
                <View style={styles.difficultyContainer}>
                  <MaterialIcons name={item.difficultyIcon} size={16} color={colors.tertiaryContainer} />
                  <Text style={styles.difficultyText}>{item.difficulty}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>

              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => navigation.navigate('TestInstructions', { testId: item.id, testName: item.title })}
                >
                  <Text style={styles.startButtonText}>Start Test</Text>
                  <MaterialIcons name="play-arrow" size={20} color={colors.onPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    ...typography.labelBold,
    color: colors.primary,
    marginLeft: 8,
  },
  badge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  container: {
    padding: spacing.marginMobile,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onBackground,
    marginLeft: 12,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  listContainer: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagPrimary: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagPrimaryText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  tagSecondary: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  tagSecondaryText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  cardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 8,
  },
  cardDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant + '80',
    paddingTop: 16,
    alignItems: 'flex-end',
  },
  startButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  startButtonText: {
    ...typography.labelBold,
    color: colors.onPrimary,
    marginRight: 8,
  },
});
