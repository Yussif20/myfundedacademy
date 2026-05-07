"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/errors";
import { useResendVerificationMutation } from "@/redux/api/authApi";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CheckEmailPage() {
  const t = useTranslations("auth");
  const params = useSearchParams();
  const initialEmail = params.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resend, { isLoading }] = useResendVerificationMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await resend({ email }).unwrap();
      setDone(true);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
          <Mail className="size-6" />
        </div>
        <CardTitle className="mt-2">{t("checkEmail.title")}</CardTitle>
        <CardDescription>{t("checkEmail.body")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("login.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || done}
            />
          </div>
          {done && (
            <p className="rounded-md bg-[var(--primary)]/10 px-3 py-2 text-sm text-[var(--primary)]">
              {t("resend.done")}
            </p>
          )}
          {error && (
            <p className="rounded-md bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
              {error}
            </p>
          )}
          {!done && (
            <Button type="submit" className="w-full" disabled={isLoading || !email}>
              {isLoading ? t("resend.submitting") : t("checkEmail.resend")}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
