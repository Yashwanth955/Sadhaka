import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';
import InputField from '../components/InputField';
import { useAuth } from '../contexts/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [role, setRole] = useState('athlete');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      return setError('Please fill in all fields');
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, password, fullName, role);
      navigation.navigate('OnboardingCarousel');
    } catch (err) {
      setError('Failed to create an account. ' + err.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={styles.brandName}>Sadhaka</Text>
          <Text style={styles.tagline}>Prepare to elevate your game.</Text>
        </View>

        {/* Form Card with Active Bar */}
        <View style={styles.formCard}>
          {/* Active bar accent */}
          <View style={styles.activeBar} />

          <Text style={styles.formTitle}>Create Account</Text>

          {/* Role Selection Chips */}
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleChip, role === 'athlete' && styles.roleChipActive]}
              onPress={() => setRole('athlete')}
            >
              <Text style={[styles.roleText, role === 'athlete' && styles.roleTextActive]}>
                Athlete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleChip, role === 'scout' && styles.roleChipActive]}
              onPress={() => setRole('scout')}
            >
              <Text style={[styles.roleText, role === 'scout' && styles.roleTextActive]}>
                Scout / Coach
              </Text>
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <InputField
            label="Full Name"
            placeholder="Alex Rivers"
            value={fullName}
            onChangeText={setFullName}
            icon="person"
            autoCapitalize="words"
          />

          {/* Email */}
          <InputField
            label="Email Address"
            placeholder="alex@elitescout.io"
            value={email}
            onChangeText={setEmail}
            icon="mail"
            keyboardType="email-address"
          />

          {/* Password */}
          <InputField
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            icon="lock"
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Sign Up Button */}
          <PrimaryButton
            title={loading ? "Creating Account..." : "Sign Up"}
            icon={loading ? null : "arrow-forward"}
            onPress={handleSignUp}
            style={styles.signUpButton}
            disabled={loading}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialIcons name="g-translate" size={20} color="#DB4437" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialIcons name="apple" size={20} color={colors.onSurface} />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Link */}
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandName: {
    ...typography.displayLg,
    color: colors.primary,
    letterSpacing: -1,
  },
  tagline: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest + 'CC',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  formTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.gutter,
    marginBottom: spacing.md,
  },
  roleChip: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.default,
  },
  roleChipActive: {
    backgroundColor: colors.surfaceContainer,
    borderColor: colors.primary,
  },
  roleText: {
    ...typography.labelBold,
    color: colors.onSurfaceVariant,
  },
  roleTextActive: {
    color: colors.primary,
  },
  signUpButton: {
    marginTop: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant + '80',
  },
  dividerText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.gutter,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.default,
    backgroundColor: colors.surface,
  },
  socialText: {
    ...typography.labelBold,
    color: colors.onSurface,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  loginLink: {
    ...typography.bodyMd,
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  errorText: {
    ...typography.labelSm,
    color: colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
