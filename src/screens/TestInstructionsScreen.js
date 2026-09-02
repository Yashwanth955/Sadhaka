import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function TestInstructionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>100m Sprint Instructions</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Video Demo Section */}
        <TouchableOpacity style={styles.videoContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-Qb7ZF6PE6VK-ErCnEcXpZJisHgWPGozVTjqOdq7p3D02F2rVgxXhCSO_Nux_lvcUdVeb7oFEvFy7CfGeVO7nVp9YFv9qP64nBEbcS3YwqHMDGEUscWJv8EXmxqCnnCbGSyCdo1nguJCiXnq0NIJTtIfmKcjZjgrhildynovsOVYBqpkWTx5jnOv_7LlwQ3zqcc_kJGM6oNw0fXEQ-f3H6H7N7-9vNZdIju37lm1IS0csn3XVU8x' }}
            style={styles.videoThumbnail}
          />
          <View style={styles.videoOverlay}>
            <View style={styles.playButton}>
              <MaterialIcons name="play-arrow" size={36} color={colors.primary} />
            </View>
          </View>
          <View style={styles.demoBadge}>
            <MaterialIcons name="visibility" size={16} color={colors.primary} />
            <Text style={styles.demoBadgeText}>Demo Video</Text>
          </View>
        </TouchableOpacity>

        {/* How it Works */}
        <View style={styles.card}>
          <View style={styles.cardLeftBorder} />
          <View style={styles.cardHeader}>
            <MaterialIcons name="format-list-numbered" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>How it Works</Text>
          </View>
          
          <View style={styles.stepsContainer}>
            {/* Steps Line */}
            <View style={styles.stepsLine} />
            
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
              <Text style={styles.stepText}>Position your phone 5 meters away on a stable surface.</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
              <Text style={styles.stepText}>Ensure your full body is visible in the frame.</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
              <Text style={styles.stepText}>Wait for the 3-second countdown after pressing start.</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>4</Text></View>
              <Text style={styles.stepText}>Sprint at maximum effort until you cross the finish line.</Text>
            </View>
          </View>
        </View>

        {/* Critical Rules */}
        <View style={styles.rulesCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="warning" size={24} color={colors.error} />
            <Text style={styles.cardTitle}>Critical Rules</Text>
          </View>
          
          <View style={styles.ruleItem}>
            <MaterialIcons name="check-circle" size={20} color={colors.primary} />
            <Text style={styles.ruleText}>Wear form-fitting athletic clothes</Text>
          </View>
          <View style={styles.ruleItem}>
            <MaterialIcons name="check-circle" size={20} color={colors.primary} />
            <Text style={styles.ruleText}>Ensure high-contrast lighting</Text>
          </View>
          <View style={styles.ruleItem}>
            <MaterialIcons name="check-circle" size={20} color={colors.primary} />
            <Text style={styles.ruleText}>Maintain clear space for 100m</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={styles.bottomActionArea}>
        <TouchableOpacity 
          style={styles.readyButton}
          onPress={() => navigation.navigate('AILiveAssessment')}
        >
          <Text style={styles.readyButtonText}>I'm Ready, Start Test</Text>
          <MaterialIcons name="arrow-forward" size={24} color={colors.onPrimary} />
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
    height: 64,
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  spacer: {
    width: 40,
  },
  container: {
    padding: spacing.marginMobile,
    paddingBottom: 120, // Space for bottom action area
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHighest,
    marginBottom: spacing.md,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  demoBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  demoBadgeText: {
    ...typography.labelBold,
    color: colors.onSurface,
    marginLeft: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.3)', // outline-variant/30
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: spacing.sm,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginLeft: 8,
  },
  stepsContainer: {
    position: 'relative',
  },
  stepsLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    bottom: 16,
    width: 2,
    backgroundColor: 'rgba(195, 197, 217, 0.5)',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepNumberText: {
    ...typography.labelBold,
    fontSize: 12,
    color: colors.onPrimaryContainer,
  },
  stepText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginLeft: 16,
    flex: 1,
    marginTop: 2,
  },
  rulesCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.3)',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(195, 197, 217, 0.2)',
    marginBottom: 12,
  },
  ruleText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginLeft: 12,
    flex: 1,
  },
  bottomActionArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 249, 255, 0.9)', // surface/90
    borderTopWidth: 1,
    borderTopColor: 'rgba(195, 197, 217, 0.3)',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
  },
  readyButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  readyButtonText: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onPrimary,
    marginRight: 12,
  },
});
