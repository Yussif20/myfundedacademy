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
import { confettiColors } from "@/lib/theme-colors";
import { cn } from "@/lib/utils";
import {
  useAttemptQuizMutation,
  useGetCourseQuizForStudentQuery,
  type QuizAttemptResult,
} from "@/redux/api/quizzesApi";
import confetti from "canvas-confetti";
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
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
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
      {result ? (
        <div key="result" className="lesson-enter">
          <ResultCard result={result} slug={slug} onRetake={() => setResult(null)} />
        </div>
      ) : (
        <div key="quiz" className="lesson-enter">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-3xl font-medium tracking-tight">
                    {title}
                  </CardTitle>
                  <CardDescription>
                    {t("questionCount", { count: quiz.questions.length })} ·{" "}
                    {t("passingScore", { score: quiz.passingScore })}
                  </CardDescription>
                </div>
                <div className="hidden text-end sm:block">
                  <p
                    className="font-display text-3xl font-light tabular-nums text-primary"
                    dir="ltr"
                  >
                    {answeredCount}/{totalCount}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("answered")}</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              <ol className="space-y-8">
                {quiz.questions.map((q, qi) => {
                  const promptText = (isAr && q.promptArabic) || q.prompt;
                  return (
                    <li key={q.id} className="space-y-3">
                      <p className="flex gap-3 font-display text-lg leading-snug">
                        <span className="tabular-nums text-gold">
                          {String(qi + 1).padStart(2, "0")}
                        </span>
                        <span>{promptText}</span>
                      </p>
                      <ul className="space-y-2">
                        {q.options.map((o) => {
                          const optText = (isAr && o.textArabic) || o.text;
                          const selected = answers[q.id] === o.id;
                          return (
                            <li key={o.id}>
                              <button
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                                className={cn(
                                  "group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-colors",
                                  selected
                                    ? "border-primary bg-primary/8"
                                    : "border-border bg-card hover:border-rule-strong",
                                )}
                              >
                                <span
                                  className={cn(
                                    "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                                    selected
                                      ? "border-primary bg-primary"
                                      : "border-rule-strong group-hover:border-primary",
                                  )}
                                >
                                  {selected && (
                                    <span className="size-2 rounded-full bg-primary-foreground" />
                                  )}
                                </span>
                                <span className="flex-1">{optText}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ol>

              <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button asChild variant="ghost" className="gap-2">
                  <Link href={`/learn/${slug}` as `/learn/${string}`}>
                    <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
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
        </div>
      )}
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
  // Confetti burst on pass — once per result.
  useEffect(() => {
    if (!result.passed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = confettiColors();
    const fire = (ratio: number, opts: Parameters<typeof confetti>[0]) => {
      confetti({
        ...opts,
        particleCount: Math.floor(200 * ratio),
        spread: 80,
        startVelocity: 35,
        scalar: 0.9,
        ticks: 200,
        colors,
      });
    };
    fire(0.25, { angle: 60, origin: { x: 0, y: 0.7 } });
    fire(0.25, { angle: 120, origin: { x: 1, y: 0.7 } });
    fire(0.5, { angle: 90, origin: { x: 0.5, y: 0.4 } });
  }, [result.passed]);

  return (
    <Card className={cn("overflow-hidden", result.passed && "border-gold/60")}>
      <CardHeader className="text-center">
        <div
          className={cn(
            "mx-auto grid size-16 place-items-center rounded-full border",
            result.passed ? "border-gold/60 text-gold" : "border-destructive/40 text-destructive",
          )}
        >
          {result.passed ? (
            <CheckCircle2 className="size-7" strokeWidth={1.5} aria-hidden />
          ) : (
            <XCircle className="size-7" strokeWidth={1.5} aria-hidden />
          )}
        </div>
        <div>
          <CardTitle className="mt-5 font-display text-4xl font-medium tracking-tight">
            {result.passed ? t("passed") : t("notYet")}
          </CardTitle>
          <CardDescription className="mt-2">
            {t("scoreLine", { score: result.score, passing: result.passingScore })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          {t("correctOf", { correct: result.correct, total: result.total })}
        </p>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
          {result.passed ? (
            <Button asChild variant="gold" className="gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
}

function Shell({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" aria-label="Home" className="hidden md:block">
            <Wordmark height={32} />
          </Link>
          {title && <p className="line-clamp-1 font-display text-base">{title}</p>}
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">{children}</section>
    </div>
  );
}
