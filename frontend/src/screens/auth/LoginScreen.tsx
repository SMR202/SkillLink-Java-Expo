import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import GradientButton from '../../components/GradientButton';

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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={s.logoArea}>
            <View style={s.logoCircle}>
              <Text style={s.logoText}>S</Text>
            </View>
            <Text style={s.brand}>SkillLink</Text>
            <Text style={s.tagline}>Find skilled professionals near you</Text>
          </View>

          {/* Form */}
          <View style={s.form}>
            <Text style={s.heading}>Welcome back</Text>

            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              placeholder="you@email.com"
              placeholderTextColor={colors.textMuted}
              value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none"
            />

            <Text style={s.label}>Password</Text>
            <View style={s.passwordRow}>
              <TextInput
                style={[s.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password} onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                <Text style={s.eye}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={s.forgotRow}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <GradientButton onPress={handleLogin} title="Sign In" loading={loading} />

            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>or</Text>
              <View style={s.dividerLine} />
            </View>

            <GradientButton onPress={() => navigation.navigate('Signup')} title="Create an Account" variant="outline" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge },
  logoArea: { alignItems: 'center', marginBottom: spacing.xxxl },
  logoCircle: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  logoText: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  brand: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.xs },
  tagline: { ...typography.small, color: colors.textSecondary, marginTop: spacing.xs },
  form: {},
  heading: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xxl },
  label: { ...typography.smallMedium, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.lg },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: 14, color: colors.textPrimary, ...typography.body, borderWidth: 1, borderColor: colors.border },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  eyeBtn: { padding: spacing.md },
  eye: { fontSize: 18 },
  forgotRow: { alignSelf: 'flex-end', marginVertical: spacing.md },
  forgotText: { ...typography.small, color: colors.textSecondary },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { ...typography.small, color: colors.textMuted, marginHorizontal: spacing.lg },
});
