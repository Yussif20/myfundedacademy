"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { animate, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { CandleWicks } from "./candle-wicks";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

/**
 * Controlled Burn hero — the market at 2am.
 * Near-black plum field one step darker than the page. One orchestrated
 * entry: the ember horizon ignites from below, the headline and copy rise
 * in sequence, then the "wow" — a hairline-framed burning chart whose
 * candles grow from the baseline while an ember trend line draws itself
 * across and the session P&L counts up in tabular mono digits.
 * One glow in the viewport: the primary CTA.
 */
export function EmberHero() {
  const t = useTranslations("home");
  const reduced = useReducedMotion();

  return (
    <section className="dxburn-hero relative isolate overflow-hidden">
      {/* Scrolling ticker-figure watermark (language-neutral market data) */}
      <TickerWatermark />

      {/* Ember horizon ignition — magenta core melting to orange, from below */}
      <motion.div
        aria-hidden
        className="dxburn-horizon"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-16 pt-20 md:pt-28 lg:min-h-[86vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-24">
        <motion.div
          variants={container}
          initial={reduced ? false : "hidden"}
          animate="show"
          className="text-start"
        >
          <motion.div variants={item}>
            <span className="dxburn-tag">
              <span aria-hidden className="dxburn-tag-mark" />
              {t("heroEyebrow")}
            </span>
          </motion.div>

          <motion.h1 variants={item} className="dxburn-headline font-display mt-8 text-balance">
            {t.rich("heroTitle", {
              accent: (chunks) => <span className="text-gradient-brand">{chunks}</span>,
            })}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="dxburn-cta group h-12 gap-2 rounded-[8px] px-7 text-base"
            >
              <Link href="/courses">
                {t("heroCta")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="dxburn-seam h-12 gap-2 rounded-[8px] border border-[var(--border)] px-6 text-base text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <Link href="/pricing">
                <Flame className="size-4" />
                {t("heroSecondary")}
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-14 w-max">
            <CandleWicks />
          </motion.div>
        </motion.div>

        {/* The burning chart — the one decorated object in the room */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
        >
          <BurningChart reduced={!!reduced} />
        </motion.div>
      </div>

      {/* Hard hairline cut into the page — no soft fade; the burn stays lit */}
      <div aria-hidden className="dxburn-hairline absolute inset-x-0 bottom-0" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Burning chart panel                                                 */
/* ------------------------------------------------------------------ */

const TARGET_PCT = 127.4;

/* Decorative candle heights along the baseline; a few burn hot. */
const CANDLES = [
  26, 38, 22, 46, 30, 54, 40, 34, 58, 44, 62, 36, 50, 66, 42, 58, 74, 48, 64, 80, 56, 70, 86, 62,
];
const HOT_CANDLES = new Set([5, 11, 16, 22]);

const LINE_POINTS =
  "M0 158 L40 150 L80 156 L120 138 L160 144 L200 120 L240 128 L280 102 L320 110 L360 84 L400 92 L436 58 L470 44";
const AREA_POINTS = `${LINE_POINTS} L470 200 L0 200 Z`;

function BurningChart({ reduced }: { reduced: boolean }) {
  const [pct, setPct] = useState(reduced ? TARGET_PCT : 0);

  useEffect(() => {
    if (reduced) {
      setPct(TARGET_PCT);
      return;
    }
    const controls = animate(0, TARGET_PCT, {
      duration: 2.2,
      delay: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setPct(v),
    });
    return () => controls.stop();
  }, [reduced]);

  return (
    <div
      dir="ltr"
      className="dxburn-seam relative overflow-hidden rounded-[10px] border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_78%,transparent)] backdrop-blur-sm"
    >
      {/* Console header: session tag + live P&L readout */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <span className="dxburn-micro flex items-center gap-2.5 text-[var(--muted-foreground)]">
          <span aria-hidden className="dxburn-led dxburn-led--live" />
          MFA · H1
        </span>
        <span className="font-mono text-lg font-semibold tabular-nums text-[var(--primary)]">
          +{pct.toFixed(1)}%
        </span>
      </div>

      <svg viewBox="0 0 480 220" className="block w-full" role="img" aria-hidden focusable="false">
        <defs>
          <linearGradient id="dxburn-ember-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFB86B" />
            <stop offset="34%" stopColor="#FF5A2D" />
            <stop offset="68%" stopColor="#F0326E" />
            <stop offset="100%" stopColor="#B01E56" />
          </linearGradient>
          <linearGradient id="dxburn-ember-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5A2D" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#F0326E" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid hairlines + mono axis figures */}
        {[44, 92, 140, 188].map((y, i) => (
          <g key={y}>
            <line x1="0" y1={y} x2="440" y2={y} stroke="var(--border)" strokeWidth="1" />
            <text
              x="448"
              y={y + 3}
              fontSize="10"
              fill="var(--muted-foreground)"
              style={{ fontFamily: "var(--mono-font), monospace" }}
            >
              {[128, 96, 64, 32][i]}
            </text>
          </g>
        ))}

        {/* Candles growing from the baseline */}
        {CANDLES.map((h, i) => (
          <rect
            key={i}
            className="dxburn-candle"
            x={4 + i * 18.2}
            y={196 - h}
            width="8"
            height={h}
            rx="1"
            fill={HOT_CANDLES.has(i) ? "url(#dxburn-ember-line)" : "var(--border)"}
            opacity={HOT_CANDLES.has(i) ? 0.9 : 0.55}
            style={{ animationDelay: `${0.5 + i * 0.045}s` }}
          />
        ))}

        {/* Ember area wash under the trend line */}
        <motion.path
          d={AREA_POINTS}
          fill="url(#dxburn-ember-fill)"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 2.2, ease: "easeOut" }}
        />

        {/* The burning trend line draws itself across the session */}
        <motion.path
          d={LINE_POINTS}
          fill="none"
          stroke="url(#dxburn-ember-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.9, delay: 0.8, ease: "easeInOut" }}
        />

        {/* Close of session marker */}
        <motion.circle
          cx="470"
          cy="44"
          r="4"
          fill="#F0326E"
          initial={reduced ? false : { opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 2.6, ease: "easeOut" }}
        />
      </svg>

      {/* OHLC footer strip — market vernacular, numerals only */}
      <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5 font-mono text-[10px] tabular-nums text-[var(--muted-foreground)]">
        <span>O 96.2</span>
        <span>H 128.4</span>
        <span>L 88.1</span>
        <span className="text-[var(--primary)]">C 127.4 ▲</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ticker watermark                                                    */
/* ------------------------------------------------------------------ */

/* Language-neutral market figures — numerals and tickers only. */
const TICKER_ROW_A =
  "MFA +127.4% ▲ · EURUSD +0.42% · XAUUSD +0.85% ▲ · NAS100 −0.32% ▼ · BTC +2.10% ▲ · US30 +0.18% · ";
const TICKER_ROW_B =
  "GBPUSD −0.11% ▼ · SPX +0.64% ▲ · USDJPY +0.27% · ETH +1.48% ▲ · WTI −0.53% ▼ · DXY +0.09% · ";

function TickerWatermark() {
  return (
    <div aria-hidden className="dxburn-tickerwrap">
      <div className="dxburn-tickerrow">
        <span>{TICKER_ROW_A.repeat(3)}</span>
        <span>{TICKER_ROW_A.repeat(3)}</span>
      </div>
      <div className="dxburn-tickerrow dxburn-tickerrow--alt">
        <span>{TICKER_ROW_B.repeat(3)}</span>
        <span>{TICKER_ROW_B.repeat(3)}</span>
      </div>
    </div>
  );
}
