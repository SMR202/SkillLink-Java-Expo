import React, { useState } from 'react';
import {
  View, FlatList, StyleSheet, RefreshControl, Text, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost } from '../../types';
import JobCard from '../../components/JobCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function MyPostedJobsScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await jobApi.getMine();
      setJobs(res.content || []);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => { load(); }, []),
  );

  return (
    <View style={s.container}>
      <View style={s.topBar}>
        <View style={s.topAvatar} />
        <Text style={s.brand}>SkillLink</Text>
        <View style={s.notificationDot} />
      </View>

      {loading ? (
        <LoadingSpinner message="Loading your jobs..." />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          ListHeaderComponent={
            <View>
              <Text style={s.title}>My Jobs</Text>
              <Text style={s.subtitle}>Manage your active service requests, review incoming proposals, and finalize bookings.</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PostJob')} style={s.cta} activeOpacity={0.9}>
                <Text style={s.ctaText}>+ Post New Job</Text>
              </TouchableOpacity>
              <View style={s.tabRow}>
                <View style={s.activePill}><Text style={s.activePillText}>All Jobs</Text></View>
                <View style={s.pill}><Text style={s.pillText}>Open ({jobs.filter((job) => job.status === 'OPEN').length})</Text></View>
                <View style={s.pill}><Text style={s.pillText}>Filled</Text></View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => navigation.navigate('JobProposals', { job: item })}
              actionLabel={item.proposalCount > 0 ? `${item.proposalCount} Proposals` : 'View Details'}
              onAction={() => navigation.navigate('JobProposals', { job: item })}
            />
          )}
          ListEmptyComponent={(
            <EmptyState
              icon="⌂"
              title="No jobs posted yet"
              subtitle="Post a job to start receiving proposals from providers."
            />
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    width: spacing.space32,
    height: spacing.space32,
    borderRadius: spacing.space16,
    backgroundColor: colors.surfaceContainer,
  },
  brand: {
    ...typography.h4,
    color: colors.primaryContainer,
  },
  notificationDot: {
    width: spacing.space16,
    height: spacing.space16,
    borderRadius: spacing.space8,
    backgroundColor: colors.notification,
  },
  list: {
    padding: spacing.space20,
    paddingBottom: spacing.navHeight,
  },
  title: {
    ...typography.h2,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space12,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryContainer,
    borderRadius: spacing.space12,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
    marginTop: spacing.space20,
    marginBottom: spacing.space24,
  },
  ctaText: {
    ...typography.button,
    color: colors.onPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.space8,
    marginBottom: spacing.space24,
  },
  activePill: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: spacing.space16,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  activePillText: {
    ...typography.captionMedium,
    color: colors.onSurface,
  },
  pill: {
    borderRadius: spacing.space16,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
    backgroundColor: colors.transparent,
  },
  pillText: {
    ...typography.captionMedium,
    color: colors.onSurfaceVariant,
  },
});
