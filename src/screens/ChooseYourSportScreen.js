import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, SafeAreaView, ImageBackground
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { sportsList, getTestsForSport } from '../data/sportsData';

export default function ChooseYourSportScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="menu" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Elite Scout</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWfGxtB6JwXqVlsJ72SzWMuQGllza0_lO1zVk4-7Q6RHw_vTJRMuK4Q_FHpcfC7A4jBJKlr6jOcgZ8IRrPeWg8GpOqbeT71t1Zbm_fMUtuBoVTYpxuKgw3fjhdYIx9WjTgH1PwRSH8_P4GVNIQqXOQ32gMWNmmu2lZ8VYstcBD4xgYvtL4sRXFV2T8rhsLnm4cUCtj9fpxbWHDHcu2eTvOodURtojf9W9hXCyT2LzZbABm-6tXyDb0' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Choose Your Sport</Text>
          <Text style={styles.pageSubtitle}>Select a discipline to view specialized assessments, benchmarks, and elite talent insights.</Text>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sports (e.g., Kabaddi, Athletics)..."
            placeholderTextColor={colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.gridContainer}>
          {sportsList
            .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(sport => {
              // Athletics has multiple sub-events, so we mock a larger number
              const testCount = sport.id === 'athletics' ? 24 : getTestsForSport(sport.id).length;
              
              return (
              <TouchableOpacity 
                key={sport.id} 
                style={styles.sportCard}
                onPress={() => {
                  if (sport.id === 'athletics') {
                    navigation.navigate('ChooseEvent');
                  } else {
                    navigation.navigate('SportAssessments', { sportId: sport.id, sportName: sport.name });
                  }
                }}
              >
                <View style={styles.cardImageContainer}>
                  <ImageBackground source={{ uri: sport.image }} style={styles.cardImage} imageStyle={{ opacity: 0.6 }}>
                    <View style={styles.imageOverlay} />
                    <View style={styles.testsBadge}>
                      <Text style={styles.testsBadgeText}>{testCount} Tests Available</Text>
                    </View>
                  </ImageBackground>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardIconWrapper}>
                    <MaterialIcons name={sport.icon} size={24} color={colors.onPrimaryContainer} />
                  </View>
                  <Text style={styles.sportCardTitle}>{sport.name}</Text>
                  
                  <View style={styles.viewAssessmentsRow}>
                    <Text style={styles.viewAssessmentsText}>View Assessments</Text>
                    <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            )})}
        </View>
      </ScrollView>

      {/* Bottom Navigation Mock */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
          <MaterialIcons name="dashboard" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navItemText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive} onPress={() => navigation.navigate('ChooseSport')}>
          <MaterialIcons name="fitness-center" size={24} color={colors.onPrimaryContainer} />
          <Text style={styles.navItemTextActive}>Assess</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OverallProgress')}>
          <MaterialIcons name="psychology" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navItemText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <MaterialIcons name="person" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navItemText}>Profile</Text>
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
  container: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.md,
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
    ...typography.headlineMd,
    color: colors.primary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  pageTitle: {
    ...typography.displayLg,
    fontSize: 40,
    lineHeight: 48,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  gridContainer: {
    gap: spacing.md,
  },
  sportCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    height: 280,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImageContainer: {
    height: 128,
    width: '100%',
    backgroundColor: colors.surfaceContainerHigh,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.2)', // Light gradient effect could be added here
  },
  testsBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 65, 200, 0.2)',
  },
  testsBadgeText: {
    ...typography.labelBold,
    color: colors.primary,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: colors.primaryContainer,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40, // Pull up over the image
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sportCardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: 8,
  },
  viewAssessmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  viewAssessmentsText: {
    ...typography.labelBold,
    color: colors.primary,
    marginRight: 4,
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
