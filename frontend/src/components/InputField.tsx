import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors, borderRadius, typography, spacing } from '../theme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function InputField({ label, error, containerStyle, ...props }: InputFieldProps) {
  return (
    <View style={[s.container, containerStyle]}>
      {label && <Text style={s.label}>{label}</Text>}
      <TextInput
        style={[s.input, !!error && s.inputError, props.style]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    color: colors.textPrimary,
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 50,
  },
  inputError: { borderColor: colors.error },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
