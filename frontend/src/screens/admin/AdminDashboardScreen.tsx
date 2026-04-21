import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { adminApi } from '../../api/admin';
import { Analytics } from '../../types';

export default function AdminDashboardScreen() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAnalytics(); }, []);
  const loadAnalytics = async () => {
    try {
      const res = await adminApi.getAnalytics();
      setAnalytics(res.data?.data);
    } catch {}
    setLoading(false);
  };

  const stats = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: '👥', color: '#6366F1' },
    { label: 'Providers', value: analytics?.totalProviders || 0, icon: '🔧', color: colors.accent },
    { label: 'Clients', value: analytics?.totalClients || 0, icon: '👤', color: '#F59E0B' },
    { label: 'Bookings', value: analytics?.totalBookings || 0, icon: '📋', color: '#8B5CF6' },
    { label: 'Completed', value: analytics?.completedBookings || 0, icon: '✅', color: colors.success },
    { label: 'Pending', value: analytics?.pendingBookings || 0, icon: '⏳', color: colors.warning },
    { label: 'Revenue (PKR)', value: analytics?.totalRevenue || 0, icon: '💰', color: '#10B981' },
    { label: 'Platform Earnings', value: analytics?.platformEarnings || 0, icon: '🏦', color: '#EC4899' },
    { label: 'Reviews', value: analytics?.totalReviews || 0, icon: '⭐', color: colors.star },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.title}>Admin Dashboard</Text>
        <Text style={s.subtitle}>SkillLink Platform Overview</Text>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {loading ? (
          <View style={s.loadingWrap}><Text style={{ fontSize: 32 }}>⏳</Text><Text style={s.loadingText}>Loading analytics...</Text></View>
        ) : (
          <View style={s.grid}>
            {stats.map((stat, idx) => (
              <View key={idx} style={s.statCard}>
                <Text style={{ fontSize: 28 }}>{stat.icon}</Text>
                <Text style={[s.statValue, { color: stat.color }]}>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 54, paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  content: { padding: spacing.lg, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: { width: '48%', backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', ...shadows.sm, minWidth: 150, flexGrow: 1 },
  statValue: { ...typography.h2, marginTop: spacing.sm },
  statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  loadingWrap: { alignItems: 'center', marginTop: 60 },
  loadingText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
