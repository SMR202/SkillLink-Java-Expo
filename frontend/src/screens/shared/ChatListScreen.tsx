import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';
import { messageApi } from '../../api/messages';
import { Conversation } from '../../types';
import Avatar from '../../components/Avatar';

const statusTone: Record<string, { label: string }> = {
  PENDING: { label: 'Pending' },
  ACCEPTED: { label: 'Accepted' },
  DECLINED: { label: 'Declined' },
  PAID: { label: 'Paid' },
  COMPLETED: { label: 'Completed' },
  CANCELLED: { label: 'Cancelled' },
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
    }, []),
  );

  const renderItem = ({ item }: { item: Conversation }) => {
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
        <Avatar name={item.otherUserName} uri={item.otherUserAvatarUrl} size={spacing.space64} />
        <View style={s.content}>
          <View style={s.topLine}>
            <Text style={s.name} numberOfLines={1}>{item.otherUserName}</Text>
            <Text style={s.time}>{formatTime(item.lastMessageAt)}</Text>
          </View>
          <Text style={s.meta}>{statusTone[item.bookingStatus]?.label || 'Conversation'} • Booking #{item.bookingId}</Text>
          <Text style={[s.preview, item.unreadCount > 0 && s.previewUnread]} numberOfLines={2}>
            {preview}
          </Text>
        </View>
        {item.unreadCount > 0 ? (
          <View style={s.unread}>
            <Text style={s.unreadText}>{item.unreadCount > 9 ? '9+' : item.unreadCount}</Text>
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />
      <View style={s.topBar}>
        <View style={s.topAvatar} />
        <Text style={s.brand}>SkillLink</Text>
        <View style={s.notificationDot} />
      </View>

      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.bookingId.toString()}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        ListHeaderComponent={
          <View>
            <Text style={s.title}>Messages</Text>
            <Text style={s.subtitle}>Stay connected with your service providers and clients.</Text>
            <View style={s.searchBar}>
              <Text style={s.searchIcon}>⌕</Text>
              <TextInput style={s.searchInput} placeholder="Search conversations..." placeholderTextColor={colors.outline} />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={s.center}>
            {loading ? <ActivityIndicator color={colors.primaryContainer} /> : null}
            <Text style={s.emptyTitle}>{error ? 'Something went wrong' : loading ? 'Loading...' : 'No conversations yet'}</Text>
            <Text style={s.centerText}>{error || 'Chats appear here once you have a booking.'}</Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space48,
    paddingBottom: spacing.space20,
    borderBottomWidth: spacing.xxs,
    borderBottomColor: colors.surfaceVariant,
  },
  topAvatar: {
    width: spacing.space40,
    height: spacing.space40,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
  },
  brand: {
    ...typography.h4,
    color: colors.primaryContainer,
  },
  notificationDot: {
    width: spacing.space16,
    height: spacing.space16,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primaryContainer,
  },
  list: {
    padding: spacing.space24,
    paddingBottom: spacing.navHeight,
  },
  title: { ...typography.h1, color: colors.onSurface },
  subtitle: { ...typography.bodyLg, color: colors.onSurfaceVariant, marginTop: spacing.space12, marginBottom: spacing.space24 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space12,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space14,
    marginBottom: spacing.space24,
  },
  searchIcon: { ...typography.body, color: colors.onSurfaceVariant },
  searchInput: { flex: 1, ...typography.bodyLg, color: colors.onSurface },
  card: {
    flexDirection: 'row',
    gap: spacing.space16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space20,
    marginBottom: spacing.space16,
    alignItems: 'center',
    ...shadows.sm,
  },
  content: { flex: 1, minWidth: 0 },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.space8 },
  name: { ...typography.h4, color: colors.onSurface, flex: 1 },
  time: { ...typography.body, color: colors.primary },
  meta: { ...typography.caption, color: colors.onSurfaceVariant, marginTop: spacing.space4 },
  preview: { ...typography.bodyLg, color: colors.onSurfaceVariant, marginTop: spacing.space8 },
  previewUnread: { color: colors.onSurface, fontWeight: '600' },
  unread: {
    minWidth: spacing.space32,
    height: spacing.space32,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.space8,
  },
  unreadText: { ...typography.captionMedium, color: colors.onPrimary },
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing.space24, marginTop: spacing.space48 },
  emptyTitle: { ...typography.h4, color: colors.onSurface, marginTop: spacing.space12 },
  centerText: { ...typography.body, color: colors.onSurfaceVariant, marginTop: spacing.space8, textAlign: 'center' },
});
