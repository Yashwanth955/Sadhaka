import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { getTestsForSport, sportsImageMap } from '../data/sportsData';
import { getSportById, getTestById } from '../services/localDb';

export default function SportAssessmentsScreen({ route, navigation }) {
  const { sportId, sportName, sportImage } = route.params || { sportId: 'cricket', sportName: 'Cricket' };
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const bannerImage = sportImage || sportsImageMap[sportId] || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    async function loadSportAssessmentsFromDb() {
      try {
        const sportDoc = await getSportById(sportId);
        if (sportDoc && Array.isArray(sportDoc.testIds) && sportDoc.testIds.length > 0) {
          const loadedTests = [];
          for (const tId of sportDoc.testIds) {
            const testDoc = await getTestById(tId);
            if (testDoc) {
              loadedTests.push({
                id: testDoc.id,
                title: testDoc.name,
                category: testDoc.category,
                description: testDoc.shortDescription || `AI evaluates ${testDoc.category?.toLowerCase() || ''} performance metrics.`,
                duration: testDoc.implementationStatus === 'coming_soon' ? 'Coming Soon' : 'AI Tracked',
                difficulty: testDoc.implementationStatus === 'coming_soon' ? 'Coming Soon' : 'Standard',
                statusNote: testDoc.statusNote || (testDoc.implementationStatus === 'coming_soon' ? 'Coming Soon' : 'Active Full AI'),
                implementationStatus: testDoc.implementationStatus || 'full_ai',
                detectionMethod: testDoc.detectionMethod
              });
            }
          }

          if (loadedTests.length > 0) {
            setAssessments(loadedTests);
            setLoading(false);
            return;
          }
        }

        // Fallback to static mapping if sport doc not yet synced
        const staticFallback = getTestsForSport(sportId);
        setAssessments(staticFallback);
      } catch (err) {
        console.warn('[SportAssessmentsScreen] Error loading from SQLite:', err);
        setAssessments(getTestsForSport(sportId));
      } finally {
        setLoading(false);
      }
    }

    loadSportAssessmentsFromDb();
  }, [sportId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sadhaka</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Scouting</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        {/* Sport Hero Image Banner */}
        <View style={styles.heroBannerContainer}>
          <ImageBackground 
            source={{ uri: bannerImage }} 
            style={styles.heroBanner} 
            imageStyle={{ borderRadius: borderRadius.xl }}
          >
            <View style={styles.heroBannerOverlay} />
            <View style={styles.heroBannerContent}>
              <View style={styles.heroBadge}>
                <MaterialIcons name="emoji-events" size={16} color="#FFFFFF" />
                <Text style={styles.heroBadgeText}>SAI BENCHMARK BATTERY</Text>
              </View>
              <Text style={styles.heroBannerTitle}>{sportName}</Text>
              <Text style={styles.heroBannerSubtitle}>
                AI-powered motion analysis & talent assessment battery
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Assessments</Text>
          <Text style={styles.sectionSubtitle}>
            Select a test below to view setup, instructions, and target benchmarks.
          </Text>
        </View>

        {/* Assessment List */}
        <View style={styles.listContainer}>
          {assessments.map((item) => {
            const isComingSoon = item.implementationStatus === 'coming_soon';

            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.tagsContainer}>
                    <View style={styles.tagPrimary}>
                      <Text style={styles.tagPrimaryText}>{item.category?.toUpperCase()}</Text>
                    </View>
                    <View style={[styles.tagSecondary, isComingSoon && { backgroundColor: '#FFF3E0' }]}>
                      <MaterialIcons 
                        name={isComingSoon ? 'hourglass-empty' : 'auto-awesome'} 
                        size={14} 
                        color={isComingSoon ? '#E65100' : colors.primary} 
                      />
                      <Text style={[styles.tagSecondaryText, isComingSoon && { color: '#E65100' }]}>
                        {item.statusNote || item.duration}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>

                <View style={styles.cardFooter}>
                  <TouchableOpacity 
                    style={[styles.startButton, isComingSoon && styles.disabledButton]}
                    disabled={isComingSoon}
                    onPress={() => navigation.navigate('TestInstructions', { 
                      testId: item.id, 
                      testName: item.title,
                      sportId: sportId
                    })}
                  >
                    <Text style={[styles.startButtonText, isComingSoon && styles.disabledButtonText]}>
                      {isComingSoon ? 'Coming Soon' : 'View Instructions'}
                    </Text>
                    {!isComingSoon && <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
    padding: 6,
  },
  headerTitle: {
    ...typography.brandTitle,
    color: colors.primary,
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
  heroBannerContainer: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  heroBanner: {
    width: '100%',
    height: 160,
    justifyContent: 'flex-end',
  },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderRadius: borderRadius.xl,
  },
  heroBannerContent: {
    padding: spacing.md,
    zIndex: 1,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroBannerTitle: {
    ...typography.headlineLg,
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroBannerSubtitle: {
    ...typography.bodyMd,
    fontSize: 13,
    color: '#E2E8F0',
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 20,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.bodyMd,
    fontSize: 13,
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
    flexWrap: 'wrap',
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
  },
  tagSecondaryText: {
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
  disabledButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  startButtonText: {
    ...typography.labelBold,
    color: colors.onPrimary,
    marginRight: 8,
  },
  disabledButtonText: {
    color: '#666',
  },
});
