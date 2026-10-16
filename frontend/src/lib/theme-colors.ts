/**
 * Reads the live theme colours from CSS variables, for things that can't use
 * classes (canvas confetti, Recharts). Call it in an effect, and again when the
 * theme changes.
 */
export function themeColor(name: string, fallback = "#1f5c4f"): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
  return v || fallback;
}

/** Brand palette for celebrations: teal, gold and ink-soft. */
export function confettiColors(): string[] {
  return [themeColor("primary"), themeColor("gold", "#b08a3e"), themeColor("chart-4", "#7d9a8c")];
}
