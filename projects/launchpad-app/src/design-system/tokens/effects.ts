/**
 * Launchpad Design System - Effects Tokens
 *
 * Visual effects including shadows, blur, glass morphism, and elevation
 */

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  // Soft shadows (current system)
  'shadow-soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
  'shadow-soft-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
  'shadow-soft-lg': '0 8px 24px rgba(0, 0, 0, 0.15)',

  // Elevation levels (z-axis depth)
  'shadow-elevation-1':
    '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
  'shadow-elevation-2':
    '0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
  'shadow-elevation-3':
    '0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.06)',
  'shadow-elevation-4':
    '0 20px 25px rgba(0, 0, 0, 0.10), 0 10px 10px rgba(0, 0, 0, 0.04)',
  'shadow-elevation-5':
    '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 25px rgba(0, 0, 0, 0.08)',

  // Colored shadows (for accent elements - violet) - DEPRECATED
  'shadow-accent': '0 4px 16px rgba(124, 58, 237, 0.3)',
  'shadow-accent-lg': '0 8px 24px rgba(124, 58, 237, 0.4)',

  // ============================================================================
  // LAUNCH THEME GLOWS - Professional rocket launch aesthetic
  // ============================================================================

  // Blue ambient glow (subtle, atmospheric)
  'glow-blue': '0 0 20px rgba(59, 130, 246, 0.25)',
  'glow-blue-sm': '0 0 12px rgba(59, 130, 246, 0.20)',
  'glow-blue-lg': '0 0 30px rgba(59, 130, 246, 0.30)',
  'glow-blue-ring': '0 0 0 1px rgba(59, 130, 246, 0.30)',

  // Orange action glow (active, CTAs, ignition)
  'glow-orange': '0 0 20px rgba(249, 115, 22, 0.35)',
  'glow-orange-sm': '0 0 12px rgba(249, 115, 22, 0.25)',
  'glow-orange-lg': '0 0 30px rgba(249, 115, 22, 0.40)',
  'glow-orange-ring': '0 0 0 1px rgba(249, 115, 22, 0.40)',

  // Charcoal icon container shadow
  'shadow-charcoal': '0 4px 12px rgba(0, 0, 0, 0.25)',
  'shadow-charcoal-lg': '0 8px 20px rgba(0, 0, 0, 0.35)',

  // Inner shadows
  'shadow-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  'shadow-inset-strong': 'inset 0 4px 8px rgba(0, 0, 0, 0.12)',

  // No shadow
  'shadow-none': 'none',
} as const;

// ============================================================================
// BLUR (for glass morphism)
// ============================================================================

export const blur = {
  'blur-none': '0',
  'blur-sm': '4px',
  'blur-md': '8px',
  'blur-lg': '12px',
  'blur-xl': '16px',
  'blur-2xl': '24px',
  'blur-3xl': '40px',
} as const;

// ============================================================================
// GLASS MORPHISM EFFECTS
// ============================================================================

export const glass = {
  // Light mode glass
  'glass-light': {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },

  'glass-light-heavy': {
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(16px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  },

  'glass-light-subtle': {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
  },

  // Dark mode glass
  'glass-dark': {
    background: 'rgba(12, 10, 20, 0.7)',
    backdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },

  'glass-dark-heavy': {
    background: 'rgba(12, 10, 20, 0.5)',
    backdropFilter: 'blur(16px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
  },

  'glass-dark-subtle': {
    background: 'rgba(12, 10, 20, 0.9)',
    backdropFilter: 'blur(8px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },

  // Accent glass (with violet tint)
  'glass-accent': {
    background: 'rgba(124, 58, 237, 0.15)',
    backdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(124, 58, 237, 0.3)',
    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
  },
} as const;

// ============================================================================
// ELEVATION (z-index + shadow combined)
// ============================================================================

export const elevation = {
  'elevation-0': {
    zIndex: 0,
    boxShadow: 'none',
  },
  'elevation-1': {
    zIndex: 10,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
  },
  'elevation-2': {
    zIndex: 20,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
  },
  'elevation-3': {
    zIndex: 30,
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.06)',
  },
  'elevation-4': {
    zIndex: 40,
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.10), 0 10px 10px rgba(0, 0, 0, 0.04)',
  },
  'elevation-5': {
    zIndex: 50,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 25px rgba(0, 0, 0, 0.08)',
  },
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  'radius-none': '0',
  'radius-sm': '0.25rem', // 4px
  'radius-md': '0.5rem', // 8px
  'radius-lg': '0.875rem', // 14px - Soft aesthetic default
  'radius-xl': '1rem', // 16px
  'radius-2xl': '1.5rem', // 24px
  'radius-3xl': '2rem', // 32px
  'radius-full': '9999px', // Pill shape
} as const;

// ============================================================================
// OPACITY
// ============================================================================

export const opacity = {
  'opacity-0': '0',
  'opacity-5': '0.05',
  'opacity-10': '0.1',
  'opacity-20': '0.2',
  'opacity-30': '0.3',
  'opacity-40': '0.4',
  'opacity-50': '0.5',
  'opacity-60': '0.6',
  'opacity-70': '0.7',
  'opacity-80': '0.8',
  'opacity-90': '0.9',
  'opacity-95': '0.95',
  'opacity-100': '1',
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const effects = {
  shadows,
  blur,
  glass,
  elevation,
  borderRadius,
  opacity,
} as const;

export default effects;
