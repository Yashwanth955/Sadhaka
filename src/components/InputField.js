import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
      ]}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.outline}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.outline + '99'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.visibilityButton}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color={colors.outline}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.base,
    paddingLeft: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.default,
    paddingHorizontal: spacing.sm,
    paddingVertical: 0,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  icon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSurface,
    paddingVertical: spacing.sm,
  },
  visibilityButton: {
    padding: spacing.base,
  },
});
