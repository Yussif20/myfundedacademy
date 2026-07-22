"use client";

import { StaggerChildren, StaggerItem } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Guilloche, WaxSeal } from "./ornaments";

/** Language-neutral ledger strip — market symbols read as market symbols. */
const TICKER_ROWS = [
  { sym: "XAUUSD", val: "+1.24%" },
  { sym: "EURUSD", val: "+0.42%" },
  { sym: "US500", val: "+0.87%" },
];

/**
 * "The Ledger Club" hero — the landing page as a stock certificate, issued
 * live in front of the visitor. One orchestrated sequence:
 *
 *   1. the double-rule frame engraves itself around the viewport (0–1s)
 *   2. the certificate copy rises line by line (0.4s+)
 *   3. the champagne-foil phrase catches the light once (1.15s)
 *   4. the oxblood wax seal is pressed onto the ledger strip (1.6s)
 *
 * All four moments hold their final printed state under reduced motion.
 */
export function LedgerHero() {
  const t = useTranslations("home");
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      <CertificateFrame />

      {/* Guilloché lathe-work, off-center behind the headline, turning at an
          almost geological pace — the engraving is alive if you stare. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -end-52 top-1/2 -z-10 size-[560px] -translate-y-1/2 md:-end-32 md:size-[680px]"
      >
        <Guilloche className="dxledger-rotate-slow h-full w-full text-[var(--dxledger-gold)] opacity-[0.07]" />
      </div>

      <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center px-8 py-28 text-center md:py-36">
        <StaggerChildren stagger={0.09} delayChildren={0.4}>
          {/* Dateline — language-neutral, set like a certificate serial */}
          <StaggerItem>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              MFA · EST. MMXXVI · № 0001
            </p>
          </StaggerItem>

          {/* Gold small-caps eyebrow flanked by engraved hairlines */}
          <StaggerItem>
            <p className="dxledger-eyebrow mt-6">{t("heroEyebrow")}</p>
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-display mt-7 text-balance text-4xl font-semibold leading-[1.06] sm:text-5xl md:text-7xl lg:text-[5.5rem]">
              {t.rich("heroTitle", {
                accent: (chunks) => <span className="dxledger-foil-live">{chunks}</span>,
              })}
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mx-auto mt-7 max-w-[52ch] text-balance text-base text-[var(--muted-foreground)] md:text-lg">
              {t("heroSubtitle")}
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/courses"
                className="dxledger-btn-foil group inline-flex h-12 items-center justify-center gap-2.5 px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {t("heroCta")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="dxledger-btn-ghost inline-flex h-12 items-center justify-center px-7 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {t("heroSecondary")}
              </Link>
            </div>
          </StaggerItem>

          {/* Ledger strip: dotted-leader rows, champagne-foil figures — and
              the wax seal pressed onto its corner to close the issue. */}
          <StaggerItem>
            <div className="dxledger-frame dxledger-ticks relative mx-auto mt-16 w-full max-w-3xl px-7 py-5 sm:px-10">
              <div dir="ltr" className="flex flex-col gap-3 sm:flex-row sm:gap-10">
                {TICKER_ROWS.map((row) => (
                  <div key={row.sym} className="flex flex-1 items-baseline gap-3 font-mono text-xs">
                    <span className="tracking-[0.08em] text-[var(--muted-foreground)]">
                      {row.sym}
                    </span>
                    <span className="dxledger-dots" aria-hidden />
                    <span className="dxledger-figure text-sm">{row.val}</span>
                  </div>
                ))}
              </div>

              <SealPress reduced={!!reduced} />
            </div>
          </StaggerItem>
        </StaggerChildren>
      </div>
    </section>
  );
}

/**
 * The seal press — the brand's one flourish. The oxblood seal drops onto the
 * certificate with a spring (as if hand-pressed), settling slightly rotated,
 * while a faint gold ring blooms outward once like displaced wax.
 */
function SealPress({ reduced }: { reduced: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -end-4 -top-7 size-16 sm:-end-6 sm:size-20"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 2.1, rotate: -22 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                delay: 1.6,
                type: "spring",
                stiffness: 260,
                damping: 17,
                mass: 0.9,
              }
        }
        className="h-full w-full"
      >
        <WaxSeal className="h-full w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]" />
      </motion.div>

      {!reduced && (
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0, 0.55, 0], scale: [0.7, 1.35, 1.45] }}
          transition={{ delay: 1.72, duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-[var(--dxledger-gold-mid)]"
        />
      )}
    </div>
  );
}

/**
 * Inset double-rule certificate frame around the hero viewport.
 * The outer rule draws itself via stroke-dashoffset (CSS-driven, frozen
 * under prefers-reduced-motion); the inner gold hairline and its corner
 * registration ticks fade in after.
 */
function CertificateFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-3 sm:inset-5">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          className="dxledger-draw"
        />
      </svg>
      <div className="dxledger-frame-inner dxledger-ticks absolute inset-[9px] rounded-[2px] border border-[var(--dxledger-gold-faint)]" />
    </div>
  );
}
