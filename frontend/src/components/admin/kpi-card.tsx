"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  Icon: LucideIcon;
  delta?: number; // percent change
  format?: "currency" | "number" | "percent";
  delay?: number;
};

export function KpiCard({
  label,
  value,
  prefix,
  suffix,
  Icon,
  delta,
  format = "number",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
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
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduced, value, delay]);

  const formatted = (() => {
    if (format === "currency") {
      return display.toLocaleString(undefined, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      });
    }
    if (format === "percent") {
      return display.toFixed(0);
    }
    return Math.round(display).toLocaleString();
  })();

  const deltaPositive = (delta ?? 0) >= 0;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] p-5 backdrop-blur transition-colors hover:border-[color-mix(in_oklch,var(--primary)_30%,transparent)]"
    >
      <div className="relative flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
          {label}
        </p>
        <span
          className="grid size-9 place-items-center rounded-xl text-[var(--primary)]"
          style={{
            background: "color-mix(in oklch, var(--primary) 12%, transparent)",
            border: "1px solid color-mix(in oklch, var(--primary) 22%, transparent)",
          }}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="font-display relative mt-3 text-3xl font-bold tracking-tight">
        {prefix}
        {formatted}
        {suffix}
      </p>
      {typeof delta === "number" && (
        <p
          className={`relative mt-1 inline-flex items-center gap-1 text-xs font-medium ${
            deltaPositive ? "text-[var(--primary)]" : "text-[var(--destructive)]"
          }`}
        >
          {deltaPositive ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {Math.abs(delta).toFixed(1)}% vs last period
        </p>
      )}
    </div>
  );
}
