# Nibras design system: "Paper & Ink"

Warm ivory paper, deep ink text, one teal accent and small gold details. Light is the default. A
matching dark mode swaps paper for a warm near-black. The look is editorial and calm: serif
headings, hairlines instead of shadows, and one soft lamp glow.

## Tokens

All colours live as CSS variables in `src/app/globals.css` and are exposed to Tailwind through
`@theme`. Use the semantic classes (`bg-card`, `text-muted-foreground`, `border-border`,
`text-gold`); never raw hex, `color-mix()` or Tailwind palette colours. `npm run lint:tokens`
blocks new ones.

| Token                                 | Light     | Dark      | Use                                       |
| ------------------------------------- | --------- | --------- | ----------------------------------------- |
| `background`                          | `#f7f3ea` | `#14130f` | page paper                                |
| `paper-2` / `secondary` / `muted`     | `#efe9dc` | `#1c1a16` | quiet fills, hover                        |
| `card` / `popover`                    | `#fffdf8` | `#1d1b17` | cards, menus                              |
| `foreground`                          | `#1c1b18` | `#ece6d8` | ink                                       |
| `muted-foreground`                    | `#6b665c` | `#a39d90` | secondary text                            |
| `border`                              | `#e4ddcf` | `#2e2b25` | hairlines                                 |
| `input` / `rule-strong`               | `#8f8778` | `#6b665c` | control borders (≥ 3:1)                   |
| `primary` / `ring`                    | `#1f5c4f` | `#5fb39c` | the one accent                            |
| `accent`                              | `#8a6a24` | `#d4b06a` | gold **text** (AA safe)                   |
| `gold`                                | `#b08a3e` | `#c9a35a` | gold **decoration** (rules, stars, seals) |
| `success` / `warning` / `destructive` |           |           | status only                               |

Charts and confetti read the live values with `themeColor()` / `confettiColors()` from
`src/lib/theme-colors.ts`, so they follow light/dark.

## Type

- Headings: `font-display font-medium tracking-tight`. Newsreader for Latin, Noto Naskh Arabic for Arabic.
- Body: Inter, or IBM Plex Sans Arabic in Arabic. Long reading text: `text-[17px] leading-8`.
- Eyebrow: `<Eyebrow>` (11px, uppercase, 0.18em tracking, gold, with a short rule). In Arabic it drops the uppercase and tracking.
- Numbers (prices, stats, KPIs, durations): `tabular-nums`, Latin digits in both languages.
- Scale: page titles `text-4xl`/`5xl`, section titles `text-3xl`, card titles `text-xl`/`2xl`.

## Components

- `Button`: pill-shaped, no shadows. Variants: `default` (teal), `outline`, `ghost`, `link`, `gold`, `destructive`.
- `Card`: `rounded-xl border bg-card`, no shadow. On hover the border tints teal.
- `Badge`: pill variants `default`, `secondary`, `outline`, `gold`, `success`, `warning`, `destructive`.
- `Reveal`: the only scroll motion. It fades content up once, and only when JS runs. Content already on screen never hides, and reduced motion shows everything.
- `CountUp`, `Stat`, `IndexNumber`, `SectionHeading` (`editorial` | `bar`), `LampGlow`, `Wordmark` / `LampMark`.
- Tabs and segmented nav: pill track, with the active item inverted (`bg-foreground text-background`).
- Sidebars: the active item is `bg-primary/8 text-primary` with a 2px start-side teal rule.
- Empty states: a dashed `border-rule-strong/50` box and a hairline icon ring.

## Rules

- Logical properties only (`ms-`, `pe-`, `start-`, `text-start`): `npm run lint:rtl`. Mirror directional icons with `rtl:rotate-180`.
- No glass, blur, glows (except `LampGlow`), gradients on text, or 3D. Shadows only on floating UI such as the sticky CTA and the certificate.
- The certificate keeps a fixed ivory, ink and gold palette in both themes so the screen version matches print.
- Motion: CSS only (`transition-*`, the `lesson-enter` and `loading-sweep` keyframes). Everything respects `prefers-reduced-motion`.
