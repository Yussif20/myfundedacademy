"use client";

import { ScrollReveal } from "@/components/motion";
import { useTranslations } from "next-intl";
import { EditionSection } from "./edition-section";

type Step = {
  titleKey: "browseTitle" | "learnTitle" | "certifyTitle";
  bodyKey: "browseBody" | "learnBody" | "certifyBody";
};

const steps: Step[] = [
  { titleKey: "browseTitle", bodyKey: "browseBody" },
  { titleKey: "learnTitle", bodyKey: "learnBody" },
  { titleKey: "certifyTitle", bodyKey: "certifyBody" },
];

/**
 * How it works, set as a broadsheet explainer: three editorial columns
 * divided by vertical hairlines — each opened by an oversized ghost serif
 * numeral and a vermilion tick, like numbered paragraphs in a feature piece.
 * No icons, no floating orbs, no connecting gradient line.
 */
export function NightMethod({ index }: { index: string }) {
  const t = useTranslations("home.howItWorks");

  return (
    <EditionSection index={index}>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="max-w-2xl">
              <h2 className="dxnight-headline font-display text-3xl md:text-5xl">{t("title")}</h2>
              <p className="mt-3 text-[var(--muted-foreground)]">{t("subtitle")}</p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
            {steps.map((step, i) => (
              <ScrollReveal key={step.titleKey} delay={i * 0.12} amount={0.3}>
                <div
                  className={`h-full md:pe-10 ${
                    i > 0 ? "md:border-s md:border-[var(--border)] md:ps-10" : ""
                  }`}
                >
                  <p
                    aria-hidden
                    className="dxnight-headline font-display text-6xl text-[color-mix(in_srgb,var(--foreground)_22%,transparent)] md:text-7xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <span className="mt-4 block h-0.5 w-8 bg-[var(--accent)]" aria-hidden />
                  <h3 className="font-display mt-4 text-2xl">{t(step.titleKey)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {t(step.bodyKey)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </EditionSection>
  );
}
