import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Booking } from '../types';
import Badge from './Badge';
import Avatar from './Avatar';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  showProvider?: boolean;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BookingCard({ booking, onPress, showProvider = true }: BookingCardProps) {
  const personName = showProvider ? booking.providerName : booking.clientName;
  const personAvatarUrl = showProvider ? booking.providerAvatarUrl : null;

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.75}>
      <View style={s.header}>
        <Avatar name={personName} uri={personAvatarUrl} size={42} />
        <View style={s.info}>
          <Text style={s.name}>{personName}</Text>
          <Text style={s.date}>{booking.preferredDate} · {booking.preferredTime}</Text>
        </View>
        <Badge status={booking.status} />
      </View>
      <Text style={s.description} numberOfLines={2}>{booking.jobDescription}</Text>
      <Text style={s.bookingId}>Booking #{booking.id}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  info: { flex: 1 },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  description: { ...typography.small, color: colors.textSecondary },
  bookingId: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
});
