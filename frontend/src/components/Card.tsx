import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export default function Card({ children, onPress, style, padding = spacing.space24 }: CardProps) {
  const containerStyle = [s.card, { padding }, style];

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} activeOpacity={0.92} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    marginBottom: spacing.space16,
    ...shadows.sm,
  },
});
