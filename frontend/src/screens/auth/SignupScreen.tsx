import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import GradientButton from '../../components/GradientButton';

type Step = 'info' | 'role';

const isStrongPassword = (value: string) =>
  value.length >= 8 && /\d/.test(value) && /[!@#$%^&*]/.test(value);

export default function SignupScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('info');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'PROVIDER' | null>(null);
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const handleNext = () => {
    if (!fullName || !email || !password) { Alert.alert('Error', 'Please fill in all fields.'); return; }
    if (!isStrongPassword(password)) { Alert.alert('Error', 'Password must be at least 8 characters and include 1 number and 1 special character.'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match.'); return; }
    setStep('role');
  };

  const handleSignup = async () => {
    if (!role) { Alert.alert('Error', 'Please select a role.'); return; }
    setLoading(true);
    try {
      const result = await authApi.signup({ fullName, email, password, role });
      setUser(result.user);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Signup failed.');
    } finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Create Account</Text>
            <Text style={s.subtitle}>
              {step === 'info' ? 'Enter your details to get started' : 'How will you use SkillLink?'}
            </Text>
            <View style={s.stepRow}>
              <View style={[s.stepDot, s.stepActive]} />
              <View style={[s.stepLine, step === 'role' && s.stepLineActive]} />
              <View style={[s.stepDot, step === 'role' && s.stepActive]} />
            </View>
          </View>

          {step === 'info' ? (
            <View style={s.form}>
              <Text style={s.label}>Full Name</Text>
              <TextInput style={s.input} placeholder="John Doe" placeholderTextColor={colors.textMuted}
                value={fullName} onChangeText={setFullName} />

              <Text style={s.label}>Email</Text>
              <TextInput style={s.input} placeholder="you@email.com" placeholderTextColor={colors.textMuted}
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

              <Text style={s.label}>Password</Text>
              <TextInput style={s.input} placeholder="Min 8 chars, 1 number, 1 special" placeholderTextColor={colors.textMuted}
                value={password} onChangeText={setPassword} secureTextEntry />

              <Text style={s.label}>Confirm Password</Text>
              <TextInput style={s.input} placeholder="Re-enter password" placeholderTextColor={colors.textMuted}
                value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

              <View style={{ height: spacing.lg }} />
              <GradientButton onPress={handleNext} title="Continue" />
            </View>
          ) : (
            <View style={s.form}>
              <TouchableOpacity
                style={[s.roleCard, role === 'CLIENT' && s.roleCardActive]}
                onPress={() => setRole('CLIENT')} activeOpacity={0.7}
              >
                <Text style={s.roleIcon}>🔍</Text>
                <View style={s.roleInfo}>
                  <Text style={s.roleTitle}>I need a service</Text>
                  <Text style={s.roleDesc}>Find and hire skilled professionals</Text>
                </View>
                {role === 'CLIENT' && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.roleCard, role === 'PROVIDER' && s.roleCardActive]}
                onPress={() => setRole('PROVIDER')} activeOpacity={0.7}
              >
                <Text style={s.roleIcon}>🛠️</Text>
                <View style={s.roleInfo}>
                  <Text style={s.roleTitle}>I offer services</Text>
                  <Text style={s.roleDesc}>Get discovered by clients near you</Text>
                </View>
                {role === 'PROVIDER' && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>

              <View style={s.btnRow}>
                <TouchableOpacity onPress={() => setStep('info')} style={s.backBtn}>
                  <Text style={s.backText}>← Back</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <GradientButton onPress={handleSignup} title="Create Account" loading={loading} disabled={!role} />
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()} style={s.loginLink}>
            <Text style={s.loginText}>Already have an account? <Text style={s.loginBold}>Sign In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge },
  header: { alignItems: 'center', marginBottom: spacing.xxxl },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  stepActive: { backgroundColor: colors.primary },
  stepLine: { width: 40, height: 2, backgroundColor: colors.border, marginHorizontal: spacing.sm },
  stepLineActive: { backgroundColor: colors.primary },
  form: {},
  label: { ...typography.smallMedium, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.lg },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: 14, color: colors.textPrimary, ...typography.body, borderWidth: 1, borderColor: colors.border },
  roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.border },
  roleCardActive: { borderColor: colors.primary, backgroundColor: '#F9FAFB' },
  roleIcon: { fontSize: 28, marginRight: spacing.lg },
  roleInfo: { flex: 1 },
  roleTitle: { ...typography.h4, color: colors.textPrimary },
  roleDesc: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  check: { fontSize: 18, fontWeight: '700', color: colors.primary },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg },
  backBtn: { paddingVertical: 16, paddingHorizontal: spacing.lg },
  backText: { ...typography.button, color: colors.textSecondary },
  loginLink: { alignItems: 'center', marginTop: spacing.xxl },
  loginText: { ...typography.body, color: colors.textSecondary },
  loginBold: { color: colors.textPrimary, fontWeight: '600' },
});
