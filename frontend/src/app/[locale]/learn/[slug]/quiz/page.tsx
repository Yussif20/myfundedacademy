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
import { cn } from "@/lib/utils";
import {
  useAttemptQuizMutation,
  useGetCourseQuizForStudentQuery,
  type QuizAttemptResult,
} from "@/redux/api/quizzesApi";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ChevronLeft, Loader2, XCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizPage() {
  return (
    <AuthGuard>
      <QuizContent />
    </AuthGuard>
  );
}

function QuizContent() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("quizPage");

  const { data, isLoading, isError, error } = useGetCourseQuizForStudentQuery(slug, {
    skip: !slug,
  });
  const [submit, { isLoading: submitting }] = useAttemptQuizMutation();

  const quiz = data?.data;

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!quiz) return;
    setSubmitError(null);
    if (Object.keys(answers).length < quiz.questions.length) {
      setSubmitError(t("answerEvery"));
      return;
    }
    try {
      const res = await submit({ slug, answers }).unwrap();
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(extractApiError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--background)]">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (isError || !quiz) {
    const status = (error as { status?: number })?.status;
    return (
      <Shell>
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>{status === 404 ? t("noQuizYet") : t("quizUnavailable")}</CardTitle>
            <CardDescription>
              {status === 404 ? t("noQuizDescription") : t("quizUnavailableDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/learn/${slug}` as `/learn/${string}`}>{t("backToCourse")}</Link>
            </Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  const title = (isAr && quiz.titleArabic) || quiz.title || t("title");
  const answeredCount = Object.keys(answers).length;
  const totalCount = quiz.questions.length;
  const completionPct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  return (
    <Shell title={title}>
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ResultCard result={result} slug={slug} onRetake={() => setResult(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="overflow-hidden border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_80%,transparent)] backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                      {t("questionCount", { count: quiz.questions.length })} ·{" "}
                      {t("passingScore", { score: quiz.passingScore })}
                    </CardDescription>
                  </div>
                  <div className="hidden text-end sm:block">
                    <p className="font-display text-2xl font-bold text-[var(--primary)]">
                      {answeredCount}/{totalCount}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
                      Answered
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklch,var(--secondary)_70%,transparent)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPct}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {submitError && (
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
                <ol className="space-y-7">
                  {quiz.questions.map((q, qi) => {
                    const promptText = (isAr && q.promptArabic) || q.prompt;
                    return (
                      <li key={q.id} className="space-y-3">
                        <p className="font-medium">
                          <span className="text-[var(--muted-foreground)]">{qi + 1}. </span>
                          {promptText}
                        </p>
                        <ul className="space-y-2">
                          {q.options.map((o) => {
                            const optText = (isAr && o.textArabic) || o.text;
                            const selected = answers[q.id] === o.id;
                            return (
                              <li key={o.id}>
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                                  className={cn(
                                    "group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-all",
                                    selected
                                      ? "border-[var(--primary)] bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] shadow-sm shadow-[color-mix(in_oklch,var(--primary)_25%,transparent)]"
                                      : "border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_60%,transparent)] hover:border-[color-mix(in_oklch,var(--primary)_30%,transparent)] hover:bg-[color-mix(in_oklch,var(--primary)_5%,transparent)]",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                                      selected
                                        ? "border-[var(--primary)] bg-[var(--primary)]"
                                        : "border-[var(--border)] group-hover:border-[var(--primary)]/60",
                                    )}
                                  >
                                    <AnimatePresence>
                                      {selected && (
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          exit={{ scale: 0 }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 480,
                                            damping: 22,
                                          }}
                                          className="size-2 rounded-full bg-[var(--primary-foreground)]"
                                        />
                                      )}
                                    </AnimatePresence>
                                  </span>
                                  <span className="flex-1">{optText}</span>
                                </motion.button>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ol>

                <div className="flex flex-col gap-3 border-t border-[color-mix(in_oklch,var(--border)_60%,transparent)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <Button asChild variant="ghost" className="gap-2">
                    <Link href={`/learn/${slug}` as `/learn/${string}`}>
                      <ChevronLeft className="size-4 rtl:rotate-180" />
                      {t("backToCourse")}
                    </Link>
                  </Button>
                  <Button size="lg" onClick={onSubmit} disabled={submitting} className="gap-2">
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-4" />
                    )}
                    {t("submit")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

function ResultCard({
  result,
  slug,
  onRetake,
}: {
  result: QuizAttemptResult;
  slug: string;
  onRetake: () => void;
}) {
  const t = useTranslations("quizPage");
  const reduced = useReducedMotion();

  // Confetti burst on pass — once per result.
  useEffect(() => {
    if (!result.passed || reduced) return;
    const fire = (ratio: number, opts: Parameters<typeof confetti>[0]) => {
      confetti({
        ...opts,
        particleCount: Math.floor(200 * ratio),
        spread: 80,
        startVelocity: 35,
        scalar: 0.9,
        ticks: 200,
        colors: ["#0F766E", "#14b8a6", "#F59E0B", "#fbbf24", "#ffffff"],
      });
    };
    fire(0.25, { angle: 60, origin: { x: 0, y: 0.7 } });
    fire(0.25, { angle: 120, origin: { x: 1, y: 0.7 } });
    fire(0.5, { angle: 90, origin: { x: 0.5, y: 0.4 } });
  }, [result.passed, reduced]);

  return (
    <Card
      className={cn(
        "overflow-hidden border bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur",
        result.passed
          ? "border-[color-mix(in_oklch,var(--primary)_40%,transparent)]"
          : "border-[var(--border)]",
      )}
    >
      <CardHeader className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
          className={cn(
            "relative mx-auto grid size-16 place-items-center rounded-full",
            result.passed
              ? "bg-[color-mix(in_oklch,var(--primary)_15%,transparent)] text-[var(--primary)]"
              : "bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)] text-[var(--destructive)]",
          )}
        >
          {result.passed && (
            <motion.span
              aria-hidden
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--primary) 35%, transparent), transparent 65%)",
              }}
            />
          )}
          {result.passed ? (
            <CheckCircle2 className="relative size-8" strokeWidth={2.5} />
          ) : (
            <XCircle className="relative size-8" strokeWidth={2.5} />
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <CardTitle className="mt-4 font-display text-3xl">
            {result.passed ? t("passed") : t("notYet")}
          </CardTitle>
          <CardDescription className="mt-2">
            {t("scoreLine", { score: result.score, passing: result.passingScore })}
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-[var(--muted-foreground)]"
        >
          {t("correctOf", { correct: result.correct, total: result.total })}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col gap-2 sm:flex-row sm:justify-center"
        >
          {result.passed ? (
            <Button asChild className="gap-2">
              <Link href={`/learn/${slug}/certificate` as `/learn/${string}/certificate`}>
                {t("getCertificate")}
              </Link>
            </Button>
          ) : (
            <Button onClick={onRetake}>{t("retake")}</Button>
          )}
          <Button asChild variant="outline">
            <Link href={`/learn/${slug}` as `/learn/${string}`}>{t("backToCourse")}</Link>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function Shell({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_80%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" aria-label="Home" className="hidden md:block">
            <Wordmark height={36} />
          </Link>
          {title && <p className="line-clamp-1 text-sm text-[var(--muted-foreground)]">{title}</p>}
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 py-8 md:px-6">{children}</section>
    </div>
  );
}
