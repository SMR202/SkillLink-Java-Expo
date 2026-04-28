import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, StyleSheet,
  RefreshControl, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost, Proposal } from '../../types';
import ScreenHeader from '../../components/ScreenHeader';
import ProposalCard from '../../components/ProposalCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

export default function JobProposalsScreen({ route, navigation }: any) {
  const job: JobPost = route.params?.job;
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<number | null>(null);

  // Accept proposal modal fields
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dateErr, setDateErr] = useState('');
  const [timeErr, setTimeErr] = useState('');

  const load = async (isRefresh = false) => {
    if (!job) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await jobApi.getProposals(job.id);
      setProposals(data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Could not load proposals.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAccept = async (proposal: Proposal) => {
    let valid = true;
    if (!date.trim()) { setDateErr('Date is required (YYYY-MM-DD)'); valid = false; } else setDateErr('');
    if (!time.trim()) { setTimeErr('Time is required (HH:MM)'); valid = false; } else setTimeErr('');
    if (!valid) return;

    setAccepting(proposal.id);
    try {
      await jobApi.acceptProposal(proposal.id, {
        preferredDate: date.trim(),
        preferredTime: time.trim(),
      });
      Alert.alert('Success! 🎉', `You accepted ${proposal.providerName}'s proposal. A booking has been created.`, [
        { text: 'View Bookings', onPress: () => navigation.navigate('Bookings') },
        { text: 'Stay', style: 'cancel' },
      ]);
      setAcceptingId(null);
      load();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Could not accept proposal.');
    } finally {
      setAccepting(null);
    }
  };

  if (!job) {
    return (
      <View style={s.container}>
        <ScreenHeader title="Proposals" onBack={() => navigation.goBack()} />
        <EmptyState icon="❌" title="Job not found" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader
        title="Proposals"
        subtitle={job.title}
        onBack={() => navigation.goBack()}
      />

      {/* Accept booking date/time input */}
      <View style={s.bookingBox}>
        <Text style={s.boxTitle}>Schedule the Booking</Text>
        <Text style={s.boxSubtitle}>Set preferred date and time before accepting a proposal.</Text>
        <View style={s.row}>
          <InputField
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            placeholder="2026-05-15"
            placeholderTextColor={colors.textMuted}
            error={dateErr}
            containerStyle={s.half}
          />
          <InputField
            label="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
            placeholder="14:00"
            placeholderTextColor={colors.textMuted}
            error={timeErr}
            containerStyle={s.half}
          />
        </View>
      </View>

      {loading ? (
        <LoadingSpinner message="Loading proposals..." />
      ) : (
        <FlatList
          data={proposals}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          renderItem={({ item }) => (
            <ProposalCard
              proposal={item}
              onAccept={() => handleAccept(item)}
              accepting={accepting === item.id}
            />
          )}
          ListEmptyComponent={
            error
              ? <EmptyState icon="⚠️" title="Couldn't load proposals" subtitle={error} />
              : <EmptyState icon="📬" title="No proposals yet" subtitle="Providers haven't applied to this job yet." />
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  bookingBox: {
    backgroundColor: colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.xxl,
    paddingBottom: spacing.md,
  },
  boxTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.xs },
  boxSubtitle: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  list: { padding: spacing.xxl, paddingBottom: 100 },
});
