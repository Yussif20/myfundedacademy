"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type StatKey = "courses" | "instructors" | "students" | "watchTime";

const STATS: ReadonlyArray<{ key: StatKey; value: number; suffix?: string }> = [
  { key: "courses", value: 12, suffix: "+" },
  { key: "instructors", value: 8 },
  { key: "students", value: 2400, suffix: "+" },
  { key: "watchTime", value: 60, suffix: "+" },
];

/**
 * Acid Ledger stat strip — one joined row of bordered ledger cells sitting
 * right under the ticker tape, numerals in tabular mono counting up like a
 * P&L settling. Chartreuse is text-safe here via --dxacid-up (darkened pair
 * in light mode).
 */
export function AcidStats() {
  const t = useTranslations("home.stats");

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="dxacid-hard grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCell
              key={s.key}
              value={s.value}
              suffix={s.suffix}
              label={t(s.key)}
              className={[
                i % 2 === 1 ? "border-s-2" : "",
                i >= 2 ? "border-t-2 md:border-t-0" : "",
                i >= 1 ? "md:border-s-2" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCell({
  value,
  suffix = "",
  label,
  className,
}: {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
      duration: 1.4,
      ease: [0.2, 0, 0, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  const formatted =
    display >= 1000 ? `${(display / 1000).toFixed(display % 1000 === 0 ? 0 : 1)}k` : `${display}`;

  return (
    <div
      ref={ref}
      className={`border-[var(--dxacid-line)] px-4 py-8 text-center ${className ?? ""}`}
    >
      <p
        dir="ltr"
        className="font-mono text-4xl font-semibold tabular-nums tracking-tight md:text-5xl"
      >
        <span className="text-[var(--dxacid-up)]">{formatted}</span>
        <span className="text-[var(--accent)]">{suffix}</span>
      </p>
      <p className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
        {label}
      </p>
    </div>
  );
}
