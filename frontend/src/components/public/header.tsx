"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { UserMenu } from "@/components/public/user-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { useAppSelector } from "@/redux/store";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function PublicHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Home">
          <Wordmark height={52} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/courses" label={t("courses")} />
          <NavLink href="/instructors" label={t("instructors")} />
          <NavLink href="/pricing" label={t("pricing")} />
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          {user ? (
            <UserMenu user={user} t={t} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">{t("signUp")}</Link>
              </Button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={tCommon("menu")}
            className="grid size-9 place-items-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        <div className="flex h-full flex-col gap-4">
          <nav className="flex flex-col">
            <DrawerLink href="/courses" label={t("courses")} />
            <DrawerLink href="/instructors" label={t("instructors")} />
            <DrawerLink href="/pricing" label={t("pricing")} />
          </nav>
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
              {t("preferences")}
            </p>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
          {!user && (
            <div className="mt-auto flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/signup">{t("signUp")}</Link>
              </Button>
            </div>
          )}
        </div>
      </Sheet>
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

function DrawerLink({
  href,
  label,
}: {
  href: "/courses" | "/instructors" | "/pricing";
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
    >
      {label}
    </Link>
  );
}
