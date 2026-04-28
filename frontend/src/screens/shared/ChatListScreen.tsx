import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';
import { messageApi } from '../../api/messages';
import { Conversation } from '../../types';

const statusTone: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: '#FEF3C7', color: colors.pending, label: 'Pending' },
  ACCEPTED: { bg: colors.accentLight, color: colors.accepted, label: 'Accepted' },
  DECLINED: { bg: '#FEE2E2', color: colors.declined, label: 'Declined' },
  PAID: { bg: '#EEF2FF', color: '#4F46E5', label: 'Paid' },
  COMPLETED: { bg: colors.bgInput, color: colors.textSecondary, label: 'Completed' },
  CANCELLED: { bg: colors.bgInput, color: colors.textSecondary, label: 'Cancelled' },
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ChatListScreen() {
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await messageApi.getConversations();
      setConversations(res.data?.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Could not load your conversations.');
      setConversations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const renderItem = ({ item }: { item: Conversation }) => {
    const tone = statusTone[item.bookingStatus] || statusTone.PENDING;
    const preview = item.lastMessage || 'No messages yet. Open the booking chat to start.';

    return (
      <Pressable
        style={s.card}
        onPress={() =>
          navigation.navigate('Chat', {
            bookingId: item.bookingId,
            otherUserName: item.otherUserName,
          })
        }
      >
        <View style={s.avatar}>
          <Text style={s.avatarText}>{item.otherUserName?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <View style={s.content}>
          <View style={s.topLine}>
            <Text style={s.name} numberOfLines={1}>{item.otherUserName}</Text>
            <Text style={s.time}>{formatTime(item.lastMessageAt)}</Text>
          </View>
          <Text style={[s.preview, item.unreadCount > 0 && s.previewUnread]} numberOfLines={2}>
            {preview}
          </Text>
          <View style={s.metaRow}>
            <View style={[s.badge, { backgroundColor: tone.bg }]}>
              <Text style={[s.badgeText, { color: tone.color }]}>{tone.label}</Text>
            </View>
            <Text style={s.bookingText} numberOfLines={1}>
              Booking #{item.bookingId} - {item.preferredDate} at {item.preferredTime}
            </Text>
          </View>
        </View>
        {item.unreadCount > 0 && (
          <View style={s.unread}>
            <Text style={s.unreadText}>{item.unreadCount > 9 ? '9+' : item.unreadCount}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.title}>Messages</Text>
        <Text style={s.subtitle}>Booking conversations in one place</Text>
      </View>
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={colors.primary} />
          <Text style={s.centerText}>Loading conversations...</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.bookingId.toString()}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          ListEmptyComponent={
            <View style={s.center}>
              <Text style={s.emptyTitle}>{error ? 'Something went wrong' : 'No conversations yet'}</Text>
              <Text style={s.centerText}>{error || 'Chats appear here once you have a booking.'}</Text>
            </View>
          }
        />
      )}
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
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  list: { padding: spacing.xxl, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { ...typography.bodyMedium, color: colors.textInverse, fontWeight: '700' },
  content: { flex: 1, minWidth: 0 },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  time: { ...typography.caption, color: colors.textMuted },
  preview: { ...typography.small, color: colors.textSecondary, marginTop: spacing.xs },
  previewUnread: { color: colors.textPrimary, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full },
  badgeText: { ...typography.captionMedium },
  bookingText: { ...typography.caption, color: colors.textMuted, flex: 1 },
  unread: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { ...typography.captionMedium, color: colors.textInverse, fontWeight: '700' },
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, marginTop: spacing.huge },
  centerText: { ...typography.small, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary },
});
