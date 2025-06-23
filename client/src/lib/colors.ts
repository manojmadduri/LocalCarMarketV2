// Centralized Color System for The Integrity Auto and Body
// Change these values to update the entire website's color scheme

export const colors = {
  // Brand Colors - Main palette
  primary: {
    DEFAULT: 'hsl(213, 85%, 58%)', // Professional Blue
    50: 'hsl(213, 85%, 95%)',
    100: 'hsl(213, 85%, 90%)',
    200: 'hsl(213, 85%, 80%)',
    300: 'hsl(213, 85%, 70%)',
    400: 'hsl(213, 85%, 65%)',
    500: 'hsl(213, 85%, 58%)', // Main brand color
    600: 'hsl(213, 85%, 52%)',
    700: 'hsl(213, 85%, 45%)',
    800: 'hsl(213, 85%, 38%)',
    900: 'hsl(213, 85%, 30%)',
  },

  // Neutral Colors - Gray scale
  neutral: {
    DEFAULT: 'hsl(215, 12%, 52%)',
    50: 'hsl(210, 20%, 98%)',
    100: 'hsl(210, 15%, 95%)',
    200: 'hsl(210, 15%, 92%)',
    300: 'hsl(210, 15%, 88%)',
    400: 'hsl(215, 12%, 65%)',
    500: 'hsl(215, 12%, 52%)',
    600: 'hsl(215, 25%, 35%)',
    700: 'hsl(215, 25%, 27%)',
    800: 'hsl(215, 28%, 17%)',
    900: 'hsl(215, 28%, 8%)',
  },

  // Status Colors
  success: {
    DEFAULT: 'hsl(142, 71%, 45%)',
    light: 'hsl(142, 71%, 92%)',
    dark: 'hsl(142, 71%, 30%)',
    border: 'hsl(142, 71%, 80%)',
  },

  warning: {
    DEFAULT: 'hsl(38, 92%, 50%)',
    light: 'hsl(38, 92%, 92%)',
    dark: 'hsl(38, 92%, 30%)',
    border: 'hsl(38, 92%, 75%)',
  },

  error: {
    DEFAULT: 'hsl(0, 84%, 60%)',
    light: 'hsl(0, 84%, 92%)',
    dark: 'hsl(0, 84%, 35%)',
    border: 'hsl(0, 84%, 75%)',
  },

  // Background Colors
  background: {
    DEFAULT: 'hsl(210, 20%, 98%)',
    card: 'hsl(0, 0%, 100%)',
    muted: 'hsl(210, 15%, 95%)',
    accent: 'hsl(210, 15%, 95%)',
  },

  // Text Colors
  text: {
    DEFAULT: 'hsl(215, 25%, 27%)',
    muted: 'hsl(215, 12%, 52%)',
    light: 'hsl(0, 0%, 100%)',
  },

  // Border Colors
  border: {
    DEFAULT: 'hsl(210, 15%, 88%)',
    muted: 'hsl(210, 15%, 92%)',
    focus: 'hsl(213, 85%, 58%)',
  },

  // Dark Mode Colors
  dark: {
    background: 'hsl(215, 28%, 8%)',
    card: 'hsl(215, 25%, 12%)',
    muted: 'hsl(215, 20%, 15%)',
    text: 'hsl(210, 15%, 95%)',
    textMuted: 'hsl(215, 12%, 65%)',
    border: 'hsl(215, 20%, 20%)',
  }
};

// CSS Variable mappings for easy theming
export const cssVariables = {
  ':root': {
    '--color-primary': colors.primary.DEFAULT,
    '--color-primary-foreground': colors.text.light,
    '--color-secondary': colors.neutral[200],
    '--color-secondary-foreground': colors.text.DEFAULT,
    '--color-background': colors.background.DEFAULT,
    '--color-foreground': colors.text.DEFAULT,
    '--color-card': colors.background.card,
    '--color-card-foreground': colors.text.DEFAULT,
    '--color-muted': colors.background.muted,
    '--color-muted-foreground': colors.text.muted,
    '--color-border': colors.border.DEFAULT,
    '--color-input': colors.neutral[200],
    '--color-ring': colors.primary.DEFAULT,
    '--color-success': colors.success.DEFAULT,
    '--color-warning': colors.warning.DEFAULT,
    '--color-error': colors.error.DEFAULT,
    '--radius': '0.75rem',
  },
  '.dark': {
    '--color-background': colors.dark.background,
    '--color-foreground': colors.dark.text,
    '--color-card': colors.dark.card,
    '--color-card-foreground': colors.dark.text,
    '--color-muted': colors.dark.muted,
    '--color-muted-foreground': colors.dark.textMuted,
    '--color-border': colors.dark.border,
    '--color-input': 'hsl(215, 20%, 18%)',
    '--color-primary': 'hsl(213, 85%, 62%)',
  }
};

// Helper functions for consistent color usage
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available':
      return {
        bg: colors.success.light,
        text: colors.success.dark,
        border: colors.success.border,
      };
    case 'pending':
      return {
        bg: colors.warning.light,
        text: colors.warning.dark,
        border: colors.warning.border,
      };
    case 'sold':
      return {
        bg: colors.error.light,
        text: colors.error.dark,
        border: colors.error.border,
      };
    default:
      return {
        bg: colors.neutral[100],
        text: colors.neutral[700],
        border: colors.neutral[300],
      };
  }
};

// Gradient definitions
export const gradients = {
  hero: `linear-gradient(135deg, ${colors.primary.DEFAULT} 0%, ${colors.neutral[800]} 50%, ${colors.neutral[700]} 100%)`,
  card: `linear-gradient(135deg, ${colors.background.card} 0%, ${colors.neutral[50]} 100%)`,
  button: `linear-gradient(135deg, ${colors.primary.DEFAULT} 0%, ${colors.primary[600]} 100%)`,
  service: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.neutral[50]} 100%)`,
};

export default colors;