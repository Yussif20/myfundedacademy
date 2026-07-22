"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditionSection } from "./edition-section";

/**
 * The final CTA as a vintage subscription notice — a double-hairline framed
 * plate set like a classified advertisement: vermilion kicker, short Scotch
 * rule, Newsreader appeal, paper-sticker primary CTA, and a mono folio mark
 * closing the notice. No aurora blobs, no glow, no grain overlay.
 */
export function NightNotice({ index }: { index: string }) {
  const t = useTranslations("home");

  return (
    <EditionSection index={index}>
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <div className="dxnight-frame px-8 py-12 text-center md:px-16 md:py-16">
              <p className="dxnight-kicker text-[var(--accent)]">{t("pricingTeaser.title")}</p>
              <div
                className="dxnight-rule mx-auto mt-5 max-w-[10rem] text-[var(--foreground)]"
                aria-hidden
              />
              <h2 className="dxnight-headline font-display mt-6 text-balance text-4xl md:text-6xl">
                {t("ctaTitle")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-balance text-[var(--muted-foreground)] md:text-lg">
                {t("pricingTeaser.subtitle")}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="dxnight-btn-paper group inline-flex h-12 items-center gap-2 px-7 font-medium"
                >
                  {t("pricingTeaser.cta")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center border border-[var(--border)] px-6 font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
                >
                  {t("ctaButton")}
                </Link>
              </div>

              <p
                aria-hidden
                className="dxnight-mono mt-10 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]"
              >
                — № 001 · MFA · 2026 —
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </EditionSection>
  );
}
