import React, { useCallback, useState } from 'react';
import {
  View, StyleSheet, FlatList, RefreshControl, TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost } from '../../types';
import ScreenHeader from '../../components/ScreenHeader';
import JobCard from '../../components/JobCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ProviderJobBoardScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [filtered, setFiltered] = useState<JobPost[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await jobApi.getOpen();
      const data = res.content || [];
      setJobs(data);
      setFiltered(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Could not load jobs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) { setFiltered(jobs); return; }
    const q = text.toLowerCase();
    setFiltered(jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.description?.toLowerCase().includes(q) ||
      j.categoryName?.toLowerCase().includes(q)
    ));
  };

  return (
    <View style={s.container}>
      <ScreenHeader title="Job Board" subtitle="Find open client requests" />
      <View style={s.searchBar}>
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={handleSearch}
          placeholder="Search jobs..."
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {loading ? (
        <LoadingSpinner message="Loading jobs..." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => navigation.navigate('JobDetail', { job: item })}
              actionLabel="Apply"
              onAction={() => navigation.navigate('SubmitProposal', { job: item })}
            />
          )}
          ListEmptyComponent={
            error
              ? <EmptyState icon="⚠️" title="Couldn't load jobs" subtitle={error} />
              : search
                ? <EmptyState icon="🔍" title="No matching jobs" subtitle={`No jobs found for "${search}"`} />
                : <EmptyState icon="📋" title="No open jobs" subtitle="No client requests available right now. Pull to refresh." />
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  searchBar: {
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.bgInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  list: { padding: spacing.xxl, paddingBottom: 100 },
});
