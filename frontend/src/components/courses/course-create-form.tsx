"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { useCreateCourseMutation } from "@/redux/api/coursesApi";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { useTranslations } from "next-intl";
import { useState } from "react";

export type CourseCreateMode = "admin" | "instructor";

export function CourseCreateForm({ mode }: { mode: CourseCreateMode }) {
  const t = useTranslations("admin.courses");
  const tField = useTranslations("admin.fields");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { data: instructorsData } = useListInstructorsQuery(undefined, { skip: mode !== "admin" });
  const { data: categoriesData } = useListCategoriesQuery();
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const [form, setForm] = useState({
    title: "",
    titleArabic: "",
    shortDescription: "",
    instructorId: "",
    categoryId: "",
    level: "ALL_LEVELS" as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS",
    language: "EN" as "EN" | "AR" | "BOTH",
    accessTier: "FREE" as "FREE" | "STARTER" | "PRO",
    oneTimePrice: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "admin" && !form.instructorId) {
      setError("Pick an instructor.");
      return;
    }
    try {
      const res = await createCourse({
        title: form.title,
        titleArabic: form.titleArabic,
        shortDescription: form.shortDescription,
        // Instructor is forced server-side for INSTRUCTOR role; only admin sends it.
        ...(mode === "admin" ? { instructorId: form.instructorId } : {}),
        categoryId: form.categoryId || null,
        level: form.level,
        language: form.language,
        accessTier: form.accessTier,
        oneTimePrice: Number(form.oneTimePrice) || 0,
      } as Parameters<typeof createCourse>[0]).unwrap();
      const next =
        mode === "admin" ? `/admin/courses/${res.data.id}` : `/instructor/courses/${res.data.id}`;
      router.push(next as Parameters<typeof router.push>[0]);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("newTitle")}</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("newTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            {error && (
              <div className="md:col-span-2">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">{t("title_")}</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleArabic">{t("titleArabic")}</Label>
              <Input
                id="titleArabic"
                value={form.titleArabic}
                onChange={(e) => set("titleArabic", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="shortDescription">{t("shortDescription")}</Label>
              <Textarea
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                rows={2}
                disabled={isLoading}
              />
            </div>

            {mode === "admin" && (
              <div className="space-y-2">
                <Label htmlFor="instructorId">{t("instructor")}</Label>
                <Select
                  id="instructorId"
                  value={form.instructorId}
                  onChange={(e) => set("instructorId", e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="">—</option>
                  {(instructorsData?.data || []).map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.user.fullName}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="categoryId">{t("category")}</Label>
              <Select
                id="categoryId"
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                disabled={isLoading}
              >
                <option value="">—</option>
                {(categoriesData?.data || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">{t("level")}</Label>
              <Select
                id="level"
                value={form.level}
                onChange={(e) => set("level", e.target.value as never)}
                disabled={isLoading}
              >
                {(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"] as const).map((l) => (
                  <option key={l} value={l}>
                    {tField(`level.${l}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">{t("language")}</Label>
              <Select
                id="language"
                value={form.language}
                onChange={(e) => set("language", e.target.value as never)}
                disabled={isLoading}
              >
                {(["EN", "AR", "BOTH"] as const).map((l) => (
                  <option key={l} value={l}>
                    {tField(`language.${l}`)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessTier">{t("tier")}</Label>
              <Select
                id="accessTier"
                value={form.accessTier}
                onChange={(e) => set("accessTier", e.target.value as never)}
                disabled={isLoading}
              >
                {(["FREE", "STARTER", "PRO"] as const).map((l) => (
                  <option key={l} value={l}>
                    {tField(`tier.${l}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="oneTimePrice">{t("price")}</Label>
              <Input
                id="oneTimePrice"
                type="number"
                step="0.01"
                min={0}
                value={form.oneTimePrice}
                onChange={(e) => set("oneTimePrice", Number(e.target.value))}
                disabled={isLoading}
              />
              <p className="text-xs text-[var(--muted-foreground)]">{t("priceHelp")}</p>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? tCommon("loading") : tCommon("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
