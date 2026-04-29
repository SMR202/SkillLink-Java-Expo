import React, { useCallback, useState } from 'react';
import {
  View, StyleSheet, FlatList, RefreshControl, TextInput, Text, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost } from '../../types';
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
    setFiltered(jobs.filter((j) =>
      j.title.toLowerCase().includes(q) ||
      j.description?.toLowerCase().includes(q) ||
      j.categoryName?.toLowerCase().includes(q)));
  };

  return (
    <View style={s.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        ListHeaderComponent={
          <View>
            <Text style={s.title}>Find Jobs</Text>
            <View style={s.searchBar}>
              <Text style={s.searchIcon}>⌕</Text>
              <TextInput
                style={s.searchInput}
                value={search}
                onChangeText={handleSearch}
                placeholder="Search for jobs, skills, or clients..."
                placeholderTextColor={colors.outline}
              />
              <Text style={s.filterIcon}>☷</Text>
            </View>
            <View style={s.filterRow}>
              <TouchableOpacity style={s.activeChip}><Text style={s.activeChipText}>All</Text></TouchableOpacity>
              <View style={s.chip}><Text style={s.chipText}>UI/UX Design</Text></View>
              <View style={s.chip}><Text style={s.chipText}>Web Dev</Text></View>
              <View style={s.chip}><Text style={s.chipText}>Branding</Text></View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobDetail', { job: item })}
            actionLabel="Apply"
            onAction={() => navigation.navigate('SubmitProposal', { job: item })}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <LoadingSpinner message="Loading jobs..." />
          ) : error ? (
            <EmptyState icon="!" title="Couldn't load jobs" subtitle={error} />
          ) : search ? (
            <EmptyState icon="⌕" title="No matching jobs" subtitle={`No jobs found for "${search}"`} />
          ) : (
            <EmptyState icon="⌂" title="No open jobs" subtitle="No client requests available right now. Pull to refresh." />
          )
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.space20,
    paddingTop: spacing.space48,
    paddingBottom: spacing.navHeight,
  },
  title: {
    ...typography.h1,
    color: colors.onSurface,
    marginBottom: spacing.space24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space12,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space14,
    marginBottom: spacing.space20,
  },
  searchIcon: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.onSurface,
  },
  filterIcon: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space12,
    marginBottom: spacing.space24,
  },
  activeChip: {
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  activeChipText: {
    ...typography.button,
    color: colors.onPrimary,
  },
  chip: {
    borderRadius: borderRadius.pill,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  chipText: {
    ...typography.button,
    color: colors.onSurface,
  },
});
