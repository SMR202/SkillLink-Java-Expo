import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export default function ScreenHeader({ title, subtitle, onBack, rightComponent }: ScreenHeaderProps) {
  return (
    <View style={s.header}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={spacing.space12} style={s.backButton}>
          <Text style={s.backText}>Back</Text>
        </Pressable>
      ) : null}
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
    backgroundColor: colors.surfaceContainerLowest,
    paddingTop: spacing.space56,
    paddingHorizontal: spacing.space24,
    paddingBottom: spacing.space20,
    borderBottomWidth: spacing.xxs,
    borderBottomColor: colors.surfaceVariant,
  },
  backButton: {
    marginBottom: spacing.space8,
  },
  backText: {
    ...typography.label,
    color: colors.secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.space16,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space4,
  },
});
