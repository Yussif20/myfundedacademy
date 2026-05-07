"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import {
  useBillingPortalMutation,
  useCancelSubscriptionMutation,
  useGetMySubscriptionQuery,
  useListMyOrdersQuery,
} from "@/redux/api/paymentsApi";
import { ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";

const planLabel: Record<string, string> = {
  STARTER_MONTHLY: "Starter · Monthly",
  PRO_MONTHLY: "Pro · Monthly",
  PRO_ANNUAL: "Pro · Annual",
};

export default function BillingPage() {
  const { data: subRes, isLoading: subLoading, refetch: refetchSub } = useGetMySubscriptionQuery();
  const { data: ordersRes, isLoading: ordersLoading } = useListMyOrdersQuery();
  const [cancel, { isLoading: canceling }] = useCancelSubscriptionMutation();
  const [openPortal, { isLoading: openingPortal }] = useBillingPortalMutation();
  const [error, setError] = useState<string | null>(null);

  const sub = subRes?.data;
  const orders = ordersRes?.data || [];

  const onCancel = async () => {
    setError(null);
    if (!confirm("Cancel at period end? You'll keep access until your billing period ends."))
      return;
    try {
      await cancel().unwrap();
      refetchSub();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const onPortal = async () => {
    setError(null);
    try {
      const res = await openPortal().unwrap();
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Manage your subscription and view past purchases.
        </p>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and billing cycle.</CardDescription>
        </CardHeader>
        <CardContent>
          {subLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-[var(--primary)]" />
            </div>
          ) : !sub ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                You don't have an active subscription.
              </p>
              <Button asChild>
                <Link href="/pricing">View plans</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <p className="font-display text-xl font-semibold">{planLabel[sub.plan]}</p>
                <StatusBadge status={sub.status} cancelAtPeriodEnd={sub.cancelAtPeriodEnd} />
              </div>

              {sub.currentPeriodEnd && (
                <p className="text-sm text-[var(--muted-foreground)]">
                  {sub.cancelAtPeriodEnd
                    ? `Access ends ${new Date(sub.currentPeriodEnd).toLocaleDateString()}.`
                    : `Next charge ${new Date(sub.currentPeriodEnd).toLocaleDateString()}.`}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={onPortal}
                  disabled={openingPortal}
                  variant="outline"
                  className="gap-2"
                >
                  {openingPortal ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ExternalLink className="size-4" />
                  )}
                  Manage in Stripe
                </Button>
                {!sub.cancelAtPeriodEnd && (
                  <Button onClick={onCancel} disabled={canceling} variant="ghost">
                    {canceling ? "Canceling…" : "Cancel at period end"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order history</CardTitle>
          <CardDescription>Your one-time course purchases.</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-[var(--primary)]" />
            </div>
          ) : orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
              No orders yet.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {o.course?.title || (o.type === "SUBSCRIPTION" ? "Subscription" : "Order")}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {new Date(o.createdAt).toLocaleDateString()} · {o.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${o.amount.toFixed(2)}</p>
                    <Badge
                      variant={
                        o.status === "COMPLETED"
                          ? "success"
                          : o.status === "FAILED"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {o.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({
  status,
  cancelAtPeriodEnd,
}: {
  status: string;
  cancelAtPeriodEnd: boolean;
}) {
  if (cancelAtPeriodEnd) return <Badge variant="warning">Ending</Badge>;
  if (status === "ACTIVE" || status === "TRIALING")
    return <Badge variant="success">{status}</Badge>;
  if (status === "PAST_DUE" || status === "UNPAID")
    return <Badge variant="destructive">{status}</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}
