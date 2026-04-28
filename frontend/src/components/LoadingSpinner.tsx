import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={s.message}>{message}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  message: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
