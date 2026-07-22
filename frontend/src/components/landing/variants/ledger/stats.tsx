"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type StatKey = "courses" | "instructors" | "students" | "watchTime";
type Stat = { key: StatKey; value: number; suffix?: string };

const STATS: Stat[] = [
  { key: "courses", value: 12, suffix: "+" },
  { key: "instructors", value: 8 },
  { key: "students", value: 2400, suffix: "+" },
  { key: "watchTime", value: 60, suffix: "+" },
];

/**
 * "The Ledger Club" balance sheet — the four figures set as champagne-foil
 * tabular numerals inside one registered certificate frame, each entry closed
 * by a short engraved rule and a small-caps label. Figures count up like a
 * ledger being totalled (frozen under reduced motion).
 */
export function LedgerStats() {
  const t = useTranslations("home.stats");

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="dxledger-frame dxledger-ticks relative px-6 py-10 md:px-12 md:py-12">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {STATS.map((s) => (
              <StatEntry key={s.key} value={s.value} suffix={s.suffix} label={t(s.key)} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StatEntry({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
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
    <li ref={ref} className="text-center">
      <p dir="ltr" className="font-display text-4xl tracking-tight md:text-5xl">
        <span className="dxledger-figure">{formatted}</span>
        <span className="font-semibold text-[var(--dxledger-gold)]">{suffix}</span>
      </p>
      <span className="dxledger-rule mx-auto mt-4 w-10" aria-hidden />
      <p className="dxledger-smallcaps mt-3 text-[10px] text-[var(--muted-foreground)]">{label}</p>
    </li>
  );
}
