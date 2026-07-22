"use client";

import { Link } from "@/i18n/navigation";

/**
 * Engraved ornaments for "The Ledger Club" — all inline SVG, all decorative
 * (aria-hidden), all language-neutral.
 */

/** Guilloché rosette — banknote lathe-work built from rotated ellipses. */
export function Guilloche({ className }: { className?: string }) {
  const rings = Array.from({ length: 22 }, (_, i) => i);
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden fill="none">
      <g stroke="currentColor" strokeWidth="0.7">
        {rings.map((i) => (
          <ellipse
            key={i}
            cx="300"
            cy="300"
            rx={90 + i * 8}
            ry={264 - i * 6}
            transform={`rotate(${i * (180 / 22)} 300 300)`}
          />
        ))}
        <circle cx="300" cy="300" r="72" />
        <circle cx="300" cy="300" r="66" />
      </g>
    </svg>
  );
}

/** Oxblood wax seal with gold monogram — the brand's one flourish. */
export function WaxSeal({ className }: { className?: string }) {
  const points = Array.from({ length: 96 }, (_, i) => {
    const angle = (i / 96) * Math.PI * 2;
    const r = i % 2 === 0 ? 48 : 44.5;
    const x = (50 + r * Math.cos(angle)).toFixed(2);
    const y = (50 + r * Math.sin(angle)).toFixed(2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={points} fill="var(--dxledger-oxblood)" />
      <circle
        cx="50"
        cy="50"
        r="37"
        fill="none"
        stroke="var(--dxledger-gold)"
        strokeWidth="1"
        opacity="0.85"
      />
      <circle
        cx="50"
        cy="50"
        r="33.5"
        fill="none"
        stroke="var(--dxledger-gold)"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <text
        x="50"
        y="55.5"
        textAnchor="middle"
        fontSize="15"
        fontWeight="600"
        letterSpacing="2"
        fill="var(--dxledger-gold)"
        fontFamily="var(--display-font), serif"
      >
        MFA
      </text>
    </svg>
  );
}

/** Small rotated-square diamond used at rule centers. */
function Diamond() {
  return (
    <svg viewBox="0 0 10 10" className="size-2 text-[var(--dxledger-gold)]" aria-hidden>
      <rect
        x="2.2"
        y="2.2"
        width="5.6"
        height="5.6"
        transform="rotate(45 5 5)"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}

/** Engraved hairline divider with a centered diamond ornament. */
export function LedgerDivider() {
  return (
    <div aria-hidden className="mx-auto flex max-w-5xl items-center gap-4 px-6">
      <span className="dxledger-rule flex-1" />
      <Diamond />
      <span className="dxledger-rule flex-1" />
    </div>
  );
}

/**
 * Section head: an engraved № index eyebrow flanked by hairlines, a Fraunces
 * title, and an optional deck. The index is language-neutral by design.
 */
export function SectionHead({ index, title, sub }: { index: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="dxledger-eyebrow font-mono">{index}</p>
      <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-balance text-[var(--muted-foreground)]">{sub}</p>}
    </div>
  );
}

/**
 * Typographic brand lockup — an MFA monogram plate beside a stacked
 * serif-and-small-caps wordmark. The shared teal SVG logo never appears in
 * this direction.
 */
export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="My Funded Academy"
      className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <span className="dxledger-frame grid size-10 shrink-0 place-items-center font-display text-[13px] font-semibold text-[var(--dxledger-gold)]">
        MFA
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
            My Funded
          </span>
          <span className="dxledger-smallcaps mt-1 text-[10px] leading-none text-[var(--dxledger-gold)]">
            Academy
          </span>
        </span>
      )}
    </Link>
  );
}
