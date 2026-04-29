import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';
import { ProviderProfile } from '../types';
import Avatar from './Avatar';
import OutlineButton from './OutlineButton';
import PrimaryButton from './PrimaryButton';

interface ProviderCardProps {
  provider: ProviderProfile;
  onPress: () => void;
  onBook?: () => void;
}

export default function ProviderCard({ provider, onPress, onBook }: ProviderCardProps) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.94}>
      <View style={s.header}>
        <Avatar name={provider.fullName} uri={provider.avatarUrl} size={spacing.space64} />
        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={s.name}>{provider.fullName}</Text>
            {provider.isVerified ? <Text style={s.verified}>✦</Text> : null}
          </View>
          <Text style={s.role}>{provider.skills?.[0]?.name || provider.city || 'Professional'}</Text>
          <View style={s.ratingRow}>
            <Text style={s.ratingStar}>★</Text>
            <Text style={s.ratingValue}>{provider.avgRating?.toFixed(1) || '0.0'}</Text>
            <Text style={s.ratingMeta}>({provider.totalReviews || 0} reviews)</Text>
          </View>
        </View>
      </View>

      {provider.skills?.length ? (
        <View style={s.skills}>
          {provider.skills.slice(0, 3).map((skill) => (
            <View key={skill.id} style={s.skillChip}>
              <Text style={s.skillText}>{skill.name}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={s.footer}>
        <Text style={s.rate}>{provider.city || 'Available remotely'}</Text>
        {onBook ? <PrimaryButton title="Book Now" onPress={onBook} style={s.bookButton} /> : <OutlineButton title="View Profile" onPress={onPress} style={s.bookButton} />}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    marginBottom: spacing.space24,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space16,
  },
  info: {
    flex: 1,
    gap: spacing.space4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space8,
  },
  name: {
    ...typography.h3,
    color: colors.onSurface,
    flexShrink: 1,
  },
  verified: {
    ...typography.smallMedium,
    color: colors.verified,
  },
  role: {
    ...typography.small,
    color: colors.secondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space4,
  },
  ratingStar: {
    ...typography.caption,
    color: colors.star,
  },
  ratingValue: {
    ...typography.smallMedium,
    color: colors.tertiaryContainer,
  },
  ratingMeta: {
    ...typography.caption,
    color: colors.outline,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space8,
    marginTop: spacing.space16,
  },
  skillChip: {
    borderRadius: borderRadius.pill,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space8,
  },
  skillText: {
    ...typography.caption,
    color: colors.onSurface,
  },
  footer: {
    marginTop: spacing.space24,
    gap: spacing.space16,
  },
  rate: {
    ...typography.smallMedium,
    color: colors.outline,
    textAlign: 'right',
  },
  bookButton: {
    width: '100%',
  },
});
