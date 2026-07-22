"use client";

import { ScrollReveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { CourseSummary } from "@/redux/api/coursesApi";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

/**
 * Phosphor Terminal Noir — featured courses as listed instruments.
 * Each card is a lifted carbon plate: desaturated 16:9 thumbnail over an
 * order-book data bar (level · duration · lessons), title in Archivo, price
 * as a live phosphor quote chip (or a radar-cyan plan chip), square-cropped
 * instructor avatar, and registration ticks that surface on hover while a
 * scanline sheen sweeps the thumbnail once.
 */
export function PhosphorCourses() {
  const t = useTranslations("home");

  const { data: featuredRes, isLoading } = useListCoursesQuery({ featured: true, limit: 6 });
  const { data: allRes } = useListCoursesQuery({ limit: 6 });

  const courses =
    (featuredRes?.data?.data?.length ? featuredRes.data.data : allRes?.data?.data) || [];

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span aria-hidden className="dxphosphor-chip mb-4 text-[var(--muted-foreground)]">
                <span className="dxphosphor-led dxphosphor-led--static" />
                MKT / 06
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {t("featuredCourses")}
              </h2>
              <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
                {t("featuredCoursesSub")}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="gap-2 self-start rounded-[2px] border-[var(--border)] sm:self-auto"
            >
              <Link href="/courses">
                {t("browseAll")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="border border-dashed border-[var(--border)] py-16 text-center font-mono text-sm text-[var(--muted-foreground)]">
            No published courses yet — admin can add some at /admin/courses.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 0.06} amount={0.2}>
                <PhosphorCourseCard course={c} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PhosphorCourseCard({ course }: { course: CourseSummary }) {
  const tField = useTranslations("admin.fields");
  const locale = useLocale();
  const isAr = locale === "ar";
  const title = (isAr && course.titleArabic) || course.title;
  const desc = (isAr && course.shortDescriptionArabic) || course.shortDescription;

  const hours = Math.floor(course.totalDurationMin / 60);
  const minutes = course.totalDurationMin % 60;
  const durationLabel =
    hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}` : `${minutes || 0}m`;

  const hasPrice = course.oneTimePrice > 0;
  const rating = typeof course.averageRating === "number" ? course.averageRating : null;

  return (
    <Link
      href={{ pathname: `/courses/${course.slug}` }}
      className="dxphosphor-card dxphosphor-ticks dxphosphor-ticks--hover group flex h-full flex-col"
    >
      {/* Thumbnail: desaturated, hairline-inset, sheen sweeps once on hover */}
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--secondary)]">
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
          <div aria-hidden className="dxphosphor-dotgrid grid h-full w-full place-items-center">
            <BookOpen className="size-10 text-[var(--muted-foreground)]" />
          </div>
        )}
        {/* 1px inset hairline over the image */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 border border-[var(--border)]"
        />
        <span aria-hidden className="dxphosphor-sheen" />

        {/* Tier tag (when the course also sells one-time) — mirrors shared card */}
        {hasPrice && course.accessTier !== "FREE" && (
          <span className="absolute start-2 top-2 border border-[var(--dxphosphor-quote-border)] bg-[var(--dxphosphor-quote-bg)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--dxphosphor-quote-fg)]">
            {tField(`tier.${course.accessTier}`)}
          </span>
        )}
        {course.isFeatured && (
          <span
            aria-hidden
            className="absolute end-2 top-2 grid size-6 place-items-center border border-[var(--border)] bg-[var(--card)] font-mono text-[11px] leading-none text-[var(--dxphosphor-amber)]"
          >
            ★
          </span>
        )}
      </div>

      {/* Order-book data bar: level · duration · lessons */}
      <div className="flex items-stretch border-y border-[var(--border)] font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
        <span className="border-e border-[var(--border)] px-3 py-1.5">
          {tField(`level.${course.level}`)}
        </span>
        <span className="flex items-center gap-1.5 border-e border-[var(--border)] px-3 py-1.5">
          <Clock className="size-3" aria-hidden />
          {durationLabel}
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5">
          <BookOpen className="size-3" aria-hidden />
          {course.totalLessons}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent)]">
            {course.category ? (isAr && course.category.nameArabic) || course.category.name : "—"}
          </span>
          {rating !== null && rating > 0 && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--foreground)]">
              <span className="dxphosphor-led dxphosphor-led--amber" aria-hidden />
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <h3 className="font-display line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-[var(--primary)]">
          {title}
        </h3>
        {desc && <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">{desc}</p>}

        {/* Footer row: square instructor avatar vs. live quote chip */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
          <span className="flex min-w-0 items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span className="relative size-6 shrink-0 overflow-hidden rounded-[2px] border border-[var(--border)] bg-[var(--secondary)]">
              {course.instructor.user.profile ? (
                <Image
                  src={course.instructor.user.profile}
                  alt={course.instructor.user.fullName}
                  fill
                  className="object-cover"
                  sizes="24px"
                  unoptimized
                />
              ) : (
                <span className="grid h-full w-full place-items-center font-mono text-[10px] font-semibold uppercase text-[var(--primary)]">
                  {course.instructor.user.fullName.charAt(0)}
                </span>
              )}
            </span>
            <span className="truncate">{course.instructor.user.fullName}</span>
          </span>

          {hasPrice ? (
            <span className="dxphosphor-quote shrink-0">${course.oneTimePrice.toFixed(2)}</span>
          ) : (
            <span className="shrink-0 border border-[color-mix(in_oklch,var(--accent)_40%,transparent)] bg-[color-mix(in_oklch,var(--accent)_10%,transparent)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]">
              {tField(`tier.${course.accessTier}`)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/** Hairline loading plate: pulsing carbon bars, no shimmer gradients. */
function CardSkeleton() {
  return (
    <div className="dxphosphor-panel animate-pulse">
      <div className="aspect-video w-full bg-[var(--secondary)]" />
      <div className="h-7 border-y border-[var(--border)] bg-[var(--muted)]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 bg-[var(--secondary)]" />
        <div className="h-5 w-4/5 bg-[var(--secondary)]" />
        <div className="h-3 w-2/3 bg-[var(--secondary)]" />
        <div className="h-8 border-t border-[var(--border)] pt-3">
          <div className="h-full w-1/2 bg-[var(--secondary)]" />
        </div>
      </div>
    </div>
  );
}
