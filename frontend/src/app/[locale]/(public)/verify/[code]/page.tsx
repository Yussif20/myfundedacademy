"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useVerifyCertificateQuery } from "@/redux/api/quizzesApi";
import confetti from "canvas-confetti";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Share2, ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VerifyCertificatePage() {
  const params = useParams();
  const code = String(params?.code || "");
  const t = useTranslations("verifyPage");
  const { data, isLoading, isError } = useVerifyCertificateQuery(code, { skip: !code });
  const reduced = useReducedMotion();

  const cert = data?.data;
  const valid = !isError && Boolean(cert);

  // Soft confetti burst when verified
  useEffect(() => {
    if (!valid || reduced) return;
    const colors = ["#0F766E", "#14b8a6", "#F59E0B", "#fbbf24", "#ffffff"];
    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 30,
      scalar: 0.85,
      origin: { x: 0.5, y: 0.35 },
      colors,
    });
  }, [valid, reduced]);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: cert?.user?.fullName ? `${cert.user.fullName} — Certificate` : "Certificate",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // user dismissed share dialog — no-op
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-xl px-6 py-16">
      {/* Top accent gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in oklch, var(--primary) 25%, transparent), transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card
          className={
            valid
              ? "relative overflow-hidden border-[color-mix(in_oklch,var(--primary)_40%,transparent)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur brand-glow"
              : "border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur"
          }
        >
          {valid && (
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 size-[400px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--primary) 50%, transparent), transparent 60%)",
              }}
            />
          )}

          <CardHeader className="relative text-center">
            {valid ? <AnimatedCheck /> : <FailedMark />}
            <CardTitle className="mt-3 font-display text-2xl">
              {valid ? t("verified") : t("notFound")}
            </CardTitle>
            <CardDescription>
              {t("code")}: <span className="font-mono">{code}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4 text-center">
            {valid && cert ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-[var(--muted-foreground)]">{t("issuedTo")}</p>
                  <p className="font-display text-2xl font-semibold">{cert.user?.fullName}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.4 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-[var(--muted-foreground)]">{t("forCompleting")}</p>
                  <p className="font-display text-xl font-semibold">{cert.course?.title}</p>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.95 }}
                  className="text-sm text-[var(--muted-foreground)]"
                >
                  {t("issuedOnDate", { date: new Date(cert.issuedAt).toLocaleDateString() })}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="flex flex-col items-center justify-center gap-2 pt-2 sm:flex-row"
                >
                  <Button onClick={onShare} variant="outline" className="gap-2">
                    <Share2 className="size-4" />
                    Share
                  </Button>
                  <Button asChild className="brand-glow">
                    <Link href="/courses">{t("browseCourses")}</Link>
                  </Button>
                </motion.div>
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
      </motion.div>
    </div>
  );
}

function AnimatedCheck() {
  return (
    <div className="relative mx-auto grid size-16 place-items-center">
      {/* Pulse halo */}
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 35%, transparent), transparent 65%)",
        }}
      />
      {/* Outer ring */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        className="relative grid size-16 place-items-center rounded-full border-2 border-[var(--primary)]"
        style={{
          background: "color-mix(in oklch, var(--primary) 12%, transparent)",
        }}
      >
        {/* Animated check path */}
        <svg viewBox="0 0 32 32" className="size-9 text-[var(--primary)]">
          <motion.path
            d="M7 16.5 L13 22.5 L25 10.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

function FailedMark() {
  return (
    <div className="relative mx-auto grid size-16 place-items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        className="grid size-16 place-items-center rounded-full text-[var(--destructive)]"
        style={{ background: "color-mix(in oklch, var(--destructive) 12%, transparent)" }}
      >
        <ShieldX className="size-8" strokeWidth={2.2} />
      </motion.div>
    </div>
  );
}
