import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color={colors.primaryContainer} />
      {message ? <Text style={s.message}>{message}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space24,
    backgroundColor: colors.background,
  },
  message: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space12,
    textAlign: 'center',
  },
});
