import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

export default function StatCard({ icon, label, value, valueColor, chipText, chipBg }) {
  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <MaterialIcons name={icon} size={20} color={colors.outline} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {chipText ? (
        <View style={[styles.chip, chipBg && { backgroundColor: chipBg }]}>
          <Text style={[styles.chipText, valueColor && { color: valueColor }]}>
            {chipText}
          </Text>
        </View>
      ) : (
        <Text style={[styles.value, valueColor && { color: valueColor }]}>
          {value}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  value: {
    ...typography.labelBold,
    color: colors.onSurface,
    fontSize: 18,
  },
  chip: {
    backgroundColor: colors.tertiaryFixed + '80',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  chipText: {
    ...typography.labelBold,
    color: colors.tertiaryContainer,
  },
});
