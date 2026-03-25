import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { bookingApi } from '../../api/bookings';
import GradientButton from '../../components/GradientButton';

export default function BookingFormScreen({ route, navigation }: any) {
  const { providerId, providerName } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date) > new Date();
  const isTimeValid = /^\d{2}:\d{2}$/.test(time);
  const isDescValid = desc.length >= 20;
  const allValid = isDateValid && isTimeValid && isDescValid;

  const handleSubmit = async () => {
    if (!allValid) { Alert.alert('Error', 'Please fill in all fields correctly.'); return; }
    setLoading(true);
    try {
      const result = await bookingApi.create({ providerId, preferredDate: date, preferredTime: time, jobDescription: desc });
      setBookingResult(result);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Booking failed.');
    } finally { setLoading(false); }
  };

  if (bookingResult) return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.confirmBox}>
        <View style={s.confirmCircle}><Text style={{ fontSize: 32 }}>✓</Text></View>
        <Text style={s.confirmTitle}>Booking Sent!</Text>
        <View style={s.confirmCard}>
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Booking ID</Text>
            <Text style={s.confirmVal}>#{bookingResult.id}</Text>
          </View>
          <View style={s.confirmDivider} />
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Provider</Text>
            <Text style={s.confirmVal}>{providerName}</Text>
          </View>
          <View style={s.confirmDivider} />
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Date & Time</Text>
            <Text style={s.confirmVal}>{bookingResult.preferredDate} at {bookingResult.preferredTime}</Text>
          </View>
          <View style={s.confirmDivider} />
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Status</Text>
            <View style={s.statusBadge}><Text style={s.statusText}>⏳ Pending</Text></View>
          </View>
        </View>
        <View style={s.notifRow}>
          <Text style={s.notifIcon}>🔔</Text>
          <Text style={s.notifText}>Provider has been notified of your request</Text>
        </View>
        <GradientButton onPress={() => navigation.popToTop()} title="Back to Home" style={{ marginTop: spacing.xl, width: '100%' }} />
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={s.title}>Book Service</Text>
        <View style={s.providerRow}>
          <View style={s.providerAvatar}><Text style={s.providerAvatarText}>{providerName?.[0]}</Text></View>
          <Text style={s.providerLabel}>{providerName}</Text>
        </View>

        {/* Date */}
        <Text style={s.label}>Preferred Date</Text>
        <TextInput style={[s.input, date && !isDateValid && s.inputError]} placeholder="YYYY-MM-DD (future dates only)"
          placeholderTextColor={colors.textMuted} value={date} onChangeText={setDate} />
        {date && !isDateValid && <Text style={s.errorHint}>Please enter a valid future date (YYYY-MM-DD)</Text>}
        {isDateValid && <Text style={s.validHint}>✓ Valid date</Text>}

        {/* Time */}
        <Text style={s.label}>Preferred Time</Text>
        <TextInput style={[s.input, time && !isTimeValid && s.inputError]} placeholder="HH:MM (e.g. 14:00)"
          placeholderTextColor={colors.textMuted} value={time} onChangeText={setTime} />

        {/* Description */}
        <Text style={s.label}>Job Description</Text>
        <TextInput style={[s.input, s.textArea]} placeholder="Describe the work you need done..."
          placeholderTextColor={colors.textMuted} value={desc} onChangeText={setDesc}
          multiline textAlignVertical="top" maxLength={500} />
        <View style={s.charRow}>
          <Text style={[s.charCount, isDescValid && { color: colors.accent }]}>
            {desc.length}/500 characters {desc.length < 20 ? `(min 20)` : ''}
          </Text>
          <View style={s.charBar}>
            <View style={[s.charFill, { width: `${Math.min(100, (desc.length / 500) * 100)}%` }]} />
          </View>
        </View>

        <View style={{ height: spacing.xl }} />
        <GradientButton onPress={handleSubmit} title="Confirm Booking" loading={loading}
          disabled={!allValid} variant="accent" />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingHorizontal: spacing.xxl, paddingTop: 50, paddingBottom: 100 },
  backBtn: { marginBottom: spacing.xl },
  backText: { ...typography.button, color: colors.textSecondary },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xxl, backgroundColor: colors.bgSecondary, padding: spacing.lg, borderRadius: borderRadius.md },
  providerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgInput, justifyContent: 'center', alignItems: 'center' },
  providerAvatarText: { ...typography.bodyMedium, color: colors.textPrimary },
  providerLabel: { ...typography.bodyMedium, color: colors.textPrimary },
  label: { ...typography.smallMedium, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.lg },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: 14, color: colors.textPrimary, ...typography.body, borderWidth: 1, borderColor: colors.border },
  inputError: { borderColor: colors.error },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  errorHint: { ...typography.caption, color: colors.error, marginTop: 4 },
  validHint: { ...typography.caption, color: colors.accent, marginTop: 4 },
  charRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  charCount: { ...typography.caption, color: colors.textMuted },
  charBar: { width: 80, height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  charFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },
  // Confirmation
  confirmBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xxl },
  confirmCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accentLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  confirmTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xl },
  confirmCard: { width: '100%', backgroundColor: colors.bgSecondary, borderRadius: borderRadius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.border },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  confirmLabel: { ...typography.small, color: colors.textMuted },
  confirmVal: { ...typography.bodyMedium, color: colors.textPrimary },
  confirmDivider: { height: 1, backgroundColor: colors.border },
  statusBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.full },
  statusText: { ...typography.captionMedium, color: colors.pending },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl, backgroundColor: colors.bgSecondary, padding: spacing.lg, borderRadius: borderRadius.md, width: '100%' },
  notifIcon: { fontSize: 18 },
  notifText: { ...typography.small, color: colors.textSecondary, flex: 1 },
});
