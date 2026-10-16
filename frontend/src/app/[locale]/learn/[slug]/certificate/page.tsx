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
import confetti from "canvas-confetti";
import { Award, ChevronLeft, Loader2, Printer, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (!cert) {
    return (
      <Shell>
        <Card className="mx-auto max-w-xl text-center">
          <CardHeader>
            <div className="mx-auto grid size-16 place-items-center rounded-full border border-gold/60 text-gold">
              <Award className="size-7" strokeWidth={1.5} aria-hidden />
            </div>
            <CardTitle className="mt-5 font-display text-3xl font-medium tracking-tight">
              {t("earnTitle")}
            </CardTitle>
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
  const locale = useLocale();
  const isAr = locale === "ar";

  // One short confetti burst on mount, in the certificate's own colours.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = [CERT.teal, CERT.gold, CERT.goldSoft];
    const end = Date.now() + 600;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        startVelocity: 35,
        scalar: 0.9,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        startVelocity: 35,
        scalar: 0.9,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  const courseTitle = (isAr && cert.course?.titleArabic) || cert.course?.title || "—";
  const studentName = cert.user?.fullName || "—";
  const instructorName = cert.course?.instructor?.user.fullName;
  const issued = new Date(cert.issuedAt).toLocaleDateString(isAr ? "ar-EG-u-nu-latn" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 print:max-w-none print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={`/learn/${cert.course?.slug}` as `/learn/${string}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("backToCourse")}
        </Link>
        <Button onClick={() => window.print()} variant="outline" className="gap-2">
          <Printer className="size-4" aria-hidden />
          {t("printPdf")}
        </Button>
      </div>

      <div className="lesson-enter">
        <CertificatePaper
          studentName={studentName}
          courseTitle={courseTitle}
          instructorName={instructorName}
          issued={issued}
          code={cert.code}
          t={t}
        />
      </div>
    </div>
  );
}

/**
 * The certificate keeps one fixed ivory, ink and gold palette in both themes so the
 * screen version matches the printed page.
 */
const CERT = {
  paper: "#fbf8f0",
  ink: "#1c1b18",
  muted: "#6b665c",
  teal: "#1f5c4f",
  gold: "#b08a3e",
  goldSoft: "#d9c48f",
};

function CertificatePaper({
  studentName,
  courseTitle,
  instructorName,
  issued,
  code,
  t,
}: {
  studentName: string;
  courseTitle: string;
  instructorName?: string;
  issued: string;
  code: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      id="certificate-paper"
      style={
        {
          "--cp": CERT.paper,
          "--ci": CERT.ink,
          "--cm": CERT.muted,
          "--ct": CERT.teal,
          "--cg": CERT.gold,
        } as React.CSSProperties
      }
      className="relative bg-[var(--cp)] px-8 py-14 text-center text-[var(--ci)] shadow-[0_30px_60px_-30px_rgb(28_27_24/0.45)] [print-color-adjust:exact] md:px-16 md:py-16 print:shadow-none"
    >
      {/* Double gold rule frame */}
      <div aria-hidden className="pointer-events-none absolute inset-3 border border-[var(--cg)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[18px] border border-[var(--cg)] opacity-40"
      />

      <div className="relative space-y-6">
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden className="h-px w-10 bg-[var(--cg)]" />
          <p className="font-display text-lg tracking-wide text-[var(--ct)]">{t("subtitle")}</p>
          <span aria-hidden className="h-px w-10 bg-[var(--cg)]" />
        </div>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="text-sm text-[var(--cm)]">{t("thisCertifies")}</p>
        <p className="font-display text-4xl font-medium italic text-[var(--ct)] md:text-6xl">
          {studentName}
        </p>
        <div aria-hidden className="mx-auto h-px w-48 bg-[var(--cg)] opacity-60" />
        <p className="text-sm text-[var(--cm)]">{t("hasCompleted")}</p>
        <p className="mx-auto max-w-2xl font-display text-2xl leading-snug md:text-3xl">
          {courseTitle}
        </p>

        {instructorName && (
          <p className="text-sm text-[var(--cm)]">{t("instructedBy", { name: instructorName })}</p>
        )}

        <div className="grid items-end gap-8 pt-6 text-sm md:grid-cols-[1fr_auto_1fr]">
          <div>
            <p className="font-medium">{issued}</p>
            <div aria-hidden className="mx-auto mt-2 h-px w-40 bg-[var(--ci)] opacity-30" />
            <p className="mt-2 text-xs text-[var(--cm)]">{t("issuedOn")}</p>
          </div>

          {/* Gold seal */}
          <div className="mx-auto grid size-20 place-items-center rounded-full border border-[var(--cg)] p-1">
            <div className="grid size-full place-items-center rounded-full border border-dashed border-[var(--cg)] text-[var(--cg)]">
              <ShieldCheck className="size-7" strokeWidth={1.5} aria-hidden />
            </div>
          </div>

          <div>
            <p className="font-mono font-medium" dir="ltr">
              {code}
            </p>
            <div aria-hidden className="mx-auto mt-2 h-px w-40 bg-[var(--ci)] opacity-30" />
            <p className="mt-2 text-xs text-[var(--cm)]">{t("verificationCode")}</p>
          </div>
        </div>

        <p className="pt-2 text-xs text-[var(--cm)]">{t("verifyOnline", { code })}</p>
      </div>
    </div>
  );
}

function Shell({ printable, children }: { printable?: boolean; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground print:bg-white">
      <header
        className={printable ? "border-b border-border print:hidden" : "border-b border-border"}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" aria-label="Home" className="hidden md:block">
            <Wordmark height={32} />
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14 print:px-0 print:py-0">
        {children}
      </section>
    </div>
  );
}
