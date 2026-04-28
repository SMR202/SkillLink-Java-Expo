import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { ProviderProfile } from '../types';
import Avatar from './Avatar';

interface ProviderCardProps {
  provider: ProviderProfile;
  onPress: () => void;
  onBook?: () => void;
}

export default function ProviderCard({ provider, onPress, onBook }: ProviderCardProps) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.75}>
      <View style={s.header}>
        <Avatar name={provider.fullName} uri={provider.avatarUrl} size={48} />
        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={s.name}>{provider.fullName}</Text>
            {provider.isVerified && (
              <View style={s.verifiedBadge}>
                <Text style={s.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={s.city}>📍 {provider.city || 'No location'}</Text>
        </View>
        <View style={s.ratingBox}>
          <Text style={s.star}>★</Text>
          <Text style={s.rating}>{provider.avgRating?.toFixed(1) || '0.0'}</Text>
        </View>
      </View>
      {provider.skills?.length > 0 && (
        <View style={s.skills}>
          {provider.skills.slice(0, 3).map((sk) => (
            <View key={sk.id} style={s.chip}>
              <Text style={s.chipText}>{sk.name}</Text>
            </View>
          ))}
          {provider.skills.length > 3 && (
            <Text style={s.more}>+{provider.skills.length - 3}</Text>
          )}
        </View>
      )}
      {onBook && (
        <TouchableOpacity style={s.bookBtn} onPress={onBook} activeOpacity={0.85}>
          <Text style={s.bookText}>Book Now</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  city: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  verifiedBadge: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.full,
    width: 18, height: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  verifiedText: { fontSize: 10, color: colors.accentDark, fontWeight: '700' },
  ratingBox: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  star: { color: colors.star, fontSize: 14 },
  rating: { ...typography.bodyMedium, color: colors.textPrimary },
  skills: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md, flexWrap: 'wrap' },
  chip: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  chipText: { ...typography.caption, color: colors.accentDark, fontWeight: '600' },
  more: { ...typography.caption, color: colors.textMuted, alignSelf: 'center' },
  bookBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  bookText: { ...typography.buttonSmall, color: colors.textInverse },
});
