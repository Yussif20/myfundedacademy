"use client";

import { useTranslations } from "next-intl";

const FIRMS = [
  "FTMO",
  "MyForexFunds",
  "The Funded Trader",
  "TopStep",
  "Apex Trader",
  "Earn2Trade",
  "City Traders Imperium",
  "Funding Pips",
  "FundedNext",
  "E8 Funding",
];

/**
 * Acid Ledger trusted-by — instead of a soft grayscale logo marquee, the prop
 * firms stream through a second, slower ticker band: indexed mono entries
 * with an up-arrow, like counterparties on a trade blotter. Pauses on hover,
 * static under prefers-reduced-motion (handled in acid.css).
 */
export function AcidTrusted() {
  const t = useTranslations("home");

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {t("trustedBy")}
        </p>
      </div>
      <div className="dxacid-ticker dxacid-ticker-slow" role="presentation">
        <div className="dxacid-ticker-track">
          <FirmRow />
          <FirmRow hidden />
        </div>
      </div>
    </section>
  );
}

function FirmRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex" aria-hidden={hidden || undefined}>
      {FIRMS.map((firm, i) => (
        <span key={firm} className="dxacid-tick">
          <span className="text-[var(--muted-foreground)]">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-[var(--foreground)]">{firm}</span>
          <span className="dxacid-up">▲</span>
        </span>
      ))}
    </div>
  );
}
