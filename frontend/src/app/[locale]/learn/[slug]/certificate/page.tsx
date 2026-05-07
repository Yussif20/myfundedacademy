"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthGuard } from "@/components/auth-guard";
import { Link } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import {
  useGetMyCertificateForCourseQuery,
  useIssueCertificateMutation,
} from "@/redux/api/quizzesApi";
import { Award, Loader2, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CertificatePage() {
  return (
    <AuthGuard>
      <CertificateContent />
    </AuthGuard>
  );
}

function CertificateContent() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const t = useTranslations("certPage");

  const { data, isLoading, refetch } = useGetMyCertificateForCourseQuery(slug, { skip: !slug });
  const [issue, { isLoading: issuing }] = useIssueCertificateMutation();
  const [error, setError] = useState<string | null>(null);

  const cert = data?.data;

  const onIssue = async () => {
    setError(null);
    try {
      await issue({ slug }).unwrap();
      refetch();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--background)]">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  // No cert yet — show "Get my certificate" button
  if (!cert) {
    return (
      <Shell>
        <Card className="mx-auto max-w-xl text-center">
          <CardHeader>
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <Award className="size-7" />
            </div>
            <CardTitle className="mt-3">{t("earnTitle")}</CardTitle>
            <CardDescription>{t("earnDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={onIssue} disabled={issuing} className="gap-2">
                {issuing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Award className="size-4" />
                )}
                {t("getMyCertificate")}
              </Button>
              <Button asChild variant="outline">
                <Link href={`/learn/${slug}` as `/learn/${string}`}>{t("backToCourse")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell printable>
      <CertificateView cert={cert} />
    </Shell>
  );
}

function CertificateView({
  cert,
}: {
  cert: {
    code: string;
    issuedAt: string;
    course?: {
      title?: string;
      titleArabic?: string;
      slug?: string;
      instructor?: { user: { fullName: string } };
    };
    user?: { fullName?: string; email?: string };
  };
}) {
  const t = useTranslations("certPage");
  const courseTitle = cert.course?.title || "—";
  const studentName = cert.user?.fullName || "—";
  const instructorName = cert.course?.instructor?.user.fullName;
  const issued = new Date(cert.issuedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={`/learn/${cert.course?.slug}` as `/learn/${string}`}
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          ← {t("backToCourse")}
        </Link>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="size-4" />
          {t("printPdf")}
        </Button>
      </div>

      {/* The actual certificate "paper" */}
      <div
        id="certificate-paper"
        className="relative overflow-hidden rounded-2xl border-4 border-[var(--primary)]/20 bg-white p-12 text-center text-slate-900 shadow-2xl print:rounded-none print:border-2 print:shadow-none"
      >
        {/* Decorative corner flourishes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 10%, #0F766E15 0%, transparent 35%), radial-gradient(circle at 90% 90%, #F59E0B15 0%, transparent 35%)",
          }}
        />

        <div className="relative space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#0F766E]">
            {t("subtitle")}
          </p>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900 md:text-4xl">
            {t("title")}
          </h1>
          <p className="text-sm text-slate-500">{t("thisCertifies")}</p>
          <p className="font-display text-4xl font-bold text-[#0F766E] md:text-5xl">
            {studentName}
          </p>
          <p className="text-sm text-slate-500">{t("hasCompleted")}</p>
          <p className="font-display text-2xl font-semibold text-slate-900 md:text-3xl">
            {courseTitle}
          </p>

          {instructorName && (
            <p className="text-sm text-slate-500">{t("instructedBy", { name: instructorName })}</p>
          )}

          <div className="mx-auto h-px w-32 bg-[#0F766E]/40" />

          <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">{t("issuedOn")}</p>
              <p className="mt-1 font-medium text-slate-700">{issued}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                {t("verificationCode")}
              </p>
              <p className="mt-1 font-mono font-medium text-slate-700">{cert.code}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400">{t("verifyOnline", { code: cert.code })}</p>
        </div>
      </div>
    </div>
  );
}

function Shell({ printable, children }: { printable?: boolean; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header
        className={
          printable
            ? "border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur print:hidden"
            : "border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur"
        }
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" aria-label="Home" className="hidden md:block">
            <Wordmark height={36} />
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-4 py-8 md:px-6 print:px-0 print:py-4">
        {children}
      </section>
    </div>
  );
}
