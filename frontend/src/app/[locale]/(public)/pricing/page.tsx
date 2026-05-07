"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import {
  useCheckoutSubscriptionMutation,
  useGetMySubscriptionQuery,
  type SubscriptionPlan,
} from "@/redux/api/paymentsApi";
import { useAppSelector } from "@/redux/store";
import { Check, Loader2 } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </div>

      {error && (
        <div className="mx-auto mt-6 max-w-3xl">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = Boolean(
            sub && sub.plan === plan.id && (sub.status === "ACTIVE" || sub.status === "TRIALING"),
          );
          const isPending = pendingPlan === plan.id && isLoading;

          return (
            <Card
              key={plan.id}
              className={
                plan.highlighted
                  ? "border-[var(--primary)] shadow-lg ring-1 ring-[var(--primary)]/30"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t(`${plan.key}.name`)}</CardTitle>
                  {plan.highlighted && <Badge>{t("mostPopular")}</Badge>}
                  {isCurrent && <Badge variant="success">{t("current")}</Badge>}
                </div>
                <CardDescription>{t(`${plan.key}.description`)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="font-display text-4xl font-bold">{plan.price}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t(`${plan.key}.cadence`)}
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
                      <span>{t(`${plan.key}.${f}`)}</span>
                    </li>
                  ))}
                </ul>
                {plan.id === "FREE" ? (
                  user ? (
                    <Button className="w-full" variant="outline" disabled>
                      {t("freeTierActive")}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
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
              </CardContent>
            </Card>
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
    </div>
  );
}
