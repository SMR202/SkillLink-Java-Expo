import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { providerApi } from '../../api/providers';
import { jobApi } from '../../api/jobs';
import { SkillCategory } from '../../types';
import GradientButton from '../../components/GradientButton';
import InputField from '../../components/InputField';

export default function PostJobScreen({ navigation }: any) {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { providerApi.getCategories().then(setCategories).catch(() => {}); }, []);

  const submit = async () => {
    if (!title.trim() || !categoryId || description.length < 20 || Number(budget) <= 0) {
      Alert.alert('Validation', 'Add a title, category, budget, and at least 20 description characters.');
      return;
    }
    setLoading(true);
    try {
      await jobApi.create({ title, categoryId, description, budget: Number(budget), location, deadline });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Could not post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.topBar}>
        <View style={s.brandRow}>
          <Text style={s.brandMark}>▦</Text>
          <Text style={s.brandText}>SkillLink</Text>
        </View>
        <View style={s.avatarDot} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={s.back}>Back</Text>
        </Pressable>

        <Text style={s.title}>Post a Job</Text>
        <Text style={s.subtitle}>Detail your requirements to connect with elite professionals in our network.</Text>

        <View style={s.card}>
          <InputField
            label="Job Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Senior Brand Designer needed for product launch"
          />

          <Text style={s.label}>Category</Text>
          <View style={s.chips}>
            {categories.map((cat) => (
              <Pressable key={cat.id} onPress={() => setCategoryId(cat.id)} style={[s.chip, categoryId === cat.id && s.chipActive]}>
                <Text style={[s.chipText, categoryId === cat.id && s.chipTextActive]}>{cat.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.label}>Description</Text>
          <TextInput
            style={s.area}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Provide a detailed overview of the project scope, required deliverables, and any specific methodologies or tools required..."
            placeholderTextColor={colors.onSurfaceVariant}
            textAlignVertical="top"
          />

          <InputField
            label="Estimated Budget"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            placeholder="$ 0.00"
            containerStyle={s.inlineInput}
          />
        </View>

        <View style={s.card}>
          <InputField
            label="Location (Optional)"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Remote or New York, NY"
          />

          <InputField
            label="Deadline"
            value={deadline}
            onChangeText={setDeadline}
            placeholder="mm/dd/yyyy"
            containerStyle={s.inlineInput}
          />
        </View>

        <GradientButton title="Post Job" onPress={submit} loading={loading} style={s.submitButton} />
        <Text style={s.footnote}>By posting, you agree to our Marketplace Terms of Service.</Text>
      </ScrollView>
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space12,
  },
  brandMark: {
    ...typography.h4,
    color: colors.onSurface,
  },
  brandText: {
    ...typography.h3,
    color: colors.primaryContainer,
  },
  avatarDot: {
    width: spacing.space44,
    height: spacing.space44,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
  },
  content: {
    paddingHorizontal: spacing.space20,
    paddingTop: spacing.space24,
    paddingBottom: spacing.navHeight,
  },
  back: {
    ...typography.label,
    color: colors.secondary,
  },
  title: {
    ...typography.h1,
    color: colors.onSurface,
    marginTop: spacing.space20,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space12,
    marginBottom: spacing.space32,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    marginBottom: spacing.space24,
    ...shadows.sm,
  },
  label: {
    ...typography.label,
    color: colors.onSurface,
    marginBottom: spacing.space8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space8,
  },
  chip: {
    borderRadius: borderRadius.pill,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.captionMedium,
    color: colors.onSurfaceVariant,
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
  area: {
    minHeight: spacing.space80 + spacing.space80,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    padding: spacing.space20,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  inlineInput: {
    marginBottom: 0,
    marginTop: spacing.space20,
  },
  submitButton: {
    width: '100%',
    marginTop: spacing.space8,
  },
  footnote: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space20,
  },
});
