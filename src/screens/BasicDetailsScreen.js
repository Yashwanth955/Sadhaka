import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function BasicDetailsScreen({ navigation }) {
  const { currentUser } = useAuth();
  const [gender, setGender] = useState('male');
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [primarySport, setPrimarySport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (currentUser) {
      setLoading(true);
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          dob,
          gender,
          height,
          weight,
          primarySport
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to save to Firestore:', err);
      }
      setLoading(false);
    }
    navigation.navigate('SportsRecommendation');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sadhaka</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.titleSection}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepText}>STEP 1 OF 2</Text>
            <Text style={styles.stepLabel}>Basic Details</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          
          <Text style={styles.mainTitle}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Help us customize your elite training experience by providing your basic physiological data.</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={colors.onSurfaceVariant}
                value={dob}
                onChangeText={setDob}
              />
              <MaterialIcons name="calendar-today" size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
            </View>
          </View>

          {/* Gender Segmented Button */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[styles.segmentButton, gender === 'male' && styles.segmentActive]}
                onPress={() => setGender('male')}
              >
                <Text style={[styles.segmentText, gender === 'male' && styles.segmentTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentButton, gender === 'female' && styles.segmentActive]}
                onPress={() => setGender('female')}
              >
                <Text style={[styles.segmentText, gender === 'female' && styles.segmentTextActive]}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentButton, gender === 'other' && styles.segmentActive]}
                onPress={() => setGender('other')}
              >
                <Text style={[styles.segmentText, gender === 'other' && styles.segmentTextActive]}>Other</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Physical Metrics */}
          <View style={styles.rowGrid}>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Height</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="180"
                  placeholderTextColor={colors.onSurfaceVariant}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
                <Text style={styles.unitText}>cm</Text>
              </View>
            </View>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Weight</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="75"
                  placeholderTextColor={colors.onSurfaceVariant}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>

          {/* Primary Sport */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Primary Sport</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Select your discipline"
                placeholderTextColor={colors.onSurfaceVariant}
                value={primarySport}
                onChangeText={setPrimarySport}
              />
              <MaterialIcons name="expand-more" size={24} color={colors.onSurfaceVariant} style={styles.inputIcon} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CTA Area */}
      <View style={styles.ctaArea}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>{loading ? "Saving..." : "Next Step"}</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
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
  },
  iconButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  spacer: {
    width: 40,
  },
  container: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  stepText: {
    ...typography.labelBold,
    color: colors.primary,
  },
  stepLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    width: '50%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  mainTitle: {
    ...typography.headlineLgMobile,
    color: colors.onBackground,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  formContainer: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    ...typography.labelBold,
    color: colors.onBackground,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceBright,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onBackground,
    paddingVertical: 12,
  },
  inputIcon: {
    marginLeft: 8,
  },
  unitText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginLeft: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: colors.primaryContainer,
  },
  segmentText: {
    ...typography.labelBold,
    color: colors.onSurfaceVariant,
  },
  segmentTextActive: {
    color: colors.onPrimaryContainer,
  },
  rowGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ctaArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.marginMobile,
    backgroundColor: 'rgba(248, 249, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    ...typography.labelBold,
    color: colors.onPrimary,
    marginRight: 8,
    fontSize: 16,
  },
});
