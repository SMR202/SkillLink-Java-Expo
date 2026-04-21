import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, StatusBar, Alert } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { adminApi } from '../../api/admin';
import { AdminUser } from '../../types';

export default function UserManagementScreen() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async (q?: string) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ search: q || undefined, size: 50 });
      setUsers(res.data?.data?.content || []);
    } catch {}
    setLoading(false);
  };

  const handleSearch = () => loadUsers(search);

  const toggleStatus = async (user: AdminUser) => {
    const action = user.isActive ? 'suspend' : 'activate';
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} ${user.fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: action === 'suspend' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              if (user.isActive) {
                await adminApi.suspendUser(user.id);
              } else {
                await adminApi.activateUser(user.id);
              }
              loadUsers(search);
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.message || 'Failed');
            }
          },
        },
      ]
    );
  };

  const roleColors: Record<string, string> = { CLIENT: '#6366F1', PROVIDER: colors.accent, ADMIN: '#EC4899' };

  const renderItem = ({ item }: { item: AdminUser }) => (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={s.avatar}><Text style={s.avatarText}>{item.fullName?.[0]?.toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{item.fullName}</Text>
          <Text style={s.email}>{item.email}</Text>
        </View>
        <View style={[s.roleBadge, { backgroundColor: (roleColors[item.role] || colors.textMuted) + '15' }]}>
          <Text style={[s.roleText, { color: roleColors[item.role] || colors.textMuted }]}>{item.role}</Text>
        </View>
      </View>
      <View style={s.cardBottom}>
        <Text style={s.joined}>Joined: {new Date(item.createdAt).toLocaleDateString()}</Text>
        {item.role !== 'ADMIN' && (
          <Pressable
            onPress={() => toggleStatus(item)}
            style={[s.actionBtn, { backgroundColor: item.isActive ? '#FEE2E2' : '#D1FAE5' }]}
          >
            <Text style={{ color: item.isActive ? colors.error : colors.success, fontWeight: '600', fontSize: 12 }}>
              {item.isActive ? '⛔ Suspend' : '✅ Activate'}
            </Text>
          </Pressable>
        )}
      </View>
      <View style={[s.statusDot, { backgroundColor: item.isActive ? colors.success : colors.error }]} />
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.title}>User Management</Text>
        <View style={s.searchRow}>
          <TextInput
            style={s.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          <Pressable onPress={handleSearch} style={s.searchBtn}><Text style={{ color: '#FFF', fontWeight: '600' }}>Search</Text></Pressable>
        </View>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <View style={s.empty}><Text style={{ fontSize: 32 }}>👥</Text><Text style={s.emptyText}>{loading ? 'Loading...' : 'No users found'}</Text></View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 54, paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  searchRow: { flexDirection: 'row', gap: spacing.sm },
  searchInput: { flex: 1, backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...typography.body, color: colors.textPrimary },
  searchBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  list: { padding: spacing.xxl, paddingBottom: 100 },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, position: 'relative', ...shadows.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgInput, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700', color: colors.textPrimary },
  name: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '600' },
  email: { ...typography.caption, color: colors.textMuted },
  roleBadge: { paddingHorizontal: spacing.md, paddingVertical: 3, borderRadius: borderRadius.full },
  roleText: { fontSize: 11, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  joined: { ...typography.caption, color: colors.textMuted },
  actionBtn: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: borderRadius.md },
  statusDot: { position: 'absolute', top: spacing.lg, right: spacing.lg, width: 8, height: 8, borderRadius: 4 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
