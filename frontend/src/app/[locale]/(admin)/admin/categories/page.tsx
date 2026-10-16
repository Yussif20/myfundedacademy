"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { extractApiError } from "@/lib/errors";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useListCategoriesQuery,
} from "@/redux/api/categoriesApi";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AdminCategoriesPage() {
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("common");

  const { data, isLoading, refetch } = useListCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [nameArabic, setNameArabic] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionArabic, setDescriptionArabic] = useState("");
  const [icon, setIcon] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createCategory({
        name,
        nameArabic,
        description,
        descriptionArabic,
        icon,
        isFeatured,
      }).unwrap();
      setName("");
      setNameArabic("");
      setDescription("");
      setDescriptionArabic("");
      setIcon("");
      setIsFeatured(false);
      refetch();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteCategory(id).unwrap();
      refetch();
    } catch (err) {
      alert(extractApiError(err));
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl font-medium tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t("newButton")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
            {error && (
              <div className="md:col-span-2">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={creating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameArabic">{t("nameArabic")}</Label>
              <Input
                id="nameArabic"
                value={nameArabic}
                onChange={(e) => setNameArabic(e.target.value)}
                disabled={creating}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={creating}
                rows={2}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descriptionArabic">{t("descriptionArabic")}</Label>
              <Textarea
                id="descriptionArabic"
                value={descriptionArabic}
                onChange={(e) => setDescriptionArabic(e.target.value)}
                disabled={creating}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">{t("icon")}</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="📈"
                maxLength={4}
                disabled={creating}
              />
            </div>
            <div className="flex items-end gap-3">
              <Switch
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
                disabled={creating}
                id="isFeatured"
              />
              <Label htmlFor="isFeatured">{t("isFeatured")}</Label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={creating || !name}>
                {creating ? tCommon("loading") : tCommon("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : !data?.data?.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("noCategories")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.data.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    {cat.icon && <span className="text-xl">{cat.icon}</span>}
                    <div>
                      <p className="font-medium">
                        {cat.name}
                        {cat.nameArabic && (
                          <span className="ms-2 text-sm text-muted-foreground">
                            ({cat.nameArabic})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cat.isFeatured && <Badge variant="success">★</Badge>}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={tCommon("delete")}
                      onClick={() => onDelete(cat.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
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
