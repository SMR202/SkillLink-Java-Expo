import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';
import Avatar from './Avatar';

interface ReviewCardProps {
  clientName: string;
  clientAvatarUrl?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReviewCard({ clientName, clientAvatarUrl, rating, comment, createdAt }: ReviewCardProps) {
  return (
    <View style={s.card}>
      <View style={s.header}>
        <Avatar name={clientName} uri={clientAvatarUrl} size={spacing.space40} />
        <View style={s.info}>
          <Text style={s.name}>{clientName}</Text>
          <Text style={s.date}>{formatDate(createdAt)}</Text>
        </View>
        <View style={s.ratingRow}>
          <Text style={s.stars}>{'★'.repeat(Math.max(0, Math.min(5, Math.round(rating))))}</Text>
          <Text style={s.score}>{rating.toFixed(1)}</Text>
        </View>
      </View>
      {comment ? <Text style={s.comment}>{comment}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    marginBottom: spacing.space16,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space16,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.onSurface,
  },
  date: {
    ...typography.caption,
    color: colors.outline,
    marginTop: spacing.space4,
  },
  ratingRow: {
    alignItems: 'flex-end',
  },
  stars: {
    ...typography.caption,
    color: colors.star,
  },
  score: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: spacing.space4,
  },
  comment: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space16,
  },
});
