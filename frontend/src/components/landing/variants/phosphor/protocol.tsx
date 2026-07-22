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
 * Phosphor Terminal Noir — the execution protocol.
 * How-it-works recut as a procedure ledger: three hairline-separated rows,
 * each an order in the lifecycle — oversized mono index, instrument icon in a
 * hairline cell, title in Archivo, body in muted Plex. No floating cards, no
 * glow halos; the sequence reads top to bottom like a fill report.
 */
export function PhosphorProtocol() {
  const t = useTranslations("home.howItWorks");

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-balance text-3xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-balance text-[var(--muted-foreground)]">{t("subtitle")}</p>
          </div>
        </ScrollReveal>

        <ol className="border-t border-[var(--border)]">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.titleKey} delay={i * 0.1} amount={0.3}>
              <li className="group grid gap-4 border-b border-[var(--border)] py-8 md:grid-cols-[110px_minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:gap-8 md:py-10">
                <span
                  aria-hidden
                  className="flex items-center gap-3 font-mono text-3xl font-medium tracking-tight text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)] md:text-4xl"
                >
                  {String(i + 1).padStart(2, "0")}
                  <span
                    className={
                      i === 2
                        ? "dxphosphor-led dxphosphor-led--amber"
                        : i === 1
                          ? "dxphosphor-led dxphosphor-led--cyan"
                          : "dxphosphor-led dxphosphor-led--static"
                    }
                  />
                </span>

                <div className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center border border-[var(--border)] text-[var(--primary)]">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {t(step.titleKey)}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-[var(--muted-foreground)] md:text-[15px]">
                  {t(step.bodyKey)}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
