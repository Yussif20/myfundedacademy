import { generateRandomToken } from "./tokens";

/** Lowercases, hyphenates, strips non-ascii. Falls back to a random suffix if empty. */
export const slugify = (input: string): string => {
  const base = (input || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || generateRandomToken(6).toLowerCase();
};

export const slugWithSuffix = (input: string): string =>
  `${slugify(input)}-${generateRandomToken(4).toLowerCase()}`;
