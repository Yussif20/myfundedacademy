"use client";

import { ReviewsSection } from "@/components/public/reviews-section";
import { StarRating } from "@/components/public/star-rating";
import { StickyCourseCta } from "@/components/public/sticky-course-cta";
import { VdoCipherPlayer } from "@/components/public/vdocipher-player";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
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
import { ArrowRight, BookOpen, ChevronDown, Clock, Globe, Loader2, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const locale = useLocale();
  const isAr = locale === "ar";

  const t = useTranslations("courseDetail");
  const tField = useTranslations("admin.fields");
  const tReviews = useTranslations("reviewsSection");
  const tHome = useTranslations("home");

  const { data, isLoading, isError } = useGetCourseQuery(slug, { skip: !slug });
  const course = data?.data;
  const user = useAppSelector((s) => s.auth.user);
  const inlineCtaRef = useRef<HTMLDivElement | null>(null);

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
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-display text-2xl">{t("notFound")}</p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/courses">
            {tHome("browseAll")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
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
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:py-20 lg:grid-cols-[1fr_400px]">
          <Reveal>
            <Eyebrow>
              {course.category ? (
                <Link
                  href={{ pathname: `/categories/${course.category.slug}` }}
                  className="hover:text-primary"
                >
                  {(isAr && course.category.nameArabic) || course.category.name}
                </Link>
              ) : (
                tField(`level.${course.level}`)
              )}
            </Eyebrow>

            <h1 className="mt-6 font-display text-4xl font-medium leading-[1.1] tracking-tight text-balance md:text-5xl">
              {title}
            </h1>
            {shortDesc && (
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{shortDesc}</p>
            )}

            {(course.reviewCount ?? 0) > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating value={course.averageRating ?? 0} size={16} />
                <span className="text-sm text-muted-foreground">
                  {(course.averageRating ?? 0).toFixed(1)} ·{" "}
                  {tReviews("reviewsCount", { count: course.reviewCount ?? 0 })}
                </span>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full border border-border bg-card font-display text-sm text-primary">
                  {instructorName.charAt(0)}
                </span>
                {t("by")} <span className="text-foreground">{instructorName}</span>
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
                <Globe className="size-4" aria-hidden />
                {tField(`language.${course.language}`)}
              </span>
              <span>{tField(`level.${course.level}`)}</span>
            </div>
          </Reveal>

          {/* Right rail */}
          <div ref={inlineCtaRef} className="space-y-4">
            {previewLesson ? (
              <PreviewPlayer lesson={previewLesson} thumbnail={course.thumbnail} />
            ) : course.thumbnail ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
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

            <Card className="overflow-hidden">
              <CardContent className="space-y-4 p-6 sm:p-6">
                <div className="flex items-baseline justify-between border-b border-border pb-5">
                  {course.oneTimePrice > 0 ? (
                    <>
                      <span className="font-display text-4xl font-light tabular-nums" dir="ltr">
                        ${course.oneTimePrice.toFixed(2)}
                      </span>
                      <Badge variant="gold">{tField(`tier.${course.accessTier}`)}</Badge>
                    </>
                  ) : (
                    <span className="font-display text-3xl font-light text-primary">
                      {t("free")}
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
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_360px]">
        <div className="space-y-16">
          {longDesc && (
            <Reveal>
              <h2 className="font-display text-3xl font-medium tracking-tight">
                {t("whatYouLearn")}
              </h2>
              <div className="mt-5 max-w-2xl">
                {longDesc.split("\n").map((line, i) => (
                  <p key={i} className="mb-4 text-[17px] leading-8 text-foreground/85">
                    {line}
                  </p>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-medium tracking-tight">
                {t("curriculum")}
              </h2>
              <div className="mt-6 space-y-3">
                {course.sections.map((section, i) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    isAr={isAr}
                    defaultOpen={i === 0}
                  />
                ))}
                {course.sections.length === 0 && (
                  <p className="rounded-xl border border-dashed border-rule-strong/50 py-8 text-center text-sm text-muted-foreground">
                    {t("noCurriculum")}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Instructor sidebar */}
        <aside className="space-y-4">
          <Reveal>
            <h3 className="font-display text-2xl font-medium tracking-tight">
              {t("aboutInstructor")}
            </h3>
            <Card className="mt-6">
              <CardContent className="p-6 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="grid size-14 shrink-0 place-items-center rounded-full border border-border bg-paper-2 font-display text-xl text-primary">
                    {instructorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={{ pathname: `/instructors/${course.instructor.id}` }}
                      className="font-display text-lg hover:text-primary"
                    >
                      {instructorName}
                    </Link>
                    {instructorHeadline && (
                      <p className="mt-1 text-sm text-muted-foreground">{instructorHeadline}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <ReviewsSection slug={course.slug} viewerHasAccess={Boolean(course.viewerHasAccess)} />
      </section>

      {/* Sticky floating CTA on scroll */}
      <StickyCourseCta course={course} loggedIn={Boolean(user)} triggerRef={inlineCtaRef} />
    </div>
  );
}

function PurchaseCta({ course, loggedIn }: { course: CourseDetail; loggedIn: boolean }) {
  const t = useTranslations("courseDetail");
  const [checkout, { isLoading }] = useCheckoutCourseMutation();
  const [error, setError] = useState<string | null>(null);

  if (course.viewerHasAccess) {
    return (
      <Button asChild className="w-full " size="lg">
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
          <Button asChild className="w-full " size="lg">
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
        <Button className="w-full " size="lg" disabled={isLoading} onClick={handleBuy}>
          {isLoading ? t("redirecting") : t("enrollNow", { price: course.oneTimePrice.toFixed(2) })}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </>
    );
  }

  if (!loggedIn) {
    return (
      <Button asChild className="w-full " size="lg">
        <Link href="/login">{t("subscribeForAccess")}</Link>
      </Button>
    );
  }
  return (
    <Button asChild className="w-full " size="lg">
      <Link href="/pricing">{t("subscribeForAccess")}</Link>
    </Button>
  );
}

function SectionRow({
  section,
  isAr,
  defaultOpen = false,
}: {
  section: Section;
  isAr: boolean;
  defaultOpen?: boolean;
}) {
  const t = useTranslations("courseDetail");
  const [open, setOpen] = useState(defaultOpen);

  const totalDuration = section.lessons.reduce(
    (acc: number, l: Lesson) => acc + (l.durationMin || 0),
    0,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-start transition-colors hover:bg-paper-2/60"
      >
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90 rtl:rotate-90"}`}
          aria-hidden
        />
        <p className="flex-1 font-display text-lg">
          {(isAr && section.titleArabic) || section.title}
        </p>
        <span className="text-xs tabular-nums text-muted-foreground" dir="ltr">
          {section.lessons.length} · {totalDuration}m
        </span>
      </button>

      {open && (
        <div>
          <ul className="divide-y divide-border border-t border-border">
            {section.lessons.map((l: Lesson, idx: number) => (
              <li key={l.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <PlayCircle className="size-4 shrink-0 text-rule-strong" aria-hidden />
                <span className="flex-1 truncate">
                  <span className="text-muted-foreground">{idx + 1}. </span>
                  {(isAr && l.titleArabic) || l.title}
                </span>
                {l.isFreePreview && <Badge variant="default">{t("freePreview")}</Badge>}
                {l.durationMin > 0 && (
                  <span className="text-xs tabular-nums text-muted-foreground" dir="ltr">
                    {l.durationMin}m
                  </span>
                )}
              </li>
            ))}
            {section.lessons.length === 0 && (
              <li className="px-5 py-3 text-sm text-muted-foreground">{t("noLessons")}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function PreviewPlayer({ lesson, thumbnail }: { lesson: Lesson; thumbnail: string }) {
  const t = useTranslations("courseDetail");
  const [getOtp, { isLoading }] = useGetPreviewOtpMutation();
  const [otp, setOtp] = useState<string | undefined>();
  const [playbackInfo, setPlaybackInfo] = useState<string | undefined>();
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const onActivate = async () => {
    setError(null);
    try {
      const res = await getOtp({ lessonId: lesson.id }).unwrap();
      if (res.data.provider === "mp4") {
        setVideoUrl(res.data.url);
      } else {
        setOtp(res.data.otp);
        setPlaybackInfo(res.data.playbackInfo);
      }
    } catch (err) {
      setError(extractApiError(err, t("previewError")));
    }
  };

  return (
    <div className="space-y-2">
      <VdoCipherPlayer
        otp={otp}
        playbackInfo={playbackInfo}
        videoUrl={videoUrl}
        isLoading={isLoading}
        poster={thumbnail}
        title={lesson.title}
        onActivate={onActivate}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Badge variant="default">{t("freePreview")}</Badge>
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
