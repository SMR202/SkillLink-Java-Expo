import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { jobApi } from '../../api/jobs';
import GradientButton from '../../components/GradientButton';

export default function SubmitProposalScreen({ route, navigation }: any) {
  const { job } = route.params;
  const [coverMessage, setCoverMessage] = useState('');
  const [proposedPrice, setProposedPrice] = useState(String(job.budget || ''));
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (coverMessage.length < 20 || Number(proposedPrice) <= 0 || !estimatedDeliveryTime.trim()) {
      Alert.alert('Validation', 'Add a cover message, price, and delivery estimate.');
      return;
    }
    setLoading(true);
    try {
      await jobApi.submitProposal(job.id, { coverMessage, proposedPrice: Number(proposedPrice), estimatedDeliveryTime });
      Alert.alert('Proposal sent', 'The client can now review your proposal.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Could not send proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>Back</Text></Pressable>
      <Text style={s.title}>Submit Proposal</Text>
      <Text style={s.jobTitle}>{job.title}</Text>
      <Text style={s.label}>Cover Message</Text>
      <TextInput style={[s.input, s.area]} value={coverMessage} onChangeText={setCoverMessage} multiline placeholder="Tell the client how you can help..." placeholderTextColor={colors.textMuted} />
      <Text style={s.label}>Proposed Price</Text>
      <TextInput style={s.input} value={proposedPrice} onChangeText={setProposedPrice} keyboardType="numeric" placeholder="5000" placeholderTextColor={colors.textMuted} />
      <Text style={s.label}>Estimated Delivery Time</Text>
      <TextInput style={s.input} value={estimatedDeliveryTime} onChangeText={setEstimatedDeliveryTime} placeholder="e.g. 5 days" placeholderTextColor={colors.textMuted} />
      <GradientButton title="Send Proposal" onPress={submit} loading={loading} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: spacing.xxl, paddingTop: 54, paddingBottom: 100 },
  back: { ...typography.button, color: colors.textSecondary, marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  jobTitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
  label: { ...typography.smallMedium, color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.xs },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, color: colors.textPrimary, ...typography.body },
  area: { minHeight: 140, textAlignVertical: 'top' },
});
