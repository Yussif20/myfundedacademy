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
 * "The Ledger Club" counterparties register — instead of a SaaS logo
 * marquee, an engraved static roster: firm names in letterspaced small caps
 * between two hairline rules, separated by gold interpuncts. No motion; a
 * printed register does not scroll.
 */
export function LedgerRoster() {
  const t = useTranslations("home");

  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="dxledger-eyebrow">{t("trustedBy")}</p>

        <div className="mt-8">
          <span className="dxledger-rule" aria-hidden />
          <ul className="flex flex-wrap items-baseline justify-center gap-y-3 px-2 py-6">
            {FIRMS.map((firm, i) => (
              <li key={firm} className="flex items-baseline">
                {i > 0 && (
                  <span aria-hidden className="mx-4 text-[var(--dxledger-gold)] opacity-60 sm:mx-5">
                    ·
                  </span>
                )}
                <span className="dxledger-smallcaps text-[11px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--dxledger-gold)] sm:text-xs">
                  {firm}
                </span>
              </li>
            ))}
          </ul>
          <span className="dxledger-rule" aria-hidden />
        </div>
      </div>
    </section>
  );
}
