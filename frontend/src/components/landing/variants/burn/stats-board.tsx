"use client";

import { ScrollReveal } from "@/components/motion";
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

/* Cell dividers: hairlines, never thick borders — 2x2 mobile, 1x4 desktop. */
const CELL_BORDERS = [
  "",
  "border-s",
  "border-t md:border-t-0 md:border-s",
  "border-s border-t md:border-t-0",
];

/**
 * Controlled Burn stats — the session P&L board.
 * One heat-seam ledger frame divided by hairlines into four cells; each
 * figure counts up in tabular mono digits under a tape micro-label.
 */
export function BurnStatsBoard() {
  const t = useTranslations("home.stats");

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="dxburn-seam overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--card)]">
            <ul className="grid grid-cols-2 md:grid-cols-4">
              {STATS.map((s, i) => (
                <BoardCell
                  key={s.key}
                  value={s.value}
                  suffix={s.suffix}
                  label={t(s.key)}
                  borders={CELL_BORDERS[i]}
                />
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function BoardCell({
  value,
  suffix = "",
  label,
  borders,
}: {
  value: number;
  suffix?: string;
  label: string;
  borders: string;
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
    <li ref={ref} className={`border-[var(--border)] px-6 py-10 text-center md:py-12 ${borders}`}>
      <p dir="ltr" className="font-mono text-4xl font-semibold tabular-nums md:text-5xl">
        <span className="text-gradient-brand">{formatted}</span>
        {suffix && <span className="text-[var(--accent)]">{suffix}</span>}
      </p>
      <p className="dxburn-micro mt-3 text-[var(--muted-foreground)]">{label}</p>
    </li>
  );
}
