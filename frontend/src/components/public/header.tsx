"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { UserMenu } from "@/components/public/user-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { useAppSelector } from "@/redux/store";
import { IndexNumber } from "@/components/ui/index-number";
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
    <header className="sticky top-0 z-30 border-b border-border bg-background/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" aria-label="Home">
          <Wordmark height={40} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
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
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-paper-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        <div className="flex h-full flex-col gap-4">
          <nav className="flex flex-col divide-y divide-border border-y border-border">
            <DrawerLink n={1} href="/courses" label={t("courses")} />
            <DrawerLink n={2} href="/instructors" label={t("instructors")} />
            <DrawerLink n={3} href="/pricing" label={t("pricing")} />
          </nav>
          <div className="rounded-lg border border-border p-3">
            <p className="eyebrow mb-2">{t("preferences")}</p>
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
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 rtl:after:origin-right"
    >
      {label}
    </Link>
  );
}

function DrawerLink({
  n,
  href,
  label,
}: {
  n: number;
  href: "/courses" | "/instructors" | "/pricing";
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-baseline gap-4 px-1 py-4 font-display text-xl text-foreground transition-colors hover:text-primary"
    >
      <IndexNumber n={n} className="text-sm" />
      {label}
    </Link>
  );
}
