"use client";

import { Award, BookOpen, Compass, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { AcidSectionHeader } from "./section-header";
import { SnapIn } from "./snap";

type Step = {
  icon: LucideIcon;
  num: string;
  titleKey: "browseTitle" | "learnTitle" | "certifyTitle";
  bodyKey: "browseBody" | "learnBody" | "certifyBody";
};

const STEPS: Step[] = [
  { icon: Compass, num: "01", titleKey: "browseTitle", bodyKey: "browseBody" },
  { icon: BookOpen, num: "02", titleKey: "learnTitle", bodyKey: "learnBody" },
  { icon: Award, num: "03", titleKey: "certifyTitle", bodyKey: "certifyBody" },
];

/**
 * Acid Ledger how-it-works — three ledger entries filed on a single 2px rule:
 * each step is a hard-shadow card headed by a giant hollow outline numeral
 * and a bordered icon tile. No floating icons, no radial glows — the rule and
 * the numerals do the wayfinding.
 */
export function AcidHowItWorks() {
  const t = useTranslations("home.howItWorks");

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AcidSectionHeader center title={t("title")} sub={t("subtitle")} />

        <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
          {/* The filing rule behind the entries — desktop only */}
          <div
            aria-hidden
            className="absolute inset-x-[8%] top-14 hidden border-t-2 border-[var(--dxacid-line)] md:block"
          />

          {STEPS.map((step, i) => (
            <SnapIn key={step.titleKey} delay={i * 0.12}>
              <StepEntry
                Icon={step.icon}
                num={step.num}
                title={t(step.titleKey)}
                body={t(step.bodyKey)}
              />
            </SnapIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepEntry({
  Icon,
  num,
  title,
  body,
}: {
  Icon: LucideIcon;
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="dxacid-hard dxacid-hard-int relative h-full p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="dxacid-outline-num text-6xl" aria-hidden>
          {num}
        </span>
        <span className="grid size-12 place-items-center border-2 border-[var(--dxacid-line)] bg-[var(--secondary)] text-[var(--foreground)]">
          <Icon className="size-5" aria-hidden />
        </span>
      </div>

      <p
        className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--dxacid-up)]"
        aria-hidden
      >
        § {num} ↗
      </p>
      <h3 className="mt-2 text-xl font-bold leading-snug">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
    </div>
  );
}
