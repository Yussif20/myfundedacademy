"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery, type CourseSummary } from "@/redux/api/coursesApi";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { EditionSection } from "./edition-section";

/**
 * The catalog — featured courses set as numbered plates in a book, not SaaS
 * cards. Each plate: folio №, ink-and-ultramarine duotone figure with an
 * inset hairline frame, kicker row, Newsreader title, italic byline, and a
 * Scotch-ruled footer where the price sits as a squared vermilion chip.
 */
export function NightCourses({ index }: { index: string }) {
  const t = useTranslations("home");

  const { data: featuredRes, isLoading } = useListCoursesQuery({ featured: true, limit: 6 });
  const { data: allRes } = useListCoursesQuery({ limit: 6 });

  const courses =
    (featuredRes?.data?.data?.length ? featuredRes.data.data : allRes?.data?.data) || [];

  return (
    <EditionSection index={index}>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <h2 className="dxnight-headline font-display text-3xl md:text-5xl">
                  {t("featuredCourses")}
                </h2>
                <p className="mt-3 text-[var(--muted-foreground)]">{t("featuredCoursesSub")}</p>
              </div>
              <Link
                href="/courses"
                className="dxnight-kicker dxnight-underline inline-flex items-center gap-2 self-start pb-0.5 text-[var(--primary)] sm:self-auto"
              >
                {t("browseAll")}
                <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlateSkeleton key={i} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="dxnight-frame mt-10 py-16 text-center text-sm text-[var(--muted-foreground)]">
              No published courses yet — admin can add some at /admin/courses.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c, i) => (
                <ScrollReveal key={c.id} delay={i * 0.06} amount={0.2}>
                  <CoursePlate course={c} index={i} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </EditionSection>
  );
}

function CoursePlate({ course, index }: { course: CourseSummary; index: number }) {
  const tField = useTranslations("admin.fields");
  const tCourse = useTranslations("courseDetail");
  const locale = useLocale();
  const isAr = locale === "ar";
  const title = (isAr && course.titleArabic) || course.title;
  const desc = (isAr && course.shortDescriptionArabic) || course.shortDescription;

  const hours = Math.floor(course.totalDurationMin / 60);
  const minutes = course.totalDurationMin % 60;
  const durationLabel =
    hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}` : `${minutes || 0}m`;

  return (
    <Link
      href={{ pathname: `/courses/${course.slug}` }}
      className="dxnight-plate group flex h-full flex-col"
    >
      {/* Folio row */}
      <div className="flex items-baseline justify-between px-5 pt-4">
        <span className="dxnight-mono text-[11px] text-[var(--muted-foreground)]">
          № {String(index + 1).padStart(2, "0")}
        </span>
        {course.isFeatured && (
          <span aria-hidden className="text-sm text-[var(--accent)]">
            ★
          </span>
        )}
      </div>

      {/* Duotone figure plate */}
      <div className="dxnight-plate-media mx-5 mt-3 aspect-video">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div aria-hidden className="grid h-full w-full place-items-center bg-[var(--secondary)]">
            <span className="font-display text-4xl text-[var(--muted-foreground)]">№</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Kicker row: category · level · tier */}
        <div className="dxnight-kicker flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {course.category && (
            <>
              <span className="text-[var(--accent)]">
                {(isAr && course.category.nameArabic) || course.category.name}
              </span>
              <span aria-hidden className="text-[var(--muted-foreground)]">
                ·
              </span>
            </>
          )}
          <span className="text-[var(--muted-foreground)]">{tField(`level.${course.level}`)}</span>
          {course.accessTier !== "FREE" && (
            <>
              <span aria-hidden className="text-[var(--muted-foreground)]">
                ·
              </span>
              <span className="text-[var(--primary)]">{tField(`tier.${course.accessTier}`)}</span>
            </>
          )}
        </div>

        <h3 className="dxnight-headline font-display line-clamp-2 text-xl transition-colors group-hover:text-[var(--primary)] md:text-2xl">
          {title}
        </h3>
        {desc && <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">{desc}</p>}

        {/* Byline */}
        <p className="dxnight-byline text-sm text-[var(--muted-foreground)]">
          {tCourse("by")} {course.instructor.user.fullName}
        </p>

        {/* Scotch-ruled ledger footer */}
        <div className="mt-auto pt-2">
          <div className="dxnight-rule text-[var(--foreground)]" aria-hidden />
          <div className="mt-3 flex items-center justify-between gap-3">
            {course.oneTimePrice > 0 ? (
              <span className="dxnight-chip text-sm text-[var(--foreground)]">
                ${course.oneTimePrice.toFixed(2)}
              </span>
            ) : (
              <span className="dxnight-chip dxnight-chip--primary dxnight-kicker">
                {tField(`tier.${course.accessTier}`)}
              </span>
            )}
            <span className="dxnight-mono flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="size-3.5" aria-hidden />
                {course.totalLessons}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden />
                {durationLabel}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PlateSkeleton() {
  return (
    <div className="dxnight-plate p-5" aria-hidden>
      <div className="h-3 w-16 animate-pulse bg-[var(--secondary)]" />
      <div className="mt-4 aspect-video animate-pulse bg-[var(--secondary)]" />
      <div className="mt-5 h-4 w-3/4 animate-pulse bg-[var(--secondary)]" />
      <div className="mt-3 h-4 w-1/2 animate-pulse bg-[var(--secondary)]" />
      <div className="mt-6 h-8 w-24 animate-pulse bg-[var(--secondary)]" />
    </div>
  );
}
