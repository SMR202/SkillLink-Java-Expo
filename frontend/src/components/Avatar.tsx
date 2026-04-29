import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

interface AvatarProps {
  name?: string;
  uri?: string | null;
  size?: number;
  bgColor?: string;
}

const avatarPalette = [
  colors.primaryContainer,
  colors.secondary,
  colors.tertiary,
  colors.primary,
  colors.onSecondaryContainer,
];

function colorFor(name?: string) {
  if (!name) return colors.primaryContainer;
  const index = name.charCodeAt(0) % avatarPalette.length;
  return avatarPalette[index];
}

export default function Avatar({ name, uri, size = 44, bgColor }: AvatarProps) {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  const backgroundColor = bgColor || colorFor(name);
  const radius = size / 2;
  const fontSize = size * 0.38;

  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius }} resizeMode="cover" />;
  }

  return (
    <View style={[s.circle, { width: size, height: size, borderRadius: radius, backgroundColor }]}>
      <Text style={[s.initial, { fontSize }]}>{initial}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    ...typography.smallMedium,
    color: colors.onPrimary,
    fontWeight: '700',
  },
});
