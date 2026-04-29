import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  RefreshControl, Alert, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost, Proposal } from '../../types';
import ProposalCard from '../../components/ProposalCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import InputField from '../../components/InputField';

export default function JobProposalsScreen({ route, navigation }: any) {
  const job: JobPost = route.params?.job;
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<number | null>(null);

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
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>←</Text></TouchableOpacity>
          <Text style={s.title}>Proposals</Text>
        </View>
        <EmptyState icon="×" title="Job not found" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>←</Text></TouchableOpacity>
        <View style={s.headerText}>
          <Text style={s.title}>Proposals</Text>
          <Text style={s.subtitle}>{job.title}</Text>
        </View>
      </View>

      <View style={s.scheduleCard}>
        <Text style={s.scheduleTitle}>Schedule the booking</Text>
        <Text style={s.scheduleBody}>Set your preferred date and time before accepting a proposal.</Text>
        <View style={s.scheduleRow}>
          <InputField
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            placeholder="2026-05-15"
            error={dateErr}
            containerStyle={s.half}
          />
          <InputField
            label="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
            placeholder="14:00"
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
              ? <EmptyState icon="!" title="Couldn't load proposals" subtitle={error} />
              : <EmptyState icon="⌂" title="No proposals yet" subtitle="Providers haven't applied to this job yet." />
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space16,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space48,
    paddingBottom: spacing.space16,
    borderBottomWidth: spacing.xxs,
    borderBottomColor: colors.surfaceVariant,
  },
  back: {
    ...typography.h3,
    color: colors.onSurface,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space4,
  },
  scheduleCard: {
    backgroundColor: colors.surfaceContainerLowest,
    margin: spacing.space20,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    borderRadius: spacing.space16,
    padding: spacing.space24,
  },
  scheduleTitle: {
    ...typography.h4,
    color: colors.onSurface,
  },
  scheduleBody: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
    marginBottom: spacing.space16,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: spacing.space12,
  },
  half: {
    flex: 1,
  },
  list: {
    paddingHorizontal: spacing.space20,
    paddingBottom: spacing.navHeight,
  },
});
