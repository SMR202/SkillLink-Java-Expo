import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../theme';

type BadgeVariant = 'pending' | 'accepted' | 'declined' | 'completed' | 'open' | 'filled' | 'paid' | 'cancelled' | 'closed' | 'default';

const variantMap: Record<BadgeVariant, { bg: string; color: string; label?: string }> = {
  pending:   { bg: '#FEF3C7', color: colors.pending },
  accepted:  { bg: colors.accentLight, color: colors.accepted },
  declined:  { bg: '#FEE2E2', color: colors.declined },
  completed: { bg: '#F3F4F6', color: colors.textSecondary },
  cancelled: { bg: '#F3F4F6', color: colors.textSecondary },
  open:      { bg: '#EEF2FF', color: '#4F46E5' },
  filled:    { bg: colors.accentLight, color: colors.accentDark },
  paid:      { bg: '#EEF2FF', color: '#4F46E5' },
  closed:    { bg: '#F3F4F6', color: colors.textMuted },
  default:   { bg: '#F3F4F6', color: colors.textSecondary },
};

interface BadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ status, label, size = 'sm' }: BadgeProps) {
  const key = (status?.toLowerCase() as BadgeVariant) || 'default';
  const cfg = variantMap[key] || variantMap.default;
  const text = label ?? (status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '—');

  return (
    <View style={[s.badge, { backgroundColor: cfg.bg }, size === 'md' && s.badgeMd]}>
      <Text style={[s.text, { color: cfg.color }, size === 'md' && s.textMd]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeMd: { paddingHorizontal: 14, paddingVertical: 5 },
  text: { ...typography.captionMedium },
  textMd: { ...typography.smallMedium },
});
