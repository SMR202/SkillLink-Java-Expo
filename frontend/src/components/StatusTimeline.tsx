import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface StatusTimelineProps {
  status: string;
  createdAt?: string;
  declineReason?: string | null;
}

const ORDER = ['PENDING', 'ACCEPTED', 'PAID', 'COMPLETED'];

const STEPS: Record<string, { title: string; detail: string }> = {
  PENDING:   { title: 'Request Sent',        detail: 'Waiting for provider acceptance.' },
  ACCEPTED:  { title: 'Provider Accepted',   detail: 'Ready for payment.' },
  PAID:      { title: 'Payment Received',    detail: 'Service can now begin.' },
  COMPLETED: { title: 'Completed',           detail: 'Service successfully delivered.' },
};

export default function StatusTimeline({ status, createdAt, declineReason }: StatusTimelineProps) {
  const declined = status === 'DECLINED' || status === 'CANCELLED';
  const currentIdx = ORDER.indexOf(status);

  const steps = declined
    ? [
        { key: 'PENDING', ...STEPS.PENDING, state: 'done' },
        { key: status, title: status === 'DECLINED' ? 'Declined' : 'Cancelled', detail: declineReason || 'This booking was cancelled.', state: 'error' },
      ]
    : ORDER.map((key, i) => ({
        key,
        ...STEPS[key],
        state: i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'next',
      }));

  return (
    <View>
      {steps.map((step, idx) => {
        const active = step.state === 'done' || step.state === 'current';
        const isError = step.state === 'error';
        return (
          <View key={step.key} style={s.row}>
            <View style={s.rail}>
              <View style={[s.dot, active && s.dotActive, isError && s.dotError]} />
              {idx < steps.length - 1 && (
                <View style={[s.line, active && s.lineActive]} />
              )}
            </View>
            <View style={s.textBlock}>
              <Text style={[s.title, step.state === 'next' && s.titleMuted]}>{step.title}</Text>
              <Text style={s.detail}>{step.detail}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', minHeight: 60 },
  rail: { width: 24, alignItems: 'center' },
  dot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.border, marginTop: 2,
  },
  dotActive: { backgroundColor: colors.accent },
  dotError: { backgroundColor: colors.error },
  line: {
    flex: 1, width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  lineActive: { backgroundColor: colors.accentLight },
  textBlock: { flex: 1, paddingBottom: spacing.md, paddingLeft: spacing.sm },
  title: { ...typography.bodyMedium, color: colors.textPrimary },
  titleMuted: { color: colors.textMuted },
  detail: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
