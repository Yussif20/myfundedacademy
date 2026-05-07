"use client";

import { AuroraBg } from "@/components/landing/aurora-bg";
import { Hero3d } from "@/components/landing/hero-3d";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("home");
  const reduced = useReducedMotion();

  const subtitle = t("heroSubtitle");
  const subtitleWords = subtitle.split(" ");

  return (
    <section className="relative isolate overflow-hidden">
      <AuroraBg />
      <Hero3d />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center md:py-32">
        <StaggerChildren stagger={0.06} delayChildren={0.05}>
          <StaggerItem>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              <span className="size-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
              {t("heroEyebrow")}
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1
              className="font-display mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-[5.25rem]"
              style={{
                textShadow: "0 1px 2px color-mix(in oklch, var(--background) 30%, transparent)",
              }}
            >
              {t.rich("heroTitle", {
                accent: (chunks) => <span className="text-gradient-brand">{chunks}</span>,
              })}
            </h1>
          </StaggerItem>

          <StaggerItem>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: reduced ? 0 : 0.025, delayChildren: 0.4 },
                },
              }}
              className="mx-auto mt-8 max-w-2xl text-balance text-lg text-[var(--muted-foreground)] md:text-xl"
            >
              {subtitleWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: reduced ? 0 : 12, filter: "blur(4px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="inline-block"
                >
                  {word}
                  {i < subtitleWords.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </motion.p>
          </StaggerItem>

          <StaggerItem>
            <FadeUp
              delay={1.2}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="group h-12 gap-2 px-7 brand-glow text-base">
                <Link href="/courses">
                  {t("heroCta")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 gap-2 px-6 text-base text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <Link href="/courses">
                  <PlayCircle className="size-4" />
                  {t("heroSecondary")}
                </Link>
              </Button>
            </FadeUp>
          </StaggerItem>
        </StaggerChildren>

        <ScrollIndicator />
      </div>

      {/* Soft top + bottom edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />
    </section>
  );
}

function ScrollIndicator() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      aria-hidden
    >
      <div className="flex h-9 w-5 justify-center rounded-full border border-[var(--border)] py-1.5">
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block h-1.5 w-1 rounded-full bg-[var(--primary)]"
        />
      </div>
    </motion.div>
  );
}
