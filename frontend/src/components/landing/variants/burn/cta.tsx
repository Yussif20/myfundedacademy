"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { CandleWicks } from "./candle-wicks";

/**
 * Controlled Burn final CTA — the closing bell. The section is bottom-lit by
 * the ember horizon (the page's one glow lives on the primary CTA), a row of
 * candle wicks burns quietly beneath the headline, and the type is pure
 * ticker-board: condensed, uppercase, certain.
 */
export function BurnCta() {
  const t = useTranslations("home");

  return (
    <section className="dxburn-sectionglow relative overflow-hidden py-28">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <span className="dxburn-tag mx-auto">
            <span aria-hidden className="dxburn-tag-mark" />
            {t("pricingTeaser.title").split(",")[0]}
          </span>

          <h2 className="font-display mt-6 text-balance text-4xl font-bold uppercase leading-[0.98] tracking-tight md:text-6xl">
            {t("ctaTitle")}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-balance text-[var(--muted-foreground)] md:text-lg">
            {t("pricingTeaser.subtitle")}
          </p>

          <div aria-hidden className="mx-auto mt-8 flex max-w-40 justify-center">
            <CandleWicks />
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="dxburn-cta group inline-flex h-12 items-center gap-2 px-8"
            >
              {t("pricingTeaser.cta")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/signup"
              className="dxburn-seam inline-flex h-12 items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-7 font-medium text-[var(--foreground)] transition-colors hover:border-[color-mix(in_oklch,var(--primary)_45%,transparent)]"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
