"use client";

import { CategoryIcon } from "@/components/public/category-icon";
import { CourseCard } from "@/components/public/course-card";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const isAr = useLocale() === "ar";

  const t = useTranslations("categoryPage");
  const tHome = useTranslations("home");

  const { data: categoriesRes } = useListCategoriesQuery();
  const category = categoriesRes?.data.find((c) => c.slug === slug);

  const { data, isLoading } = useListCoursesQuery(
    { categorySlug: slug, limit: 24 },
    { skip: !slug },
  );
  const courses = data?.data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow className="mb-5">{tHome("eyebrows.categories")}</Eyebrow>
          <div className="flex items-center gap-4">
            {category && (
              <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary">
                <CategoryIcon icon={category.icon} className="size-6" />
              </span>
            )}
            <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
              {category ? (isAr && category.nameArabic) || category.name : slug}
            </h1>
          </div>
          {category && (category.description || category.descriptionArabic) && (
            <p className="mt-5 leading-7 text-muted-foreground">
              {(isAr && category.descriptionArabic) || category.description}
            </p>
          )}
        </header>
      </Reveal>

      <div className="mt-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-rule-strong/50 py-20 text-center">
            <p className="font-display text-xl">{t("noCoursesInCategory")}</p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/courses">
                {tHome("browseAll")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Button>
          </div>
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
    </div>
  );
}
