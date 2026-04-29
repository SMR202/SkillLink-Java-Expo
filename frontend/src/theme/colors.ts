/**
 * SkillLink Design System — Color Tokens
 *
 * Single source of truth for all colors. Both the "new" component library
 * and the older MD3-style screens use this file. Keys that previously lived
 * in a Material-Design-3 token set are mapped here so nothing breaks.
 */
export const colors = {
  // ── Core brand ─────────────────────────────────────────────────────
  primary:           '#111111',
  primaryLight:      '#333333',
  accent:            '#10B981',   // emerald green CTAs
  accentDark:        '#059669',
  accentLight:       '#D1FAE5',

  // ── Backgrounds ────────────────────────────────────────────────────
  bgPrimary:         '#FFFFFF',
  bgSecondary:       '#F9FAFB',
  bgCard:            '#FFFFFF',
  bgElevated:        '#FFFFFF',
  bgInput:           '#F3F4F6',
  bgDark:            '#FFFFFF',   // legacy alias

  // ── Text ───────────────────────────────────────────────────────────
  textPrimary:       '#111827',
  textSecondary:     '#6B7280',
  textMuted:         '#9CA3AF',
  textInverse:       '#FFFFFF',

  // ── UI chrome ──────────────────────────────────────────────────────
  border:            '#E5E7EB',
  borderLight:       '#F3F4F6',
  divider:           '#F3F4F6',
  star:              '#F59E0B',

  // ── Semantic status ────────────────────────────────────────────────
  success:           '#10B981',
  warning:           '#F59E0B',
  error:             '#EF4444',
  pending:           '#F59E0B',
  accepted:          '#10B981',
  declined:          '#EF4444',

  // ── Gradients ──────────────────────────────────────────────────────
  gradientPrimary:   ['#111111', '#333333'] as [string, string],
  gradientSecondary: ['#10B981', '#059669'] as [string, string],
  gradientSuccess:   ['#10B981', '#059669'] as [string, string],
  gradientDark:      ['#FFFFFF', '#F9FAFB'] as [string, string],

  // ── Overlays ───────────────────────────────────────────────────────
  overlay:           'rgba(0, 0, 0, 0.4)',
  glassBg:           'rgba(255, 255, 255, 0.8)',
  glassStroke:       '#E5E7EB',
  scrim:             'rgba(0, 0, 0, 0.4)',
  transparent:       'transparent',

  // ── MD3 compatibility aliases ──────────────────────────────────────
  // Older screens imported Material-Design-3 token names. These aliases
  // map them to the current clean design system so nothing crashes.
  background:                '#F9FAFB',
  surface:                   '#FFFFFF',
  surfaceBright:             '#FFFFFF',
  surfaceDim:                '#F3F4F6',
  surfaceContainer:          '#F3F4F6',
  surfaceContainerLow:       '#F9FAFB',
  surfaceContainerHigh:      '#EBEBEB',
  surfaceContainerLowest:    '#FFFFFF',
  surfaceContainerHighest:   '#E5E7EB',
  surfaceVariant:            '#E5E7EB',
  surfaceTint:               '#111111',
  onBackground:              '#111827',
  onSurface:                 '#111827',
  onSurfaceVariant:          '#6B7280',
  outline:                   '#9CA3AF',
  outlineVariant:            '#E5E7EB',
  inverseSurface:            '#111827',
  inverseOnSurface:          '#F9FAFB',
  inversePrimary:            '#10B981',

  // Primary role aliases
  primaryContainer:          '#111111',
  onPrimary:                 '#FFFFFF',
  onPrimaryContainer:        '#FFFFFF',
  onPrimaryFixed:            '#FFFFFF',
  primaryFixed:              '#D1FAE5',
  primaryFixedDim:           '#A7F3D0',

  // Secondary role aliases
  secondary:                 '#6B7280',
  secondaryContainer:        '#F3F4F6',
  onSecondary:               '#FFFFFF',
  onSecondaryContainer:      '#374151',

  // Tertiary role aliases
  tertiary:                  '#059669',
  tertiaryContainer:         '#D1FAE5',
  onTertiary:                '#FFFFFF',
  onTertiaryContainer:       '#065F46',

  // Error role aliases
  errorContainer:            '#FEE2E2',
  onError:                   '#FFFFFF',
  onErrorContainer:          '#991B1B',

  // Misc aliases
  notification:              '#EF4444',
  white:                     '#FFFFFF',
  black:                     '#111827',
} as const;
