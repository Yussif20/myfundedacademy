"use client";

import { ScrollReveal } from "@/components/motion";
import { Award, BookOpen, Compass, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type Step = {
  icon: LucideIcon;
  titleKey: "browseTitle" | "learnTitle" | "certifyTitle";
  bodyKey: "browseBody" | "learnBody" | "certifyBody";
};

const STEPS: Step[] = [
  { icon: Compass, titleKey: "browseTitle", bodyKey: "browseBody" },
  { icon: BookOpen, titleKey: "learnTitle", bodyKey: "learnBody" },
  { icon: Award, titleKey: "certifyTitle", bodyKey: "certifyBody" },
];

/**
 * Controlled Burn how-it-works — the session plan.
 * No floating icon cards: each step is an entry on a rail — a hairline
 * on the inline-start edge with an ember LED, a ghosted mono index,
 * a tape icon chip, and a condensed uppercase step title.
 */
export function BurnHowItWorks() {
  const t = useTranslations("home.howItWorks");

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-14 max-w-2xl">
            <span className="dxburn-tag">
              <span aria-hidden className="dxburn-tag-mark" />
              01
            </span>
            <h2 className="font-display mt-5 text-balance text-3xl font-bold md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-balance text-[var(--muted-foreground)]">{t("subtitle")}</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.titleKey} delay={i * 0.12} amount={0.3}>
                <div className="relative border-s border-[var(--border)] ps-6">
                  <span
                    aria-hidden
                    className="dxburn-led dxburn-led--hot absolute -start-[3px] top-2"
                  />
                  <p
                    aria-hidden
                    className="font-mono text-6xl font-semibold leading-none tabular-nums text-[color-mix(in_oklch,var(--primary)_26%,transparent)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="mt-6 inline-flex size-10 items-center justify-center rounded-[2px] border border-[color-mix(in_oklch,var(--primary)_30%,transparent)] bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] text-[var(--primary)]">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="font-display mt-4 text-xl font-semibold uppercase tracking-[0.02em] rtl:tracking-normal">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {t(step.bodyKey)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
