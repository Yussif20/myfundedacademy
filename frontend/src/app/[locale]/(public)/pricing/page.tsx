"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link, useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { cn } from "@/lib/utils";
import {
  useCheckoutSubscriptionMutation,
  useGetMySubscriptionQuery,
  type SubscriptionPlan,
} from "@/redux/api/paymentsApi";
import { useAppSelector } from "@/redux/store";
import { Check, Loader2, Minus } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <Reveal>
        <SectionHeading
          as="h1"
          align="center"
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("subtitle")}
        />
      </Reveal>

      {error && (
        <div className="mx-auto mt-8 max-w-3xl">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Plans */}
      <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, idx) => {
          const isCurrent = Boolean(
            sub && sub.plan === plan.id && (sub.status === "ACTIVE" || sub.status === "TRIALING"),
          );
          const isPending = pendingPlan === plan.id && isLoading;
          return (
            <Reveal as="li" key={plan.id} delay={idx * 80}>
              <PlanCard
                plan={plan}
                isCurrent={isCurrent}
                isPending={isPending}
                loggedIn={Boolean(user)}
                onSubscribe={onSubscribe}
              />
            </Reveal>
          );
        })}
      </ul>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        {t("oneTimeAlt")}{" "}
        <Link
          href="/courses"
          className="text-primary underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          {t("oneTimeAltLink")}
        </Link>
        .
      </p>

      {/* Comparison */}
      <section className="mt-28">
        <Reveal>
          <SectionHeading align="center" title={t("compareTitle")} lead={t("compareSubtitle")} />
        </Reveal>

        {/* Desktop / tablet table */}
        <div className="mt-12 hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-paper-2/60">
                <th
                  scope="col"
                  className="eyebrow px-6 py-4 text-start font-medium text-muted-foreground"
                >
                  {t("feature")}
                </th>
                {plans.map((p) => (
                  <th
                    key={p.id}
                    scope="col"
                    className={cn(
                      "px-6 py-4 text-center font-display text-base font-medium",
                      p.highlighted && "text-primary",
                    )}
                  >
                    {t(`${p.key}.name`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {compareRows.map((row) => (
                <tr key={row.featKey}>
                  <th scope="row" className="px-6 py-4 text-start font-normal text-foreground">
                    {t(`feat.${row.featKey}`)}
                  </th>
                  {(["free", "starter", "pro", "proAnnual"] as const).map((col) => (
                    <td key={col} className="px-6 py-4 text-center">
                      <CompareCell value={row[col]} t={t} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: one list per plan */}
        <div className="mt-10 space-y-4 md:hidden">
          {plans.map((p) => (
            <div
              key={p.id}
              className={cn(
                "rounded-xl border bg-card p-5",
                p.highlighted ? "border-primary/40" : "border-border",
              )}
            >
              <h3 className={cn("font-display text-lg", p.highlighted && "text-primary")}>
                {t(`${p.key}.name`)}
              </h3>
              <ul className="mt-3 divide-y divide-border text-sm">
                {compareRows.map((row) => (
                  <li key={row.featKey} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-muted-foreground">{t(`feat.${row.featKey}`)}</span>
                    <CompareCell value={row[p.key as keyof CompareRow] as CompareValue} t={t} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
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
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-xl border bg-card p-7",
        plan.highlighted ? "border-primary/50" : "border-border",
      )}
    >
      {plan.highlighted && <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gold" />}

      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-2xl font-medium">{t(`${plan.key}.name`)}</h3>
        {plan.highlighted && !isCurrent && <span className="eyebrow">{t("mostPopular")}</span>}
        {isCurrent && <Badge variant="success">{t("current")}</Badge>}
      </div>

      <p className="mt-2 min-h-[3em] text-sm leading-6 text-muted-foreground">
        {t(`${plan.key}.description`)}
      </p>

      <p className="mt-6 flex items-baseline gap-1.5 border-t border-border pt-6">
        <span className="font-display text-5xl font-light tabular-nums" dir="ltr">
          {plan.price}
        </span>
        <span className="text-sm text-muted-foreground">/ {t(`${plan.key}.cadence`)}</span>
      </p>

      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span className="leading-6">{t(`${plan.key}.${f}`)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {plan.id === "FREE" ? (
          loggedIn ? (
            <Button className="w-full" variant="outline" disabled>
              {t("freeTierActive")}
            </Button>
          ) : (
            <Button asChild className="w-full" variant="outline">
              <Link href="/signup">{t(`${plan.key}.cta`)}</Link>
            </Button>
          )
        ) : (
          <Button
            className="w-full"
            variant={plan.highlighted ? "default" : "outline"}
            disabled={isPending || isCurrent}
            onClick={() => onSubscribe(plan.id as SubscriptionPlan)}
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden />
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
  );
}

function CompareCell({ value, t }: { value: CompareValue; t: ReturnType<typeof useTranslations> }) {
  const tCommon = useTranslations("common");
  if (value === "yes")
    return <Check className="mx-auto size-4 text-primary" aria-label={tCommon("yes")} />;
  if (value === "no")
    return <Minus className="mx-auto size-4 text-rule-strong" aria-label={tCommon("no")} />;
  if (value === "limited") {
    return <span className="text-xs text-muted-foreground">{t("limited")}</span>;
  }
  return (
    <span className="font-display text-base text-accent tabular-nums" dir="ltr">
      {value}
    </span>
  );
}
