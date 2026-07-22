"use client";

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

import { BurnBrand } from "./brand";

const NAV = [
  { href: "/courses", key: "courses" },
  { href: "/instructors", key: "instructors" },
  { href: "/pricing", key: "pricing" },
] as const;

/**
 * Controlled Burn site header — a trading-desk console bar.
 * Plum glass over the page, ember hairline as its bottom edge, seam
 * underlines on nav links, tape-chip brand mark. Sticky, z-40.
 */
export function BurnHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-[color-mix(in_oklch,var(--background)_86%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <BurnBrand />

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="dxburn-navlink py-1 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-1.5 md:flex">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            {user ? (
              <UserMenu user={user} t={t} />
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <Link href="/login">{t("signIn")}</Link>
                </Button>
                <Button asChild size="sm" className="rounded-[8px]">
                  <Link href="/signup">{t("signUp")}</Link>
                </Button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={tCommon("menu")}
              className="grid size-9 place-items-center rounded-[2px] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* The 1px ember hairline separating the console from the page */}
      <div aria-hidden className="dxburn-hairline" />

      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        <div className="flex h-full flex-col gap-5">
          <nav className="flex flex-col">
            {NAV.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 border-b border-[var(--border)] px-2 py-3.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
              >
                <span className="dxburn-micro text-[var(--primary)]" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="rounded-[2px] border border-[var(--border)] p-3">
            <p className="dxburn-micro mb-3 text-[var(--muted-foreground)]">{t("preferences")}</p>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {!user && (
            <div className="mt-auto flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full rounded-[8px]">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button asChild className="dxburn-cta w-full rounded-[8px]">
                <Link href="/signup">{t("signUp")}</Link>
              </Button>
            </div>
          )}
        </div>
      </Sheet>
    </header>
  );
}
