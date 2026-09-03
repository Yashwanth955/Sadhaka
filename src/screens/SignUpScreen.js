import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, TextInput, ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      return setError('Please enter your email and password');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email.trim(), password, fullName.trim() || 'Athlete', 'athlete');
      navigation.navigate('BasicDetails');
    } catch (err) {
      setError('Failed to create account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      await loginWithGoogle();
      navigation.navigate('BasicDetails');
    } catch (err) {
      setError('Google sign-up error: ' + err.message);
    } finally {
      setGoogleLoading(false);
    }
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
        {/* App Header with Back Arrow */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#111816" />
          </TouchableOpacity>
          <Text style={styles.brandTitle}>Sadhaka</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.innerContent}>
          <Text style={styles.headingTitle}>Create Your Account</Text>
          <Text style={styles.headingSubtitle}>Join the sports talent assessment platform</Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="person-outline" size={20} color="#61897c" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#61897c"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="mail-outline" size={20} color="#61897c" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#61897c"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="lock-outline" size={20} color="#61897c" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password (min 6 chars)"
                placeholderTextColor="#61897c"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="#61897c" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="lock-outline" size={20} color="#61897c" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm your password"
                placeholderTextColor="#61897c"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* Primary Sign Up Button */}
          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#111816" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign Up Button */}
          <TouchableOpacity 
            style={[styles.googleButton, googleLoading && styles.disabledButton]}
            onPress={handleGoogleSignUp}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#111816" />
            ) : (
              <>
                <FontAwesome name="google" size={18} color="#EA4335" style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Sign Up with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity 
            style={styles.signInLinkRow}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInLinkText}>Already have an account? <Text style={styles.signInBoldText}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    color: '#111816',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 44,
  },
  innerContent: {
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111816',
    textAlign: 'center',
    marginBottom: 4,
  },
  headingSubtitle: {
    fontSize: 14,
    color: '#61897c',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 13,
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111816',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f3',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#111816',
  },
  eyeButton: {
    padding: 6,
  },
  primaryButton: {
    backgroundColor: '#13eca4',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111816',
  },
  disabledButton: {
    opacity: 0.6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111816',
  },
  signInLinkRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  signInLinkText: {
    fontSize: 14,
    color: '#61897c',
  },
  signInBoldText: {
    fontWeight: '700',
    color: '#111816',
    textDecorationLine: 'underline',
  },
});
