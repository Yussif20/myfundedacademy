/**
 * Theme-lab registry — six candidate visual identities plus the current design.
 * Each direction's tokens live in src/app/directions/<key>.css, scoped under
 * html[data-direction="<key>"]; its home-page composition lives in
 * src/components/landing/variants/<key>/home.tsx.
 *
 * PROTOTYPE — once the business owner picks a direction, fold the winner into
 * globals.css + the landing components and delete the losers and this lab.
 */

export const DIRECTION_KEYS = [
  "current",
  "phosphor",
  "ledger",
  "night",
  "holo",
  "burn",
  "acid",
] as const;

export type DirectionKey = (typeof DIRECTION_KEYS)[number];

export interface DirectionMeta {
  key: DirectionKey;
  name: string;
  tagline: string;
  /** [background, primary, accent] hexes for the switcher swatches */
  dots: [string, string, string];
}

export const DIRECTIONS: DirectionMeta[] = [
  {
    key: "current",
    name: "Current — Teal",
    tagline: "The existing teal + amber identity.",
    dots: ["#14161C", "#35B5AB", "#F59E0B"],
  },
  {
    key: "phosphor",
    name: "Phosphor Terminal Noir",
    tagline: "Bloomberg at midnight, cut like an A24 title sequence.",
    dots: ["#0A0B09", "#C4F53C", "#6BD1FF"],
  },
  {
    key: "ledger",
    name: "The Ledger Club",
    tagline: "Admission to the floor, not enrollment in a course.",
    dots: ["#100C08", "#CFA85E", "#63202B"],
  },
  {
    key: "night",
    name: "The Night Edition",
    tagline: "A finance broadsheet, printed at midnight.",
    dots: ["#141110", "#6D7FFF", "#FF5A36"],
  },
  {
    key: "holo",
    name: "Holographic Obsidian",
    tagline: "Cold black glass, prismatic edges, earned shine.",
    dots: ["#05070F", "#7DF3FF", "#B69CFF"],
  },
  {
    key: "burn",
    name: "Controlled Burn",
    tagline: "The market runs hot. Learn to hold the flame.",
    dots: ["#120C10", "#FF5A2D", "#F0326E"],
  },
  {
    key: "acid",
    name: "Acid Ledger",
    tagline: "Loud enough to remember. Sharp enough to trust.",
    dots: ["#0B0C08", "#D6FF3F", "#FF5CAA"],
  },
];

export function isDirectionKey(value: string | null): value is DirectionKey {
  return value !== null && (DIRECTION_KEYS as readonly string[]).includes(value);
}
