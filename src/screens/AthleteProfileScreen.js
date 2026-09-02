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
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AthleteProfileScreen({ navigation }) {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);

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
      }
    }
    fetchUserData();
  }, [currentUser]);

  const getAge = (dobString) => {
    if (!dobString) return '--';
    const today = new Date();
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return '--';
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

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
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdBSvOrpQh_SQel4FPwRzvZB0fEaP15Oz8t_-NUjnRpZ6YCqQqnMhAy6EJs54opNt_H2ee-ve41JjaU8eehOffQ-awPcpbTE2fdyTkiJe4GCDAW9d89bHgb3mMEdmmX8Ax1NGUm1ecV0eZ-RweKtlR9_jhOFyPBYlhKfxYNp_aAfAtpBNQzGc89ld4F1NMofLNhuIlbGF0SaalzKyTxbtdkc5Mmc3TcoaEjgwAEokWjYqGA2tmkoyR' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header & Details */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoH-XosX0XzpzC5vJ2jgaoURyBaEsqs95APgUqr17_tBxeTpGnQ3VEw-YwBm8b2KtkThtvUxNTDQaJzzA34c7tTrRarpLImJH97QXf4iiLvYZa_uue10NCMMkCdYlPCGpxhJ3GzTaGkAM-lEeNWNYRj1aTk_6Q_EGqUAeLc-rduYt2MVTN0NdVUdpRKriYexpXC4f_tRfNf3QXHd3USZAXDJOdnv9qC7_G-IrWhw2L56Mul_x6pnIw' }}
              style={styles.profileImage}
            />
          </View>
          
          <Text style={styles.profileName}>{userData?.fullName?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Athlete'} 👋</Text>
          <View style={styles.badgeContainer}>
            <MaterialIcons name="star" size={16} color={colors.primary} />
            <Text style={styles.badgeText}>Elite Tier</Text>
          </View>

          <Text style={styles.bioText}>Aspiring Sprinter | Focused on explosive power and speed.</Text>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>AGE</Text>
            <Text style={styles.statValue}>{getAge(userData?.dob)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>HEIGHT</Text>
            <Text style={styles.statValue}>{userData?.height || '--'}<Text style={styles.statUnit}>cm</Text></Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>WEIGHT</Text>
            <Text style={styles.statValue}>{userData?.weight || '--'}<Text style={styles.statUnit}>kg</Text></Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PRIMARY</Text>
            <Text style={styles.statValue}>{userData?.primarySport || 'N/A'}</Text>
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
            <View style={styles.achievementRow}>
              <View style={styles.achievementLeft}>
                <View style={styles.achievementIconBox}>
                  <MaterialIcons name="directions-run" size={20} color={colors.onPrimaryContainer} />
                </View>
                <Text style={styles.achievementName}>100m Sprint</Text>
              </View>
              <Text style={styles.achievementScore}>11.2s</Text>
            </View>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <MaterialIcons name="person" size={20} color={colors.onSurfaceVariant} />
              <Text style={styles.settingsText}>Account Settings</Text>
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

      {/* Bottom Navigation Mock */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
          <MaterialIcons name="dashboard" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navItemText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChooseSport')}>
          <MaterialIcons name="fitness-center" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navItemText}>Assess</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OverallProgress')}>
          <MaterialIcons name="analytics" size={24} color={colors.onSurfaceVariant} />
          <Text style={styles.navItemText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive} onPress={() => navigation.navigate('Profile')}>
          <MaterialIcons name="person" size={24} color={colors.onPrimaryContainer} />
          <Text style={styles.navItemTextActive}>Profile</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
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
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
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
