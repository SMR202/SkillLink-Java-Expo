import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../theme';

type BadgeVariant =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'completed'
  | 'open'
  | 'filled'
  | 'paid'
  | 'cancelled'
  | 'closed'
  | 'default';

const variantMap: Record<BadgeVariant, { bg: string; color: string }> = {
  pending: { bg: colors.warningSurface, color: colors.pending },
  accepted: { bg: colors.successSurface, color: colors.accepted },
  declined: { bg: colors.errorSurface, color: colors.declined },
  completed: { bg: colors.surfaceContainer, color: colors.completed },
  cancelled: { bg: colors.surfaceContainer, color: colors.cancelled },
  open: { bg: colors.infoSurface, color: colors.paid },
  filled: { bg: colors.successSurface, color: colors.accepted },
  paid: { bg: colors.infoSurface, color: colors.paid },
  closed: { bg: colors.surfaceContainer, color: colors.outline },
  default: { bg: colors.surfaceContainer, color: colors.onSurfaceVariant },
};

interface BadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ status, label, size = 'sm' }: BadgeProps) {
  const key = (status?.toLowerCase() as BadgeVariant) || 'default';
  const cfg = variantMap[key] || variantMap.default;
  const text = label ?? (status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Status');

  return (
    <View style={[s.badge, { backgroundColor: cfg.bg }, size === 'md' && s.badgeMd]}>
      <Text style={[s.text, { color: cfg.color }, size === 'md' && s.textMd]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.space12,
    paddingVertical: spacing.space4,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space8,
  },
  text: {
    ...typography.caption,
  },
  textMd: {
    ...typography.smallMedium,
  },
});
