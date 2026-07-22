"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListInstructorsQuery, type InstructorProfile } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

/** Instructors as obsidian profile plates — the avatar wrapped in a conic
 *  prism ring (the brand's earned-shine motif at 100%), expertise as mono
 *  data chips, prism edge on hover. */
export function HoloInstructors() {
  const t = useTranslations("home");

  const { data: instructorsRes } = useListInstructorsQuery({ featured: true });
  const instructors = instructorsRes?.data || [];

  if (instructors.length === 0) return null;

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="dxholo-eyebrow">06</span>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                {t("featuredInstructors")}
              </h2>
              <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
                {t("featuredInstructorsSub")}
              </p>
            </div>
            <Link
              href="/instructors"
              className="group inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-[6px] border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:self-auto"
            >
              {t("browseAll")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, i) => (
            <ScrollReveal key={instructor.id} delay={i * 0.06} amount={0.2}>
              <InstructorPlate instructor={instructor} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstructorPlate({ instructor }: { instructor: InstructorProfile }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const headline = (isAr && instructor.headlineArabic) || instructor.headline;

  return (
    <Link
      href={{ pathname: `/instructors/${instructor.id}` }}
      className="dxholo-tile group flex h-full flex-col items-start gap-4 rounded-[10px] p-6 focus-visible:outline-none"
    >
      <div className="flex w-full items-start justify-between">
        <span className="dxholo-avatar-ring">
          <span className="relative block size-14 overflow-hidden rounded-full bg-[var(--secondary)]">
            {instructor.user.profile ? (
              <Image
                src={instructor.user.profile}
                alt={instructor.user.fullName}
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            ) : (
              <span className="font-display grid h-full w-full place-items-center text-lg font-semibold text-[var(--primary)]">
                {instructor.user.fullName.charAt(0)}
              </span>
            )}
          </span>
        </span>
        {instructor.isFeatured && (
          <span
            className="dxholo-chip text-[#FFC46B]"
            style={{ background: "color-mix(in oklch, var(--secondary) 80%, transparent)" }}
          >
            ★
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
          {instructor.user.fullName}
        </p>
        {headline && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{headline}</p>
        )}
      </div>

      {instructor.expertise.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {instructor.expertise.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="dxholo-chip border border-[var(--border)] text-[var(--muted-foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
