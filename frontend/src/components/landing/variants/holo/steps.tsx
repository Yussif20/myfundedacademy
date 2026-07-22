"use client";

import { ScrollReveal } from "@/components/motion";
import { Award, BookOpen, Compass, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type Step = {
  icon: LucideIcon;
  titleKey: "browseTitle" | "learnTitle" | "certifyTitle";
  bodyKey: "browseBody" | "learnBody" | "certifyBody";
  /** Fill of the step's iridescent ring node — progress toward certified. */
  progress: number;
};

const STEPS: Step[] = [
  { icon: Compass, titleKey: "browseTitle", bodyKey: "browseBody", progress: 33 },
  { icon: BookOpen, titleKey: "learnTitle", bodyKey: "learnBody", progress: 66 },
  { icon: Award, titleKey: "certifyTitle", bodyKey: "certifyBody", progress: 100 },
];

/** How-it-works as a vertical sequence along a prismatic rail. Each node is a
 *  miniature iridescent progress ring filling 33 → 66 → 100 — the product's
 *  most recognizable asset doubling as wayfinding. */
export function HoloSteps() {
  const t = useTranslations("home.howItWorks");

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <span className="dxholo-eyebrow">01 — 03</span>
            </div>
            <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-balance text-[var(--muted-foreground)]">{t("subtitle")}</p>
          </div>
        </ScrollReveal>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div aria-hidden className="dxholo-rail" />
          <ol className="space-y-12">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.titleKey}>
                  <ScrollReveal delay={i * 0.1} amount={0.4}>
                    <div className="relative flex items-start gap-6">
                      <div
                        className="dxholo-ring size-10 shrink-0"
                        style={{ "--dxholo-p": `${step.progress}%` } as React.CSSProperties}
                      >
                        <span className="dxholo-num text-[11px] font-semibold text-[var(--foreground)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="pt-1">
                        <div className="flex items-center gap-3">
                          <Icon className="size-4 text-[var(--primary)]" aria-hidden />
                          <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            {t(step.titleKey)}
                          </h3>
                        </div>
                        <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-[var(--muted-foreground)]">
                          {t(step.bodyKey)}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
