"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { EditionSection } from "./edition-section";

type StatKey = "courses" | "instructors" | "students" | "watchTime";
type Stat = { key: StatKey; value: number; suffix?: string };

/* Same figures as the shared stats row. */
const STATS: Stat[] = [
  { key: "courses", value: 12, suffix: "+" },
  { key: "instructors", value: 8 },
  { key: "students", value: 2400, suffix: "+" },
  { key: "watchTime", value: 60, suffix: "+" },
];

/**
 * The market summary — the academy's own figures printed as a ruled ledger
 * plate: a "MFA · IDX" header row, four columns split by vertical hairlines,
 * each opened by a short vermilion tick, tabular-mono numerals counting up.
 * No glass card, no glow — a table on the market page.
 */
export function NightMarketSummary({ index }: { index: string }) {
  const t = useTranslations("home.stats");

  return (
    <EditionSection index={index}>
      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="dxnight-frame px-6 py-8 md:px-10 md:py-10">
            <div className="flex items-baseline justify-between" aria-hidden>
              <span className="dxnight-kicker text-[var(--muted-foreground)]">MFA · IDX</span>
              <span className="dxnight-mono text-[11px] text-[var(--muted-foreground)]">24H</span>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-y-10 md:grid-cols-4">
              {STATS.map((s, i) => (
                <LedgerStat
                  key={s.key}
                  value={s.value}
                  suffix={s.suffix}
                  label={t(s.key)}
                  ruled={i > 0}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </EditionSection>
  );
}

function LedgerStat({
  value,
  suffix = "",
  label,
  ruled,
}: {
  value: number;
  suffix?: string;
  label: string;
  ruled: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  const formatted =
    display >= 1000 ? `${(display / 1000).toFixed(display % 1000 === 0 ? 0 : 1)}k` : `${display}`;

  return (
    <li
      ref={ref}
      className={`px-2 text-center md:px-6 ${ruled ? "md:border-s md:border-[var(--border)]" : ""}`}
    >
      <span className="mx-auto mb-4 block h-0.5 w-8 bg-[var(--accent)]" aria-hidden />
      <p dir="ltr" className="dxnight-mono text-4xl text-[var(--foreground)] md:text-5xl">
        {formatted}
        <span className="text-[var(--accent)]">{suffix}</span>
      </p>
      <p className="dxnight-kicker mt-3 text-[var(--muted-foreground)]">{label}</p>
    </li>
  );
}
