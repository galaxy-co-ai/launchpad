/**
 * Launchpad Design System - Color Tokens
 *
 * Naming convention (Spectrum-style):
 * [context]-[commonUnit]-[clarification]
 *
 * Examples:
 * - launchpad-violet-900 (context: launchpad-violet, clarification: 900 value)
 * - accent-background-color-default (context: accent, commonUnit: background-color, clarification: default)
 */

// ============================================================================
// FOUNDATION COLORS - Global tokens (raw values)
// ============================================================================

export const foundationColors = {
  // Launchpad foundation
  'launchpad-void': '#09090B',
  'launchpad-deep': '#0C0A14',
  'launchpad-dark': '#18162A',
  'launchpad-frost': '#FAFAFA',

  // Launchpad violet palette (primary brand)
  'launchpad-violet-900': '#7C3AED',
  'launchpad-violet-800': '#8B5CF6',
  'launchpad-violet-700': '#A78BFA',
  'launchpad-violet-600': '#C4B5FD',
  'launchpad-violet-500': '#DDD6FE',
  'launchpad-violet-400': '#EDE9FE',
  'launchpad-violet-300': '#F3F0FF',
  'launchpad-violet-200': '#F8F7FF',
  'launchpad-violet-100': '#FDFCFF',

  // Purple accent
  'launchpad-purple-900': '#9333EA',
  'launchpad-purple-800': '#A855F7',
  'launchpad-purple-700': '#C084FC',
  'launchpad-purple-600': '#D8B4FE',
  'launchpad-purple-500': '#E9D5FF',
  'launchpad-purple-400': '#F3E8FF',
  'launchpad-purple-300': '#FAF5FF',
  'launchpad-purple-200': '#FDFCFF',
  'launchpad-purple-100': '#FFFFFF',

  // Pink accent
  'launchpad-pink-900': '#DB2777',
  'launchpad-pink-800': '#EC4899',
  'launchpad-pink-700': '#F472B6',
  'launchpad-pink-600': '#F9A8D4',
  'launchpad-pink-500': '#FBCFE8',
  'launchpad-pink-400': '#FCE7F3',
  'launchpad-pink-300': '#FDF2F8',
  'launchpad-pink-200': '#FEF7FB',
  'launchpad-pink-100': '#FFFFFF',

  // Blue accent
  'launchpad-blue-900': '#2563EB',
  'launchpad-blue-800': '#3B82F6',
  'launchpad-blue-700': '#60A5FA',
  'launchpad-blue-600': '#93C5FD',
  'launchpad-blue-500': '#BFDBFE',
  'launchpad-blue-400': '#DBEAFE',
  'launchpad-blue-300': '#EFF6FF',
  'launchpad-blue-200': '#F8FAFF',
  'launchpad-blue-100': '#FFFFFF',

  // Grayscale
  'gray-900': '#18181B',
  'gray-800': '#27272A',
  'gray-700': '#3F3F46',
  'gray-600': '#52525B',
  'gray-500': '#71717A',
  'gray-400': '#A1A1AA',
  'gray-300': '#D4D4D8',
  'gray-200': '#E4E4E7',
  'gray-100': '#F4F4F5',

  // Semantic colors
  'semantic-success': '#22C55E',
  'semantic-warning': '#F59E0B',
  'semantic-error': '#EF4444',
  'semantic-info': '#7C3AED',

  // ============================================================================
  // LAUNCH THEME - Professional rocket launch aesthetic
  // ============================================================================

  // Charcoal gradient (icon backgrounds)
  'launch-charcoal-900': '#1C1C1E',  // Darkest
  'launch-charcoal-800': '#2C2C2E',
  'launch-charcoal-700': '#3A3A3C',
  'launch-charcoal-600': '#48484A',  // Lightest charcoal

  // Ambient blue (subtle glow)
  'launch-blue': '#3B82F6',
  'launch-blue-glow': 'rgba(59, 130, 246, 0.25)',
  'launch-blue-glow-subtle': 'rgba(59, 130, 246, 0.15)',

  // Action orange (active/CTA glow)
  'launch-orange': '#F97316',
  'launch-orange-glow': 'rgba(249, 115, 22, 0.35)',
  'launch-orange-glow-subtle': 'rgba(249, 115, 22, 0.20)',
} as const;

// ============================================================================
// ALIAS TOKENS - Semantic color mappings
// ============================================================================

export const aliasColors = {
  // Background colors
  'background-color-default': 'var(--background)',
  'background-color-elevated': 'var(--card)',
  'background-color-overlay': 'rgba(9, 9, 11, 0.8)',

  // Foreground colors
  'foreground-color-default': 'var(--foreground)',
  'foreground-color-muted': 'var(--muted-foreground)',
  'foreground-color-inverse': 'var(--background)',

  // Accent colors (primary interactive color - violet)
  'accent-background-color-default': 'var(--primary)',
  'accent-background-color-hover': 'var(--primary)/90',
  'accent-background-color-active': 'var(--primary)/80',
  'accent-foreground-color-default': 'var(--primary-foreground)',
  'accent-border-color-default': 'var(--primary)',
  'accent-visual-color': '#7C3AED',

  // Secondary colors
  'secondary-background-color-default': 'var(--secondary)',
  'secondary-background-color-hover': 'var(--secondary)/80',
  'secondary-foreground-color-default': 'var(--secondary-foreground)',

  // Muted/subtle colors
  'muted-background-color-default': 'var(--muted)',
  'muted-background-color-hover': 'var(--muted)/80',
  'muted-foreground-color-default': 'var(--muted-foreground)',

  // Destructive colors
  'destructive-background-color-default': 'var(--destructive)',
  'destructive-background-color-hover': 'var(--destructive)/90',
  'destructive-foreground-color-default': 'var(--destructive-foreground)',
  'destructive-border-color-default': 'var(--destructive)',

  // Border colors
  'border-color-default': 'var(--border)',
  'border-color-hover': 'var(--border)/60',
  'border-color-focus': 'var(--ring)',

  // Status colors
  'status-success-color': '#22C55E',
  'status-warning-color': '#F59E0B',
  'status-error-color': '#EF4444',
  'status-info-color': '#7C3AED',
} as const;

// ============================================================================
// GLASS MORPHISM TOKENS
// ============================================================================

export const glassColors = {
  // Glass backgrounds (backdrop-blur + opacity)
  'glass-background-light': 'rgba(255, 255, 255, 0.7)',
  'glass-background-medium': 'rgba(255, 255, 255, 0.5)',
  'glass-background-heavy': 'rgba(255, 255, 255, 0.3)',

  'glass-background-dark-light': 'rgba(12, 10, 20, 0.7)',
  'glass-background-dark-medium': 'rgba(12, 10, 20, 0.5)',
  'glass-background-dark-heavy': 'rgba(12, 10, 20, 0.3)',

  // Glass borders
  'glass-border-light': 'rgba(255, 255, 255, 0.2)',
  'glass-border-medium': 'rgba(255, 255, 255, 0.3)',
  'glass-border-dark': 'rgba(0, 0, 0, 0.1)',

  // Glass overlays
  'glass-overlay-light': 'rgba(250, 250, 250, 0.9)',
  'glass-overlay-medium': 'rgba(250, 250, 250, 0.95)',
  'glass-overlay-dark': 'rgba(9, 9, 11, 0.9)',
} as const;

// ============================================================================
// COMPONENT-SPECIFIC COLOR TOKENS
// ============================================================================

export const componentColors = {
  // Button
  'button-background-color-default': 'var(--primary)',
  'button-background-color-hover': 'var(--primary)/90',
  'button-foreground-color-default': 'var(--primary-foreground)',
  'button-border-color-default': 'var(--primary)',

  // Input
  'input-background-color-default': 'var(--input-background)',
  'input-border-color-default': 'var(--border)',
  'input-border-color-focus': 'var(--ring)',
  'input-foreground-color-default': 'var(--foreground)',

  // Card
  'card-background-color-default': 'var(--card)',
  'card-border-color-default': 'var(--border)',
  'card-foreground-color-default': 'var(--card-foreground)',

  // Badge
  'badge-background-color-neutral': 'var(--muted)',
  'badge-foreground-color-neutral': 'var(--muted-foreground)',

  // Dialog/Modal
  'dialog-background-color-default': 'var(--card)',
  'dialog-overlay-color': 'rgba(0, 0, 0, 0.5)',
  'dialog-border-color-default': 'var(--border)',
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const colors = {
  foundation: foundationColors,
  alias: aliasColors,
  glass: glassColors,
  component: componentColors,
} as const;

export default colors;
