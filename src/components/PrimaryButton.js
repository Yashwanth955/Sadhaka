import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'container'
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const buttonStyles = {
    primary: {
      backgroundColor: colors.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    container: {
      backgroundColor: colors.primaryContainer,
      borderWidth: 0,
    },
  };

  const textColors = {
    primary: colors.onPrimary,
    secondary: colors.onSurface,
    container: colors.onPrimaryContainer,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <MaterialIcons name={icon} size={20} color={textColors[variant]} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: textColors[variant] }, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons name={icon} size={20} color={textColors[variant]} style={styles.iconRight} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  text: {
    ...typography.headlineMd,
    fontSize: 16,
    lineHeight: 24,
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
});
