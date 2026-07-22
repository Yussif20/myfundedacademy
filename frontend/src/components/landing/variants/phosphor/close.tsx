"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Phosphor Terminal Noir — session close.
 * Final CTA as an end-of-session instrument frame: scanlined carbon panel with
 * permanent registration ticks, a pulsing session chip, the closing headline,
 * and the viewport's single glow on the primary action. No blobs, no blur.
 */
export function PhosphorClose() {
  const t = useTranslations("home");

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <div className="dxphosphor-panel dxphosphor-ticks relative overflow-hidden p-10 text-center md:p-16">
            <div
              aria-hidden
              className="dxphosphor-scanlines pointer-events-none absolute inset-0"
            />

            <div className="relative">
              <span className="dxphosphor-chip mb-6 text-[var(--foreground)]">
                <span className="dxphosphor-led dxphosphor-led--static" />
                {t("pricingTeaser.title").split(",")[0]}
              </span>

              <h2 className="font-display text-balance text-4xl font-bold leading-[1.05] tracking-[-0.03em] md:text-6xl">
                {t("ctaTitle")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-balance text-[var(--muted-foreground)] md:text-lg">
                {t("pricingTeaser.subtitle")}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="brand-glow group inline-flex h-12 items-center gap-2 rounded-[2px] bg-[var(--primary)] px-7 font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
                >
                  {t("pricingTeaser.cta")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center rounded-[2px] border border-[var(--border)] px-6 font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--foreground)]"
                >
                  {t("ctaButton")}
                </Link>
              </div>

              {/* Closing readout — language-neutral */}
              <div
                aria-hidden
                className="mt-10 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)] opacity-70"
              >
                <span className="h-px w-8 bg-[var(--border)]" />
                <span>MFA · 24/7 · EN/AR</span>
                <span className="h-px w-8 bg-[var(--border)]" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
