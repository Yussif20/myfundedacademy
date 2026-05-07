"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useVerifyCertificateQuery } from "@/redux/api/quizzesApi";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function VerifyCertificatePage() {
  const params = useParams();
  const code = String(params?.code || "");
  const t = useTranslations("verifyPage");
  const { data, isLoading, isError } = useVerifyCertificateQuery(code, { skip: !code });

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const cert = data?.data;
  const valid = !isError && Boolean(cert);

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <Card>
        <CardHeader className="text-center">
          <div
            className={
              valid
                ? "mx-auto grid size-14 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]"
                : "mx-auto grid size-14 place-items-center rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)]"
            }
          >
            {valid ? <CheckCircle2 className="size-7" /> : <XCircle className="size-7" />}
          </div>
          <CardTitle className="mt-3">{valid ? t("verified") : t("notFound")}</CardTitle>
          <CardDescription>
            {t("code")}: <span className="font-mono">{code}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {valid && cert ? (
            <>
              <p className="text-[var(--muted-foreground)]">{t("issuedTo")}</p>
              <p className="font-display text-2xl font-semibold">{cert.user?.fullName}</p>
              <p className="text-[var(--muted-foreground)]">{t("forCompleting")}</p>
              <p className="font-display text-xl font-semibold">{cert.course?.title}</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {t("issuedOnDate", { date: new Date(cert.issuedAt).toLocaleDateString() })}
              </p>
              <Button asChild className="mt-4">
                <Link href="/courses">{t("browseCourses")}</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-[var(--muted-foreground)]">{t("notFoundBlurb")}</p>
              <Button asChild className="mt-4">
                <Link href="/">{t("backToHome")}</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
