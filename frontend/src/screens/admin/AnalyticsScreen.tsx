import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { adminApi } from '../../api/admin';
import { Analytics } from '../../types';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingSpinner from '../../components/LoadingSpinner';

interface StatRow {
  label: string;
  value: number;
  icon: string;
  color: string;
}

function BarChart({ data, maxVal }: { data: { label: string; value: number }[]; maxVal: number }) {
  if (!data.length || maxVal === 0) return null;
  return (
    <View style={bc.container}>
      {data.map((item, idx) => {
        const pct = maxVal > 0 ? (item.value / maxVal) : 0;
        return (
          <View key={idx} style={bc.barGroup}>
            <View style={bc.barWrap}>
              <View style={[bc.bar, { height: Math.max(pct * 100, 4) }]} />
            </View>
            <Text style={bc.barLabel}>{item.label}</Text>
            <Text style={bc.barVal}>{item.value.toLocaleString()}</Text>
          </View>
        );
      })}
    </View>
  );
}

const bc = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, height: 120, paddingTop: spacing.sm },
  barGroup: { flex: 1, alignItems: 'center' },
  barWrap: { flex: 1, justifyContent: 'flex-end', width: '100%' },
  bar: { backgroundColor: colors.accent, borderRadius: 4, width: '70%', alignSelf: 'center' },
  barLabel: { ...typography.caption, color: colors.textMuted, marginTop: 4, textAlign: 'center', fontSize: 9 },
  barVal: { ...typography.caption, color: colors.textSecondary, fontSize: 10 },
});

export default function AnalyticsScreen({ navigation }: any) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await adminApi.getAnalytics();
      setAnalytics(res.data?.data || null);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  const stats: StatRow[] = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: '👥', color: '#6366F1' },
    { label: 'Clients', value: analytics?.totalClients || 0, icon: '👤', color: '#F59E0B' },
    { label: 'Providers', value: analytics?.totalProviders || 0, icon: '🔧', color: colors.accent },
    { label: 'Total Bookings', value: analytics?.totalBookings || 0, icon: '📋', color: '#8B5CF6' },
    { label: 'Completed', value: analytics?.completedBookings || 0, icon: '✅', color: colors.success },
    { label: 'Pending', value: analytics?.pendingBookings || 0, icon: '⏳', color: colors.warning },
    { label: 'Reviews', value: analytics?.totalReviews || 0, icon: '⭐', color: colors.star },
    { label: 'Avg Rating', value: analytics?.averagePlatformRating || 0, icon: '📊', color: '#EC4899' },
  ];

  const bookingData = [
    { label: 'Total', value: analytics?.totalBookings || 0 },
    { label: 'Pending', value: analytics?.pendingBookings || 0 },
    { label: 'Done', value: analytics?.completedBookings || 0 },
  ];
  const bookingMax = Math.max(...bookingData.map(d => d.value), 1);

  const revenueData = [
    { label: 'Revenue', value: Math.round((analytics?.totalRevenue || 0) / 1000) },
    { label: 'Platform', value: Math.round((analytics?.platformEarnings || 0) / 1000) },
  ];
  const revenueMax = Math.max(...revenueData.map(d => d.value), 1);

  return (
    <View style={s.container}>
      <ScreenHeader title="Analytics" subtitle="Platform performance overview" />
      <ScrollView
        contentContainerStyle={s.body}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
      >
        {/* Stat Cards grid */}
        <Text style={s.sectionTitle}>Key Metrics</Text>
        <View style={s.grid}>
          {stats.map((stat, idx) => (
            <View key={idx} style={s.statCard}>
              <Text style={s.statIcon}>{stat.icon}</Text>
              <Text style={[s.statValue, { color: stat.color }]}>
                {Number.isInteger(stat.value) ? stat.value.toLocaleString() : stat.value.toFixed(1)}
              </Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Revenue Overview (PKR '000s)</Text>
          <View style={s.revenueRow}>
            <View style={s.revenueItem}>
              <Text style={s.revenueLabel}>Total Revenue</Text>
              <Text style={s.revenueValue}>PKR {(analytics?.totalRevenue || 0).toLocaleString()}</Text>
            </View>
            <View style={s.revenueItem}>
              <Text style={s.revenueLabel}>Platform Earnings</Text>
              <Text style={[s.revenueValue, { color: colors.accent }]}>PKR {(analytics?.platformEarnings || 0).toLocaleString()}</Text>
            </View>
          </View>
          <BarChart data={revenueData} maxVal={revenueMax} />
        </View>

        {/* Bookings Chart */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Bookings Breakdown</Text>
          <BarChart data={bookingData} maxVal={bookingMax} />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  body: { padding: spacing.xxl, paddingBottom: 100 },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  statCard: {
    width: '47%', backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.lg,
    alignItems: 'center', ...shadows.sm,
  },
  statIcon: { fontSize: 22 },
  statValue: { ...typography.h2, marginTop: spacing.xs },
  statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.lg, marginBottom: spacing.md, ...shadows.sm,
  },
  cardTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.lg },
  revenueRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  revenueItem: {
    flex: 1, backgroundColor: colors.bgInput,
    borderRadius: borderRadius.md, padding: spacing.md,
  },
  revenueLabel: { ...typography.caption, color: colors.textMuted },
  revenueValue: { ...typography.h4, color: colors.textPrimary, marginTop: 4 },
});
