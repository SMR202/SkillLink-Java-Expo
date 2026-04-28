import React, { useEffect, useState } from 'react';
import {
  View, FlatList, StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost } from '../../types';
import ScreenHeader from '../../components/ScreenHeader';
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
    React.useCallback(() => { load(); }, [])
  );

  return (
    <View style={s.container}>
      <ScreenHeader
        title="My Jobs"
        subtitle="Review provider proposals"
        rightComponent={null}
      />
      {loading ? (
        <LoadingSpinner message="Loading your jobs..." />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => navigation.navigate('JobProposals', { job: item })}
              actionLabel={item.proposalCount > 0 ? `${item.proposalCount} Proposals` : undefined}
              onAction={item.proposalCount > 0 ? () => navigation.navigate('JobProposals', { job: item }) : undefined}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="📋"
              title="No jobs posted yet"
              subtitle="Post a job to start receiving proposals from providers."
            />
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  list: { padding: spacing.xxl, paddingBottom: 100 },
});
