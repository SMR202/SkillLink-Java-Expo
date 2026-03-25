import { Platform, StyleSheet } from 'react-native';

const fontFamily = Platform.select({
  web: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = StyleSheet.create({
  h1: { fontSize: 30, fontWeight: '700', letterSpacing: -0.5, fontFamily },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, fontFamily },
  h3: { fontSize: 18, fontWeight: '600', fontFamily },
  h4: { fontSize: 16, fontWeight: '600', fontFamily },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22, fontFamily },
  bodyMedium: { fontSize: 15, fontWeight: '500', lineHeight: 22, fontFamily },
  small: { fontSize: 13, fontWeight: '400', lineHeight: 18, fontFamily },
  smallMedium: { fontSize: 13, fontWeight: '500', lineHeight: 18, fontFamily },
  caption: { fontSize: 11, fontWeight: '400', lineHeight: 14, fontFamily },
  captionMedium: { fontSize: 11, fontWeight: '500', lineHeight: 14, fontFamily },
  button: { fontSize: 15, fontWeight: '600', letterSpacing: 0.2, fontFamily },
  buttonSmall: { fontSize: 13, fontWeight: '600', letterSpacing: 0.2, fontFamily },
});
