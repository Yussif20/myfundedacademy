"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { SectionHead } from "./ornaments";

/**
 * "The Ledger Club" partners' register — instructors as entries in a bound
 * register: one framed panel, hairline-separated rows, round portrait (the
 * only round object besides the seal), name in Fraunces, headline in muted
 * taupe, expertise as stamped tags, and a dotted leader to the row's arrow.
 */
export function LedgerPartners() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: instructorsRes } = useListInstructorsQuery({ featured: true });
  const instructors = instructorsRes?.data || [];

  if (instructors.length === 0) return null;

  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <SectionHead
            index="№ 04"
            title={t("featuredInstructors")}
            sub={t("featuredInstructorsSub")}
          />
        </ScrollReveal>

        <ScrollReveal amount={0.15}>
          <div className="dxledger-frame dxledger-ticks relative p-[9px]">
            {instructors.map((instructor) => {
              const headline = (isAr && instructor.headlineArabic) || instructor.headline;
              return (
                <Link
                  key={instructor.id}
                  href={{ pathname: `/instructors/${instructor.id}` }}
                  className="dxledger-row group flex items-center gap-4 px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-full border border-[var(--dxledger-gold-mid)] bg-[var(--secondary)]">
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
                      <span className="font-display grid h-full w-full place-items-center text-lg font-semibold text-[var(--dxledger-gold)]">
                        {instructor.user.fullName.charAt(0)}
                      </span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-display truncate font-semibold tracking-tight transition-colors group-hover:text-[var(--dxledger-gold)]">
                        {instructor.user.fullName}
                      </span>
                      {instructor.isFeatured && (
                        <span
                          className="text-xs leading-none text-[var(--dxledger-gold)]"
                          aria-hidden
                        >
                          ★
                        </span>
                      )}
                    </span>
                    {headline && (
                      <span className="mt-0.5 line-clamp-1 block text-xs text-[var(--muted-foreground)]">
                        {headline}
                      </span>
                    )}
                  </span>

                  {instructor.expertise.length > 0 && (
                    <span className="hidden shrink-0 items-center gap-1.5 md:flex">
                      {instructor.expertise.slice(0, 2).map((tag) => (
                        <span key={tag} className="dxledger-tag">
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}

                  <span className="dxledger-dots hidden sm:block" aria-hidden />
                  <ArrowRight
                    className="size-4 shrink-0 text-[var(--dxledger-gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 rtl:rotate-180"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="mt-10 text-center">
          <Link
            href="/instructors"
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
