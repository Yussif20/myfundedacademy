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
import { useState } from "react";

type Plan = {
  id: SubscriptionPlan | "FREE";
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Browse the catalog and watch every free preview lesson.",
    features: ["Browse all courses", "Watch free preview lessons", "1 quiz attempt per course"],
    cta: "Sign up",
  },
  {
    id: "STARTER_MONTHLY",
    name: "Starter",
    price: "$29",
    cadence: "per month",
    description: "Curated catalog of starter courses for the price of a takeaway.",
    features: [
      "Selected catalog (Starter tier)",
      "Watch on any device, DRM-protected",
      "Cancel anytime",
    ],
    cta: "Subscribe to Starter",
  },
  {
    id: "PRO_MONTHLY",
    name: "Pro",
    price: "$79",
    cadence: "per month",
    description: "Everything we publish, certificates, downloadable resources, priority Q&A.",
    features: [
      "Full catalog (Pro tier)",
      "Verified certificates",
      "Downloadable resources",
      "Priority instructor Q&A",
    ],
    cta: "Subscribe to Pro",
    highlighted: true,
  },
  {
    id: "PRO_ANNUAL",
    name: "Pro · Annual",
    price: "$790",
    cadence: "per year",
    description: "Two months free vs monthly Pro. Best for the serious trader.",
    features: ["Everything in Pro", "Save ~17% vs monthly", "Single annual charge"],
    cta: "Subscribe annually",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const { data: subRes } = useGetMySubscriptionQuery(undefined, { skip: !user });
  const sub = subRes?.data;
  const [checkout, { isLoading }] = useCheckoutSubscriptionMutation();
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Pick the plan that fits your journey
        </h1>
        <p className="mt-4 text-[var(--muted-foreground)]">
          Subscribe for ongoing access, or buy individual courses outright. Cancel anytime.
        </p>
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
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.highlighted && <Badge>Most popular</Badge>}
                  {isCurrent && <Badge variant="success">Current</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="font-display text-4xl font-bold">{plan.price}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{plan.cadence}</p>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.id === "FREE" ? (
                  user ? (
                    <Button className="w-full" variant="outline" disabled>
                      Free tier active
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      <Link href="/signup">{plan.cta}</Link>
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
                        Redirecting…
                      </span>
                    ) : isCurrent ? (
                      "Your current plan"
                    ) : (
                      plan.cta
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-10 text-center text-sm text-[var(--muted-foreground)]">
        Want lifetime access to a single course instead?{" "}
        <Link href="/courses" className="text-[var(--primary)] hover:underline">
          Browse one-time-purchase courses
        </Link>
        .
      </p>
    </div>
  );
}
