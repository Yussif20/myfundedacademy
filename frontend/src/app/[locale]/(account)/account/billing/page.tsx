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
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function BillingPage() {
  const { data: subRes, isLoading: subLoading, refetch: refetchSub } = useGetMySubscriptionQuery();
  const { data: ordersRes, isLoading: ordersLoading } = useListMyOrdersQuery();
  const [cancel, { isLoading: canceling }] = useCancelSubscriptionMutation();
  const [openPortal, { isLoading: openingPortal }] = useBillingPortalMutation();
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("accountBilling");
  const tPlan = useTranslations("pricing.planLabels");

  const sub = subRes?.data;
  const orders = ordersRes?.data || [];

  const onCancel = async () => {
    setError(null);
    if (!confirm(t("confirmCancel"))) return;
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
        <h1 className="font-display text-4xl font-medium tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("subscription")}</CardTitle>
          <CardDescription>{t("subscriptionDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {subLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : !sub ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("noActiveSub")}</p>
              <Button asChild>
                <Link href="/pricing">{t("viewPlans")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <p className="font-display text-2xl">{tPlan(sub.plan)}</p>
                <StatusBadge status={sub.status} cancelAtPeriodEnd={sub.cancelAtPeriodEnd} />
              </div>

              {sub.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  {sub.cancelAtPeriodEnd
                    ? t("accessEndsOn", {
                        date: new Date(sub.currentPeriodEnd).toLocaleDateString(),
                      })
                    : t("nextChargeOn", {
                        date: new Date(sub.currentPeriodEnd).toLocaleDateString(),
                      })}
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
                  {t("manageInStripe")}
                </Button>
                {!sub.cancelAtPeriodEnd && (
                  <Button onClick={onCancel} disabled={canceling} variant="ghost">
                    {canceling ? t("canceling") : t("cancelAtPeriodEnd")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("orderHistory")}</CardTitle>
          <CardDescription>{t("orderHistoryDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("noOrders")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {o.course?.title ||
                        (o.type === "SUBSCRIPTION" ? t("subscriptionLabel") : t("orderLabel"))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString()} · {o.type}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="font-display text-lg tabular-nums">${o.amount.toFixed(2)}</p>
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
  const t = useTranslations("accountBilling");
  if (cancelAtPeriodEnd) return <Badge variant="warning">{t("ending")}</Badge>;
  if (status === "ACTIVE" || status === "TRIALING")
    return <Badge variant="success">{status}</Badge>;
  if (status === "PAST_DUE" || status === "UNPAID")
    return <Badge variant="destructive">{status}</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}
