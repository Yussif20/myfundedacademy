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
import { CheckCircle2, ChevronLeft, Loader2, XCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

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

  return (
    <Shell title={title}>
      {result && <ResultCard result={result} slug={slug} onRetake={() => setResult(null)} />}

      {!result && (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {t("questionCount", { count: quiz.questions.length })} ·{" "}
              {t("passingScore", { score: quiz.passingScore })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <ol className="space-y-6">
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
                            <button
                              type="button"
                              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                                selected
                                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                  : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)]",
                              )}
                            >
                              <span
                                className={cn(
                                  "grid size-5 place-items-center rounded-full border-2 transition-colors",
                                  selected
                                    ? "border-[var(--primary)] bg-[var(--primary)]"
                                    : "border-[var(--border)]",
                                )}
                              >
                                {selected && (
                                  <span className="size-2 rounded-full bg-[var(--primary-foreground)]" />
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

            <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
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
  return (
    <Card className={result.passed ? "border-[var(--primary)]" : ""}>
      <CardHeader className="text-center">
        <div
          className={cn(
            "mx-auto grid size-14 place-items-center rounded-full",
            result.passed
              ? "bg-[var(--primary)]/10 text-[var(--primary)]"
              : "bg-[var(--destructive)]/10 text-[var(--destructive)]",
          )}
        >
          {result.passed ? <CheckCircle2 className="size-7" /> : <XCircle className="size-7" />}
        </div>
        <CardTitle className="mt-3">{result.passed ? t("passed") : t("notYet")}</CardTitle>
        <CardDescription>
          {t("scoreLine", { score: result.score, passing: result.passingScore })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          {t("correctOf", { correct: result.correct, total: result.total })}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          {result.passed ? (
            <Button asChild>
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
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
