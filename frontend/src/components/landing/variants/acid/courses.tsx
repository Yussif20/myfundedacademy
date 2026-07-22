"use client";

import { Link } from "@/i18n/navigation";
import { useListCoursesQuery, type CourseSummary } from "@/redux/api/coursesApi";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { type CSSProperties } from "react";
import { AcidSectionHeader } from "./section-header";
import { SnapIn } from "./snap";

/**
 * Acid Ledger featured courses — each course is a trade confirmation slip:
 * flat 0-radius card, 2px border, hard offset shadow, chartreuse-on-ink
 * duotone thumbnail separated by a ledger rule, rotated price sticker
 * overlapping the rule, and mono metadata rows with dotted leaders. The whole
 * card lifts and snaps on hover — nothing fades.
 */
export function AcidCourses() {
  const t = useTranslations("home");

  const { data: featuredRes, isLoading } = useListCoursesQuery({ featured: true, limit: 6 });
  const { data: allRes } = useListCoursesQuery({ limit: 6 });

  const courses =
    (featuredRes?.data?.data?.length ? featuredRes.data.data : allRes?.data?.data) || [];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AcidSectionHeader
          title={t("featuredCourses")}
          sub={t("featuredCoursesSub")}
          action={
            <Link
              href="/courses"
              className="dxacid-btn-ghost inline-flex h-11 items-center gap-2 self-start px-5 text-xs sm:self-auto"
            >
              {t("browseAll")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          }
        />

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="dxacid-cell h-80 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="border-2 border-dashed border-[var(--border)] py-16 text-center font-mono text-sm text-[var(--muted-foreground)]">
            No published courses yet — admin can add some at /admin/courses.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <SnapIn key={c.id} delay={(i % 3) * 0.08}>
                <AcidCourseCard course={c} />
              </SnapIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AcidCourseCard({ course }: { course: CourseSummary }) {
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
      className="dxacid-hard dxacid-hard-int group flex h-full flex-col"
    >
      {/* Thumbnail plate: duotone image over a 2px ledger rule */}
      <div className="relative">
        <div className="dxacid-duotone relative aspect-video w-full border-b-2 border-[var(--dxacid-line)]">
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
            <div aria-hidden className="grid h-full w-full place-items-center">
              <BookOpen className="size-10 text-[var(--muted-foreground)]" />
            </div>
          )}

          {course.accessTier !== "FREE" && (
            <span
              className="dxacid-sticker dxacid-sticker-mag absolute start-3 top-3 z-[2]"
              style={{ "--dxacid-tilt": "-2deg" } as CSSProperties}
            >
              {tField(`tier.${course.accessTier}`)}
            </span>
          )}
          {course.isFeatured && (
            <span
              className="dxacid-sticker absolute end-3 top-3 z-[2]"
              style={{ "--dxacid-tilt": "2deg" } as CSSProperties}
              aria-hidden
            >
              ★
            </span>
          )}
        </div>

        {/* Price sticker straddles the ledger rule (outside the clipped plate) */}
        <span
          className={`absolute -bottom-3.5 end-4 z-[2] ${
            course.oneTimePrice > 0 ? "dxacid-sticker dxacid-sticker-acid" : "dxacid-sticker"
          }`}
          style={{ "--dxacid-tilt": "-3deg" } as CSSProperties}
        >
          {course.oneTimePrice > 0 ? `$${course.oneTimePrice.toFixed(2)}` : "Sub-only"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 pt-6">
        {/* Category + level, stamped like tape tags */}
        <div className="flex flex-wrap items-center gap-2">
          {course.category && (
            <span className="dxacid-chip text-[var(--dxacid-up)]">
              {(isAr && course.category.nameArabic) || course.category.name}
            </span>
          )}
          <span className="dxacid-chip">{tField(`level.${course.level}`)}</span>
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-snug">{title}</h3>
        {desc && <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">{desc}</p>}

        {/* Trade-confirmation meta row with dotted leaders */}
        <div className="mt-auto border-t-2 border-[var(--dxacid-line)] pt-3">
          <div className="flex items-baseline font-mono text-xs font-semibold text-[var(--muted-foreground)]">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" aria-hidden />
              {course.totalLessons}
            </span>
            <span className="dxacid-leader" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden />
              {durationLabel}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span
              className="inline-grid size-6 shrink-0 place-items-center border-2 border-[var(--dxacid-line)] bg-[var(--secondary)] font-mono text-[10px] font-semibold uppercase text-[var(--foreground)]"
              style={{ borderRadius: "9999px" }}
            >
              {course.instructor.user.fullName.charAt(0)}
            </span>
            <span>{course.instructor.user.fullName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
