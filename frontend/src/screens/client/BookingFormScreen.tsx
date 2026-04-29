import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { bookingApi } from '../../api/bookings';
import GradientButton from '../../components/GradientButton';
import InputField from '../../components/InputField';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';

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
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={s.confirmContent} showsVerticalScrollIndicator={false}>
        <View style={s.confirmCircle}>
          <Text style={s.confirmCircleText}>✓</Text>
        </View>
        <Text style={s.confirmTitle}>Booking Sent!</Text>

        <View style={s.confirmCard}>
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Booking ID</Text>
            <Text style={s.confirmValue}>#{bookingResult.id}</Text>
          </View>
          <View style={s.confirmDivider} />
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Provider</Text>
            <Text style={s.confirmValue}>{providerName}</Text>
          </View>
          <View style={s.confirmDivider} />
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Date &amp; Time</Text>
            <Text style={s.confirmValue}>{bookingResult.preferredDate} • {bookingResult.preferredTime}</Text>
          </View>
          <View style={s.confirmDivider} />
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Status</Text>
            <Badge status="pending" label="Pending" />
          </View>
        </View>

        <View style={s.noticeRow}>
          <Text style={s.noticeIcon}>🔒</Text>
          <Text style={s.noticeText}>The provider has been notified and can now review your request.</Text>
        </View>

        <GradientButton onPress={() => navigation.popToTop()} title="Back to Home" style={s.confirmButton} />
      </ScrollView>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backButton} activeOpacity={0.9}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <Text style={s.title}>Request Booking</Text>
        </View>

        <View style={s.providerCard}>
          <Avatar name={providerName} size={spacing.space64} />
          <View style={s.providerInfo}>
            <Text style={s.providerName}>{providerName}</Text>
            <Text style={s.providerRole}>Professional service provider</Text>
          </View>
          <View style={s.ratingChip}>
            <Text style={s.ratingStar}>★</Text>
            <Text style={s.ratingText}>4.9</Text>
          </View>
        </View>

        <View style={s.formCard}>
          <Text style={s.sectionTitle}>Project Description</Text>
          <Text style={s.sectionBody}>Briefly describe what you need help with to ensure it&apos;s a good fit.</Text>

          <TextInput
            style={s.textArea}
            placeholder="E.g., I am looking for a 3-month coaching engagement to prepare for a transition to a VP role..."
            placeholderTextColor={colors.outlineVariant}
            value={desc}
            onChangeText={setDesc}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />

          <View style={s.fieldRow}>
            <View style={s.fieldColumn}>
              <InputField
                label="Preferred Start Date"
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
                containerStyle={s.compactField}
              />
              {date ? <Text style={[s.helperText, isDateValid ? s.helperTextValid : s.helperTextError]}>{isDateValid ? 'Future date looks good.' : 'Please use a future date in YYYY-MM-DD format.'}</Text> : null}
            </View>

            <View style={s.fieldColumn}>
              <InputField
                label="Preferred Time Window"
                placeholder="HH:MM"
                value={time}
                onChangeText={setTime}
                containerStyle={s.compactField}
              />
              {time ? <Text style={[s.helperText, isTimeValid ? s.helperTextValid : s.helperTextError]}>{isTimeValid ? 'Time format looks good.' : 'Please use HH:MM, for example 14:00.'}</Text> : null}
            </View>
          </View>

          <View style={s.charRow}>
            <Text style={s.charCount}>{desc.length}/500 characters{desc.length < 20 ? ' (min 20)' : ''}</Text>
            <View style={s.charTrack}>
              <View style={[s.charFill, { width: `${Math.min(100, (desc.length / 500) * 100)}%` }]} />
            </View>
          </View>

          <View style={s.separator} />

          <GradientButton onPress={handleSubmit} title="Send Booking Request" loading={loading} disabled={!allValid} style={s.submitButton} />

          <View style={s.footnoteRow}>
            <Text style={s.footnoteIcon}>🔒</Text>
            <Text style={s.footnoteText}>
              You won&apos;t be charged yet. The provider has 24 hours to review and accept your request.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space48,
    paddingBottom: spacing.space80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space16,
    marginBottom: spacing.space32,
  },
  backButton: {
    width: spacing.space48,
    height: spacing.space48,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    ...typography.h4,
    color: colors.onSurfaceVariant,
  },
  title: {
    ...typography.h2,
    color: colors.onBackground,
    flexShrink: 1,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    marginBottom: spacing.space32,
    ...shadows.sm,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    ...typography.h3,
    color: colors.onSurface,
  },
  providerRole: {
    ...typography.body,
    color: colors.secondary,
    marginTop: spacing.space4,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space4,
    paddingHorizontal: spacing.space12,
    paddingVertical: spacing.space8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainerLow,
  },
  ratingStar: {
    ...typography.caption,
    color: colors.star,
  },
  ratingText: {
    ...typography.captionMedium,
    color: colors.onSurfaceVariant,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.onBackground,
  },
  sectionBody: {
    ...typography.body,
    color: colors.secondary,
    marginTop: spacing.space8,
    marginBottom: spacing.space16,
  },
  textArea: {
    minHeight: spacing.space80 + spacing.space56,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space16,
    color: colors.onBackground,
    ...typography.body,
  },
  fieldRow: {
    gap: spacing.space16,
    marginTop: spacing.space24,
  },
  fieldColumn: {
    flex: 1,
  },
  compactField: {
    marginBottom: 0,
  },
  helperText: {
    ...typography.caption,
    marginTop: spacing.space8,
  },
  helperTextValid: {
    color: colors.success,
  },
  helperTextError: {
    color: colors.error,
  },
  charRow: {
    gap: spacing.space8,
    marginTop: spacing.space16,
  },
  charCount: {
    ...typography.caption,
    color: colors.outline,
  },
  charTrack: {
    width: spacing.space80,
    height: spacing.space4,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  charFill: {
    height: spacing.space4,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primaryContainer,
  },
  separator: {
    height: spacing.xxs,
    backgroundColor: colors.surfaceVariant,
    marginTop: spacing.space24,
    marginBottom: spacing.space24,
  },
  submitButton: {
    width: '100%',
  },
  footnoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.space8,
    marginTop: spacing.space16,
  },
  footnoteIcon: {
    ...typography.caption,
    color: colors.secondary,
  },
  footnoteText: {
    ...typography.caption,
    color: colors.secondary,
    flex: 1,
    textAlign: 'center',
  },
  confirmContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space48,
  },
  confirmCircle: {
    width: spacing.space80,
    height: spacing.space80,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.space20,
  },
  confirmCircleText: {
    ...typography.h3,
    color: colors.primary,
  },
  confirmTitle: {
    ...typography.h2,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.space24,
  },
  confirmCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    ...shadows.sm,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.space12,
    paddingVertical: spacing.space12,
  },
  confirmLabel: {
    ...typography.small,
    color: colors.outline,
  },
  confirmValue: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    flexShrink: 1,
    textAlign: 'right',
  },
  confirmDivider: {
    height: spacing.xxs,
    backgroundColor: colors.surfaceVariant,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space8,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.control,
    padding: spacing.space16,
    marginTop: spacing.space24,
  },
  noticeIcon: {
    ...typography.caption,
    color: colors.secondary,
  },
  noticeText: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  confirmButton: {
    width: '100%',
    marginTop: spacing.space24,
  },
});
