"use client";

import { AvatarUploader } from "@/components/public/avatar-uploader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { extractApiError } from "@/lib/errors";
import {
  useGetMyInstructorProfileQuery,
  useUpdateMyInstructorProfileMutation,
} from "@/redux/api/instructorsApi";
import { Loader2, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

export default function InstructorProfilePage() {
  const t = useTranslations("instructor.profile");
  const { data, isLoading, refetch } = useGetMyInstructorProfileQuery();
  const [updateMe, { isLoading: saving }] = useUpdateMyInstructorProfileMutation();

  const [form, setForm] = useState<{
    fullName: string;
    headline: string;
    headlineArabic: string;
    bio: string;
    bioArabic: string;
    expertise: string[];
    twitterUrl: string;
    linkedinUrl: string;
    websiteUrl: string;
  } | null>(null);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = data?.data;
    if (!p) return;
    setForm({
      fullName: p.user.fullName,
      headline: p.headline,
      headlineArabic: p.headlineArabic,
      bio: p.bio,
      bioArabic: p.bioArabic,
      expertise: p.expertise || [],
      twitterUrl: p.twitterUrl,
      linkedinUrl: p.linkedinUrl,
      websiteUrl: p.websiteUrl,
    });
  }, [data]);

  if (isLoading || !form) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const set = <K extends keyof NonNullable<typeof form>>(k: K, v: NonNullable<typeof form>[K]) =>
    setForm((s) => (s ? { ...s, [k]: v } : s));

  const addExpertise = () => {
    const v = expertiseInput.trim();
    if (!v || form.expertise.includes(v)) {
      setExpertiseInput("");
      return;
    }
    set("expertise", [...form.expertise, v].slice(0, 20));
    setExpertiseInput("");
  };

  const removeExpertise = (tag: string) => {
    set(
      "expertise",
      form.expertise.filter((x) => x !== tag),
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updateMe(form).unwrap();
      toast.success(t("savedToast"));
      refetch();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl font-medium tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("publicProfile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AvatarUploader
              value={data?.data?.user.profile || ""}
              initial={(form.fullName || data?.data?.user.email || "?").charAt(0)}
              onChange={async (url) => {
                try {
                  await updateMe({ profile: url }).unwrap();
                  refetch();
                } catch (err) {
                  setError(extractApiError(err));
                }
              }}
              disabled={saving}
            />
          </div>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">{t("fullName")}</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">{t("headline")}</Label>
              <Input
                id="headline"
                value={form.headline}
                onChange={(e) => set("headline", e.target.value)}
                placeholder={t("headlinePlaceholder")}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headlineArabic">{t("headlineArabic")}</Label>
              <Input
                id="headlineArabic"
                value={form.headlineArabic}
                onChange={(e) => set("headlineArabic", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">{t("bio")}</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={5}
                disabled={saving}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bioArabic">{t("bioArabic")}</Label>
              <Textarea
                id="bioArabic"
                value={form.bioArabic}
                onChange={(e) => set("bioArabic", e.target.value)}
                rows={5}
                disabled={saving}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t("expertise")}</Label>
              <div className="flex flex-wrap gap-2">
                {form.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border border-primary/30 bg-primary/8 text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeExpertise(tag)}
                      className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
                      aria-label="Remove"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExpertise();
                    }
                  }}
                  placeholder={t("expertisePlaceholder")}
                  disabled={saving}
                />
                <Button type="button" variant="outline" onClick={addExpertise} disabled={saving}>
                  {t("add")}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterUrl">{t("twitter")}</Label>
              <Input
                id="twitterUrl"
                type="url"
                value={form.twitterUrl}
                onChange={(e) => set("twitterUrl", e.target.value)}
                placeholder="https://twitter.com/yourhandle"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">{t("linkedin")}</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/you"
                disabled={saving}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="websiteUrl">{t("website")}</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={form.websiteUrl}
                onChange={(e) => set("websiteUrl", e.target.value)}
                placeholder="https://yoursite.com"
                disabled={saving}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {saving ? t("saving") : t("save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
