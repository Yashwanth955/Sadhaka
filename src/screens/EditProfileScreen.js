import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';

const AVATAR_PRESETS = [
  {
    id: 'default',
    label: 'Standard',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'male_athlete_1',
    label: 'Sprinter',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'female_athlete_1',
    label: 'Track Star',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'male_athlete_2',
    label: 'Fitness',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'female_athlete_2',
    label: 'Runner',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'male_athlete_3',
    label: 'Champion',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  }
];

const SPORTS_LIST = [
  'Cricket',
  'Athletics (Track & Field)',
  'Badminton',
  'Football',
  'Basketball',
  'Kabaddi',
  'Kho-Kho',
  'Wrestling',
  'Boxing',
  'Swimming',
  'Tennis',
  'Table Tennis',
  'Volleyball',
  'Weightlifting',
  'Archery',
  'Hockey'
];

export default function EditProfileScreen({ navigation }) {
  const { currentUser, userProfile, updateUserProfile, DEFAULT_ATHLETE_AVATAR } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('male');
  const [primarySport, setPrimarySport] = useState('Cricket');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [photoURL, setPhotoURL] = useState(DEFAULT_ATHLETE_AVATAR);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showCustomUrlBox, setShowCustomUrlBox] = useState(false);
  const [showSportPicker, setShowSportPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Populate state on mount from active profile or auth context
  useEffect(() => {
    const currentName = userProfile?.fullName || userProfile?.name || currentUser?.displayName || '';
    const currentEmail = userProfile?.email || currentUser?.email || '';
    const currentBio = userProfile?.bio || '';
    const currentGender = userProfile?.gender || 'male';
    const currentSport = userProfile?.primarySport || 'Cricket';
    const currentAge = (userProfile?.age !== null && userProfile?.age !== undefined) ? String(userProfile.age) : '';
    const currentHeight = (userProfile?.height !== null && userProfile?.height !== undefined) ? String(userProfile.height) : '';
    const currentWeight = (userProfile?.weight !== null && userProfile?.weight !== undefined) ? String(userProfile.weight) : '';
    const currentPhoto = userProfile?.photoURL || currentUser?.photoURL || DEFAULT_ATHLETE_AVATAR;

    setFullName(currentName);
    setEmail(currentEmail);
    setBio(currentBio);
    setGender(currentGender);
    setPrimarySport(currentSport);
    setAge(currentAge);
    setHeight(currentHeight);
    setWeight(currentWeight);
    setPhotoURL(currentPhoto);
  }, [userProfile, currentUser]);

  // Live BMI calculation
  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);
  let bmiValue = null;
  let bmiCategory = null;
  let bmiColor = colors.primary;

  if (!isNaN(heightNum) && !isNaN(weightNum) && heightNum > 50 && weightNum > 15) {
    const heightInMeters = heightNum / 100;
    const computedBmi = weightNum / (heightInMeters * heightInMeters);
    bmiValue = computedBmi.toFixed(1);

    if (computedBmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = colors.amber;
    } else if (computedBmi <= 24.9) {
      bmiCategory = 'Healthy Weight';
      bmiColor = colors.success;
    } else if (computedBmi <= 29.9) {
      bmiCategory = 'Overweight';
      bmiColor = colors.amber;
    } else {
      bmiCategory = 'Obese';
      bmiColor = colors.danger;
    }
  }

  const handleSave = async () => {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      Alert.alert('Required Field', 'Please enter your full name.');
      return;
    }

    setIsSaving(true);
    try {
      const parsedAge = age ? parseInt(age, 10) : null;
      const parsedHeight = height ? parseFloat(height) : null;
      const parsedWeight = weight ? parseFloat(weight) : null;

      const profilePayload = {
        fullName: trimmedName,
        name: trimmedName,
        email: email.trim(),
        bio: bio.trim(),
        gender,
        primarySport,
        age: !isNaN(parsedAge) ? parsedAge : null,
        height: !isNaN(parsedHeight) ? parsedHeight : null,
        weight: !isNaN(parsedWeight) ? parsedWeight : null,
        photoURL: photoURL || DEFAULT_ATHLETE_AVATAR,
        lastUpdated: new Date().toISOString()
      };

      if (updateUserProfile) {
        await updateUserProfile(profilePayload);
      }

      Alert.alert(
        'Profile Updated',
        'Your athlete profile details have been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (err) {
      console.warn('[EditProfile] Error saving profile:', err);
      Alert.alert('Save Error', 'Unable to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Back"
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            style={[styles.saveHeaderButton, isSaving && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.saveHeaderText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Customization Card */}
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>Profile Photo</Text>
            <View style={styles.avatarRow}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: photoURL || DEFAULT_ATHLETE_AVATAR }}
                  style={styles.avatarLarge}
                />
                <View style={styles.cameraBadge}>
                  <MaterialIcons name="photo-camera" size={16} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.avatarInfo}>
                <Text style={styles.avatarTitle}>Choose Avatar</Text>
                <Text style={styles.avatarSubtitle}>
                  Select from athletic presets or paste an image link.
                </Text>
                <TouchableOpacity
                  style={styles.customLinkBtn}
                  onPress={() => setShowCustomUrlBox(!showCustomUrlBox)}
                >
                  <MaterialIcons
                    name={showCustomUrlBox ? "keyboard-arrow-up" : "link"}
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={styles.customLinkBtnText}>
                    {showCustomUrlBox ? 'Hide custom URL' : 'Use image URL'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Custom URL Input Accordion */}
            {showCustomUrlBox && (
              <View style={styles.customUrlContainer}>
                <TextInput
                  style={styles.customUrlInput}
                  placeholder="https://example.com/avatar.jpg"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={customUrlInput}
                  onChangeText={setCustomUrlInput}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.applyUrlBtn}
                  onPress={() => {
                    if (customUrlInput.trim()) {
                      setPhotoURL(customUrlInput.trim());
                      setShowCustomUrlBox(false);
                    }
                  }}
                >
                  <Text style={styles.applyUrlBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Avatar Presets Scroll */}
            <Text style={styles.presetLabel}>Quick Presets:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsList}
            >
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = photoURL === preset.url;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[styles.presetItem, isSelected && styles.presetItemActive]}
                    onPress={() => setPhotoURL(preset.url)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: preset.url }} style={styles.presetImage} />
                    <Text style={[styles.presetText, isSelected && styles.presetTextActive]}>
                      {preset.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.presetCheckmark}>
                        <MaterialIcons name="check" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Personal Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <MaterialIcons name="person" size={20} color={colors.primary} />
              <Text style={styles.sectionHeadingWithIcon}>Personal Details</Text>
            </View>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Full Name <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="badge" size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Aarav Sharma"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Email (Account) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Email</Text>
              <View style={[styles.inputContainer, styles.inputDisabled]}>
                <MaterialIcons name="email" size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputTextDisabled]}
                  placeholder="athlete@sportsai.in"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={email}
                  editable={false}
                />
                <MaterialIcons name="lock-outline" size={18} color={colors.outline} />
              </View>
              <Text style={styles.helperText}>Account email is tied to authentication</Text>
            </View>

            {/* Bio / Athletic Motto */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio & Goals</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <MaterialIcons
                  name="edit-note"
                  size={20}
                  color={colors.onSurfaceVariant}
                  style={[styles.inputIcon, { marginTop: 4 }]}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g. National 100m sprint aspirant | Dedicated to athletic excellence"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </View>

          {/* Physical & Sports Attributes Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <MaterialIcons name="fitness-center" size={20} color={colors.primary} />
              <Text style={styles.sectionHeadingWithIcon}>Athletic Profile & Khelo India Stats</Text>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderCard, gender === 'male' && styles.genderCardActive]}
                  onPress={() => setGender('male')}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name="male"
                    size={24}
                    color={gender === 'male' ? colors.primary : colors.onSurfaceVariant}
                  />
                  <Text style={[styles.genderCardText, gender === 'male' && styles.genderCardTextActive]}>
                    Boy / Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderCard, gender === 'female' && styles.genderCardActive]}
                  onPress={() => setGender('female')}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name="female"
                    size={24}
                    color={gender === 'female' ? colors.primary : colors.onSurfaceVariant}
                  />
                  <Text style={[styles.genderCardText, gender === 'female' && styles.genderCardTextActive]}>
                    Girl / Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Sport Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Primary Sport</Text>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setShowSportPicker(!showSportPicker)}
                activeOpacity={0.8}
              >
                <View style={styles.selectBoxLeft}>
                  <MaterialIcons name="sports" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.selectBoxText}>{primarySport || 'Select a sport'}</Text>
                </View>
                <MaterialIcons
                  name={showSportPicker ? "arrow-drop-up" : "arrow-drop-down"}
                  size={26}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>

              {showSportPicker && (
                <View style={styles.dropdownContainer}>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                    {SPORTS_LIST.map((sport) => {
                      const isSportActive = primarySport === sport;
                      return (
                        <TouchableOpacity
                          key={sport}
                          style={[styles.dropdownItem, isSportActive && styles.dropdownItemActive]}
                          onPress={() => {
                            setPrimarySport(sport);
                            setShowSportPicker(false);
                          }}
                        >
                          <Text style={[styles.dropdownItemText, isSportActive && styles.dropdownItemTextActive]}>
                            {sport}
                          </Text>
                          {isSportActive && (
                            <MaterialIcons name="check" size={18} color={colors.primary} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Age, Height, Weight Row */}
            <View style={styles.metricsRow}>
              {/* Age */}
              <View style={styles.metricColumn}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.metricInputBox}>
                  <TextInput
                    style={styles.metricInput}
                    placeholder="17"
                    placeholderTextColor={colors.onSurfaceVariant}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <Text style={styles.metricUnit}>yrs</Text>
                </View>
              </View>

              {/* Height */}
              <View style={styles.metricColumn}>
                <Text style={styles.label}>Height</Text>
                <View style={styles.metricInputBox}>
                  <TextInput
                    style={styles.metricInput}
                    placeholder="172"
                    placeholderTextColor={colors.onSurfaceVariant}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <Text style={styles.metricUnit}>cm</Text>
                </View>
              </View>

              {/* Weight */}
              <View style={styles.metricColumn}>
                <Text style={styles.label}>Weight</Text>
                <View style={styles.metricInputBox}>
                  <TextInput
                    style={styles.metricInput}
                    placeholder="64"
                    placeholderTextColor={colors.onSurfaceVariant}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <Text style={styles.metricUnit}>kg</Text>
                </View>
              </View>
            </View>

            {/* Live BMI & Health Indicator Card */}
            {bmiValue && (
              <View style={styles.bmiCard}>
                <View style={styles.bmiHeaderRow}>
                  <View style={styles.bmiIconBadge}>
                    <MaterialIcons name="speed" size={20} color={bmiColor} />
                  </View>
                  <View style={styles.bmiTextGroup}>
                    <Text style={styles.bmiTitle}>Body Mass Index (BMI)</Text>
                    <Text style={styles.bmiSubtext}>Auto-calculated from height & weight</Text>
                  </View>
                  <View style={[styles.bmiPill, { backgroundColor: `${bmiColor}1A` }]}>
                    <Text style={[styles.bmiPillText, { color: bmiColor }]}>{bmiCategory}</Text>
                  </View>
                </View>
                <View style={styles.bmiValueRow}>
                  <Text style={styles.bmiNumber}>{bmiValue}</Text>
                  <Text style={styles.bmiUnits}>kg/m²</Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="check" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomColor: colors.border,
  },
  iconButton: {
    padding: spacing.base,
    borderRadius: borderRadius.full,
  },
  headerTitle: {
    ...typography.brandTitle,
    fontSize: 20,
    color: colors.textPrimary,
  },
  saveHeaderButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
  },
  saveHeaderText: {
    ...typography.labelBold,
    color: colors.primary,
    fontSize: 16,
  },
  container: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 8,
  },
  sectionHeading: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionHeadingWithIcon: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primaryContainer,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarInfo: {
    flex: 1,
  },
  avatarTitle: {
    ...typography.labelBold,
    color: colors.textPrimary,
    fontSize: 15,
  },
  avatarSubtitle: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 6,
  },
  customLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customLinkBtnText: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },
  customUrlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 8,
  },
  customUrlInput: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  applyUrlBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  applyUrlBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  presetLabel: {
    ...typography.labelSm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  presetsList: {
    paddingVertical: 4,
    gap: 12,
  },
  presetItem: {
    alignItems: 'center',
    padding: 4,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  presetItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer,
  },
  presetImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  presetText: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  presetTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  presetCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelBold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  requiredStar: {
    color: colors.danger,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  inputTextDisabled: {
    color: colors.textSecondary,
  },
  helperText: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    minHeight: 80,
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceVariant,
    gap: 8,
  },
  genderCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer,
  },
  genderCardText: {
    ...typography.labelBold,
    color: colors.textSecondary,
    fontSize: 14,
  },
  genderCardTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  selectBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBoxText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Inter_500Medium',
  },
  dropdownContainer: {
    marginTop: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryContainer,
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xs,
  },
  metricColumn: {
    flex: 1,
  },
  metricInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    minHeight: 48,
  },
  metricInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  metricUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  bmiCard: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bmiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bmiIconBadge: {
    marginRight: 8,
  },
  bmiTextGroup: {
    flex: 1,
  },
  bmiTitle: {
    ...typography.labelBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  bmiSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bmiPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  bmiPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bmiValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
    gap: 4,
  },
  bmiNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: 'Montserrat_700Bold',
  },
  bmiUnits: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionContainer: {
    marginTop: spacing.sm,
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    ...typography.labelBold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cancelButtonText: {
    ...typography.labelBold,
    color: colors.textSecondary,
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
