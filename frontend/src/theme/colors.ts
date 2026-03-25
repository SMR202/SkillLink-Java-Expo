export const colors = {
  // Brand
  primary: '#111111',
  primaryLight: '#333333',
  accent: '#10B981',        // emerald green for CTAs
  accentDark: '#059669',
  accentLight: '#D1FAE5',

  // Backgrounds
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F9FAFB',
  bgCard: '#FFFFFF',
  bgElevated: '#FFFFFF',
  bgInput: '#F3F4F6',
  bgDark: '#FFFFFF',        // alias for backward compat

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // UI
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#F3F4F6',

  // Status
  star: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  pending: '#F59E0B',
  accepted: '#10B981',
  declined: '#EF4444',

  // Gradients (kept for backward compat but now subtle)
  gradientPrimary: ['#111111', '#333333'] as [string, string],
  gradientSecondary: ['#10B981', '#059669'] as [string, string],
  gradientDark: ['#FFFFFF', '#F9FAFB'] as [string, string],

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  glassBg: 'rgba(255, 255, 255, 0.8)',
  glassStroke: '#E5E7EB',
};
