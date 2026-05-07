"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 30 days of revenue (mock — replace with live aggregate when backend ships).
function makeRevenueData() {
  const base = 800;
  const today = new Date();
  return Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const noise = (Math.sin(i * 0.7) + Math.cos(i * 0.3)) * 120;
    const trend = i * 14;
    const value = Math.max(0, Math.round(base + trend + noise + (i % 7 === 0 ? 350 : 0)));
    return {
      date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      value,
    };
  });
}

const revenueData = makeRevenueData();

const enrollmentsData = [
  { month: "Dec", value: 24 },
  { month: "Jan", value: 38 },
  { month: "Feb", value: 52 },
  { month: "Mar", value: 71 },
  { month: "Apr", value: 88 },
  { month: "May", value: 124 },
];

const PRIMARY = "#0F766E";
const PRIMARY_LIGHT = "#14b8a6";
const ACCENT = "#F59E0B";
const MUTED = "#94a3b8";

function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unit?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg backdrop-blur"
      style={{
        background: "color-mix(in oklch, var(--card) 92%, transparent)",
        borderColor: "color-mix(in oklch, var(--primary) 30%, transparent)",
      }}
    >
      <p className="font-medium text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-1 font-display text-base font-bold text-[var(--primary)]">
        {unit}
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export function RevenueChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY_LIGHT} stopOpacity={0.45} />
              <stop offset="100%" stopColor={PRIMARY_LIGHT} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={PRIMARY} />
              <stop offset="100%" stopColor={ACCENT} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={MUTED} strokeOpacity={0.1} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: MUTED, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fill: MUTED, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            content={<ChartTooltip unit="$" />}
            cursor={{ stroke: PRIMARY, strokeOpacity: 0.3 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#revenueStroke)"
            strokeWidth={2.5}
            fill="url(#revenueFill)"
            isAnimationActive
            animationDuration={1100}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function EnrollmentsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={enrollmentsData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY} />
              <stop offset="100%" stopColor={PRIMARY_LIGHT} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={MUTED} strokeOpacity={0.1} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: MUTED, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={{ fill: MUTED, fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: PRIMARY, fillOpacity: 0.06 }} />
          <Bar
            dataKey="value"
            fill="url(#barFill)"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
