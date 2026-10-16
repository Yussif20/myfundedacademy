"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useVerifyEmailMutation } from "@/redux/api/authApi";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Status = "verifying" | "ok" | "fail";

export default function VerifyEmailPage() {
  const t = useTranslations("auth.verify");
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [status, setStatus] = useState<Status>("verifying");
  const ranRef = useRef(false);
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token || ranRef.current) return;
    ranRef.current = true;
    verifyEmail({ token })
      .unwrap()
      .then(() => setStatus("ok"))
      .catch(() => setStatus("fail"));
  }, [token, verifyEmail]);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full border border-border bg-card">
          {status === "verifying" && <Loader2 className="size-6 animate-spin text-primary" />}
          {status === "ok" && <CheckCircle2 className="size-6 text-primary" />}
          {status === "fail" && <XCircle className="size-6 text-destructive" />}
        </div>
        <CardTitle className="mt-5 font-display text-2xl font-medium">{t("title")}</CardTitle>
        <CardDescription>
          {status === "verifying" && t("verifying")}
          {status === "ok" && t("success")}
          {status === "fail" && t("failed")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {status === "ok" && (
          <Button asChild className="w-full">
            <Link href="/login">{t("successCta")}</Link>
          </Button>
        )}
        {status === "fail" && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/check-email">{t("resendCta")}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
