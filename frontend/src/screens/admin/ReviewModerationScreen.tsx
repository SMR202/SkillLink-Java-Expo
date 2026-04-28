import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { adminApi } from '../../api/admin';
import { Review } from '../../types';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Avatar from '../../components/Avatar';

interface ReviewItem {
  id: number;
  bookingId: number;
  clientName: string;
  providerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status?: string;
}

export default function ReviewModerationScreen({ navigation }: any) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await adminApi.getAllReviews();
      setReviews(res.data?.data || []);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Could not load reviews.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = (review: ReviewItem) => {
    Alert.alert(
      'Remove Review',
      `Remove this review by ${review.clientName}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setRemoving(review.id);
            try {
              await adminApi.removeReview(review.id);
              setReviews(prev => prev.filter(r => r.id !== review.id));
            } catch (e: any) {
              Alert.alert('Error', e?.response?.data?.message || 'Could not remove review.');
            } finally {
              setRemoving(null);
            }
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆')).join('');

  const renderItem = ({ item }: { item: ReviewItem }) => (
    <View style={s.card}>
      <View style={s.header}>
        <Avatar name={item.clientName} size={40} />
        <View style={s.info}>
          <Text style={s.clientName}>{item.clientName}</Text>
          <Text style={s.meta}>Review for {item.providerName} · Booking #{item.bookingId}</Text>
        </View>
        <Text style={s.stars}>{renderStars(item.rating)}</Text>
      </View>
      {item.comment ? (
        <Text style={s.comment}>{item.comment}</Text>
      ) : (
        <Text style={s.noComment}>No comment provided.</Text>
      )}
      <View style={s.actions}>
        <Text style={s.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <TouchableOpacity
          style={[s.removeBtn, removing === item.id && s.btnDisabled]}
          onPress={() => handleRemove(item)}
          disabled={removing === item.id}
        >
          <Text style={s.removeText}>{removing === item.id ? 'Removing...' : 'Remove'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <ScreenHeader
        title="Review Moderation"
        subtitle="Manage user-submitted reviews"
      />
      {loading ? (
        <LoadingSpinner message="Loading reviews..." />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyState icon="⭐" title="No reviews yet" subtitle="Reviews from completed bookings appear here." />
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  list: { padding: spacing.xxl, paddingBottom: 100 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  info: { flex: 1 },
  clientName: { ...typography.bodyMedium, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  stars: { color: colors.star, fontSize: 14, letterSpacing: 1 },
  comment: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  noComment: { ...typography.small, color: colors.textMuted, fontStyle: 'italic', marginBottom: spacing.md },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { ...typography.caption, color: colors.textMuted },
  removeBtn: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  btnDisabled: { opacity: 0.5 },
  removeText: { ...typography.buttonSmall, color: '#FFFFFF' },
});
