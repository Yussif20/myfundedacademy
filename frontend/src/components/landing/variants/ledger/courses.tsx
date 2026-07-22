"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery, type CourseSummary } from "@/redux/api/coursesApi";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { SectionHead } from "./ornaments";

/**
 * "The Ledger Club" featured courses — each course a certificate plate:
 * double-rule engraved frame, espresso duotone wash over the thumbnail with a
 * gold top hairline, small-caps gold category eyebrow, Fraunces title, a
 * dotted-leader instructor line, and a gold price stamp (or oxblood tier
 * seal). Corner registration ticks fade in on hover.
 */
export function LedgerCourses() {
  const t = useTranslations("home");

  const { data: featuredRes, isLoading } = useListCoursesQuery({
    featured: true,
    limit: 6,
  });
  const { data: allRes } = useListCoursesQuery({ limit: 6 });

  const courses =
    (featuredRes?.data?.data?.length ? featuredRes.data.data : allRes?.data?.data) || [];

  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionHead index="№ 02" title={t("featuredCourses")} sub={t("featuredCoursesSub")} />
        </ScrollReveal>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PlateSkeleton key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="rounded-[4px] border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--muted-foreground)]">
            No published courses yet — admin can add some at /admin/courses.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 0.06} amount={0.2}>
                <CoursePlate course={c} index={i} />
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="dxledger-btn-ghost dxledger-smallcaps group inline-flex h-11 items-center justify-center gap-2 px-7 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {t("browseAll")}
            <ArrowRight className="size-3.5 text-[var(--dxledger-gold)] transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CoursePlate({ course, index }: { course: CourseSummary; index: number }) {
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
      className="dxledger-frame dxledger-ticks-hover group relative flex h-full flex-col transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--dxledger-gold-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] motion-reduce:transform-none"
    >
      {/* Plate: thumbnail inset within the inner hairline, under the wash */}
      <div className="dxledger-wash relative m-[9px] mb-0 aspect-video overflow-hidden rounded-[2px] bg-[var(--secondary)]">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="grid h-full w-full place-items-center" aria-hidden>
            <BookOpen className="size-10 text-[var(--muted-foreground)]" />
          </div>
        )}

        {/* Figure number — top start, like a plate in a catalog */}
        <span className="absolute start-2.5 top-2.5 z-10 rounded-[2px] bg-[var(--background)]/85 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.15em] text-[var(--dxledger-gold)]">
          № {String(index + 1).padStart(2, "0")}
        </span>

        <span className="absolute end-2.5 top-2.5 z-10 flex items-center gap-1.5">
          {course.isFeatured && (
            <span
              className="rounded-[2px] bg-[var(--background)]/85 px-1.5 py-0.5 text-[11px] leading-none text-[var(--dxledger-gold)]"
              aria-hidden
            >
              ★
            </span>
          )}
          {course.accessTier !== "FREE" && (
            <span className="dxledger-seal-chip">{tField(`tier.${course.accessTier}`)}</span>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Category eyebrow + level tag */}
        <div className="flex items-center justify-between gap-2">
          {course.category ? (
            <span className="dxledger-smallcaps text-[10px] text-[var(--dxledger-gold)]">
              {(isAr && course.category.nameArabic) || course.category.name}
            </span>
          ) : (
            <span aria-hidden />
          )}
          <span className="dxledger-tag">{tField(`level.${course.level}`)}</span>
        </div>

        <h3 className="font-display line-clamp-2 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-[var(--dxledger-gold)]">
          {title}
        </h3>

        {desc && (
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {desc}
          </p>
        )}

        {/* Ledger line: instructor …… lessons · duration */}
        <div className="mt-auto flex items-baseline gap-3 pt-2 text-xs text-[var(--muted-foreground)]">
          <span className="line-clamp-1">{course.instructor.user.fullName}</span>
          <span className="dxledger-dots" aria-hidden />
          <span className="flex shrink-0 items-center gap-2.5 font-mono">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3" aria-hidden />
              {course.totalLessons}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {durationLabel}
            </span>
          </span>
        </div>

        {/* Footer rule + price stamp / tier seal */}
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
          {course.oneTimePrice > 0 ? (
            <span className="dxledger-stamp font-mono text-sm">
              ${course.oneTimePrice.toFixed(2)}
            </span>
          ) : (
            <span className="dxledger-seal-chip">{tField(`tier.${course.accessTier}`)}</span>
          )}
          <ArrowRight
            className="size-4 text-[var(--dxledger-gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 rtl:rotate-180"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

function PlateSkeleton() {
  return (
    <div className="dxledger-frame animate-pulse p-[9px]">
      <div className="aspect-video rounded-[2px] bg-[var(--muted)]" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded-[2px] bg-[var(--muted)]" />
        <div className="h-5 w-4/5 rounded-[2px] bg-[var(--muted)]" />
        <div className="h-3 w-full rounded-[2px] bg-[var(--muted)]" />
        <div className="h-8 w-24 rounded-[2px] bg-[var(--muted)]" />
      </div>
    </div>
  );
}
