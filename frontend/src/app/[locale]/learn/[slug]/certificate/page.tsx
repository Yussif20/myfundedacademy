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
import { motion, useReducedMotion } from "framer-motion";
import { Award, Loader2, Printer, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
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
      <div className="grid min-h-screen place-items-center bg-[var(--background)]">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

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
  const reduced = useReducedMotion();
  // Confetti burst on mount.
  useEffect(() => {
    if (reduced) return;
    const end = Date.now() + 600;
    const colors = ["#0F766E", "#14b8a6", "#F59E0B", "#fbbf24", "#ffffff"];
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
  }, [reduced]);

  const courseTitle = cert.course?.title || "—";
  const studentName = cert.user?.fullName || "—";
  const instructorName = cert.course?.instructor?.user.fullName;
  const issued = new Date(cert.issuedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative mx-auto max-w-4xl space-y-6 print:p-0">
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

      {/* Flip card wrapper — preserve 3D, perspective on parent */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, rotateY: -180, scale: 0.85 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, rotateY: 0, scale: 1 }}
        transition={{
          duration: reduced ? 0 : 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
          transformOrigin: "center",
        }}
        className="print:!transform-none"
      >
        {/* Slow continuous sway after entrance */}
        <motion.div
          animate={
            reduced
              ? {}
              : {
                  rotateY: [-2.5, 2.5, -2.5],
                  rotateX: [1.5, -1.5, 1.5],
                }
          }
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          style={{ transformStyle: "preserve-3d" }}
          className="print:!transform-none"
        >
          <CertificatePaper
            studentName={studentName}
            courseTitle={courseTitle}
            instructorName={instructorName}
            issued={issued}
            code={cert.code}
            t={t}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

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
      className="relative overflow-hidden rounded-2xl border-4 border-[#0F766E33] bg-white p-12 text-center text-slate-900 shadow-2xl print:rounded-none print:border-2 print:shadow-none"
    >
      {/* Decorative corner gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, #0F766E15 0%, transparent 35%), radial-gradient(circle at 90% 90%, #F59E0B15 0%, transparent 35%)",
        }}
      />

      {/* Foil shimmer band — animated horizontal sweep, screen only */}
      <div aria-hidden className="foil-sweep pointer-events-none absolute inset-0 print:hidden" />

      {/* Inner border frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-xl border border-[#0F766E20]"
      />

      <div className="relative space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#0F766E]">
          {t("subtitle")}
        </p>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900 md:text-4xl">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500">{t("thisCertifies")}</p>
        <p className="font-display text-4xl font-bold text-[#0F766E] md:text-5xl">{studentName}</p>
        <p className="text-sm text-slate-500">{t("hasCompleted")}</p>
        <p className="font-display text-2xl font-semibold text-slate-900 md:text-3xl">
          {courseTitle}
        </p>

        {instructorName && (
          <p className="text-sm text-slate-500">{t("instructedBy", { name: instructorName })}</p>
        )}

        {/* Foil seal */}
        <div className="flex justify-center pt-2">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full opacity-70 blur-xl print:hidden"
              style={{
                background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
              }}
            />
            <div
              className="seal-foil grid size-16 place-items-center rounded-full border-2 text-white shadow-lg print:bg-[#0F766E]"
              style={{
                borderColor: "#F59E0B",
                background: "linear-gradient(135deg, #0F766E 0%, #14b8a6 50%, #0F766E 100%)",
              }}
            >
              <ShieldCheck className="size-7" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div className="mx-auto h-px w-32 bg-[#0F766E66]" />

        <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">{t("issuedOn")}</p>
            <p className="mt-1 font-medium text-slate-700">{issued}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              {t("verificationCode")}
            </p>
            <p className="mt-1 font-mono font-medium text-slate-700">{code}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400">{t("verifyOnline", { code })}</p>
      </div>

      <style jsx>{`
        .foil-sweep {
          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(255, 215, 0, 0.18) 48%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 215, 0, 0.18) 52%,
            transparent 65%
          );
          background-size: 250% 100%;
          animation: foilSweep 5.5s ease-in-out infinite;
        }
        @keyframes foilSweep {
          0%,
          100% {
            background-position: 200% 0;
          }
          50% {
            background-position: -100% 0;
          }
        }
        .seal-foil {
          position: relative;
          background-size: 200% 200%;
          animation: sealShimmer 4s ease-in-out infinite;
        }
        @keyframes sealShimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @media print {
          .foil-sweep,
          .seal-foil {
            animation: none !important;
          }
        }
      `}</style>
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
