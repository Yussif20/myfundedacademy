"use client";

import { themeColor } from "@/lib/theme-colors";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
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

/** Chart colours read from the theme tokens, refreshed when light/dark changes. */
function useChartColors() {
  const { resolvedTheme } = useTheme();
  const read = () => ({
    primary: themeColor("primary"),
    gold: themeColor("gold", "#b08a3e"),
    muted: themeColor("muted-foreground", "#6b665c"),
    grid: themeColor("border", "#e4ddcf"),
  });
  const [colors, setColors] = useState(read);
  useEffect(() => {
    // Wait a frame so next-themes has swapped the class on <html>.
    const id = requestAnimationFrame(() => setColors(read()));
    return () => cancelAnimationFrame(id);
  }, [resolvedTheme]);
  return colors;
}

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
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg tabular-nums text-foreground">
        {unit}
        {payload[0].value.toLocaleString("en-US")}
      </p>
    </div>
  );
}

export function RevenueChart() {
  const c = useChartColors();

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.primary} stopOpacity={0.18} />
              <stop offset="100%" stopColor={c.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: c.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fill: c.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            content={<ChartTooltip unit="$" />}
            cursor={{ stroke: c.gold, strokeOpacity: 0.6 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={c.primary}
            strokeWidth={1.75}
            fill="url(#revenueFill)"
            isAnimationActive
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EnrollmentsChart() {
  const c = useChartColors();

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={enrollmentsData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: c.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={{ fill: c.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: c.grid, fillOpacity: 0.5 }} />
          <Bar
            dataKey="value"
            fill={c.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
            isAnimationActive
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
