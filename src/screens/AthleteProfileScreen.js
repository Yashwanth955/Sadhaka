import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';
import BottomNavBar from '../components/BottomNavBar';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getUserProfileFromDb, getUserProgressMetrics, MOCK_USER_ID } from '../models';

function calculateAge(dobString) {
  if (!dobString) return '17';
  const today = new Date();
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return '17';
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
}

export default function AthleteProfileScreen({ navigation }) {
  const { currentUser, userProfile, logout, DEFAULT_ATHLETE_AVATAR } = useAuth();
  const [userData, setUserData] = useState(null);
  const [dbMetrics, setDbMetrics] = useState(null);
  const [dbProfile, setDbProfile] = useState(null);

  const avatarUri = userProfile?.photoURL || currentUser?.photoURL || DEFAULT_ATHLETE_AVATAR;
  
  const isMockUser = currentUser?.uid === MOCK_USER_ID;
  const displayName = userProfile?.fullName || currentUser?.displayName || dbProfile?.fullName || dbProfile?.name || userData?.fullName || userData?.name || (isMockUser ? 'Aarav Sharma' : 'Athlete');
  const displayAge = (userProfile?.age !== undefined && userProfile?.age !== null)
    ? String(userProfile.age)
    : (dbProfile?.age !== undefined && dbProfile?.age !== null
      ? String(dbProfile.age)
      : (userData?.dob || userProfile?.dob
        ? calculateAge(userData?.dob || userProfile?.dob)
        : (isMockUser ? '17' : '--')));
  const rawWeight = userProfile?.weight ?? dbProfile?.weight ?? userData?.weight;
  const displayWeight = (rawWeight !== undefined && rawWeight !== null) ? String(rawWeight) : (isMockUser ? 64 : '--');
  const rawHeight = userProfile?.height ?? dbProfile?.height ?? userData?.height;
  const displayHeight = (rawHeight !== undefined && rawHeight !== null) ? String(rawHeight) : (isMockUser ? 172 : '--');
  const displaySport = userProfile?.primarySport || dbProfile?.primarySport || userData?.primarySport || 'Cricket';
  const displayEmail = userProfile?.email || currentUser?.email || dbProfile?.email || userData?.email || (isMockUser ? 'aarav.sharma@sportsai.in' : '');
  const displayBio = userProfile?.bio || dbProfile?.bio || userData?.bio || `Aspiring Athlete | ${displaySport} Focus${displayEmail ? ` | ${displayEmail}` : ''}`;
  const tierBadge = (isMockUser || dbMetrics?.hasSessions) ? 'Elite Tier' : 'Rookie Athlete';

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser?.uid) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.warn("Error fetching user profile data:", error);
        }

        try {
          const p = await getUserProfileFromDb(currentUser.uid);
          setDbProfile(p);
          const m = await getUserProgressMetrics(currentUser.uid);
          setDbMetrics(m);
        } catch (err) {
          console.warn("Error fetching local db profile:", err);
        }
      }
    }
    fetchUserData();
  }, [currentUser, userProfile]);

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="sports-score" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sadhaka</Text>
        <TouchableOpacity
          style={styles.headerEditBtn}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.8}
          accessibilityLabel="Edit Profile"
        >
          <MaterialIcons name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header & Details */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
            accessibilityLabel="Edit Profile Photo"
          >
            <Image
              source={{ uri: avatarUri }}
              style={styles.profileImage}
            />
            <View style={styles.imageEditBadge}>
              <MaterialIcons name="photo-camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.profileName}>{displayName} 👋</Text>
          <View style={styles.badgeContainer}>
            <MaterialIcons name="star" size={16} color={colors.primary} />
            <Text style={styles.badgeText}>{tierBadge}</Text>
          </View>

          <Text style={styles.bioText}>{displayBio}</Text>

          {/* Edit Profile Action Button */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="edit" size={16} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>AGE</Text>
            <Text style={styles.statValue}>{displayAge}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>HEIGHT</Text>
            <Text style={styles.statValue}>{displayHeight}<Text style={styles.statUnit}>cm</Text></Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>WEIGHT</Text>
            <Text style={styles.statValue}>{displayWeight}<Text style={styles.statUnit}>kg</Text></Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PRIMARY</Text>
            <Text style={styles.statValue}>{displaySport}</Text>
          </View>
        </View>

        {/* Verification Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="verified-user" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Identity Verification</Text>
          </View>
          
          <TouchableOpacity style={styles.achievementCard}>
            <View style={styles.achievementRow}>
              <View style={styles.achievementLeft}>
                <View style={[styles.achievementIconBox, { backgroundColor: colors.errorContainer }]}>
                  <MaterialIcons name="fingerprint" size={20} color={colors.error} />
                </View>
                <View>
                  <Text style={styles.achievementName}>Aadhaar Verification</Text>
                  <Text style={styles.verificationSubtext}>Pending KYC</Text>
                </View>
              </View>
              <View style={styles.verificationBadge}>
                <Text style={styles.verificationBadgeText}>Verify Now</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Achievements */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="emoji-events" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Personal Bests</Text>
          </View>
          
          <View style={styles.achievementCard}>
            {(dbMetrics?.personalBests && dbMetrics.personalBests.length > 0) ? (
              dbMetrics.personalBests.map((item, idx) => (
                <View 
                  key={item.id || idx} 
                  style={[
                    styles.achievementRow, 
                    idx > 0 && { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.outlineVariant }
                  ]}
                >
                  <View style={styles.achievementLeft}>
                    <View style={styles.achievementIconBox}>
                      <MaterialIcons name={item.icon || 'directions-run'} size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.achievementName}>{item.name}</Text>
                  </View>
                  <Text style={styles.achievementScore}>{item.score}</Text>
                </View>
              ))
            ) : (
              <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                <Text style={{ color: colors.onSurfaceVariant, fontSize: 13 }}>No personal bests recorded yet</Text>
              </View>
            )}
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsCard}>
          <TouchableOpacity 
            style={styles.settingsRow}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <View style={styles.settingsRowLeft}>
              <MaterialIcons name="manage-accounts" size={20} color={colors.primary} />
              <Text style={[styles.settingsText, { color: colors.onSurface, fontWeight: '600' }]}>
                Edit Profile & Personal Details
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <MaterialIcons name="notifications" size={20} color={colors.onSurfaceVariant} />
              <Text style={styles.settingsText}>Notification Preferences</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <MaterialIcons name="watch" size={20} color={colors.onSurfaceVariant} />
              <Text style={styles.settingsText}>Connected Devices</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <MaterialIcons name="security" size={20} color={colors.onSurfaceVariant} />
              <Text style={styles.settingsText}>Privacy & Security</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <MaterialIcons name="help" size={20} color={colors.onSurfaceVariant} />
              <Text style={styles.settingsText}>Help & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={[styles.settingsRow, styles.logoutRow]} onPress={handleLogout}>
            <View style={styles.settingsRowLeft}>
              <MaterialIcons name="logout" size={20} color={colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Persistent Bottom Navigation */}
      <BottomNavBar activeTab="Profile" navigation={navigation} />
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
  container: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
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
  headerEditBtn: {
    padding: spacing.base,
    borderRadius: borderRadius.full,
    backgroundColor: '#EFF6FF',
  },
  headerTitle: {
    ...typography.brandTitle,
    color: colors.primary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileImageContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.surfaceContainerHigh,
    marginBottom: spacing.sm,
    position: 'relative',
  },
  imageEditBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryFixed,
    marginBottom: spacing.sm,
    gap: 4,
  },
  badgeText: {
    ...typography.labelBold,
    color: colors.primary,
  },
  bioText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  editProfileButtonText: {
    ...typography.labelBold,
    color: colors.primary,
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  statValue: {
    ...typography.headlineMd,
    color: colors.onSurface,
    textAlign: 'center',
  },
  statUnit: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  achievementCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementName: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontFamily: 'Inter_500Medium',
  },
  achievementScore: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  verificationSubtext: {
    ...typography.labelSm,
    color: colors.error,
    marginTop: 2,
  },
  verificationBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  verificationBadgeText: {
    ...typography.labelBold,
    color: colors.onPrimary,
  },
  settingsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerHigh,
  },
  logoutRow: {
    backgroundColor: colors.errorContainer, // Solid color looks better
  },
  logoutText: {
    ...typography.bodyMd,
    color: colors.error,
    fontFamily: 'Inter_500Medium',
    marginLeft: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
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
