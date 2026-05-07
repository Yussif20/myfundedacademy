"use client";

import { CourseCard } from "@/components/public/course-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const locale = useLocale();
  const isAr = locale === "ar";

  const t = useTranslations("categoryPage");

  const { data: categoriesRes } = useListCategoriesQuery();
  const category = categoriesRes?.data.find((c) => c.slug === slug);

  const { data, isLoading } = useListCoursesQuery(
    { categorySlug: slug, limit: 24 },
    { skip: !slug },
  );
  const courses = data?.data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display flex items-center gap-3 text-4xl font-bold tracking-tight">
          {category?.icon && <span className="text-3xl">{category.icon}</span>}
          {category ? (isAr && category.nameArabic) || category.name : slug}
        </h1>
        {category && (
          <p className="mt-2 text-[var(--muted-foreground)]">
            {(isAr && category.descriptionArabic) || category.description}
          </p>
        )}
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] py-20 text-center text-sm text-[var(--muted-foreground)]">
          <p>{t("noCoursesInCategory")}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/courses">Browse all courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
