import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = '📭', title, subtitle }: EmptyStateProps) {
  return (
    <View style={s.container}>
      <Text style={s.icon}>{icon}</Text>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    marginTop: spacing.huge,
  },
  icon: { fontSize: 48 },
  title: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.lg, textAlign: 'center' },
  subtitle: { ...typography.small, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
});
