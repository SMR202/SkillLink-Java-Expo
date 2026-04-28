import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface AvatarProps {
  name?: string;
  uri?: string | null;
  size?: number;
  bgColor?: string;
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#0EA5E9'];

function colorFor(name?: string): string {
  if (!name) return colors.primary;
  const idx = name.charCodeAt(0) % COLORS.length;
  return COLORS[idx];
}

export default function Avatar({ name, uri, size = 44, bgColor }: AvatarProps) {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  const bg = bgColor || colorFor(name);
  const fontSize = size * 0.4;
  const radius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius }}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[s.circle, { width: size, height: size, borderRadius: radius, backgroundColor: bg }]}>
      <Text style={[s.initial, { fontSize }]}>{initial}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  circle: { justifyContent: 'center', alignItems: 'center' },
  initial: { color: '#FFFFFF', fontWeight: '700' },
});
