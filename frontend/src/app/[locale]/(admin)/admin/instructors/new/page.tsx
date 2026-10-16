"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useCreateInstructorMutation } from "@/redux/api/instructorsApi";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function NewInstructorPage() {
  const t = useTranslations("admin.instructors");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [create, { isLoading }] = useCreateInstructorMutation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    preferredLocale: "en" as "en" | "ar",
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
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await create({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        country: form.country || undefined,
        preferredLocale: form.preferredLocale,
        headline: form.headline,
        headlineArabic: form.headlineArabic,
        bio: form.bio,
        bioArabic: form.bioArabic,
        expertise: form.expertise
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        twitterUrl: form.twitterUrl || "",
        linkedinUrl: form.linkedinUrl || "",
        websiteUrl: form.websiteUrl || "",
        isFeatured: form.isFeatured,
      }).unwrap();
      router.push("/admin/instructors");
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl font-medium tracking-tight">{t("newTitle")}</h1>
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
            <Field label={t("fullName")} htmlFor="fullName">
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                required
                disabled={isLoading}
              />
            </Field>
            <Field label={t("email")} htmlFor="email">
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
                disabled={isLoading}
              />
            </Field>
            <Field label={t("password")} htmlFor="password" hint={t("passwordHelp")}>
              <PasswordInput
                id="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
            </Field>
            <Field label={t("country")} htmlFor="country">
              <Input
                id="country"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field label={t("preferredLocale")} htmlFor="preferredLocale">
              <Select
                id="preferredLocale"
                value={form.preferredLocale}
                onChange={(e) => set("preferredLocale", e.target.value as "en" | "ar")}
                disabled={isLoading}
              >
                <option value="en">{tCommon("english")}</option>
                <option value="ar">{tCommon("arabic")}</option>
              </Select>
            </Field>
            <div className="hidden md:block" />

            <Field label={t("headline")} htmlFor="headline">
              <Input
                id="headline"
                value={form.headline}
                onChange={(e) => set("headline", e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field label={t("headlineArabic")} htmlFor="headlineArabic">
              <Input
                id="headlineArabic"
                value={form.headlineArabic}
                onChange={(e) => set("headlineArabic", e.target.value)}
                disabled={isLoading}
              />
            </Field>

            <Field label={t("bio")} htmlFor="bio" wide>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </Field>
            <Field label={t("bioArabic")} htmlFor="bioArabic" wide>
              <Textarea
                id="bioArabic"
                value={form.bioArabic}
                onChange={(e) => set("bioArabic", e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </Field>

            <Field label={t("expertise")} htmlFor="expertise" hint={t("expertiseHelp")} wide>
              <Input
                id="expertise"
                value={form.expertise}
                onChange={(e) => set("expertise", e.target.value)}
                disabled={isLoading}
              />
            </Field>

            <Field label={t("twitter")} htmlFor="twitterUrl">
              <Input
                id="twitterUrl"
                type="url"
                value={form.twitterUrl}
                onChange={(e) => set("twitterUrl", e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field label={t("linkedin")} htmlFor="linkedinUrl">
              <Input
                id="linkedinUrl"
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field label={t("website")} htmlFor="websiteUrl">
              <Input
                id="websiteUrl"
                type="url"
                value={form.websiteUrl}
                onChange={(e) => set("websiteUrl", e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <div className="flex items-end gap-3">
              <Switch
                checked={form.isFeatured}
                onCheckedChange={(v) => set("isFeatured", v)}
                disabled={isLoading}
                id="isFeatured"
              />
              <Label htmlFor="isFeatured">{t("isFeatured")}</Label>
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

function Field({
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
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
