"use client";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/public/user-menu";
import { Sheet } from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { useAppSelector } from "@/redux/store";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/courses", key: "courses", index: "01" },
  { href: "/instructors", key: "instructors", index: "02" },
  { href: "/pricing", key: "pricing", index: "03" },
] as const;

/**
 * Acid Ledger site header — flat ink bar with a 2px rule, chartreuse brand
 * tile, mono indexed nav links that highlight like a marker pen, and hard-
 * shadow auth buttons. No blur, no translucency: the bar is a solid ledger
 * strip pinned to the top of the stack.
 */
export function AcidHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--dxacid-line)] bg-[var(--background)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand lockup: chartreuse tile + stacked mono wordmark */}
        <Link href="/" aria-label="My Funded Academy" className="flex items-center gap-3">
          <span className="dxacid-brand-block" aria-hidden>
            M<span className="text-[0.6em]">↗</span>
          </span>
          <span
            className="hidden flex-col font-mono text-[10px] font-semibold uppercase leading-[1.5] tracking-[0.18em] sm:flex"
            aria-hidden
          >
            <span>My Funded</span>
            <span className="text-[var(--muted-foreground)]">Academy ©</span>
          </span>
        </Link>

        {/* Indexed nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.key} href={n.href} className="dxacid-navlink">
              <span className="dxacid-navlink-idx" aria-hidden>
                {n.index}
              </span>
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>

          {user ? (
            <UserMenu user={user} t={t} />
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="dxacid-btn-ghost inline-flex h-9 items-center px-4 text-xs"
              >
                {t("signIn")}
              </Link>
              <Link href="/signup" className="dxacid-btn inline-flex h-9 items-center px-4 text-xs">
                {t("signUp")}
              </Link>
            </div>
          )}

          {/* Mobile menu trigger: bordered square that clicks */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={tCommon("menu")}
            className="dxacid-hard dxacid-hard-int grid size-9 place-items-center text-[var(--foreground)] md:hidden"
          >
            <Menu className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        <div className="flex h-full flex-col gap-5">
          <nav className="flex flex-col border-2 border-[var(--dxacid-line)]">
            {NAV.map((n, i) => (
              <Link
                key={n.key}
                href={n.href}
                className={`flex items-baseline gap-3 px-4 py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-[var(--foreground)] hover:bg-[var(--dxacid-acid)] hover:text-[var(--dxacid-ink)] ${
                  i > 0 ? "border-t-2 border-[var(--dxacid-line)]" : ""
                }`}
              >
                <span className="text-[10px] text-[var(--dxacid-up)]" aria-hidden>
                  {n.index}
                </span>
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="border-2 border-[var(--dxacid-line)] p-3">
            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
              {t("preferences")}
            </p>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {!user && (
            <div className="mt-auto flex flex-col gap-4">
              <Link
                href="/login"
                className="dxacid-btn-ghost inline-flex h-11 w-full items-center justify-center text-xs"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/signup"
                className="dxacid-btn inline-flex h-11 w-full items-center justify-center text-xs"
              >
                {t("signUp")}
              </Link>
            </div>
          )}
        </div>
      </Sheet>
    </header>
  );
}
