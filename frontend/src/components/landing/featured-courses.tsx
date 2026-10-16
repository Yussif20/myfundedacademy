"use client";

import { CourseCard } from "@/components/public/course-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShimmerCard } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturedCourses() {
  const t = useTranslations("home");

  const { data: featuredRes, isLoading } = useListCoursesQuery({ featured: true, limit: 6 });
  const { data: allRes } = useListCoursesQuery({ limit: 6 });

  // Three cards make one clean row on desktop.
  const courses = (
    (featuredRes?.data?.data?.length ? featuredRes.data.data : allRes?.data?.data) || []
  ).slice(0, 3);

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrows.featured")}
            title={t("featuredCourses")}
            lead={t("featuredCoursesSub")}
            action={
              <Button asChild variant="outline">
                <Link href="/courses">
                  {t("browseAll")}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </Link>
              </Button>
            }
          />
        </Reveal>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <ShimmerCard key={i} />
              ))}
            </div>
          ) : courses.length === 0 ? null : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 80}>
                  <CourseCard course={c} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
