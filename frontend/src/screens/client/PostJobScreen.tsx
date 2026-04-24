import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { providerApi } from '../../api/providers';
import { jobApi } from '../../api/jobs';
import { SkillCategory } from '../../types';
import GradientButton from '../../components/GradientButton';

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
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>Back</Text></Pressable>
      <Text style={s.title}>Post a Job</Text>
      <Text style={s.label}>Job Title</Text>
      <TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="e.g. Build a portfolio website" placeholderTextColor={colors.textMuted} />
      <Text style={s.label}>Category</Text>
      <View style={s.chips}>
        {categories.map((cat) => (
          <Pressable key={cat.id} onPress={() => setCategoryId(cat.id)} style={[s.chip, categoryId === cat.id && s.chipActive]}>
            <Text style={[s.chipText, categoryId === cat.id && s.chipTextActive]}>{cat.name}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={s.label}>Description</Text>
      <TextInput style={[s.input, s.area]} value={description} onChangeText={setDescription} multiline placeholder="Describe what you need..." placeholderTextColor={colors.textMuted} />
      <Text style={s.label}>Budget</Text>
      <TextInput style={s.input} value={budget} onChangeText={setBudget} keyboardType="numeric" placeholder="5000" placeholderTextColor={colors.textMuted} />
      <Text style={s.label}>Location</Text>
      <TextInput style={s.input} value={location} onChangeText={setLocation} placeholder="Optional" placeholderTextColor={colors.textMuted} />
      <Text style={s.label}>Deadline</Text>
      <TextInput style={s.input} value={deadline} onChangeText={setDeadline} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textMuted} />
      <GradientButton title="Post Job" onPress={submit} loading={loading} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: spacing.xxl, paddingTop: 54, paddingBottom: 100 },
  back: { ...typography.button, color: colors.textSecondary, marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  label: { ...typography.smallMedium, color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.xs },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, color: colors.textPrimary, ...typography.body },
  area: { minHeight: 120, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.captionMedium, color: colors.textSecondary },
  chipTextActive: { color: '#fff' },
});
