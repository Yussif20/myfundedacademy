"use client";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet } from "@/components/ui/sheet";
import { UserMenu } from "@/components/public/user-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { useAppSelector } from "@/redux/store";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { BrandLockup } from "./ornaments";

type NavHref = "/courses" | "/instructors" | "/pricing";

const NAV: ReadonlyArray<{ href: NavHref; key: "courses" | "instructors" | "pricing" }> = [
  { href: "/courses", key: "courses" },
  { href: "/instructors", key: "instructors" },
  { href: "/pricing", key: "pricing" },
];

/**
 * "The Ledger Club" masthead — a certificate letterhead as a sticky header:
 * MFA monogram plate lockup, small-caps nav with dotted gold underlines, and
 * a double-rule bottom edge. Full parity with the shared public header.
 */
export function LedgerHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="dxledger-header z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <BrandLockup />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="dxledger-navlink dxledger-smallcaps py-2 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
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
                className="dxledger-navlink dxledger-smallcaps py-2 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/signup"
                className="dxledger-btn-foil inline-flex h-9 items-center justify-center px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {t("signUp")}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={tCommon("menu")}
            className="grid size-9 place-items-center rounded-[2px] border border-transparent text-[var(--muted-foreground)] transition-colors hover:border-[var(--dxledger-gold-mid)] hover:text-[var(--dxledger-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        <div className="flex h-full flex-col gap-5">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="dxledger-row dxledger-smallcaps px-2 py-3.5 text-xs text-[var(--foreground)]"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="dxledger-frame p-4">
            <p className="dxledger-smallcaps mb-3 text-[10px] text-[var(--dxledger-gold)]">
              {t("preferences")}
            </p>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {!user && (
            <div className="mt-auto flex flex-col gap-2.5">
              <Link
                href="/login"
                className="dxledger-btn-ghost dxledger-smallcaps inline-flex h-11 w-full items-center justify-center text-xs"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/signup"
                className="dxledger-btn-foil inline-flex h-11 w-full items-center justify-center"
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
