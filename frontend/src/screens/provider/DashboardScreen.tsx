import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { bookingApi } from '../../api/bookings';
import { useAuthStore } from '../../store/authStore';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);
  const loadStats = async () => {
    try {
      const [p, a, c] = await Promise.all([
        bookingApi.getProviderBookings('PENDING', 0, 1),
        bookingApi.getProviderBookings('ACCEPTED', 0, 1),
        bookingApi.getProviderBookings('COMPLETED', 0, 1),
      ]);
      setStats({
        pending: p.totalElements || 0,
        accepted: a.totalElements || 0,
        completed: c.totalElements || 0,
      });
    } catch {
      Alert.alert('Error', 'Could not load dashboard stats.');
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'View Bookings') {
      navigation.navigate('My Bookings');
      return;
    }

    if (action === 'Edit Profile') {
      navigation.navigate('Edit Profile');
      return;
    }

    if (action === 'Earnings') {
      navigation.navigate('Earnings');
      return;
    }

    if (action === 'Reviews') {
      navigation.navigate('Reviews');
      return;
    }

    if (action === 'Analytics') {
      Alert.alert(
        'Analytics Snapshot',
        `Pending: ${stats.pending}\nActive: ${stats.accepted}\nCompleted: ${stats.completed}`,
      );
      return;
    }

    navigation.navigate('ProfileSettings');
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.avatar} />
          <Text style={s.title}>Welcome back,{'\n'}{user?.fullName || 'Provider'}</Text>
          <Text style={s.subtitle}>Here is what is happening today.</Text>
          <TouchableOpacity onPress={logout} style={s.logoutButton} activeOpacity={0.9}>
            <Text style={s.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={s.statsRow}>
          {[
            { label: 'Pending', val: stats.pending, icon: '⌛', tone: colors.surfaceContainerLow },
            { label: 'Accepted', val: stats.accepted, icon: '✓', tone: colors.surfaceContainerLow },
            { label: 'Completed', val: stats.completed, icon: '⌁', tone: colors.tertiaryFixed },
          ].map((item) => (
            <View key={item.label} style={s.statCard}>
              <View style={[s.statIconWrap, { backgroundColor: item.tone }]}>
                <Text style={s.statIcon}>{item.icon}</Text>
              </View>
              <Text style={s.statValue}>{item.val}</Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.monthCard}>
          <Text style={s.monthLabel}>THIS MONTH</Text>
          <Text style={s.monthValue}>$2,450</Text>
          <Text style={s.monthDelta}>+15% from last month</Text>
        </View>

        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.actionsRow}>
          {[
            ['Bookings', 'View Bookings'],
            ['Profile', 'Edit Profile'],
            ['Reviews', 'Reviews'],
          ].map(([display, action]) => (
            <TouchableOpacity
              key={display}
              style={s.actionCard}
              activeOpacity={0.9}
              onPress={() => handleQuickAction(action)}
            >
              <View style={s.actionIconWrap} />
              <Text style={s.actionLabel}>{display}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.activityHeader}>
          <Text style={s.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => handleQuickAction('Analytics')} activeOpacity={0.9}>
            <Text style={s.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={s.activityCard}>
          <View style={s.activityItem}>
            <View style={s.activityIconWrap} />
            <View style={s.activityText}>
              <Text style={s.activityTitle}>New message from Sarah</Text>
              <Text style={s.activityBody}>&quot;Hi {user?.fullName || 'there'}, checking on the booking...&quot;</Text>
            </View>
            <Text style={s.activityTime}>2m ago</Text>
          </View>
          <View style={s.activityDivider} />
          <View style={s.activityItem}>
            <View style={s.activityIconWrap} />
            <View style={s.activityText}>
              <Text style={s.activityTitle}>Booking confirmed</Text>
              <Text style={s.activityBody}>Kitchen sink repair · Tomorrow 10am</Text>
            </View>
            <Text style={s.activityTime}>1h ago</Text>
          </View>
          <View style={s.activityDivider} />
          <View style={s.activityItem}>
            <View style={s.activityIconWrap} />
            <View style={s.activityText}>
              <Text style={s.activityTitle}>Review received</Text>
              <Text style={s.activityBody}>5 stars from a recent client.</Text>
            </View>
            <Text style={s.activityTime}>3h ago</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.space24,
    paddingBottom: spacing.navHeight,
  },
  hero: {
    marginBottom: spacing.space24,
  },
  avatar: {
    width: spacing.space80,
    height: spacing.space80,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    marginBottom: spacing.space16,
  },
  title: {
    ...typography.h1,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
  },
  logoutButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.space16,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
    backgroundColor: colors.surfaceContainerLowest,
  },
  logoutText: {
    ...typography.button,
    color: colors.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.space12,
    marginBottom: spacing.space24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space20,
    alignItems: 'center',
    ...shadows.sm,
  },
  statIconWrap: {
    width: spacing.space48,
    height: spacing.space48,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space12,
  },
  statIcon: {
    ...typography.h4,
    color: colors.primary,
  },
  statValue: {
    ...typography.h2,
    color: colors.onSurface,
  },
  statLabel: {
    ...typography.label,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
  },
  monthCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: borderRadius.card,
    padding: spacing.space32,
    marginBottom: spacing.space32,
    ...shadows.lg,
  },
  monthLabel: {
    ...typography.label,
    color: colors.onPrimaryContainer,
  },
  monthValue: {
    ...typography.h1,
    color: colors.onPrimary,
    marginTop: spacing.space20,
  },
  monthDelta: {
    ...typography.body,
    color: colors.onPrimaryContainer,
    marginTop: spacing.space8,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.onSurface,
    marginBottom: spacing.space16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.space12,
    marginBottom: spacing.space32,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space20,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIconWrap: {
    width: spacing.space56,
    height: spacing.space56,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    marginBottom: spacing.space16,
  },
  actionLabel: {
    ...typography.h4,
    color: colors.onSurface,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    ...typography.label,
    color: colors.primary,
  },
  activityCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    ...shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    gap: spacing.space12,
    padding: spacing.space20,
    alignItems: 'center',
  },
  activityIconWrap: {
    width: spacing.space56,
    height: spacing.space56,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    ...typography.h4,
    color: colors.onSurface,
  },
  activityBody: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space4,
  },
  activityTime: {
    ...typography.caption,
    color: colors.outline,
  },
  activityDivider: {
    height: spacing.xxs,
    backgroundColor: colors.surfaceVariant,
  },
});
