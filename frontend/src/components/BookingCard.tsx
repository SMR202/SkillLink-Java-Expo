import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';
import { Booking } from '../types';
import Avatar from './Avatar';
import Badge from './Badge';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  showProvider?: boolean;
}

export default function BookingCard({ booking, onPress, showProvider = true }: BookingCardProps) {
  const personName = showProvider ? booking.providerName : booking.clientName;
  const personAvatarUrl = showProvider ? booking.providerAvatarUrl : null;

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.94}>
      <View style={s.topRow}>
        <Avatar name={personName} uri={personAvatarUrl} size={spacing.space48} />
        <View style={s.info}>
          <Text style={s.name}>{personName}</Text>
          <Text style={s.date}>{booking.preferredDate} • {booking.preferredTime}</Text>
        </View>
        <Badge status={booking.status} />
      </View>
      <Text style={s.description} numberOfLines={2}>{booking.jobDescription}</Text>
      <Text style={s.meta}>Booking #{booking.id}</Text>
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
    marginBottom: spacing.space16,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space16,
    marginBottom: spacing.space16,
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
  description: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  meta: {
    ...typography.caption,
    color: colors.outline,
    marginTop: spacing.space12,
  },
});
