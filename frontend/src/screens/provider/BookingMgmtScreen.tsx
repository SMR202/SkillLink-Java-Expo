import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, StatusBar, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { bookingApi } from '../../api/bookings';
import { Booking } from '../../types';
import GradientButton from '../../components/GradientButton';

const tabs = ['ALL', 'PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED'];
const statusConfig: Record<string, { color: string; bg: string; icon: string }> = {
  PENDING: { color: colors.pending, bg: '#FEF3C7', icon: '⏳' },
  ACCEPTED: { color: colors.accepted, bg: colors.accentLight, icon: '✓' },
  DECLINED: { color: colors.declined, bg: '#FEE2E2', icon: '✕' },
  COMPLETED: { color: colors.textSecondary, bg: colors.bgInput, icon: '✓' },
};

export default function BookingMgmtScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('ALL');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [declineModal, setDeclineModal] = useState<number | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => { load(); }, [activeTab]);
  const load = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'ALL' ? undefined : activeTab;
      const r = await bookingApi.getProviderBookings(status);
      setBookings(r.content || []);
    } catch {} setLoading(false);
  };

  const handleAccept = async (id: number) => {
    try { await bookingApi.accept(id); load(); Alert.alert('Success', 'Booking accepted! The client has been notified.'); }
    catch (e: any) { Alert.alert('Error', e.response?.data?.message || 'Failed'); }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) { Alert.alert('Error', 'Please provide a reason for declining.'); return; }
    try { await bookingApi.decline(declineModal!, declineReason); setDeclineModal(null); setDeclineReason(''); load(); Alert.alert('Booking Declined', 'The client has been notified with your reason.'); }
    catch (e: any) { Alert.alert('Error', e.response?.data?.message || 'Failed'); }
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const cfg = statusConfig[item.status] || statusConfig.PENDING;
    return (
      <View style={s.card}>
        <View style={s.cardTop}>
          <View style={s.av}><Text style={s.avT}>{item.clientName?.[0]?.toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.clientName}>{item.clientName}</Text>
            <Text style={s.date}>📅 {item.preferredDate} · 🕐 {item.preferredTime}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[s.badgeText, { color: cfg.color }]}>{cfg.icon} {item.status}</Text>
          </View>
        </View>
        <Text style={s.descLabel}>Job Description</Text>
        <Text style={s.desc}>{item.jobDescription}</Text>
        {item.status === 'PENDING' && (
          <View style={s.actions}>
            <TouchableOpacity style={s.acceptBtn} onPress={() => handleAccept(item.id)}>
              <Text style={s.acceptText}>✓ Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.declineBtn} onPress={() => setDeclineModal(item.id)}>
              <Text style={s.declineText}>✕ Decline</Text>
            </TouchableOpacity>
          </View>
        )}
        {(item.status === 'PENDING' || item.status === 'ACCEPTED') && (
          <Pressable style={{ paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: borderRadius.md, backgroundColor: colors.bgInput, alignSelf: 'flex-start', marginTop: spacing.sm }} onPress={() => navigation.navigate('Chat', { bookingId: item.id, otherUserName: item.clientName })}>
            <Text style={{ ...typography.caption, fontWeight: '600', color: colors.textPrimary }}>💬 Chat with Client</Text>
          </Pressable>
        )}
        {item.declineReason && (
          <View style={s.reasonBox}>
            <Text style={s.reasonLabel}>Decline reason:</Text>
            <Text style={s.reasonText}>{item.declineReason}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.title}>Booking Management</Text>
        <Text style={s.subtitle}>Manage incoming service requests</Text>
      </View>

      <View style={s.tabRow}>
        {tabs.map(t => (
          <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabActive]} onPress={() => setActiveTab(t)}>
            <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList data={bookings} renderItem={renderItem} keyExtractor={i => i.id.toString()}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <View style={s.empty}><Text style={{ fontSize: 40 }}>{loading ? '⏳' : '📋'}</Text>
            <Text style={s.emptyText}>{loading ? 'Loading...' : 'No bookings in this category'}</Text>
          </View>
        } />

      {/* Decline Modal */}
      <Modal visible={declineModal !== null} transparent animationType="fade">
        <View style={s.modalOv}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Decline Booking</Text>
            <Text style={s.modalDesc}>Please provide a reason for declining. The client will be notified with this message.</Text>
            <Text style={s.modalLabel}>Reason for declining</Text>
            <TextInput style={s.modalInput} placeholder="e.g. Fully booked on that date..."
              placeholderTextColor={colors.textMuted} value={declineReason}
              onChangeText={setDeclineReason} multiline />
            <View style={s.modalBtns}>
              <TouchableOpacity onPress={() => { setDeclineModal(null); setDeclineReason(''); }} style={s.cancelBtn}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <GradientButton onPress={handleDecline} title="Send & Decline" variant="accent" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 50, paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  tabRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.xs, backgroundColor: colors.bgPrimary },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.bgInput },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.captionMedium, color: colors.textMuted },
  tabTextActive: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: 100 },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  av: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.bgInput, justifyContent: 'center', alignItems: 'center' },
  avT: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '600' },
  clientName: { ...typography.bodyMedium, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.full },
  badgeText: { ...typography.captionMedium },
  descLabel: { ...typography.captionMedium, color: colors.textMuted, marginBottom: 4 },
  desc: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.md },
  acceptBtn: { flex: 1, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: colors.accentLight, borderWidth: 1, borderColor: colors.accent + '40' },
  acceptText: { ...typography.buttonSmall, color: colors.accent },
  declineBtn: { flex: 1, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: colors.error + '40' },
  declineText: { ...typography.buttonSmall, color: colors.error },
  reasonBox: { backgroundColor: '#FEF2F2', padding: spacing.md, borderRadius: borderRadius.sm, marginTop: spacing.sm },
  reasonLabel: { ...typography.captionMedium, color: colors.error, marginBottom: 2 },
  reasonText: { ...typography.small, color: colors.textSecondary },
  empty: { alignItems: 'center', marginTop: spacing.huge },
  emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.lg },
  modalOv: { flex: 1, justifyContent: 'center', backgroundColor: colors.overlay, paddingHorizontal: spacing.xxl },
  modal: { backgroundColor: colors.bgCard, borderRadius: borderRadius.xl, padding: spacing.xxl },
  modalTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  modalDesc: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.xl },
  modalLabel: { ...typography.smallMedium, color: colors.textSecondary, marginBottom: spacing.xs },
  modalInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.lg, color: colors.textPrimary, ...typography.body, borderWidth: 1, borderColor: colors.border, minHeight: 80, textAlignVertical: 'top', marginBottom: spacing.xl },
  modalBtns: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  cancelBtn: { paddingVertical: 14, paddingHorizontal: spacing.xl },
  cancelText: { ...typography.button, color: colors.textSecondary },
});
