"use client";

import { ScrollReveal } from "@/components/motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import {
  useCheckoutSubscriptionMutation,
  useGetMySubscriptionQuery,
  type SubscriptionPlan,
} from "@/redux/api/paymentsApi";
import { useAppSelector } from "@/redux/store";
import { motion } from "framer-motion";
import { Check, Loader2, Minus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type PlanKey = "free" | "starter" | "pro" | "proAnnual";

type Plan = {
  id: SubscriptionPlan | "FREE";
  key: PlanKey;
  price: string;
  highlighted?: boolean;
  features: Array<"f1" | "f2" | "f3" | "f4">;
};

const plans: Plan[] = [
  { id: "FREE", key: "free", price: "$0", features: ["f1", "f2", "f3"] },
  { id: "STARTER_MONTHLY", key: "starter", price: "$29", features: ["f1", "f2", "f3"] },
  {
    id: "PRO_MONTHLY",
    key: "pro",
    price: "$79",
    highlighted: true,
    features: ["f1", "f2", "f3", "f4"],
  },
  { id: "PRO_ANNUAL", key: "proAnnual", price: "$790", features: ["f1", "f2", "f3"] },
];

type CompareValue = "yes" | "no" | "limited" | string;
type CompareRow = {
  featKey: string;
  free: CompareValue;
  starter: CompareValue;
  pro: CompareValue;
  proAnnual: CompareValue;
};

const compareRows: CompareRow[] = [
  { featKey: "catalog", free: "limited", starter: "yes", pro: "yes", proAnnual: "yes" },
  { featKey: "previews", free: "yes", starter: "yes", pro: "yes", proAnnual: "yes" },
  { featKey: "drm", free: "yes", starter: "yes", pro: "yes", proAnnual: "yes" },
  { featKey: "watermark", free: "yes", starter: "yes", pro: "yes", proAnnual: "yes" },
  { featKey: "quizzes", free: "limited", starter: "yes", pro: "yes", proAnnual: "yes" },
  { featKey: "certificates", free: "no", starter: "no", pro: "yes", proAnnual: "yes" },
  { featKey: "downloads", free: "no", starter: "no", pro: "yes", proAnnual: "yes" },
  { featKey: "priorityQa", free: "no", starter: "no", pro: "yes", proAnnual: "yes" },
  { featKey: "savings", free: "no", starter: "no", pro: "no", proAnnual: "~17%" },
];

export default function PricingPage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const { data: subRes } = useGetMySubscriptionQuery(undefined, { skip: !user });
  const sub = subRes?.data;
  const [checkout, { isLoading }] = useCheckoutSubscriptionMutation();
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("pricing");

  const onSubscribe = async (plan: SubscriptionPlan) => {
    setError(null);
    if (!user) {
      router.push("/login");
      return;
    }
    setPendingPlan(plan);
    try {
      const res = await checkout({ plan }).unwrap();
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      setError(extractApiError(err));
      setPendingPlan(null);
    }
  };

  return (
    <div className="relative">
      {/* Top accent gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in oklch, var(--primary) 30%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklch,var(--primary)_30%,transparent)] bg-[color-mix(in_oklch,var(--primary)_8%,transparent)] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
              <Sparkles className="size-3" />
              Pricing
            </span>
            <h1 className="font-display mt-5 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-balance text-[var(--muted-foreground)] md:text-lg">
              {t("subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {error && (
          <div className="mx-auto mt-6 max-w-3xl">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Tier cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, idx) => {
            const isCurrent = Boolean(
              sub && sub.plan === plan.id && (sub.status === "ACTIVE" || sub.status === "TRIALING"),
            );
            const isPending = pendingPlan === plan.id && isLoading;
            return (
              <ScrollReveal key={plan.id} delay={idx * 0.07} amount={0.2}>
                <PlanCard
                  plan={plan}
                  isCurrent={isCurrent}
                  isPending={isPending}
                  loggedIn={Boolean(user)}
                  onSubscribe={onSubscribe}
                />
              </ScrollReveal>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-[var(--muted-foreground)]">
          {t("oneTimeAlt")}{" "}
          <Link href="/courses" className="text-[var(--primary)] hover:underline">
            {t("oneTimeAltLink")}
          </Link>
          .
        </p>

        {/* Comparison table */}
        <div className="mt-24">
          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="font-display text-balance text-3xl font-bold tracking-tight md:text-4xl">
                {t("compareTitle")}
              </h2>
              <p className="mt-3 text-[var(--muted-foreground)]">{t("compareSubtitle")}</p>
            </div>
          </ScrollReveal>

          {/* Desktop / tablet table */}
          <div className="hidden overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_60%,transparent)] backdrop-blur md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_80%,transparent)]">
                    <th className="px-5 py-4 text-left font-medium text-[var(--muted-foreground)]">
                      Feature
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.id}
                        className={`px-5 py-4 text-center font-display font-semibold ${
                          p.highlighted ? "text-[var(--primary)]" : ""
                        }`}
                      >
                        {t(`${p.key}.name`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, i) => (
                    <CompareRowAnimated key={row.featKey} row={row} index={i} t={t} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile per-plan stack */}
          <div className="space-y-4 md:hidden">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl border p-5 backdrop-blur ${
                  p.highlighted
                    ? "border-[color-mix(in_oklch,var(--primary)_45%,transparent)] bg-[color-mix(in_oklch,var(--card)_92%,transparent)]"
                    : "border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_70%,transparent)]"
                }`}
              >
                <h3
                  className={`font-display text-base font-semibold ${
                    p.highlighted ? "text-[var(--primary)]" : ""
                  }`}
                >
                  {t(`${p.key}.name`)}
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {compareRows.map((row) => {
                    const value = row[p.key as keyof CompareRow] as CompareValue;
                    return (
                      <li
                        key={row.featKey}
                        className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklch,var(--border)_50%,transparent)] py-1.5 last:border-0"
                      >
                        <span className="text-[var(--muted-foreground)]">
                          {t(`feat.${row.featKey}`)}
                        </span>
                        <CompareCell value={value} t={t} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  isCurrent,
  isPending,
  loggedIn,
  onSubscribe,
}: {
  plan: Plan;
  isCurrent: boolean;
  isPending: boolean;
  loggedIn: boolean;
  onSubscribe: (plan: SubscriptionPlan) => void;
}) {
  const t = useTranslations("pricing");

  return (
    <div className="group relative h-full">
      {/* Animated rotating conic halo — highlighted plans only */}
      {plan.highlighted && (
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -inset-px rounded-[calc(var(--radius)+4px)] opacity-70 blur-[6px]"
          style={{
            background:
              "conic-gradient(from 0deg, color-mix(in oklch, var(--primary) 65%, transparent), color-mix(in oklch, var(--accent) 60%, transparent), color-mix(in oklch, var(--primary) 65%, transparent))",
          }}
        />
      )}

      <div
        className={`relative flex h-full flex-col rounded-2xl border p-6 backdrop-blur transition-all duration-300 group-hover:-translate-y-1 ${
          plan.highlighted
            ? "border-[color-mix(in_oklch,var(--primary)_50%,transparent)] bg-[color-mix(in_oklch,var(--card)_92%,transparent)] shadow-2xl shadow-[color-mix(in_oklch,var(--primary)_25%,transparent)]"
            : "border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_75%,transparent)] hover:border-[color-mix(in_oklch,var(--primary)_30%,transparent)]"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{t(`${plan.key}.name`)}</h3>
          {plan.highlighted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--primary-foreground)]">
              <Sparkles className="size-3" />
              {t("mostPopular")}
            </span>
          )}
          {isCurrent && <Badge variant="success">{t("current")}</Badge>}
        </div>

        <p className="mt-2 min-h-[2.5em] text-sm text-[var(--muted-foreground)]">
          {t(`${plan.key}.description`)}
        </p>

        <div className="mt-6 flex items-baseline gap-1">
          <span
            className={`font-display text-4xl font-bold ${
              plan.highlighted ? "text-gradient-brand" : ""
            }`}
          >
            {plan.price}
          </span>
          <span className="text-xs text-[var(--muted-foreground)]">
            / {t(`${plan.key}.cadence`)}
          </span>
        </div>

        <ul className="mt-6 flex-1 space-y-3 text-sm">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span
                className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--primary) 15%, transparent)",
                  color: "var(--primary)",
                }}
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span>{t(`${plan.key}.${f}`)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {plan.id === "FREE" ? (
            loggedIn ? (
              <Button className="w-full" variant="outline" disabled>
                {t("freeTierActive")}
              </Button>
            ) : (
              <Button
                asChild
                className={`w-full ${plan.highlighted ? "brand-glow" : ""}`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link href="/signup">{t(`${plan.key}.cta`)}</Link>
              </Button>
            )
          ) : (
            <Button
              className={`w-full ${plan.highlighted ? "brand-glow" : ""}`}
              variant={plan.highlighted ? "default" : "outline"}
              disabled={isPending || isCurrent}
              onClick={() => onSubscribe(plan.id as SubscriptionPlan)}
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {t("redirecting")}
                </span>
              ) : isCurrent ? (
                t("yourCurrentPlan")
              ) : (
                t(`${plan.key}.cta`)
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CompareRowAnimated({
  row,
  index,
  t,
}: {
  row: CompareRow;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-[color-mix(in_oklch,var(--border)_60%,transparent)] transition-colors hover:bg-[color-mix(in_oklch,var(--primary)_4%,transparent)]"
    >
      <td className="px-5 py-3.5 font-medium text-[var(--foreground)]">
        {t(`feat.${row.featKey}`)}
      </td>
      {(["free", "starter", "pro", "proAnnual"] as const).map((col) => (
        <td key={col} className="px-5 py-3.5 text-center">
          <CompareCell value={row[col]} t={t} />
        </td>
      ))}
    </motion.tr>
  );
}

function CompareCell({ value, t }: { value: CompareValue; t: ReturnType<typeof useTranslations> }) {
  if (value === "yes") {
    return (
      <span
        className="grid mx-auto size-6 place-items-center rounded-full text-[var(--primary)]"
        style={{ background: "color-mix(in oklch, var(--primary) 12%, transparent)" }}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (value === "no") {
    return <Minus className="mx-auto size-4 text-[var(--muted-foreground)]" />;
  }
  if (value === "limited") {
    return (
      <span className="text-xs font-medium text-[var(--muted-foreground)]">{t("limited")}</span>
    );
  }
  return <span className="text-sm font-semibold text-[var(--accent)]">{value}</span>;
}
