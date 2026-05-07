"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/store";
import { setUser } from "@/redux/authSlice";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ email, password }).unwrap();
      if (res.data?.user && res.data.accessToken) {
        dispatch(setUser({ user: res.data.user, token: res.data.accessToken }));
        router.push("/account");
      }
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)]"
              >
                {t("forgot")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-[var(--muted-foreground)]">
        <span>
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-[var(--primary)] hover:underline">
            {t("signUpLink")}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
