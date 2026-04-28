import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { JobPost } from '../types';
import Badge from './Badge';

interface JobCardProps {
  job: JobPost;
  onPress: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function JobCard({ job, onPress, actionLabel, onAction }: JobCardProps) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.75}>
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={s.title} numberOfLines={2}>{job.title}</Text>
          <Badge status={job.status} />
        </View>
      </View>
      <View style={s.meta}>
        <Text style={s.category}>{job.categoryName}</Text>
        <Text style={s.dot}>·</Text>
        <Text style={s.budget}>PKR {Number(job.budget).toLocaleString()}</Text>
        {job.deadline && (
          <>
            <Text style={s.dot}>·</Text>
            <Text style={s.deadline}>Due {formatDate(job.deadline)}</Text>
          </>
        )}
      </View>
      {job.description ? (
        <Text style={s.desc} numberOfLines={2}>{job.description}</Text>
      ) : null}
      <View style={s.footer}>
        <Text style={s.proposals}>{job.proposalCount} proposal{job.proposalCount !== 1 ? 's' : ''}</Text>
        {actionLabel && onAction && (
          <TouchableOpacity style={s.actionBtn} onPress={onAction} activeOpacity={0.8}>
            <Text style={s.actionText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: { marginBottom: spacing.xs },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  title: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  category: { ...typography.small, color: colors.textSecondary },
  dot: { color: colors.textMuted },
  budget: { ...typography.smallMedium, color: colors.textPrimary },
  deadline: { ...typography.small, color: colors.textMuted },
  desc: { ...typography.small, color: colors.textSecondary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  proposals: { ...typography.caption, color: colors.textMuted },
  actionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  actionText: { ...typography.buttonSmall, color: colors.textInverse },
});
