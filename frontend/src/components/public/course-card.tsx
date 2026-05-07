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
    <Link
      href={{ pathname: `/courses/${course.slug}` }}
      className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--secondary)]">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div
            aria-hidden
            className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/10"
          >
            <BookOpen className="size-10 text-[var(--muted-foreground)]" />
          </div>
        )}
        {course.accessTier !== "FREE" && (
          <Badge variant="default" className="absolute left-3 top-3">
            {tField(`tier.${course.accessTier}`)}
          </Badge>
        )}
        {course.isFeatured && (
          <Badge variant="warning" className="absolute right-3 top-3">
            ★
          </Badge>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-xs">
          {course.category && (
            <span className="text-[var(--primary)]">
              {(isAr && course.category.nameArabic) || course.category.name}
            </span>
          )}
          <span className="text-[var(--muted-foreground)]">·</span>
          <span className="text-[var(--muted-foreground)]">{tField(`level.${course.level}`)}</span>
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight line-clamp-2">
          {title}
        </h3>
        {desc && <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">{desc}</p>}

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
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
          <span className="inline-grid size-6 place-items-center rounded-full bg-[var(--secondary)] text-[10px] font-semibold uppercase">
            {course.instructor.user.fullName.charAt(0)}
          </span>
          <span>{course.instructor.user.fullName}</span>
        </div>
      </div>
    </Link>
  );
}
