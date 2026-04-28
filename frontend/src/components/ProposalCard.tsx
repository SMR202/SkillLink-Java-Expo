import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Proposal } from '../types';
import Avatar from './Avatar';
import Badge from './Badge';

interface ProposalCardProps {
  proposal: Proposal;
  onAccept?: () => void;
  accepting?: boolean;
}

export default function ProposalCard({ proposal, onAccept, accepting }: ProposalCardProps) {
  return (
    <View style={s.card}>
      <View style={s.header}>
        <Avatar name={proposal.providerName} uri={proposal.providerAvatarUrl} size={44} />
        <View style={s.info}>
          <Text style={s.name}>{proposal.providerName}</Text>
          <View style={s.ratingRow}>
            <Text style={s.star}>★</Text>
            <Text style={s.rating}>{proposal.providerRating?.toFixed(1) || 'N/A'}</Text>
          </View>
        </View>
        <Badge status={proposal.status} />
      </View>
      <View style={s.priceRow}>
        <View style={s.priceBox}>
          <Text style={s.priceLabel}>Proposed Price</Text>
          <Text style={s.price}>PKR {Number(proposal.proposedPrice).toLocaleString()}</Text>
        </View>
        <View style={s.priceBox}>
          <Text style={s.priceLabel}>Delivery Time</Text>
          <Text style={s.price}>{proposal.estimatedDeliveryTime}</Text>
        </View>
      </View>
      {proposal.coverMessage ? (
        <Text style={s.message}>{proposal.coverMessage}</Text>
      ) : null}
      {onAccept && proposal.status === 'PENDING' && (
        <TouchableOpacity style={s.acceptBtn} onPress={onAccept} disabled={accepting} activeOpacity={0.8}>
          <Text style={s.acceptText}>{accepting ? 'Accepting...' : 'Accept Proposal'}</Text>
        </TouchableOpacity>
      )}
    </View>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  info: { flex: 1 },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  star: { color: colors.star, fontSize: 13 },
  rating: { ...typography.caption, color: colors.textSecondary },
  priceRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  priceBox: {
    flex: 1, backgroundColor: colors.bgInput,
    borderRadius: borderRadius.md, padding: spacing.md,
  },
  priceLabel: { ...typography.caption, color: colors.textMuted },
  price: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  message: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.md },
  acceptBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  acceptText: { ...typography.buttonSmall, color: colors.textInverse },
});
