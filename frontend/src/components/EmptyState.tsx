import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = '•', title, subtitle }: EmptyStateProps) {
  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <Text style={s.icon}>{icon}</Text>
      </View>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space24,
    marginTop: spacing.space24,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    ...shadows.sm,
  },
  iconWrap: {
    width: spacing.space56,
    height: spacing.space56,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  icon: {
    ...typography.h4,
    color: colors.primary,
  },
  title: {
    ...typography.h4,
    color: colors.onSurface,
    marginTop: spacing.space16,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
    textAlign: 'center',
  },
});
