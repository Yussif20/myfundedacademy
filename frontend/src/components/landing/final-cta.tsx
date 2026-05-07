"use client";

import { Magnetic, ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function FinalCta() {
  const t = useTranslations("home");

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-[color-mix(in_oklch,var(--primary)_25%,transparent)] bg-[color-mix(in_oklch,var(--card)_70%,transparent)] p-12 text-center backdrop-blur-xl md:p-16">
            {/* Animated gradient blob — top */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full opacity-50 blur-[110px] animate-aurora"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--primary) 50%, transparent) 0%, transparent 60%)",
              }}
            />
            {/* Amber blob — bottom right */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -right-20 size-[300px] rounded-full opacity-30 blur-[90px]"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--accent) 50%, transparent) 0%, transparent 60%)",
              }}
            />
            {/* Subtle grain */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
              }}
            />

            <div className="relative">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklch,var(--primary)_30%,transparent)] bg-[color-mix(in_oklch,var(--primary)_8%,transparent)] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
                <span className="size-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                {t("pricingTeaser.title").split(",")[0]}
              </p>
              <h2 className="font-display text-balance text-4xl font-bold tracking-tight md:text-6xl">
                {t("ctaTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-[var(--muted-foreground)] md:text-lg">
                {t("pricingTeaser.subtitle")}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Magnetic>
                  <Link
                    href="/pricing"
                    className="group inline-flex h-12 items-center gap-2 rounded-md bg-[var(--primary)] px-7 font-medium text-[var(--primary-foreground)] brand-glow transition-shadow hover:shadow-2xl hover:shadow-[color-mix(in_oklch,var(--primary)_50%,transparent)]"
                  >
                    {t("pricingTeaser.cta")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </Link>
                </Magnetic>

                <Magnetic>
                  <Link
                    href="/signup"
                    className="inline-flex h-12 items-center gap-2 rounded-md border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_70%,transparent)] px-6 font-medium text-[var(--foreground)] backdrop-blur transition-colors hover:border-[var(--primary)]"
                  >
                    {t("ctaButton")}
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
