import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme';
import { reviewApi } from '../../api/reviews';
import GradientButton from '../../components/GradientButton';
import Avatar from '../../components/Avatar';

export default function ReviewFormScreen({ route, navigation }: any) {
  const { bookingId, providerName } = route.params || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = rating >= 1 && comment.length >= 20;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await reviewApi.submit({ bookingId, rating, reviewText: comment });
      setSubmitted(true);
    } catch (e: any) {
      Alert.alert(
        'Error',
        e.response?.data?.message || 'Failed to submit review',
      );
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={s.successWrap}>
          <View style={s.successBadge}>
            <Text style={s.successBadgeText}>✓</Text>
          </View>
          <Text style={s.successTitle}>Review Submitted!</Text>
          <Text style={s.successSub}>Thank you for your feedback.</Text>
          <GradientButton
            title="Back to Bookings"
            onPress={() => navigation.goBack()}
            style={s.successButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={s.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={s.closeButton}>
          <Text style={s.closeText}>×</Text>
        </Pressable>
        <Text style={s.title}>Leave a Review</Text>
        <View style={s.closeButtonPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.profileBlock}>
          <Avatar name={providerName} size={spacing.space96} />
          <Text style={s.providerName}>{providerName || 'Service Provider'}</Text>
          <Text style={s.providerRole}>Senior Full-Stack Developer</Text>
        </View>

        <View style={s.ratingCard}>
          <Text style={s.ratingTitle}>How was your experience?</Text>
          <View style={s.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable
                key={i}
                onPress={() => setRating(i)}
                style={s.starButton}
              >
                <Text style={[s.star, i <= rating && s.starActive]}>
                  ★
                </Text>
              </Pressable>
            ))}
          </View>
          {rating > 0 ? (
            <Text style={s.ratingLabel}>
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </Text>
          ) : null}
        </View>

        <Text style={s.label}>Share details of your experience</Text>
        <TextInput
          style={s.input}
          placeholder="What did they do well? How could they improve? Your feedback helps the community."
          placeholderTextColor={colors.onSurfaceVariant}
          multiline
          numberOfLines={5}
          maxLength={1000}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
        />
        <View style={s.counterRow}>
          <Text style={s.publicHint}>Reviews are public</Text>
          <Text style={[s.counter, comment.length < 20 && s.counterError]}>
            {comment.length} / 500
          </Text>
        </View>

        <GradientButton
          title="Submit Review"
          onPress={handleSubmit}
          loading={loading}
          disabled={!isValid}
          style={s.submitButton}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space48,
    paddingBottom: spacing.space20,
    borderBottomWidth: spacing.xxs,
    borderBottomColor: colors.surfaceVariant,
  },
  closeButton: {
    width: spacing.space40,
    height: spacing.space40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    ...typography.h3,
    color: colors.onSurface,
  },
  title: {
    ...typography.h3,
    color: colors.onSurface,
  },
  closeButtonPlaceholder: {
    width: spacing.space40,
  },
  content: {
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space32,
    paddingBottom: spacing.space80,
  },
  profileBlock: {
    alignItems: 'center',
    marginBottom: spacing.space32,
  },
  providerName: {
    ...typography.h1,
    color: colors.onSurface,
    textAlign: 'center',
    marginTop: spacing.space16,
  },
  providerRole: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space8,
  },
  ratingCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    alignItems: 'center',
    marginBottom: spacing.space32,
    ...shadows.sm,
  },
  ratingTitle: {
    ...typography.h2,
    color: colors.onSurface,
    textAlign: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.space12,
    justifyContent: 'center',
    paddingVertical: spacing.space24,
  },
  starButton: {
    padding: spacing.space4,
  },
  star: {
    ...typography.h1,
    color: colors.surfaceVariant,
  },
  starActive: {
    color: colors.primaryContainer,
  },
  ratingLabel: {
    ...typography.h4,
    color: colors.primary,
  },
  label: {
    ...typography.h4,
    color: colors.onSurface,
    marginBottom: spacing.space16,
  },
  input: {
    minHeight: spacing.space80 + spacing.space80,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    padding: spacing.space20,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.space8,
    marginBottom: spacing.space40,
  },
  publicHint: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  counter: {
    ...typography.caption,
    color: colors.outline,
  },
  counterError: {
    color: colors.error,
  },
  submitButton: {
    width: '100%',
  },
  successWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.space24,
  },
  successBadge: {
    width: spacing.space80,
    height: spacing.space80,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFixed,
    marginBottom: spacing.space20,
  },
  successBadgeText: {
    ...typography.h3,
    color: colors.primary,
  },
  successTitle: {
    ...typography.h2,
    color: colors.onSurface,
  },
  successSub: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
  },
  successButton: {
    marginTop: spacing.space24,
    width: '100%',
  },
});
