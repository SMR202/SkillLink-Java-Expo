import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, StatusBar } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost } from '../../types';

export default function JobBoardScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getOpen();
      setJobs(res.content || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.title}>Job Board</Text>
        <Text style={s.subtitle}>Open client requests across SkillLink</Text>
      </View>
      <FlatList
        data={jobs}
        onRefresh={load}
        refreshing={loading}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.row}>
              <Text style={s.jobTitle}>{item.title}</Text>
              <View style={s.badge}><Text style={s.badgeText}>{item.status}</Text></View>
            </View>
            <Text style={s.meta}>{item.categoryName} · PKR {Number(item.budget).toLocaleString()}</Text>
            <Text style={s.desc} numberOfLines={2}>{item.description}</Text>
            <Text style={s.meta}>Posted by {item.clientName} · {item.proposalCount} proposals</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>{loading ? 'Loading jobs...' : 'No open jobs yet.'}</Text>}
      />
      <Pressable style={s.fab} onPress={() => navigation.navigate('PostJob')}>
        <Text style={s.fabText}>+ Post a Job</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 54, paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  list: { padding: spacing.xxl, paddingBottom: 120 },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  jobTitle: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1, fontWeight: '700' },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  desc: { ...typography.small, color: colors.textSecondary, marginTop: spacing.sm },
  badge: { backgroundColor: '#D1FAE5', borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  badgeText: { ...typography.captionMedium, color: colors.success },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.huge },
  fab: { position: 'absolute', right: spacing.xxl, bottom: 86, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, ...shadows.md },
  fabText: { ...typography.buttonSmall, color: '#fff' },
});
