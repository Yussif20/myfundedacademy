"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Stat = { key: keyof Stats; value: number; suffix?: string };
type Stats = {
  courses: string;
  instructors: string;
  students: string;
  watchTime: string;
};

const stats: Stat[] = [
  { key: "courses", value: 12, suffix: "+" },
  { key: "instructors", value: 8 },
  { key: "students", value: 2400, suffix: "+" },
  { key: "watchTime", value: 60, suffix: "+" },
];

export function StatsRow() {
  const t = useTranslations("home.stats");

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="glass relative overflow-hidden rounded-2xl px-6 py-10 md:px-12"
          style={{ borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 40%, transparent), transparent)",
            }}
          />
          <ul className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <StatItem key={s.key} value={s.value} suffix={s.suffix} label={t(s.key)} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StatItem({
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
      <p dir="ltr" className="font-display text-4xl font-bold tracking-tight md:text-5xl">
        <span className="text-gradient-brand">{formatted}</span>
        <span className="text-[var(--accent)]">{suffix}</span>
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
        {label}
      </p>
    </li>
  );
}
