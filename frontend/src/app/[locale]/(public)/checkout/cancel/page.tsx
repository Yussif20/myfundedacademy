"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckoutCancelPage() {
  const t = useTranslations("checkout");
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 py-16">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto grid size-14 place-items-center rounded-full border border-border bg-card text-rule-strong">
            <XCircle className="size-7" />
          </div>
          <CardTitle className="mt-5 font-display text-2xl font-medium">
            {t("canceledTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("canceledBlurb")}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/courses">{t("browseCourses")}</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/pricing">{t("viewPlans")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
