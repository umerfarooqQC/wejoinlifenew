/**
 * WJL Design System Tokens Export
 * Provides typed access to design system constants, color definitions,
 * typography scales, spacing maps, and component prop values.
 */

export const WJL_TOKENS = {
  colors: {
    primary: {
      default: 'var(--wjl-color-primary)',
      hover: 'var(--wjl-color-primary-hover)',
      active: 'var(--wjl-color-primary-active)',
      light: 'var(--wjl-color-primary-light)',
      dark: 'var(--wjl-color-primary-dark)',
      hex: '#16C2D5',
    },
    secondary: {
      default: 'var(--wjl-color-secondary)',
      hover: 'var(--wjl-color-secondary-hover)',
      active: 'var(--wjl-color-secondary-active)',
      light: 'var(--wjl-color-secondary-light)',
      hex: '#4A3728',
    },
    background: 'var(--wjl-color-background)',
    surface: 'var(--wjl-color-surface)',
    surfaceMuted: 'var(--wjl-color-surface-muted)',
    border: 'var(--wjl-color-border)',
    borderSubtle: 'var(--wjl-color-border-subtle)',
    text: {
      primary: 'var(--wjl-color-text-primary)',
      secondary: 'var(--wjl-color-text-secondary)',
      muted: 'var(--wjl-color-text-muted)',
      disabled: 'var(--wjl-color-text-disabled)',
    },
    status: {
      success: 'var(--wjl-color-success)',
      successLight: 'var(--wjl-color-success-light)',
      warning: 'var(--wjl-color-warning)',
      warningLight: 'var(--wjl-color-warning-light)',
      error: 'var(--wjl-color-error)',
      errorLight: 'var(--wjl-color-error-light)',
      info: 'var(--wjl-color-info)',
      infoLight: 'var(--wjl-color-info-light)',
    },
  },
  spacing: {
    '3xs': 'var(--wjl-spacing-3xs)', // 2px
    '2xs': 'var(--wjl-spacing-2xs)', // 4px
    xs: 'var(--wjl-spacing-xs)',    // 8px
    sm: 'var(--wjl-spacing-sm)',    // 12px
    md: 'var(--wjl-spacing-md)',    // 16px
    lg: 'var(--wjl-spacing-lg)',    // 20px
    xl: 'var(--wjl-spacing-xl)',    // 24px
    '2xl': 'var(--wjl-spacing-2xl)', // 32px
    '3xl': 'var(--wjl-spacing-3xl)', // 40px
    '4xl': 'var(--wjl-spacing-4xl)', // 48px
  },
  radii: {
    xs: 'var(--wjl-radius-xs)',
    sm: 'var(--wjl-radius-sm)',
    md: 'var(--wjl-radius-md)',
    lg: 'var(--wjl-radius-lg)',
    xl: 'var(--wjl-radius-xl)',
    pill: 'var(--wjl-radius-pill)',
  },
  shadows: {
    subtle: 'var(--wjl-shadow-subtle)',
    card: 'var(--wjl-shadow-card)',
    cardHover: 'var(--wjl-shadow-card-hover)',
    dropdown: 'var(--wjl-shadow-dropdown)',
    modal: 'var(--wjl-shadow-modal)',
    button: 'var(--wjl-shadow-button)',
  },
  typography: {
    fonts: {
      sans: 'var(--wjl-font-sans)',
      heading: 'var(--wjl-font-heading)',
      mono: 'var(--wjl-font-mono)',
    },
  },
} as const;

export type WJLStatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default';
export type WJLButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type WJLButtonSize = 'sm' | 'md' | 'lg';
