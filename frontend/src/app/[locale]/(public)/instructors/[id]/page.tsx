"use client";

import { CourseCard } from "@/components/public/course-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { useGetInstructorQuery } from "@/redux/api/instructorsApi";
import { Globe, Linkedin, Loader2, Twitter } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function InstructorProfilePage() {
  const params = useParams();
  const id = String(params?.id || "");
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("instructorsPage");

  const { data, isLoading, isError } = useGetInstructorQuery(id, { skip: !id });
  const { data: coursesRes } = useListCoursesQuery({ instructorId: id, limit: 24 }, { skip: !id });

  const instructor = data?.data;
  const courses = coursesRes?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (isError || !instructor) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">404</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Instructor not found.</p>
        <Button asChild className="mt-6">
          <Link href="/instructors">Back to instructors</Link>
        </Button>
      </div>
    );
  }

  const name = instructor.user.fullName;
  const headline = (isAr && instructor.headlineArabic) || instructor.headline;
  const bio = (isAr && instructor.bioArabic) || instructor.bio;

  return (
    <div>
      <section className="border-b border-[var(--border)] bg-[var(--card)]/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start">
          <div className="relative size-32 shrink-0 overflow-hidden rounded-2xl bg-[var(--secondary)]">
            {instructor.user.profile ? (
              <Image
                src={instructor.user.profile}
                alt={name}
                fill
                className="object-cover"
                sizes="128px"
                unoptimized
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--primary)]/30 to-[var(--accent)]/20 font-display text-4xl font-semibold text-[var(--primary)]">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-4xl font-bold tracking-tight">{name}</h1>
              {instructor.isFeatured && <Badge variant="warning">★</Badge>}
            </div>
            {headline && <p className="mt-2 text-lg text-[var(--muted-foreground)]">{headline}</p>}

            {instructor.expertise.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  {t("expertise")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {instructor.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--foreground)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(instructor.twitterUrl || instructor.linkedinUrl || instructor.websiteUrl) && (
              <div className="mt-6 flex items-center gap-3">
                {instructor.twitterUrl && (
                  <a
                    href={instructor.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                    aria-label="Twitter / X"
                  >
                    <Twitter className="size-4" />
                  </a>
                )}
                {instructor.linkedinUrl && (
                  <a
                    href={instructor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="size-4" />
                  </a>
                )}
                {instructor.websiteUrl && (
                  <a
                    href={instructor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                    aria-label="Website"
                  >
                    <Globe className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {bio && (
        <section className="mx-auto max-w-4xl px-6 py-10">
          <div className="prose prose-invert max-w-none text-[var(--muted-foreground)]">
            {bio.split("\n").map((line, i) => (
              <p key={i} className="mb-3 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="font-display mb-6 text-2xl font-bold tracking-tight">
          {t("coursesByInstructor", { name })}
        </h2>
        {courses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--muted-foreground)]">
            {t("noCoursesByInstructor")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
