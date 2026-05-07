"use client";

import { useTranslations } from "next-intl";

const firms = [
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

export function TrustedBy() {
  const t = useTranslations("home");

  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {t("trustedBy")}
        </p>
        <div className="mask-fade-edges relative overflow-hidden">
          <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
            {[...firms, ...firms].map((firm, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center px-2 font-display text-xl font-semibold tracking-tight text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] md:text-2xl"
              >
                {firm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
