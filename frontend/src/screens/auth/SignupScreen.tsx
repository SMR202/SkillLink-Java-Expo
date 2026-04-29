import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Modal,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import GradientButton from '../../components/GradientButton';
import InputField from '../../components/InputField';
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.header}>
            <Text style={s.brand}>SkillLink</Text>
            <Text style={s.title}>Create an account</Text>
            <Text style={s.subtitle}>Join the premium network of professionals.</Text>
          </View>

          <View style={s.card}>
            <View style={s.cardTopBorder} />

            <View style={s.roleSwitcher}>
              <TouchableOpacity
                style={[s.rolePill, role !== 'PROVIDER' && s.rolePillActive]}
                onPress={() => step === 'role' && setRole('CLIENT')}
                activeOpacity={0.9}
              >
                <Text style={[s.rolePillText, role !== 'PROVIDER' && s.rolePillTextActive]}>Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.rolePill, role === 'PROVIDER' && s.rolePillActive]}
                onPress={() => step === 'role' && setRole('PROVIDER')}
                activeOpacity={0.9}
              >
                <Text style={[s.rolePillText, role === 'PROVIDER' && s.rolePillTextActive]}>Provider</Text>
              </TouchableOpacity>
            </View>

            {step === 'info' ? (
              <View>
                <InputField label="Full Name" placeholder="Jane Doe" value={fullName} onChangeText={setFullName} />

                <InputField
                  label="Email Address"
                  placeholder="jane@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onEndEditing={() => {
                    if (email && !isValidEmail(email)) showEmailFormatAlert();
                  }}
                />

                <InputField
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onEndEditing={() => {
                    if (password && !isStrongPassword(password)) showPasswordFormatAlert();
                  }}
                />

                <InputField
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />

                <Text style={s.termsText}>
                  By creating an account, you agree to our <Text style={s.termsLink}>Terms of Service</Text> and <Text style={s.termsLink}>Privacy Policy</Text>.
                </Text>

                <GradientButton onPress={handleNext} title="Continue" style={s.submitButton} />
              </View>
            ) : (
              <View>
                <Text style={s.stepTitle}>Choose your role</Text>
                <Text style={s.stepBody}>Select how you&apos;ll use SkillLink. You can update your profile details later.</Text>

                <TouchableOpacity
                  style={[s.roleCard, role === 'CLIENT' && s.roleCardActive]}
                  onPress={() => setRole('CLIENT')}
                  activeOpacity={0.92}
                >
                  <Text style={s.roleCardTitle}>I need a service</Text>
                  <Text style={s.roleCardBody}>Find and hire skilled professionals.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.roleCard, role === 'PROVIDER' && s.roleCardActive]}
                  onPress={() => setRole('PROVIDER')}
                  activeOpacity={0.92}
                >
                  <Text style={s.roleCardTitle}>I offer services</Text>
                  <Text style={s.roleCardBody}>Get discovered by clients near you.</Text>
                </TouchableOpacity>

                <View style={s.actionRow}>
                  <TouchableOpacity onPress={() => setStep('info')} style={s.backButton} activeOpacity={0.85}>
                    <Text style={s.backButtonText}>Back</Text>
                  </TouchableOpacity>
                  <GradientButton onPress={handleSignup} title="Create Account" loading={loading} style={s.actionPrimary} />
                </View>
              </View>
            )}
          </View>

          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <Text style={s.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={popup !== null} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{popup?.title}</Text>
            <Text style={s.modalText}>{popup?.message}</Text>
            <GradientButton onPress={closePopup} title="OK" style={s.modalButton} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space48,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.space32,
  },
  brand: {
    ...typography.h3,
    color: colors.primaryContainer,
    textAlign: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.onSurface,
    textAlign: 'center',
    marginTop: spacing.space12,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space12,
  },
  card: {
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
  roleSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.pill,
    padding: spacing.space4,
    marginBottom: spacing.space24,
  },
  rolePill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.space16,
    paddingHorizontal: spacing.space16,
  },
  rolePillActive: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  rolePillText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
  },
  rolePillTextActive: {
    color: colors.primaryContainer,
  },
  termsText: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space8,
    marginBottom: spacing.space20,
  },
  termsLink: {
    color: colors.primaryContainer,
  },
  submitButton: {
    width: '100%',
  },
  stepTitle: {
    ...typography.h3,
    color: colors.onSurface,
  },
  stepBody: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
    marginBottom: spacing.space24,
  },
  roleCard: {
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.space24,
    marginBottom: spacing.space16,
  },
  roleCardActive: {
    borderColor: colors.primaryContainer,
    backgroundColor: colors.surfaceContainerLow,
  },
  roleCardTitle: {
    ...typography.h4,
    color: colors.onSurface,
  },
  roleCardBody: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space12,
    marginTop: spacing.space8,
  },
  backButton: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    paddingHorizontal: spacing.space20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  backButtonText: {
    ...typography.button,
    color: colors.secondary,
  },
  actionPrimary: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.space8,
    marginTop: spacing.space40,
  },
  footerText: {
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  footerLink: {
    ...typography.label,
    color: colors.primaryContainer,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space24,
  },
  modalCard: {
    width: '100%',
    maxWidth: spacing.space96 * 4 + spacing.space32,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    ...shadows.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.onSurface,
  },
  modalText: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space12,
  },
  modalButton: {
    marginTop: spacing.space24,
    width: '100%',
  },
});
