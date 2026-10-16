"use client";

import { CourseCard } from "@/components/public/course-card";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { useGetInstructorQuery } from "@/redux/api/instructorsApi";
import { ArrowLeft, Globe, Linkedin, Loader2, Twitter } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const socialClass =
  "grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-accent";

export default function InstructorProfilePage() {
  const params = useParams();
  const id = String(params?.id || "");
  const isAr = useLocale() === "ar";
  const t = useTranslations("instructorsPage");
  const tHome = useTranslations("home");

  const { data, isLoading, isError } = useGetInstructorQuery(id, { skip: !id });
  const { data: coursesRes } = useListCoursesQuery({ instructorId: id, limit: 24 }, { skip: !id });

  const instructor = data?.data;
  const courses = coursesRes?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (isError || !instructor) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-display text-2xl">{t("notFound")}</p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/instructors">
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {t("back")}
          </Link>
        </Button>
      </div>
    );
  }

  const name = instructor.user.fullName;
  const headline = (isAr && instructor.headlineArabic) || instructor.headline;
  const bio = (isAr && instructor.bioArabic) || instructor.bio;

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-16 text-center md:flex-row md:items-center md:py-20 md:text-start">
          <div className="relative size-32 shrink-0 overflow-hidden rounded-full border border-border bg-paper-2 md:size-40">
            {instructor.user.profile ? (
              <Image
                src={instructor.user.profile}
                alt=""
                fill
                className="object-cover"
                sizes="160px"
                unoptimized
              />
            ) : (
              <div className="grid h-full w-full place-items-center font-display text-5xl text-primary">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <Eyebrow className="mb-4">{tHome("eyebrows.instructors")}</Eyebrow>
            <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">{name}</h1>
            {headline && <p className="mt-3 text-lg leading-8 text-muted-foreground">{headline}</p>}

            {instructor.expertise.length > 0 && (
              <p className="mt-5 text-sm text-muted-foreground">
                <span className="sr-only">{t("expertise")}: </span>
                {instructor.expertise.map((tag, i) => (
                  <span key={tag}>
                    {i > 0 && (
                      <span aria-hidden className="mx-2 text-gold">
                        ·
                      </span>
                    )}
                    {tag}
                  </span>
                ))}
              </p>
            )}

            {(instructor.twitterUrl || instructor.linkedinUrl || instructor.websiteUrl) && (
              <div className="mt-6 flex items-center justify-center gap-2 md:justify-start">
                {instructor.twitterUrl && (
                  <a
                    href={instructor.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialClass}
                    aria-label="Twitter / X"
                  >
                    <Twitter className="size-4" aria-hidden />
                  </a>
                )}
                {instructor.linkedinUrl && (
                  <a
                    href={instructor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialClass}
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="size-4" aria-hidden />
                  </a>
                )}
                {instructor.websiteUrl && (
                  <a
                    href={instructor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialClass}
                    aria-label="Website"
                  >
                    <Globe className="size-4" aria-hidden />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {bio && (
        <section className="mx-auto max-w-3xl px-6 py-16">
          {bio.split("\n").map((line, i) => (
            <p key={i} className="mb-4 text-[17px] leading-8 text-foreground/85">
              {line}
            </p>
          ))}
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <SectionHeading title={t("coursesByInstructor", { name })} />
        <div className="mt-10">
          {courses.length === 0 ? (
            <p className="rounded-xl border border-dashed border-rule-strong/50 py-16 text-center text-muted-foreground">
              {t("noCoursesByInstructor")}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 80}>
                  <CourseCard course={c} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
