"use client";

import { ScrollReveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

/**
 * Phosphor Terminal Noir — the desk roster.
 * Instructors as trading-desk personnel plates: square-cropped avatar in a
 * hairline frame, name with an amber featured marker, headline, and expertise
 * rendered as zero-radius mono tags. Ticks reveal on hover.
 */
export function PhosphorDesk() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: instructorsRes } = useListInstructorsQuery({ featured: true });
  const instructors = instructorsRes?.data || [];

  if (instructors.length === 0) return null;

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {t("featuredInstructors")}
              </h2>
              <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
                {t("featuredInstructorsSub")}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="gap-2 self-start rounded-[2px] border-[var(--border)] sm:self-auto"
            >
              <Link href="/instructors">
                {t("browseAll")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, idx) => {
            const headline = (isAr && instructor.headlineArabic) || instructor.headline;
            return (
              <ScrollReveal key={instructor.id} delay={idx * 0.06} amount={0.2}>
                <Link
                  href={{ pathname: `/instructors/${instructor.id}` }}
                  className="dxphosphor-card dxphosphor-ticks dxphosphor-ticks--hover group flex h-full items-start gap-4 p-5"
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-[2px] border border-[var(--border)] bg-[var(--secondary)]">
                    {instructor.user.profile ? (
                      <Image
                        src={instructor.user.profile}
                        alt={instructor.user.fullName}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center font-mono text-lg font-semibold uppercase text-[var(--primary)]">
                        {instructor.user.fullName.charAt(0)}
                      </span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-medium transition-colors group-hover:text-[var(--primary)]">
                        {instructor.user.fullName}
                      </span>
                      {instructor.isFeatured && (
                        <span
                          aria-hidden
                          className="font-mono text-[11px] leading-none text-[var(--dxphosphor-amber)]"
                        >
                          ★
                        </span>
                      )}
                    </span>
                    {headline && (
                      <span className="mt-1 line-clamp-2 block text-sm text-[var(--muted-foreground)]">
                        {headline}
                      </span>
                    )}
                    {instructor.expertise.length > 0 && (
                      <span className="mt-2.5 flex flex-wrap gap-1.5">
                        {instructor.expertise.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--muted-foreground)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
