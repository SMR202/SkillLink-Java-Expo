import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { paymentApi } from '../../api/payments';
import { Payment, EarningsSummary } from '../../types';

export default function EarningsScreen() {
  const navigation = useNavigation<any>();
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [history, setHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [earnRes, histRes] = await Promise.all([
        paymentApi.getEarnings(),
        paymentApi.getProviderHistory(0, 20),
      ]);
      setSummary(earnRes.data?.data || null);
      setHistory(histRes.data?.data?.content || []);
    } catch (e: any) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Could not load earnings data.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.back} onPress={() => navigation.goBack()}>← Back</Text>
        <Text style={s.title}>Earnings</Text>
        <Text style={s.subtitle}>Track your marketplace performance and payouts.</Text>

        <View style={s.balanceCard}>
          <Text style={s.balanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={s.balanceValue}>${summary?.totalEarnings?.toFixed(2) || '0.00'}</Text>
          <Text style={s.balanceMeta}>vs. last month (${summary?.thisMonthEarnings?.toFixed(2) || '0.00'})</Text>
        </View>

        <View style={s.payoutCard}>
          <Text style={s.payoutLabel}>PENDING PAYOUT</Text>
          <Text style={s.payoutValue}>${summary?.pendingPayouts?.toFixed(2) || '0.00'}</Text>
          <Text style={s.payoutMeta}>Scheduled for next cycle</Text>
          <Text style={s.managePayouts}>Manage Payouts →</Text>
        </View>

        <View style={s.revenueCard}>
          <View style={s.revenueHeader}>
            <Text style={s.revenueTitle}>Revenue Overview</Text>
            <View style={s.rangeChip}><Text style={s.rangeChipText}>Last 6 Months</Text></View>
          </View>
          <View style={s.chartPlaceholder}>
            <Text style={s.chartValue}>${summary?.thisMonthEarnings?.toFixed(1) || '0.0'}k</Text>
          </View>
        </View>

        <View style={s.transactionsHeader}>
          <Text style={s.transactionsTitle}>Recent Transactions</Text>
          <Text style={s.viewAll}>View All</Text>
        </View>

        {history.length === 0 ? (
          <Text style={s.emptyText}>{loading ? 'Loading...' : 'No payment history yet.'}</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={s.historyCard}>
              <View style={s.historyIcon} />
              <View style={s.historyBody}>
                <Text style={s.historyClient}>{item.clientName}</Text>
                <Text style={s.historyMeta}>{new Date(item.paidAt!).toLocaleDateString()} · Invoice #{item.transactionRef}</Text>
              </View>
              <View style={s.historyRight}>
                <Text style={s.historyAmount}>+${item.providerEarnings?.toFixed(2)}</Text>
                <Text style={s.historyBadge}>Paid</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.space16, paddingTop: spacing.space48, paddingBottom: spacing.navHeight },
  back: { ...typography.label, color: colors.primary },
  title: { ...typography.h1, color: colors.onSurface, marginTop: spacing.space16 },
  subtitle: { ...typography.bodyLg, color: colors.onSurfaceVariant, marginTop: spacing.space8, marginBottom: spacing.space32 },
  balanceCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: borderRadius.card, borderWidth: spacing.xxs, borderColor: colors.surfaceVariant, padding: spacing.space24, marginBottom: spacing.space24, ...shadows.sm },
  balanceLabel: { ...typography.label, color: colors.onSurfaceVariant },
  balanceValue: { ...typography.h1, color: colors.onSurface, marginTop: spacing.space12 },
  balanceMeta: { ...typography.body, color: colors.onSurfaceVariant, marginTop: spacing.space8 },
  payoutCard: { backgroundColor: colors.primaryContainer, borderRadius: borderRadius.card, padding: spacing.space24, marginBottom: spacing.space24, ...shadows.lg },
  payoutLabel: { ...typography.label, color: colors.onPrimaryContainer },
  payoutValue: { ...typography.h2, color: colors.onPrimary, marginTop: spacing.space24 },
  payoutMeta: { ...typography.body, color: colors.onPrimaryContainer, marginTop: spacing.space8 },
  managePayouts: { ...typography.h4, color: colors.onPrimary, marginTop: spacing.space24 },
  revenueCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: borderRadius.card, borderWidth: spacing.xxs, borderColor: colors.surfaceVariant, padding: spacing.space24, marginBottom: spacing.space32, ...shadows.sm },
  revenueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  revenueTitle: { ...typography.h3, color: colors.onSurface, flex: 1 },
  rangeChip: { borderRadius: borderRadius.control, borderWidth: spacing.xxs, borderColor: colors.outlineVariant, paddingHorizontal: spacing.space12, paddingVertical: spacing.space8 },
  rangeChipText: { ...typography.caption, color: colors.onSurface },
  chartPlaceholder: { height: spacing.space96 * 2, justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: spacing.space24 },
  chartValue: { ...typography.body, color: colors.onPrimary, backgroundColor: colors.inverseSurface, borderRadius: borderRadius.control, paddingHorizontal: spacing.space12, paddingVertical: spacing.space8 },
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.space16 },
  transactionsTitle: { ...typography.h3, color: colors.onSurface },
  viewAll: { ...typography.label, color: colors.primary },
  historyCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.space16, backgroundColor: colors.surfaceContainerLowest, borderRadius: borderRadius.card, borderWidth: spacing.xxs, borderColor: colors.surfaceVariant, padding: spacing.space20, marginBottom: spacing.space16, ...shadows.sm },
  historyIcon: { width: spacing.space48, height: spacing.space48, borderRadius: borderRadius.pill, backgroundColor: colors.surfaceContainer },
  historyBody: { flex: 1 },
  historyClient: { ...typography.h4, color: colors.onSurface },
  historyMeta: { ...typography.caption, color: colors.onSurfaceVariant, marginTop: spacing.space4 },
  historyRight: { alignItems: 'flex-end' },
  historyAmount: { ...typography.h4, color: colors.onSurface },
  historyBadge: { ...typography.captionMedium, color: colors.primary, marginTop: spacing.space8 },
  emptyText: { ...typography.body, color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.space32 },
});
