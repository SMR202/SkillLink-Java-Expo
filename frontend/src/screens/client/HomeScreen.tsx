import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { providerApi } from '../../api/providers';
import { ProviderProfile, SkillCategory } from '../../types';

export default function HomeScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [city, setCity] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { search(); }, [page]);

  const loadCategories = async () => {
    try { const r = await providerApi.getCategories(); setCategories(r); } catch {}
    search();
  };

  const search = async (resetPage = false) => {
    const p = resetPage ? 0 : page;
    if (resetPage) setPage(0);
    setLoading(true);
    try {
      const r = await providerApi.search({
        q: query || undefined,
        categoryId: selectedCat || undefined,
        city: city || undefined,
        minRating: minRating || undefined,
        page: p,
        size: 6,
      });
      setProviders(r.content || []);
      setTotalPages(r.totalPages || 1);
      setTotalElements(r.totalElements || 0);
    } catch {} setLoading(false);
  };

  const handleCatPress = (id: number) => {
    setSelectedCat(selectedCat === id ? null : id);
    setTimeout(() => search(true), 50);
  };

  const ratingSteps = [0, 1, 2, 3, 4];

  const renderProvider = ({ item }: { item: ProviderProfile }) => (
    <TouchableOpacity style={s.card} activeOpacity={0.7}
      onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}>
      <View style={s.cardRow}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{item.fullName?.[0]?.toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={s.providerName}>{item.fullName}</Text>
            {item.isVerified && (
              <View style={s.verifiedBadge}><Text style={s.verifiedText}>✓ Verified</Text></View>
            )}
          </View>
          <Text style={s.providerCity}>📍 {item.city || 'No location set'}</Text>
        </View>
        <View style={s.ratingBox}>
          <Text style={s.star}>★</Text>
          <Text style={s.ratingVal}>{item.avgRating?.toFixed(1) || '0.0'}</Text>
        </View>
      </View>
      {item.skills && item.skills.length > 0 && (
        <View style={s.skillRow}>
          {item.skills.slice(0, 3).map((sk: any) => (
            <View key={sk.id} style={s.skillChip}>
              <Text style={s.skillText}>{sk.name}</Text>
            </View>
          ))}
          {item.skills.length > 3 && (
            <Text style={s.moreSkills}>+{item.skills.length - 3} more</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <View style={s.headerArea}>
        <Text style={s.heading}>Find Your Expert</Text>
        <Text style={s.subheading}>Search skilled professionals near you</Text>
      </View>

      {/* Search Bar */}
      <View style={s.searchSection}>
        <View style={s.searchRow}>
          <TextInput style={s.searchInput} placeholder="Search providers, skills..."
            placeholderTextColor={colors.textMuted} value={query} onChangeText={setQuery}
            onSubmitEditing={() => search(true)} returnKeyType="search" />
          <TouchableOpacity style={s.searchBtn} onPress={() => search(true)}>
            <Text style={{ color: '#fff', fontSize: 16 }}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Toggle */}
        <TouchableOpacity style={s.filterToggle} onPress={() => setShowFilters(!showFilters)}>
          <Text style={s.filterToggleText}>
            {showFilters ? '▲ Hide Filters' : '▼ Show Filters'}
          </Text>
        </TouchableOpacity>

        {/* Advanced Filters */}
        {showFilters && (
          <View style={s.filtersBox}>
            <View style={s.filterRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.filterLabel}>City</Text>
                <TextInput style={s.filterInput} placeholder="e.g. Islamabad"
                  placeholderTextColor={colors.textMuted} value={city}
                  onChangeText={setCity} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.filterLabel}>Min Rating</Text>
                <View style={s.ratingRow}>
                  {ratingSteps.map(r => (
                    <TouchableOpacity key={r} onPress={() => { setMinRating(r); }}
                      style={[s.ratingBtn, minRating === r && s.ratingBtnActive]}>
                      <Text style={[s.ratingBtnText, minRating === r && s.ratingBtnTextActive]}>
                        {r === 0 ? 'Any' : `${r}+`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <TouchableOpacity style={s.applyBtn} onPress={() => search(true)}>
              <Text style={s.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}
          contentContainerStyle={{ paddingHorizontal: spacing.xxl }}>
          {categories.map(c => (
            <TouchableOpacity key={c.id}
              style={[s.catChip, selectedCat === c.id && s.catChipActive]}
              onPress={() => handleCatPress(c.id)}>
              <Text style={[s.catText, selectedCat === c.id && s.catTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={s.resultsHeader}>
        <Text style={s.resultsCount}>{totalElements} provider{totalElements !== 1 ? 's' : ''} found</Text>
      </View>

      {/* Results */}
      <FlatList data={providers} renderItem={renderProvider}
        keyExtractor={i => i.id.toString()} contentContainerStyle={s.list}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 40 }}>{loading ? '⏳' : '🔍'}</Text>
            <Text style={s.emptyText}>{loading ? 'Searching...' : 'No providers found'}</Text>
            <Text style={s.emptyDesc}>Try adjusting your filters</Text>
          </View>
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={s.pagination}>
          <TouchableOpacity style={[s.pageBtn, page === 0 && s.pageBtnDisabled]}
            disabled={page === 0} onPress={() => setPage(page - 1)}>
            <Text style={[s.pageBtnText, page === 0 && { color: colors.textMuted }]}>← Prev</Text>
          </TouchableOpacity>
          <Text style={s.pageInfo}>Page {page + 1} of {totalPages}</Text>
          <TouchableOpacity style={[s.pageBtn, page >= totalPages - 1 && s.pageBtnDisabled]}
            disabled={page >= totalPages - 1} onPress={() => setPage(page + 1)}>
            <Text style={[s.pageBtnText, page >= totalPages - 1 && { color: colors.textMuted }]}>Next →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  headerArea: { paddingHorizontal: spacing.xxl, paddingTop: 50, backgroundColor: colors.bgPrimary, paddingBottom: spacing.md },
  heading: { ...typography.h1, color: colors.textPrimary },
  subheading: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  searchSection: { backgroundColor: colors.bgPrimary, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchRow: { flexDirection: 'row', paddingHorizontal: spacing.xxl, paddingTop: spacing.md, gap: spacing.sm },
  searchInput: { flex: 1, backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: 12, ...typography.body, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  searchBtn: { width: 48, height: 48, borderRadius: borderRadius.md, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  filterToggle: { alignSelf: 'flex-start', marginLeft: spacing.xxl, marginTop: spacing.sm },
  filterToggleText: { ...typography.smallMedium, color: colors.accent },
  filtersBox: { marginHorizontal: spacing.xxl, marginTop: spacing.md, backgroundColor: colors.bgSecondary, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  filterRow: { flexDirection: 'row', gap: spacing.lg },
  filterLabel: { ...typography.captionMedium, color: colors.textSecondary, marginBottom: spacing.xs },
  filterInput: { backgroundColor: colors.bgPrimary, borderRadius: borderRadius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, ...typography.small, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  ratingRow: { flexDirection: 'row', gap: 4 },
  ratingBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: borderRadius.sm, backgroundColor: colors.bgPrimary, borderWidth: 1, borderColor: colors.border },
  ratingBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  ratingBtnText: { ...typography.caption, color: colors.textSecondary },
  ratingBtnTextActive: { color: '#fff' },
  applyBtn: { marginTop: spacing.md, backgroundColor: colors.primary, paddingVertical: 10, borderRadius: borderRadius.sm, alignItems: 'center' },
  applyBtnText: { ...typography.buttonSmall, color: '#fff' },
  catScroll: { maxHeight: 44, marginTop: spacing.md },
  catChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.bgInput, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catText: { ...typography.smallMedium, color: colors.textSecondary },
  catTextActive: { color: colors.textInverse },
  resultsHeader: { paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  resultsCount: { ...typography.smallMedium, color: colors.textSecondary },
  list: { paddingHorizontal: spacing.xxl, paddingBottom: 20 },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.sm },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.bgInput, justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...typography.h4, color: colors.textPrimary },
  providerName: { ...typography.bodyMedium, color: colors.textPrimary },
  verifiedBadge: { backgroundColor: colors.accentLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.full },
  verifiedText: { ...typography.caption, color: colors.accentDark, fontWeight: '600' },
  providerCity: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  star: { color: colors.star, fontSize: 14 },
  ratingVal: { ...typography.bodyMedium, color: colors.textPrimary },
  skillRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, alignItems: 'center' },
  skillChip: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.full, backgroundColor: colors.accentLight },
  skillText: { ...typography.caption, color: colors.accentDark, fontWeight: '600' },
  moreSkills: { ...typography.caption, color: colors.textMuted },
  empty: { alignItems: 'center', marginTop: spacing.huge },
  emptyText: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptyDesc: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, backgroundColor: colors.bgPrimary, borderTopWidth: 1, borderTopColor: colors.border },
  pageBtn: { paddingVertical: 8, paddingHorizontal: spacing.lg },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { ...typography.buttonSmall, color: colors.primary },
  pageInfo: { ...typography.small, color: colors.textSecondary },
});
