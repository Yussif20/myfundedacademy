"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { type CSSProperties } from "react";
import { ACID_EASE, Snap } from "./snap";

/**
 * Acid Ledger hero — flat ink-olive field, 24px graph-paper grid, one giant
 * hollow "↗" watermark bleeding off the corner. Archivo Black ALL-CAPS
 * headline with the accent phrase in a chartreuse highlighter block. The
 * orchestrated entry runs entirely on translate/clip snaps (zero fades).
 *
 * The "wow": a rotated trade-ticket sheet on the end side that prints itself
 * like a dot-matrix confirmation — header, then an equity step-curve that
 * draws its stroke, then ledger rows snapping in line by line — and finally a
 * magenta "✓ MFA" rubber stamp slams onto the sheet. Fully static under
 * prefers-reduced-motion; all ticket copy is language-neutral market data.
 */
export function AcidHero() {
  const t = useTranslations("home");

  return (
    <section className="dxacid-grid relative isolate overflow-hidden">
      {/* Giant hollow ↗ watermark bleeding off the top-end corner */}
      <span
        aria-hidden
        className="dxacid-watermark end-[-0.12em] top-[-0.08em] text-[clamp(16rem,42vw,38rem)]"
      >
        ↗
      </span>

      <div className="relative mx-auto grid min-h-[86vh] max-w-7xl items-center gap-16 px-6 py-24 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          {/* Eyebrow: bone-outline stamp with a live square LED */}
          <Snap delay={0.05} className="inline-block">
            <span className="dxacid-sticker" style={{ "--dxacid-tilt": "-2deg" } as CSSProperties}>
              <span className="dxacid-led animate-pulse" aria-hidden />
              {t("heroEyebrow")}
            </span>
          </Snap>

          {/* Headline: Archivo Black; accent phrase in the highlighter block */}
          <Snap delay={0.16}>
            <h1 className="font-display mt-10 max-w-5xl text-balance text-[clamp(2.6rem,6.5vw,5.75rem)] leading-[0.95]">
              {t.rich("heroTitle", {
                accent: (chunks) => (
                  <span className="dxacid-highlight mx-[0.06em] my-[0.08em]">{chunks}</span>
                ),
              })}
            </h1>
          </Snap>

          {/* Sticker-bomb row: language-neutral micro-labels */}
          <Snap delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-4" aria-hidden>
              <span
                className="dxacid-sticker dxacid-sticker-acid"
                style={{ "--dxacid-tilt": "-3deg" } as CSSProperties}
              >
                +12,400 ▲
              </span>
              <span className="dxacid-sticker" style={{ "--dxacid-tilt": "2deg" } as CSSProperties}>
                DRM ✓
              </span>
              <span
                className="dxacid-sticker dxacid-sticker-mag"
                style={{ "--dxacid-tilt": "-1deg" } as CSSProperties}
              >
                EN | ع
              </span>
            </div>
          </Snap>

          {/* Mono subline, typeset like a trade confirmation note */}
          <Snap delay={0.42}>
            <p className="mt-8 max-w-2xl text-balance font-mono text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
              {t("heroSubtitle")}
            </p>
          </Snap>

          {/* CTA row: chartreuse primary that physically clicks, bone ghost */}
          <Snap delay={0.54}>
            <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Link
                href="/courses"
                className="dxacid-btn inline-flex h-13 items-center gap-2 px-8 text-sm"
              >
                {t("heroCta")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
              <Link
                href="/pricing"
                className="dxacid-btn-ghost inline-flex h-13 items-center gap-2 px-7 text-sm"
              >
                {t("heroSecondary")}
              </Link>
            </div>
          </Snap>
        </div>

        {/* The wow: self-printing trade ticket (desktop only) */}
        <div className="hidden lg:block">
          <TradeTicket />
        </div>
      </div>
    </section>
  );
}

/* Equity step-curve: a staircase climbing to the end label */
const CURVE =
  "M0 104 L24 104 L24 88 L52 88 L52 96 L80 96 L80 66 L108 66 L108 74 L136 74 " +
  "L136 46 L164 46 L164 56 L196 56 L196 30 L224 30 L224 38 L252 38 L252 14 L280 14";

const TICKET_ROWS: ReadonlyArray<{ label: string; value: string; up: boolean }> = [
  { label: "EURUSD", value: "+2.41% ▲", up: true },
  { label: "XAUUSD", value: "−0.83% ▼", up: false },
  { label: "NAS100", value: "+1.24% ▲", up: true },
  { label: "R:R", value: "1 : 3.2", up: true },
];

function TradeTicket() {
  const reduced = useReducedMotion();
  const locale = useLocale();
  const flip = locale === "ar" ? -1 : 1;

  return (
    <div
      aria-hidden
      className="dxacid-tiltwrap relative"
      style={{ "--dxacid-tilt": "1.4deg" } as CSSProperties}
    >
      {/* Second sheet in the document stack, peeking out behind */}
      <div className="absolute inset-0 border-2 border-[var(--dxacid-line)] bg-[var(--secondary)] ltr:translate-x-3 rtl:-translate-x-3 translate-y-3" />

      <div className="dxacid-hard relative p-5" dir="ltr">
        {/* Ticket header */}
        <Snap delay={0.35}>
          <div className="flex items-center justify-between border-b-2 border-[var(--dxacid-line)] pb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]">
            <span className="flex items-center gap-2">
              <span className="dxacid-led animate-pulse" />
              MFA — №0001
            </span>
            <span className="text-[var(--muted-foreground)]">24/7 ▲</span>
          </div>
        </Snap>

        {/* Equity curve panel: the stroke draws itself once */}
        <Snap delay={0.5}>
          <div className="dxacid-grid mt-4 border-2 border-[var(--dxacid-line)] bg-[var(--background)] p-3">
            <svg viewBox="0 0 280 120" className="block h-auto w-full" role="presentation">
              {/* Magenta baseline: the entry price */}
              <line
                x1="0"
                y1="104"
                x2="280"
                y2="104"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeDasharray="4 5"
              />
              {reduced ? (
                <path d={CURVE} fill="none" stroke="var(--dxacid-up)" strokeWidth="2.5" />
              ) : (
                <motion.path
                  d={CURVE}
                  fill="none"
                  stroke="var(--dxacid-up)"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.95, duration: 1.1, ease: ACID_EASE }}
                />
              )}
              <text
                x="278"
                y="10"
                textAnchor="end"
                fontSize="11"
                fontWeight="600"
                fill="var(--dxacid-up)"
                style={{ fontFamily: "var(--mono-font), monospace" }}
              >
                +64.2%
              </text>
              <text
                x="2"
                y="118"
                fontSize="9"
                fill="var(--muted-foreground)"
                style={{ fontFamily: "var(--mono-font), monospace" }}
              >
                0.00
              </text>
            </svg>
          </div>
        </Snap>

        {/* Ledger rows print line by line */}
        <div className="mt-4 space-y-2.5">
          {TICKET_ROWS.map((row, i) => (
            <Snap key={row.label} delay={0.65 + i * 0.14}>
              <div className="flex items-baseline font-mono text-xs font-semibold">
                <span>{row.label}</span>
                <span className="dxacid-leader" />
                <span className={row.up ? "dxacid-up" : "dxacid-down"}>{row.value}</span>
              </div>
            </Snap>
          ))}
        </div>

        {/* The stamp slams onto the filled ticket */}
        {reduced ? (
          <span className="dxacid-stamp absolute -bottom-4 end-8 rotate-[-8deg]">✓ MFA</span>
        ) : (
          <motion.span
            className="dxacid-stamp absolute -bottom-4 end-8"
            initial={{ opacity: 0, scale: 2.4, rotate: -18 * flip }}
            animate={{ opacity: 1, scale: 1, rotate: -8 * flip }}
            transition={{
              delay: 2.2,
              duration: 0.24,
              ease: ACID_EASE,
              opacity: { delay: 2.2, duration: 0.01 },
            }}
          >
            ✓ MFA
          </motion.span>
        )}
      </div>
    </div>
  );
}
