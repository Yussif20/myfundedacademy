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
 * Controlled Burn trusted-by — a hairline-bounded ticker tape.
 * Firm names stream like symbols on the wire, separated by square LEDs.
 * Pauses on hover, reverses in RTL, freezes under reduced motion.
 */
export function BurnTrustedTape() {
  const t = useTranslations("home");

  return (
    <section className="relative py-10">
      <p className="dxburn-micro mb-5 text-center text-[var(--muted-foreground)]">
        {t("trustedBy")}
      </p>
      <div className="dxburn-tape border-y border-[var(--border)]">
        <div className="dxburn-tape-track items-center py-4">
          {[0, 1].map((half) => (
            <div key={half} aria-hidden={half === 1} className="flex items-center">
              {FIRMS.map((firm) => (
                <span key={firm} className="flex shrink-0 items-center gap-5 pe-10">
                  <span aria-hidden className="dxburn-led" />
                  <span className="font-display text-lg font-semibold uppercase tracking-[0.04em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] md:text-xl">
                    {firm}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
