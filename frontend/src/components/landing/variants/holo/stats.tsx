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

/** Stats as a full-width terminal readout rail: hairline-ruled cells, huge
 *  tabular mono numerals counting up, mono eyebrow labels — an order book,
 *  not a marketing band. */
export function HoloStats() {
  const t = useTranslations("home.stats");

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <ul className="grid grid-cols-2 border-y border-[var(--border)] md:grid-cols-4">
          {STATS.map((s, i) => (
            <Readout key={s.key} index={i} value={s.value} suffix={s.suffix} label={t(s.key)} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Readout({
  index,
  value,
  suffix = "",
  label,
}: {
  index: number;
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

  const cellBorders = [
    index % 2 === 1 ? "border-s border-[var(--border)]" : "",
    index > 1 ? "border-t border-[var(--border)] md:border-t-0" : "",
    index > 0 ? "md:border-s md:border-[var(--border)]" : "",
  ].join(" ");

  return (
    <li ref={ref} className={`px-6 py-9 md:px-8 ${cellBorders}`}>
      <p className="dxholo-num text-[11px] tracking-[0.14em] text-[var(--muted-foreground)]">
        {String(index + 1).padStart(2, "0")}
      </p>
      <p
        dir="ltr"
        className="dxholo-num mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl"
      >
        {display.toLocaleString("en-US")}
        <span className="text-[var(--accent)]">{suffix}</span>
      </p>
      <p className="dxholo-num mt-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {label}
      </p>
    </li>
  );
}
