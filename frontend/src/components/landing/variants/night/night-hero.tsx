"use client";

import { StaggerChildren, StaggerItem } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type Quote = { sym: string; val: string; up: boolean };

/* Decorative, language-neutral market data (numerals + ticker symbols only). */
const INDEX_ROWS: Quote[] = [
  { sym: "EURUSD", val: "+0.42%", up: true },
  { sym: "XAUUSD", val: "+1.08%", up: true },
  { sym: "NQ100", val: "-0.36%", up: false },
  { sym: "BTCUSD", val: "+2.14%", up: true },
];

const TICKER: Quote[] = [
  { sym: "EURUSD", val: "+0.42%", up: true },
  { sym: "BTCUSD", val: "+2.14%", up: true },
  { sym: "NQ100", val: "-0.36%", up: false },
  { sym: "XAUUSD", val: "+1.08%", up: true },
  { sym: "SPX500", val: "+0.31%", up: true },
  { sym: "USDJPY", val: "-0.09%", up: false },
  { sym: "GBPUSD", val: "+0.17%", up: true },
  { sym: "USOIL", val: "-0.77%", up: false },
];

/* The front-page market chart — a rising line drawn like fresh ink. */
const CHART_PATH =
  "M6 100 L34 88 L58 93 L82 72 L106 79 L130 58 L158 65 L182 44 L206 52 L234 30 L262 37 L290 16 L314 22";

/**
 * The Night Edition hero — the front page of a midnight broadsheet.
 * One orchestrated entry: the vermilion kicker sets, the Newsreader headline
 * rolls up out of a press mask, the drop-cap deck settles, and then the
 * market plate literally prints itself — an inline-SVG chart draws its ink
 * stroke, the index rows file in ledger-style, and a vermilion date stamp
 * thumps down over the plate corner. All of it gated on reduced motion.
 */
export function NightHero() {
  const t = useTranslations("home");
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <StaggerChildren
          stagger={0.09}
          delayChildren={0.1}
          className="pb-16 pt-12 md:pb-24 md:pt-16"
        >
          {/* Kicker */}
          <StaggerItem>
            <p className="dxnight-kicker flex items-baseline gap-2 text-[var(--accent)]">
              <span className="dxnight-mono">№ 01</span>
              <span aria-hidden>—</span>
              <span>{t("heroEyebrow")}</span>
            </p>
          </StaggerItem>

          {/* Headline — press-reveal out of an overflow mask */}
          <StaggerItem>
            <div className="overflow-hidden pb-2">
              <motion.h1
                initial={reduced ? false : { y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="dxnight-headline font-display mt-5 max-w-5xl text-balance text-5xl sm:text-6xl md:text-7xl lg:text-[6.25rem]"
              >
                {t.rich("heroTitle", {
                  accent: (chunks) => <em className="text-gradient-brand">{chunks}</em>,
                })}
              </motion.h1>
            </div>
          </StaggerItem>

          {/* Two-column deck: drop-cap paragraph + the self-printing market plate */}
          <StaggerItem>
            <div className="mt-10 grid items-start gap-10 md:mt-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
              <div>
                <p className="dxnight-deck dxnight-dropcap max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
                  {t("heroSubtitle")}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/courses"
                    className="dxnight-btn-paper group inline-flex h-12 items-center justify-center gap-2 px-7 text-base font-medium"
                  >
                    {t("heroCta")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex h-12 items-center justify-center border border-[var(--border)] px-6 text-base font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
                  >
                    {t("heroSecondary")}
                  </Link>
                </div>
              </div>

              {/* Market plate — decorative, numerals only */}
              <div aria-hidden className="dxnight-frame relative p-5 md:p-6">
                <div className="flex items-baseline justify-between">
                  <span className="dxnight-kicker text-[var(--muted-foreground)]">MFA · IDX</span>
                  <span className="dxnight-mono text-[11px] text-[var(--muted-foreground)]">
                    № 001 / 24H
                  </span>
                </div>

                {/* The chart prints itself — pathLength draw, then the close
                    quote marker and figure fade in. Charts stay LTR. */}
                <div dir="ltr" className="mt-4">
                  <svg viewBox="0 0 320 120" fill="none" className="h-auto w-full">
                    {[20, 46, 72, 98].map((y) => (
                      <line
                        key={y}
                        x1="4"
                        y1={y}
                        x2="316"
                        y2={y}
                        stroke="var(--border)"
                        strokeWidth="1"
                      />
                    ))}
                    {[
                      { x: 6, label: "00" },
                      { x: 82, label: "06" },
                      { x: 158, label: "12" },
                      { x: 234, label: "18" },
                      { x: 310, label: "24" },
                    ].map((tick) => (
                      <text
                        key={tick.label}
                        x={tick.x}
                        y={114}
                        fontSize="8"
                        fill="var(--muted-foreground)"
                        style={{ fontFamily: "var(--mono-font), monospace" }}
                      >
                        {tick.label}
                      </text>
                    ))}
                    <motion.path
                      d={CHART_PATH}
                      stroke="var(--primary)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, ease: "easeInOut", delay: 0.55 }}
                    />
                    <motion.g
                      initial={reduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 2.15 }}
                    >
                      <rect x={311} y={19} width="6" height="6" fill="var(--accent)" />
                      <text
                        x={306}
                        y={13}
                        textAnchor="end"
                        fontSize="10"
                        fill="var(--accent)"
                        style={{ fontFamily: "var(--mono-font), monospace" }}
                      >
                        +2.14%
                      </text>
                    </motion.g>
                  </svg>
                </div>

                {/* Ledger rows file in after the ink dries */}
                <ul className="mt-3">
                  {INDEX_ROWS.map((r, i) => (
                    <motion.li
                      key={r.sym}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 1.1 + i * 0.14 }}
                      className={`flex items-baseline py-2.5 ${
                        i > 0 ? "border-t border-[var(--border)]" : ""
                      }`}
                    >
                      <span className="dxnight-mono text-sm text-[var(--foreground)]">{r.sym}</span>
                      <span className="dxnight-leader" />
                      <span
                        className={`dxnight-mono text-sm ${r.up ? "dxnight-up" : "dxnight-down"}`}
                      >
                        {r.val} {r.up ? "▲" : "▼"}
                      </span>
                    </motion.li>
                  ))}
                </ul>
                <div className="dxnight-rule mt-2 text-[var(--muted-foreground)]" />
                <p className="dxnight-mono mt-2 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                  MFA 2026 · №№ 001—012
                </p>

                {/* The date stamp thumps down last */}
                <motion.div
                  initial={reduced ? false : { opacity: 0, scale: 1.6, rotate: -14 }}
                  animate={{ opacity: 1, scale: 1, rotate: -6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 2.5 }}
                  className="dxnight-stamp dxnight-mono absolute -top-4 -end-3 text-[10px] uppercase tracking-[0.12em]"
                >
                  MFA · № 001 · 24H
                </motion.div>
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </div>

      {/* Ticker tape — the front page's printed base line */}
      <div className="dxnight-ticker" aria-hidden>
        <div className="dxnight-ticker-track">
          {[...TICKER, ...TICKER].map((q, i) => (
            <span key={i} className="dxnight-mono flex shrink-0 items-baseline gap-1.5 text-xs">
              <span className="text-[var(--muted-foreground)]">{q.sym}</span>
              <span className={q.up ? "dxnight-up" : "dxnight-down"}>
                {q.val} {q.up ? "▲" : "▼"}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
