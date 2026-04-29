import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../theme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function InputField({ label, error, containerStyle, ...props }: InputFieldProps) {
  return (
    <View style={[s.container, containerStyle]}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput
        style={[s.input, !!error && s.inputError, props.style]}
        placeholderTextColor={colors.outline}
        {...props}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: spacing.space20,
  },
  label: {
    ...typography.label,
    color: colors.onSurface,
    marginBottom: spacing.space8,
  },
  input: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space14,
    color: colors.onSurface,
    ...typography.body,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.space8,
  },
});
