import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { providerApi } from '../../api/providers';
import { ProviderProfile, SkillCategory } from '../../types';
import ProviderCard from '../../components/ProviderCard';
import EmptyState from '../../components/EmptyState';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const firstName = user?.fullName?.split(' ')[0] || 'there';
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
    <ProviderCard
      provider={item}
      onPress={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
      onBook={() => navigation.navigate('ProviderProfile', { providerId: item.id })}
    />
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />

      <View style={s.topBar}>
        <View style={s.brandGroup}>
          <View style={s.brandAvatar}>
            <Text style={s.brandAvatarText}>S</Text>
          </View>
          <Text style={s.brandText}>SkillLink</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationsHub')} activeOpacity={0.85}>
          <View style={s.notificationDot} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={s.hero}>
              <Text style={s.heroTitle}>Hello, {firstName} 👋</Text>
              <Text style={s.heroSubtitle}>Find the perfect professional for your next project.</Text>
            </View>

            <View style={s.tabRow}>
              <TouchableOpacity activeOpacity={0.9} style={s.activeTab}>
                <Text style={s.activeTabText}>Browse Providers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.inactiveTab}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Jobs')}
              >
                <Text style={s.inactiveTabText}>Job Board</Text>
              </TouchableOpacity>
            </View>

            <View style={s.searchShell}>
              <Text style={s.searchIcon}>⌕</Text>
              <TextInput
                style={s.searchInput}
                placeholder="Search for skills, names, or categories..."
                placeholderTextColor={colors.outline}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => search(true)}
                returnKeyType="search"
              />
              <TouchableOpacity onPress={() => setShowFilters(!showFilters)} activeOpacity={0.85}>
                <Text style={s.filterIcon}>☷</Text>
              </TouchableOpacity>
            </View>

            {showFilters ? (
              <View style={s.filtersCard}>
                <View style={s.filterField}>
                  <Text style={s.filterLabel}>City</Text>
                  <TextInput
                    style={s.filterInput}
                    placeholder="e.g. Islamabad"
                    placeholderTextColor={colors.outline}
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <Text style={s.filterLabel}>Minimum Rating</Text>
                <View style={s.ratingRow}>
                  {ratingSteps.map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => setMinRating(rating)}
                      style={[s.ratingButton, minRating === rating && s.ratingButtonActive]}
                      activeOpacity={0.9}
                    >
                      <Text style={[s.ratingButtonText, minRating === rating && s.ratingButtonTextActive]}>
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={() => search(true)} style={s.applyFiltersButton} activeOpacity={0.9}>
                  <Text style={s.applyFiltersText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categories}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCat(null);
                  setTimeout(() => search(true), 50);
                }}
                style={[s.categoryChip, selectedCat === null && s.categoryChipActive]}
                activeOpacity={0.9}
              >
                <Text style={[s.categoryText, selectedCat === null && s.categoryTextActive]}>All Categories</Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[s.categoryChip, selectedCat === category.id && s.categoryChipActive]}
                  onPress={() => handleCatPress(category.id)}
                  activeOpacity={0.9}
                >
                  <Text style={[s.categoryText, selectedCat === category.id && s.categoryTextActive]}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.resultsText}>{loading ? 'Searching providers...' : `${totalElements} provider${totalElements !== 1 ? 's' : ''} found`}</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={loading ? '…' : '⌕'}
            title={loading ? 'Searching...' : 'No providers found'}
            subtitle="Try adjusting your search or filters."
          />
        }
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={s.pagination}>
              <TouchableOpacity
                style={[s.pageButton, page === 0 && s.pageButtonDisabled]}
                disabled={page === 0}
                onPress={() => setPage(page - 1)}
                activeOpacity={0.9}
              >
                <Text style={[s.pageButtonText, page === 0 && s.pageButtonTextDisabled]}>Prev</Text>
              </TouchableOpacity>
              <Text style={s.pageInfo}>Page {page + 1} of {totalPages}</Text>
              <TouchableOpacity
                style={[s.pageButton, page >= totalPages - 1 && s.pageButtonDisabled]}
                disabled={page >= totalPages - 1}
                onPress={() => setPage(page + 1)}
                activeOpacity={0.9}
              >
                <Text style={[s.pageButtonText, page >= totalPages - 1 && s.pageButtonTextDisabled]}>Next</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.bottomSpacer} />
          )
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space48,
    paddingBottom: spacing.space20,
    borderBottomWidth: spacing.xxs,
    borderBottomColor: colors.surfaceVariant,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space12,
  },
  brandAvatar: {
    width: spacing.space32,
    height: spacing.space32,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandAvatarText: {
    ...typography.captionMedium,
    color: colors.primaryContainer,
  },
  brandText: {
    ...typography.h4,
    color: colors.primary,
  },
  notificationDot: {
    width: spacing.space12,
    height: spacing.space12,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.notification,
  },
  list: {
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space24,
    paddingBottom: spacing.space24,
  },
  hero: {
    marginBottom: spacing.space24,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.onSurface,
  },
  heroSubtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.space12,
    marginBottom: spacing.space24,
  },
  activeTab: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space16,
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  activeTabText: {
    ...typography.button,
    color: colors.onPrimary,
  },
  inactiveTab: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space16,
    backgroundColor: colors.surfaceContainer,
  },
  inactiveTabText: {
    ...typography.button,
    color: colors.onSurface,
  },
  searchShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space12,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space14,
  },
  searchIcon: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  searchInput: {
    flex: 1,
    color: colors.onSurface,
    ...typography.body,
  },
  filterIcon: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  filtersCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    marginTop: spacing.space16,
    ...shadows.sm,
  },
  filterField: {
    marginBottom: spacing.space16,
  },
  filterLabel: {
    ...typography.label,
    color: colors.onSurface,
    marginBottom: spacing.space8,
  },
  filterInput: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space14,
    color: colors.onSurface,
    ...typography.body,
  },
  ratingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space8,
  },
  ratingButton: {
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  ratingButtonActive: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.primary,
  },
  ratingButtonText: {
    ...typography.captionMedium,
    color: colors.onSurfaceVariant,
  },
  ratingButtonTextActive: {
    color: colors.primary,
  },
  applyFiltersButton: {
    marginTop: spacing.space20,
    borderRadius: borderRadius.control,
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.space16,
    alignItems: 'center',
  },
  applyFiltersText: {
    ...typography.button,
    color: colors.onPrimary,
  },
  categories: {
    gap: spacing.space12,
    paddingVertical: spacing.space24,
  },
  categoryChip: {
    borderRadius: borderRadius.pill,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.caption,
    color: colors.onSurface,
  },
  categoryTextActive: {
    color: colors.onPrimary,
  },
  resultsText: {
    ...typography.captionMedium,
    color: colors.secondary,
    marginBottom: spacing.space16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.space8,
    paddingTop: spacing.space8,
  },
  pageButton: {
    borderRadius: borderRadius.control,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  pageButtonDisabled: {
    opacity: 0.45,
  },
  pageButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  pageButtonTextDisabled: {
    color: colors.outline,
  },
  pageInfo: {
    ...typography.caption,
    color: colors.secondary,
  },
  bottomSpacer: {
    height: spacing.navHeight,
  },
});
