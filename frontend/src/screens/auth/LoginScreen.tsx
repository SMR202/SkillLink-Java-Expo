import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import GradientButton from '../../components/GradientButton';
import InputField from '../../components/InputField';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      setUser(result.user);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.header}>
            <Text style={s.brand}>SkillLink</Text>
            <Text style={s.subtitle}>Welcome back. Please enter your details.</Text>
          </View>

          <View style={s.formCard}>
            <View style={s.formTopBorder} />

            <InputField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={s.passwordHeader}>
              <Text style={s.passwordLabel}>Password</Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.85}>
                <Text style={s.showPassword}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <InputField
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              containerStyle={s.passwordField}
            />

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={s.forgotLink} activeOpacity={0.85}>
              <Text style={s.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <GradientButton onPress={handleLogin} title="Log In" loading={loading} style={s.primaryButton} />
          </View>

          <View style={s.footer}>
            <Text style={s.footerText}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.85}>
              <Text style={s.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: spacing.space80,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.space48,
  },
  brand: {
    ...typography.h2,
    color: colors.primaryContainer,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space8,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xxl,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space32,
    ...shadows.sm,
  },
  formTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: spacing.space4,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    backgroundColor: colors.inversePrimary,
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space8,
  },
  passwordLabel: {
    ...typography.label,
    color: colors.onSurface,
  },
  showPassword: {
    ...typography.caption,
    color: colors.primary,
  },
  passwordField: {
    marginBottom: spacing.space8,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.space24,
  },
  forgotText: {
    ...typography.body,
    color: colors.secondary,
  },
  primaryButton: {
    width: '100%',
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
});
