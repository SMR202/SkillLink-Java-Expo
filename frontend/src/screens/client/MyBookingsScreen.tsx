import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { bookingApi } from '../../api/bookings';
import { Booking } from '../../types';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  PENDING: { color: colors.pending, bg: '#FEF3C7', label: 'Pending' },
  ACCEPTED: { color: colors.accepted, bg: colors.accentLight, label: 'Accepted' },
  DECLINED: { color: colors.declined, bg: '#FEE2E2', label: 'Declined' },
  COMPLETED: { color: colors.textSecondary, bg: colors.bgInput, label: 'Completed' },
};

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await bookingApi.getMyBookings(); setBookings(r.content || []); } catch {} setLoading(false); };

  const renderItem = ({ item }: { item: Booking }) => {
    const cfg = statusConfig[item.status] || statusConfig.PENDING;
    return (
      <View style={s.card}>
        <View style={s.cardTop}>
          <View style={s.av}><Text style={s.avT}>{item.providerName?.[0]?.toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{item.providerName}</Text>
            <Text style={s.date}>{item.preferredDate} · {item.preferredTime}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[s.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        <Text style={s.desc} numberOfLines={2}>{item.jobDescription}</Text>
        {item.declineReason && <Text style={s.reason}>Reason: {item.declineReason}</Text>}
      </View>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.title}>My Bookings</Text>
      </View>
      <FlatList data={bookings} renderItem={renderItem} keyExtractor={i => i.id.toString()}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 40 }}>{loading ? '⏳' : '📋'}</Text>
            <Text style={s.emptyText}>{loading ? 'Loading...' : 'No bookings yet'}</Text>
            <Text style={s.emptyDesc}>Book a service provider to get started</Text>
          </View>
        } />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 54, paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.h2, color: colors.textPrimary },
  list: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: 100 },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  av: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgInput, justifyContent: 'center', alignItems: 'center' },
  avT: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '600' },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.full },
  badgeText: { ...typography.captionMedium },
  desc: { ...typography.small, color: colors.textSecondary },
  reason: { ...typography.caption, color: colors.error, marginTop: spacing.sm },
  empty: { alignItems: 'center', marginTop: spacing.huge },
  emptyText: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.lg },
  emptyDesc: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs },
});
