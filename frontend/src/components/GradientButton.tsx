import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, borderRadius } from '../theme';

interface GradientButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'accent' | 'outline';
}

export default function GradientButton({
  onPress,
  title,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
}: GradientButtonProps) {
  const isDisabled = disabled || loading;
  const btnStyle = variant === 'outline' ? styles.outline : variant === 'accent' ? styles.accent : styles.primary;
  const txtStyle = variant === 'outline' ? styles.outlineText : styles.primaryText;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        btnStyle,
        style,
        { opacity: pressed ? 0.85 : isDisabled ? 0.4 : 1 },
      ]}
    >
      <Text style={[txtStyle, textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  accent: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  primaryText: {
    ...typography.button,
    color: '#FFFFFF',
  },
  outlineText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
