import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';
import { JobPost } from '../types';
import Badge from './Badge';
import OutlineButton from './OutlineButton';

interface JobCardProps {
  job: JobPost;
  onPress: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function JobCard({ job, onPress, actionLabel, onAction }: JobCardProps) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.94}>
      <View style={s.header}>
        <View style={s.titleBlock}>
          <Text style={s.title} numberOfLines={2}>{job.title}</Text>
          <Text style={s.meta}>
            {job.categoryName} • PKR {Number(job.budget).toLocaleString()}
            {job.deadline ? ` • Due ${formatDate(job.deadline)}` : ''}
          </Text>
        </View>
        <Badge status={job.status} />
      </View>
      {job.description ? <Text style={s.description} numberOfLines={2}>{job.description}</Text> : null}
      <View style={s.footer}>
        <Text style={s.proposals}>{job.proposalCount} proposal{job.proposalCount !== 1 ? 's' : ''}</Text>
        {actionLabel && onAction ? <OutlineButton title={actionLabel} onPress={onAction} style={s.actionButton} /> : null}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    marginBottom: spacing.space16,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.space12,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    ...typography.h4,
    color: colors.onSurface,
  },
  meta: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: spacing.space8,
  },
  description: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space16,
  },
  footer: {
    marginTop: spacing.space16,
    gap: spacing.space12,
  },
  proposals: {
    ...typography.caption,
    color: colors.outline,
  },
  actionButton: {
    width: '100%',
  },
});
