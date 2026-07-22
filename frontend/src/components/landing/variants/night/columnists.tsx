"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { EditionSection } from "./edition-section";

/**
 * The instructors as the paper's columnists — byline plates rather than SaaS
 * cards. Round portrait (the page's only round object), serif name, italic
 * headline as the column's deck, and expertise set as a mono agate line
 * ("RISK / PRICE ACTION / FUTURES") pinned to the plate's foot.
 */
export function NightColumnists({ index }: { index: string }) {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: instructorsRes } = useListInstructorsQuery({ featured: true });
  const instructors = instructorsRes?.data || [];

  if (instructors.length === 0) return null;

  return (
    <EditionSection index={index}>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <h2 className="dxnight-headline font-display text-3xl md:text-5xl">
                  {t("featuredInstructors")}
                </h2>
                <p className="mt-3 text-[var(--muted-foreground)]">{t("featuredInstructorsSub")}</p>
              </div>
              <Link
                href="/instructors"
                className="dxnight-kicker dxnight-underline inline-flex items-center gap-2 self-start pb-0.5 text-[var(--primary)] sm:self-auto"
              >
                {t("browseAll")}
                <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instructors.map((ins, idx) => {
              const headline = (isAr && ins.headlineArabic) || ins.headline;
              return (
                <ScrollReveal key={ins.id} delay={idx * 0.06} amount={0.2}>
                  <Link
                    href={{ pathname: `/instructors/${ins.id}` }}
                    className="dxnight-plate group flex h-full flex-col p-6"
                  >
                    <div className="flex items-start justify-between">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[var(--secondary)]">
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
                          <span className="grid h-full w-full place-items-center font-display text-lg text-[var(--primary)]">
                            {ins.user.fullName.charAt(0)}
                          </span>
                        )}
                      </span>
                      {ins.isFeatured && (
                        <span aria-hidden className="text-sm text-[var(--accent)]">
                          ★
                        </span>
                      )}
                    </div>

                    <h3 className="font-display mt-4 text-xl transition-colors group-hover:text-[var(--primary)]">
                      {ins.user.fullName}
                    </h3>
                    {headline && (
                      <p className="dxnight-byline mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                        {headline}
                      </p>
                    )}

                    {ins.expertise.length > 0 && (
                      <div className="mt-auto pt-5">
                        <div className="dxnight-hairline text-[var(--foreground)]" aria-hidden />
                        <p className="dxnight-mono mt-3 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                          {ins.expertise.slice(0, 3).join(" / ")}
                        </p>
                      </div>
                    )}
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </EditionSection>
  );
}
