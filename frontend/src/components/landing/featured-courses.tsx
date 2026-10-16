"use client";

import { ScrollReveal } from "@/components/motion";
import { CourseCard } from "@/components/public/course-card";
import { ShimmerCard } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturedCourses() {
  const t = useTranslations("home");

  const { data: featuredRes, isLoading } = useListCoursesQuery({ featured: true, limit: 6 });
  const { data: allRes } = useListCoursesQuery({ limit: 6 });

  const courses =
    (featuredRes?.data?.data?.length ? featuredRes.data.data : allRes?.data?.data) || [];

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {t("featuredCourses")}
              </h2>
              <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
                {t("featuredCoursesSub")}
              </p>
            </div>
            <Button asChild variant="outline" className="self-start gap-2 sm:self-auto">
              <Link href="/courses">
                {t("browseAll")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--muted-foreground)]">
            No published courses yet — admin can add some at /admin/courses.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 0.06} amount={0.2}>
                <CourseCard course={c} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
