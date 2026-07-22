"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

/** Final CTA — the prism gate: the horizon line returns, running straight
 *  through the composition behind an aberrated headline, and the viewport's
 *  one glow belongs to the iridescent CTA. No blobs, no glass theatrics. */
export function HoloCta() {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden py-28">
      {/* The horizon passes behind the headline */}
      <div aria-hidden className="dxholo-horizon top-1/2" />

      <ScrollReveal amount={0.3}>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="flex justify-center">
            <span className="dxholo-eyebrow">
              <span aria-hidden className="dxholo-live" />
              {t("pricingTeaser.title")}
            </span>
          </div>

          <h2 className="dxholo-aberration font-display mt-6 text-balance text-4xl font-semibold tracking-[-0.02em] text-[var(--foreground)] md:text-6xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-balance text-[var(--muted-foreground)] md:text-lg">
            {t("pricingTeaser.subtitle")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="dxholo-cta group inline-flex h-12 items-center gap-2 px-7 text-base font-semibold"
            >
              {t("pricingTeaser.cta")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/signup"
              className="dxholo-ghost dxholo-prism-border inline-flex h-12 items-center px-6 text-base font-medium"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
