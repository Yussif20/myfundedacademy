"use client";

import { CountUp } from "@/components/ui/count-up";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  Icon: LucideIcon;
  delta?: number; // percent change
  format?: "currency" | "number" | "percent";
  /** Pre-formatted text shown instead of the counting number (e.g. a decimal rating). */
  display?: string;
  /** Kept for call-site compatibility; figures count up together now. */
  delay?: number;
};

/** A dashboard figure: eyebrow label, light serif number, optional change line. */
export function KpiCard({ label, value, prefix, suffix, Icon, delta, display }: Props) {
  const t = useTranslations("common");
  const deltaPositive = (delta ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow !text-[10px]">{label}</p>
        <Icon className="size-4 shrink-0 text-rule-strong" aria-hidden />
      </div>
      <p className="mt-4 font-display text-4xl font-light tabular-nums tracking-tight" dir="ltr">
        {prefix}
        {display ?? <CountUp value={Math.round(value)} />}
        {suffix}
      </p>
      {typeof delta === "number" && (
        <p
          className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
            deltaPositive ? "text-success" : "text-destructive"
          }`}
        >
          {deltaPositive ? (
            <ArrowUpRight className="size-3" aria-hidden />
          ) : (
            <ArrowDownRight className="size-3" aria-hidden />
          )}
          <span className="tabular-nums">{Math.abs(delta).toFixed(1)}%</span> {t("vsLastPeriod")}
        </p>
      )}
    </div>
  );
}
