"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery, type CourseSummary } from "@/redux/api/coursesApi";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { BurnHeading } from "./section-heading";

/**
 * Controlled Burn featured courses — instruments on the desk.
 * Each course is a heat-seam panel: full-bleed thumbnail sitting in the
 * same firelight (warm duotone + plum scrim), category as a tape tag,
 * mono meta row like an order ticket, and the price as an ember quote chip.
 */
export function BurnCourses() {
  const t = useTranslations("home");

  const { data: featuredRes, isLoading } = useListCoursesQuery({ featured: true, limit: 6 });
  const { data: allRes } = useListCoursesQuery({ limit: 6 });

  const courses =
    (featuredRes?.data?.data?.length ? featuredRes.data.data : allRes?.data?.data) || [];

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <BurnHeading
            index="02"
            title={t("featuredCourses")}
            sub={t("featuredCoursesSub")}
            action={
              <Link
                href="/courses"
                className="dxburn-navlink group inline-flex items-center gap-2 self-start pb-1 text-sm font-medium text-[var(--primary)] sm:self-auto"
              >
                {t("browseAll")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
            }
          />
        </ScrollReveal>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-[10px] border border-[var(--border)] bg-[var(--card)]"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--muted-foreground)]">
            No published courses yet — admin can add some at /admin/courses.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 0.06} amount={0.2}>
                <BurnCourseCard course={c} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BurnCourseCard({ course }: { course: CourseSummary }) {
  const tField = useTranslations("admin.fields");
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
      className="dxburn-card dxburn-seam group flex h-full flex-col"
    >
      {/* Thumbnail in the firelight */}
      <div className="dxburn-firelight relative aspect-video w-full overflow-hidden bg-[var(--secondary)]">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div aria-hidden className="grid h-full w-full place-items-center">
            <BookOpen className="size-10 text-[var(--muted-foreground)]" />
          </div>
        )}

        <div aria-hidden className="dxburn-scrim z-[2]" />

        {/* Category tape tag */}
        {course.category && (
          <span className="dxburn-micro absolute start-3 top-3 z-[3] rounded-[2px] border border-[color-mix(in_oklch,var(--primary)_35%,transparent)] bg-[color-mix(in_oklch,var(--background)_80%,transparent)] px-2 py-1 text-[var(--primary)] backdrop-blur-sm">
            {(isAr && course.category.nameArabic) || course.category.name}
          </span>
        )}

        {/* Featured — solar gold, never generic yellow */}
        {course.isFeatured && (
          <span aria-hidden className="absolute end-3 top-3 z-[3] font-mono text-sm text-[#FFB020]">
            ★
          </span>
        )}

        {/* Access tier chip over the scrim */}
        {course.accessTier !== "FREE" && (
          <span className="dxburn-micro absolute bottom-3 start-3 z-[3] rounded-[2px] border border-[color-mix(in_oklch,var(--accent)_45%,transparent)] bg-[color-mix(in_oklch,var(--background)_78%,transparent)] px-2 py-1 text-[var(--accent)] backdrop-blur-sm">
            {tField(`tier.${course.accessTier}`)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Order-ticket meta row */}
        <div className="dxburn-micro flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--muted-foreground)]">
          <span>{tField(`level.${course.level}`)}</span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5" aria-hidden />
            {course.totalLessons}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {durationLabel}
          </span>
        </div>

        <h3 className="font-display line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-[var(--primary)]">
          {title}
        </h3>
        {desc && <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">{desc}</p>}

        {/* Ledger footer: instructor at start, quote chip at end */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3.5">
          <span className="flex min-w-0 items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center rounded-[2px] border border-[color-mix(in_oklch,var(--primary)_30%,transparent)] bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] font-mono text-[10px] font-semibold uppercase text-[var(--primary)]"
            >
              {course.instructor.user.fullName.charAt(0)}
            </span>
            <span className="truncate">{course.instructor.user.fullName}</span>
          </span>
          {course.oneTimePrice > 0 ? (
            <span className="dxburn-price shrink-0">${course.oneTimePrice.toFixed(2)}</span>
          ) : (
            <span className="dxburn-price dxburn-price--plan shrink-0">Sub-only</span>
          )}
        </div>
      </div>
    </Link>
  );
}
