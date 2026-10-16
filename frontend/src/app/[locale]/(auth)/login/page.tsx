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
import { PasswordInput } from "@/components/ui/password-input";
import { Link, useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { roleHome } from "@/lib/role-home";
import { useDemoLoginMutation, useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/store";
import { setUser } from "@/redux/authSlice";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Presentation, ShieldCheck } from "lucide-react";

type DemoRole = "student" | "instructor" | "admin";

const DEMO_ROLES: { role: DemoRole; icon: typeof GraduationCap }[] = [
  { role: "student", icon: GraduationCap },
  { role: "instructor", icon: Presentation },
  { role: "admin", icon: ShieldCheck },
];

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tDemo = useTranslations("auth.demo");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [demoLogin, { isLoading: demoLoading }] = useDemoLoginMutation();
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null);
  const isLoading = loginLoading || demoLoading;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const signIn = async (request: () => ReturnType<ReturnType<typeof login>["unwrap"]>) => {
    setError(null);
    try {
      const res = await request();
      if (res.data?.user && res.data.accessToken) {
        dispatch(setUser({ user: res.data.user, token: res.data.accessToken }));
        // Honor explicit ?next=, otherwise route by role.
        const next = searchParams.get("next");
        const target = next || roleHome(res.data.user.role);
        router.push(target as Parameters<typeof router.push>[0]);
      }
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void signIn(() => login({ email, password }).unwrap());
  };

  const onDemo = (role: DemoRole) => {
    setDemoRole(role);
    void signIn(() => demoLogin({ role }).unwrap());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <section
          aria-labelledby="demo-title"
          className="mb-6 rounded-xl border border-gold/50 bg-paper-2/60 p-4"
        >
          <h2 id="demo-title" className="font-display text-lg">
            {tDemo("title")}
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{tDemo("subtitle")}</p>
          <div className="mt-4 grid gap-2">
            {DEMO_ROLES.map(({ role, icon: Icon }) => (
              <Button
                key={role}
                type="button"
                variant={role === "student" ? "default" : "outline"}
                className="w-full justify-start gap-2"
                disabled={isLoading}
                onClick={() => onDemo(role)}
                data-testid={`demo-${role}`}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {demoLoading && demoRole === role ? t("submitting") : tDemo(role)}
              </Button>
            ))}
          </div>
        </section>
        <div className="mb-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {tDemo("or")}
          <span className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
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
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {t("forgot")}
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {loginLoading ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <span>
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-primary hover:underline">
            {t("signUpLink")}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
