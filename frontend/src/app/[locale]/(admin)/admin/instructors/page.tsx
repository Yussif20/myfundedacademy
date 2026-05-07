"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useDeleteInstructorMutation, useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { Edit3, Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminInstructorsPage() {
  const t = useTranslations("admin.instructors");
  const tCommon = useTranslations("common");
  const { data, isLoading, refetch } = useListInstructorsQuery();
  const [deleteInstructor] = useDeleteInstructorMutation();

  const onDelete = async (id: string) => {
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteInstructor(id).unwrap();
      refetch();
    } catch (err) {
      alert(extractApiError(err));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/admin/instructors/new" className="gap-2">
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
          ) : !data?.data?.length ? (
            <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
              {t("noInstructors")}
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {data.data.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium">
                      {p.user.fullName}
                      {p.isFeatured && (
                        <Badge variant="success" className="ml-2">
                          ★
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">{p.user.email}</p>
                    {p.headline && (
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{p.headline}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" aria-label={tCommon("edit")}>
                      <Link href={`/admin/instructors/${p.id}`}>
                        <Edit3 className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={tCommon("delete")}
                      onClick={() => onDelete(p.id)}
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
