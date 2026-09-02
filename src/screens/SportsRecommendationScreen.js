import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function SportsRecommendationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="sports-score" size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>Sadhaka</Text>
        </View>
        <View style={styles.profilePicContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCANmvZLE5nXBBGhfBl0QgxbZvH2zgJ6-ArTd7sVVHXNUdH62ajVXIEKBuWrJHzSwh4mNyruufyv9-QDX96aibFmoGZe6Vj9lsAxXqhINz-v1gTTis50zbUTJOEJjwf037V-CHHz-RUSPWlwpsoG8-fzb9UvocagW7SyYqXAx-bg5skhKzrtB9imQjxZZUhe0AX23fsDyoYsR86kK4XKRT3PtUkvWHR13Saqum2etHt1UTC5L2c5Cob' }}
            style={styles.profilePic}
          />
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Your Top Potential</Text>
          <Text style={styles.subtitle}>AI Analysis based on your speed, power, and agility benchmarks.</Text>
        </View>

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
        
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
          <MaterialIcons name="dashboard" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChooseSport')}>
          <MaterialIcons name="fitness-center" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navText}>Assess</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OverallProgress')}>
          <MaterialIcons name="psychology" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navText}>Insights</Text>
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
  headerTitle: {
    ...typography.headlineMd,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
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
  navText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  }
});
