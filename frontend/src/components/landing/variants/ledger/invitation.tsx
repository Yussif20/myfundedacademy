"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Guilloche } from "./ornaments";

/**
 * "The Ledger Club" invitation — the closing card as a formal admission
 * document: one registered double-rule frame, a faint guilloché rosette
 * behind the text, gold eyebrow, Fraunces invitation line, both CTAs, and a
 * mono serial imprint at the base.
 */
export function LedgerInvitation() {
  const t = useTranslations("home");

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="dxledger-frame dxledger-ticks relative overflow-hidden px-8 py-14 text-center md:px-16 md:py-20">
            {/* Engraved rosette behind the invitation text */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2"
            >
              <Guilloche className="h-full w-full text-[var(--dxledger-gold)] opacity-[0.05]" />
            </div>

            <div className="relative">
              <p className="dxledger-eyebrow">{t("pricingTeaser.title")}</p>

              <h2 className="font-display mt-6 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                {t("ctaTitle")}
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-balance text-[var(--muted-foreground)] md:text-lg">
                {t("pricingTeaser.subtitle")}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/pricing"
                  className="dxledger-btn-foil group inline-flex h-12 items-center justify-center gap-2.5 px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  {t("pricingTeaser.cta")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
                <Link
                  href="/signup"
                  className="dxledger-btn-ghost inline-flex h-12 items-center justify-center px-7 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  {t("ctaButton")}
                </Link>
              </div>

              {/* Serial imprint — language-neutral */}
              <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                MFA · № 0001 · MMXXVI
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
