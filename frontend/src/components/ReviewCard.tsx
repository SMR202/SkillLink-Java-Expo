import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import Avatar from './Avatar';

interface ReviewCardProps {
  clientName: string;
  clientAvatarUrl?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReviewCard({ clientName, clientAvatarUrl, rating, comment, createdAt }: ReviewCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆'));

  return (
    <View style={s.card}>
      <View style={s.header}>
        <Avatar name={clientName} uri={clientAvatarUrl} size={38} />
        <View style={s.info}>
          <Text style={s.name}>{clientName}</Text>
          <Text style={s.date}>{formatDate(createdAt)}</Text>
        </View>
        <View style={s.ratingBox}>
          <Text style={s.stars}>{stars.join('')}</Text>
          <Text style={s.ratingNum}>{rating.toFixed(1)}</Text>
        </View>
      </View>
      {comment ? <Text style={s.comment}>{comment}</Text> : null}
    </View>
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
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  ratingBox: { alignItems: 'flex-end' },
  stars: { color: colors.star, fontSize: 13, letterSpacing: 1 },
  ratingNum: { ...typography.captionMedium, color: colors.textSecondary },
  comment: { ...typography.body, color: colors.textSecondary, marginTop: spacing.md },
});
