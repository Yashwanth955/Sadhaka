import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const events = [
  { id: 'athletics-sprint', name: 'Sprint', icon: 'speed', desc: '30m, Jumps, Reaction' },
  { id: 'athletics-distance', name: 'Distance Running', icon: 'directions-run', desc: 'Beep Test, 1.6km, Endurance' },
  { id: 'athletics-longjump', name: 'Long Jump', icon: 'height', desc: 'Jumps, Sprint, Flexibility' },
  { id: 'athletics-throwing', name: 'Throwing', icon: 'sports-handball', desc: 'Throws, Push-Ups, Power' },
];

export default function ChooseEventScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Athletics Events</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Choose Event</Text>
          <Text style={styles.pageSubtitle}>Select an athletics discipline to view specific assessments.</Text>
        </View>

        <View style={styles.gridContainer}>
          {events.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => navigation.navigate('SportAssessments', { sportId: event.id, sportName: `Athletics - ${event.name}` })}
            >
              <View style={styles.cardIconWrapper}>
                <MaterialIcons name={event.icon} size={32} color={colors.onPrimaryContainer} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.eventCardTitle}>{event.name}</Text>
                <Text style={styles.eventCardDesc}>{event.desc}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { paddingHorizontal: spacing.marginMobile, paddingTop: spacing.md, paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile, paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant,
  },
  iconButton: { padding: spacing.base },
  headerTitle: { ...typography.headlineMd, color: colors.primary },
  titleSection: { marginBottom: spacing.lg },
  pageTitle: { ...typography.displayLg, fontSize: 32, lineHeight: 40, color: colors.primary, marginBottom: spacing.xs },
  pageSubtitle: { ...typography.bodyLg, color: colors.onSurfaceVariant },
  gridContainer: { gap: spacing.md },
  eventCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: borderRadius.xl,
    borderWidth: 1, borderColor: colors.outlineVariant, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardIconWrapper: {
    width: 56, height: 56, backgroundColor: colors.primaryContainer,
    borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  cardContent: { flex: 1 },
  eventCardTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: 4 },
  eventCardDesc: { ...typography.bodyMd, color: colors.onSurfaceVariant },
});
