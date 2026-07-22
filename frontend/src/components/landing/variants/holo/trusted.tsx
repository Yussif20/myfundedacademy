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

/** Trusted-by as a polished counterparty plate — a static obsidian slab of
 *  engraved names that catch the spectrum on hover. No marquee: stillness is
 *  the luxury here, and it is RTL-proof by construction. */
export function HoloTrusted() {
  const t = useTranslations("home");

  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="dxholo-glass rounded-[10px] px-6 py-9">
            <div className="flex justify-center">
              <span className="dxholo-eyebrow">{t("trustedBy")}</span>
            </div>
            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
              {FIRMS.map((firm) => (
                <li key={firm}>
                  <span className="dxholo-prism-hover font-display cursor-default text-lg font-semibold tracking-tight text-[var(--muted-foreground)] md:text-xl">
                    {firm}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
