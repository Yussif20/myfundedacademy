"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type StatKey = "courses" | "instructors" | "students" | "watchTime";

const STATS: { key: StatKey; value: number; suffix?: string }[] = [
  { key: "courses", value: 12, suffix: "+" },
  { key: "instructors", value: 8 },
  { key: "students", value: 2400, suffix: "+" },
  { key: "watchTime", value: 60, suffix: "+" },
];

/**
 * Phosphor Terminal Noir — the readout strip.
 * A single registration-ticked instrument panel divided into hairline cells;
 * numerals spin up in tabular mono like quotes settling, full precision
 * ("2,400", not "2.4k") — an order book, not a marketing counter.
 */
export function PhosphorStats() {
  const t = useTranslations("home.stats");

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="dxphosphor-ticks relative">
          <ul className="grid grid-cols-2 gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
            {STATS.map((s, i) => (
              <StatCell
                key={s.key}
                index={String(i + 1).padStart(2, "0")}
                value={s.value}
                suffix={s.suffix}
                label={t(s.key)}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StatCell({
  index,
  value,
  suffix = "",
  label,
}: {
  index: string;
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

  return (
    <li ref={ref} className="bg-[var(--card)] px-6 py-8">
      <p
        aria-hidden
        className="mb-4 font-mono text-[10px] tracking-[0.08em] text-[var(--muted-foreground)] opacity-60"
      >
        {index}
      </p>
      <p dir="ltr" className="font-mono text-4xl font-semibold tracking-tight md:text-5xl">
        <span className="text-[var(--foreground)]">{display.toLocaleString("en-US")}</span>
        <span className="text-[var(--primary)]">{suffix}</span>
      </p>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
        {label}
      </p>
    </li>
  );
}
