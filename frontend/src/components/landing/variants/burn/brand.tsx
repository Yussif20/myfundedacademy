"use client";

import { Link } from "@/i18n/navigation";

/**
 * Controlled Burn brand lockup — a ticker-board station sign.
 * Ember-gradient square "MFA" tape chip + stacked condensed uppercase
 * wordmark. Text-only (the shared SVG logo is teal and off-identity).
 */
export function BurnBrand() {
  return (
    <Link href="/" aria-label="My Funded Academy" className="group inline-flex items-center gap-3">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-[2px] font-mono text-[11px] font-bold tracking-[0.06em] text-[#1c0b06]"
        style={{ background: "var(--dxburn-ember)" }}
      >
        MFA
      </span>
      <span className="flex flex-col gap-0.5 leading-none">
        <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-[var(--foreground)]">
          My Funded
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-[var(--primary)] transition-colors group-hover:text-[var(--accent)]">
          Academy
        </span>
      </span>
    </Link>
  );
}
