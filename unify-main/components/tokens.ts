/**
 * Unify Design Tokens
 * ------------------------------------------------------------------
 * Source of truth for colors, typography, radii, spacing and shadows.
 * Mirrors the CSS variables in `styles/globals.css` + `tailwind.config.ts`.
 *
 * Import from here when a component needs a token value in TS (chart
 * fills, inline SVG strokes, canvas contexts, etc).
 * For normal styling, prefer Tailwind classes that map to the same tokens.
 */

export const colors = {
  // Brand (exact Figma hex)
  unifyBlue: "#009eff",
  unifyBrown: "#3a1700",
  unifyCream: "#f3f2e7",
  unifyGreen: "#059669",
  unifyTeal: "#2fb0ab",

  // Surfaces
  background: "#f3f2e7",
  foreground: "#3a1700",
  card: "#ffffff",
  cardForeground: "#3a1700",
  popover: "#ffffff",
  popoverForeground: "#3a1700",

  // Semantic
  primary: "#009eff",
  primaryForeground: "#ffffff",
  secondary: "#f3f2e7",
  secondaryForeground: "#3a1700",
  muted: "#e6e4d6",
  mutedForeground: "#5c3d2e",
  accent: "#2fb0ab",
  accentForeground: "#ffffff",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",

  // Lines
  border: "#e6e4d6",
  input: "#e6e4d6",
  ring: "#009eff",
} as const;

export const typography = {
  fontFamily: {
    display: '"Rowdies", system-ui, sans-serif',
    sans: '"Arimo", system-ui, sans-serif',
    mono: '"Consolas", monospace',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

export const radii = {
  sm: "0.5rem",     // 8px
  md: "0.625rem",   // 10px
  DEFAULT: "0.75rem", // 12px  — --radius
  lg: "0.875rem",   // 14px
  xl: "1rem",       // 16px
  "2xl": "1.25rem", // 20px
  "3xl": "1.5rem",  // 24px
  "4xl": "1.75rem", // 28px
  "5xl": "2rem",    // 32px
  full: "9999px",
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(58 23 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(58 23 0 / 0.08), 0 1px 2px -1px rgb(58 23 0 / 0.06)",
  md: "0 4px 6px -1px rgb(58 23 0 / 0.08), 0 2px 4px -2px rgb(58 23 0 / 0.06)",
  lg: "0 10px 15px -3px rgb(58 23 0 / 0.08), 0 4px 6px -4px rgb(58 23 0 / 0.06)",
  xl: "0 20px 25px -5px rgb(58 23 0 / 0.10), 0 8px 10px -6px rgb(58 23 0 / 0.08)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
  tooltip: 70,
} as const;

export const tokens = {
  colors,
  typography,
  radii,
  spacing,
  shadows,
  breakpoints,
  zIndex,
} as const;

export type Tokens = typeof tokens;
export default tokens;
