import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost } from '../../types';

export default function ProviderJobBoardScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getOpen();
      setJobs(res.content || []);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Could not load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Job Board</Text>
        <Text style={s.subtitle}>Find open client requests</Text>
      </View>
      <FlatList
        data={jobs}
        refreshing={loading}
        onRefresh={load}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.meta}>{item.categoryName} · PKR {Number(item.budget).toLocaleString()}</Text>
            <Text style={s.desc} numberOfLines={3}>{item.description}</Text>
            <Pressable style={s.button} onPress={() => navigation.navigate('SubmitProposal', { job: item })}>
              <Text style={s.buttonText}>Apply</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>{loading ? 'Loading jobs...' : 'No open jobs right now.'}</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 54, paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  list: { padding: spacing.xxl, paddingBottom: 100 },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  cardTitle: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '700' },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  desc: { ...typography.small, color: colors.textSecondary, marginTop: spacing.sm },
  button: { marginTop: spacing.md, backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center' },
  buttonText: { ...typography.buttonSmall, color: '#fff' },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.huge },
});
