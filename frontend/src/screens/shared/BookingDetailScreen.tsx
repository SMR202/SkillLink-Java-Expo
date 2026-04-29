import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';
import { bookingApi } from '../../api/bookings';
import { Booking } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';
import GradientButton from '../../components/GradientButton';

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
      { key: 'PENDING', title: 'Requested', detail: `Created ${formatDate(booking.createdAt)}` },
      { key: 'ACCEPTED', title: 'Accepted', detail: 'Provider has accepted your request.' },
      { key: 'PAID', title: 'Payment', detail: 'Complete payment to confirm the session.' },
      { key: 'COMPLETED', title: 'Completed', detail: 'The booking has been closed.' },
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
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={s.center}>
          <ActivityIndicator color={colors.primaryContainer} />
          <Text style={s.muted}>Loading booking details...</Text>
        </View>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={s.center}>
          <Text style={s.emptyTitle}>Booking unavailable</Text>
          <Text style={s.muted}>{error || 'This booking could not be found.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />
      <View style={s.topBar}>
        <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>←</Text></Pressable>
        <Text style={s.title}>Booking Details</Text>
        <Text style={s.help}>?</Text>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.profileCard}>
          <View style={s.profileTop}>
            <Avatar name={otherUserName} size={spacing.space80} />
            <View style={s.profileInfo}>
              <Text style={s.profileName}>{otherUserName}</Text>
              <Text style={s.profileRole}>Service Provider</Text>
              <Text style={s.profileRating}>★ 4.9 (124 reviews)</Text>
            </View>
            <Badge status={booking.status} label={booking.status} />
          </View>
          {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') ? (
            <GradientButton
              title="Message"
              onPress={() => navigation.navigate('Chat', { bookingId: booking.id, otherUserName })}
              style={s.fullButton}
              variant="outline"
            />
          ) : null}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Booking Status</Text>
          <View style={s.timelineRow}>
            {timeline.map((item: any) => (
              <View key={item.key} style={s.timelineStep}>
                <View style={[s.timelineDot, item.state !== 'next' && s.timelineDotActive]} />
                <Text style={[s.timelineLabel, item.state === 'current' && s.timelineLabelActive]}>{item.title}</Text>
              </View>
            ))}
          </View>
          <View style={s.infoBanner}>
            <Text style={s.infoBannerText}>
              {booking.status === 'ACCEPTED'
                ? 'Provider has accepted your request. Please complete the payment to confirm the appointment.'
                : booking.status === 'DECLINED'
                  ? booking.declineReason || 'This booking request was declined.'
                  : 'We will keep this booking updated as it progresses.'}
            </Text>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Schedule</Text>
          <Text style={s.infoLabel}>Date</Text>
          <Text style={s.infoValue}>{booking.preferredDate}</Text>
          <View style={s.divider} />
          <Text style={s.infoLabel}>Time</Text>
          <Text style={s.infoValue}>{booking.preferredTime}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Service Details</Text>
          <Text style={s.infoLabel}>Client Notes</Text>
          <View style={s.notesBox}>
            <Text style={s.notesText}>{booking.jobDescription}</Text>
          </View>
        </View>

        {isClient && booking.status === 'ACCEPTED' ? (
          <View style={s.paymentCard}>
            <Text style={s.paymentTitle}>Payment Summary</Text>
            <View style={s.summaryRow}><Text style={s.summaryLabel}>Service Fee</Text><Text style={s.summaryValue}>$225.00</Text></View>
            <View style={s.summaryRow}><Text style={s.summaryLabel}>Platform Fee</Text><Text style={s.summaryValue}>$15.00</Text></View>
            <View style={s.summaryRow}><Text style={s.summaryLabel}>Taxes</Text><Text style={s.summaryValue}>$18.50</Text></View>
            <View style={s.divider} />
            <Text style={s.totalLabel}>TOTAL DUE</Text>
            <Text style={s.totalValue}>$258.50</Text>
            <GradientButton
              title="Pay Now to Confirm"
              onPress={() =>
                navigation.navigate('Checkout', {
                  bookingId: booking.id,
                  providerName: booking.providerName,
                  jobDescription: booking.jobDescription,
                  preferredDate: booking.preferredDate,
                })
              }
              style={s.fullButton}
            />
          </View>
        ) : null}

        {isClient && booking.status === 'COMPLETED' ? (
          <GradientButton
            title="Leave Review"
            onPress={() => navigation.navigate('ReviewForm', { bookingId: booking.id, providerName: booking.providerName })}
            style={s.fullButton}
            variant="outline"
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceContainerLowest, paddingHorizontal: spacing.space20, paddingTop: spacing.space48, paddingBottom: spacing.space16, borderBottomWidth: spacing.xxs, borderBottomColor: colors.surfaceVariant },
  back: { ...typography.h3, color: colors.onSurface },
  title: { ...typography.h4, color: colors.onSurface },
  help: { ...typography.h4, color: colors.onSurfaceVariant },
  body: { padding: spacing.space16, paddingBottom: spacing.navHeight },
  profileCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: borderRadius.card, borderWidth: spacing.xxs, borderColor: colors.surfaceVariant, padding: spacing.space20, marginBottom: spacing.space20, ...shadows.sm },
  profileTop: { flexDirection: 'row', gap: spacing.space16, marginBottom: spacing.space20 },
  profileInfo: { flex: 1 },
  profileName: { ...typography.h3, color: colors.onSurface },
  profileRole: { ...typography.body, color: colors.onSurfaceVariant, marginTop: spacing.space4 },
  profileRating: { ...typography.caption, color: colors.tertiaryContainer, marginTop: spacing.space8 },
  fullButton: { width: '100%' },
  card: { backgroundColor: colors.surfaceContainerLowest, borderRadius: borderRadius.card, borderWidth: spacing.xxs, borderColor: colors.surfaceVariant, padding: spacing.space20, marginBottom: spacing.space20, ...shadows.sm },
  cardTitle: { ...typography.h4, color: colors.onSurface, marginBottom: spacing.space16 },
  timelineRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.space8 },
  timelineStep: { flex: 1, alignItems: 'center' },
  timelineDot: { width: spacing.space32, height: spacing.space32, borderRadius: borderRadius.pill, backgroundColor: colors.surfaceVariant, marginBottom: spacing.space8 },
  timelineDotActive: { backgroundColor: colors.primaryContainer },
  timelineLabel: { ...typography.caption, color: colors.outline, textAlign: 'center' },
  timelineLabelActive: { color: colors.primary },
  infoBanner: { marginTop: spacing.space20, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.card, padding: spacing.space16 },
  infoBannerText: { ...typography.body, color: colors.onSurfaceVariant },
  infoLabel: { ...typography.caption, color: colors.outline },
  infoValue: { ...typography.bodyLg, color: colors.onSurface, marginTop: spacing.space4 },
  divider: { height: spacing.xxs, backgroundColor: colors.surfaceVariant, marginVertical: spacing.space16 },
  notesBox: { backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.card, padding: spacing.space16 },
  notesText: { ...typography.body, color: colors.onSurface },
  paymentCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: borderRadius.card, borderTopWidth: spacing.xxs, borderTopColor: colors.primaryContainer, borderWidth: spacing.xxs, borderColor: colors.surfaceVariant, padding: spacing.space20, marginBottom: spacing.space20, ...shadows.sm },
  paymentTitle: { ...typography.h3, color: colors.onSurface, marginBottom: spacing.space20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.space12 },
  summaryLabel: { ...typography.body, color: colors.onSurfaceVariant },
  summaryValue: { ...typography.body, color: colors.onSurface },
  totalLabel: { ...typography.label, color: colors.onSurface, marginBottom: spacing.space8 },
  totalValue: { ...typography.h2, color: colors.onSurface, marginBottom: spacing.space20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.space24 },
  emptyTitle: { ...typography.h4, color: colors.onSurface },
  muted: { ...typography.body, color: colors.onSurfaceVariant, marginTop: spacing.space8, textAlign: 'center' },
});
