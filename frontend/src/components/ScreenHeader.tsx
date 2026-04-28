import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export default function ScreenHeader({ title, subtitle, onBack, rightComponent }: ScreenHeaderProps) {
  return (
    <View style={s.header}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      {onBack && (
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={s.back}>← Back</Text>
        </Pressable>
      )}
      <View style={s.row}>
        <View style={s.titleBlock}>
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightComponent ?? null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: colors.bgPrimary,
    paddingTop: 54,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    ...typography.smallMedium,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleBlock: { flex: 1 },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
