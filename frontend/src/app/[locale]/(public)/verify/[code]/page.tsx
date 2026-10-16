"use client";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Link } from "@/i18n/navigation";
import { confettiColors } from "@/lib/theme-colors";
import { useVerifyCertificateQuery } from "@/redux/api/quizzesApi";
import confetti from "canvas-confetti";
import { Check, Loader2, Share2, ShieldX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VerifyCertificatePage() {
  const params = useParams();
  const code = String(params?.code || "");
  const t = useTranslations("verifyPage");
  const locale = useLocale();
  const isAr = locale === "ar";
  const { data, isLoading, isError } = useVerifyCertificateQuery(code, { skip: !code });

  const cert = data?.data;
  const valid = !isError && Boolean(cert);

  // A small confetti burst when the certificate checks out.
  useEffect(() => {
    if (!valid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    confetti({
      particleCount: 70,
      spread: 70,
      startVelocity: 28,
      scalar: 0.85,
      origin: { x: 0.5, y: 0.35 },
      colors: confettiColors(),
    });
  }, [valid]);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: cert?.user?.fullName ?? t("verified"), url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(t("linkCopied"));
      }
    } catch {
      // user dismissed share dialog — no-op
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  const courseTitle =
    (isAr && (cert?.course as { titleArabic?: string } | undefined)?.titleArabic) ||
    cert?.course?.title;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <div className="lesson-enter relative rounded-xl border border-border bg-card px-6 py-12 text-center md:px-12">
        {valid && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-lg border border-gold/40"
          />
        )}

        <div className="relative">
          {valid ? <Seal /> : <FailedMark />}

          <Eyebrow className="mt-8 justify-center">
            {t("code")} ·{" "}
            <span dir="ltr" className="font-mono normal-case tracking-normal">
              {code}
            </span>
          </Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight">
            {valid ? t("verified") : t("notFound")}
          </h1>

          {valid && cert ? (
            <div className="mt-10 space-y-8">
              <div>
                <p className="text-sm text-muted-foreground">{t("issuedTo")}</p>
                <p className="mt-2 font-display text-3xl italic text-primary">
                  {cert.user?.fullName}
                </p>
              </div>
              <div aria-hidden className="mx-auto h-px w-24 bg-gold/60" />
              <div>
                <p className="text-sm text-muted-foreground">{t("forCompleting")}</p>
                <p className="mt-2 font-display text-2xl">{courseTitle}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("issuedOnDate", {
                  date: new Date(cert.issuedAt).toLocaleDateString(
                    isAr ? "ar-EG-u-nu-latn" : "en-US",
                    {
                      dateStyle: "long",
                    },
                  ),
                })}
              </p>
              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                <Button onClick={onShare} variant="outline" className="gap-2">
                  <Share2 className="size-4" aria-hidden />
                  {t("share")}
                </Button>
                <Button asChild>
                  <Link href="/courses">{t("browseCourses")}</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">
                {t("notFoundBlurb")}
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link href="/">{t("backToHome")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** A gold double-ring seal with a check, echoing the printed certificate. */
function Seal() {
  return (
    <div className="mx-auto grid size-20 place-items-center rounded-full border border-gold p-1">
      <div className="grid size-full place-items-center rounded-full border border-dashed border-gold text-gold">
        <Check className="size-8" strokeWidth={1.5} aria-hidden />
      </div>
    </div>
  );
}

function FailedMark() {
  return (
    <div className="mx-auto grid size-20 place-items-center rounded-full border border-destructive/40 text-destructive">
      <ShieldX className="size-8" strokeWidth={1.5} aria-hidden />
    </div>
  );
}
