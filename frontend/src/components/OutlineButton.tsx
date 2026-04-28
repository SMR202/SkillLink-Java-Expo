import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, typography } from '../theme';

interface OutlineButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function OutlineButton({ title, onPress, loading = false, disabled = false, style }: OutlineButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[s.btn, isDisabled && s.btnDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={s.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 50,
  },
  btnDisabled: { opacity: 0.5 },
  text: { ...typography.button, color: colors.textPrimary },
});
