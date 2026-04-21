import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { messageApi } from '../../api/messages';
import { ChatMessage } from '../../types';
import { useAuthStore } from '../../store/authStore';

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
      if (res.data?.data) setMessages(prev => [...prev, res.data.data]);
    } catch {}
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === user?.id;
    return (
      <View style={[ms.bubble, isMe ? ms.bubbleRight : ms.bubbleLeft]}>
        {!isMe && <Text style={ms.senderName}>{item.senderName}</Text>}
        <Text style={[ms.msgText, isMe && { color: '#FFF' }]}>{item.content}</Text>
        <Text style={[ms.time, isMe && { color: 'rgba(255,255,255,0.7)' }]}>
          {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={ms.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <View style={ms.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={ms.back}>← Back</Text></Pressable>
        <Text style={ms.title}>{otherUserName || 'Chat'}</Text>
        <Text style={ms.subtitle}>Booking #{bookingId}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={ms.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={ms.empty}>
            <Text style={{ fontSize: 32 }}>💬</Text>
            <Text style={ms.emptyText}>{loading ? 'Loading...' : 'No messages yet'}</Text>
            <Text style={ms.emptyDesc}>Start the conversation</Text>
          </View>
        }
      />
      <View style={ms.inputBar}>
        <TextInput
          style={ms.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          maxLength={2000}
          onSubmitEditing={handleSend}
        />
        <Pressable onPress={handleSend} style={[ms.sendBtn, !input.trim() && { opacity: 0.3 }]}>
          <Text style={ms.sendText}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const ms = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 54, paddingHorizontal: spacing.xxl, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { ...typography.small, color: colors.accent, marginBottom: spacing.xs },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textMuted },
  chatList: { padding: spacing.lg, paddingBottom: 8 },
  bubble: { maxWidth: '78%', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  bubbleLeft: { alignSelf: 'flex-start', backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  bubbleRight: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  senderName: { ...typography.caption, color: colors.accent, fontWeight: '600', marginBottom: 2 },
  msgText: { ...typography.body, color: colors.textPrimary },
  time: { ...typography.caption, color: colors.textMuted, marginTop: 4, textAlign: 'right', fontSize: 10 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptyDesc: { ...typography.small, color: colors.textMuted },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingHorizontal: spacing.lg, backgroundColor: colors.bgPrimary, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  input: { flex: 1, backgroundColor: colors.bgInput, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...typography.body, color: colors.textPrimary },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' },
  sendText: { fontSize: 20, color: '#FFF' },
});
