"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useAppSelector } from "@/redux/store";
import { LayoutDashboard, UserCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function PublicHeader() {
  const t = useTranslations("nav");
  const user = useAppSelector((s) => s.auth.user);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="Home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/courses" label={t("courses")} />
          <NavLink href="/instructors" label={t("instructors")} />
          <NavLink href="/pricing" label={t("pricing")} />
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin" className="gap-2">
                    <LayoutDashboard className="size-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link href="/account" className="gap-2">
                  <UserCircle2 className="size-4" />
                  <span className="hidden sm:inline">{t("account")}</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">{t("signUp")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
}: {
  href: "/courses" | "/instructors" | "/pricing";
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
    >
      {label}
    </Link>
  );
}
