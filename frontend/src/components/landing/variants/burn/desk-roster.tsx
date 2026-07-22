"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { BurnHeading } from "./section-heading";

/**
 * Controlled Burn instructors — the desk roster.
 * Heat-seam plates: round avatar (the only full radius in the system),
 * mono roster index with a solar-gold star for featured traders, and
 * expertise as 2px tape chips pinned to the plate's foot.
 */
export function BurnInstructors() {
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
          <BurnHeading
            index="04"
            title={t("featuredInstructors")}
            sub={t("featuredInstructorsSub")}
            action={
              <Link
                href="/instructors"
                className="dxburn-navlink group inline-flex items-center gap-2 self-start pb-1 text-sm font-medium text-[var(--primary)] sm:self-auto"
              >
                {t("browseAll")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
            }
          />
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((ins, idx) => {
            const headline = (isAr && ins.headlineArabic) || ins.headline;
            return (
              <ScrollReveal key={ins.id} delay={idx * 0.06} amount={0.2}>
                <Link
                  href={{ pathname: `/instructors/${ins.id}` }}
                  className="dxburn-card dxburn-seam group flex h-full flex-col p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-[color-mix(in_oklch,var(--primary)_35%,transparent)] bg-[var(--secondary)]">
                      {ins.user.profile ? (
                        <Image
                          src={ins.user.profile}
                          alt={ins.user.fullName}
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center font-display text-lg font-semibold text-[var(--primary)]">
                          {ins.user.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="dxburn-micro flex items-center gap-2 text-[var(--muted-foreground)]">
                      {String(idx + 1).padStart(2, "0")}
                      {ins.isFeatured && (
                        <span aria-hidden className="text-[#FFB020]">
                          ★
                        </span>
                      )}
                    </span>
                  </div>

                  <p className="font-display mt-4 text-lg font-semibold transition-colors group-hover:text-[var(--primary)]">
                    {ins.user.fullName}
                  </p>
                  {headline && (
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                      {headline}
                    </p>
                  )}

                  {ins.expertise.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {ins.expertise.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="dxburn-micro rounded-[2px] border border-[var(--border)] bg-[var(--secondary)] px-2 py-1 text-[var(--muted-foreground)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
