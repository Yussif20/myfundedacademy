// Ratchet for the Paper & Ink design tokens: counts colours that bypass the
// theme (hex/rgb/oklch literals, color-mix() and Tailwind palette classes such
// as text-slate-500 or bg-black) in src/, and fails if the total goes UP.
// Lower the baseline in design-token-baseline.json as areas get cleaned up.
//   node scripts/check-design-tokens.mjs           check
//   node scripts/check-design-tokens.mjs --update  rewrite the baseline
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASELINE = join(HERE, "design-token-baseline.json");
const ROOT = join(HERE, "..", "src");
const PALETTE =
  "(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)";
const RULES = {
  hex: /#[0-9a-fA-F]{3,8}\b/g,
  colorFn: /\b(?:rgba?|hsla?|oklch)\(/g,
  colorMix: /color-mix\(/g,
  palette: new RegExp(String.raw`\b(?:bg|text|border|from|via|to|fill|stroke|ring|shadow)-(?:${PALETTE}-\d{2,3}|black|white)\b`, "g"),
};

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (/\.(tsx|ts)$/.test(name)) yield path;
  }
}

const counts = Object.fromEntries(Object.keys(RULES).map((k) => [k, 0]));
const byFile = {};
for (const file of files(ROOT)) {
  const text = readFileSync(file, "utf8");
  for (const [rule, re] of Object.entries(RULES)) {
    const n = (text.match(re) ?? []).length;
    if (!n) continue;
    counts[rule] += n;
    const key = relative(join(HERE, ".."), file).replaceAll("\\", "/");
    byFile[key] = (byFile[key] ?? 0) + n;
  }
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);

if (process.argv.includes("--update")) {
  writeFileSync(BASELINE, JSON.stringify({ total, counts }, null, 2) + "\n");
  console.log(`Baseline set to ${total}`, counts);
  process.exit(0);
}

const base = JSON.parse(readFileSync(BASELINE, "utf8"));
if (total > base.total) {
  console.error(`Off-theme colours went up: ${total} > baseline ${base.total}`, counts);
  const top = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 15);
  for (const [f, n] of top) console.error(`  ${n}\t${f}`);
  console.error("Use theme tokens (bg-primary, text-muted-foreground, var(--gold)…) instead.");
  process.exit(1);
}
console.log(`Off-theme colours: ${total} (baseline ${base.total})`, counts);
if (total < base.total) console.log("Below baseline: run with --update to lock in the progress.");
