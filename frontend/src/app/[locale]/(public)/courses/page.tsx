"use client";

import { CourseCard } from "@/components/public/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import {
  useListCoursesQuery,
  type AccessTier,
  type CourseLanguage,
  type CourseLevel,
} from "@/redux/api/coursesApi";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const tField = useTranslations("admin.fields");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 350);
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState<CourseLevel | "">("");
  const [language, setLanguage] = useState<CourseLanguage | "">("");
  const [tier, setTier] = useState<AccessTier | "">("");

  const { data: categoriesRes } = useListCategoriesQuery();
  const { data, isLoading, isFetching } = useListCoursesQuery({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
  });

  const courses = (data?.data?.data || []).filter((c) => {
    if (level && c.level !== level) return false;
    if (language && c.language !== language) return false;
    if (tier && c.accessTier !== tier) return false;
    return true;
  });
  const meta = data?.meta;

  const hasFilters = Boolean(search || categoryId || level || language || tier);
  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setLevel("");
    setLanguage("");
    setTier("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      {/* Filters */}
      <div className="mb-8 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)] rtl:left-auto rtl:right-3" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("filters.search")}
            className="pl-9 rtl:pl-3 rtl:pr-9"
          />
        </div>

        <Select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          aria-label={t("filters.category")}
        >
          <option value="">{t("filters.category")}</option>
          {(categoriesRes?.data || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          value={level}
          onChange={(e) => setLevel(e.target.value as CourseLevel | "")}
          aria-label={t("filters.level")}
        >
          <option value="">{t("filters.level")}</option>
          {(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"] as const).map((l) => (
            <option key={l} value={l}>
              {tField(`level.${l}`)}
            </option>
          ))}
        </Select>

        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value as CourseLanguage | "")}
          aria-label={t("filters.language")}
        >
          <option value="">{t("filters.language")}</option>
          {(["EN", "AR", "BOTH"] as const).map((l) => (
            <option key={l} value={l}>
              {tField(`language.${l}`)}
            </option>
          ))}
        </Select>

        <Select
          value={tier}
          onChange={(e) => setTier(e.target.value as AccessTier | "")}
          aria-label={t("filters.tier")}
        >
          <option value="">{t("filters.tier")}</option>
          {(["FREE", "STARTER", "PRO"] as const).map((l) => (
            <option key={l} value={l}>
              {tField(`tier.${l}`)}
            </option>
          ))}
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="size-4" />
            {t("filters.clear")}
          </Button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : courses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] py-20 text-center text-sm text-[var(--muted-foreground)]">
          {t("noResults")}
        </p>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
            <span>{t("showingResults", { count: meta?.total ?? courses.length })}</span>
            {isFetching && <Loader2 className="size-4 animate-spin" />}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
          {meta && meta.totalPage > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t("prev")}
              </Button>
              <span className="text-sm text-[var(--muted-foreground)]">
                {t("page", { page, total: meta.totalPage })}
              </span>
              <Button
                variant="outline"
                disabled={page >= meta.totalPage}
                onClick={() => setPage((p) => p + 1)}
              >
                {t("next")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
