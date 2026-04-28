import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';
import { bookingApi } from '../../api/bookings';
import { Booking } from '../../types';
import { useAuthStore } from '../../store/authStore';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  PENDING: { color: colors.pending, bg: '#FEF3C7', label: 'Pending' },
  ACCEPTED: { color: colors.accepted, bg: colors.accentLight, label: 'Accepted' },
  DECLINED: { color: colors.declined, bg: '#FEE2E2', label: 'Declined' },
  PAID: { color: '#4F46E5', bg: '#EEF2FF', label: 'Paid' },
  COMPLETED: { color: colors.textSecondary, bg: colors.bgInput, label: 'Completed' },
  CANCELLED: { color: colors.textSecondary, bg: colors.bgInput, label: 'Cancelled' },
};

const statusOrder = ['PENDING', 'ACCEPTED', 'PAID', 'COMPLETED'];

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BookingDetailScreen({ route, navigation }: any) {
  const initialBooking = route.params?.booking as Booking | undefined;
  const bookingId = route.params?.bookingId || initialBooking?.id;
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<Booking | undefined>(initialBooking);
  const [loading, setLoading] = useState(!initialBooking);
  const [error, setError] = useState<string | null>(null);

  const isClient = user?.role === 'CLIENT';
  const otherUserName = isClient ? booking?.providerName : booking?.clientName;

  useEffect(() => {
    const load = async () => {
      if (!bookingId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await bookingApi.getById(Number(bookingId));
        setBooking(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Could not load booking details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  const timeline = useMemo(() => {
    if (!booking) return [];
    const currentIndex = statusOrder.indexOf(booking.status);
    const base = [
      { key: 'PENDING', title: 'Request sent', detail: `Created ${formatDate(booking.createdAt)}` },
      { key: 'ACCEPTED', title: 'Provider accepted', detail: 'The booking is ready for payment.' },
      { key: 'PAID', title: 'Payment received', detail: 'Work can be completed and closed.' },
      { key: 'COMPLETED', title: 'Completed', detail: 'The service has been marked complete.' },
    ];

    if (booking.status === 'DECLINED') {
      return [
        { ...base[0], state: 'done' },
        { key: 'DECLINED', title: 'Declined', detail: booking.declineReason || 'The provider declined this request.', state: 'current' },
      ];
    }

    return base.map((item, index) => ({
      ...item,
      state: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'next',
    }));
  }, [booking]);

  if (loading && !booking) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="dark-content" />
        <View style={s.center}>
          <ActivityIndicator color={colors.primary} />
          <Text style={s.muted}>Loading booking details...</Text>
        </View>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="dark-content" />
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>Back</Text></Pressable>
          <Text style={s.title}>Booking Details</Text>
        </View>
        <View style={s.center}>
          <Text style={s.emptyTitle}>Booking unavailable</Text>
          <Text style={s.muted}>{error || 'This booking could not be found.'}</Text>
        </View>
      </View>
    );
  }

  const cfg = statusConfig[booking.status] || statusConfig.PENDING;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>Back</Text></Pressable>
        <View style={s.headerRow}>
          <View>
            <Text style={s.title}>Booking #{booking.id}</Text>
            <Text style={s.subtitle}>{otherUserName}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[s.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.body}>
        {error && <Text style={s.inlineError}>{error}</Text>}

        <View style={s.card}>
          <Text style={s.sectionTitle}>Schedule</Text>
          <View style={s.infoGrid}>
            <View style={s.infoItem}>
              <Text style={s.label}>Date</Text>
              <Text style={s.value}>{booking.preferredDate}</Text>
            </View>
            <View style={s.infoItem}>
              <Text style={s.label}>Time</Text>
              <Text style={s.value}>{booking.preferredTime}</Text>
            </View>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.sectionTitle}>Job Description</Text>
          <Text style={s.description}>{booking.jobDescription}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.sectionTitle}>People</Text>
          <View style={s.peopleRow}>
            <View style={s.avatar}><Text style={s.avatarText}>{booking.clientName?.[0]?.toUpperCase()}</Text></View>
            <View style={s.personText}>
              <Text style={s.value}>{booking.clientName}</Text>
              <Text style={s.label}>Client</Text>
            </View>
          </View>
          <View style={s.peopleRow}>
            <View style={s.avatar}><Text style={s.avatarText}>{booking.providerName?.[0]?.toUpperCase()}</Text></View>
            <View style={s.personText}>
              <Text style={s.value}>{booking.providerName}</Text>
              <Text style={s.label}>Provider</Text>
            </View>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.sectionTitle}>Timeline</Text>
          {timeline.map((item: any, index) => {
            const active = item.state === 'done' || item.state === 'current';
            return (
              <View key={item.key} style={s.timelineRow}>
                <View style={s.timelineRail}>
                  <View style={[s.dot, active && s.dotActive, item.key === 'DECLINED' && s.dotError]} />
                  {index < timeline.length - 1 && <View style={[s.line, active && s.lineActive]} />}
                </View>
                <View style={s.timelineText}>
                  <Text style={[s.timelineTitle, item.state === 'next' && s.timelineNext]}>{item.title}</Text>
                  <Text style={s.timelineDetail}>{item.detail}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={s.actions}>
          {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
            <Pressable
              style={s.primaryAction}
              onPress={() => navigation.navigate('Chat', { bookingId: booking.id, otherUserName })}
            >
              <Text style={s.primaryActionText}>Open Chat</Text>
            </Pressable>
          )}
          {isClient && booking.status === 'ACCEPTED' && (
            <Pressable
              style={s.secondaryAction}
              onPress={() =>
                navigation.navigate('Checkout', {
                  bookingId: booking.id,
                  providerName: booking.providerName,
                  jobDescription: booking.jobDescription,
                  preferredDate: booking.preferredDate,
                })
              }
            >
              <Text style={s.secondaryActionText}>Pay Now</Text>
            </Pressable>
          )}
          {isClient && booking.status === 'COMPLETED' && (
            <Pressable
              style={s.secondaryAction}
              onPress={() => navigation.navigate('ReviewForm', { bookingId: booking.id, providerName: booking.providerName })}
            >
              <Text style={s.secondaryActionText}>Leave Review</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: {
    backgroundColor: colors.bgPrimary,
    paddingTop: 54,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { ...typography.smallMedium, color: colors.accent, marginBottom: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  body: { padding: spacing.xxl, paddingBottom: spacing.huge },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: borderRadius.full },
  badgeText: { ...typography.captionMedium },
  infoGrid: { flexDirection: 'row', gap: spacing.md },
  infoItem: { flex: 1, backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md },
  label: { ...typography.caption, color: colors.textMuted },
  value: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  description: { ...typography.body, color: colors.textSecondary },
  peopleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgInput, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.smallMedium, color: colors.textPrimary },
  personText: { flex: 1 },
  timelineRow: { flexDirection: 'row', minHeight: 62 },
  timelineRail: { width: 24, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.border, marginTop: 2 },
  dotActive: { backgroundColor: colors.accent },
  dotError: { backgroundColor: colors.error },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 4 },
  lineActive: { backgroundColor: colors.accentLight },
  timelineText: { flex: 1, paddingBottom: spacing.md },
  timelineTitle: { ...typography.bodyMedium, color: colors.textPrimary },
  timelineNext: { color: colors.textMuted },
  timelineDetail: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  actions: { gap: spacing.md, marginTop: spacing.sm },
  primaryAction: { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: 14, alignItems: 'center' },
  primaryActionText: { ...typography.button, color: colors.textInverse },
  secondaryAction: { backgroundColor: colors.accentLight, borderRadius: borderRadius.md, paddingVertical: 14, alignItems: 'center' },
  secondaryActionText: { ...typography.button, color: colors.accent },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  muted: { ...typography.small, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary },
  inlineError: { ...typography.small, color: colors.error, marginBottom: spacing.md },
});
