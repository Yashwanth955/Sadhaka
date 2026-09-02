import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';
import InputField from '../components/InputField';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError('Please enter email and password');
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigation.replace('Main');
    } catch (err) {
      setError('Failed to log in. ' + err.message);
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
        {/* Mobile Header */}
        <View style={styles.header}>
          <Text style={styles.brandName}>Sadhaka</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Form Header */}
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>
            Enter your credentials to access your dashboard.
          </Text>

          {/* Email */}
          <InputField
            label="Email Address"
            placeholder="coach@elitescout.com"
            value={email}
            onChangeText={setEmail}
            icon="mail"
            keyboardType="email-address"
          />

          {/* Password */}
          <View>
            <View style={styles.passwordHeader}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity>
                <Text style={styles.forgotLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <InputField
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock"
              secureTextEntry
            />
          </View>

          {/* Remember Me */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <MaterialIcons
              name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
              size={20}
              color={rememberMe ? colors.primary : colors.outlineVariant}
            />
            <Text style={styles.rememberText}>Remember me for 30 days</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Actions */}
          <View style={styles.actions}>
            <PrimaryButton
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              disabled={loading}
            />
            <PrimaryButton
              title="Single Sign-On (SSO)"
              variant="secondary"
              icon="shield"
              iconPosition="left"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Sign Up Prompt */}
        <View style={styles.signUpPrompt}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Request Access</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  brandName: {
    ...typography.headlineLgMobile,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '4D',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  formTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
    paddingLeft: spacing.xs,
  },
  inputLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  forgotLink: {
    ...typography.labelSm,
    color: colors.primary,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  rememberText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  signUpText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  signUpLink: {
    ...typography.labelBold,
    color: colors.primary,
  },
  errorText: {
    ...typography.labelSm,
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
