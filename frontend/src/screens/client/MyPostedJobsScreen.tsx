import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert, TextInput } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost, Proposal } from '../../types';

export default function MyPostedJobsScreen() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const load = async () => {
    const res = await jobApi.getMine();
    setJobs(res.content || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const openProposals = async (job: JobPost) => {
    setSelectedJob(job);
    try {
      setProposals(await jobApi.getProposals(job.id));
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Could not load proposals.');
    }
  };

  const accept = async (proposal: Proposal) => {
    if (!date || !time) {
      Alert.alert('Date and time required', 'Enter preferred date and time before accepting.');
      return;
    }
    try {
      await jobApi.acceptProposal(proposal.id, { preferredDate: date, preferredTime: time });
      Alert.alert('Success', 'Provider accepted and booking created.');
      setSelectedJob(null);
      load();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Could not accept proposal.');
    }
  };

  if (selectedJob) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <Pressable onPress={() => setSelectedJob(null)}><Text style={s.back}>Back</Text></Pressable>
          <Text style={s.title}>Proposals</Text>
          <Text style={s.subtitle}>{selectedJob.title}</Text>
        </View>
        <View style={s.acceptBox}>
          <TextInput style={s.input} value={date} onChangeText={setDate} placeholder="Preferred date YYYY-MM-DD" placeholderTextColor={colors.textMuted} />
          <TextInput style={s.input} value={time} onChangeText={setTime} placeholder="Preferred time HH:MM" placeholderTextColor={colors.textMuted} />
        </View>
        <FlatList
          data={proposals}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={s.cardTitle}>{item.providerName}</Text>
              <Text style={s.meta}>PKR {Number(item.proposedPrice).toLocaleString()} · {item.estimatedDeliveryTime}</Text>
              <Text style={s.desc}>{item.coverMessage}</Text>
              <Pressable disabled={item.status !== 'PENDING'} style={[s.button, item.status !== 'PENDING' && { opacity: 0.5 }]} onPress={() => accept(item)}>
                <Text style={s.buttonText}>{item.status === 'PENDING' ? 'Accept Provider' : item.status}</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={s.empty}>No proposals yet.</Text>}
        />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>My Jobs</Text>
        <Text style={s.subtitle}>Review provider proposals</Text>
      </View>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <Pressable style={s.card} onPress={() => openProposals(item)}>
            <View style={s.row}>
              <Text style={s.cardTitle}>{item.title}</Text>
              <View style={s.badge}><Text style={s.badgeText}>{item.status}</Text></View>
            </View>
            <Text style={s.meta}>{item.proposalCount} proposals · PKR {Number(item.budget).toLocaleString()}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={s.empty}>You have not posted any jobs yet.</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 54, paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { ...typography.button, color: colors.textSecondary, marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  list: { padding: spacing.xxl, paddingBottom: 100 },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  cardTitle: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '700', flex: 1 },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  desc: { ...typography.small, color: colors.textSecondary, marginTop: spacing.sm },
  badge: { backgroundColor: colors.bgInput, borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  badgeText: { ...typography.captionMedium, color: colors.textSecondary },
  acceptBox: { padding: spacing.xxl, gap: spacing.sm, backgroundColor: colors.bgPrimary },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, color: colors.textPrimary },
  button: { marginTop: spacing.md, backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center' },
  buttonText: { ...typography.buttonSmall, color: '#fff' },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.huge },
});
