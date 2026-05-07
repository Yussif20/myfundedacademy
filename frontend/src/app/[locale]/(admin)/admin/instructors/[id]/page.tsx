"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useGetInstructorQuery, useUpdateInstructorMutation } from "@/redux/api/instructorsApi";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditInstructorPage() {
  const t = useTranslations("admin.instructors");
  const tCommon = useTranslations("common");
  const params = useParams();
  const id = String(params?.id || "");
  const router = useRouter();
  const { data, isLoading } = useGetInstructorQuery(id, { skip: !id });
  const [update, { isLoading: saving }] = useUpdateInstructorMutation();

  const [form, setForm] = useState({
    fullName: "",
    country: "",
    headline: "",
    headlineArabic: "",
    bio: "",
    bioArabic: "",
    expertise: "",
    twitterUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    isFeatured: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    const p = data?.data;
    if (!p) return;
    setForm({
      fullName: p.user.fullName,
      country: p.user.country || "",
      headline: p.headline || "",
      headlineArabic: p.headlineArabic || "",
      bio: p.bio || "",
      bioArabic: p.bioArabic || "",
      expertise: (p.expertise || []).join(", "),
      twitterUrl: p.twitterUrl || "",
      linkedinUrl: p.linkedinUrl || "",
      websiteUrl: p.websiteUrl || "",
      isFeatured: p.isFeatured,
    });
  }, [data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      await update({
        id,
        patch: {
          fullName: form.fullName,
          country: form.country,
          headline: form.headline,
          headlineArabic: form.headlineArabic,
          bio: form.bio,
          bioArabic: form.bioArabic,
          expertise: form.expertise
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          twitterUrl: form.twitterUrl,
          linkedinUrl: form.linkedinUrl,
          websiteUrl: form.websiteUrl,
          isFeatured: form.isFeatured,
        },
      }).unwrap();
      setSaved(true);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("editTitle")}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{data?.data?.user.email}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/instructors")}>
          {tCommon("back")}
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("editTitle")}</CardTitle>
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
            {saved && (
              <div className="md:col-span-2">
                <Alert variant="success">
                  <AlertDescription>{tCommon("saveChanges")} ✓</AlertDescription>
                </Alert>
              </div>
            )}

            <FormField label={t("fullName")} htmlFor="fullName">
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                disabled={saving}
              />
            </FormField>
            <FormField label={t("country")} htmlFor="country">
              <Input
                id="country"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                disabled={saving}
              />
            </FormField>

            <FormField label={t("headline")} htmlFor="headline">
              <Input
                id="headline"
                value={form.headline}
                onChange={(e) => set("headline", e.target.value)}
                disabled={saving}
              />
            </FormField>
            <FormField label={t("headlineArabic")} htmlFor="headlineArabic">
              <Input
                id="headlineArabic"
                value={form.headlineArabic}
                onChange={(e) => set("headlineArabic", e.target.value)}
                disabled={saving}
              />
            </FormField>

            <FormField label={t("bio")} htmlFor="bio" wide>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={3}
                disabled={saving}
              />
            </FormField>
            <FormField label={t("bioArabic")} htmlFor="bioArabic" wide>
              <Textarea
                id="bioArabic"
                value={form.bioArabic}
                onChange={(e) => set("bioArabic", e.target.value)}
                rows={3}
                disabled={saving}
              />
            </FormField>

            <FormField label={t("expertise")} htmlFor="expertise" hint={t("expertiseHelp")} wide>
              <Input
                id="expertise"
                value={form.expertise}
                onChange={(e) => set("expertise", e.target.value)}
                disabled={saving}
              />
            </FormField>

            <FormField label={t("twitter")} htmlFor="twitterUrl">
              <Input
                id="twitterUrl"
                value={form.twitterUrl}
                onChange={(e) => set("twitterUrl", e.target.value)}
                disabled={saving}
              />
            </FormField>
            <FormField label={t("linkedin")} htmlFor="linkedinUrl">
              <Input
                id="linkedinUrl"
                value={form.linkedinUrl}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                disabled={saving}
              />
            </FormField>
            <FormField label={t("website")} htmlFor="websiteUrl">
              <Input
                id="websiteUrl"
                value={form.websiteUrl}
                onChange={(e) => set("websiteUrl", e.target.value)}
                disabled={saving}
              />
            </FormField>
            <div className="flex items-end gap-3">
              <Switch
                checked={form.isFeatured}
                onCheckedChange={(v) => set("isFeatured", v)}
                disabled={saving}
                id="isFeatured"
              />
              <Label htmlFor="isFeatured">{t("isFeatured")}</Label>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? tCommon("loading") : tCommon("saveChanges")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  hint,
  wide,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${wide ? "md:col-span-2" : ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
    </div>
  );
}
