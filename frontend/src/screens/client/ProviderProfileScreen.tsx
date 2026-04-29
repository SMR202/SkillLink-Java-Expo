import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme';
import { providerApi } from '../../api/providers';
import { reviewApi } from '../../api/reviews';
import { ProviderProfile, Review } from '../../types';
import GradientButton from '../../components/GradientButton';
import ReviewCard from '../../components/ReviewCard';
import Avatar from '../../components/Avatar';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ProviderProfileScreen({ route, navigation }: any) {
  const { providerId } = route.params;
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, reviewsRes] = await Promise.all([
        providerApi.getProfile(providerId),
        reviewApi.getForProvider(providerId, 0, 10),
      ]);
      setProvider(p);
      setReviews(reviewsRes.data?.data?.content || []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          'Failed to load provider profile.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !provider) {
    return <LoadingSpinner message="Loading provider profile..." />;
  }

  if (!provider) {
    return (
      <View style={s.container}>
        <View style={s.errorWrap}>
          <Text style={s.errorText}>{error || 'Provider not found.'}</Text>
          <GradientButton
            title="Retry"
            onPress={load}
            style={s.retryButton}
          />
        </View>
      </View>
    );
  }

  const avgRating = provider.avgRating || 0;
  const totalReviews = provider.totalReviews || reviews.length;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.headerButtons}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.roundButton} activeOpacity={0.9}>
              <Text style={s.roundButtonText}>←</Text>
            </TouchableOpacity>
            <View style={s.roundButton}>
              <Text style={s.roundButtonText}>⇪</Text>
            </View>
          </View>
          <Text style={s.coverText}>COVER</Text>
        </View>

        <View style={s.profileCard}>
          <View style={s.avatarWrap}>
            <Avatar name={provider.fullName} uri={provider.avatarUrl} size={spacing.space80} />
            <View style={s.onlineDot} />
          </View>

          <Text style={s.name}>{provider.fullName}</Text>
          {provider.isVerified ? <Text style={s.badge}>Senior Consultant</Text> : null}

          <View style={s.metaRow}>
            <View style={s.metaGroup}>
              <Text style={s.metaStar}>★</Text>
              <Text style={s.metaPrimary}>{avgRating.toFixed(1)}</Text>
              <Text style={s.metaSecondary}>({totalReviews} reviews)</Text>
            </View>
            <Text style={s.metaDivider}>•</Text>
            <Text style={s.metaLocation}>{provider.city || 'Remote'}</Text>
          </View>
        </View>

        {provider.bio ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>About</Text>
            <View style={s.panel}>
              <Text style={s.sectionBody}>{provider.bio}</Text>
            </View>
          </View>
        ) : null}

        {provider.skills && provider.skills.length > 0 ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Expertise</Text>
            <View style={s.panel}>
              <View style={s.skillWrap}>
                {provider.skills.map((skill) => (
                  <View key={skill.id} style={s.skillChip}>
                    <Text style={s.skillText}>{skill.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {provider.portfolioLinks && provider.portfolioLinks.length > 0 ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Portfolio</Text>
            <View style={s.panel}>
              {provider.portfolioLinks.map((link, index) => (
                <Text key={index} style={s.portfolioLink}>{link}</Text>
              ))}
            </View>
          </View>
        ) : null}

        <View style={s.section}>
          <View style={s.reviewHeader}>
            <Text style={s.sectionTitle}>Client Reviews</Text>
            <Text style={s.viewAll}>View all →</Text>
          </View>
          {reviews.length === 0 ? (
            <View style={s.panel}>
              <Text style={s.sectionBody}>No reviews yet for this provider.</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.reviewScroller}>
              {reviews.map((review) => (
                <View key={review.id} style={s.reviewSlide}>
                  <ReviewCard
                    clientName={review.clientName}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                  />
                  {review.providerResponse ? (
                    <View style={s.replyCard}>
                      <Text style={s.replyTitle}>Provider response</Text>
                      <Text style={s.replyText}>{review.providerResponse}</Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        <View>
          <Text style={s.bottomLabel}>Starting at</Text>
          <Text style={s.bottomPrice}>$250/hr</Text>
        </View>
        <GradientButton
          onPress={() =>
            navigation.navigate('BookingForm', {
              providerId: provider.id,
              providerName: provider.fullName,
            })
          }
          title={`Book ${provider.fullName.split(' ')[0]}`}
          style={s.bottomButton}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.navHeight + spacing.space40,
  },
  hero: {
    height: spacing.space80 + spacing.space80 + spacing.space40,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space48,
    justifyContent: 'space-between',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: spacing.space40,
    height: spacing.space40,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  roundButtonText: {
    ...typography.bodyMedium,
    color: colors.onSurface,
  },
  coverText: {
    ...typography.h1,
    color: colors.surfaceContainerHighest,
    textAlign: 'center',
    opacity: 0.75,
    marginBottom: spacing.space32,
  },
  profileCard: {
    marginHorizontal: spacing.space16,
    marginTop: -spacing.space80,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    alignItems: 'center',
    ...shadows.sm,
  },
  avatarWrap: {
    marginBottom: spacing.space16,
  },
  onlineDot: {
    position: 'absolute',
    right: spacing.space4,
    bottom: spacing.space4,
    width: spacing.space16,
    height: spacing.space16,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.success,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceContainerLowest,
  },
  name: {
    ...typography.h2,
    color: colors.onSurface,
    textAlign: 'center',
  },
  badge: {
    ...typography.captionMedium,
    color: colors.primaryContainer,
    backgroundColor: colors.primaryFixed,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.space12,
    paddingVertical: spacing.space8,
    marginTop: spacing.space12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space8,
    marginTop: spacing.space16,
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space4,
  },
  metaStar: {
    ...typography.caption,
    color: colors.star,
  },
  metaPrimary: {
    ...typography.captionMedium,
    color: colors.onSurface,
  },
  metaSecondary: {
    ...typography.caption,
    color: colors.outline,
  },
  metaDivider: {
    ...typography.caption,
    color: colors.outlineVariant,
  },
  metaLocation: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  section: {
    marginTop: spacing.space32,
    paddingHorizontal: spacing.space16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.onSurface,
    marginBottom: spacing.space16,
  },
  panel: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space20,
    ...shadows.sm,
  },
  sectionBody: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
  },
  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space12,
  },
  skillChip: {
    borderRadius: borderRadius.pill,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  skillText: {
    ...typography.caption,
    color: colors.onSurface,
  },
  portfolioLink: {
    ...typography.body,
    color: colors.primary,
    marginBottom: spacing.space12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    ...typography.label,
    color: colors.primary,
  },
  reviewScroller: {
    gap: spacing.space12,
    paddingRight: spacing.space16,
  },
  reviewSlide: {
    width: spacing.space96 * 2 + spacing.space32,
  },
  replyCard: {
    marginTop: -spacing.space4,
    backgroundColor: colors.surfaceContainerLow,
    borderBottomLeftRadius: borderRadius.card,
    borderBottomRightRadius: borderRadius.card,
    paddingHorizontal: spacing.space20,
    paddingBottom: spacing.space20,
    paddingTop: spacing.space12,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    borderTopWidth: 0,
  },
  replyTitle: {
    ...typography.captionMedium,
    color: colors.onSurface,
    marginBottom: spacing.space4,
  },
  replyText: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space16,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: spacing.xxs,
    borderTopColor: colors.surfaceVariant,
    paddingHorizontal: spacing.space16,
    paddingTop: spacing.space16,
    paddingBottom: spacing.space24,
    ...shadows.md,
  },
  bottomLabel: {
    ...typography.caption,
    color: colors.outline,
  },
  bottomPrice: {
    ...typography.h3,
    color: colors.onSurface,
  },
  bottomButton: {
    flex: 1,
  },
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space24,
  },
  errorText: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.space16,
    width: '100%',
  },
});
