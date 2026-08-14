"use client";

import { createContext, useContext } from "react";

export type VipThemeName = "dark" | "light";

// Semantic tokens, not raw colors — every VIP panel reads these instead of
// hardcoding hex. `accent` is intentionally an inverting pair (white-on-dark
// in dark mode, black-on-light in light mode) since VIP's identity is
// monochrome-contrast, not a fixed brand color; `accentInverse` is the
// "punch-through" pair used for a button sitting inside an accent block
// (e.g. the dark "Open →" button inside a white CTA card) — it's just
// accent's two colors swapped, so it stays correct in both themes.
export type VipTokens = {
  bg: string;
  surface: string;
  surfaceInset: string;
  border: string;
  borderDashed: string;
  borderStrong: string;
  borderActive: string;
  tint1: string;
  tint2: string;
  tint3: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textQuaternary: string;
  accentBg: string;
  accentText: string;
  accentTextMuted: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  avatarFallbackBg: string;
  avatarFallbackText: string;
  // Restrained color pops on top of the monochrome base — two consistent
  // threads, not a full recolor: blue marks financial/data visuals (trend
  // lines, gauges), yellow marks AI-feature touches (Teni, Intelligence).
  // `accentColoredIconText` is the fixed dark icon color used on top of
  // either — both are bright enough that a dark icon reads best regardless
  // of theme, unlike the inverting accent pair above.
  accentBlue: string;
  accentYellow: string;
  accentColoredIconText: string;
};

const DARK: VipTokens = {
  bg: "#0a0a0a",
  surface: "#161616",
  surfaceInset: "#0a0a0a",
  border: "rgba(255,255,255,0.14)",
  borderDashed: "rgba(255,255,255,0.2)",
  borderStrong: "rgba(255,255,255,0.3)",
  borderActive: "rgba(255,255,255,0.16)",
  tint1: "rgba(255,255,255,0.1)",
  tint2: "rgba(255,255,255,0.08)",
  tint3: "rgba(255,255,255,0.06)",
  text: "#ffffff",
  textSecondary: "#a8a8a8",
  textTertiary: "#8a8a8a",
  textQuaternary: "#6b6b6b",
  accentBg: "#ffffff",
  accentText: "#0a0a0a",
  accentTextMuted: "#4a4a4a",
  success: "#8fd6a8",
  danger: "#ff8a8a",
  warning: "#d9a05b",
  info: "#d2cefd",
  avatarFallbackBg: "#2a2d3d",
  avatarFallbackText: "#ffffff",
  accentBlue: "#5b9bf0",
  accentYellow: "#f4c542",
  accentColoredIconText: "#0a0a0a",
};

const LIGHT: VipTokens = {
  bg: "#f0f0f0",
  surface: "#ffffff",
  surfaceInset: "#f0f0f0",
  border: "rgba(0,0,0,0.12)",
  borderDashed: "rgba(0,0,0,0.18)",
  borderStrong: "rgba(0,0,0,0.28)",
  borderActive: "rgba(0,0,0,0.16)",
  tint1: "rgba(0,0,0,0.06)",
  tint2: "rgba(0,0,0,0.05)",
  tint3: "rgba(0,0,0,0.04)",
  text: "#0a0a0a",
  textSecondary: "#5a5a5a",
  textTertiary: "#7a7a7a",
  textQuaternary: "#9a9a9a",
  accentBg: "#0a0a0a",
  accentText: "#ffffff",
  accentTextMuted: "#c8c8c8",
  success: "#1f8a4c",
  danger: "#d64545",
  warning: "#b8752a",
  info: "#7a63d4",
  avatarFallbackBg: "#e4e4e8",
  avatarFallbackText: "#2a2d3d",
  accentBlue: "#2563eb",
  accentYellow: "#eab308",
  accentColoredIconText: "#0a0a0a",
};

export const VIP_PALETTES: Record<VipThemeName, VipTokens> = { dark: DARK, light: LIGHT };

export const VipThemeContext = createContext<{ theme: VipThemeName; tokens: VipTokens; toggleTheme: () => void }>({
  theme: "dark",
  tokens: DARK,
  toggleTheme: () => {},
});

export function useVipTheme() {
  return useContext(VipThemeContext);
}
