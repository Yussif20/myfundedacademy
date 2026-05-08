"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useCreateUserMutation, type UserRole } from "@/redux/api/usersApi";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function NewUserPage() {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [create, { isLoading }] = useCreateUserMutation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ADMIN" as UserRole,
    country: "",
    bio: "",
    preferredLocale: "en" as "en" | "ar",
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
        role: form.role,
        country: form.country || undefined,
        bio: form.bio || undefined,
        preferredLocale: form.preferredLocale,
      }).unwrap();
      router.push("/admin/users");
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("newTitle")}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{t("newSubtitle")}</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklch,var(--accent)_30%,transparent)] bg-[color-mix(in_oklch,var(--accent)_10%,transparent)] px-3 py-1 text-xs font-medium text-[var(--accent)] sm:inline-flex">
          <ShieldCheck className="size-3" />
          {t("adminPrivilegeNote")}
        </span>
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

            <Field label={t("role.label")} htmlFor="role" hint={t("roleHelp")}>
              <Select
                id="role"
                value={form.role}
                onChange={(e) => set("role", e.target.value as UserRole)}
                disabled={isLoading}
              >
                <option value="ADMIN">{t("role.ADMIN")}</option>
                <option value="STUDENT">{t("role.STUDENT")}</option>
              </Select>
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

            <Field label={t("bio")} htmlFor="bio" wide>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </Field>

            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? tCommon("loading") : tCommon("create")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/admin/users")}
                disabled={isLoading}
              >
                {tCommon("cancel")}
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
      {hint && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
    </div>
  );
}
