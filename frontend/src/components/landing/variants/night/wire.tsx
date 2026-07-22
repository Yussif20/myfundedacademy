"use client";

import { useTranslations } from "next-intl";
import { EditionSection } from "./edition-section";

/* Same roster as the shared trusted-by strip. */
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

/**
 * The wire credits — instead of a scrolling marquee, the prop firms are set
 * as a newspaper bureau line: a hairline-flanked kicker, then the names
 * wrapping as a serif credit paragraph separated by vermilion interpuncts.
 * Print does not move.
 */
export function NightWire({ index }: { index: string }) {
  const t = useTranslations("home");

  return (
    <EditionSection index={index}>
      <section className="py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-4">
            <span className="dxnight-hairline block flex-1 text-[var(--foreground)]" aria-hidden />
            <p className="dxnight-kicker text-center text-[var(--muted-foreground)]">
              {t("trustedBy")}
            </p>
            <span className="dxnight-hairline block flex-1 text-[var(--foreground)]" aria-hidden />
          </div>
          <p className="mx-auto mt-6 max-w-4xl text-center font-display text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
            {firms.map((firm, i) => (
              <span key={firm}>
                <span className="whitespace-nowrap transition-colors hover:text-[var(--foreground)]">
                  {firm}
                </span>
                {i < firms.length - 1 && (
                  <span aria-hidden className="mx-3 text-[var(--accent)]">
                    ·
                  </span>
                )}{" "}
              </span>
            ))}
          </p>
        </div>
      </section>
    </EditionSection>
  );
}
