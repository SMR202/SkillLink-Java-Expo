import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { authApi } from '../../api/auth';
import GradientButton from '../../components/GradientButton';
import InputField from '../../components/InputField';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) { Alert.alert('Error', 'Please enter your email.'); return; }
    setLoading(true);
    try { await authApi.forgotPassword(email); setSent(true); }
    catch (err: any) { Alert.alert('Error', err.response?.data?.message || 'Failed.'); }
    finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.brandRow}>
          <Text style={s.brandMark}>▦</Text>
          <Text style={s.brandText}>SkillLink</Text>
        </View>

        <View style={s.card}>
          <View style={s.cardTopBorder} />

          {sent ? (
            <View style={s.centeredState}>
              <View style={s.successHalo}>
                <View style={s.successCore}>
                  <Text style={s.successIcon}>✓</Text>
                </View>
              </View>
              <Text style={s.title}>Check your email</Text>
              <Text style={s.description}>
                We&apos;ve sent reset instructions to your email address. Please check your inbox and spam folder.
              </Text>

              <View style={s.infoPanel}>
                <Text style={s.infoIcon}>i</Text>
                <Text style={s.infoText}>
                  Didn&apos;t receive the email? It might take a few minutes. You can request a new link if it doesn&apos;t arrive.
                </Text>
              </View>

              <GradientButton onPress={handleSubmit} title="Resend Email" loading={loading} style={s.fullButton} variant="outline" />

              <TouchableOpacity onPress={() => navigation.goBack()} style={s.bottomLink} activeOpacity={0.85}>
                <Text style={s.bottomLinkText}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={s.centeredState}>
                <View style={s.iconCircle}>
                  <Text style={s.iconText}>⌁</Text>
                </View>
                <Text style={s.title}>Forgot Password</Text>
                <Text style={s.description}>
                  Enter your email address and we&apos;ll send you a link to securely reset your password.
                </Text>
              </View>

              <InputField
                label="Email Address"
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <GradientButton onPress={handleSubmit} title="Send Reset Link" loading={loading} style={s.fullButton} />

              <View style={s.divider} />

              <TouchableOpacity onPress={() => navigation.goBack()} style={s.backToLogin} activeOpacity={0.85}>
                <Text style={s.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
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
    flexGrow: 1,
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space48,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space8,
    marginBottom: spacing.space32,
  },
  brandMark: {
    ...typography.h4,
    color: colors.primary,
  },
  brandText: {
    ...typography.h3,
    color: colors.primary,
  },
  card: {
    width: '100%',
    maxWidth: spacing.space96 * 4 + spacing.space56,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xxl,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space32,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: spacing.space4,
    backgroundColor: colors.primaryContainer,
  },
  centeredState: {
    alignItems: 'center',
    marginBottom: spacing.space24,
  },
  iconCircle: {
    width: spacing.space64,
    height: spacing.space64,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space20,
  },
  iconText: {
    ...typography.h4,
    color: colors.primary,
  },
  successHalo: {
    width: spacing.space80,
    height: spacing.space80,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space20,
  },
  successCore: {
    width: spacing.space56,
    height: spacing.space56,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primaryFixedDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    ...typography.h4,
    color: colors.primary,
  },
  title: {
    ...typography.h2,
    color: colors.onSurface,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space12,
    marginBottom: spacing.space8,
  },
  fullButton: {
    width: '100%',
    marginTop: spacing.space16,
  },
  divider: {
    height: spacing.xxs,
    backgroundColor: colors.surfaceVariant,
    marginTop: spacing.space32,
    marginBottom: spacing.space24,
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    ...typography.label,
    color: colors.secondary,
  },
  infoPanel: {
    flexDirection: 'row',
    gap: spacing.space12,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.control,
    padding: spacing.space16,
    marginTop: spacing.space16,
    marginBottom: spacing.space24,
  },
  infoIcon: {
    ...typography.captionMedium,
    color: colors.outline,
  },
  infoText: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  bottomLink: {
    marginTop: spacing.space20,
  },
  bottomLinkText: {
    ...typography.label,
    color: colors.primary,
  },
});
