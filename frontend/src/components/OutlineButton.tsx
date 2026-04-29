import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../theme';

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
      style={[s.button, isDisabled && s.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.9}
    >
      {loading ? <ActivityIndicator size="small" color={colors.primaryContainer} /> : <Text style={s.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: spacing.xxs,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space16,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  text: {
    ...typography.button,
    color: colors.primary,
  },
});
