"use client";

import { Link } from "@/i18n/navigation";
import type { CourseSummary } from "@/redux/api/coursesApi";
import { BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

/** Course card: flat hairline card; on hover the image eases in and a gold rule draws across the top. */
export function CourseCard({ course }: { course: CourseSummary }) {
  const tField = useTranslations("admin.fields");
  const t = useTranslations("cards");
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
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/40"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
      />

      <div className="relative aspect-video w-full overflow-hidden bg-paper-2">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div aria-hidden className="grid h-full w-full place-items-center">
            <BookOpen className="size-10 text-rule-strong" />
          </div>
        )}
        {(course.accessTier !== "FREE" || course.isFeatured) && (
          <div className="absolute start-3 top-3 flex gap-1.5">
            {course.accessTier !== "FREE" && (
              <span className="rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-medium text-foreground">
                {tField(`tier.${course.accessTier}`)}
              </span>
            )}
            {course.isFeatured && (
              <span className="rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-medium text-accent">
                {t("featured")}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          {course.category && (
            <span className="font-medium text-primary">
              {(isAr && course.category.nameArabic) || course.category.name}
            </span>
          )}
          {course.category && (
            <span aria-hidden className="text-gold">
              ·
            </span>
          )}
          <span>{tField(`level.${course.level}`)}</span>
        </p>
        <h3 className="mt-3 line-clamp-2 font-display text-xl font-medium leading-snug tracking-tight">
          {title}
        </h3>
        {desc && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{desc}</p>
        )}

        <p className="mb-4 mt-4 text-xs text-muted-foreground">
          {t("by", { name: course.instructor.user.fullName })}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" aria-hidden />
              <span className="tabular-nums">{t("lessons", { n: course.totalLessons })}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 tabular-nums" dir="ltr">
              <Clock className="size-3.5" aria-hidden />
              {durationLabel}
            </span>
          </div>
          {course.oneTimePrice > 0 ? (
            <span className="font-display text-lg tabular-nums" dir="ltr">
              ${course.oneTimePrice.toFixed(2)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {course.accessTier === "FREE" ? t("free") : t("subOnly")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
