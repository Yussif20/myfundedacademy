"use client";

import { FadeUp, StaggerChildren, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { animate, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PhosphorTicker } from "./ticker";

/**
 * Phosphor Terminal Noir — hero, calibration cut.
 * One orchestrated entry: two crosshair hairlines sweep the viewport and lock
 * onto the composition grid (the "wow" beat), the dot grid sits masked behind
 * the headline, a full instrument panel (candles + sparkline + order-book
 * depth) draws itself on the end flank, and the enrolled counter spins up in
 * tabular mono. One glow only: the primary CTA. Ticker tape closes the frame.
 */
export function PhosphorHero() {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden">
      {/* Textures: scanlines + masked dot grid. CSS only, no blobs, no glass. */}
      <div aria-hidden className="dxphosphor-scanlines pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="dxphosphor-dotgrid dxphosphor-hero-mask pointer-events-none absolute inset-0"
      />

      {/* Calibration sequence: crosshair hairlines sweep in and lock. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="dxphosphor-cal-h" />
        <span className="dxphosphor-cal-v" />
        <span className="dxphosphor-cal-dot" />
      </div>

      <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-6 pb-20 pt-24 md:pt-28 lg:grid-cols-[minmax(0,1fr)_380px]">
        <StaggerChildren stagger={0.07} delayChildren={0.05}>
          {/* Session tag: square phosphor LED + mono call sign + localized eyebrow */}
          <StaggerItem>
            <div className="flex flex-wrap items-center gap-3">
              <span className="dxphosphor-chip text-[var(--foreground)]">
                <span className="dxphosphor-led" />
                MFA / LIVE
              </span>
              <span aria-hidden className="hidden h-px w-6 bg-[var(--border)] sm:block" />
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                {t("heroEyebrow")}
              </span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-display mt-8 max-w-3xl text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              {t.rich("heroTitle", {
                accent: (chunks) => <span className="text-gradient-brand">{chunks}</span>,
              })}
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-[var(--muted-foreground)]">
              {t("heroSubtitle")}
            </p>
          </StaggerItem>

          <StaggerItem>
            <FadeUp delay={0.55} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Primary CTA — the single permitted glow in this viewport */}
              <Button
                asChild
                size="lg"
                className="brand-glow group h-12 gap-2 rounded-[2px] px-7 text-base font-semibold"
              >
                <Link href="/courses">
                  {t("heroCta")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </Button>
              {/* Secondary — hairline ghost */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-[2px] border-[var(--border)] px-6 text-base text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--foreground)]"
              >
                <Link href="/pricing">{t("heroSecondary")}</Link>
              </Button>
            </FadeUp>
          </StaggerItem>

          {/* Language-neutral instrument readout under the CTAs */}
          <StaggerItem>
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
              <span className="flex items-center gap-2">
                <span className="dxphosphor-led dxphosphor-led--cyan" />
                24/7
              </span>
              <span aria-hidden>·</span>
              <span>EN / AR</span>
              <span aria-hidden>·</span>
              <span>DRM</span>
              <span aria-hidden>·</span>
              <span className="dxphosphor-quote">
                <CountUp value={12431} />
              </span>
            </div>
          </StaggerItem>
        </StaggerChildren>

        {/* Instrument panel: the one decorative object — a hairline-framed
            terminal pane whose chart draws itself once on load. */}
        <FadeUp
          delay={0.4}
          className="dxphosphor-panel dxphosphor-ticks relative hidden p-5 lg:block"
        >
          <InstrumentPanel />
        </FadeUp>
      </div>

      {/* Hero base: the ticker tape strip bounded by hairlines */}
      <div className="relative">
        <PhosphorTicker />
      </div>
    </section>
  );
}

/** Tabular-mono count-up (Latin digits, language-neutral). Static if reduced. */
function CountUp({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      delay: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [reduced, value]);

  return <span>{display.toLocaleString("en-US")}</span>;
}

/** [wickTop, wickBottom, bodyTop, bodyHeight, hot] — an uptrending session. */
const CANDLES: [number, number, number, number, boolean][] = [
  [96, 126, 102, 14, false],
  [90, 120, 98, 12, false],
  [94, 124, 100, 14, false],
  [78, 112, 86, 16, true],
  [84, 114, 90, 12, false],
  [70, 104, 78, 14, false],
  [74, 108, 82, 12, false],
  [58, 92, 66, 14, true],
  [64, 96, 70, 12, false],
  [48, 82, 56, 14, false],
  [54, 86, 60, 12, false],
  [36, 70, 44, 14, true],
  [42, 74, 48, 12, false],
  [24, 58, 32, 16, false],
];

const BOOK: { bid: string; bidDepth: number; ask: string; askDepth: number }[] = [
  { bid: "1.0842", bidDepth: 84, ask: "1.0844", askDepth: 58 },
  { bid: "1.0841", bidDepth: 62, ask: "1.0845", askDepth: 73 },
  { bid: "1.0840", bidDepth: 41, ask: "1.0846", askDepth: 37 },
];

/** Candles + draw-on sparkline + order-book depth. Chart stays LTR in RTL. */
function InstrumentPanel() {
  return (
    <div dir="ltr" aria-hidden>
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em]">
        <span className="text-[var(--muted-foreground)]">MFA · 30D</span>
        <span className="flex items-center gap-2 text-[var(--primary)]">
          <span className="dxphosphor-led dxphosphor-led--static" />
          +12.4%
        </span>
      </div>

      <svg
        viewBox="0 0 320 150"
        className="mt-4 block w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal grid hairlines */}
        {[0, 1, 2, 3].map((row) => (
          <line
            key={row}
            x1="0"
            x2="320"
            y1={20 + row * 36}
            y2={20 + row * 36}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}
        <line x1="0" x2="320" y1="132" y2="132" stroke="var(--border)" strokeWidth="1" />

        {/* Candlesticks: muted carbon bodies, three phosphor-hot prints */}
        {CANDLES.map(([wickTop, wickBottom, bodyTop, bodyH, hot], i) => {
          const cx = 8 + i * 22.5;
          return (
            <g key={i}>
              <line
                x1={cx}
                x2={cx}
                y1={wickTop}
                y2={wickBottom}
                stroke={hot ? "var(--primary)" : "var(--border)"}
                strokeWidth="1"
              />
              <rect
                x={cx - 4}
                y={bodyTop}
                width="8"
                height={bodyH}
                fill={hot ? "var(--primary)" : "var(--border)"}
                opacity={hot ? 0.9 : 1}
              />
            </g>
          );
        })}

        {/* The sparkline — draws its stroke once on load */}
        <path
          d="M0 118 L26 110 L48 116 L70 96 L92 102 L114 84 L136 92 L158 70 L180 78 L202 58 L224 66 L246 46 L268 52 L290 34 L320 24"
          stroke="var(--primary)"
          strokeWidth="1.5"
          pathLength={640}
          className="dxphosphor-draw"
        />
        {/* Live tip marker: square, like rack hardware */}
        <rect x="316" y="20" width="7" height="7" fill="var(--primary)" />
      </svg>

      {/* Mono axis ticks — numerals only, language-neutral */}
      <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-2 font-mono text-[10px] tracking-[0.08em] text-[var(--muted-foreground)]">
        <span>09:30</span>
        <span>11:00</span>
        <span>12:30</span>
        <span>14:00</span>
        <span>16:00</span>
      </div>

      {/* Order-book depth: phosphor bids, radar-cyan asks */}
      <div className="mt-4 grid grid-cols-2 gap-x-5 border-t border-[var(--border)] pt-3 font-mono text-[10px] tracking-[0.06em]">
        <div className="space-y-2">
          {BOOK.map((row) => (
            <div key={row.bid}>
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>BID</span>
                <span className="text-[var(--foreground)]">{row.bid}</span>
              </div>
              <div className="dxphosphor-depth mt-1" style={{ width: `${row.bidDepth}%` }} />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {BOOK.map((row) => (
            <div key={row.ask}>
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>ASK</span>
                <span className="text-[var(--foreground)]">{row.ask}</span>
              </div>
              <div
                className="dxphosphor-depth dxphosphor-depth--ask mt-1"
                style={{ width: `${row.askDepth}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Session volume readout */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 font-mono text-[11px] uppercase tracking-[0.08em]">
        <span className="text-[var(--muted-foreground)]">VOL</span>
        <span className="flex items-center gap-2 text-[var(--foreground)]">
          <CountUp value={12431} />
          <span className="dxphosphor-led dxphosphor-led--cyan" />
        </span>
      </div>
    </div>
  );
}
