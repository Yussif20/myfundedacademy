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
  { href: "/courses", key: "courses" },
  { href: "/instructors", key: "instructors" },
  { href: "/pricing", key: "pricing" },
] as const;

/** Typographic brand lockup — aberrated monogram over a letterspaced mono line. */
function Brandmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="dxholo-aberration font-display text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">
        MFA
      </span>
      <span className="dxholo-num mt-1 text-[8px] uppercase tracking-[0.34em] text-[var(--muted-foreground)]">
        My&nbsp;Funded&nbsp;Academy
      </span>
    </span>
  );
}

/** Holographic Obsidian site header — obsidian slab with a prism horizon rule. */
export function HoloHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="dxholo-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Home" className="shrink-0">
          <Brandmark />
        </Link>

        <nav className="hidden items-center md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="dxholo-navlink px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              {t(item.key)}
            </Link>
          ))}
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
              <Link
                href="/login"
                className="rounded-[6px] px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center rounded-[6px] bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
              >
                {t("signUp")}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={tCommon("menu")}
            className="grid size-9 place-items-center rounded-[6px] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* The horizon rule — a faded spectrum hairline instead of a flat border */}
      <div aria-hidden className="dxholo-divider" />

      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        <div className="flex h-full flex-col gap-5">
          <nav className="flex flex-col">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 border-b border-[var(--border)] px-2 py-3.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
              >
                <span className="dxholo-num text-[11px] text-[var(--muted-foreground)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="rounded-[8px] border border-[var(--border)] p-3">
            <p className="dxholo-eyebrow mb-3">{t("preferences")}</p>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {!user && (
            <div className="mt-auto flex flex-col gap-2">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[var(--border)] text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
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
