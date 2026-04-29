import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';

interface StatCardProps {
  value: number | string;
  label: string;
  color?: string;
  icon?: string;
}

export default function StatCard({ value, label, color = colors.onSurface, icon }: StatCardProps) {
  const display = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <View style={s.card}>
      <View style={s.iconWrap}>{icon ? <Text style={s.icon}>{icon}</Text> : <View style={s.iconPlaceholder} />}</View>
      <Text style={[s.value, { color }]}>{display}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: spacing.space100,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    alignItems: 'center',
    ...shadows.sm,
  },
  iconWrap: {
    width: spacing.space48,
    height: spacing.space48,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    marginBottom: spacing.space16,
  },
  iconPlaceholder: {
    width: spacing.space16,
    height: spacing.space16,
  },
  icon: {
    ...typography.h4,
    color: colors.primary,
  },
  value: {
    ...typography.h2,
  },
  label: {
    ...typography.label,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
    textAlign: 'center',
  },
});
