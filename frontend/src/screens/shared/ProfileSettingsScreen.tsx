import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../../components/Avatar';
import GradientButton from '../../components/GradientButton';

export default function ProfileSettingsScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const navigateTo = (screen: string) => {
    try {
      navigation.navigate(screen);
    } catch {
      navigation.getParent?.()?.navigate(screen);
    }
  };

  const roleLabel = user?.role === 'PROVIDER' ? 'Service Provider' : user?.role === 'CLIENT' ? 'Client' : 'Admin';

  const menuItems = [
    { label: 'Edit Profile',       icon: '✏️', action: () => {
        if (user?.role === 'PROVIDER') { navigateTo('Profile'); }
        else if (user?.role === 'CLIENT') { navigateTo('ClientContact'); }
      }
    },
    { label: 'Notifications',      icon: '🔔', action: () => navigateTo('NotificationsHub') },
    { label: 'Change Password',    icon: '🔒', action: () => navigateTo('ChangePassword') },
    { label: 'Help & Support',     icon: '❓', action: () => navigateTo('HelpSupport') },
  ];

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />

      {/* Top bar */}
      <View style={s.topBar}>
        <Text style={s.brand}>SkillLink</Text>
        <TouchableOpacity onPress={() => navigateTo('NotificationsHub')} activeOpacity={0.85}>
          <View style={s.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={s.profileCard}>
          <Avatar name={user?.fullName} size={72} />
          <Text style={s.name}>{user?.fullName || 'User'}</Text>
          <Text style={s.email}>{user?.email}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleBadgeText}>{roleLabel}</Text>
          </View>
        </View>

        {/* Account info (read-only) */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Account Details</Text>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Full Name</Text>
            <Text style={s.infoValue}>{user?.fullName || '—'}</Text>
          </View>
          <View style={[s.infoRow, s.infoRowBorder]}>
            <Text style={s.infoLabel}>Email</Text>
            <Text style={s.infoValue}>{user?.email || '—'}</Text>
          </View>
          <View style={[s.infoRow, s.infoRowBorder]}>
            <Text style={s.infoLabel}>Role</Text>
            <Text style={s.infoValue}>{roleLabel}</Text>
          </View>
          <View style={[s.infoRow, s.infoRowBorder]}>
            <Text style={s.infoLabel}>Email Verified</Text>
            <Text style={[s.infoValue, { color: user?.emailVerified ? colors.success : colors.warning }]}>
              {user?.emailVerified ? '✓ Verified' : '⚠ Pending'}
            </Text>
          </View>
        </View>

        {/* Menu items */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Settings</Text>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[s.menuRow, idx > 0 && s.menuRowBorder]}
              onPress={item.action}
              activeOpacity={0.8}
            >
              <Text style={s.menuIcon}>{item.icon}</Text>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <GradientButton
          title="Log Out"
          onPress={handleLogout}
          style={s.logoutBtn}
          variant="outline"
        />

        <View style={{ height: spacing.space48 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space48,
    paddingBottom: spacing.space20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  brand:  { ...typography.h4, color: colors.primary },
  notifDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.notification,
  },
  content: { padding: spacing.space24, paddingBottom: spacing.space96 },

  profileCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    alignItems: 'center',
    marginBottom: spacing.space24,
    ...shadows.sm,
  },
  name:  { ...typography.h4, color: colors.onSurface, marginTop: spacing.space12 },
  email: { ...typography.body, color: colors.onSurfaceVariant, marginTop: spacing.space4 },
  roleBadge: {
    marginTop: spacing.space12,
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space8,
  },
  roleBadgeText: { ...typography.captionMedium, color: colors.onSurfaceVariant },

  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.space20,
    marginBottom: spacing.space20,
    ...shadows.sm,
  },
  sectionTitle: { ...typography.h4, color: colors.onSurface, marginBottom: spacing.space16 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.space12 },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: colors.surfaceVariant },
  infoLabel: { ...typography.body, color: colors.onSurfaceVariant },
  infoValue: { ...typography.bodyMedium, color: colors.onSurface, flexShrink: 1, textAlign: 'right' },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.space16,
    gap: spacing.space12,
  },
  menuRowBorder: { borderTopWidth: 1, borderTopColor: colors.surfaceVariant },
  menuIcon:  { fontSize: 18, width: 28 },
  menuLabel: { ...typography.body, color: colors.onSurface, flex: 1 },
  menuArrow: { ...typography.h4, color: colors.onSurfaceVariant },

  logoutBtn: { width: '100%', marginTop: spacing.space8 },
});
