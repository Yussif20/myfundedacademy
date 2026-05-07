"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import {
  useGetMyOrderBySessionQuery,
  useListMyEnrollmentsQuery,
  useGetMySubscriptionQuery,
} from "@/redux/api/paymentsApi";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const type = params.get("type") || "course"; // "course" or "subscription"

  const isSub = type === "subscription";
  const [pollAttempt, setPollAttempt] = useState(0);

  // Poll the right resource until the webhook reflects the purchase.
  const orderQuery = useGetMyOrderBySessionQuery(sessionId, {
    skip: !sessionId || isSub,
    pollingInterval: 2000,
  });
  const subQuery = useGetMySubscriptionQuery(undefined, {
    skip: !isSub,
    pollingInterval: 2000,
  });
  const enrollmentsQuery = useListMyEnrollmentsQuery(undefined, {
    skip: isSub,
    pollingInterval: 2000,
  });

  const orderCompleted = orderQuery.data?.data?.status === "COMPLETED";
  const subActive =
    subQuery.data?.data?.status === "ACTIVE" || subQuery.data?.data?.status === "TRIALING";

  const done = isSub ? subActive : orderCompleted;
  const courseSlug = !isSub && orderCompleted ? orderQuery.data?.data?.course?.slug : null;

  useEffect(() => {
    const t = setInterval(() => setPollAttempt((n) => n + 1), 2500);
    if (done) clearInterval(t);
    return () => clearInterval(t);
  }, [done]);

  // Stop polling after ~30 seconds even if not done — avoid infinite spin.
  useEffect(() => {
    if (pollAttempt > 12) {
      // best-effort manual refetch then stop
      orderQuery.refetch?.();
      subQuery.refetch?.();
      enrollmentsQuery.refetch?.();
    }
  }, [pollAttempt, orderQuery, subQuery, enrollmentsQuery]);

  const stillWaiting = pollAttempt < 12 && !done;
  const t = useTranslations("checkout");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 py-16">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
            {stillWaiting ? (
              <Loader2 className="size-7 animate-spin" />
            ) : (
              <CheckCircle2 className="size-7" />
            )}
          </div>
          <CardTitle className="mt-3">
            {stillWaiting ? t("confirming") : isSub ? t("subActivated") : t("purchaseComplete")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stillWaiting ? (
            <p className="text-sm text-[var(--muted-foreground)]">{t("confirmingBlurb")}</p>
          ) : isSub ? (
            <>
              <p className="text-sm text-[var(--muted-foreground)]">{t("subActivatedBlurb")}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="flex-1">
                  <Link href="/courses">{t("browseCourses")}</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/account/billing">{t("manageSubscription")}</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--muted-foreground)]">{t("purchaseCompleteBlurb")}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                {courseSlug && (
                  <Button asChild className="flex-1">
                    <Link href={{ pathname: `/courses/${courseSlug}` }}>{t("startLearning")}</Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/account/courses">{t("myCourses")}</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
