import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, TextInput, ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError('Please enter your email and password');
    try {
      setError('');
      setLoading(true);
      await login(email.trim(), password);
      navigation.replace('Main');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      await loginWithGoogle();
      navigation.replace('Main');
    } catch (err) {
      setError('Google sign-in error: ' + err.message);
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
        {/* App Header */}
        <View style={styles.topBar}>
          <Text style={styles.brandTitle}>Sadhaka</Text>
        </View>

        <View style={styles.innerContent}>
          <Text style={styles.headingTitle}>Welcome Back</Text>
          <Text style={styles.headingSubtitle}>Sign in to continue your sports assessment</Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          {/* Email or Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email or Username</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="mail-outline" size={20} color="#61897c" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Email or Username"
                placeholderTextColor="#61897c"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="lock-outline" size={20} color="#61897c" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
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

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Primary Login Button */}
          <TouchableOpacity 
            style={[styles.primaryLoginButton, loading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#111816" />
            ) : (
              <Text style={styles.primaryLoginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-in Button */}
          <TouchableOpacity 
            style={[styles.googleButton, googleLoading && styles.disabledButton]}
            onPress={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#111816" />
            ) : (
              <>
                <FontAwesome name="google" size={18} color="#EA4335" style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* New User? Sign Up Link */}
          <TouchableOpacity 
            style={styles.signUpLinkRow}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpLinkText}>New User? <Text style={styles.signUpBoldText}>Sign Up</Text></Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  topBar: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  innerContent: {
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  headingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111816',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  headingSubtitle: {
    fontSize: 14,
    color: '#61897c',
    textAlign: 'center',
    marginBottom: 24,
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
    marginBottom: 16,
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
  forgotRow: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 2,
  },
  forgotText: {
    color: '#61897c',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  primaryLoginButton: {
    backgroundColor: '#13eca4',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLoginButtonText: {
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
    marginVertical: 20,
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
  signUpLinkRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginTop: 8,
  },
  signUpLinkText: {
    fontSize: 14,
    color: '#61897c',
  },
  signUpBoldText: {
    fontWeight: '700',
    color: '#111816',
    textDecorationLine: 'underline',
  },
});
