"use client";

import { ScrollReveal } from "@/components/motion";
import { ShimmerCard } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery, type CourseSummary } from "@/redux/api/coursesApi";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

/** Featured courses as machined obsidian tiles: duotoned thumbnails, mono data
 *  chips, prices as prismatic-hairline quote chips, index numbers like a
 *  catalog — the prism edge ignites only on hover. */
export function HoloCourses() {
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
              <span className="dxholo-eyebrow">04</span>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                {t("featuredCourses")}
              </h2>
              <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
                {t("featuredCoursesSub")}
              </p>
            </div>
            <Link
              href="/courses"
              className="group inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-[6px] border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:self-auto"
            >
              {t("browseAll")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--muted-foreground)]">
            No published courses yet — admin can add some at /admin/courses.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <ScrollReveal key={course.id} delay={i * 0.06} amount={0.2}>
                <HoloCourseCard course={course} index={i} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function HoloCourseCard({ course, index }: { course: CourseSummary; index: number }) {
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
    <div className="dxholo-tile group h-full">
      <Link
        href={{ pathname: `/courses/${course.slug}` }}
        className="flex h-full flex-col overflow-hidden rounded-[10px] focus-visible:outline-none"
      >
        {/* Thumbnail: cool duotone, specular sweep, chips as instrumentation */}
        <div className="dxholo-sheen relative aspect-video w-full overflow-hidden bg-[var(--secondary)]">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={title}
              fill
              className="object-cover saturate-[0.88] transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div
              aria-hidden
              className="grid h-full w-full place-items-center"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklch, var(--primary) 16%, transparent), color-mix(in oklch, var(--accent) 10%, transparent))",
              }}
            >
              <BookOpen className="size-10 text-[var(--muted-foreground)]" />
            </div>
          )}

          {/* Cool duotone wash unifying mixed instructor imagery */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(10, 13, 26, 0.55), transparent 45%)",
            }}
          />

          {course.category && (
            <span
              className="dxholo-chip absolute start-3 top-3 text-[var(--primary)]"
              style={{ background: "color-mix(in oklch, var(--background) 72%, transparent)" }}
            >
              {(isAr && course.category.nameArabic) || course.category.name}
            </span>
          )}

          <span
            className="dxholo-chip absolute end-3 top-3 text-[var(--muted-foreground)]"
            style={{ background: "color-mix(in oklch, var(--background) 72%, transparent)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {course.isFeatured && (
            <span
              className="dxholo-chip absolute bottom-3 end-3 text-[#FFC46B]"
              style={{ background: "color-mix(in oklch, var(--background) 72%, transparent)" }}
            >
              ★
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <span className="dxholo-chip border border-[var(--border)] text-[var(--muted-foreground)]">
              {tField(`level.${course.level}`)}
            </span>
            {course.accessTier !== "FREE" && course.oneTimePrice > 0 && (
              <span
                className="dxholo-chip text-[var(--accent)]"
                style={{ background: "color-mix(in oklch, var(--accent) 14%, transparent)" }}
              >
                {tField(`tier.${course.accessTier}`)}
              </span>
            )}
          </div>

          <h3 className="font-display line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
            {title}
          </h3>
          {desc && <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">{desc}</p>}

          {/* Data row — mono tabular, like a terminal readout */}
          <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-3">
            <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
              <span className="dxholo-num inline-flex items-center gap-1">
                <BookOpen className="size-3.5" aria-hidden />
                {course.totalLessons}
              </span>
              <span className="dxholo-num inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden />
                {durationLabel}
              </span>
            </div>
            {course.oneTimePrice > 0 ? (
              <span className="dxholo-chip dxholo-prism-border bg-[var(--card)] text-xs font-semibold text-[var(--foreground)]">
                ${course.oneTimePrice.toFixed(2)}
              </span>
            ) : (
              <span
                className="dxholo-chip text-[var(--accent)]"
                style={{ background: "color-mix(in oklch, var(--accent) 14%, transparent)" }}
              >
                {tField(`tier.${course.accessTier}`)}
              </span>
            )}
          </div>

          {/* Instructor row */}
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span
              className="inline-grid size-6 place-items-center rounded-full text-[10px] font-semibold uppercase text-[var(--primary)]"
              style={{
                background: "color-mix(in oklch, var(--primary) 14%, transparent)",
                border: "1px solid color-mix(in oklch, var(--primary) 28%, transparent)",
              }}
            >
              {course.instructor.user.fullName.charAt(0)}
            </span>
            <span>{course.instructor.user.fullName}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
