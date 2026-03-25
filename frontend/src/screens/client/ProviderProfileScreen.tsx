import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { providerApi } from '../../api/providers';
import { ProviderProfile } from '../../types';
import GradientButton from '../../components/GradientButton';

export default function ProviderProfileScreen({ route, navigation }: any) {
  const { providerId } = route.params;
  const [provider, setProvider] = useState<ProviderProfile | null>(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try { const p = await providerApi.getProfile(providerId); setProvider(p); } catch {}
  };

  if (!provider) return <View style={s.container}><Text style={s.loadingText}>Loading...</Text></View>;

  // Mock reviews for demo display
  const mockReviews = [
    { id: 1, clientName: 'Sara Ahmed', rating: 5, comment: 'Excellent work! Very professional and completed the job on time. Highly recommended.', date: '2026-03-20' },
    { id: 2, clientName: 'Usman Ali', rating: 4, comment: 'Good service, was punctual and did the work as described. Will hire again.', date: '2026-03-15' },
    { id: 3, clientName: 'Fatima Khan', rating: 5, comment: 'Amazing attention to detail. Fixed everything perfectly.', date: '2026-03-10' },
  ];

  const avgRating = provider.avgRating || 4.7;
  const totalReviews = provider.totalReviews || mockReviews.length;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Profile Header */}
        <View style={s.profileHeader}>
          <View style={s.avatarLg}>
            <Text style={s.avatarLgText}>{provider.fullName?.[0]?.toUpperCase()}</Text>
          </View>
          <Text style={s.name}>{provider.fullName}</Text>
          <Text style={s.location}>📍 {provider.city || 'No location'}</Text>
          {provider.isVerified && (
            <View style={s.verifiedRow}><Text style={s.verifiedText}>✓ Verified Professional</Text></View>
          )}
        </View>

        {/* Stats Row */}
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statVal}>★ {avgRating.toFixed(1)}</Text>
            <Text style={s.statSub}>/ 5.0</Text>
            <Text style={s.statLabel}>Rating</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statVal}>{totalReviews}</Text>
            <Text style={s.statLabel}>Reviews</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statVal}>{provider.isVerified ? '✓' : '—'}</Text>
            <Text style={s.statLabel}>Verified</Text>
          </View>
        </View>

        {/* Bio */}
        {provider.bio && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>About</Text>
            <Text style={s.bio}>{provider.bio}</Text>
          </View>
        )}

        {/* Skills */}
        {provider.skills && provider.skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills & Expertise</Text>
            <View style={s.chipRow}>
              {provider.skills.map((sk: any) => (
                <View key={sk.id} style={s.chip}>
                  <Text style={s.chipText}>{sk.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Portfolio */}
        {provider.portfolioLinks && provider.portfolioLinks.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Portfolio</Text>
            {provider.portfolioLinks.map((link: string, i: number) => (
              <View key={i} style={s.linkRow}>
                <Text style={s.linkIcon}>🔗</Text>
                <Text style={s.link}>{link}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews */}
        <View style={s.section}>
          <View style={s.reviewHeader}>
            <Text style={s.sectionTitle}>Client Reviews</Text>
            <Text style={s.reviewCount}>{totalReviews} reviews</Text>
          </View>
          {mockReviews.map(review => (
            <View key={review.id} style={s.reviewCard}>
              <View style={s.reviewTop}>
                <View style={s.reviewAvatar}>
                  <Text style={s.reviewAvatarText}>{review.clientName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.reviewName}>{review.clientName}</Text>
                  <Text style={s.reviewDate}>{review.date}</Text>
                </View>
                <View style={s.reviewStars}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Text key={i} style={{ color: i <= review.rating ? colors.star : colors.border, fontSize: 14 }}>★</Text>
                  ))}
                </View>
              </View>
              <Text style={s.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        {/* Book Button */}
        <View style={{ marginTop: spacing.md, marginBottom: spacing.xxl }}>
          <GradientButton
            onPress={() => navigation.navigate('BookingForm', { providerId: provider.id, providerName: provider.fullName })}
            title="Book Now" variant="accent"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingHorizontal: spacing.xxl, paddingTop: 50, paddingBottom: 40 },
  loadingText: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.huge },
  backBtn: { marginBottom: spacing.xl },
  backText: { ...typography.button, color: colors.textSecondary },
  profileHeader: { alignItems: 'center', marginBottom: spacing.xxl },
  avatarLg: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.bgInput, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  avatarLgText: { fontSize: 32, fontWeight: '700', color: colors.textPrimary },
  name: { ...typography.h2, color: colors.textPrimary },
  location: { ...typography.small, color: colors.textSecondary, marginTop: spacing.xs },
  verifiedRow: { marginTop: spacing.sm, backgroundColor: colors.accentLight, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.full },
  verifiedText: { ...typography.captionMedium, color: colors.accentDark },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgSecondary, borderRadius: borderRadius.lg, paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl, marginBottom: spacing.xxl, borderWidth: 1, borderColor: colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { ...typography.h3, color: colors.textPrimary },
  statSub: { ...typography.caption, color: colors.textMuted },
  statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: colors.border },
  section: { marginBottom: spacing.xxl },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  bio: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: borderRadius.full, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border },
  chipText: { ...typography.smallMedium, color: colors.textPrimary },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  linkIcon: { fontSize: 14 },
  link: { ...typography.body, color: colors.accent },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  reviewCount: { ...typography.small, color: colors.textMuted },
  reviewCard: { backgroundColor: colors.bgSecondary, borderRadius: borderRadius.md, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  reviewAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { ...typography.captionMedium, color: colors.textSecondary },
  reviewName: { ...typography.smallMedium, color: colors.textPrimary },
  reviewDate: { ...typography.caption, color: colors.textMuted },
  reviewStars: { flexDirection: 'row', gap: 1 },
  reviewComment: { ...typography.small, color: colors.textSecondary, lineHeight: 20 },
});
