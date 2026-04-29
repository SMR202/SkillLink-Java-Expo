import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({ title, onPress, loading = false, disabled = false, style }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[s.button, isDisabled && s.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.9}
    >
      {loading ? <ActivityIndicator size="small" color={colors.onPrimary} /> : <Text style={s.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space16,
    ...shadows.lg,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  text: {
    ...typography.button,
    color: colors.onPrimary,
  },
});
