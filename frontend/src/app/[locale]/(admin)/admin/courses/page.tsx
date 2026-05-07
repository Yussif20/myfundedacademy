"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useDeleteCourseMutation, useListCoursesQuery } from "@/redux/api/coursesApi";
import { Edit3, Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminCoursesPage() {
  const t = useTranslations("admin.courses");
  const tStatus = useTranslations("admin.fields.status");
  const tCommon = useTranslations("common");
  const { data, isLoading, refetch } = useListCoursesQuery({ limit: 50 });
  const [deleteCourse] = useDeleteCourseMutation();

  const onDelete = async (id: string) => {
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteCourse(id).unwrap();
      refetch();
    } catch (err) {
      alert(extractApiError(err));
    }
  };

  const statusVariant = (s: string) =>
    s === "PUBLISHED" ? "success" : s === "PENDING" ? "warning" : "outline";

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new" className="gap-2">
            <Plus className="size-4" />
            {t("newButton")}
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
            </div>
          ) : !data?.data?.data?.length ? (
            <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
              {t("noCourses")}
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {data.data.data.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{c.title}</p>
                      <Badge variant={statusVariant(c.status) as never}>
                        {tStatus(c.status as never)}
                      </Badge>
                      {c.isFeatured && <Badge variant="success">★</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {c.instructor.user.fullName}
                      {c.category && ` · ${c.category.name}`}
                      {` · $${c.oneTimePrice.toFixed(2)}`}
                      {` · ${c.totalLessons} lessons`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" aria-label={tCommon("edit")}>
                      <Link href={`/admin/courses/${c.id}`}>
                        <Edit3 className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={tCommon("delete")}
                      onClick={() => onDelete(c.id)}
                    >
                      <Trash2 className="size-4 text-[var(--destructive)]" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
