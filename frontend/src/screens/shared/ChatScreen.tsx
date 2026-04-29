import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { messageApi } from '../../api/messages';
import { ChatMessage } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../../components/Avatar';

export default function ChatScreen({ route, navigation }: any) {
  const { bookingId, otherUserName } = route.params || {};
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = async () => {
    try {
      const res = await messageApi.getChat(bookingId);
      setMessages(res.data?.data || []);
      messageApi.markRead(bookingId).catch(() => {});
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadMessages(); const interval = setInterval(loadMessages, 5000); return () => clearInterval(interval); }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    try {
      const res = await messageApi.send(bookingId, text);
      if (res.data?.data) setMessages((prev) => [...prev, res.data.data]);
    } catch {}
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === user?.id;
    return (
      <View style={s.messageWrap}>
        <View style={[s.bubble, isMe ? s.bubbleRight : s.bubbleLeft]}>
          {!isMe ? <Text style={s.senderName}>{item.senderName}</Text> : null}
          <Text style={[s.msgText, isMe && s.msgTextRight]}>{item.content}</Text>
        </View>
        <Text style={[s.time, isMe && s.timeRight]}>
          {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>←</Text></Pressable>
        <Avatar name={otherUserName} size={spacing.space64} />
        <View style={s.headerText}>
          <Text style={s.title}>{otherUserName || 'Chat'}</Text>
          <Text style={s.subtitle}>Online now</Text>
        </View>
        <Text style={s.headerAction}>⋮</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={s.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListHeaderComponent={<Text style={s.dayChip}>Today</Text>}
        ListEmptyComponent={(
          <View style={s.empty}>
            <Text style={s.emptyText}>{loading ? 'Loading...' : 'No messages yet'}</Text>
            <Text style={s.emptyDesc}>Start the conversation.</Text>
          </View>
        )}
      />
      <View style={s.inputBar}>
        <Text style={s.attachIcon}>⌇</Text>
        <TextInput
          style={s.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.outline}
          value={input}
          onChangeText={setInput}
          maxLength={2000}
          onSubmitEditing={handleSend}
        />
        <Pressable onPress={handleSend} style={[s.sendBtn, !input.trim() && s.sendDisabled]}>
          <Text style={s.sendText}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space12,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space20,
    paddingTop: spacing.space48,
    paddingBottom: spacing.space16,
    borderBottomWidth: spacing.xxs,
    borderBottomColor: colors.surfaceVariant,
  },
  back: { ...typography.h3, color: colors.onSurface },
  headerText: { flex: 1 },
  title: { ...typography.h3, color: colors.onSurface },
  subtitle: { ...typography.body, color: colors.success, marginTop: spacing.space4 },
  headerAction: { ...typography.h3, color: colors.onSurface },
  chatList: { padding: spacing.space20, paddingBottom: spacing.space12 },
  dayChip: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    alignSelf: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space8,
    marginBottom: spacing.space20,
  },
  messageWrap: { marginBottom: spacing.space16 },
  bubble: { maxWidth: '82%', paddingHorizontal: spacing.space20, paddingVertical: spacing.space16, borderRadius: borderRadius.card, ...shadows.sm },
  bubbleLeft: { alignSelf: 'flex-start', backgroundColor: colors.surfaceContainer },
  bubbleRight: { alignSelf: 'flex-end', backgroundColor: colors.primaryContainer },
  senderName: { ...typography.captionMedium, color: colors.primary, marginBottom: spacing.space4 },
  msgText: { ...typography.bodyLg, color: colors.onSurface },
  msgTextRight: { color: colors.onPrimary },
  time: { ...typography.body, color: colors.onSurfaceVariant, marginTop: spacing.space8 },
  timeRight: { textAlign: 'right' },
  empty: { alignItems: 'center', marginTop: spacing.space48 },
  emptyText: { ...typography.h4, color: colors.onSurface },
  emptyDesc: { ...typography.body, color: colors.onSurfaceVariant, marginTop: spacing.space8 },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.space12, padding: spacing.space16, backgroundColor: colors.surfaceContainerLowest, borderTopWidth: spacing.xxs, borderTopColor: colors.surfaceVariant },
  attachIcon: { ...typography.h4, color: colors.onSurfaceVariant },
  input: { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: borderRadius.pill, paddingHorizontal: spacing.space20, paddingVertical: spacing.space16, ...typography.bodyLg, color: colors.onSurface },
  sendBtn: { width: spacing.space64, height: spacing.space64, borderRadius: borderRadius.pill, backgroundColor: colors.primaryContainer, justifyContent: 'center', alignItems: 'center', ...shadows.lg },
  sendDisabled: { opacity: 0.35 },
  sendText: { ...typography.h4, color: colors.onPrimary },
});
