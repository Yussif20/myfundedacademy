"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VdoCipherPlayer } from "@/components/public/vdocipher-player";
import { Link } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import {
  useGetCourseQuery,
  useGetPreviewOtpMutation,
  type CourseDetail,
  type Lesson,
  type Section,
} from "@/redux/api/coursesApi";
import { useCheckoutCourseMutation } from "@/redux/api/paymentsApi";
import { useAppSelector } from "@/redux/store";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  PlayCircle,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const locale = useLocale();
  const isAr = locale === "ar";

  const t = useTranslations("courseDetail");
  const tField = useTranslations("admin.fields");

  const { data, isLoading, isError } = useGetCourseQuery(slug, { skip: !slug });
  const course = data?.data;
  const user = useAppSelector((s) => s.auth.user);

  const previewLesson: Lesson | null = useMemo(() => {
    if (!course) return null;
    for (const s of course.sections) {
      for (const l of s.lessons) {
        if (l.isFreePreview && l.vdoVideoId) return l;
      }
    }
    return null;
  }, [course]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">404</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Course not found.</p>
        <Button asChild className="mt-6">
          <Link href="/courses">Browse all courses</Link>
        </Button>
      </div>
    );
  }

  const title = (isAr && course.titleArabic) || course.title;
  const shortDesc = (isAr && course.shortDescriptionArabic) || course.shortDescription;
  const longDesc = (isAr && course.descriptionArabic) || course.description;
  const instructorName = course.instructor.user.fullName;
  const instructorHeadline =
    (isAr && course.instructor.headlineArabic) || course.instructor.headline;

  const totalHours = Math.floor(course.totalDurationMin / 60);
  const totalMinutes = course.totalDurationMin % 60;
  const durationLabel =
    totalHours > 0
      ? `${totalHours}h${totalMinutes > 0 ? ` ${totalMinutes}m` : ""}`
      : `${totalMinutes || 0}m`;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-[var(--card)]/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="flex items-center gap-2 text-sm">
              {course.category && (
                <Link
                  href={{ pathname: `/categories/${course.category.slug}` }}
                  className="text-[var(--primary)] hover:underline"
                >
                  {(isAr && course.category.nameArabic) || course.category.name}
                </Link>
              )}
              <span className="text-[var(--muted-foreground)]">·</span>
              <Badge variant="outline">{tField(`level.${course.level}`)}</Badge>
              {course.isFeatured && (
                <Badge variant="warning">
                  <Star className="size-3 fill-current" />
                </Badge>
              )}
            </div>

            <h1 className="font-display mt-4 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {title}
            </h1>
            {shortDesc && (
              <p className="mt-4 text-lg text-[var(--muted-foreground)]">{shortDesc}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--muted-foreground)]">
              <span className="inline-flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-[var(--secondary)] text-xs font-semibold">
                  {instructorName.charAt(0)}
                </span>
                {t("by")} <span className="text-[var(--foreground)]">{instructorName}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen className="size-4" />
                {t("lessonsCount", { count: course.totalLessons })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4" />
                {t("duration", { duration: durationLabel })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe className="size-4" />
                {tField(`language.${course.language}`)}
              </span>
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            {previewLesson ? (
              <PreviewPlayer lesson={previewLesson} thumbnail={course.thumbnail} />
            ) : course.thumbnail ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)]">
                <Image
                  src={course.thumbnail}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  unoptimized
                />
              </div>
            ) : null}

            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-baseline justify-between">
                  {course.oneTimePrice > 0 ? (
                    <>
                      <span className="font-display text-3xl font-bold">
                        ${course.oneTimePrice.toFixed(2)}
                      </span>
                      <Badge variant="secondary">{tField(`tier.${course.accessTier}`)}</Badge>
                    </>
                  ) : (
                    <span className="font-display text-2xl font-bold text-[var(--primary)]">
                      Free
                    </span>
                  )}
                </div>

                <PurchaseCta course={course} loggedIn={Boolean(user)} />
                {course.accessTier !== "FREE" && (
                  <Button asChild className="w-full" size="lg" variant="outline">
                    <Link href="/pricing">{t("subscribeForAccess")}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          {longDesc && (
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {t("whatYouLearn")}
              </h2>
              <div className="prose prose-invert mt-4 max-w-none text-[var(--muted-foreground)]">
                {longDesc.split("\n").map((line, i) => (
                  <p key={i} className="mb-3 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">{t("curriculum")}</h2>
            <div className="mt-4 space-y-3">
              {course.sections.map((section) => (
                <SectionRow key={section.id} section={section} isAr={isAr} />
              ))}
              {course.sections.length === 0 && (
                <p className="rounded-md border border-dashed border-[var(--border)] py-6 text-center text-sm text-[var(--muted-foreground)]">
                  Curriculum not finalized yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Instructor sidebar */}
        <aside className="space-y-4">
          <h3 className="font-display text-xl font-bold tracking-tight">{t("aboutInstructor")}</h3>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)]/30 to-[var(--accent)]/20 font-display text-lg font-semibold text-[var(--primary)]">
                  {instructorName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <Link
                    href={{ pathname: `/instructors/${course.instructor.id}` }}
                    className="font-medium hover:text-[var(--primary)]"
                  >
                    {instructorName}
                  </Link>
                  {instructorHeadline && (
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {instructorHeadline}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function PurchaseCta({ course, loggedIn }: { course: CourseDetail; loggedIn: boolean }) {
  const t = useTranslations("courseDetail");
  const [checkout, { isLoading }] = useCheckoutCourseMutation();
  const [error, setError] = useState<string | null>(null);

  if (course.viewerHasAccess) {
    return (
      <Button asChild className="w-full" size="lg">
        <Link href={`/learn/${course.slug}` as `/learn/${string}`}>{t("continueLearning")}</Link>
      </Button>
    );
  }

  const handleBuy = async () => {
    setError(null);
    try {
      const res = await checkout({ courseId: course.id }).unwrap();
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  if (course.oneTimePrice > 0) {
    if (!loggedIn) {
      return (
        <>
          <Button asChild className="w-full" size="lg">
            <Link href="/login">{t("enrollNow", { price: course.oneTimePrice.toFixed(2) })}</Link>
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </>
      );
    }
    return (
      <>
        <Button className="w-full" size="lg" disabled={isLoading} onClick={handleBuy}>
          {isLoading ? "Redirecting…" : t("enrollNow", { price: course.oneTimePrice.toFixed(2) })}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </>
    );
  }

  // No one-time price; access purely via subscription
  if (!loggedIn) {
    return (
      <Button asChild className="w-full" size="lg">
        <Link href="/login">{t("subscribeForAccess")}</Link>
      </Button>
    );
  }
  return (
    <Button asChild className="w-full" size="lg">
      <Link href="/pricing">{t("subscribeForAccess")}</Link>
    </Button>
  );
}

function SectionRow({ section, isAr }: { section: Section; isAr: boolean }) {
  const t = useTranslations("courseDetail");
  const [open, setOpen] = useState(false);

  const totalDuration = section.lessons.reduce(
    (acc: number, l: Lesson) => acc + (l.durationMin || 0),
    0,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 bg-[var(--card)] px-4 py-3 text-left transition-colors hover:bg-[var(--secondary)]"
      >
        {open ? (
          <ChevronDown className="size-4 shrink-0 text-[var(--muted-foreground)]" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-[var(--muted-foreground)] rtl:rotate-180" />
        )}
        <div className="flex-1">
          <p className="font-medium">{(isAr && section.titleArabic) || section.title}</p>
        </div>
        <span className="text-xs text-[var(--muted-foreground)]">
          {section.lessons.length} · {totalDuration}m
        </span>
      </button>

      {open && (
        <ul className="divide-y divide-[var(--border)] bg-[var(--background)]/50">
          {section.lessons.map((l: Lesson, idx: number) => (
            <li key={l.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <PlayCircle className="size-4 shrink-0 text-[var(--muted-foreground)]" />
              <span className="flex-1 truncate">
                <span className="text-[var(--muted-foreground)]">{idx + 1}. </span>
                {(isAr && l.titleArabic) || l.title}
              </span>
              {l.isFreePreview && <Badge variant="success">{t("freePreview")}</Badge>}
              {l.durationMin > 0 && (
                <span className="text-xs text-[var(--muted-foreground)]">{l.durationMin}m</span>
              )}
            </li>
          ))}
          {section.lessons.length === 0 && (
            <li className="px-4 py-3 text-sm text-[var(--muted-foreground)]">No lessons.</li>
          )}
        </ul>
      )}
    </div>
  );
}

function PreviewPlayer({ lesson, thumbnail }: { lesson: Lesson; thumbnail: string }) {
  const t = useTranslations("courseDetail");
  const [getOtp, { isLoading }] = useGetPreviewOtpMutation();
  const [otp, setOtp] = useState<string | undefined>();
  const [playbackInfo, setPlaybackInfo] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const onActivate = async () => {
    setError(null);
    try {
      const res = await getOtp({ lessonId: lesson.id }).unwrap();
      setOtp(res.data.otp);
      setPlaybackInfo(res.data.playbackInfo);
    } catch (err) {
      setError(extractApiError(err, t("previewError")));
    }
  };

  return (
    <div className="space-y-2">
      <VdoCipherPlayer
        otp={otp}
        playbackInfo={playbackInfo}
        isLoading={isLoading}
        poster={thumbnail}
        title={lesson.title}
        onActivate={onActivate}
      />
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-1">
          <Badge variant="success">{t("freePreview")}</Badge>
          <span>{lesson.title}</span>
        </span>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
