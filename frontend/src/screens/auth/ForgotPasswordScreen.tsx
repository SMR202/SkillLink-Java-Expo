import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { authApi } from '../../api/auth';
import GradientButton from '../../components/GradientButton';

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
      <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
        <Text style={s.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={s.card}>
        {sent ? (
          <View style={s.sentBox}>
            <Text style={{ fontSize: 40 }}>📧</Text>
            <Text style={s.sentTitle}>Check your email</Text>
            <Text style={s.sentDesc}>We've sent a password reset link to {email}</Text>
            <GradientButton onPress={() => navigation.goBack()} title="Back to Login" style={{ marginTop: spacing.xl }} />
          </View>
        ) : (
          <>
            <Text style={s.title}>Reset Password</Text>
            <Text style={s.desc}>Enter your email and we'll send you a reset link.</Text>
            <Text style={s.label}>Email</Text>
            <TextInput style={s.input} placeholder="you@email.com" placeholderTextColor={colors.textMuted}
              value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <View style={{ height: spacing.lg }} />
            <GradientButton onPress={handleSubmit} title="Send Reset Link" loading={loading} />
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary, paddingHorizontal: spacing.xxl, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 50, left: spacing.xxl, zIndex: 10 },
  backText: { ...typography.button, color: colors.textSecondary },
  card: {},
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm },
  desc: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  label: { ...typography.smallMedium, color: colors.textSecondary, marginBottom: spacing.xs },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: 14, color: colors.textPrimary, ...typography.body, borderWidth: 1, borderColor: colors.border },
  sentBox: { alignItems: 'center' },
  sentTitle: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.lg },
  sentDesc: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
});
