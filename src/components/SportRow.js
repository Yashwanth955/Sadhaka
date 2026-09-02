import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

export default function SportRow({ emoji, name, percentage, onPress }) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      {percentage !== undefined && (
        <Text style={styles.percentage}>{percentage}%</Text>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.default,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    marginBottom: spacing.xs,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  percentage: {
    ...typography.headlineMd,
    color: colors.primary,
    fontFamily: 'Montserrat_700Bold',
  },
});
