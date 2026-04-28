import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, Alert, TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { jobApi } from '../../api/jobs';
import { JobPost } from '../../types';
import ScreenHeader from '../../components/ScreenHeader';
import Badge from '../../components/Badge';
import PrimaryButton from '../../components/PrimaryButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import Avatar from '../../components/Avatar';

function formatDate(value?: string | null) {
  if (!value) return 'No deadline';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function JobDetailScreen({ route, navigation }: any) {
  const jobParam: JobPost | undefined = route.params?.job;
  const jobId: number | undefined = route.params?.jobId || jobParam?.id;

  const [job, setJob] = useState<JobPost | undefined>(jobParam);
  const [loading, setLoading] = useState(!jobParam);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (isRefresh = false) => {
    if (!jobId) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      // Use getOpen as we don't have a getById — navigate passes full job object
      // If only jobId available, fall back to listing
      setJob(jobParam);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Could not load job details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!job && jobId) load();
  }, []);

  const handleApply = () => {
    if (!job) return;
    navigation.navigate('SubmitProposal', { job });
  };

  if (loading && !job) return <LoadingSpinner message="Loading job..." />;

  if (!job) {
    return (
      <View style={s.container}>
        <ScreenHeader title="Job Details" onBack={() => navigation.goBack()} />
        <View style={s.center}>
          <Text style={s.errorText}>{error || 'Job not found.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <ScreenHeader
        title="Job Details"
        onBack={() => navigation.goBack()}
        rightComponent={<Badge status={job.status} size="md" />}
      />

      <ScrollView
        contentContainerStyle={s.body}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
      >
        {/* Title + Category */}
        <View style={s.card}>
          <Text style={s.jobTitle}>{job.title}</Text>
          <View style={s.metaRow}>
            <View style={s.catBadge}>
              <Text style={s.catText}>{job.categoryName}</Text>
            </View>
            <Text style={s.dot}>·</Text>
            <Text style={s.proposalCount}>{job.proposalCount} proposal{job.proposalCount !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Details grid */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Job Details</Text>
          <View style={s.grid}>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Budget</Text>
              <Text style={s.gridValue}>PKR {Number(job.budget).toLocaleString()}</Text>
            </View>
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Deadline</Text>
              <Text style={s.gridValue}>{formatDate(job.deadline)}</Text>
            </View>
            {job.location && (
              <View style={s.gridItem}>
                <Text style={s.gridLabel}>Location</Text>
                <Text style={s.gridValue}>📍 {job.location}</Text>
              </View>
            )}
            <View style={s.gridItem}>
              <Text style={s.gridLabel}>Posted By</Text>
              <Text style={s.gridValue}>{job.clientName}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Description</Text>
          <Text style={s.description}>{job.description}</Text>
        </View>

        {/* Client info */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Posted By</Text>
          <View style={s.clientRow}>
            <Avatar name={job.clientName} size={42} />
            <View>
              <Text style={s.clientName}>{job.clientName}</Text>
              <Text style={s.clientLabel}>Client</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        {job.status === 'OPEN' && (
          <PrimaryButton
            title="Submit a Proposal"
            onPress={handleApply}
            style={s.cta}
          />
        )}
        {job.status !== 'OPEN' && (
          <View style={s.closedBanner}>
            <Text style={s.closedText}>This job is no longer accepting proposals.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  body: { padding: spacing.xxl, paddingBottom: 100 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  jobTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  catBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.full },
  catText: { ...typography.caption, color: '#4F46E5', fontWeight: '600' },
  dot: { color: colors.textMuted },
  proposalCount: { ...typography.small, color: colors.textMuted },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '47%', backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md },
  gridLabel: { ...typography.caption, color: colors.textMuted },
  gridValue: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  clientName: { ...typography.bodyMedium, color: colors.textPrimary },
  clientLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  cta: { marginTop: spacing.md },
  closedBanner: {
    backgroundColor: colors.bgInput, borderRadius: borderRadius.md,
    padding: spacing.lg, alignItems: 'center', marginTop: spacing.md,
  },
  closedText: { ...typography.bodyMedium, color: colors.textMuted },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  errorText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
