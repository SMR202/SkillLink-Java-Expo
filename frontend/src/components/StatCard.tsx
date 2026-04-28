import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface StatCardProps {
  value: number | string;
  label: string;
  color?: string;
  icon?: string;
}

export default function StatCard({ value, label, color = colors.textPrimary, icon }: StatCardProps) {
  const display = typeof value === 'number' ? value.toLocaleString() : value;
  return (
    <View style={s.card}>
      {icon ? <Text style={s.icon}>{icon}</Text> : null}
      <Text style={[s.value, { color }]}>{display}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    minWidth: 90,
  },
  icon: { fontSize: 22, marginBottom: spacing.xs },
  value: { ...typography.h2, marginTop: spacing.xs },
  label: { ...typography.caption, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
});
