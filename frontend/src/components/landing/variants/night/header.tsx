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

type NavHref = "/courses" | "/instructors" | "/pricing";

/**
 * The Night Edition masthead — the paper's nameplate as a sticky header.
 * A mono edition micro-strip up top, a typographic serif lockup (no teal SVG
 * logo in this identity), kicker nav separated by vermilion interpuncts, and
 * a Scotch rule closing the bar. Solid paper background; print never frosts.
 */
export function NightHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="dxnight-masthead-bar sticky top-0 z-40">
      {/* Edition micro-strip — language-neutral dateline marks */}
      <div className="hidden border-b border-[var(--border)] sm:block">
        <div
          aria-hidden
          className="dxnight-masthead mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[var(--muted-foreground)]"
        >
          <span>MFA — EST. 2026</span>
          <span>№ 001 · 24H</span>
          <span>EN / AR</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Typographic brand lockup */}
        <Link
          href="/"
          aria-label="My Funded Academy"
          className="flex min-w-0 flex-col leading-none"
        >
          <span className="dxnight-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
            № 001
          </span>
          <span className="dxnight-headline font-display mt-1 truncate text-xl sm:text-2xl">
            My Funded Academy
          </span>
        </Link>

        <nav className="hidden items-center md:flex">
          <MastNavLink href="/courses" label={t("courses")} />
          <Interpunct />
          <MastNavLink href="/instructors" label={t("instructors")} />
          <Interpunct />
          <MastNavLink href="/pricing" label={t("pricing")} />
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="hidden items-center gap-2 md:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          {user ? (
            <UserMenu user={user} t={t} />
          ) : (
            <div className="hidden items-center gap-2.5 md:flex">
              <MastNavLink href="/login" label={t("signIn")} />
              <Link
                href="/signup"
                className="dxnight-btn-paper dxnight-kicker inline-flex h-9 items-center px-4"
              >
                {t("signUp")}
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={tCommon("menu")}
            className="grid size-9 place-items-center border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* Scotch rule closes the masthead */}
      <div className="dxnight-rule text-[var(--foreground)]" aria-hidden />

      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        <div className="flex h-full flex-col gap-6">
          <nav className="flex flex-col">
            <DrawerLink href="/courses" index="01" label={t("courses")} />
            <DrawerLink href="/instructors" index="02" label={t("instructors")} />
            <DrawerLink href="/pricing" index="03" label={t("pricing")} />
          </nav>
          <div className="dxnight-frame p-4">
            <p className="dxnight-kicker mb-3 text-[var(--muted-foreground)]">{t("preferences")}</p>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
          {!user && (
            <div className="mt-auto flex flex-col gap-2.5">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center border border-[var(--border)] text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/signup"
                className="dxnight-btn-paper inline-flex h-11 items-center justify-center text-sm font-medium"
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

function Interpunct() {
  return (
    <span aria-hidden className="px-1 text-[var(--accent)]">
      ·
    </span>
  );
}

function MastNavLink({ href, label }: { href: NavHref | "/login"; label: string }) {
  return (
    <Link
      href={href}
      className="dxnight-kicker dxnight-underline px-1.5 py-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
    >
      {label}
    </Link>
  );
}

function DrawerLink({ href, index, label }: { href: NavHref; index: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-baseline gap-3 border-b border-[var(--border)] py-3.5"
    >
      <span className="dxnight-mono text-[10px] text-[var(--accent)]">{index}</span>
      <span className="font-display text-lg text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
        {label}
      </span>
    </Link>
  );
}
