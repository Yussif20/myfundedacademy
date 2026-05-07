"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VdoCipherPlayer } from "@/components/public/vdocipher-player";
import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthGuard } from "@/components/auth-guard";
import { ProgressRing } from "@/components/public/progress-ring";
import { Link, useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { cn } from "@/lib/utils";
import {
  useGetCourseProgressQuery,
  useGetCourseQuery,
  useGetPlaybackOtpMutation,
  useUpsertLessonProgressMutation,
  type CourseDetail,
  type Lesson,
  type Section,
} from "@/redux/api/coursesApi";
import { useAppSelector } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Loader2,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function LearnPage() {
  return (
    <AuthGuard>
      <ClassroomShell />
    </AuthGuard>
  );
}

function ClassroomShell() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const search = useSearchParams();
  const lessonIdFromUrl = search.get("lesson");
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("classroom");

  const {
    data: courseRes,
    isLoading: courseLoading,
    isError,
  } = useGetCourseQuery(slug, {
    skip: !slug,
  });
  const { data: progressRes, refetch: refetchProgress } = useGetCourseProgressQuery(slug, {
    skip: !slug,
  });

  const course = courseRes?.data;
  const progress = progressRes?.data || [];
  const progressByLesson = useMemo(() => {
    const map = new Map<string, (typeof progress)[number]>();
    for (const p of progress) map.set(p.lessonId, p);
    return map;
  }, [progress]);

  // Flat ordered lesson list — used for prev/next navigation.
  const flatLessons = useMemo(() => {
    if (!course) return [] as Lesson[];
    return course.sections.flatMap((s) => s.lessons);
  }, [course]);

  const currentLesson = useMemo(() => {
    if (!course) return null;
    if (lessonIdFromUrl) {
      const found = flatLessons.find((l) => l.id === lessonIdFromUrl);
      if (found) return found;
    }
    return flatLessons[0] || null;
  }, [course, flatLessons, lessonIdFromUrl]);

  const currentIndex = currentLesson ? flatLessons.findIndex((l) => l.id === currentLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < flatLessons.length - 1
      ? flatLessons[currentIndex + 1]
      : null;

  if (courseLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="text-center">
          <p className="font-display text-3xl font-bold">404</p>
          <p className="mt-2 text-[var(--muted-foreground)]">{t("courseNotFound")}</p>
          <Button asChild className="mt-6">
            <Link href="/courses">{t("backToCourses")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const completedCount = progress.filter((p) => p.completedAt).length;
  const totalCount = flatLessons.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const goToLesson = (lessonId: string) => {
    router.replace(`/learn/${slug}?lesson=${lessonId}`);
  };

  const courseTitle = (isAr && course.titleArabic) || course.title;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" aria-label="Home" className="hidden md:block">
            <Wordmark height={36} />
          </Link>
          <Link
            href={`/courses/${slug}` as `/courses/${string}`}
            className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
            <span className="line-clamp-1">{courseTitle}</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-[color-mix(in_oklch,var(--secondary)_70%,transparent)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                />
              </div>
              <span className="text-xs font-medium text-[var(--muted-foreground)]">{pct}%</span>
            </div>
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Two-column body */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr] lg:px-6">
        <CurriculumSidebar
          course={course}
          currentLessonId={currentLesson?.id || null}
          progressByLesson={progressByLesson}
          onPick={goToLesson}
          totalLessons={totalCount}
          completedCount={completedCount}
          slug={slug}
        />

        <main className="min-w-0">
          <AnimatePresence mode="wait">
            {currentLesson ? (
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <LessonView
                  lesson={currentLesson}
                  course={course}
                  progressByLesson={progressByLesson}
                  prevLesson={prevLesson}
                  nextLesson={nextLesson}
                  onComplete={refetchProgress}
                  onGoTo={goToLesson}
                />
              </motion.div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--muted-foreground)]">
                {t("noLessonsYet")}
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function CurriculumSidebar({
  course,
  currentLessonId,
  progressByLesson,
  onPick,
  totalLessons,
  completedCount,
  slug,
}: {
  course: CourseDetail;
  currentLessonId: string | null;
  progressByLesson: Map<string, { completedAt: string | null }>;
  onPick: (lessonId: string) => void;
  totalLessons: number;
  completedCount: number;
  slug: string;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("classroom");

  const allLessonsDone = totalLessons > 0 && completedCount >= totalLessons;

  return (
    <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="space-y-3">
        {course.sections.map((section) => (
          <SectionGroup
            key={section.id}
            section={section}
            isAr={isAr}
            currentLessonId={currentLessonId}
            progressByLesson={progressByLesson}
            onPick={onPick}
          />
        ))}

        {/* Final-quiz / certificate CTAs surface once everything is done. */}
        {allLessonsDone && (
          <div className="space-y-2 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              {t("allLessonsComplete")}
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild size="sm" className="gap-2">
                <Link href={`/learn/${slug}/quiz` as `/learn/${string}/quiz`}>
                  {t("takeFinalQuiz")}
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="gap-2">
                <Link href={`/learn/${slug}/certificate` as `/learn/${string}/certificate`}>
                  {t("getCertificate")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function SectionGroup({
  section,
  isAr,
  currentLessonId,
  progressByLesson,
  onPick,
}: {
  section: Section;
  isAr: boolean;
  currentLessonId: string | null;
  progressByLesson: Map<string, { completedAt: string | null }>;
  onPick: (lessonId: string) => void;
}) {
  const containsCurrent = section.lessons.some((l) => l.id === currentLessonId);
  const [open, setOpen] = useState(containsCurrent);

  useEffect(() => {
    if (containsCurrent) setOpen(true);
  }, [containsCurrent]);

  const completedInSection = section.lessons.filter(
    (l) => progressByLesson.get(l.id)?.completedAt,
  ).length;

  const sectionPct = section.lessons.length > 0 ? completedInSection / section.lessons.length : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_75%,transparent)] backdrop-blur transition-colors hover:border-[color-mix(in_oklch,var(--primary)_25%,transparent)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[color-mix(in_oklch,var(--primary)_4%,transparent)]"
      >
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="grid size-5 shrink-0 place-items-center"
        >
          <ChevronDown className="size-4 text-[var(--muted-foreground)]" />
        </motion.span>
        <ProgressRing value={sectionPct} size={22} stroke={2.5} />
        <span className="line-clamp-1 flex-1">
          {(isAr && section.titleArabic) || section.title}
        </span>
        <span className="text-xs text-[var(--muted-foreground)]">
          {completedInSection}/{section.lessons.length}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="border-t border-[color-mix(in_oklch,var(--border)_60%,transparent)]">
              {section.lessons.map((l) => {
                const completed = Boolean(progressByLesson.get(l.id)?.completedAt);
                const isCurrent = l.id === currentLessonId;
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => onPick(l.id)}
                      className={cn(
                        "flex w-full items-center gap-3 border-b border-[color-mix(in_oklch,var(--border)_40%,transparent)] px-3 py-2.5 text-left text-sm transition-colors last:border-b-0",
                        isCurrent
                          ? "bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] text-[var(--foreground)]"
                          : "text-[var(--muted-foreground)] hover:bg-[color-mix(in_oklch,var(--primary)_5%,transparent)] hover:text-[var(--foreground)]",
                      )}
                    >
                      {completed ? (
                        <CheckCircle2 className="size-4 shrink-0 text-[var(--primary)]" />
                      ) : (
                        <Circle className="size-4 shrink-0 text-[var(--muted-foreground)]" />
                      )}
                      <span className="line-clamp-1 flex-1">
                        {(isAr && l.titleArabic) || l.title}
                      </span>
                      {l.durationMin > 0 && (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {l.durationMin}m
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonView({
  lesson,
  course,
  progressByLesson,
  prevLesson,
  nextLesson,
  onComplete,
  onGoTo,
}: {
  lesson: Lesson;
  course: CourseDetail;
  progressByLesson: Map<string, { completedAt: string | null }>;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  onComplete: () => void;
  onGoTo: (lessonId: string) => void;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("classroom");
  const user = useAppSelector((s) => s.auth.user);

  const [getOtp, { isLoading: otpLoading }] = useGetPlaybackOtpMutation();
  const [upsertProgress, { isLoading: marking }] = useUpsertLessonProgressMutation();

  const [otp, setOtp] = useState<string | undefined>();
  const [playbackInfo, setPlaybackInfo] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const completed = Boolean(progressByLesson.get(lesson.id)?.completedAt);
  const watermarkText = user?.email || undefined;

  // Load OTP whenever the lesson changes (and there's a video).
  useEffect(() => {
    setOtp(undefined);
    setPlaybackInfo(undefined);
    setError(null);
    if (!lesson.vdoVideoId) return;

    let active = true;
    (async () => {
      try {
        const res = await getOtp({ lessonId: lesson.id }).unwrap();
        if (!active) return;
        setOtp(res.data.otp);
        setPlaybackInfo(res.data.playbackInfo);
      } catch (err) {
        if (!active) return;
        setError(extractApiError(err, t("couldntLoadLesson")));
      }
    })();
    return () => {
      active = false;
    };
  }, [lesson.id, lesson.vdoVideoId, getOtp]);

  const onMarkComplete = async () => {
    setError(null);
    try {
      await upsertProgress({
        lessonId: lesson.id,
        courseId: course.slug,
        completed: !completed,
      }).unwrap();
      onComplete();
      // Auto-advance only on a fresh completion.
      if (!completed && nextLesson) {
        setTimeout(() => onGoTo(nextLesson.id), 250);
      }
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const title = (isAr && lesson.titleArabic) || lesson.title;
  const description = (isAr && lesson.descriptionArabic) || lesson.description;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!lesson.vdoVideoId ? (
        <div className="grid aspect-video w-full place-items-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
          <div className="text-center">
            <Lock className="mx-auto size-8 text-[var(--muted-foreground)]" />
            <p className="mt-2">{t("noVideoUploaded")}</p>
          </div>
        </div>
      ) : (
        <VdoCipherPlayer
          otp={otp}
          playbackInfo={playbackInfo}
          isLoading={otpLoading}
          poster={course.thumbnail}
          title={title}
          watermarkText={watermarkText}
        />
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          {lesson.isFreePreview && <Badge variant="success">{t("freePreview")}</Badge>}
        </div>

        {description && (
          <p className="whitespace-pre-line text-[var(--muted-foreground)]">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={onMarkComplete}
          disabled={marking}
          variant={completed ? "outline" : "default"}
          size="lg"
          className="gap-2"
        >
          {marking ? (
            <Loader2 className="size-4 animate-spin" />
          ) : completed ? (
            <CheckCircle2 className="size-4 text-[var(--primary)]" />
          ) : (
            <PlayCircle className="size-4" />
          )}
          {completed ? t("markedComplete") : t("markComplete")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={!prevLesson}
            onClick={() => prevLesson && onGoTo(prevLesson.id)}
            className="gap-2"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
            {t("previous")}
          </Button>
          <Button
            variant="outline"
            disabled={!nextLesson}
            onClick={() => nextLesson && onGoTo(nextLesson.id)}
            className="gap-2"
          >
            {t("next")}
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
