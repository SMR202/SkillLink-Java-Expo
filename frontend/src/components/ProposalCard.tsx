import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';
import { Proposal } from '../types';
import Avatar from './Avatar';
import Badge from './Badge';
import PrimaryButton from './PrimaryButton';

interface ProposalCardProps {
  proposal: Proposal;
  onAccept?: () => void;
  accepting?: boolean;
}

export default function ProposalCard({ proposal, onAccept, accepting }: ProposalCardProps) {
  return (
    <View style={s.card}>
      <View style={s.header}>
        <Avatar name={proposal.providerName} uri={proposal.providerAvatarUrl} size={spacing.space48} />
        <View style={s.info}>
          <Text style={s.name}>{proposal.providerName}</Text>
          <View style={s.ratingRow}>
            <Text style={s.star}>★</Text>
            <Text style={s.rating}>{proposal.providerRating?.toFixed(1) || 'N/A'}</Text>
          </View>
        </View>
        <Badge status={proposal.status} />
      </View>

      <View style={s.metrics}>
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Proposed Price</Text>
          <Text style={s.metricValue}>PKR {Number(proposal.proposedPrice).toLocaleString()}</Text>
        </View>
        <View style={s.metricCard}>
          <Text style={s.metricLabel}>Delivery Time</Text>
          <Text style={s.metricValue}>{proposal.estimatedDeliveryTime}</Text>
        </View>
      </View>

      {proposal.coverMessage ? <Text style={s.message}>{proposal.coverMessage}</Text> : null}

      {onAccept && proposal.status === 'PENDING' ? (
        <PrimaryButton title={accepting ? 'Accepting...' : 'Accept Proposal'} onPress={onAccept} style={s.button} />
      ) : null}
    </View>
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
    alignItems: 'center',
    gap: spacing.space16,
    marginBottom: spacing.space16,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.onSurface,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space4,
    marginTop: spacing.space4,
  },
  star: {
    ...typography.caption,
    color: colors.star,
  },
  rating: {
    ...typography.caption,
    color: colors.secondary,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.space12,
    marginBottom: spacing.space16,
  },
  metricCard: {
    flex: 1,
    borderRadius: borderRadius.control,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.space16,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.outline,
  },
  metricValue: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    marginTop: spacing.space4,
  },
  message: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  button: {
    marginTop: spacing.space16,
  },
});
