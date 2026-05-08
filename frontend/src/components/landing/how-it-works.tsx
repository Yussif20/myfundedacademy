"use client";

import { ScrollReveal } from "@/components/motion";
import { motion, useReducedMotion } from "framer-motion";
import { Award, BookOpen, Compass, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type Step = {
  icon: LucideIcon;
  titleKey: "browseTitle" | "learnTitle" | "certifyTitle";
  bodyKey: "browseBody" | "learnBody" | "certifyBody";
};

const steps: Step[] = [
  { icon: Compass, titleKey: "browseTitle", bodyKey: "browseBody" },
  { icon: BookOpen, titleKey: "learnTitle", bodyKey: "learnBody" },
  { icon: Award, titleKey: "certifyTitle", bodyKey: "certifyBody" },
];

export function HowItWorks() {
  const t = useTranslations("home.howItWorks");

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              {t("title").split(" ").slice(0, 1).join(" ")}
            </p>
            <h2 className="font-display text-balance text-3xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-balance text-[var(--muted-foreground)]">{t("subtitle")}</p>
          </div>
        </ScrollReveal>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16%] top-12 hidden h-px w-[68%] md:block"
            style={{
              background:
                "linear-gradient(to right, transparent, color-mix(in oklch, var(--primary) 35%, transparent), transparent)",
            }}
          />

          {steps.map((step, i) => (
            <ScrollReveal key={step.titleKey} delay={i * 0.12} amount={0.3}>
              <StepCard
                Icon={step.icon}
                index={i + 1}
                title={t(step.titleKey)}
                body={t(step.bodyKey)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  Icon,
  index,
  title,
  body,
}: {
  Icon: LucideIcon;
  index: number;
  title: string;
  body: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="group relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="glass relative h-full rounded-2xl p-7 text-center transition-transform duration-500 group-hover:-translate-y-1 md:text-start">
        <motion.div
          animate={reduced ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
          className="relative mb-6 inline-flex"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full opacity-60 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--primary) 60%, transparent), transparent)",
            }}
          />
          <div
            className="relative grid size-14 place-items-center rounded-2xl text-[var(--primary)]"
            style={{
              background: "color-mix(in oklch, var(--primary) 12%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
            }}
          >
            <Icon className="size-6" />
          </div>
        </motion.div>

        <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
          <span className="font-display text-xs font-semibold tracking-[0.18em] text-[var(--muted-foreground)]">
            STEP {index.toString().padStart(2, "0")}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
      </div>
    </div>
  );
}
