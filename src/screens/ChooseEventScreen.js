import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const events = [
  { 
    id: 'athletics-sprint', 
    name: 'Sprint', 
    icon: 'speed', 
    desc: '30m, Jumps, Reaction',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'athletics-distance', 
    name: 'Distance Running', 
    icon: 'directions-run', 
    desc: 'Beep Test, 1.6km, Endurance',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'athletics-longjump', 
    name: 'Long Jump', 
    icon: 'height', 
    desc: 'Jumps, Sprint, Flexibility',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'athletics-throwing', 
    name: 'Throwing', 
    icon: 'sports-handball', 
    desc: 'Throws, Push-Ups, Power',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
];

export default function ChooseEventScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sadhaka</Text>
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
              onPress={() => navigation.navigate('SportAssessments', { 
                sportId: event.id, 
                sportName: `Athletics - ${event.name}`,
                sportImage: event.image
              })}
            >
              <Image source={{ uri: event.image }} style={styles.cardImageThumb} />
              <View style={styles.cardContent}>
                <View style={styles.tagRow}>
                  <MaterialIcons name={event.icon} size={16} color={colors.primary} />
                  <Text style={styles.eventCardTitle}>{event.name}</Text>
                </View>
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
  headerTitle: { ...typography.brandTitle, color: colors.primary },
  titleSection: { marginBottom: spacing.lg },
  pageTitle: { ...typography.displayLg, fontSize: 32, lineHeight: 40, color: colors.primary, marginBottom: spacing.xs },
  pageSubtitle: { ...typography.bodyLg, color: colors.onSurfaceVariant },
  gridContainer: { gap: spacing.md },
  eventCard: {
    backgroundColor: colors.surfaceContainerLowest, 
    borderRadius: borderRadius.xl,
    borderWidth: 1, 
    borderColor: colors.outlineVariant, 
    padding: spacing.md,
    flexDirection: 'row', 
    alignItems: 'center', 
    overflow: 'hidden',
  },
  cardImageThumb: {
    width: 64, 
    height: 64, 
    borderRadius: borderRadius.md, 
    marginRight: spacing.md,
    backgroundColor: colors.surfaceContainerHighest,
  },
  cardContent: { flex: 1 },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eventCardTitle: { ...typography.headlineMd, fontSize: 18, color: colors.onSurface },
  eventCardDesc: { ...typography.bodyMd, fontSize: 13, color: colors.onSurfaceVariant },
});
