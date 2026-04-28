import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Modal,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import GradientButton from '../../components/GradientButton';
import { User } from '../../types';

type Step = 'info' | 'role';

const isStrongPassword = (value: string) =>
  value.length >= 8 && /\d/.test(value) && /[!@#$%^&*]/.test(value);

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const passwordFormatMessage =
  'Password must be at least 8 characters and include 1 number and 1 special character.';
const emailFormatMessage = 'Please enter a valid email address, like name@example.com.';

type PopupState = {
  title: string;
  message: string;
  onClose?: () => void;
};

export default function SignupScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('info');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'PROVIDER' | null>(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const setUser = useAuthStore((s) => s.setUser);

  const showPopup = (title: string, message: string, onClose?: () => void) => {
    setPopup({ title, message, onClose });
  };

  const closePopup = () => {
    const onClose = popup?.onClose;
    setPopup(null);
    onClose?.();
  };

  const showPasswordFormatAlert = () => showPopup('Invalid Password', passwordFormatMessage);
  const showEmailFormatAlert = () => showPopup('Invalid Email', emailFormatMessage);

  const handleNext = () => {
    if (!fullName || !email || !password || !confirmPassword) { showPopup('Missing Information', 'Please fill in all fields.'); return; }
    if (!isValidEmail(email)) { showEmailFormatAlert(); return; }
    if (!isStrongPassword(password)) { showPasswordFormatAlert(); return; }
    if (password !== confirmPassword) { showPopup('Password Mismatch', 'Passwords do not match.'); return; }
    setStep('role');
  };

  const handleSignup = async () => {
    if (!role) { showPopup('Select a Role', 'Please choose whether you need a service or offer services.'); return; }
    if (!fullName || !email || !password || !confirmPassword) { showPopup('Missing Information', 'Please fill in all fields.'); setStep('info'); return; }
    if (!isValidEmail(email)) { showEmailFormatAlert(); setStep('info'); return; }
    if (!isStrongPassword(password)) { showPasswordFormatAlert(); setStep('info'); return; }
    if (password !== confirmPassword) { showPopup('Password Mismatch', 'Passwords do not match.'); setStep('info'); return; }
    setLoading(true);
    try {
      const result = await authApi.signup({ fullName, email, password, role });
      showPopup('Account Created', 'Your account has been created successfully.', () => setUser(result.user as User));
    } catch (err: any) {
      const validationErrors = err.response?.data?.data;
      const firstValidationError = validationErrors && typeof validationErrors === 'object'
        ? Object.values(validationErrors)[0]
        : null;
      showPopup('Signup Failed', String(firstValidationError || err.response?.data?.message || 'Signup failed.'));
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
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
                onEndEditing={() => {
                  if (email && !isValidEmail(email)) showEmailFormatAlert();
                }} />

              <Text style={s.label}>Password</Text>
              <TextInput style={s.input} placeholder="Min 8 chars, 1 number, 1 special" placeholderTextColor={colors.textMuted}
                value={password} onChangeText={setPassword} secureTextEntry
                onEndEditing={() => {
                  if (password && !isStrongPassword(password)) showPasswordFormatAlert();
                }} />

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
                  <GradientButton onPress={handleSignup} title="Create Account" loading={loading} />
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()} style={s.loginLink}>
            <Text style={s.loginText}>Already have an account? <Text style={s.loginBold}>Sign In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={popup !== null} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{popup?.title}</Text>
            <Text style={s.modalText}>{popup?.message}</Text>
            <TouchableOpacity
              style={s.modalButton}
              onPress={closePopup}
              activeOpacity={0.8}
            >
              <Text style={s.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  modalText: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: { ...typography.button, color: colors.textInverse },
});
