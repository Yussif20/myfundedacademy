import { randomBytes } from "crypto";

/** URL-safe random token for email verification / password reset (32 bytes → 43 chars). */
export const generateRandomToken = (bytes = 32): string =>
  randomBytes(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Returns expiry date `hours` hours from now. */
export const expiresInHours = (hours: number): Date => new Date(Date.now() + hours * 3600_000);

/** Returns expiry date `minutes` minutes from now. */
export const expiresInMinutes = (minutes: number): Date => new Date(Date.now() + minutes * 60_000);

/** Parses durations like "15m", "7d", "1h" into milliseconds. */
export const parseDuration = (input: string): number => {
  const match = /^(\d+)([smhd])$/.exec(input);
  if (!match) throw new Error(`Invalid duration: ${input}`);
  const n = parseInt(match[1], 10);
  const unit = match[2];
  const ms = unit === "s" ? 1000 : unit === "m" ? 60_000 : unit === "h" ? 3600_000 : 86_400_000;
  return n * ms;
};
