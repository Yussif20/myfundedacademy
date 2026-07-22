"use client";

import { ScrollReveal } from "@/components/motion";
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
 * Phosphor Terminal Noir — counterparties board.
 * Instead of a soft marquee: an exchange-membership grid. Every firm sits in
 * a hairline cell with a tabular index numeral, like seats on a board.
 */
export function PhosphorTrusted() {
  const t = useTranslations("home");

  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {t("trustedBy")}
          </p>
          <ul className="grid grid-cols-2 border-s border-t border-[var(--border)] sm:grid-cols-3 lg:grid-cols-5">
            {FIRMS.map((firm, i) => (
              <li
                key={firm}
                className="group flex items-center justify-between gap-2 border-b border-e border-[var(--border)] px-4 py-4"
              >
                <span className="font-display text-sm font-semibold tracking-tight text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]">
                  {firm}
                </span>
                <span
                  aria-hidden
                  className="font-mono text-[10px] tracking-[0.08em] text-[var(--muted-foreground)] opacity-50 transition-all group-hover:text-[var(--primary)] group-hover:opacity-100"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
