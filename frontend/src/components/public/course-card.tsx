"use client";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { CourseSummary } from "@/redux/api/coursesApi";
import { BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export function CourseCard({ course }: { course: CourseSummary }) {
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
    <div className="group relative h-full">
      {/* Animated gradient border halo on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[calc(var(--radius)+2px)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-50"
        style={{
          background:
            "conic-gradient(from 0deg, color-mix(in oklch, var(--primary) 60%, transparent), color-mix(in oklch, var(--accent) 50%, transparent), color-mix(in oklch, var(--primary) 60%, transparent))",
        }}
      />

      <Link
        href={{ pathname: `/courses/${course.slug}` }}
        className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklch,var(--primary)_40%,transparent)] hover:shadow-xl hover:shadow-[color-mix(in_oklch,var(--primary)_15%,transparent)]"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-[var(--secondary)]">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div
              aria-hidden
              className="grid h-full w-full place-items-center bg-gradient-to-br from-[color-mix(in_oklch,var(--primary)_20%,transparent)] to-[color-mix(in_oklch,var(--accent)_10%,transparent)]"
            >
              <BookOpen className="size-10 text-[var(--muted-foreground)]" />
            </div>
          )}

          {/* Shine sweep on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
          />

          {/* Bottom fade overlay for badges */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          {course.accessTier !== "FREE" && (
            <Badge variant="default" className="absolute left-3 top-3 backdrop-blur">
              {tField(`tier.${course.accessTier}`)}
            </Badge>
          )}
          {course.isFeatured && (
            <Badge variant="warning" className="absolute right-3 top-3">
              ★
            </Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-2 text-xs">
            {course.category && (
              <span className="text-[var(--primary)]">
                {(isAr && course.category.nameArabic) || course.category.name}
              </span>
            )}
            <span className="text-[var(--muted-foreground)]">·</span>
            <span className="text-[var(--muted-foreground)]">
              {tField(`level.${course.level}`)}
            </span>
          </div>
          <h3 className="font-display line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-[var(--primary)]">
            {title}
          </h3>
          {desc && <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">{desc}</p>}

          <div className="mt-auto flex items-center justify-between border-t border-[color-mix(in_oklch,var(--border)_60%,transparent)] pt-3 text-sm">
            <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="size-3.5" />
                {course.totalLessons}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {durationLabel}
              </span>
            </div>
            <div className="text-right">
              {course.oneTimePrice > 0 ? (
                <span className="font-display font-semibold text-[var(--foreground)]">
                  ${course.oneTimePrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-xs text-[var(--muted-foreground)]">Sub-only</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span
              className="inline-grid size-6 place-items-center rounded-full text-[10px] font-semibold uppercase text-[var(--primary)]"
              style={{
                background: "color-mix(in oklch, var(--primary) 15%, transparent)",
                border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
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
