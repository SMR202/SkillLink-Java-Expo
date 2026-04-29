import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
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
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>← Back to Search</Text></Pressable>
      <Text style={s.title}>{job.title}</Text>
      <Text style={s.meta}>Posted 2 hours ago</Text>
      <Text style={s.meta}>Est. Budget: ${Number(job.budget || 0).toLocaleString()}</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Job Description</Text>
        <Text style={s.body}>{job.description}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Submit a Proposal</Text>
        <Text style={s.body}>Detail your approach and pricing to win this project.</Text>

        <View style={s.row}>
          <View style={s.half}>
            <Text style={s.label}>Your Price (USD)</Text>
            <TextInput style={s.input} value={proposedPrice} onChangeText={setProposedPrice} keyboardType="numeric" placeholder="$ 0.00" placeholderTextColor={colors.outline} />
          </View>
          <View style={s.half}>
            <Text style={s.label}>Est. Delivery</Text>
            <TextInput style={s.input} value={estimatedDeliveryTime} onChangeText={setEstimatedDeliveryTime} placeholder="Less than 1 week" placeholderTextColor={colors.outline} />
          </View>
        </View>

        <Text style={s.label}>Cover Message</Text>
        <TextInput
          style={s.area}
          value={coverMessage}
          onChangeText={setCoverMessage}
          multiline
          placeholder="Introduce yourself and explain why you're a strong candidate for this job."
          placeholderTextColor={colors.outline}
        />

        <View style={s.uploadBox}>
          <Text style={s.uploadTitle}>Attachments (Optional)</Text>
          <Text style={s.uploadBody}>Upload a file or drag and drop PDF, DOC, DOCX up to 10MB.</Text>
        </View>

        <GradientButton title="Send Proposal" onPress={submit} loading={loading} style={s.button} />
        <Text style={s.footnote}>By submitting, you agree to the Provider Agreement.</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.space20,
    paddingTop: spacing.space48,
    paddingBottom: spacing.navHeight,
  },
  back: {
    ...typography.label,
    color: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.onSurface,
    marginTop: spacing.space16,
  },
  meta: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    marginTop: spacing.space24,
    ...shadows.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.onSurface,
    marginBottom: spacing.space12,
  },
  body: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.space12,
    marginTop: spacing.space20,
  },
  half: {
    flex: 1,
  },
  label: {
    ...typography.label,
    color: colors.onSurface,
    marginTop: spacing.space20,
    marginBottom: spacing.space8,
  },
  input: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space14,
    ...typography.body,
    color: colors.onSurface,
  },
  area: {
    minHeight: spacing.space80 + spacing.space48,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.space16,
    ...typography.body,
    color: colors.onSurface,
    textAlignVertical: 'top',
  },
  uploadBox: {
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    borderStyle: 'dashed',
    padding: spacing.space24,
    marginTop: spacing.space20,
    alignItems: 'center',
  },
  uploadTitle: {
    ...typography.label,
    color: colors.primary,
  },
  uploadBody: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: spacing.space24,
  },
  footnote: {
    ...typography.caption,
    color: colors.outline,
    textAlign: 'center',
    marginTop: spacing.space12,
  },
});
