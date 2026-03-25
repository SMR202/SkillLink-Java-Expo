import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { providerApi } from '../../api/providers';
import { SkillCategory } from '../../types';
import GradientButton from '../../components/GradientButton';

export default function ProfileEditScreen() {
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [links, setLinks] = useState<string[]>(['']);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [cats, profile] = await Promise.all([providerApi.getCategories(), providerApi.getMyProfile()]);
      setCategories(cats);
      if (profile) {
        setBio(profile.bio || '');
        setCity(profile.city || '');
        setPhone(profile.phoneNumber || '');
        setSelectedSkills((profile.skills || []).map((s: any) => s.id));
        setLinks(profile.portfolioLinks?.length ? profile.portfolioLinks : ['']);
      }
    } catch {}
  };

  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 5 ? [...prev, id] : prev);
  };

  const handleSave = async () => {
    if (bio.length < 50) { Alert.alert('Error', 'Bio must be at least 50 characters.'); return; }
    if (selectedSkills.length === 0) { Alert.alert('Error', 'Select at least 1 skill.'); return; }
    setLoading(true);
    try {
      await providerApi.updateProfile({ bio, city, phoneNumber: phone, skillIds: selectedSkills, portfolioLinks: links.filter(l => l.trim()) });
      Alert.alert('Success', 'Profile updated!');
    } catch (e: any) { Alert.alert('Error', e.response?.data?.message || 'Failed.'); }
    setLoading(false);
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Edit Profile</Text>

        <Text style={s.label}>Bio</Text>
        <TextInput style={[s.input, { minHeight: 100 }]} placeholder="Tell clients about yourself (min 50 characters)..."
          placeholderTextColor={colors.textMuted} value={bio} onChangeText={setBio} multiline textAlignVertical="top" />
        <Text style={[s.charCount, bio.length >= 50 && { color: colors.accent }]}>{bio.length}/50 min</Text>

        <Text style={s.label}>Skills (max 5)</Text>
        <View style={s.chips}>
          {categories.map(c => (
            <TouchableOpacity key={c.id} style={[s.chip, selectedSkills.includes(c.id) && s.chipActive]}
              onPress={() => toggleSkill(c.id)}>
              <Text style={[s.chipText, selectedSkills.includes(c.id) && s.chipTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>City</Text>
        <TextInput style={s.input} placeholder="e.g. Islamabad" placeholderTextColor={colors.textMuted}
          value={city} onChangeText={setCity} />

        <Text style={s.label}>Phone</Text>
        <TextInput style={s.input} placeholder="03001234567" placeholderTextColor={colors.textMuted}
          value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={s.label}>Portfolio Links</Text>
        {links.map((l, i) => (
          <TextInput key={i} style={[s.input, { marginBottom: spacing.sm }]} placeholder="https://..."
            placeholderTextColor={colors.textMuted} value={l}
            onChangeText={t => { const n = [...links]; n[i] = t; setLinks(n); }} />
        ))}
        <TouchableOpacity onPress={() => setLinks([...links, ''])}>
          <Text style={s.addLink}>+ Add link</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xxl }} />
        <GradientButton onPress={handleSave} title={loading ? 'Saving...' : 'Save Profile'} loading={loading} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.xxl, paddingTop: 54, paddingBottom: 100 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xxl },
  label: { ...typography.smallMedium, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.lg },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: 14, color: colors.textPrimary, ...typography.body, borderWidth: 1, borderColor: colors.border },
  charCount: { ...typography.caption, color: colors.textMuted, textAlign: 'right', marginTop: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.smallMedium, color: colors.textMuted },
  chipTextActive: { color: colors.textInverse },
  addLink: { ...typography.smallMedium, color: colors.accent, marginTop: spacing.sm },
});
