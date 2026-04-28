import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, typography } from '../theme';

interface DangerButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function DangerButton({ title, onPress, loading = false, disabled = false, style }: DangerButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[s.btn, isDisabled && s.btnDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <Text style={s.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  btnDisabled: { opacity: 0.5 },
  text: { ...typography.button, color: '#FFFFFF' },
});
