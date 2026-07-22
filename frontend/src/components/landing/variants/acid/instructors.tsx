"use client";

import { Link } from "@/i18n/navigation";
import { useListInstructorsQuery, type InstructorProfile } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { type CSSProperties } from "react";
import { AcidSectionHeader } from "./section-header";
import { SnapIn } from "./snap";

/**
 * Acid Ledger instructors — a trader roster: hard-shadow personnel cards with
 * a circular avatar (round = human, the identity's only circles), a featured
 * star sticker, and expertise stamped as flat mono tags.
 */
export function AcidInstructors() {
  const t = useTranslations("home");

  const { data: instructorsRes } = useListInstructorsQuery({ featured: true });
  const instructors = instructorsRes?.data || [];

  if (instructors.length === 0) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AcidSectionHeader
          title={t("featuredInstructors")}
          sub={t("featuredInstructorsSub")}
          action={
            <Link
              href="/instructors"
              className="dxacid-btn-ghost inline-flex h-11 items-center gap-2 self-start px-5 text-xs sm:self-auto"
            >
              {t("browseAll")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          }
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, i) => (
            <SnapIn key={instructor.id} delay={(i % 3) * 0.08}>
              <RosterCard instructor={instructor} />
            </SnapIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function RosterCard({ instructor }: { instructor: InstructorProfile }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const headline = (isAr && instructor.headlineArabic) || instructor.headline;

  return (
    <Link
      href={{ pathname: `/instructors/${instructor.id}` }}
      className="dxacid-hard dxacid-hard-int relative flex h-full items-start gap-4 p-5"
    >
      {instructor.isFeatured && (
        <span
          className="dxacid-sticker dxacid-sticker-acid absolute -top-3 end-4"
          style={{ "--dxacid-tilt": "3deg" } as CSSProperties}
          aria-hidden
        >
          ★
        </span>
      )}

      <span
        className="relative size-14 shrink-0 overflow-hidden border-2 border-[var(--dxacid-line)] bg-[var(--secondary)]"
        style={{ borderRadius: "9999px" }}
      >
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
          <span className="grid h-full w-full place-items-center font-mono text-lg font-semibold text-[var(--dxacid-up)]">
            {instructor.user.fullName.charAt(0)}
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-bold">{instructor.user.fullName}</span>
        {headline && (
          <span className="mt-1 line-clamp-2 block text-sm text-[var(--muted-foreground)]">
            {headline}
          </span>
        )}
        {instructor.expertise.length > 0 && (
          <span className="mt-3 flex flex-wrap gap-1.5">
            {instructor.expertise.slice(0, 3).map((tag) => (
              <span key={tag} className="dxacid-chip">
                {tag}
              </span>
            ))}
          </span>
        )}
      </span>
    </Link>
  );
}
