import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';

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
  const content = loading ? 'Loading...' : title;

  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [s.outlineButton, style, pressed && s.pressed, isDisabled && s.disabled]}
      >
        <Text style={[s.outlineText, textStyle]}>{content}</Text>
      </Pressable>
    );
  }

  const gradientColors = variant === 'accent' ? colors.gradientSuccess : colors.gradientPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [style, pressed && s.pressed, isDisabled && s.disabled]}
    >
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.gradientButton}>
        <Text style={[s.primaryText, textStyle]}>{content}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const s = StyleSheet.create({
  gradientButton: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space16,
    ...shadows.lg,
  },
  outlineButton: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space16,
    borderWidth: spacing.xxs,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerLowest,
  },
  primaryText: {
    ...typography.button,
    color: colors.onPrimary,
  },
  outlineText: {
    ...typography.button,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
});
